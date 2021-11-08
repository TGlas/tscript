import { ErrorHelper } from "../errors/ErrorHelper";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { tscript_audio } from "./lib-audio.tscript";

export const lib_audio = {
	source: tscript_audio,
	impl: {
		audio: {
			MonoAudio: {
				constructor: function (object, buffer, sampleRate) {
					if (
						!TScript.isDerivedFrom(buffer.type, Typeid.typeid_array)
					)
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"buffer",
								"audio.MonoAudio.constructor",
								"array",
								TScript.displayname(buffer.type),
							],
							this.stack
						);

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
								"audio.MonoAudio.constructor",
								"integer",
								TScript.displayname(sampleRate.type),
							],
							this.stack
						);

					checkAudioBufferCorrectness.call(
						this,
						buffer,
						"MonoAudio",
						"buffer"
					);

					if (!hasAudioContext.call(this)) return;
					let buf = this.service.audioContext.createBuffer(
						1,
						buffer.value.b.length,
						sampleRate.value.b
					);

					fillAudioBuffer(buffer, buf.getChannelData(0));
					object.value.b = { buffer: buf, soundloop: null };
				},

				play: function (object) {
					if (hasAudioContext.call(this) && object.value.b) {
						let sourceNode =
							this.service.audioContext.createBufferSource();
						sourceNode.buffer = object.value.b.buffer;
						sourceNode.connect(
							this.service.audioContext.destination
						);
						sourceNode.start();
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
						let sourceNode =
							this.service.audioContext.createBufferSource();
						sourceNode.buffer = object.value.b.buffer;
						sourceNode.connect(
							this.service.audioContext.destination
						);
						sourceNode.loop = true;
						sourceNode.start();

						object.value.b.soundloop = sourceNode;
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
			StereoAudio: {
				constructor: function (
					object,
					leftBuffer,
					rightBuffer,
					sampleRate
				) {
					if (
						!TScript.isDerivedFrom(
							leftBuffer.type,
							Typeid.typeid_array
						)
					)
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"leftBuffer",
								"audio.StereoAudio.constructor",
								"array",
								TScript.displayname(leftBuffer.type),
							],
							this.stack
						);
					if (
						!TScript.isDerivedFrom(
							rightBuffer.type,
							Typeid.typeid_array
						)
					)
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"rightBuffer",
								"audio.StereoAudio.constructor",
								"array",
								TScript.displayname(rightBuffer.type),
							],
							this.stack
						);

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
								"audio.StereoAudio.constructor",
								"integer",
								TScript.displayname(sampleRate.type),
							],
							this.stack
						);

					if (leftBuffer.value.b.length != rightBuffer.value.b.length)
						ErrorHelper.error(
							"/argument-mismatch/am-44",
							[],
							this.stack
						);

					checkAudioBufferCorrectness.call(
						this,
						leftBuffer,
						"StereoAudio",
						"leftBuffer"
					);
					checkAudioBufferCorrectness.call(
						this,
						rightBuffer,
						"StereoAudio",
						"rightBuffer"
					);

					if (!hasAudioContext.call(this)) {
						object.value.b = null;
						return;
					}

					let buf = this.service.audioContext.createBuffer(
						2,
						leftBuffer.value.b.length,
						sampleRate.value.b
					);

					fillAudioBuffer(leftBuffer, buf.getChannelData(0));
					fillAudioBuffer(rightBuffer, buf.getChannelData(1));
					object.value.b = { buffer: buf, soundloop: null };
				},

				play: function (object) {
					if (hasAudioContext.call(this) && object.value.b) {
						let sourceNode =
							this.service.audioContext.createBufferSource();
						sourceNode.buffer = object.value.b.buffer;
						sourceNode.connect(
							this.service.audioContext.destination
						);
						sourceNode.start();
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
						let sourceNode =
							this.service.audioContext.createBufferSource();
						sourceNode.buffer = object.value.b.buffer;
						sourceNode.connect(
							this.service.audioContext.destination
						);
						sourceNode.loop = true;
						sourceNode.start();

						object.value.b.soundloop = sourceNode;
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
// Return true of success, and false if the array contains invalid data.
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
let checkAudioBufferCorrectness = function (
	tscriptBuffer,
	className,
	argumentName
) {
	for (let i = 0; i < tscriptBuffer.value.b.length; i++) {
		if (
			!TScript.isDerivedFrom(
				tscriptBuffer.value.b[i].type,
				Typeid.typeid_integer
			) &&
			!TScript.isDerivedFrom(
				tscriptBuffer.value.b[i].type,
				Typeid.typeid_real
			)
		)
			ErrorHelper.error(
				"/argument-mismatch/am-1",
				[
					argumentName + "[" + i + "]",
					"audio." + className + ".constructor",
					"numeric argument",
					TScript.displayname(tscriptBuffer.value.b[i].type),
				],
				this.stack
			);
	}
};

// Check for a valid audio context. Return true in case of a valid context, otherwise false.
function hasAudioContext() {
	if (typeof this.service.audioContext === "undefined") return false;
	if (this.service.audioContext === null) return false;
	return true;
}
