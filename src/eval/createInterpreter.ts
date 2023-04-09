//import { Typeid } from "../lang/helpers/typeIds";
import { TScript } from "../lang";
//import { Parser } from "../lang/parser";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";

// create an interpreter with specialized services for observing the
// runtime behavior of a program
export function createInterpreter(program, inputs, output) {
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
		if (typeof inputs[i] === "object" && inputs[i] !== null) {
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
				event.value.a.push(TScript.json2typed.call(interpreter, null));
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
			if (!inputs || inputs.length === 0) resolve(false);
			else resolve(!!inputs.shift());
		});
	};
	interpreter.service.prompt = function (msg) {
		return new Promise((resolve, reject) => {
			if (!inputs || inputs.length === 0) resolve("");
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
	interpreter.service.canvas.fillRect = function (left, top, width, height) {
		output.push({
			type: "canvas fillRect",
			left: left,
			top: top,
			width: width,
			height: height,
		});
	};
	interpreter.service.canvas.frameRect = function (left, top, width, height) {
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
