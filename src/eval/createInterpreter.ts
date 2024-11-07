import { TScript } from "../lang";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";

// create an interpreter with specialized services for observing the
// runtime behavior of a program
export function createInterpreter(program, inputs, output) {
	let interpreter = new Interpreter(program, createDefaultServices());

	// current image transformation
	interpreter.service.canvas._trafo_a = Array(Array(1, 0), Array(0, 1));
	interpreter.service.canvas._trafo_b = Array(0, 0);

	// apply the current transformation to an array of points
	interpreter.service.canvas._transform = function (points) {
		let ret = Array();
		for (let p of points) {
			ret.push([
				interpreter.service.canvas._trafo_a[0][0] * p[0] +
					interpreter.service.canvas._trafo_a[0][1] * p[1] +
					interpreter.service.canvas._trafo_b[0],
				interpreter.service.canvas._trafo_a[1][0] * p[0] +
					interpreter.service.canvas._trafo_a[1][1] * p[1] +
					interpreter.service.canvas._trafo_b[1],
			]);
		}
		return ret;
	};

	// alter the current transformation by right-multiplying it with another transformation
	interpreter.service.canvas._multiply = function (a, b) {
		interpreter.service.canvas._trafo_a = [
			[
				interpreter.service.canvas._trafo_a[0][0] * a[0][0] +
					interpreter.service.canvas._trafo_a[0][1] * a[1][0],
				interpreter.service.canvas._trafo_a[1][0] * a[0][0] +
					interpreter.service.canvas._trafo_a[1][1] * a[1][0],
			],
			[
				interpreter.service.canvas._trafo_a[0][0] * a[0][1] +
					interpreter.service.canvas._trafo_a[0][1] * a[1][1],
				interpreter.service.canvas._trafo_a[1][0] * a[0][1] +
					interpreter.service.canvas._trafo_a[1][1] * a[1][1],
			],
		];
		interpreter.service.canvas._trafo_b = [
			interpreter.service.canvas._trafo_a[0][0] * b[0] +
				interpreter.service.canvas._trafo_a[0][1] * b[1] +
				interpreter.service.canvas._trafo_b[0],
			interpreter.service.canvas._trafo_a[1][0] * b[0] +
				interpreter.service.canvas._trafo_a[1][1] * b[1] +
				interpreter.service.canvas._trafo_b[1],
		];
	};

	// compute a quadratic form from the transformation
	interpreter.service.canvas._quadratic = function (scale) {
		scale *= scale;
		return [
			[
				scale *
					interpreter.service.canvas._trafo_a[0][0] *
					interpreter.service.canvas._trafo_a[0][0] +
					scale *
						interpreter.service.canvas._trafo_a[0][1] *
						interpreter.service.canvas._trafo_a[0][1],
				scale *
					interpreter.service.canvas._trafo_a[0][0] *
					interpreter.service.canvas._trafo_a[1][0] +
					scale *
						interpreter.service.canvas._trafo_a[0][1] *
						interpreter.service.canvas._trafo_a[1][1],
			],
			[
				scale *
					interpreter.service.canvas._trafo_a[1][0] *
					interpreter.service.canvas._trafo_a[0][0] +
					scale *
						interpreter.service.canvas._trafo_a[1][1] *
						interpreter.service.canvas._trafo_a[0][1],
				scale *
					interpreter.service.canvas._trafo_a[1][0] *
					interpreter.service.canvas._trafo_a[1][0] +
					scale *
						interpreter.service.canvas._trafo_a[1][1] *
						interpreter.service.canvas._trafo_a[1][1],
			],
		];
	};

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
		let points = interpreter.service.canvas._transform([
			[x1, y1],
			[x2, y2],
		]);
		output.push({
			type: "canvas line",
			from: points[0],
			to: points[1],
		});
	};
	interpreter.service.canvas.rect = function (left, top, width, height) {
		let points = interpreter.service.canvas._transform([
			[left, top],
			[left + width, top],
			[left + width, top + height],
			[left, top + height],
		]);
		output.push({
			type: "canvas line",
			from: points[0],
			to: points[1],
		});
		output.push({
			type: "canvas line",
			from: points[1],
			to: points[2],
		});
		output.push({
			type: "canvas line",
			from: points[2],
			to: points[3],
		});
		output.push({
			type: "canvas line",
			from: points[3],
			to: points[0],
		});
	};
	interpreter.service.canvas.fillRect = function (left, top, width, height) {
		let points = interpreter.service.canvas._transform([
			[left, top],
			[left + width, top],
			[left + width, top + height],
			[left, top + height],
		]);
		output.push({
			type: "canvas fill",
			points: points,
		});
	};
	interpreter.service.canvas.frameRect = function (left, top, width, height) {
		let points = interpreter.service.canvas._transform([
			[left, top],
			[left + width, top],
			[left + width, top + height],
			[left, top + height],
		]);
		output.push({
			type: "canvas fill",
			points: points,
		});
		output.push({
			type: "canvas line",
			from: points[0],
			to: points[1],
		});
		output.push({
			type: "canvas line",
			from: points[1],
			to: points[2],
		});
		output.push({
			type: "canvas line",
			from: points[2],
			to: points[3],
		});
		output.push({
			type: "canvas line",
			from: points[3],
			to: points[0],
		});
	};
	interpreter.service.canvas.circle = function (x, y, radius) {
		output.push({
			type: "canvas ellipse curve",
			center: interpreter.service.canvas._transform([[x, y]])[0],
			shape: interpreter.service.canvas._quadratic(radius),
		});
	};
	interpreter.service.canvas.fillCircle = function (x, y, radius) {
		output.push({
			type: "canvas ellipse fill",
			center: interpreter.service.canvas._transform([[x, y]])[0],
			shape: interpreter.service.canvas._quadratic(radius),
		});
	};
	interpreter.service.canvas.frameCircle = function (x, y, radius) {
		let c = interpreter.service.canvas._transform([[x, y]])[0];
		let q = interpreter.service.canvas._quadratic(radius);
		output.push({ type: "canvas ellipse fill", center: c, shape: q });
		output.push({ type: "canvas ellipse curve", center: c, shape: q });
	};
	interpreter.service.canvas.curve = function (points, closed) {
		let p = interpreter.service.canvas._transform(points);
		for (let i = 1; i < p.length; i++) {
			output.push({
				type: "canvas line",
				from: points[i - 1],
				to: points[i],
			});
		}
		if (closed) {
			output.push({
				type: "canvas line",
				from: points[points.length - 1],
				to: points[0],
			});
		}
	};
	interpreter.service.canvas.fillArea = function (points) {
		output.push({
			type: "canvas fill",
			points: interpreter.service.canvas._transform(points),
		});
	};
	interpreter.service.canvas.frameArea = function (points) {
		output.push({
			type: "canvas frame",
			points: interpreter.service.canvas._transform(points),
		});
	};
	interpreter.service.canvas.text = function (x, y, str) {
		let p = interpreter.service.canvas._transform([[x, y]])[0];
		output.push({ type: "canvas text", position: p, str: str });
	};
	interpreter.service.canvas.reset = function () {
		interpreter.service.canvas._trafo_a = [
			[1, 0],
			[0, 1],
		];
		interpreter.service.canvas._trafo_b = [0, 0];
	};
	interpreter.service.canvas.shift = function (dx, dy) {
		interpreter.service.canvas._multiply(
			[
				[1, 0],
				[0, 1],
			],
			[dx, dy]
		);
	};
	interpreter.service.canvas.scale = function (factor) {
		interpreter.service.canvas._multiply(
			[
				[factor, 0],
				[0, factor],
			],
			[0, 0]
		);
	};
	interpreter.service.canvas.rotate = function (angle) {
		let c = Math.cos(angle);
		let s = Math.sin(angle);
		interpreter.service.canvas._multiply(
			[
				[c, -s],
				[s, c],
			],
			[0, 0]
		);
	};
	interpreter.service.canvas.transform = function (A, b) {
		interpreter.service.canvas._multiply(A, b);
	};

	return interpreter;
}
