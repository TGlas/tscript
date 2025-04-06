import { Typeid } from "../lang/helpers/typeIds";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";
import { ProgramRoot } from "../lang/interpreter/program-elements";
import { reserved_node_names } from "./reserved_node_names";

// static code analysis, try to decide whether a program contains a recursive function or not
function isRecursiveStatic(program: ProgramRoot) {
	if (!program) return false;

	function isObject(value) {
		return (
			value !== null &&
			typeof value === "object" &&
			value.constructor === Object
		);
	}

	function isNode(value) {
		return Array.isArray(value) || isObject(value);
	}

	function rec(node, fnames) {
		if (node.builtin) return false;
		if (node.petype === "breakpoint") return false;

		if (node.petype === "function" && node.name) {
			let names = fnames.slice();
			names.push(node.name);
			fnames = names;
		}
		if (node.petype === "function call") {
			if (node.base.name && fnames.indexOf(node.base.name) >= 0)
				return true;
			if (node.base.petype === "this") return true;
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
function isRecursiveDynamic(
	program: ProgramRoot,
	maxseconds = 3.0,
	inputs = []
) {
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
	interpreter.service.canvas.rect = function (left, top, width, height) {};
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

		if (interpreter.status === "waiting") interpreter.status = "running";
		if (interpreter.status != "running") break;

		while (
			new Date().getTime() - start < 14 &&
			interpreter.status === "running"
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
			interpreter.timerEventEnqueued = interpreter.enqueueEvent("timer", {
				type: interpreter.program.types[Typeid.typeid_null],
				value: { b: null },
			});
		}
	}

	return false;
}

// Return true if the given (translated) program contains at least one
// recursive function. The test is performed statically at first. If no
// recursion is found then the program is executed -- hence make sure to
// include test code that actually invokes the recursion -- and the
// runtime behavior is analyzed.
export function isRecursive(program: ProgramRoot) {
	if (isRecursiveStatic(program)) return true;
	else return isRecursiveDynamic(program);
}
