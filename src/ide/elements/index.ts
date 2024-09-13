import { TScript } from "../../lang";
import { get_function } from "../../lang/helpers/getParents";
import { Typeid } from "../../lang/helpers/typeIds";
import { createDefaultServices } from "../../lang/interpreter/defaultService";
import { Interpreter } from "../../lang/interpreter/interpreter";
import { Parser } from "../../lang/parser";
import { toClipboard } from "../clipboard";
import { icons } from "../icons";
import * as tgui from "../tgui";
import { tutorial } from "../tutorial";
import { buttons, cmd_export } from "./commands";
import { configDlg, loadConfig, saveConfig, options } from "./dialogs";
import { showdoc, showdocConfirm } from "./show-docs";
import * as utils from "./utils";
import { EditorCollection } from "./collection";
import {
	tab_config,
	createEditorTab,
	openEditorFromLocalStorage,
} from "./editor-tabs";

///////////////////////////////////////////////////////////
// IDE for TScript development
//

export let collection!: EditorCollection;
export let turtle: any = null;
export let canvas: any = null;
export let editor_title: any = null;
export let createTypedEvent: any = null;

export let panel_editor: any = null;
export let editorcontainer: any = null;
export let editortabs: any = null;

export let messages: any = null;
let messagecontainer: any = null;

export let stacktree: any = null;
export let programtree: any = null;
export let programstate: any = null;

/** current interpreter, non-null after successful parsing */
export let interpreter: Interpreter | null = null;

let main: any = null;
let toolbar: any = null;
let iconlist: any = null;
let highlight: any = null;
let runselector: HTMLSelectElement;

let standalone: boolean = false;

export function setStandalone(_standalone: boolean) {
	standalone = _standalone;
}

/**
 * add a message to the message panel
 */
export function addMessage(
	type: "print" | "warning" | "error",
	text: string,
	filename?: string,
	line?: number,
	ch?: number,
	href?: string
) {
	let color = { print: "#00f", warning: "#f80", error: "#f00" };
	let tr = tgui.createElement({
		type: "tr",
		parent: messages,
		classname: "ide",
		style: { "vertical-align": "top" },
	});
	let th = tgui.createElement({
		type: "th",
		parent: tr,
		classname: "ide",
		style: { width: "20px" },
	});
	let bullet = tgui.createElement({
		type: "span",
		parent: th,
		style: { width: "20px", color: color[type] },
		html: href ? "\u2139" : "\u2022",
	});
	if (href) {
		bullet.style.cursor = "pointer";
		bullet.addEventListener("click", function (event) {
			showdoc(href);
			return false;
		});
	}
	let td = tgui.createElement({
		type: "td",
		parent: tr,
		classname: "ide",
	});
	let lines = text.split("\n");
	for (let i = 0; i < lines.length; i++) {
		let s = lines[i];
		let msg = tgui.createElement({
			type: "div",
			parent: td,
			classname:
				"ide ide-message" +
				(type !== "print" ? " ide-errormessage" : ""),
			text: s,
		}) as any;
		if (typeof line !== "undefined") {
			msg.ide_filename = filename;
			msg.ide_line = line;
			msg.ide_ch = ch;
			msg.addEventListener("click", function (event) {
				utils.setCursorPosition(
					event.target.ide_line,
					event.target.ide_ch,
					filename!
				);
				if (
					interpreter &&
					(interpreter.status != "running" || !interpreter.background)
				) {
					utils.updateControls();
				}
				return false;
			});
		}
	}
	messagecontainer.scrollTop = messagecontainer.scrollHeight;
	return { symbol: th, content: td };
}

/**
 * Stop the interpreter and clear all output,
 * put the IDE into "not yet checked" mode.
 */
export function clear() {
	if (interpreter) {
		interpreter.stopthread();
		//interpreter.service.turtle.reset.call(interpreter, 0, 0, 0, true);
	}
	interpreter = null;

	tgui.clearElement(messages);

	let turtle_ctx = turtle.getContext("2d");
	turtle_ctx.setTransform(1, 0, 0, 1, 0, 0);
	turtle_ctx.clearRect(0, 0, turtle.width, turtle.height);

	let canvas_ctx = canvas.getContext("2d");
	canvas_ctx.setTransform(1, 0, 0, 1, 0, 0);
	canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas_ctx.lineWidth = 1;
	canvas_ctx.fillStyle = "#000";
	canvas_ctx.strokeStyle = "#000";
	canvas_ctx.font = "16px Helvetica";
	canvas_ctx.textAlign = "left";
	canvas_ctx.textBaseline = "top";
}

/**
 * Prepare everything for the program to start running,
 * put the IDE into stepping mode at the start of the program.
 */
export function prepare_run() {
	clear();

	let ed = collection.getActiveEditor();
	if (!ed) return;

	// make sure that there is a trailing line for the "end" breakpoint
	let source = ed.text();
	if (source.length !== 0 && source[source.length - 1] != "\n") {
		source += "\n";
	}

	const toParse = {
		documents: collection.getValues(),
		main: getRunSelection(),
	};

	let result = Parser.parse(toParse, options);
	let program = result.program;
	let errors = result.errors;
	if (errors) {
		for (let i = 0; i < errors.length; i++) {
			let err = errors[i];
			addMessage(
				err.type,
				err.type +
					(err.filename ? " in file '" + err.filename + "'" : "") +
					" in line " +
					err.line +
					": " +
					err.message,
				err.filename,
				err.line,
				err.ch,
				err.href
			);
		}
	}

	if (program) {
		interpreter = new Interpreter(program, createDefaultServices());
		interpreter.service.documentation_mode = false;
		interpreter.service.print = function (msg) {
			if (msg.length > 1000) {
				let m = addMessage(
					"print",
					"[truncated long message; click the symbol to copy the full message to the clipboard]\n" +
						msg.substr(0, 1000) +
						" \u2026"
				);
				m.content.classList.add("ide-truncation");
				m.symbol.innerHTML = "&#x1f4cb;";
				m.symbol.style.cursor = "copy";
				m.symbol.addEventListener(
					"click",
					(function (full) {
						return function (event) {
							toClipboard(full);
						};
					})(msg)
				);
			} else addMessage("print", msg);
			interpreter!.flush();
		};
		interpreter.service.alert = function (msg) {
			return new Promise((resolve, reject) => {
				let dlg = tgui.msgBox({
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
		};
		interpreter.service.confirm = function (msg) {
			return new Promise((resolve, reject) => {
				let value = false;
				let dlg = tgui.msgBox({
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
		};
		interpreter.service.prompt = function (msg) {
			return new Promise((resolve, reject) => {
				let input = tgui.createElement({
					type: "input",
					classname: "ide-prompt-input",
					properties: { type: "text" },
				});
				let value: string | null = null;
				let dlg = tgui.createModal({
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
		};
		interpreter.service.message = function (msg, filename, line, ch, href) {
			if (typeof filename === "undefined") filename = null;
			if (typeof line === "undefined") line = null;
			if (typeof ch === "undefined") ch = null;
			if (typeof href === "undefined") href = "";
			addMessage("error", msg, filename, line, ch, href);
		};
		interpreter.service.statechanged = function (stop) {
			if (stop) utils.updateControls();
			else utils.updateStatus();
			if (interpreter!.status === "finished") {
				let ed = collection.getActiveEditor();
				if (ed) ed.focus();
			}
		};
		interpreter.service.breakpoint = function () {
			utils.updateControls();
		};
		interpreter.service.turtle.dom = turtle;
		interpreter.service.canvas.dom = canvas;
		interpreter.eventnames["canvas.resize"] = true;
		interpreter.eventnames["canvas.mousedown"] = true;
		interpreter.eventnames["canvas.mouseup"] = true;
		interpreter.eventnames["canvas.mousemove"] = true;
		interpreter.eventnames["canvas.mouseout"] = true;
		interpreter.eventnames["canvas.keydown"] = true;
		interpreter.eventnames["canvas.keyup"] = true;
		interpreter.eventnames["timer"] = true;
		interpreter.reset();

		let breakpointsMoved = false;
		for (let ed of collection.getEditors()) {
			// set and correct breakpoints
			let br = ed.properties().breakpoints;
			let a = new Array<number>();
			for (let line of br) a.push(line + 1);

			let result = interpreter.defineBreakpoints(a, ed.properties().name);
			if (result !== null) {
				for (let line of br)
					if (!result.has(line))
						ed.properties().toggleBreakpoint(line);
				for (let line of result)
					if (!br.has(line)) ed.properties().toggleBreakpoint(line);
				breakpointsMoved = true;
			}
		}

		//		if (breakpointsMoved)
		//		{
		//			alert("Note: breakpoints were moved to valid locations");   // TODO: proper modal dialog!!!
		//		}
	}
}

export function create(container: HTMLElement, options?: any) {
	let config = loadConfig();

	if (!options)
		options = { "export-button": true, "documentation-button": true };

	tgui.releaseAllHotkeys();

	// create HTML elements of the GUI
	main = tgui.createElement({
		type: "div",
		parent: container,
		classname: "ide ide-main",
	});
	tgui.setHotkeyElement(main);

	toolbar = tgui.createElement({
		type: "div",
		parent: main,
		classname: "ide ide-toolbar",
	});

	// add the export button on demand
	if (options["export-button"]) {
		buttons.push({
			click: cmd_export,
			icon: icons.export,
			tooltip: "Export program as webpage",
			group: "export",
		});
	}

	buttons.push({
		click: function () {
			configDlg();
			return false;
		},
		icon: icons.config,
		tooltip: "Configuration",
		hotkey: "control-p",
		group: "config",
	});

	// prepare menu bar
	let curgroup: string = buttons[0].group;
	for (let i = 0; i < buttons.length; i++) {
		let description = Object.assign({}, buttons[i]);

		if (description.group !== curgroup) {
			tgui.createElement({
				type: "div",
				parent: toolbar,
				classname: "tgui tgui-control tgui-toolbar-separator",
			});
			curgroup = description.group;
		}

		description.width = 20;
		description.height = 20;
		description.style = { float: "left", height: "22px" };
		if (description.hotkey)
			description.tooltip += " (" + description.hotkey + ")";
		description.parent = toolbar;
		buttons[i].control = tgui.createButton(description);

		// Insert run-selector right after "run" button
		if (i === 4) {
			runselector = tgui.createElement({
				type: "select",
				parent: toolbar,
				classname: "tgui tgui-control",
				style: {
					float: "left",
					"min-width": "100px",
					height: "22px",
					"padding-left": "4px",
				},
			});
		}
	}

	tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui tgui-control tgui-toolbar-separator",
	});

	programstate = tgui.createLabel({
		parent: toolbar,
		style: {
			float: "left",
			width: "calc(min(250px, max(20px, 50vw - 270px)))",
			height: "22px",
			// clipping
			"white-space": "nowrap",
			overflow: "hidden",
			direction: "rtl",
			"text-overflow": "ellipsis clip",

			"text-align": "center",
		},
	});

	programstate.setStateCss = function (state) {
		let cls = `ide-state-${state}`;
		if (this.hasOwnProperty("state_css_class"))
			this.dom.classList.replace(this.state_css_class, cls);
		else this.dom.classList.add(cls);
		this.state_css_class = cls;
		return this;
	};
	// TODO set tooltip text to the content text, this should apply when the statusbox is too narrow
	programstate.unchecked = function () {
		this.setText("program has not been checked").setStateCss("unchecked");
	};
	programstate.error = function () {
		this.setText("an error has occurred").setStateCss("error");
	};
	programstate.running = function () {
		this.setText("program is running").setStateCss("running");
	};
	programstate.waiting = function () {
		this.setText("program is waiting").setStateCss("waiting");
	};
	programstate.stepping = function () {
		this.setText("program is in stepping mode").setStateCss("stepping");
	};
	programstate.finished = function () {
		this.setText("program has finished").setStateCss("finished");
	};
	programstate.unchecked();

	tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui tgui-control tgui-toolbar-separator",
	});

	tgui.createButton({
		click: function () {
			for (let i = 0; i < tgui.panels.length; i++) {
				let p = tgui.panels[i];
				if (p.name === "editor" || p.name === "messages")
					p.dock("left");
				else p.dock("right");
			}
			tgui.savePanelData();
			return false;
		},
		width: 20,
		height: 20,
		icon: icons.restorePanels,
		parent: toolbar,
		style: { float: "left" },
		tooltip: "Restore panels",
	});

	tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui tgui-control tgui-toolbar-separator",
	});

	iconlist = tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui",
		style: {
			float: "left",
			width: "fit-content",
			height: "100%",
			border: "none",
			margin: "3px",
		},
	});

	tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui tgui-control tgui-toolbar-separator",
	});

	if (options["documentation-button"]) {
		tgui.createButton({
			click: () => showdoc(""),
			text: "Documentation",
			parent: toolbar,
			style: { position: "absolute", height: "22px", right: "0px" },
		});

		// pressing F1
		tgui.setHotkey("F1", function () {
			const ed = collection.getActiveEditor();
			if (!ed) return;

			let selection = ed.selection();
			if (!selection) {
				ed.selectWordAtCursor();
				selection = ed.selection();
			}
			if (!selection) return;

			// maximum limit of 30 characters
			// so that there is no problem, when accidentally everything
			// in a file is selected
			selection = selection.slice(0, 30);
			const words = selection.match(/[a-z]+/gi); // global case insensitive
			showdocConfirm(undefined, words?.join(" "));
		});
	}

	// area containing all panels
	let area = tgui.createElement({
		type: "div",
		parent: main,
		classname: "ide ide-panel-area",
	});

	// prepare tgui panels
	tgui.preparePanels(area, iconlist);

	collection = new EditorCollection();

	panel_editor = tgui.createPanel({
		name: "tab_editor",
		title: `Editor \u2014 ${name}`,
		state: "left",
		fallbackState: "icon",
		icon: icons.editor,
		//		onClose: () => {
		//			confirmFileDiscard(name, () => closeEditor(name));
		//		},
	});
	panel_editor.content.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		return false;
	});

	if (config.hasOwnProperty("tabs")) {
		for (let key in config.tabs) tab_config[key] = config.tabs[key];
	}
	let p = tgui.createElement({
		type: "div",
		parent: panel_editor.content,
		classname: "tabs-container " + tab_config.align,
	});
	editortabs = tgui.createElement({
		type: "div",
		parent: p,
		classname: "tabs",
	});
	let s = tgui.createElement({
		type: "div",
		parent: editortabs,
		classname: "switch",
		text: "\u21CC",
		click: function (event) {
			p.classList.toggle("horizontal");
			p.classList.toggle("vertical");
			tab_config.align =
				tab_config.align === "horizontal" ? "vertical" : "horizontal";
			saveConfig();
		},
	});
	editorcontainer = tgui.createElement({
		type: "div",
		parent: p,
		classname: "editorcontainer",
	});

	if (config.hasOwnProperty("open")) {
		for (let filename of config.open) {
			console.log("[create]", filename);
			openEditorFromLocalStorage(filename, false);
		}
	}
	if (config.hasOwnProperty("active")) {
		let ed = collection.getEditor(config.active);
		if (ed) collection.setActiveEditor(ed, false);
	}

	if (collection.getEditors().size === 0) {
		const ed = openEditorFromLocalStorage("Main");
		if (!ed) createEditorTab("Main");
	}

	let panel_messages = tgui.createPanel({
		name: "messages",
		title: "Messages",
		state: "left",
		dockedheight: 200,
		icon: icons.messages,
	});
	messagecontainer = tgui.createElement({
		type: "div",
		parent: panel_messages.content,
		classname: "ide ide-messages",
	});
	messages = tgui.createElement({
		type: "table",
		parent: messagecontainer,
		classname: "ide",
		style: { width: "100%" },
	});

	// prepare stack tree control
	let panel_stackview = tgui.createPanel({
		name: "stack",
		title: "Stack",
		state: "icon",
		fallbackState: "right",
		icon: icons.stackView,
	});
	stacktree = tgui.createTreeControl({
		parent: panel_stackview.content,
	});

	// prepare program tree control
	let panel_programview = tgui.createPanel({
		name: "program",
		title: "Program",
		state: "icon",
		fallbackState: "right",
		icon: icons.programView,
	});
	programtree = tgui.createTreeControl({
		parent: panel_programview.content,
		nodeclick: function (event, value, id) {
			if (value.where) {
				utils.setCursorPosition(
					value.where.line,
					value.where.ch,
					value.where.filename
				);
			}
		},
	});

	// prepare turtle output panel
	let panel_turtle = tgui.createPanel({
		name: "turtle",
		title: "Turtle",
		state: "right",
		fallbackState: "float",
		icon: icons.turtle,
	});
	turtle = tgui.createElement({
		type: "canvas",
		parent: panel_turtle.content,
		properties: { width: "600", height: "600" },
		classname: "ide ide-turtle",
	});
	turtle.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		return false;
	});

	// ensure that the turtle area remains square and centered
	let makeSquare = function () {
		let w = turtle.parentElement.offsetWidth;
		let h = turtle.parentElement.offsetHeight;
		let size = Math.min(w, h);
		turtle.style.width = size + "px";
		turtle.style.height = size + "px";
		turtle.style.marginLeft =
			(w > size ? Math.floor((w - size) / 2) : 0) + "px";
		turtle.style.marginTop =
			(h > size ? Math.floor((h - size) / 2) : 0) + "px";
	};
	panel_turtle.onArrange = makeSquare;
	panel_turtle.onResize = makeSquare;

	createTypedEvent = function (displayname, dict) {
		if (!interpreter) throw new Error("[createTypedEvent] internal error");
		let p = interpreter.program;
		for (let idx = 10; idx < p.types.length; idx++) {
			let t = p.types[idx];
			if (t.displayname === displayname) {
				// create the object without calling the constructor, considering default values, etc
				let obj: any = { type: t, value: { a: [] } };
				let n = {
					type: p.types[Typeid.typeid_null],
					value: { b: null },
				};
				for (let i = 0; i < t.objectsize; i++) obj.value.a.push(n);

				// fill its attributes
				for (let key in t.members) {
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
	};

	// prepare canvas output panel
	let panel_canvas = tgui.createPanel({
		name: "canvas",
		title: "Canvas",
		state: "icon",
		fallbackState: "right",
		onResize: function (w, h) {
			if (!standalone && canvas) {
				canvas.width = w;
				canvas.height = h;
			}
			if (interpreter) {
				let e: any = { width: w, height: h };
				e = createTypedEvent("canvas.ResizeEvent", e);
				interpreter.enqueueEvent("canvas.resize", e);
			}
		},
		icon: icons.canvas,
	});
	canvas = tgui.createElement({
		type: "canvas",
		parent: panel_canvas.content,
		properties: {
			width: panel_canvas.content.clientWidth.toString(),
			height: panel_canvas.content.clientHeight.toString(),
		},
		classname: "ide ide-canvas",
	});
	canvas.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		return false;
	});
	panel_canvas.content.tabIndex = -1;
	panel_canvas.size = [0, 0];
	//	module.canvas.font_size = 16;
	function buttonName(button) {
		if (button === 0) return "left";
		else if (button === 1) return "middle";
		else return "right";
	}
	function buttonNames(buttons) {
		let ret = new Array();
		if (buttons & 1) ret.push("left");
		if (buttons & 4) ret.push("middle");
		if (buttons & 2) ret.push("right");
		return ret;
	}
	let ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.fillStyle = "#000";
	ctx.strokeStyle = "#000";
	ctx.font = "16px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	canvas.addEventListener("mousedown", function (event) {
		if (
			!interpreter ||
			!interpreter.background ||
			(interpreter.status != "running" &&
				interpreter.status != "waiting" &&
				interpreter.status != "dialog")
		)
			return;
		let e: any = {
			button: buttonName(event.button),
			buttons: buttonNames(event.buttons),
			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey,
		};
		e = Object.assign(e, utils.relpos(canvas, event.pageX, event.pageY));
		e = createTypedEvent("canvas.MouseButtonEvent", e);
		interpreter.enqueueEvent("canvas.mousedown", e);
	});
	canvas.addEventListener("mouseup", function (event) {
		if (
			!interpreter ||
			!interpreter.background ||
			(interpreter.status != "running" &&
				interpreter.status != "waiting" &&
				interpreter.status != "dialog")
		)
			return;
		let e: any = {
			button: buttonName(event.button),
			buttons: buttonNames(event.buttons),
			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey,
		};
		e = Object.assign(e, utils.relpos(canvas, event.pageX, event.pageY));
		e = createTypedEvent("canvas.MouseButtonEvent", e);
		interpreter.enqueueEvent("canvas.mouseup", e);
	});
	canvas.addEventListener("mousemove", function (event) {
		if (
			!interpreter ||
			!interpreter.background ||
			(interpreter.status != "running" &&
				interpreter.status != "waiting" &&
				interpreter.status != "dialog")
		)
			return;
		let e: any = {
			button: 0,
			buttons: buttonNames(event.buttons),
			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey,
		};
		e = Object.assign(e, utils.relpos(canvas, event.pageX, event.pageY));
		e = createTypedEvent("canvas.MouseMoveEvent", e);
		interpreter.enqueueEvent("canvas.mousemove", e);
	});
	canvas.addEventListener("mouseout", function (event) {
		if (
			!interpreter ||
			!interpreter.background ||
			(interpreter.status != "running" &&
				interpreter.status != "waiting" &&
				interpreter.status != "dialog")
		)
			return;
		let e = {
			type: interpreter.program.types[Typeid.typeid_null],
			value: { b: null },
		};
		interpreter.enqueueEvent("canvas.mouseout", e);
	});
	panel_canvas.content.addEventListener("keydown", function (event) {
		if (
			!interpreter ||
			!interpreter.background ||
			(interpreter.status != "running" &&
				interpreter.status != "waiting" &&
				interpreter.status != "dialog")
		)
			return;
		let e: any = {
			key: event.key,
			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey,
		};
		e = createTypedEvent("canvas.KeyboardEvent", e);
		interpreter.enqueueEvent("canvas.keydown", e);
	});
	panel_canvas.content.addEventListener("keyup", function (event) {
		if (
			!interpreter ||
			!interpreter.background ||
			(interpreter.status != "running" &&
				interpreter.status != "waiting" &&
				interpreter.status != "dialog")
		)
			return;
		let e: any = {
			key: event.key,
			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey,
		};
		e = createTypedEvent("canvas.KeyboardEvent", e);
		interpreter.enqueueEvent("canvas.keyup", e);
	});

	let panel_tutorial = tgui.createPanel({
		name: "tutorial",
		title: "Tutorial",
		state: "icon",
		fallbackState: "right",
		dockedheight: 400,
		icon: icons.tutorial,
	});
	let tutorial_container = tgui.createElement({
		type: "div",
		parent: panel_tutorial.content,
		classname: "ide ide-tutorial",
	});
	tutorial.init(
		tutorial_container,
		function () {
			let ed = collection.getActiveEditor();
			return ed ? ed.text() : "";
		},
		function () {
			messages.innerHTML = "";
		},
		function (error) {
			addMessage("error", error);
		}
	);

	tgui.arrangePanels();
	window["TScriptIDE"] = { tgui: tgui, ide: module };
}

/**
 * Returns the current filename, selected in the run-selector
 */
export function getRunSelection() {
	return runselector.value;
}

/**
 * Updates the run-selector
 */
export function updateRunSelection() {
	runselector.innerHTML = "";
	for (let ed of collection.getEditors()) {
		let name = ed.properties().name;
		tgui.createElement({
			type: "option",
			parent: runselector,
			properties: { value: name },
			text: name,
		});
	}
	runselector.disabled = collection.getEditors().size === 0;
}
