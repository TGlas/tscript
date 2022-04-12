"use strict";

import { Typeid } from "../lang/helpers/typeIds";
import { TScript } from "../lang";
import { Parser } from "../lang/parser";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";
import { escapeHtmlChars } from "../escape";

//
// The functions in this module allow running and monitoring the runtime
// behavior of TScript code. This is particularly useful for testing
// submissions to programming tasks for correctness. The module supports
// comparing to a reference solution and running various types of unit
// tests.
//

export const evaluation = (function () {
	let module: any = {};

	function isObject(x) {
		return typeof x === "object" && x !== null;
	}

	// Return a number if the string can be parsed into one; otherwise return null
	function strAsNumber(s) {
		s = String(s);
		let pos = 0,
			size = s.length;
		if (size == 0) return null;
		if (s[pos] == "-") pos++;
		if (s[pos] < "0" || s[pos] > "9") return null;
		while (pos < size && s[pos] >= "0" && s[pos] <= "9") pos++;
		if (pos < size) {
			if (s[pos] == ".") {
				// parse fractional part
				pos++;
				if (pos == size || s[pos] < "0" || s[pos] > "9") return null;
				while (pos < size && s[pos] >= "0" && s[pos] <= "9") pos++;
			}
			if (s[pos] == "e" || s[pos] == "E") {
				// parse exponent
				pos++;
				if (s[pos] == "+" || s[pos] == "-") pos++;
				if (s[pos] < "0" || s[pos] > "9") return null;
				while (pos < size && s[pos] >= "0" && s[pos] <= "9") pos++;
			}
		}
		if (pos < size) return null; // critical difference compared with parseFloat: do not accept trailing characters!
		return parseFloat(s);
	}

	// Compare two events.
	// The function returns an error message, or the empty string in case of equality.
	function compare_events(submission, solution) {
		if (Array.isArray(submission)) {
			if (!Array.isArray(solution))
				return "internal error: unexpected data type in compare_events";
			if (submission.length != solution.length)
				return (
					"Wrong array size - expected " +
					solution.length +
					" - obtained " +
					submission.length
				);
			for (let i = 0; i < submission.length; i++) {
				let result = compare_events(submission[i], solution[i]);
				if (result != "") return result;
			}
			return "";
		} else if (isObject(submission)) {
			if (!isObject(solution))
				return "internal error: unexpected data type in compare_events";
			if (
				submission.hasOwnProperty("type") &&
				solution.hasOwnProperty("type") &&
				submission.type != solution.type
			)
				return (
					"Wrong result data type - expected: " +
					solution.type +
					" - obtained: " +
					submission.type
				);
			if (submission.type == "print" || submission.type == "alert") {
				// comparison of print/alert messages
				if (submission.value != solution.value)
					return (
						"Wrong message in " +
						submission.type +
						" command - expected: " +
						solution.value +
						" - obtained: " +
						submission.value
					);
			} else if (submission.type == "turtle line") {
				// comparison of turtle lines, ignoring orientation
				let a = compare_events(submission.from, solution.from);
				let b = compare_events(submission.to, solution.to);
				let c = compare_events(submission.to, solution.from);
				let d = compare_events(submission.from, solution.to);
				if ((a != "" || b != "") && (c != "" || d != ""))
					return a != "" ? a : b;
			} else {
				// generic comparison
				for (let p in submission) {
					if (!submission.hasOwnProperty(p)) continue;

					if (p == "type") continue;
					//					if (
					//						p == "color" &&
					//						submission.hasOwnProperty("type") &&
					//						submission.type == "turtle line"
					//					)
					//						continue;

					let result = compare_events(submission[p], solution[p]);
					if (result != "") return result;
				}
			}
			return "";
		} else if (
			typeof submission == "string" ||
			typeof submission == "number"
		) {
			let sub = strAsNumber(submission);
			let sol = strAsNumber(solution);
			if (sub === null || sol === null) {
				if (submission != solution)
					return (
						"Wrong value - expected: " +
						solution +
						" - obtained: " +
						submission
					);
			} else {
				let close =
					Math.abs(sub - sol) < 1e-4 ||
					Math.abs(sub / sol - 1) < 1e-4;
				if (!close)
					return (
						"Wrong number - expected: " +
						solution +
						" - obtained: " +
						submission
					);
			}
			return "";
		} else {
			if (submission != solution)
				return (
					"Wrong value - expected: " +
					solution +
					" - obtained: " +
					submission
				);
			return "";
		}
	}

	// Judge the submission relative to the solution based on the generated
	// sequences of events corresponding to one run each. In case of a discrepancy,
	// the function returns [error, details]; otherwise both strings are empty.
	function compare_runs(
		submission,
		solution,
		marker: any = null,
		ignore_order = false
	) {
		if (!marker) marker = "$j71dKyoSL2KmbHXIa5dC$"; // some random string, delimited by dollar signs
		let table =
			'<table class="code-evaluation">\r\n<tr><th>your solution</th><th>reference solution</th></tr>\r\n';
		let addrow = function (solution, submission, cls = "") {
			let s = "<tr><td";
			if (cls != "") s += ' class="' + cls + '"';
			s += ">";
			if (submission !== null) {
				s +=
					"event type: " + escapeHtmlChars(submission.type) + "<br/>";
				for (let p in submission) {
					if (!submission.hasOwnProperty(p)) continue;
					if (p == "type") continue;
					s +=
						" " +
						escapeHtmlChars(p) +
						": " +
						escapeHtmlChars(JSON.stringify(submission[p]));
				}
			}
			s += "</td><td";
			if (cls != "") s += ' class="' + cls + '"';
			s += ">";
			if (solution !== null) {
				s += "event type: " + escapeHtmlChars(solution.type) + "<br/>";
				for (let p in solution) {
					if (!solution.hasOwnProperty(p)) continue;
					if (p == "type") continue;
					s +=
						" " +
						escapeHtmlChars(p) +
						": " +
						escapeHtmlChars(JSON.stringify(solution[p]));
				}
			}
			s += "</td></tr>\r\n";
			return s;
		};

		let marker_sol = solution.findIndex((e) => {
			return e.type == "print" && e.value == marker;
		});
		let marker_sub = submission.findIndex((e) => {
			return e.type == "print" && e.value == marker;
		});
		if (marker_sol >= 0 && marker_sub >= 0) {
			solution.splice(0, marker_sol + 1);
			submission.splice(0, marker_sub + 1);
		}

		// check which event types are present in the sample solution
		let expected_events: any = {};
		for (let i = 0; i < solution.length; i++) {
			let s = solution[i];
			if (!s.type) continue;
			if (s.type == "print" && s.value.indexOf(marker) >= 0)
				expected_events.marker = true;
			else expected_events[s.type] = true;
		}

		// extract function return type and value, if present
		let return_sub_type = "",
			return_sub_value = "";
		let return_sol_type = "",
			return_sol_value = "";
		if (
			submission.length > 0 &&
			submission[submission.length - 1].type == "print" &&
			submission[submission.length - 1].value.indexOf(marker) >= 0
		) {
			let s = submission[submission.length - 1].value;
			let pos = s.indexOf(marker);
			return_sub_type = s.substr(0, pos);
			return_sub_value = s.substr(pos + marker.length);
			submission.splice(submission.length - 1, 1);
		}
		if (
			solution.length > 0 &&
			solution[solution.length - 1].type == "print" &&
			solution[solution.length - 1].value.indexOf(marker) >= 0
		) {
			let s = solution[solution.length - 1].value;
			let pos = s.indexOf(marker);
			return_sol_type = s.substr(0, pos);
			return_sol_value = s.substr(pos + marker.length);
			solution.splice(solution.length - 1, 1);
		}

		// loop over events produced by the submission and check for errors
		let wanted_errors = {
			"assertion failed": true,
			"uncaught exception": true,
			"runtime error;": true,
		}; // notice the semicolon in "runtime error;" -- this string matches only errors raised by error(...)
		let i = 0;
		let remaining_solution = solution.slice();
		while (i < submission.length) {
			if (submission[i].type == "compile error")
				return [
					"Error while parsing the code - " + submission[i].message,
					"",
				];
			let type = submission[i].type;
			if (type == "print" && submission[i].value.indexOf(marker) >= 0)
				type = "marker";
			if (remaining_solution.length == 0) {
				if (type == "runtime error")
					return [
						"Runtime error while executing the code - " +
							submission[i].message,
						table,
					];
				else if (expected_events.hasOwnProperty(type)) {
					table += addrow(null, submission[i], "error");
					table += "</table>\r\n";
					let error = "Unexpected surplus output";
					if (
						isObject(submission[i]) &&
						submission[i].hasOwnProperty("type")
					)
						error += " of type " + type;
					return [error, table];
				}
			}
			if (type == "runtime error") {
				let wanted: string | null = null;
				for (let w_error in wanted_errors) {
					if (!wanted_errors.hasOwnProperty(w_error)) continue;
					if (submission[i].message.indexOf(w_error) >= 0)
						wanted = w_error;
				}
				if (remaining_solution[0].type == "runtime error") {
					if (
						remaining_solution[0].message.indexOf(wanted) >= 0 ||
						remaining_solution[0].href == submission[i].href
					) {
						// wanted error, same as in the reference solution
						i++;
						remaining_solution.shift();
						continue;
					} else {
						table += addrow(
							remaining_solution[0],
							submission[i],
							"error"
						);
						table += "</table>\r\n";
						return [
							"Unexpected runtime error; expected error: " +
								remaining_solution[0].message +
								" - obtained error: " +
								submission[i].message,
							table,
						];
					}
				}
				return [
					"Runtime error while executing the code - " +
						submission[i].message,
					"",
				];
			}
			if (!expected_events.hasOwnProperty(type)) {
				if (type != "marker")
					table += addrow(null, submission[i], "ignored");
				i++;
				continue;
			}
			if (ignore_order) {
				let match_index = -1;
				for (let j = 0; j < remaining_solution.length; j++) {
					let error = compare_events(
						submission[i],
						remaining_solution[j]
					);
					if (error == "") {
						match_index = j;
						break;
					}
				}
				if (match_index < 0) {
					let s =
						'<tr><td class="error">event type: ' +
						escapeHtmlChars(submission[i].type) +
						"<br/>";
					for (let p in submission[i]) {
						if (!submission[i].hasOwnProperty(p)) continue;
						if (p == "type") continue;
						s +=
							" " +
							escapeHtmlChars(p) +
							": " +
							escapeHtmlChars(JSON.stringify(submission[i][p]));
					}
					s +=
						'</td><td class="error">no matching event was produced by the reference solution. Candidates:<table>';
					for (let j = 0; j < remaining_solution.length; j++) {
						s +=
							'<tr><td class="error">event type: ' +
							escapeHtmlChars(remaining_solution[j].type) +
							"<br/>";
						for (let p in remaining_solution[j]) {
							if (!remaining_solution[j].hasOwnProperty(p))
								continue;
							if (p == "type") continue;
							s +=
								" " +
								escapeHtmlChars(p) +
								": " +
								escapeHtmlChars(
									JSON.stringify(remaining_solution[j][p])
								);
						}
						s += "</td></tr>";
					}
					s += "</table></td></tr>\r\n";
					table += s + "</table>\r\n";
					return [
						"unmatched events, see detailed table for more information",
						table,
					];
				}
				if (type != "marker")
					table += addrow(
						remaining_solution[match_index],
						submission[i]
					);
				i++;
				remaining_solution.splice(match_index, 1);
			} else {
				let error = compare_events(
					submission[i],
					remaining_solution[0]
				);
				if (error != "") {
					table += addrow(
						remaining_solution[0],
						submission[i],
						"error"
					);
					table += "</table>\r\n";
					return [error, table];
				}
				if (type != "marker")
					table += addrow(remaining_solution[0], submission[i]);
				i++;
				remaining_solution.shift();
			}
		}

		// handle missing events
		if (remaining_solution.length > 0) {
			table += addrow(remaining_solution[0], null, "error");
			table += "</table>\r\n";
			let error = "";
			if (remaining_solution[0].type == "runtime error")
				error = "Runtime error expected";
			else {
				error = "Missing output";
				if (
					isObject(remaining_solution[0]) &&
					remaining_solution[0].hasOwnProperty("type")
				)
					error +=
						" of type " +
						JSON.stringify(remaining_solution[0].type);
			}
			return [error, table];
		}

		table += "</table>\r\n";

		// check the return value
		if (return_sub_type == "" && return_sol_type == "") return ["", ""];
		if (return_sub_type == "")
			return [
				"Missing return value - expected " +
					return_sol_value +
					" of type " +
					return_sol_type +
					"; the function terminates without returning a value",
				"",
			];
		if (return_sol_type == "")
			throw new Error(
				"internal error: missing return type in compare_runs"
			);

		if (
			return_sub_type != return_sol_type &&
			(["<Type Integer>", "<Type Real>"].indexOf(return_sub_type) < 0 ||
				["<Type Integer>", "<Type Real>"].indexOf(return_sol_type) < 0)
		) {
			return [
				"Wrong data type of the return value - expected: " +
					return_sol_type +
					" - obtained: " +
					return_sub_type,
				"",
			];
		}

		let cmp = compare_events(return_sub_value, return_sol_value);
		if (cmp == "") return ["", ""];
		else
			return [
				"Wrong return value - expected: " +
					return_sol_value +
					" of type " +
					return_sol_type +
					" - obtained: " +
					return_sub_value +
					" of type " +
					return_sub_type,
				"",
			];
	}

	// create an interpreter with specialized services for observing the
	// runtime behavior of a program
	function createInterpreter(program, inputs, output) {
		let interpreter = new Interpreter(program, createDefaultServices());
		interpreter.eventnames["canvas.resize"] = true;
		interpreter.eventnames["canvas.mousedown"] = true;
		interpreter.eventnames["canvas.mouseup"] = true;
		interpreter.eventnames["canvas.mousemove"] = true;
		interpreter.eventnames["canvas.mouseout"] = true;
		interpreter.eventnames["canvas.keydown"] = true;
		interpreter.eventnames["canvas.keyup"] = true;
		interpreter.eventnames["timer"] = true;
		interpreter.reset();
		for (let i = 0; i < inputs.length; i++) {
			if (typeof inputs[i] == "object" && inputs[i] !== null) {
				let type = inputs[i].type;
				let classname = inputs[i].classname;
				let properties = inputs[i].event;

				// name lookup of the event type (class)
				let cls = interpreter.program;
				let parts = classname.split(".");
				for (let name of parts) cls = cls.names[name];

				// create the event object
				let event = { type: cls, value: { a: Array() } };
				for (let i = 0; i < type.objectsize; i++) {
					event.value.a.push(
						TScript.json2typed.call(interpreter, null)
					);
				}

				// fill in properties
				if (properties) {
					for (let key in properties) {
						if (!properties.hasOwnProperty(key)) continue;
						let index = cls.names[key].id;
						event.value.a[index] = TScript.json2typed.call(
							interpreter,
							properties[key]
						);
					}
				}

				// enqueue event
				interpreter.eventqueue.push({ type: type, event: event });

				// remove from inputs
				inputs.splice(i, 1);
				i--;
			}
		}
		let orig_turtle_move = interpreter.service.turtle.move;
		interpreter.service.print = function (msg) {
			output.push({ type: "print", value: msg });
		};
		interpreter.service.alert = function (msg) {
			return new Promise((resolve, reject) => {
				output.push({ type: "alert", value: msg });
				resolve(null);
			});
		};
		interpreter.service.confirm = function (msg) {
			return new Promise((resolve, reject) => {
				if (!inputs || inputs.length == 0) resolve(false);
				else resolve(!!inputs.shift());
			});
		};
		interpreter.service.prompt = function (msg) {
			return new Promise((resolve, reject) => {
				if (!inputs || inputs.length == 0) resolve("");
				else resolve(inputs.shift());
			});
		};
		interpreter.service.message = function (
			msg,
			line: any = null,
			ch: any = null,
			href: any = ""
		) {
			output.push({
				type: "runtime error",
				message: msg,
				line: line,
				href: href,
			});
		};
		interpreter.service.turtle.move = function (distance) {
			let x0 = interpreter.service.turtle.x;
			let y0 = interpreter.service.turtle.y;
			orig_turtle_move.call(this, distance);
			let x1 = interpreter.service.turtle.x;
			let y1 = interpreter.service.turtle.y;
			if (interpreter.service.turtle.down && distance != 0)
				output.push({
					type: "turtle line",
					from: [x0, y0],
					to: [x1, y1],
					color: interpreter.service.turtle.rgb,
				});
		};
		interpreter.service.canvas.dom = { width: 1920, height: 1080 };
		interpreter.service.canvas.setLineColor = function (r, g, b) {
			output.push({
				type: "canvas setLineColor",
				r: r,
				g: g,
				b: b,
			});
		};
		interpreter.service.canvas.setFillColor = function (r, g, b) {
			output.push({
				type: "canvas setFillColor",
				r: r,
				g: g,
				b: b,
			});
		};
		interpreter.service.canvas.clear = function () {
			output.push({ type: "canvas clear" });
		};
		interpreter.service.canvas.line = function (x1, y1, x2, y2) {
			output.push({
				type: "canvas line",
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2,
			});
		};
		interpreter.service.canvas.rect = function (left, top, width, height) {
			output.push({
				type: "canvas rect",
				left: left,
				top: top,
				width: width,
				height: height,
			});
		};
		interpreter.service.canvas.fillRect = function (
			left,
			top,
			width,
			height
		) {
			output.push({
				type: "canvas fillRect",
				left: left,
				top: top,
				width: width,
				height: height,
			});
		};
		interpreter.service.canvas.frameRect = function (
			left,
			top,
			width,
			height
		) {
			output.push({
				type: "canvas frameRect",
				left: left,
				top: top,
				width: width,
				height: height,
			});
		};
		interpreter.service.canvas.circle = function (x, y, radius) {
			output.push({ type: "canvas circle", x: x, y: y, radius: radius });
		};
		interpreter.service.canvas.fillCircle = function (x, y, radius) {
			output.push({
				type: "canvas fillCircle",
				x: x,
				y: y,
				radius: radius,
			});
		};
		interpreter.service.canvas.frameCircle = function (x, y, radius) {
			output.push({
				type: "canvas frameCircle",
				x: x,
				y: y,
				radius: radius,
			});
		};
		interpreter.service.canvas.curve = function (points, closed) {
			output.push({
				type: "canvas curve",
				points: points,
				closed: closed,
			});
		};
		interpreter.service.canvas.fillArea = function (points) {
			output.push({ type: "canvas fillArea", points: points });
		};
		interpreter.service.canvas.frameArea = function (points) {
			output.push({ type: "canvas frameArea", points: points });
		};
		interpreter.service.canvas.text = function (x, y, str) {
			output.push({ type: "canvas text", x: x, y: y, str: str });
		};
		interpreter.service.canvas.reset = function () {
			output.push({ type: "canvas reset" });
		};
		interpreter.service.canvas.shift = function (dx, dy) {
			output.push({ type: "canvas shift", dx: dx, dy: dy });
		};
		interpreter.service.canvas.scale = function (factor) {
			output.push({ type: "canvas scale", factor: factor });
		};
		interpreter.service.canvas.rotate = function (angle) {
			output.push({ type: "canvas rotate", angle: angle });
		};
		interpreter.service.canvas.transform = function (A, b) {
			output.push({ type: "canvas transform", A: A, b: b });
		};

		return interpreter;
	}

	// This function runs a TScript program. It returns an array of
	// events, like print messages, turtle and canvas outputs.
	// Parameters:
	//  - code is the TScript source code to run
	//  - maxseconds is the timeout, default=3
	//  - inputs in an array of values returned by consecutive calls to TScript's confirm or prompt, default=[]
	module.run_tscript = function (code, maxseconds = 3.0, inputs = []) {
		inputs = inputs.slice();
		let output = new Array();

		let result = Parser.parse(code);
		let errors = result.errors;
		if (errors.length > 0) {
			for (let i = 0; i < errors.length; i++) {
				let err = errors[i];
				output.push({
					type: "compile error",
					line: err.line,
					message: err.message,
				});
			}
			return output;
		}
		let program = result.program;

		// create an interpreter and prepare it for collecting output events
		let interpreter = createInterpreter(program, inputs, output);
		interpreter.stopthread();
		interpreter.reset();

		// run the program
		let timeout = new Date().getTime() + 1000 * maxseconds;
		while (true) {
			let start = new Date().getTime();
			if (start >= timeout) {
				output.push({
					type: "timeout - program execution took too long",
				});
				return output;
			}

			if (interpreter.status == "waiting") interpreter.status = "running";
			if (interpreter.status != "running") break;

			while (
				new Date().getTime() - start < 14 &&
				interpreter.status == "running"
			) {
				interpreter.exec_step();
				if (interpreter.halt) break;
			}
			if (!interpreter.timerEventEnqueued) {
				interpreter.timerEventEnqueued = interpreter.enqueueEvent(
					"timer",
					{
						type: interpreter.program.types[Typeid.typeid_null],
						value: { b: null },
					}
				);
			}
		}

		return output;
	};

	// This function runs multiple TScript programs. It returns immediately.
	// The programs are run asynchronously in the background until they finish or time out.
	// Parameters:
	//  - code is an array of TScript programs or JS test functions
	//  - inputs is an array of arrays, containing values returned by consecutive calls to TScript's confirm or prompt.
	//  - maxseconds is the timeout
	//  - process is a function taking the array of event arrays as its argument for further processing.
	module.run_multiple = function (code, inputs, maxseconds, process) {
		let timeout = new Date().getTime() + 1000 * maxseconds;

		let index = 0;
		let all: any = new Array();
		let output = new Array();
		for (let i = 0; i < inputs.length; i++) inputs[i] = inputs[i].slice();

		function compute() {
			let c = code[index];
			if (c[0] == "@") {
				let split = c.indexOf("\n@\n");
				let jsc = c.substr(1, split - 1);
				let tsc = c.substr(split + 3);
				let testfunction;
				eval(
					"testfunction = function(code, parse, hasStructure, isRecursive) {\n" +
						jsc +
						"\nreturn null; };\n"
				);
				all.push(
					testfunction(
						tsc,
						Parser.parse,
						module.hasStructure,
						module.isRecursive
					)
				);
				output = new Array();
				index++;
				if (index == code.length) process(all);
				else compute();
			} else {
				let result = Parser.parse(c);
				let errors = result.errors;
				if (errors.length > 0) {
					for (let i = 0; i < errors.length; i++) {
						let err = errors[i];
						output.push({
							type: "compile error",
							line: err.line,
							message: err.message,
						});
					}

					// output the collected output
					all.push(output);
					output = new Array();
					index++;
					if (index == code.length) process(all);
					else compute();
				} else {
					let program = result.program;

					// create an interpreter and prepare it for collecting output events
					let interpreter = createInterpreter(
						program,
						inputs[index],
						output
					);
					interpreter.reset();

					// run the program
					interpreter.run();

					// stop when the program has finished
					function monitor() {
						if (new Date().getTime() > timeout) {
							interpreter.stopthread();
							all = "timeout - program execution took too long";
							process(all);
						} else if (
							interpreter.status == "finished" ||
							interpreter.status == "error"
						) {
							interpreter.stopthread();

							// output the collected output
							all.push(output);
							output = new Array();
							index++;
							if (index == code.length) process(all);
							else compute();
						} else setTimeout(monitor, 1);
					}
					setTimeout(monitor, 1);
				}
			}
		}
		compute();
	};

	const reserved_node_names = {
		breakpoints: true,
		class_constructor: true,
		declaration: true,
		displayname: true,
		id: true,
		lines: true,
		name: true,
		names: true,
		operator: true,
		params: true,
		parent: true,
		petype: true,
		reference: true,
		scope: true,
		step: true,
		sim: true,
		superclass: true,
		type: true,
		types: true,
		typedvalue: true,
		var_id: true,
		var_scope: true,
		variables: true,
		where: true,
	};

	// static code analysis, try to decide whether a program contains a recursive function or not
	function isRecursiveStatic(program) {
		if (!program) return false;

		function isObject(value) {
			return (
				value !== null &&
				typeof value == "object" &&
				value.constructor == Object
			);
		}

		function isNode(value) {
			return Array.isArray(value) || isObject(value);
		}

		function rec(node, fnames) {
			if (node.builtin) return false;
			if (node.petype == "breakpoint") return false;

			if (node.petype == "function" && node.name) {
				let names = fnames.slice();
				names.push(node.name);
				fnames = names;
			}
			if (node.petype == "function call") {
				if (node.base.name && fnames.indexOf(node.base.name) >= 0)
					return true;
				if (node.base.petype == "this") return true;
			}
			for (let key in node) {
				if (!node.hasOwnProperty(key)) continue;
				if (reserved_node_names.hasOwnProperty(key)) continue;
				let n = node[key];
				if (isNode(n)) {
					if (rec(n, fnames)) return true;
				}
			}
			return false;
		}

		return rec(program, new Array());
	}

	// dynamic behavior analysis, try to decide whether a program contains a recursive function or not
	function isRecursiveDynamic(program, maxseconds = 3.0, inputs = []) {
		if (!program) return false;
		inputs = inputs.slice();

		// create an interpreter with empty services
		let interpreter = new Interpreter(program, createDefaultServices());
		let orig_turtle_move = interpreter.service.turtle.move;
		interpreter.service.print = function (msg) {};
		interpreter.service.alert = function (msg) {};
		interpreter.service.message = function (msg, line, ch, href) {};
		interpreter.service.prompt = function (msg) {};
		interpreter.service.turtle.move = function (distance) {};
		interpreter.service.canvas.dom = { width: 1920, height: 1080 };
		interpreter.service.canvas.clear = function () {};
		interpreter.service.canvas.line = function (x1, y1, x2, y2) {};
		interpreter.service.canvas.rect = function (
			left,
			top,
			width,
			height
		) {};
		interpreter.service.canvas.fillRect = function (
			left,
			top,
			width,
			height
		) {};
		interpreter.service.canvas.frameRect = function (
			left,
			top,
			width,
			height
		) {};
		interpreter.service.canvas.circle = function (x, y, radius) {};
		interpreter.service.canvas.fillCircle = function (x, y, radius) {};
		interpreter.service.canvas.frameCircle = function (x, y, radius) {};
		interpreter.service.canvas.curve = function (points, closed) {};
		interpreter.service.canvas.fillArea = function (points) {};
		interpreter.service.canvas.frameArea = function (points) {};
		interpreter.service.canvas.text = function (x, y, str) {};
		interpreter.service.canvas.reset = function () {};
		interpreter.service.canvas.shift = function (dx, dy) {};
		interpreter.service.canvas.scale = function (factor) {};
		interpreter.service.canvas.rotate = function (angle) {};
		interpreter.service.canvas.transform = function (A, b) {};
		interpreter.stopthread();
		interpreter.reset();

		// run the program
		let timeout = new Date().getTime() + 1000 * maxseconds;
		while (true) {
			let start = new Date().getTime();
			if (start >= timeout) break; // not ideal, but better than an infinite loop

			if (interpreter.status == "waiting") interpreter.status = "running";
			if (interpreter.status != "running") break;

			while (
				new Date().getTime() - start < 14 &&
				interpreter.status == "running"
			) {
				interpreter.exec_step();

				// check for recursion
				let n = interpreter.stack.length;
				for (let i = 0; i < n; i++) {
					for (let j = 0; j < i; j++) {
						if (
							interpreter.stack[i].pe[0] ===
							interpreter.stack[j].pe[0]
						)
							return true;
					}
				}

				if (interpreter.halt) break;
			}
			if (!interpreter.timerEventEnqueued) {
				interpreter.timerEventEnqueued = interpreter.enqueueEvent(
					"timer",
					{
						type: interpreter.program.types[Typeid.typeid_null],
						value: { b: null },
					}
				);
			}
		}

		return false;
	}

	// Return true if the given (translated) program contains at least one
	// recursive function. The test is performed statically at first. If no
	// recursion is found then the program is executed -- hence make sure to
	// include test code that actually invokes the recursion -- and the
	// runtime behavior is analyzed.
	module.isRecursive = function (program) {
		if (isRecursiveStatic(program)) return true;
		else return isRecursiveDynamic(program);
	};

	// Return true if the given program (more precisely, its AST)
	// has a structure that is compatible with the given pseudo code.
	module.hasStructure = function (program, pseudo) {
		function compilePseudo(code) {
			let pos = 0;

			function skipwhite() {
				while (
					pos < code.length &&
					(code[pos] == " " ||
						code[pos] == "\t" ||
						code[pos] == "\n" ||
						code[pos] == "\r")
				)
					pos++;
			}

			function identifier() {
				skipwhite();
				if (pos >= code.length) return null;
				let c = code[pos];
				if (c == '"') {
					let ret = "";
					pos++;
					while (pos < code.length) {
						c = code[pos];
						pos++;
						if (c == '"') return ret;
						else ret += c;
					}
					return null;
				} else if (c == "'") {
					let ret = "";
					pos++;
					while (pos < code.length) {
						c = code[pos];
						pos++;
						if (c == "'") return ret;
						else ret += c;
					}
					return null;
				} else if (
					(c >= "A" && c <= "Z") ||
					(c >= "a" && c <= "z") ||
					c == "_"
				) {
					let ret = c;
					pos++;
					while (true) {
						c = code[pos];
						if (
							(c >= "A" && c <= "Z") ||
							(c >= "a" && c <= "z") ||
							(c >= "0" && c <= "9") ||
							c == "_"
						) {
							ret += c;
							pos++;
						} else break;
					}
					return ret;
				} else return null;
			}

			function command() {
				let ident = identifier();
				if (ident === null) return null;

				let ret: any = { petype: ident };

				skipwhite();
				if (pos >= code.length) return null;
				let c = code[pos];
				if (c == "(") {
					pos++;
					let name = identifier();
					if (name === null) return null;
					skipwhite();
					let c = code[pos];
					if (c != ")") return null;
					pos++;
					ret.base = { name: name };
				} else if (c == "[") {
					pos++;
					let name = identifier();
					if (name === null) return null;
					skipwhite();
					let c = code[pos];
					if (c != "]") return null;
					pos++;
					ret.name = name;
				}

				skipwhite();
				if (pos >= code.length) return null;
				c = code[pos];
				if (c == "{") {
					pos++;
					let sub = new Array();
					while (true) {
						skipwhite();
						if (pos >= code.length) return null;
						if (code[pos] == ";") {
							pos++;
							continue;
						}
						if (code[pos] == "}") {
							pos++;
							ret.sub = sub.length == 1 ? sub[0] : sub;
							return ret;
						}
						let cmd = command();
						if (cmd === null) return null;
						sub.push(cmd);
					}
				} else if (c == ";") {
					pos++;
					return ret;
				} else return null;
			}

			skipwhite();
			if (pos >= code.length) return null;
			let c = code[pos];
			if (c == "{") {
				pos++;
				let ret = new Array();
				while (true) {
					skipwhite();
					if (pos >= code.length) return null;
					if (code[pos] == ";") {
						pos++;
						continue;
					}
					if (code[pos] == "}") {
						pos++;
						skipwhite();
						if (pos >= code.length) return ret;
						else return null;
					}
					let cmd = command();
					if (cmd === null) return null;
					ret.push(cmd);
				}
			} else {
				let cmd = command();
				skipwhite();
				if (pos >= code.length) return cmd;
				else return null;
			}
		}

		// The function returns true if key is a sub-tree of data, and false otherwise.
		// A tree is an arbitrary array or object. Non-array non-object nodes are ignored.
		// Many member names like "parent" and "petype" are reserved. All other object members are considered child nodes.
		// Two nodes match under the following conditions:
		// - Arrays can match arrays; objects can match objects.
		// - If at least one of the nodes has a petype member then both need one, and the key petype must be a substring of the data petype
		// - If at least one of the nodes has a name member then both need one, and the key name must match the data name
		// - Array members are considered in their natural order.
		// - In the key tree, objects must have at most one child node, hence there is no order ambiguity.
		function isSubtree(key, data) {
			function isObject(value) {
				return (
					value !== null &&
					typeof value == "object" &&
					value.constructor == Object
				);
			}

			function isNode(value) {
				return Array.isArray(value) || isObject(value);
			}

			function equal(c1, c2) {
				if (
					c1.nstack.length != c2.nstack.length ||
					c1.dstack.length != c2.dstack.length ||
					c1.next.length != c2.next.length
				)
					return false;
				for (let i = 0; i < c1.nstack.length; i++) {
					if (c1.nstack[i].length != c2.nstack[i].length)
						return false;
					for (let j = 0; j < c1.nstack[i].length; j++) {
						if (c1.nstack[i][j] !== c2.nstack[i][j]) return false;
					}
				}
				for (let i = 0; i < c1.dstack.length; i++) {
					if (c1.dstack[i] !== c2.dstack[i]) return false;
				}
				for (let i = 0; i < c1.next.length; i++) {
					if (c1.next[i] !== c2.next[i]) return false;
				}
				return true;
			}

			// initial cursor
			let cs = [
				{ nstack: new Array(), dstack: new Array(), next: [key] },
			];

			// recursive traversal of the data tree
			function rec(node) {
				if (!node) return false;
				if (node.builtin) return false;
				if (node.petype == "breakpoint") return false;

				// forward pass: match nodes
				let ii = cs.length;
				for (let i = 0; i < ii; i++) {
					let c = cs[i];
					if (c.next.length == 0) continue; // this cursor is waiting for an ancestor of the current data node
					let next = c.next[0];
					if (!isNode(next))
						throw new Error(
							"[isSubtree] key node is not an array or object"
						);

					// do the nodes match?
					let match = Array.isArray(node) == Array.isArray(next);
					if (match && isObject(next)) {
						if (next.hasOwnProperty("petype")) {
							let d = node.petype ? node.petype : "";
							let k = next.petype ? next.petype : "";
							match = d.indexOf(k) >= 0;
						}
						if (match && next.hasOwnProperty("name")) {
							let d = node.name ? node.name : "";
							let k = next.name ? next.name : "";
							match = d == k;
						}
					}

					if (match) {
						// match found: create a new cursor
						// - create a new next array from the children of the key node
						// - add old next array with the first position removed and the data node to the stacks
						let ns = c.nstack.slice();
						let ds = c.dstack.slice();
						ns.push(c.next.slice(1));
						ds.push(node);
						let nx = new Array();
						for (let key in next) {
							if (!next.hasOwnProperty(key)) continue;
							if (reserved_node_names.hasOwnProperty(key))
								continue;
							let n = next[key];
							if (isNode(n)) nx.push(n);
						}
						cs.push({ nstack: ns, dstack: ds, next: nx });
					}
				}

				// recursion
				for (let key in node) {
					if (!node.hasOwnProperty(key)) continue;
					if (reserved_node_names.hasOwnProperty(key)) continue;
					let n = node[key];
					if (isNode(n)) {
						if (rec(n)) return true;
					}
				}

				// backward pass: collect results
				let cs1 = new Array(),
					cs2 = new Array();
				for (let i = 0; i < cs.length; i++) {
					let c = cs[i];
					if (c.dstack[c.dstack.length - 1] == node) {
						if (c.next.length > 0) continue; // sub-tree match not completed: drop the cursor

						// move the cursor to the next sub-tree
						c.dstack.pop();
						c.next = c.nstack.pop();
						if (c.nstack.length == 0) return true; // success!
						cs2.push(c);
					} else cs1.push(c);
				}

				// check for duplicate cursors
				cs = cs1;
				for (let i = 0; i < cs2.length; i++) {
					let duplicate = false;
					for (let j = 0; j < cs.length; j++) {
						if (equal(cs2[i], cs[j])) {
							duplicate = true;
							break;
						}
					}
					if (!duplicate) cs.push(cs2[i]);
				}

				return false;
			}

			return rec(data);
		}

		let pc = compilePseudo(pseudo);
		if (pc === null) {
			console.log("error in pseudo code:\n\n" + pseudo);
			return false;
		}
		return isSubtree(pc, program);
	};

	// Evaluate a submission (TScript code) for a programming task. The
	// task is specified as an object with the following keys:
	//  - correct: This is the reference solution as a string.
	//  - tests: This is an array of objects describing tests. Each
	//    test has a type ("code", "call", or "js"), as well as further
	//    fields depending on the type.
	//  - evaluation: If present, a Javascript formula computing the
	//    points. In this case, "test" is expected to be a dictionary,
	//    such that the formula can access test results by using the
	//    syntax $key. Tests take values of 1 (passing) or 0 (failing).
	// Code evaluation is asynchronous. The function returns
	// immediately. Reporting is done by calling the functions process
	// with a results object with the following keys:
	//  - error: Error message as a string.
	//  - details: Additional error details as a string (html code).
	//  - points: number of points if specified in the task and the code
	//    is correct, otherwise 0
	module.evaluate = function (task, submission, process) {
		let marker = "$j71dKyoSL2KmbHXIa5dC$"; // some random string, delimited by dollar signs

		// extract properties
		let solution = task.correct;
		let points = task.points ? task.points : 0;
		let total = points;
		let error: null | string = null;
		let details: null | string = null;
		let timeout = task.timeout ? task.timeout : 3;
		let task_context = task.hasOwnProperty("context") ? task.context : "";

		// collect the codes to execute
		let codes = new Array();
		let inputs = new Array();
		let calls = new Array();
		function prepareTest(test) {
			if (test.type == "call") {
				let call = test.code;
				let context = test.hasOwnProperty("context")
					? task_context + test.context
					: task_context;
				calls.push(call);
				let sub =
					context +
					"\n\n" +
					submission +
					'\n\n{print("' +
					marker +
					'"); var result = ' +
					call +
					'; print(Type(result) + "' +
					marker +
					'" + result);\n}\n';
				let sol =
					context +
					"\n\n" +
					solution +
					'\n\n{print("' +
					marker +
					'"); var result = ' +
					call +
					'; print(Type(result) + "' +
					marker +
					'" + result);\n}\n';
				let input = test.hasOwnProperty("input")
					? test.input
					: new Array();
				codes.push(sub);
				inputs.push(input);
				codes.push(sol);
				inputs.push(input);
			} else if (test.type == "code") {
				let call = test.code;
				let context = test.hasOwnProperty("context")
					? task_context + test.context
					: task_context;
				calls.push(call);
				let sub =
					context + "\n\n" + submission + "\n\n{" + call + "\n}\n";
				let sol =
					context + "\n\n" + solution + "\n\n{" + call + ";\n}\n";
				let input = test.hasOwnProperty("input")
					? test.input
					: new Array();
				codes.push(sub);
				inputs.push(input);
				codes.push(sol);
				inputs.push(input);
			} else if (test.type == "js") {
				let call = test.code;
				codes.push("@" + call + "\n@\n" + submission);
				inputs.push(new Array());
			}
		}

		if (task.hasOwnProperty("evaluation")) {
			for (let key in task.tests) {
				let test = task.tests[key];
				prepareTest(test);
			}
		} else if (!task.hasOwnProperty("tests") || task.tests === null) {
			codes.push(submission);
			inputs.push(new Array());
			codes.push(solution);
			inputs.push(new Array());
		} else {
			for (let i = 0; i < task.tests.length; i++) {
				let test = task.tests[i];
				prepareTest(test);
			}
		}

		// run the code
		module.run_multiple(codes, inputs, timeout, function (result) {
			if (result === null) {
				error = "internal error: failed to evaluate the code";
				points = 0;
			} else if (typeof result == "string") {
				error = result;
				points = 0;
			} else {
				// check the result, report success or failure
				if (
					!task.hasOwnProperty("ignore-color") ||
					!!task["ignore-color"]
				) {
					for (let i = 0; i < result.length; i++) {
						if (result[i] && Array.isArray(result[i]))
							result[i] = result[i].filter(
								(event) =>
									event.type != "canvas setLineColor" &&
									event.type != "canvas setFillColor"
							);
					}
				}
				let io =
					task.hasOwnProperty("ignore-order") &&
					!!task["ignore-order"];
				let fraction = 0.0,
					use_fraction = false;
				let call_pos = 0;
				let code_pos = 0;
				function evaluateTest(
					test
				): [boolean, null | string, null | string] {
					let success = true;
					let error: null | string = null;
					let details: null | string = null;
					if (test.type == "call") {
						let ed = compare_runs(
							result[code_pos],
							result[code_pos + 1],
							marker,
							io
						);
						if (ed[0] != "") {
							success = false;
							error =
								"Error:\n" +
								ed[0] +
								"\nTest code:\n" +
								calls[call_pos];
							details = ed[1];
						}
						code_pos += 2;
						call_pos++;
					} else if (test.type == "code") {
						let ed = compare_runs(
							result[code_pos],
							result[code_pos + 1],
							marker,
							io
						);
						if (ed[0] != "") {
							success = false;
							error = ed[0];
							if (calls[call_pos] != "") {
								error =
									"Error:\n" +
									ed[0] +
									"\nTest code:\n" +
									calls[call_pos];
							}
							details = ed[1];
						}
						code_pos += 2;
						call_pos++;
					} else if (test.type == "js") {
						if (typeof result[code_pos] == "string") {
							success = false;
							error = result[code_pos];
							if (test.hasOwnProperty("feedback"))
								details = test.feedback;
						}
						code_pos++;
					}
					return [success, error, details];
				}

				if (task.hasOwnProperty("evaluation")) {
					let tests = {};
					for (let key in task.tests) {
						let test = task.tests[key];
						let success = true;
						let e: null | string = null;
						let d: null | string = null;
						[success, e, d] = evaluateTest(test);
						if (!success && error === null) {
							error = e;
							details = d;
						}
						tests[key] = success ? 1 : 0;
					}
					let formula = task.evaluation.replace(/\$/g, "tests.");
					let f = new Function("tests", "return " + formula + ";");
					points = f(tests);
				} else if (
					!task.hasOwnProperty("tests") ||
					task.tests === null
				) {
					let ed = compare_runs(result[0], result[1], marker, io);
					if (ed[0] != "") {
						points = 0;
						error = ed[0];
						details = ed[1];
					}
				} else {
					for (let i = 0; i < task.tests.length; i++) {
						// run a single test
						let test = task.tests[i];
						let success = true;
						[success, error, details] = evaluateTest(test);

						// process the result
						if (success) {
							if (test.hasOwnProperty("fraction"))
								fraction += test.fraction;
						} else {
							points = 0;
							use_fraction = true;
							if (!test.hasOwnProperty("fatal") || test.fatal)
								break;
						}
					}
					if (use_fraction) points = fraction * total;
				}
			}

			// report the result
			process({ error: error, details: details, points: points });
		});
	};

	return module;
})();
