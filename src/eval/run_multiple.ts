import { Parser } from "../lang/parser";
import { Interpreter } from "../lang/interpreter/interpreter";
import { isRecursive } from "./isRecursive";
import { hasStructure } from "./hasStructure";
import { createInterpreter } from "./createInterpreter";

// This function runs multiple TScript programs. It returns immediately.
// The programs are run asynchronously in the background until they finish or time out.
// Parameters:
//  - code is an array of TScript programs or JS test functions
//  - inputs is an array of arrays, containing values returned by consecutive calls to TScript's confirm or prompt.
//  - maxseconds is the timeout
//  - process is a function taking the array of event arrays as its argument for further processing.
export function run_multiple(code, inputs, maxseconds, process) {
	let timeout = new Date().getTime() + 1000 * maxseconds;

	let index = 0;
	let all: any = new Array();
	let output = new Array();
	for (let i = 0; i < inputs.length; i++) inputs[i] = inputs[i].slice();

	function compute() {
		let c = code[index];
		if (c[0] === "@") {
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
				testfunction(tsc, Parser.parse, hasStructure, isRecursive)
			);
			output = new Array();
			index++;
			if (index === code.length) process(all);
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
				if (index === code.length) process(all);
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
						interpreter.status === "finished" ||
						interpreter.status === "error"
					) {
						interpreter.stopthread();

						// output the collected output
						all.push(output);
						output = new Array();
						index++;
						if (index === code.length) process(all);
						else compute();
					} else setTimeout(monitor, 1);
				}
				setTimeout(monitor, 1);
			}
		}
	}
	compute();
}
