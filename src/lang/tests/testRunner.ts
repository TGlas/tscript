import { ErrorHelper } from "../errors/ErrorHelper";
import { Typeid } from "../helpers/typeIds";
import { createDefaultServices } from "../interpreter/defaultService";
import { Interpreter } from "../interpreter/interpreter";
import { parseProgramFromString, ParseResult } from "../parser";
import { TScript } from "..";
import { TscriptTest } from "./tests";

interface Callback {
	suc: (test: TscriptTest) => any;
	fail: (test: TscriptTest, ex: any) => any;
}

const sleep = (milliseconds) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr) && typeof obj[attr] === "object") {
			if (obj[attr] instanceof Map) {
				copy[attr] = obj[attr];
			} else {
				copy[attr] = clone(obj[attr]);
			}
		} else {
			copy[attr] = obj[attr];
		}
	}
	return copy;
}

export class TestRunner {
	public static async runTest(
		test: TscriptTest,
		cb: Callback,
		isBrowser
	): Promise<void> {
		let timeout: number = test.timeout ? test.timeout : 10;
		let input = test.input ? test.input : [];
		let events = test.events ? test.events : [];

		if (
			(isBrowser === false && test.browserOnly) ||
			(typeof document === "undefined" &&
				(test.expectation as any).type === "turtle") ||
			(test.expectation as any).type === "canvas"
		) {
			cb.suc(test);
			return;
		}

		// record of events
		let result = new Array();

		// parse the program
		let parsed = parseProgramFromString(test.code);

		if (test.parseOnly) {
			// report result and return
			if (parsed.errors.length === 0) {
				cb.suc(test);
			} else {
				const msgs = parsed.errors.map((err) => {
					return ErrorHelper.getLocatedErrorMsg(
						err.type,
						err.filename ?? undefined,
						err.line,
						err.message
					);
				});
				cb.fail(test, msgs.join("\n"));
			}
			return;
		}

		if (TestRunner.checkParseErrorsMatch(test, parsed, cb)) {
			return;
		}

		// create the service to run against
		let service: any = clone(createDefaultServices());

		service.documentation_mode = false;
		service.print = function (msg) {
			result.push({ type: "print", message: msg });
		};
		service.alert = function (msg) {
			return new Promise((resolve, reject) => {
				result.push({ type: "alert", message: msg });
				resolve(null);
			});
		};
		service.confirm = function (msg) {
			return new Promise((resolve, reject) => {
				result.push({ type: "confirm", message: msg });
				let b = input.shift();
				ErrorHelper.assert(
					b === true || b === false,
					"simulated user input is not a boolean"
				);
				resolve(b);
			});
		};
		service.prompt = function (msg) {
			return new Promise((resolve, reject) => {
				result.push({ type: "prompt", message: msg });
				let s = input.shift();
				ErrorHelper.assert(
					typeof s == "string",
					"simulated user input is not a string"
				);
				resolve(s);
			});
		};
		service.message = function (msg, filename, line, ch, href) {
			result.push({ type: "error", href: href });
		};
		service.turtle.dom =
			typeof document !== "undefined"
				? document.createElement("canvas")
				: {};
		service.canvas.dom =
			typeof document !== "undefined"
				? document.createElement("canvas")
				: { width: 0, height: 0 };

		if (typeof document !== "undefined") {
			let s: any = service;
			s.canvas.dom.width = 600;
			s.canvas.dom.height = 600;
			s.turtle.dom.height = 600;
			s.turtle.dom.width = 600;
		}

		let interpreter = new Interpreter(parsed.program!, service);
		interpreter.eventnames["canvas.resize"] = true;
		interpreter.eventnames["canvas.mousedown"] = true;
		interpreter.eventnames["canvas.mouseup"] = true;
		interpreter.eventnames["canvas.mousemove"] = true;
		interpreter.eventnames["canvas.mouseout"] = true;
		interpreter.eventnames["canvas.keydown"] = true;
		interpreter.eventnames["canvas.keyup"] = true;
		interpreter.eventnames["timer"] = true;
		interpreter.reset();

		let timeLimit = Date.now() + 1000 * timeout;
		interpreter.run();

		while (Date.now() < timeLimit) {
			if (
				interpreter.status == "finished" ||
				interpreter.status == "error"
			) {
				// the program has finished
				result.push(interpreter.status);
				interpreter.stopthread();
				TestRunner.check(test, result, cb, interpreter);
				return;
			} else if (
				interpreter.status == "running" ||
				interpreter.status == "waiting"
			) {
				if (interpreter.eventmode && events.length > 0) {
					// construct an event object from a json description
					let desc: any = events.shift();
					let eventname = desc["name"];
					let typename = desc["type"];
					let type: any = null;
					for (let i = 0; i < interpreter.program.types.length; i++) {
						if (
							TScript.displayname(interpreter.program.types[i]) ==
							typename
						) {
							type = interpreter.program.types[i];
							break;
						}
					}
					if (type === null) {
						interpreter.stopthread();
						cb.fail(test, "unknown event type " + typename);
						return;
					}
					let attr = new Array();
					let n = type.members.length;
					for (let i = 0; i < n; i++)
						attr.push({
							type: interpreter.program.types[Typeid.typeid_null],
							value: { b: null },
						});
					for (let key in desc.attr) {
						if (!desc.attr.hasOwnProperty(key)) continue;
						if (!type.members.hasOwnProperty(key)) {
							interpreter.stopthread();
							cb.fail(
								test,
								"unknown event attribute" + typename + "." + key
							);
							return;
						}
						let m = type.members[key];
						if (m.petype != "attribute") {
							interpreter.stopthread();
							cb.fail(
								test,
								"unknown event attribute" + typename + "." + key
							);
							return;
						}
						attr[m.id] = TScript.json2typed.call(
							interpreter,
							desc.attr[key]
						);
					}
					let event = { type: type, value: { a: attr, b: null } };

					// enqueue an event
					interpreter.enqueueEvent(eventname, event);
				}
			}
			await sleep(100);
		}

		// timeout!
		interpreter.stopthread();
		cb.fail(test, "timeout");
	}

	// returns true if the program had parse errors
	private static checkParseErrorsMatch(
		test: TscriptTest,
		parsed: ParseResult,
		cb: Callback
	): boolean {
		if (parsed.errors !== null && parsed.errors.length > 0) {
			let errors = new Array();
			for (let i = 0; i < parsed.errors.length; i++) {
				let err = parsed.errors[i];
				if (err.type === "error")
					errors.push({ type: "error", href: err.href });
			}
			errors.push("parsing failed");
			TestRunner.check(test, errors, cb);
			return true;
		} else {
			return false;
		}
	}

	private static check(
		test: TscriptTest,
		result,
		cb: Callback,
		interpreter: any = undefined
	) {
		switch ((test.expectation as any).type) {
			case "turtle":
				TestRunner.checkTurtle(test, result, interpreter, cb);
				break;
			case "canvas":
				TestRunner.checkCanvas(test, result, interpreter, cb);
				break;
			default:
				TestRunner.checkNormal(test, result, cb);
				break;
		}
	}
	static checkTurtle(
		test: TscriptTest,
		result: any,
		interpreter: any,
		cb: Callback
	) {
		if (!interpreter) {
			cb.fail(test, "No interpreter supplied");
			return;
		}

		// test turtle graphics output
		let canvas = document.createElement("canvas");
		canvas.width = 600;
		canvas.height = 600;
		let context: any = canvas.getContext("2d");
		{
			let run = function run(code) {
				eval(code);
			};
			run((test.expectation as any).js);
		}
		let pix1 = context.getImageData(0, 0, 600, 600).data;
		let pix2 = interpreter.service.turtle.dom
			.getContext("2d")
			.getImageData(0, 0, 600, 600).data;
		if (pix1.length != pix2.length)
			cb.fail(test, "incompatible canvas size");
		for (let i = 0; i < pix1.length; i++) {
			if (Math.abs(pix1[i] - pix2[i]) > 10) {
				cb.fail(test, [
					"canvas",
					interpreter.service.turtle.dom,
					canvas,
				]);
				return;
			}
		}
		cb.suc(test);
	}

	static checkCanvas(
		test: TscriptTest,
		result: any,
		interpreter: any,
		cb: Callback
	) {
		if (!interpreter) {
			cb.fail(test, "No interpreter supplied");
			return;
		}

		// test canvas graphics output
		let canvas = document.createElement("canvas");
		canvas.width = 600;
		canvas.height = 600;
		let context: any = canvas.getContext("2d");
		{
			let run = function run(code) {
				eval(code);
			};
			run((test.expectation as any).js);
		}
		let pix1 = context.getImageData(0, 0, 600, 600).data;
		let pix2 = interpreter.service.canvas.dom
			.getContext("2d")
			.getImageData(0, 0, 600, 600).data;
		if (pix1.length != pix2.length)
			cb.fail(test, "incompatible canvas size");
		for (let i = 0; i < pix1.length; i++) {
			if (Math.abs(pix1[i] - pix2[i]) > 10) {
				cb.fail(test, [
					"camvas",
					interpreter.service.canvas.dom,
					canvas,
				]);
				return;
			}
		}
		cb.suc(test);
	}

	static checkNormal(test: TscriptTest, result: any, cb: Callback) {
		// test for a sequence of events
		let sr = JSON.stringify(result, null, 2);
		let se = JSON.stringify(test.expectation, null, 2);
		if (sr === se) {
			cb.suc(test);
		} else {
			cb.fail(test, [sr, se]);
		}
	}
}
