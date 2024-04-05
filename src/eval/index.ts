"use strict";

import { Typeid } from "../lang/helpers/typeIds";
import { TScript } from "../lang";
import { Parser } from "../lang/parser";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";
import { escapeHtmlChars } from "../escape";
import { isRecursive } from "./isRecursive";
import { hasStructure } from "./hasStructure";
//import { run_tscript } from "./run_tscript";
import { run_multiple } from "./run_multiple";

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
		if (size === 0) return null;
		if (s[pos] === "-") pos++;
		if (pos >= size || s[pos] < "0" || s[pos] > "9") return null;
		while (pos < size && s[pos] >= "0" && s[pos] <= "9") pos++;
		if (pos < size) {
			if (s[pos] === ".") {
				// parse fractional part
				pos++;
				if (pos === size || s[pos] < "0" || s[pos] > "9") return null;
				while (pos < size && s[pos] >= "0" && s[pos] <= "9") pos++;
			}
			if (s[pos] === "e" || s[pos] === "E") {
				// parse exponent
				pos++;
				if (s[pos] === "+" || s[pos] === "-") pos++;
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
			if (submission.type === "print" || submission.type === "alert") {
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
			} else if (submission.type === "turtle line") {
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

					if (p === "type") continue;
					//					if (
					//						p === "color" &&
					//						submission.hasOwnProperty("type") &&
					//						submission.type === "turtle line"
					//					)
					//						continue;

					let result = compare_events(submission[p], solution[p]);
					if (result != "") return result;
				}
			}
			return "";
		} else if (
			typeof submission === "string" ||
			typeof submission === "number"
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
		let nTable = 0;
		let addrow = function (solution, submission, cls = "") {
			nTable++;
			let s = "<tr><td";
			if (cls != "") s += ' class="' + cls + '"';
			s += ">";
			if (submission !== null) {
				s +=
					"event type: " + escapeHtmlChars(submission.type) + "<br/>";
				for (let p in submission) {
					if (!submission.hasOwnProperty(p)) continue;
					if (p === "type") continue;
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
					if (p === "type") continue;
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
			return e.type === "print" && e.value === marker;
		});
		let marker_sub = submission.findIndex((e) => {
			return e.type === "print" && e.value === marker;
		});
		if (marker_sol >= 0 && marker_sub >= 0) {
			solution.splice(0, marker_sol + 1);
			submission.splice(0, marker_sub + 1);
		}

		// print commands are optionally ignored if they are not found in the reference solution, and so is the marker
		let expecting_marker = false;
		let expecting_print = false;
		for (let i = 0; i < solution.length; i++) {
			let s = solution[i];
			if (!s.type) continue;
			if (s.type === "print") {
				if (s.value.indexOf(marker) >= 0) expecting_marker = true;
				else expecting_print = true;
			}
		}
		if (!expecting_print) {
			for (let i = 0; i < submission.length; i++) {
				let s = submission[i];
				if (!s.type) continue;
				if (s.type === "print" && s.value.indexOf(marker) < 0) {
					submission.splice(i, 1);
					i--;
				}
			}
		}

		// extract function return type and value, if present
		let return_sub_type = "",
			return_sub_value = "";
		let return_sol_type = "",
			return_sol_value = "";
		if (
			submission.length > 0 &&
			submission[submission.length - 1].type === "print" &&
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
			solution[solution.length - 1].type === "print" &&
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
			let type = submission[i].type;
			if (type === "print" && submission[i].value.indexOf(marker) >= 0)
				type = "marker";
			if (type === "compile error")
				return [
					"Error while parsing the code - " + submission[i].message,
					"",
				];
			if (remaining_solution.length === 0) {
				if (type === "runtime error") {
					table += "</table>\r\n";
					return [
						"Runtime error while executing the code - " +
							submission[i].message,
						nTable > 0 ? table : "",
					];
					//				} else if (type === "print" && !expecting_print) {
					//					table += addrow(null, submission[i], "ignored");
					//					i++;
					//					continue;
				} else {
					table += addrow(null, submission[i], "error");
					table += "</table>\r\n";
					let error = "Unexpected surplus output";
					if (
						isObject(submission[i]) &&
						submission[i].hasOwnProperty("type")
					)
						error += " of type " + type;
					return [error, nTable > 0 ? table : ""];
				}
			}
			if (type === "runtime error") {
				let wanted: string | null = null;
				for (let w_error in wanted_errors) {
					if (!wanted_errors.hasOwnProperty(w_error)) continue;
					if (submission[i].message.indexOf(w_error) >= 0)
						wanted = w_error;
				}
				if (remaining_solution[0].type === "runtime error") {
					if (
						remaining_solution[0].message.indexOf(wanted) >= 0 ||
						remaining_solution[0].href === submission[i].href
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
							nTable > 0 ? table : "",
						];
					}
				}
				return [
					"Runtime error while executing the code - " +
						submission[i].message,
					"",
				];
			}
			if (ignore_order) {
				let match_index = -1;
				for (let j = 0; j < remaining_solution.length; j++) {
					let error = compare_events(
						submission[i],
						remaining_solution[j]
					);
					if (error === "") {
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
						if (p === "type") continue;
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
							if (p === "type") continue;
							s +=
								" " +
								escapeHtmlChars(p) +
								": " +
								escapeHtmlChars(
									JSON.stringify(remaining_solution[j][p])
								);
						}
						s += "</td></tr>";
						nTable++;
					}
					s += "</table></td></tr>\r\n";
					table += s + "</table>\r\n";
					return [
						"unmatched events, see detailed table for more information",
						nTable > 0 ? table : "",
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
					return [error, nTable > 0 ? table : ""];
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
			if (remaining_solution[0].type === "runtime error")
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
			table += "</table>\r\n";
			return [error, nTable > 0 ? table : ""];
		}

		table += "</table>\r\n";
		if (nTable === 0) table = "";

		// check the return value
		if (return_sub_type === "" && return_sol_type === "") return ["", ""];

		function formatReturnValue(value: string, type: string) {
			return type.indexOf("Type String") >= 0
				? '"' +
						value
							.replace(/\\/g, "\\\\")
							.replace(/\"/g, '\\"')
							.replace(/\n/g, "\\n")
							.replace(/\r/g, "\\r")
							.replace(/\t/g, "\\t") +
						'"'
				: value + "";
		}
		if (return_sub_type === "")
			return [
				"Missing return value - expected " +
					formatReturnValue(return_sol_value, return_sol_type) +
					" of type " +
					return_sol_type +
					"; the function terminates without returning a value",
				"",
			];
		if (return_sol_type === "")
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
		if (cmp === "") return ["", ""];
		else {
			return [
				"Wrong return value - expected: " +
					formatReturnValue(return_sol_value, return_sol_type) +
					" of type " +
					return_sol_type +
					" - obtained: " +
					formatReturnValue(return_sub_value, return_sub_type) +
					" of type " +
					return_sub_type,
				"",
			];
		}
	}

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

		// don't let an unclosed block comment propagate
		submission += "\n#**#\n";

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
			if (test.type === "call") {
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
				inputs.push(input.slice());
				codes.push(sol);
				inputs.push(input.slice());
			} else if (test.type === "code") {
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
				inputs.push(input.slice());
				codes.push(sol);
				inputs.push(input.slice());
			} else if (test.type === "js") {
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
			inputs.push(
				task.hasOwnProperty("input") ? task.input.slice() : new Array()
			);
			codes.push(solution);
			inputs.push(
				task.hasOwnProperty("input") ? task.input.slice() : new Array()
			);
		} else {
			for (let i = 0; i < task.tests.length; i++) {
				let test = task.tests[i];
				prepareTest(test);
			}
		}

		// run the code
		run_multiple(codes, inputs, timeout, function (result) {
			let error: null | string = null;
			let details: null | string = null;
			let points = total;
			if (result === null) {
				error = "internal error: failed to evaluate the code";
				points = 0;
			} else if (typeof result === "string") {
				error = result;
				points = 0;
			} else if (
				typeof result === "object" &&
				result !== null &&
				!Array.isArray(result)
			) {
				error = "Error:\n" + result.msg;
				if (task.tests) {
					let index = 0;
					for (let i = 0; i < task.tests.length; i++) {
						let test = task.tests[i];
						if (test.type === "call") index += 2;
						else if (test.type === "code") index += 2;
						else if (test.type === "js") index += 1;
						if (index > result.index) {
							if (test.code)
								details =
									"<p>Test case:</p><pre>" +
									escapeHtmlChars(test.code) +
									"</pre>";
							break;
						}
					}
				}
				points = 0;
			} else {
				// check the result, report success or failure
				if (
					!task.hasOwnProperty("ignore-color") ||
					!!task["ignore-color"]
				) {
					for (let i = 0; i < result.length; i++) {
						if (result[i] && Array.isArray(result[i])) {
							// remove events setting color
							result[i] = result[i].filter(
								(event) =>
									event.type !== "canvas setLineColor" &&
									event.type !== "canvas setFillColor"
							);
							// remove an initial "clear", if present
							if (
								result[i].length > 0 &&
								result[i][0].type === "canvas clear"
							)
								result[i].shift();
						}
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
					if (test.type === "call") {
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
								";\nTest code:\n" +
								calls[call_pos];
							details = ed[1];
						}
						code_pos += 2;
						call_pos++;
					} else if (test.type === "code") {
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
									";\nTest code:\n" +
									calls[call_pos];
							}
							details = ed[1];
						}
						code_pos += 2;
						call_pos++;
					} else if (test.type === "js") {
						if (typeof result[code_pos] === "string") {
							success = false;
							error = result[code_pos];
							if (test.hasOwnProperty("feedback"))
								details = test.feedback;
						}
						code_pos++;
					} else
						throw new Error(
							"unknown test type '" +
								test.type +
								"' in run_multiple"
						);
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
						let e: null | string = null;
						let d: null | string = null;
						[success, e, d] = evaluateTest(test);

						// process the result
						if (success) {
							if (test.hasOwnProperty("fraction"))
								fraction += test.fraction;
						} else {
							points = 0;
							use_fraction = true;
							if (error === null) {
								error = e;
								details = d;
							}
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
