import { ErrorHelper } from "../errors/ErrorHelper";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { data2arraybuffer } from "../helpers/dataURI";
import { tscript_audio } from "./lib-audio.tscript";

export const lib_audio = {
	source: tscript_audio,
	impl: {
		audio: {
			Sound: {
				constructor: function (object, buffers, sampleRate) {
					if (
						TScript.isDerivedFrom(buffers.type, Typeid.typeid_array)
					) {
						// explicit arrays
						if (
							!TScript.isDerivedFrom(
								sampleRate.type,
								Typeid.typeid_integer
							)
						)
							ErrorHelper.error(
								"/argument-mismatch/am-1",
								[
									"sampleRate",
									"audio.Sound.constructor",
									"integer",
									TScript.displayname(sampleRate.type),
								],
								this.stack
							);

						checkAudioBufferCorrectness.call(this, buffers);

						if (!hasAudioContext.call(this)) return;
						let buf;
						try {
							if (
								sampleRate.value.b < 8000 ||
								sampleRate.value.b > 96000
							)
								throw 1;
							buf = this.service.audioContext.createBuffer(
								buffers.value.b.length,
								buffers.value.b[0].value.b.length,
								sampleRate.value.b
							);
						} catch (ex) {
							ErrorHelper.error(
								"/argument-mismatch/am-44b",
								[],
								this.stack
							);
						}

						for (let ch = 0; ch < buffers.value.b.length; ch++) {
							fillAudioBuffer(
								buffers.value.b[ch],
								buf.getChannelData(ch)
							);
						}
						object.value.b = { buffer: buf, soundloop: null };
					} else if (
						TScript.isDerivedFrom(
							buffers.type,
							Typeid.typeid_string
						)
					) {
						// sound resource as a data URI
						if (!hasAudioContext.call(this)) return;

						try {
							let [buffer, mime] = data2arraybuffer(
								buffers.value.b
							);
							object.value.b = { buffer: null, soundloop: null };
							if (mime.substring(0, 6) != "audio/")
								ErrorHelper.error(
									"/argument-mismatch/am-46",
									[],
									this.stack
								);
							this.service.audioContext.decodeAudioData(
								buffer,
								(decoded) => {
									object.value.b = {
										buffer: decoded,
										soundloop: null,
									};
								}
							);
						} catch (ex) {
							ErrorHelper.error(
								"/argument-mismatch/am-46",
								[],
								this.stack
							);
						}
					} else
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"buffer",
								"audio.Sound.constructor",
								"array or string",
								TScript.displayname(buffers.type),
							],
							this.stack
						);
				},

				play: function (object) {
					if (hasAudioContext.call(this) && object.value.b) {
						// handle asynchronous buffer creation
						let context = this.service.audioContext;
						let doit = function () {
							if (object.value.b.buffer) {
								let sourceNode = context.createBufferSource();
								sourceNode.buffer = object.value.b.buffer;
								sourceNode.connect(context.destination);
								sourceNode.start();
							} else window.setTimeout(doit, 5);
						};
						doit();
					}
					return {
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					};
				},
				startLoop: function (object) {
					if (
						hasAudioContext.call(this) &&
						object.value.b &&
						!object.value.b.soundloop
					) {
						let context = this.service.audioContext;
						let doit = function () {
							if (object.value.b.buffer) {
								let sourceNode = context.createBufferSource();
								sourceNode.buffer = object.value.b.buffer;
								sourceNode.connect(context.destination);
								sourceNode.loop = true;
								sourceNode.start();
								object.value.b.soundloop = sourceNode;
							} else window.setTimeout(doit, 5);
						};
						doit();
					}
					return {
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					};
				},
				stopLoop: function (object) {
					if (
						hasAudioContext.call(this) &&
						object.value.b &&
						object.value.b.soundloop
					) {
						object.value.b.soundloop.stop();
						object.value.b.soundloop = null;
					}
					return {
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					};
				},
				looping: function (object) {
					let b =
						hasAudioContext.call(this) &&
						object.value.b &&
						object.value.b.soundloop;
					return {
						type: this.program.types[Typeid.typeid_boolean],
						value: { b: b },
					};
				},
			},
		},
	},
};

// Move data from a TScript array of integers or reals into a Float32 array.
// Return true in case of success, and false if the array contains invalid data.
let fillAudioBuffer = function (tscriptBuffer, array) {
	function clamp(v, min, max) {
		return v > max ? max : v < min ? min : v;
	}

	for (let i = 0; i < array.length; i++) {
		//clip sample to [-1,1]
		array[i] = clamp(tscriptBuffer.value.b[i].value.b, -1, 1);
	}
};

// Throw an error if the buffer contains invalid data.
let checkAudioBufferCorrectness = function (tscriptBuffers) {
	if (tscriptBuffers.value.b.length < 1)
		ErrorHelper.error("/argument-mismatch/am-44c", [], this.stack);
	let len = null;
	for (let c = 0; c < tscriptBuffers.value.b.length; c++) {
		let sub = tscriptBuffers.value.b[c];
		if (!TScript.isDerivedFrom(sub.type, Typeid.typeid_array))
			ErrorHelper.error(
				"/argument-mismatch/am-1",
				[
					"buffer",
					"audio.Sound.constructor",
					"array",
					TScript.displayname(sub.type),
				],
				this.stack
			);
		if (len === null) len = sub.value.b.length;
		else if (len !== sub.value.b.length)
			ErrorHelper.error("/argument-mismatch/am-44", [], this.stack);

		for (let i = 0; i < sub.value.b.length; i++) {
			if (
				!TScript.isDerivedFrom(
					sub.value.b[i].type,
					Typeid.typeid_integer
				) &&
				!TScript.isDerivedFrom(sub.value.b[i].type, Typeid.typeid_real)
			)
				ErrorHelper.error(
					"/argument-mismatch/am-1",
					[
						"buffers[" + c + "][" + i + "]",
						"audio.Sound.constructor",
						"numeric argument",
						TScript.displayname(sub.value.b[i].type),
					],
					this.stack
				);
		}
	}
};

// Check for a valid audio context. Return true in case of a valid context, otherwise false.
function hasAudioContext() {
	if (typeof this.service.audioContext === "undefined") return false;
	if (this.service.audioContext === null) return false;
	return true;
}
