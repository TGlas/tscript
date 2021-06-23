"use strict"

import { Typeid } from "../lang/helpers/typeIds";
import { TScript } from "../lang";
import { Parser } from "../lang/parser";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";

//
// This file is a stub. It needs considerable clean-up and restructuring.
//

export const checkCode = (function () {
	let module: any = {};

	function isObject(x)
	{ return (typeof x === 'object') && (x !== null); }

	// Return a number if the string can be parsed into one; otherwise return null
	function strAsNumber(s)
	{
		let pos = 0, size = s.length;
		if (size == 0) return null;
		if (s[pos] < '0' || s[pos] > '9') return null;
		while (pos < size && (s[pos] < '0' || s[pos] > '9')) pos++;
		if (pos < size)
		{
			if (s[pos] == '.')
			{
				// parse fractional part
				pos++;
				if (pos == size || (s[pos] < '0' || s[pos] > '9')) return null;
				while (pos < size && (s[pos] >= '0' && s[pos] <= '9')) pos++;
			}
			if (s[pos] == 'e' || s[pos] == 'E')
			{
				// parse exponent
				pos++;
				if (s[pos] == '+' || s[pos] == '-') pos++;
				if (s[pos] < '0' || s[pos] > '9') return null;
				while (pos < size && (s[pos] >= '0' && s[pos] <= '9')) pos++;
			}
		}
		if (pos < size) return null;   // critical difference compared with parseFloat: do not accept trailing characters!
		return parseFloat(s);
	}

	// Compare two events.
	// The function returns an error message, or the empty string in case of equality.
	function compare_events(submission, solution)
	{
		if (Array.isArray(submission))
		{
			if (! Array.isArray(solution)) return "internal error: unexpected data type in compare_events";
			if (submission.length != solution.length) return "Falsche Array-Größe - erwartet " + solution.length + " - erhalten " + submission.length;
			for (let i=0; i<submission.length; i++)
			{
				let result = compare_events(submission[i], solution[i]);
				if (result != "") return result;
			}
			return "";
		}
		else if (isObject(submission))
		{
			if (! isObject(solution)) return "internal error: unexpected data type in compare_events";
			if (submission.hasOwnProperty("type") && solution.hasOwnProperty("type") && submission.type != solution.type) return "Falscher Ereignistyp - erwartet: " + solution.type + " - erhalten: " + submission.type;
			for (let p in submission)
			{
				if (! submission.hasOwnProperty(p)) continue;

				if (p == "type") continue;
				if (p == "color" && submission.hasOwnProperty("type") && submission.type == "turtle line") continue;

				let result = compare_events(submission[p], solution[p]);
				if (result != "") return result;
			}
			return "";
		}
		else if (typeof submission == "string" || typeof submission == "number")
		{
			let sub = strAsNumber(submission);
			let sol = strAsNumber(solution);
			if (sub === null || sol === null)
			{
				if (submission != solution) return "Falscher Wert - erwartet: " + solution + " - erhalten: " + submission;
			}
			else
			{
				let close = Math.abs(sub - sol) < 1e-3 || Math.abs((sub / sol) - 1) < 1e-3;
				if (! close) return "Falsche Zahl - erwartet: " + solution + " - erhalten: " + submission;
			}
			return "";
		}
		else
		{
			if (submission != solution) return "Falscher Wert - erwartet: " + solution + " - erhalten: " + submission;
			return "";
		}
	}

	function escape(s)
	{
		let ret = "";
		for (let i=0; i<s.length; i++)
		{
			let c = s[i];
			if (c == '\n') ret += "<br/>";
			else if (c == '"') ret += "&quot;";
			else if (c == '<') ret += "&lt;";
			else if (c == '>') ret += "&gt;";
			else if (c == '&') ret += "&amp;";
			else ret += c;
		}
		return ret;
	}

	// Judge the submission relative to the solution based on the generated sequences of events corresponding to one run each.
	// In case of a discrepancy, the function returns [error, details]; otherwise both strings are empty.
	module.compare_runs = function(submission, solution, marker:any = null)
	{
		if (! marker) marker = "f2NXpgk65Tjbe8fm2kcjJu19dNGb9aD0e";   // some random string
		let table = '<table class="code-evaluation">\r\n<tr><th>Ihre Lösung</th><th>Musterlösung</th></tr>\r\n';
		let addrow = function(solution, submission, cls="")
		{
			let s = "<tr><td";
			if (cls != "") s += " class=\"" + cls + "\"";
			s += ">";
			if (submission !== null)
			{
				s += "event type: " + escape(submission.type) + "<br/>";
				for (let p in submission)
				{
					if (! submission.hasOwnProperty(p)) continue;
					if (p == "type") continue;
					s += escape(p) + ": " + escape(JSON.stringify(submission[p]));
				}
			}
			s += "</td><td";
			if (cls != "") s += " class=\"" + cls + "\"";
			s += ">";
			if (solution !== null)
			{
				s += "event type: " + escape(solution.type) + "<br/>";
				for (let p in solution)
				{
					if (! solution.hasOwnProperty(p)) continue;
					if (p == "type") continue;
					s += escape(p) + ": " + escape(JSON.stringify(solution[p]));
				}
			}
			s += "</td></tr>\r\n";
			return s;
		};

		// check which events are present in the sample solution
		let expected_events:any = {};
		for (let i=0; i<solution.length; i++)
		{
			let s = solution[i];
			if (! s.type) continue;
			if (s.type == "print" && s.value.indexOf(marker) >= 0) expected_events.marker = true;
			else expected_events[s.type] = true;
		}

		// extract function return type and value, if present
		let return_sub_type = "", return_sub_value = "";
		let return_sol_type = "", return_sol_value = "";
		if (submission.length > 0 && submission[submission.length-1].type == "print" && submission[submission.length-1].value.indexOf(marker) >= 0)
		{
			let s = submission[submission.length-1].value;
			let pos = s.indexOf(marker);
			return_sub_type = s.substr(0, pos);
			return_sub_value = s.substr(pos + marker.length);
			submission.splice(submission.length-1, 1);
		}
		if (solution.length > 0 && solution[solution.length-1].type == "print" && solution[solution.length-1].value.indexOf(marker) >= 0)
		{
			let s = solution[solution.length-1].value;
			let pos = s.indexOf(marker);
			return_sol_type = s.substr(0, pos);
			return_sol_value = s.substr(pos + marker.length);
			solution.splice(solution.length-1, 1);
		}

		// check for errors
		let wanted_errors = {"assertion failed": true, "uncaught exception": true, "runtime error;": true};   // note the semicolon in "runtime error;" -- this string matches only errors raised by error(...)
		let i=0, j=0;
		while (i < submission.length)
		{
			if (submission[i].type == "compile error") return ["Der Code konnte nicht ausgeführt werden - " + submission[i].message, ""];
			let type = submission[i].type;
			if (type == "print" && submission[i].value.indexOf(marker) >= 0) type = "marker";
			if (j >= solution.length)
			{
				if (type == "runtime error") return ["Fehler bei der Ausführung des Codes - " + submission[i].message, table];
				else if (expected_events.hasOwnProperty(type))
				{
					table += addrow(null, submission[i], "error");
					table += "</table>\r\n";
					let error = "unerwartete überzählige Ausgabe";
					if (isObject(submission[i]) && submission[i].hasOwnProperty("type")) error += " vom Typ " + type;
					return [error, table];
				}
			}
			if (type == "runtime error")
			{
				let wanted:string|null = null;
				for (let w_error in wanted_errors)
				{
					if (! wanted_errors.hasOwnProperty(w_error)) continue;
					if (submission[i].message.indexOf(w_error) >= 0) wanted = w_error;
				}
				if (solution[j].type == "runtime error")
				{
					if (solution[j].message.indexOf(wanted) >= 0)
					{
						i++;
						j++;
						continue;   // wanted error, same as in the reference solution
					}
					else
					{
						table += addrow(solution[j], submission[i], "error");
						table += "</table>\r\n";
						return ["Unerwarteter Fehler bei Ausführung des Codes; erwarteter Fehler: " + solution[i].message + " - erhaltener Fehler: " + submission[i].message, table];
					}
				}
				return ["Fehler bei der Ausführung des Codes - " + submission[i].message, ""];
			}
			if (! expected_events.hasOwnProperty(type))
			{
				if (type != "marker") table += addrow(null, submission[i], "ignored");
				i++;
				continue;
			}
			let error = compare_events(submission[i], solution[j]);
			if (error != "")
			{
				table += addrow(solution[j], submission[i], "error");
				table += "</table>\r\n";
				return [error, table];
			}
			if (type != "marker") table += addrow(solution[j], submission[i]);
			i++;
			j++;
		}

		if (j < solution.length)
		{
			table += addrow(solution[j], null, "error");
			table += "</table>\r\n";
			let error = "";
			if (solution[j].type == "runtime error") error = "Laufzeitfehler erwartet";
			else
			{
				error = "Fehlende Ausgabe";
				if (isObject(solution[j]) && solution[j].hasOwnProperty("type")) error += " vom Typ " + JSON.stringify(solution[j].type);
			}
			return [error, table];
		}

		table += "</table>\r\n";

		// check the return value
		if (return_sub_type == "" && return_sol_type == "") return ["", ""];
		if (return_sub_type == "") return ["Fehlender Rückgabewert - erwartet " + return_sol_value + " vom Typ " + return_sol_type + "; die Funktion terminiert, ohne einen Wert zurück zu geben", ""];
		if (return_sol_type == "") throw new Error("internal error: missing return type in compare_runs");

		if (return_sub_type != return_sol_type) return ["Falscher Typ der Rückgabe - erwartet: " + return_sol_type + " - erhalten: " + return_sub_type, ""];
		let cmp = compare_events(return_sub_value, return_sol_value);
		if (cmp == "") return ["", ""];
		else return ["Falscher Rückgabewert - erwartet: " + return_sol_value + " vom Typ " + return_sol_type + " - erhalten: " + return_sub_value + " vom Typ " + return_sub_type, ""];
	}

	// create an interpreter with specialized services for observing the
	// runtime behavior of a program
	function createInterpreter(program, inputs, output)
	{
		let interpreter = new Interpreter(program, createDefaultServices());
		let orig_turtle_move = interpreter.service.turtle.move;
		interpreter.service.print = (function(msg)
				{
					output.push({"type": "print", "value": msg});
				});
		interpreter.service.alert = (function(msg)
				{
					output.push({"type": "alert", "value": msg});
				});
		interpreter.service.message = (function(msg, line:any = null, ch:any = null, href:any = "")
				{
					output.push({"type": "runtime error", "message": msg, "line": line});
				});
		interpreter.service.confirm = (function(msg)
				{
					if (!inputs || inputs.length == 0) return false;
					else return !!inputs.shift();
				});
		interpreter.service.prompt = (function(msg)
				{
					if (!inputs || inputs.length == 0) return "";
					else return inputs.shift();
				});
		interpreter.service.turtle.move = (function(distance)
				{
					let x0 = interpreter.service.turtle.x;
					let y0 = interpreter.service.turtle.y;
					orig_turtle_move.call(this, distance);
					let x1 = interpreter.service.turtle.x;
					let y1 = interpreter.service.turtle.y;
					if (interpreter.service.turtle.down) output.push({"type": "turtle line", "from": [x0, y0], "to": [x1, y1], "color": interpreter.service.turtle.rgb});
				});
		interpreter.service.canvas.dom = {"width": 1920, "height": 1080};
		interpreter.service.canvas.clear = (function()
				{
					output.push({"type": "canvas clear"});
				});
		interpreter.service.canvas.line = (function(x1, y1, x2, y2)
				{
					output.push({"type": "canvas line", "x1": x1, "y1": y1, "x2": x2, "y2": y2});
				});
		interpreter.service.canvas.rect = (function(left, top, width, height)
				{
					output.push({"type": "canvas rect", "left": left, "top": top, "width": width, "height": height});
				});
		interpreter.service.canvas.fillRect = (function(left, top, width, height)
				{
					output.push({"type": "canvas fillRect", "left": left, "top": top, "width": width, "height": height});
				});
		interpreter.service.canvas.frameRect = (function(left, top, width, height)
				{
					output.push({"type": "canvas frameRect", "left": left, "top": top, "width": width, "height": height});
				});
		interpreter.service.canvas.circle = (function(x, y, radius)
				{
					output.push({"type": "canvas circle", "x": x, "y": y, "radius": radius});
				});
		interpreter.service.canvas.fillCircle = (function(x, y, radius)
				{
					output.push({"type": "canvas fillCircle", "x": x, "y": y, "radius": radius});
				});
		interpreter.service.canvas.frameCircle = (function(x, y, radius)
				{
					output.push({"type": "canvas frameCircle", "x": x, "y": y, "radius": radius});
				});
		interpreter.service.canvas.curve = (function(points, closed)
				{
					output.push({"type": "canvas curve", "points": points, "closed": closed});
				});
		interpreter.service.canvas.fillArea = (function(points)
				{
					output.push({"type": "canvas fillArea", "points": points});
				});
		interpreter.service.canvas.frameArea = (function(points)
				{
					output.push({"type": "canvas frameArea", "points": points});
				});
		interpreter.service.canvas.text = (function(x, y, str)
				{
					output.push({"type": "canvas text", "x": x, "y": y, "str": str});
				});
		interpreter.service.canvas.reset = (function()
				{
					output.push({"type": "canvas reset"});
				});
		interpreter.service.canvas.shift = (function(dx, dy)
				{
					output.push({"type": "canvas shift", "dx": dx, "dy": dy});
				});
		interpreter.service.canvas.scale = (function(factor)
				{
					output.push({"type": "canvas scale", "factor": factor});
				});
		interpreter.service.canvas.rotate = (function(angle)
				{
					output.push({"type": "canvas rotate", "angle": angle});
				});
		interpreter.service.canvas.transform = (function(A, b)
				{
					output.push({"type": "canvas transform", "A": A, "b": b});
				});

		return interpreter;
	}

	// code is the TScript source code to run
	// maxseconds in the timeout, default=3
	// inputs in an array of values returned by consecutive calls to TScript's prompt, default=empty
	module.run_tscript = function(code, maxseconds, inputs)
	{
		if (! maxseconds) maxseconds = 3.0;

		if (inputs) inputs = inputs.slice();
		let output = new Array();

		let result = Parser.parse(code);
		let errors = result.errors;
		if (errors.length > 0)
		{
			for (let i=0; i<errors.length; i++)
			{
				let err = errors[i];
				output.push({"type": "compile error", "line": err.line, "message": err.message});
			}
			return output;
		}
		let program = result.program;

		// create an interpreter and prepare it for collecting output events
		let interpreter = createInterpreter(program, inputs, output);
		interpreter.stopthread();
		interpreter.reset();

		// run the program
		let timeout = (new Date()).getTime() + 1000 * maxseconds;
		while (true)
		{
			let start = (new Date()).getTime();
			if (start >= timeout)
			{
				output.push({"type": "timeout - program execution took too long"});
				return output;
			}

			if (interpreter.status == "waiting") interpreter.status = "running";
			if (interpreter.status != "running") break;

			while ((new Date()).getTime() - start < 14 && interpreter.status == "running")
			{
				interpreter.exec_step();
				if (interpreter.halt) break;
			}
			if (! interpreter.timerEventEnqueued)
			{
				interpreter.timerEventEnqueued = interpreter.enqueueEvent("timer", {"type": interpreter.program.types[Typeid.typeid_null], "value": {"b": null}});
			}
		}

		return output;
	}

	// This function runs multiple TScript programs. It returns immediately.
	// The programs are run in the background until they finish or time out.
	// * code is an array of TScript programs or JS test functions
	// * maxseconds is the timeout
	// * process is a function taking the array of event arrays as its argument for further processing.
	module.run_multiple = function(code, maxseconds, process)
	{
		let timeout = (new Date()).getTime() + 1000 * maxseconds;

		let index = 0;
		let all:any = new Array();
		let output = new Array();

		function compute() {
			let c = code[index];
			if (c[0] == "@")
			{
				let split = c.indexOf("\n@\n");
				let jsc = c.substr(1, split - 1);
				let tsc = c.substr(split + 3);
				let testfunction;
				eval("testfunction = function(code) {\n" + jsc + "\nreturn null; };\n");
				all.push(testfunction(tsc));
				output = new Array();
				index++;
				if (index == code.length) process(all);
				else compute();
			}
			else
			{
				let result = Parser.parse(c);
				let errors = result.errors;
				if (errors.length > 0)
				{
					for (let i=0; i<errors.length; i++)
					{
						let err = errors[i];
						output.push({"type": "compile error", "line": err.line, "message": err.message});
					}

					// output the collected output
					all.push(output);
					output = new Array();
					index++;
					if (index == code.length) process(all);
					else compute();
				}
				else
				{
					let program = result.program;

					// create an interpreter and prepare it for collecting output events
					let interpreter = createInterpreter(program, new Array(), output);
					interpreter.reset();

					// run the program
					interpreter.run();

					// stop when the program has finished
					function monitor()
					{
						if ((new Date()).getTime() > timeout)
						{
							interpreter.stopthread();
							all = null;
							process(all);
						}
						else if (interpreter.status == "finished" || interpreter.status == "error")
						{
							interpreter.stopthread();

							// output the collected output
							all.push(output);
							output = new Array();
							index++;
							if (index == code.length) process(all);
							else compute();
						}
						else setTimeout(monitor, 1);
					}
					setTimeout(monitor, 1);
				}
			}
		}
		compute();
	}


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
	module.isRecursiveStatic = function(program)
	{
		if (! program) return false;

		function isObject(value)
		{ return (value !== null && typeof value == "object" && value.constructor == Object); }

		function isNode(value)
		{ return Array.isArray(value) || isObject(value); }

		function rec(node, fnames)
		{
			if (node.builtin) return false;
			if (node.petype == "breakpoint") return false;

			if (node.petype == "function" && node.name)
			{
				let names = fnames.slice();
				names.push(node.name);
				fnames = names;
			}
			if (node.petype == "function call")
			{
				if (node.base.name && fnames.indexOf(node.base.name) >= 0) return true;
				if (node.base.petype == "this") return true;
			}
			for (let key in node)
			{
				if (! node.hasOwnProperty(key)) continue;
				if (reserved_node_names.hasOwnProperty(key)) continue;
				let n = node[key];
				if (isNode(n))
				{
					if (rec(n, fnames)) return true;
				}
			}
			return false;
		}

		return rec(program, new Array());
	}

	// dynamic behavior analysis, try to decide whether a program contains a recursive function or not
	module.isRecursiveDynamic = function(program, maxseconds, inputs)
	{
		if (! program) return false;

		if (! maxseconds) maxseconds = 3.0;

		if (inputs) inputs = inputs.slice();

		// create an interpreter with empty services
		let interpreter = new Interpreter(program, createDefaultServices());
		let orig_turtle_move = interpreter.service.turtle.move;
		interpreter.service.print = (function(msg) { });
		interpreter.service.alert = (function(msg) { });
		interpreter.service.message = (function(msg, line, ch, href) { });
		interpreter.service.prompt = (function(msg) { });
		interpreter.service.turtle.move = (function(distance) { });
		interpreter.service.canvas.dom = {"width": 1920, "height": 1080};
		interpreter.service.canvas.clear = (function() { });
		interpreter.service.canvas.line = (function(x1, y1, x2, y2) { });
		interpreter.service.canvas.rect = (function(left, top, width, height) { });
		interpreter.service.canvas.fillRect = (function(left, top, width, height) { });
		interpreter.service.canvas.frameRect = (function(left, top, width, height) { });
		interpreter.service.canvas.circle = (function(x, y, radius) { });
		interpreter.service.canvas.fillCircle = (function(x, y, radius) { });
		interpreter.service.canvas.frameCircle = (function(x, y, radius) { });
		interpreter.service.canvas.curve = (function(points, closed) { });
		interpreter.service.canvas.fillArea = (function(points) { });
		interpreter.service.canvas.frameArea = (function(points) { });
		interpreter.service.canvas.text = (function(x, y, str) { });
		interpreter.service.canvas.reset = (function() { });
		interpreter.service.canvas.shift = (function(dx, dy) { });
		interpreter.service.canvas.scale = (function(factor) { });
		interpreter.service.canvas.rotate = (function(angle) { });
		interpreter.service.canvas.transform = (function(A, b) { });
		interpreter.stopthread();
		interpreter.reset();

		// run the program
		let timeout = (new Date()).getTime() + 1000 * maxseconds;
		while (true)
		{
			let start = (new Date()).getTime();
			if (start >= timeout) break;   // not ideal, but better than an infinite loop

			if (interpreter.status == "waiting") interpreter.status = "running";
			if (interpreter.status != "running") break;

			while ((new Date()).getTime() - start < 14 && interpreter.status == "running")
			{
				interpreter.exec_step();

				// check for recursion
				let n = interpreter.stack.length;
				for (let i=0; i<n; i++)
				{
					for (let j=0; j<i; j++)
					{
						if (interpreter.stack[i].pe[0] === interpreter.stack[j].pe[0]) return true;
					}
				}

				if (interpreter.halt) break;
			}
			if (! interpreter.timerEventEnqueued)
			{
				interpreter.timerEventEnqueued = interpreter.enqueueEvent("timer", {"type": interpreter.program.types[Typeid.typeid_null], "value": {"b": null}});
			}
		}

		return false;
	}

	// Return true of the given (translated) program contains at least one
	// recursive function. The test is performed statically at first. If no
	// recursion is found then the program is executed -- hence make sure to
	// include test code that actually runs the recursion -- and the runtime
	// behavior is analyzed.
	module.isRecursive = function(program)
	{
		if (module.isRecursiveStatic(program)) return true;
		else return module.isRecursiveDynamic(program);
	}

	// Return true if the given (translated) program has a structure that is
	// compatible with the given pseudo code.
	module.hasStructure = function(program, pseudo)
	{
		function compilePseudo(code)
		{
			let pos = 0;

			function skipwhite()
			{
				while (pos < code.length && (code[pos] == ' ' || code[pos] == '\t' || code[pos] == '\n' || code[pos] == '\r')) pos++;
			}

			function identifier()
			{
				skipwhite();
				if (pos >= code.length) return null;
				let c = code[pos];
				if (c == '"')
				{
					let ret = "";
					pos++;
					while (pos < code.length)
					{
						c = code[pos];
						pos++;
						if (c == '"') return ret;
						else ret += c;
					}
					return null;
				}
				else if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_')
				{
					let ret = c;
					pos++;
					while (true)
					{
						c = code[pos];
						if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_')
						{
							ret += c;
							pos++;
						}
						else break;
					}
					return ret;
				}
				else return null;
			}

			function command()
			{
				let ident = identifier();
				if (ident === null) return null;

				let ret:any = { petype: ident };

				skipwhite();
				if (pos >= code.length) return null;
				let c = code[pos];
				if (c == '(')
				{
					pos++;
					let name = identifier();
					if (name === null) return null;
					skipwhite();
					let c = code[pos];
					if (c != ')') return null;
					pos++;
					ret.base = {name: name};
				}
				else if (c == '[')
				{
					pos++;
					let name = identifier();
					if (name === null) return null;
					skipwhite();
					let c = code[pos];
					if (c != ']') return null;
					pos++;
					ret.name = name;
				}

				skipwhite();
				if (pos >= code.length) return null;
				c = code[pos];
				if (c == '{')
				{
					pos++;
					let sub = new Array();
					while (true)
					{
						skipwhite();
						if (pos >= code.length) return null;
						if (code[pos] == ';') { pos++; continue; }
						if (code[pos] == '}')
						{
							pos++;
							ret.sub = sub.length == 1 ? sub[0] : sub;
							return ret;
						}
						let cmd = command();
						if (cmd === null) return null;
						sub.push(cmd);
					}
				}
				else if (c == ';')
				{
					pos++;
					return ret;
				}
				else return null;
			}

			skipwhite();
			if (pos >= code.length) return null;
			let c = code[pos];
			if (c == '{')
			{
				pos++;
				let ret = new Array;
				while (true)
				{
					skipwhite();
					if (pos >= code.length) return null;
					if (code[pos] == ';') { pos++; continue; }
					if (code[pos] == '}')
					{
						pos++;
						skipwhite();
						if (pos >= code.length) return ret;
						else return null;
					}
					let cmd = command();
					if (cmd === null) return null;
					ret.push(cmd);
				}
			}
			else
			{
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
		function isSubtree(key, data)
		{
			function isObject(value)
			{ return (value !== null && typeof value == "object" && value.constructor == Object); }

			function isNode(value)
			{ return Array.isArray(value) || isObject(value); }

			function equal(c1, c2)
			{
				if (c1.nstack.length != c2.nstack.length || c1.dstack.length != c2.dstack.length || c1.next.length != c2.next.length) return false;
				for (let i=0; i<c1.nstack.length; i++)
				{
					if (c1.nstack[i].length != c2.nstack[i].length) return false;
					for (let j=0; j<c1.nstack[i].length; j++)
					{
						if (c1.nstack[i][j] !== c2.nstack[i][j]) return false;
					}
				}
				for (let i=0; i<c1.dstack.length; i++)
				{
					if (c1.dstack[i] !== c2.dstack[i]) return false;
				}
				for (let i=0; i<c1.next.length; i++)
				{
					if (c1.next[i] !== c2.next[i]) return false;
				}
				return true;
			}

			// initial cursor
			let cs = [{ nstack: new Array(), dstack: new Array(), next: [key] }];

			// recursive traversal of the data tree
			function rec(node)
			{
				if (! node) return false;
				if (node.builtin) return false;
				if (node.petype == "breakpoint") return false;

				// forward pass: match nodes
				let ii = cs.length;
				for (let i=0; i<ii; i++)
				{
					let c = cs[i];
					if (c.next.length == 0) continue;   // this cursor is waiting for an ancestor of the current data node
					let next = c.next[0];
					if (! isNode(next)) throw new Error("[isSubtree] key node is not an array or object");

					// do the nodes match?
					let match = (Array.isArray(node) == Array.isArray(next));
					if (match && isObject(next))
					{
						if (next.hasOwnProperty("petype"))
						{
							let d = node.petype ? node.petype : "";
							let k = next.petype ? next.petype : "";
							match = (d.indexOf(k) >= 0);
						}
						if (match && (next.hasOwnProperty("name")))
						{
							let d = node.name ? node.name : "";
							let k = next.name ? next.name : "";
							match = (d == k);
						}
					}

					if (match)
					{
						// match found: create a new cursor
						// - create a new next array from the children of the key node
						// - add old next array with the first position removed and the data node to the stacks
						let ns = c.nstack.slice();
						let ds = c.dstack.slice();
						ns.push(c.next.slice(1));
						ds.push(node);
						let nx = new Array();
						for (let key in next)
						{
							if (! next.hasOwnProperty(key)) continue;
							if (reserved_node_names.hasOwnProperty(key)) continue;
							let n = next[key];
							if (isNode(n)) nx.push(n);
						}
						cs.push({nstack: ns, dstack: ds, next: nx});
					}
				}

				// recursion
				for (let key in node)
				{
					if (! node.hasOwnProperty(key)) continue;
					if (reserved_node_names.hasOwnProperty(key)) continue;
					let n = node[key];
					if (isNode(n))
					{
						if (rec(n)) return true;
					}
				}

				// backward pass: collect results
				let cs1 = new Array(), cs2 = new Array();
				for (let i=0; i<cs.length; i++)
				{
					let c = cs[i];
					if (c.dstack[c.dstack.length - 1] == node)
					{
						if (c.next.length > 0) continue;   // sub-tree match not completed: drop the cursor

						// move the cursor to the next sub-tree
						c.dstack.pop();
						c.next = c.nstack.pop();
						if (c.nstack.length == 0) return true;   // success!
						cs2.push(c);
					}
					else cs1.push(c);
				}

				// check for duplicate cursors
				cs = cs1;
				for (let i=0; i<cs2.length; i++)
				{
					let duplicate = false;
					for (let j=0; j<cs.length; j++)
					{
						if (equal(cs2[i], cs[j])) { duplicate = true; break; }
					}
					if (! duplicate) cs.push(cs2[i]);
				}

				return false;
			}

			return rec(data);
		}

		let pc = compilePseudo(pseudo);
		if (pc === null)
		{
			console.log("error in pseudo code:\n\n" + pseudo);
			return false;
		}
		return isSubtree(pc, program);
	}

	return module;
})();
