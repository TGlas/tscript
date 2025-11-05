import { TScript } from "../../lang";
import { Typeid } from "../../lang/helpers/typeIds";
import { createDefaultServices } from "../../lang/interpreter/defaultService";
import { Interpreter } from "../../lang/interpreter/interpreter";
import { ProgramRoot } from "../../lang/interpreter/program-elements";
import * as tgui from "../tgui";
import { interpreterEnded } from "./utils";

/**
 * Create an Interpreter and configure it for use in the IDE or standalone
 */
export function createIDEInterpreter(program: ProgramRoot) {
	const service: any = createDefaultServices();
	service.documentation_mode = false;
	service.alert = (msg: string) =>
		new Promise((resolve, reject) => {
			tgui.msgBox({
				title: "",
				prompt: msg,
				buttons: [{ text: "Okay", isDefault: true }],
				enterConfirms: true,
				onClose: () => {
					resolve(null);
					return false;
				},
			});
		});
	service.confirm = (msg: string) =>
		new Promise((resolve, reject) => {
			let value = false;
			tgui.msgBox({
				title: "Question",
				prompt: msg,
				icon: tgui.msgBoxQuestion,
				buttons: [
					{
						text: "Yes",
						isDefault: true,
						onClick: () => {
							value = true;
							return false;
						},
					},
					{
						text: "No",
						isDefault: false,
						onClick: () => {
							value = false;
							return false;
						},
					},
				],
				enterConfirms: true,
				onClose: () => {
					resolve(value);
					return false;
				},
			});
		});
	service.prompt = (msg: string) =>
		new Promise((resolve, reject) => {
			const input = tgui.createElement({
				type: "input",
				classname: "ide-prompt-input",
				properties: { type: "text" },
			});
			let value: string | null = null;
			const dlg = tgui.createModal({
				title: "Input",
				scalesize: [0.2, 0.15],
				minsize: [400, 250],
				buttons: [
					{
						text: "Okay",
						isDefault: true,
						onClick: () => {
							value = input.value;
							return false;
						},
					},
					{
						text: "Cancel",
						isDefault: false,
						onClick: () => {
							return false;
						},
					},
				],
				enterConfirms: true,
				onClose: () => {
					resolve(value);
					return false;
				},
			});
			tgui.createElement({
				type: "p",
				parent: dlg.content,
				text: msg,
				style: {
					"white-space": "pre-wrap", // do linebreaks
				},
			});
			dlg.content.appendChild(input);
			tgui.startModal(dlg);
			input.focus();
		});

	const interpreter = new Interpreter(program, service);
	interpreter.eventnames["canvas.resize"] = true;
	interpreter.eventnames["canvas.mousedown"] = true;
	interpreter.eventnames["canvas.mouseup"] = true;
	interpreter.eventnames["canvas.mousemove"] = true;
	interpreter.eventnames["canvas.mouseout"] = true;
	interpreter.eventnames["canvas.keydown"] = true;
	interpreter.eventnames["canvas.keyup"] = true;
	interpreter.eventnames["timer"] = true;
	interpreter.reset();
	return interpreter;
}

export function createTurtle(container: HTMLElement, signal?: AbortSignal) {
	const turtle = document.createElement("canvas");
	turtle.className = "ide ide-turtle";
	turtle.width = 600;
	turtle.height = 600;

	turtle.addEventListener("contextmenu", (event) => {
		event.preventDefault();
	});

	// ensure that the turtle area remains square and centered
	function resize(w: number, h: number) {
		const size = Math.min(w, h);
		turtle.style.width = size + "px";
		turtle.style.height = size + "px";
	}
	const containerRect = container.getBoundingClientRect();
	resize(containerRect.width, containerRect.height);

	const resizeObserver = new ResizeObserver((entries) => {
		const size = entries[0].contentBoxSize[0];
		resize(size.inlineSize, size.blockSize);
	});
	resizeObserver.observe(container);
	signal?.addEventListener("abort", () => resizeObserver.disconnect());

	// reset content
	const ctx = turtle.getContext("2d")!;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, turtle.width, turtle.height);

	return turtle;
}

export function createCanvas(
	interpreter: Interpreter,
	container: HTMLElement,
	signal?: AbortSignal
): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.width = container.clientWidth;
	canvas.height = container.clientHeight;

	// resize the canvas with its container
	const resizeObserver = new ResizeObserver((entries) => {
		const size = entries[0].contentBoxSize[0];
		if (
			canvas.width === size.inlineSize &&
			canvas.height === size.blockSize
		)
			return; // webkit fix
		canvas.width = size.inlineSize;
		canvas.height = size.blockSize;

		const event = createTypedEvent("canvas.ResizeEvent", {
			width: size.inlineSize,
			height: size.blockSize,
		});
		interpreter.enqueueEvent("canvas.resize", event);
	});
	resizeObserver.observe(container);
	signal?.addEventListener("abort", () => resizeObserver.disconnect());

	// reset canvas content
	const ctx = canvas.getContext("2d")!;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = 1;
	ctx.fillStyle = "#000";
	ctx.strokeStyle = "#000";
	ctx.font = "16px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	canvas.addEventListener("contextmenu", (event) => {
		event.preventDefault();
	});

	// mouse events
	canvas.addEventListener("mousedown", (event) => {
		if (!isRunning(interpreter)) return;
		const e = createTypedEvent(
			"canvas.MouseButtonEvent",
			mouseEventData(event, buttonName(event.button))
		);
		interpreter.enqueueEvent("canvas.mousedown", e);
	});
	canvas.addEventListener("mouseup", (event) => {
		if (!isRunning(interpreter)) return;
		const e = createTypedEvent(
			"canvas.MouseButtonEvent",
			mouseEventData(event, buttonName(event.button))
		);
		interpreter.enqueueEvent("canvas.mouseup", e);
	});
	canvas.addEventListener("mousemove", (event) => {
		if (!isRunning(interpreter)) return;
		const e = createTypedEvent(
			"canvas.MouseMoveEvent",
			mouseEventData(event)
		);
		interpreter.enqueueEvent("canvas.mousemove", e);
	});
	canvas.addEventListener("mouseout", () => {
		if (!isRunning(interpreter)) return;
		const e = {
			type: interpreter.program.types[Typeid.typeid_null],
			value: { b: null },
		};
		interpreter.enqueueEvent("canvas.mouseout", e);
	});

	// keyboard events
	container.addEventListener(
		"keydown",
		(event) => {
			if (!isRunning(interpreter)) return;
			const e = createTypedEvent(
				"canvas.KeyboardEvent",
				keyboardEventData(event)
			);
			interpreter.enqueueEvent("canvas.keydown", e);
		},
		{ signal }
	);
	container.addEventListener(
		"keyup",
		(event) => {
			if (!isRunning(interpreter)) return;
			const e = createTypedEvent(
				"canvas.KeyboardEvent",
				keyboardEventData(event)
			);
			interpreter.enqueueEvent("canvas.keyup", e);
		},
		{ signal }
	);

	function createTypedEvent(displayname: string, dict: object): any {
		const p = interpreter.program;
		for (let idx = 10; idx < p.types.length; idx++) {
			const t = p.types[idx];
			if (t.displayname === displayname) {
				// create the object without calling the constructor, considering default values, etc
				const obj: any = { type: t, value: { a: [] } };
				const n = {
					type: p.types[Typeid.typeid_null],
					value: { b: null },
				};
				for (let i = 0; i < t.objectsize; i++) obj.value.a.push(n);

				// fill its attributes
				for (const key in t.members) {
					if (!dict.hasOwnProperty(key)) continue;
					obj.value.a[t.members[key].id] = TScript.json2typed.call(
						interpreter,
						dict[key]
					);
				}
				return obj;
			}
		}
		throw new Error("[createTypedEvent] unknown type " + displayname);
	}

	return canvas;
}

const isRunning = (interpreter: Interpreter) =>
	interpreter.background && !interpreterEnded(interpreter);

function mouseEventData(event: MouseEvent, button?: string) {
	const el = event.currentTarget as HTMLElement;
	const canvasRect = el.getBoundingClientRect();
	return {
		x: event.clientX - canvasRect.x,
		y: event.clientY - canvasRect.y,
		button,
		buttons: buttonNames(event.buttons),
		shift: event.shiftKey,
		control: event.ctrlKey,
		alt: event.altKey,
		meta: event.metaKey,
	};
}

function buttonName(button: number): string {
	if (button === 0) return "left";
	else if (button === 1) return "middle";
	else return "right";
}

function buttonNames(buttons: number) {
	const result: string[] = [];
	if (buttons & 1) result.push("left");
	if (buttons & 4) result.push("middle");
	if (buttons & 2) result.push("right");
	return result;
}

const keyboardEventData = (event: KeyboardEvent) => ({
	key: event.key,
	shift: event.shiftKey,
	control: event.ctrlKey,
	alt: event.altKey,
	meta: event.metaKey,
});
