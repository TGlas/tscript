import { TScript } from "../lang";
import { Typeid } from "../lang/helpers/typeIds";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";
import { get_function } from "../lang/helpers/getParents";
import { Parser } from "../lang/parser";
import { icons } from "./icons";
import { tgui } from "./tgui";
import { toClipboard } from "./clipboard";
import { tutorial } from "./tutorial";
import { Options, defaultOptions } from "../lang/helpers/options";

import CodeMirror from "codemirror";

// CodeMirror Addons
import "codemirror/addon/selection/active-line";
import "codemirror/addon/comment/comment";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/jump-to-line";
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "./codemirror-tscriptmode";

///////////////////////////////////////////////////////////
// IDE for TScript development
//

export let ide = (function () {
	let module: any = {};
	let options: any = new Options();
	let theme: string = "default";

	function guid() {
		return (
			(((1 + Math.random()) * 0x10000000000) | 0)
				.toString(16)
				.substring(1) +
			"-" +
			((((new Date().getTime() * 1000) | 0) % 0x1000000) + 0x1000000)
				.toString(16)
				.substring(1)
		);
	}

	function makeMarker() {
		let marker = document.createElement("span");
		marker.style.color = "#a00";
		marker.innerHTML = "\u25CF";
		return marker;
	}

	function relpos(element, x, y) {
		while (element) {
			x -= element.offsetLeft;
			y -= element.offsetTop;
			element = element.offsetParent;
		}
		return { x: x, y: y };
	}

	// manage documentation container or window
	module.onDocumentationClick = null;
	module.documentationWindow = null;
	function showdoc(path = "") {
		if (module.onDocumentationClick) {
			// notify a surrounding application of a doc link click
			module.onDocumentationClick(path);
		} else {
			// open documentation in a new window; this enables proper browser navigation
			if (module.documentationWindow) {
				module.documentationWindow.close();
				module.documentationWindow = null;
			}
			if (path.startsWith("#/")) path = path.slice(1);
			showdocWindow("?doc=" + path);
		}
	}

	function showdocWindow(href: string) {
		// open documentation in a new window; this enables proper browser navigation
		if (module.documentationWindow) {
			module.documentationWindow.close();
			module.documentationWindow = null;
		}
		module.documentationWindow = window.open(href, "TScript documentation");
	}

	function showdocConfirm(path?: string, search_string?: string) {
		// The dialog is added here, because some browsers disallow
		// that a new tab/window is created, when not initiated by a button press.
		// In this case the user would simply press [Enter] which should be no problem.
		let dlg = tgui.createModal({
			title: "Open documentation",
			scalesize: [0.2, 0.15],
			minsize: [300, 150],
			buttons: [
				{
					text: "Open tab",
					onClick: () => {
						if (search_string) {
							showdocWindow(
								"?doc=search&q=" +
									encodeURIComponent(search_string)
							);
						} else {
							showdoc(path);
						}
					},
					isDefault: true,
				},
				{ text: "Cancel" },
			],
		});
		tgui.createElement({
			parent: dlg.content,
			type: "div",
			style: { "margin-top": "10px" },
			text: "Open the documentation in another tab?",
		});

		if (path || search_string) {
			tgui.createElement({
				parent: dlg.content,
				type: "div",
				style: { "margin-top": "10px" },
				text: search_string
					? 'Search for "' + search_string + '"?'
					: 'Go to "' + path + '"?',
			});
		}

		tgui.startModal(dlg);
	}

	// document properties
	(module.document = {
		filename: "", // name in local storage, or empty string
		dirty: false, // does the state differ from the last saved state?
	}),
		// current interpreter, non-null after successful parsing
		(module.interpreter = null);

	// set the cursor in the editor; line is 1-based, ch (char within the line) is 0-based
	let setCursorPosition = function (line, ch) {
		if (typeof ch === "undefined") ch = 0;
		module.sourcecode.setCursor(line - 1, ch);
		module.sourcecode.focus();
		//	module.sourcecode.scrollIntoView({"line": line-1, "ch": 0}, 40);
		let s = module.sourcecode.getScrollInfo();
		let y = module.sourcecode.charCoords(
			{ line: line - 1, ch: 0 },
			"local"
		).top;
		let h = module.sourcecode.getScrollerElement().offsetHeight;
		if (
			y < s.top + 0.1 * s.clientHeight ||
			y >= s.top + 0.9 * s.clientHeight
		) {
			y = y - 0.5 * h - 5;
			module.sourcecode.scrollTo(null, y);
		}
	};

	let text2html = function (s) {
		return s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	};

	const type2css = [
		"ide-keyword",
		"ide-keyword",
		"ide-integer",
		"ide-real",
		"ide-string",
		"ide-collection",
		"ide-collection",
		"ide-builtin",
		"ide-builtin",
		"ide-builtin",
		"ide-builtin",
	];

	// This function defines the stack trace tree.
	function stackinfo(value, node_id) {
		let ret: any = { children: [], ids: [] };
		if (!module.interpreter) return ret;

		if (value === null) {
			for (let i = module.interpreter.stack.length - 1; i >= 0; i--) {
				ret.children.push({
					nodetype: "frame",
					index: i,
					frame: module.interpreter.stack[i],
				});
				ret.ids.push("/" + i);
			}
		} else {
			if (!value.hasOwnProperty("nodetype"))
				throw "[stacktree.update] missing value.nodetype";
			if (value.nodetype === "frame") {
				ret.opened = true;
				let func = value.frame.pe[0];
				ret.element = document.createElement("span");
				tgui.createElement({
					type: "span",
					parent: ret.element,
					text: "[" + value.index + "] ",
					classname: "ide-index",
				});

				let frame_head = tgui.createText(
					func.petype + " " + TScript.displayname(func),
					ret.element
				);

				let inner_element = value.frame.pe[value.frame.pe.length - 1];
				if (inner_element.hasOwnProperty("where")) {
					// on click, jump to line where the call into the next frame happened
					let where = inner_element.where;
					let where_str = " (" + where.line + ":" + where.ch + ")";

					tgui.createElement({
						type: "span",
						parent: ret.element,
						text: " (" + where.line + ":" + where.ch + ")",
						classname: "ide-index",
					});

					ret.element.addEventListener("click", function (event) {
						setCursorPosition(where.line, where.ch);
						return false;
					});
				}

				if (value.frame.object) {
					ret.children.push({
						nodetype: "typedvalue",
						index: "this",
						typedvalue: value.frame.object,
					});
					ret.ids.push(node_id + "/this");
				}
				for (let i = 0; i < value.frame.variables.length; i++) {
					if (!value.frame.variables[i] || !func.variables[i])
						continue;
					ret.children.push({
						nodetype: "typedvalue",
						index: TScript.displayname(func.variables[i]),
						typedvalue: value.frame.variables[i],
					});
					ret.ids.push(node_id + "/" + func.variables[i].name);
				}
				if (value.frame.temporaries.length > 0) {
					ret.children.push({
						nodetype: "temporaries",
						index: "temporaries",
						frame: value.frame,
					});
					ret.ids.push(node_id + "/<temporaries>");
				}
			} else if (value.nodetype === "typedvalue") {
				ret.opened = false;
				ret.element = document.createElement("span");

				let s = ret.opened
					? value.typedvalue.type.name
					: TScript.previewValue(value.typedvalue);
				if (value.typedvalue.type.id === Typeid.typeid_array) {
					for (let i = 0; i < value.typedvalue.value.b.length; i++) {
						ret.children.push({
							nodetype: "typedvalue",
							index: i,
							typedvalue: value.typedvalue.value.b[i],
						});
						ret.ids.push(node_id + "/" + i);
					}
					s = "Array(" + ret.children.length + ") " + s;
				} else if (
					value.typedvalue.type.id === Typeid.typeid_dictionary
				) {
					for (let key in value.typedvalue.value.b) {
						if (value.typedvalue.value.b.hasOwnProperty(key)) {
							ret.children.push({
								nodetype: "typedvalue",
								index: key,
								typedvalue: value.typedvalue.value.b[key],
							});
							ret.ids.push(node_id + "/" + key);
						}
					}
					s = "Dictionary(" + ret.children.length + ") " + s;
				} else if (
					value.typedvalue.type.id === Typeid.typeid_function
				) {
					if (value.typedvalue.value.b.hasOwnProperty("object")) {
						ret.children.push({
							nodetype: "typedvalue",
							index: "this",
							typedvalue: value.typedvalue.value.b.object,
						});
						ret.ids.push(node_id + "/this");
					}
					if (value.typedvalue.value.b.hasOwnProperty("enclosed")) {
						for (
							let i = 0;
							i < value.typedvalue.value.b.enclosed.length;
							i++
						) {
							ret.children.push({
								nodetype: "typedvalue",
								index: value.typedvalue.value.b.func
									.closureparams[i].name,
								typedvalue:
									value.typedvalue.value.b.enclosed[i],
							});
							ret.ids.push(
								node_id +
									"/" +
									value.typedvalue.value.b.func.closureparams[
										i
									].name
							);
						}
					}
				} else if (value.typedvalue.type.id >= Typeid.typeid_class) {
					let type = value.typedvalue.type;
					let types: any = [];
					while (type) {
						types.unshift(type);
						type = type.superclass;
					}
					for (let j = 0; j < types.length; j++) {
						type = types[j];
						if (!type.variables) continue;
						for (let i = 0; i < type.variables.length; i++) {
							ret.children.push({
								nodetype: "typedvalue",
								index: type.variables[i].name,
								typedvalue:
									value.typedvalue.value.a[
										type.variables[i].id
									],
							});
							ret.ids.push(
								node_id + "/" + type.variables[i].name
							);
						}
					}
				}
				tgui.createElement({
					type: "span",
					parent: ret.element,
					text: value.index + ": ",
					classname: "ide-index",
				});
				tgui.createElement({
					type: "span",
					parent: ret.element,
					classname:
						value.typedvalue.type.id < type2css.length
							? type2css[value.typedvalue.type.id]
							: "ide-userclass",
					text: s,
				});
			} else if (value.nodetype === "temporaries") {
				ret.opened = true;
				ret.element = tgui.createElement({
					type: "span",
					parent: ret.element,
					text: "[temporaries]",
				});
				let j = 0;
				for (let i = 0; i < value.frame.temporaries.length; i++) {
					if (!value.frame.temporaries[i]) continue;
					if (
						value.frame.temporaries[i].hasOwnProperty("type") &&
						value.frame.temporaries[i].hasOwnProperty("value")
					) {
						ret.children.push({
							nodetype: "typedvalue",
							index: i,
							typedvalue: value.frame.temporaries[i],
						});
						ret.ids.push(node_id + "/" + j);
						j++;
					}
				}
			} else
				throw "[stacktree.update] unknown nodetype: " + value.nodetype;
		}
		return ret;
	}

	// This function defines the program tree.
	function programinfo(value, node_id) {
		let ret: any = { children: [], ids: [] };
		if (!module.interpreter) return ret;
		if (module.interpreter.stack.length === 0) return ret;

		let frame =
			module.interpreter.stack[module.interpreter.stack.length - 1];
		let current_pe = frame.pe[frame.pe.length - 1];
		let current_pes = new Set();
		for (let i = 0; i < frame.pe.length; i++) current_pes.add(frame.pe[i]);

		if (value === null) {
			ret.children.push(module.interpreter.program);
			ret.ids.push("");
		} else {
			ret.opened = true;

			let pe = value;
			if (pe.petype === "expression") pe = pe.sub;
			while (pe.petype === "group") pe = pe.sub;

			ret.element = document.createElement("div");
			let s = "";
			let css = "";
			s += pe.petype;
			if (pe.name) s += " " + pe.name;

			let petype = String(pe.petype);
			if (
				petype === "global scope" ||
				petype === "scope" ||
				petype === "namespace"
			) {
				for (let i = 0; i < pe.commands.length; i++) {
					if (
						pe.commands[i].hasOwnProperty("builtin") &&
						pe.commands[i].builtin
					)
						continue;
					if (pe.commands[i].petype === "breakpoint") continue;
					ret.children.push(pe.commands[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "conditional statement") {
				ret.children.push(pe.condition);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.then_part);
				ret.ids.push(node_id + "/" + ret.children.length);
				if (pe.else_part) {
					ret.children.push(pe.else_part);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "for-loop") {
				ret.children.push(pe.iterable);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.body);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (
				petype === "do-while-loop" ||
				petype === "while-do-loop"
			) {
				ret.children.push(pe.condition);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.body);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype === "break") {
			} else if (petype === "continue") {
			} else if (petype === "return") {
				if (pe.argument) {
					ret.children.push(pe.argument);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "variable declaration") {
				for (let i = 0; i < pe.vars.length; i++) {
					ret.children.push(pe.vars[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "variable" || petype === "attribute") {
				if (pe.initializer) {
					ret.children.push(pe.initializer);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "function" || petype === "method") {
				for (let i = 0; i < pe.params.length; i++) {
					let n = pe.names[pe.params[i].name];
					if (n) {
						ret.children.push(n);
						ret.ids.push(node_id + "/" + ret.children.length);
					}
				}
				for (let i = 0; i < pe.commands.length; i++) {
					if (pe.commands[i].petype === "breakpoint") continue;
					ret.children.push(pe.commands[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "type") {
				ret.children.push(pe.class_constructor);
				ret.ids.push(node_id + "/" + ret.children.length);
				for (let key in pe.members) {
					if (pe.members.hasOwnProperty(key)) {
						ret.children.push(pe.members[key]);
						ret.ids.push(node_id + "/" + ret.children.length);
					}
				}
				for (let key in pe.staticmembers) {
					if (pe.staticmembers.hasOwnProperty(key)) {
						ret.children.push(pe.staticmembers[key]);
						ret.ids.push(node_id + "/" + ret.children.length);
					}
				}
			} else if (petype === "constant") {
				s = TScript.previewValue(pe.typedvalue);
				css =
					pe.typedvalue.type.id < type2css.length
						? type2css[pe.typedvalue.type.id]
						: "ide-userclass";
			} else if (petype === "name") {
				// nothing to do...?
			} else if (petype === "this") {
			} else if (petype === "closure") {
				ret.children.push(pe.func);
				ret.ids.push(node_id + "/" + ret.children.length);
				for (let i = 0; i < pe.func.closureparams.length; i++) {
					ret.children.push(pe.func.closureparams[i].initializer);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "array") {
				for (let i = 0; i < pe.elements.length; i++) {
					ret.children.push(pe.elements[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "dictionary") {
				for (let i = 0; i < pe.values.length; i++) {
					ret.children.push(pe.values[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "function call") {
				ret.children.push(pe.base);
				ret.ids.push(node_id + "/" + ret.children.length);
				for (let i = 0; i < pe.arguments.length; i++) {
					ret.children.push(pe.arguments[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "named argument") {
				s = pe.name;
				if (pe.argument) {
					ret.children.push(pe.argument);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			} else if (petype === "item access") {
				ret.children.push(pe.base);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.argument);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype.substr(0, 17) === "access of member ") {
				ret.children.push(pe.object);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype.substr(0, 11) === "assignment ") {
				ret.children.push(pe.lhs);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.rhs);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype.substr(0, 20) === "left-unary operator ") {
				ret.children.push(pe.argument);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype.substr(0, 16) === "binary operator ") {
				ret.children.push(pe.lhs);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.rhs);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype === "try-catch") {
				ret.children.push(pe.try_part);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.catch_part);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype === "try") {
				ret.children.push(pe.command);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype === "catch") {
				ret.children.push(pe.command);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype === "throw") {
				ret.children.push(pe.argument);
				ret.ids.push(node_id + "/" + ret.children.length);
			} else if (petype === "use") {
			} else if (petype === "no-operation") {
			} else if (petype === "breakpoint") {
				throw "[programinfo] internal error; breakpoints should not be listed";
			} else {
				throw "[programinfo] petype '" + petype + "' not covered";
			}

			if (current_pes.has(pe)) {
				if (pe === current_pe) {
					css += " ide-program-current";
					ret.visible = true;
				} else css += " ide-program-ancestor";
			}

			tgui.createElement({
				type: "span",
				parent: ret.element,
				classname: css,
				text: s,
			});
			if (pe.where)
				tgui.createElement({
					type: "span",
					parent: ret.element,
					text: " (" + pe.where.line + ":" + pe.where.ch + ")",
					classname: "ide-index",
				});
		}

		return ret;
	}

	// visually indicate the interpreter state
	function updateStatus() {
		// update status indicator
		if (module.interpreter) {
			if (module.interpreter.status === "running") {
				if (module.interpreter.background)
					module.programstate.running();
				else module.programstate.stepping();
			} else if (module.interpreter.status === "waiting")
				module.programstate.waiting();
			else if (module.interpreter.status === "dialog")
				module.programstate.waiting();
			else if (module.interpreter.status === "error")
				module.programstate.error();
			else if (module.interpreter.status === "finished")
				module.programstate.finished();
			else throw "internal error; unknown interpreter state";
		} else {
			if (module.messages.innerHTML != "") module.programstate.error();
			else module.programstate.unchecked();
		}

		// update read-only state of the editor
		if (module.sourcecode) {
			let should =
				module.interpreter &&
				(module.interpreter.status === "running" ||
					module.interpreter.status === "waiting" ||
					module.interpreter.status === "dialog");
			if (module.sourcecode.getOption("readOnly") != should) {
				module.sourcecode.setOption("readOnly", should);
				let ed: any = document.getElementsByClassName("CodeMirror");
				let value = should ? 0.6 : 1;
				for (let i = 0; i < ed.length; i++) ed[i].style.opacity = value;
			}
		}
	}

	// update the controls to reflect the interpreter state
	function updateControls() {
		// move the cursor in the source code
		if (module.interpreter) {
			if (module.interpreter.stack.length > 0) {
				let frame =
					module.interpreter.stack[
						module.interpreter.stack.length - 1
					];
				let pe = frame.pe[frame.pe.length - 1];
				if (pe.where) setCursorPosition(pe.where.line, pe.where.ch);
			} else {
				// it might be appropriate to keep the scroll position after running the program,
				// because in a large program one would continue editing some location in the middle
				// of the code
				//setCursorPosition(module.sourcecode.lineCount(), 1000000);
			}
		}

		// show the current stack state
		module.stacktree.update(stackinfo);

		// show the current program tree
		module.programtree.update(programinfo);

		updateStatus();
	}

	// add a message to the message panel
	module.addMessage = function (type, text, filename, line, ch, href) {
		let color = { print: "#00f", warning: "#f80", error: "#f00" };
		let tr = tgui.createElement({
			type: "tr",
			parent: module.messages,
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
			});
			if (typeof line !== "undefined") {
				msg.ide_filename = filename;
				msg.ide_line = line;
				msg.ide_ch = ch;
				msg.addEventListener("click", function (event) {
					if (
						event.target.ide_filename &&
						event.target.ide_filename !== module.document.filename
					) {
						// Handling a library error properly requires a multi-document editor.
						let dlg = tgui.createModal({
							title: "Error in Library File",
							scalesize: [0.3, 0.15],
							minsize: [300, 150],
							buttons: [{ text: "Close" }],
						});
						tgui.createElement({
							parent: dlg.content,
							type: "div",
							style: { margin: "10px" },
							text: "The line cannot be shown because the error occurred in a different file.",
						});
						tgui.startModal(dlg);
						return false;
					}
					setCursorPosition(
						event.target.ide_line,
						event.target.ide_ch
					);
					if (
						module.interpreter &&
						(module.interpreter.status != "running" ||
							!module.interpreter.background)
					) {
						updateControls();
					}
					return false;
				});
			}
		}
		module.messagecontainer.scrollTop =
			module.messagecontainer.scrollHeight;
		if (href) module.sourcecode.focus();
		return { symbol: th, content: td };
	};

	// Stop the interpreter and clear all output,
	// put the IDE into "not yet checked" mode.
	function clear() {
		if (module.interpreter) module.interpreter.stopthread();
		module.interpreter = null;

		tgui.clearElement(module.messages);
		{
			let ctx = module.turtle.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, module.turtle.width, module.turtle.height);
		}
		if (module.interpreter)
			module.interpreter.service.turtle.reset.call(
				module.interpreter,
				0,
				0,
				0,
				true
			);

		let ctx = module.canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, module.canvas.width, module.canvas.height);
		ctx.lineWidth = 1;
		ctx.fillStyle = "#000";
		ctx.strokeStyle = "#000";
		ctx.font = "16px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
	}

	// Prepare everything for the program to start running,
	// put the IDE into stepping mode at the start of the program.
	module.prepare_run = function () {
		clear();

		// make sure that there is a trailing line for the "end" breakpoint
		let source = module.sourcecode.getValue();
		if (source.length != 0 && source[source.length - 1] != "\n") {
			source += "\n";
			module.sourcecode
				.getDoc()
				.replaceRange(
					"\n",
					CodeMirror.Pos(module.sourcecode.lastLine())
				);
		}

		let result = Parser.parse(source, options);
		let program = result.program;
		let html = "";
		let errors = result.errors;
		if (errors) {
			for (let i = 0; i < errors.length; i++) {
				let err = errors[i];
				module.addMessage(
					err.type,
					err.type +
						(err.filename
							? " in file '" + err.filename + "'"
							: "") +
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
			module.interpreter = new Interpreter(
				program,
				createDefaultServices()
			);
			module.interpreter.service.documentation_mode = false;
			module.interpreter.service.print = function (msg) {
				if (msg.length > 1000) {
					let m = module.addMessage(
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
				} else module.addMessage("print", msg);
				module.interpreter.flush();
			};
			module.interpreter.service.alert = function (msg) {
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
			module.interpreter.service.confirm = function (msg) {
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
			module.interpreter.service.prompt = function (msg) {
				return new Promise((resolve, reject) => {
					let input = tgui.createElement({
						type: "input",
						classname: "ide-prompt-input",
						properties: { type: "text" },
					});
					let value = null;
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
					});
					dlg.content.appendChild(input);
					tgui.startModal(dlg);
					input.focus();
				});
			};
			module.interpreter.service.message = function (
				msg,
				filename,
				line,
				ch,
				href
			) {
				if (typeof filename === "undefined") filename = null;
				if (typeof line === "undefined") line = null;
				if (typeof ch === "undefined") ch = null;
				if (typeof href === "undefined") href = "";
				module.addMessage("error", msg, filename, line, ch, href);
			};
			module.interpreter.service.statechanged = function (stop) {
				if (stop) updateControls();
				else updateStatus();
				if (module.interpreter.status === "finished")
					module.sourcecode.focus();
			};
			module.interpreter.service.breakpoint = function () {
				updateControls();
			};
			module.interpreter.service.turtle.dom = module.turtle;
			module.interpreter.service.canvas.dom = module.canvas;
			module.interpreter.eventnames["canvas.resize"] = true;
			module.interpreter.eventnames["canvas.mousedown"] = true;
			module.interpreter.eventnames["canvas.mouseup"] = true;
			module.interpreter.eventnames["canvas.mousemove"] = true;
			module.interpreter.eventnames["canvas.mouseout"] = true;
			module.interpreter.eventnames["canvas.keydown"] = true;
			module.interpreter.eventnames["canvas.keyup"] = true;
			module.interpreter.eventnames["timer"] = true;
			module.interpreter.reset();

			// set and correct breakpoints
			let br = new Array();
			for (let i = 1; i <= module.sourcecode.lineCount(); i++) {
				if (module.sourcecode.lineInfo(i - 1).gutterMarkers) br.push(i);
			}
			let result = module.interpreter.defineBreakpoints(br);
			if (result !== null) {
				for (let i = 1; i <= module.sourcecode.lineCount(); i++) {
					if (module.sourcecode.lineInfo(i - 1).gutterMarkers) {
						if (!result.hasOwnProperty(i))
							module.sourcecode.setGutterMarker(
								i - 1,
								"breakpoints",
								null
							);
					} else {
						if (result.hasOwnProperty(i))
							module.sourcecode.setGutterMarker(
								i - 1,
								"breakpoints",
								makeMarker()
							);
					}
				}
				alert("Note: breakpoints were moved to valid locations");
			}
		}
	};

	let cmd_reset = function () {
		clear();
		updateControls();
	};

	let cmd_run = function () {
		if (
			!module.interpreter ||
			(module.interpreter.status != "running" &&
				module.interpreter.status != "waiting" &&
				module.interpreter.status != "dialog")
		)
			module.prepare_run();
		if (!module.interpreter) return;
		module.interpreter.run();
		module.canvas.parentElement.focus();
	};

	let cmd_interrupt = function () {
		if (
			!module.interpreter ||
			(module.interpreter.status != "running" &&
				module.interpreter.status != "waiting" &&
				module.interpreter.status != "dialog")
		)
			return;
		module.interpreter.interrupt();
	};

	let cmd_step_into = function () {
		if (
			!module.interpreter ||
			(module.interpreter.status != "running" &&
				module.interpreter.status != "waiting" &&
				module.interpreter.status != "dialog")
		)
			module.prepare_run();
		if (!module.interpreter) return;
		if (module.interpreter.running) return;
		module.interpreter.step_into();
	};

	let cmd_step_over = function () {
		if (
			!module.interpreter ||
			(module.interpreter.status != "running" &&
				module.interpreter.status != "waiting" &&
				module.interpreter.status != "dialog")
		)
			module.prepare_run();
		if (!module.interpreter) return;
		if (module.interpreter.running) return;
		module.interpreter.step_over();
	};

	let cmd_step_out = function () {
		if (
			!module.interpreter ||
			(module.interpreter.status != "running" &&
				module.interpreter.status != "waiting" &&
				module.interpreter.status != "dialog")
		)
			module.prepare_run();
		if (!module.interpreter) return;
		if (module.interpreter.running) return;
		module.interpreter.step_out();
	};

	let cmd_export = function () {
		// don't interrupt a running program
		if (module.interpreter) {
			if (
				module.interpreter.status === "running" ||
				module.interpreter.status === "waiting" ||
				module.interpreter.status === "dialog"
			)
				return;
		}

		// check that the code at least compiles
		let source = ide.sourcecode.getValue();
		clear();
		let result = Parser.parse(source, options);
		let program = result.program;
		let errors = result.errors;
		if (errors && errors.length > 0) {
			for (let i = 0; i < errors.length; i++) {
				let err = errors[i];
				module.addMessage(
					err.type,
					err.type +
						(err.filename
							? " in file '" + err.filename + "'"
							: "") +
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
			return;
		}
		if (!program) {
			alert("internal error during export");
			return;
		}

		// create a filename for the file download from the title
		let title = module.document.filename;
		if (!title || title === "") title = "tscript-export";
		let fn = title;
		if (
			!fn.endsWith("html") &&
			!fn.endsWith("HTML") &&
			!fn.endsWith("htm") &&
			!fn.endsWith("HTM")
		)
			fn += ".html";

		let dlg = tgui.createModal({
			title: "Export program as webpage",
			scalesize: [0.5, 0.5],
			minsize: [400, 260],
			onHelp: (initiatedByKey) =>
				(initiatedByKey ? showdocConfirm : showdoc)(
					"#/ide/exportdialog"
				),
			buttons: [{ text: "Close" }],
		});

		let status = tgui.createElement({
			parent: dlg.content,
			type: "div",
			text: "status: preparing ...",
			classname: "ide-export-status",
			style: { top: "20px" },
		});
		let download_turtle = tgui.createElement({
			parent: dlg.content,
			type: "a",
			properties: { target: "_blank", download: fn },
			text: "download standalone turtle application",
			classname: "ide-export-download",
			style: { top: "80px" },
		});
		let download_canvas = tgui.createElement({
			parent: dlg.content,
			type: "a",
			properties: { target: "_blank", download: fn },
			text: "download standalone canvas application",
			classname: "ide-export-download",
			style: { top: "140px" },
		});

		tgui.startModal(dlg);

		// escape the TScript source code; prepare it to reside inside a single-quoted string
		source = escape(source);

		// obtain the page itself as a string
		{
			var xhr = new XMLHttpRequest();
			xhr.open("GET", window.location.href, true);
			xhr.overrideMimeType("text/html");
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					// hide the IDE and let canvas or turtle run in full screen
					let page = xhr.responseText;

					let headEnd = page.indexOf("<head>") + "<head>".length;
					let header = page.substr(0, headEnd);
					let footer = page.substr(headEnd);

					let scriptOpen =
						'window.TScript = {}; window.TScript.code = unescape("' +
						source +
						'"); ' +
						"window.TScript.mode = ";
					let scriptClose =
						';window.TScript.name = unescape("' +
						escape(title) +
						'")';

					let genCode = function genCode(mode) {
						let s = document.createElement("script");
						s.innerHTML =
							scriptOpen + '"' + escape(mode) + '"' + scriptClose;
						let script = s.outerHTML;

						let blob = new Blob([header + script + footer], {
							type: "text/html",
						});

						return URL.createObjectURL(blob); //"data:text/html," + encodeURIComponent(header + script + footer);
					};

					status.innerHTML = "status: ready for download";
					download_turtle.href = genCode("turtle");
					download_turtle.style.display = "block";
					download_canvas.href = genCode("canvas");
					download_canvas.style.display = "block";
				}
			};
			xhr.send();
		}
	};

	let cmd_toggle_breakpoint = function () {
		let cm = module.sourcecode;
		let line = cm.doc.getCursor().line;
		if (module.interpreter) {
			// ask the interpreter for the correct position of the marker
			let result = module.interpreter.toggleBreakpoint(line + 1);
			if (result !== null) {
				line = result.line;
				cm.setGutterMarker(
					line - 1,
					"breakpoints",
					result.active ? makeMarker() : null
				);
				module.sourcecode.scrollIntoView({ line: line - 1 }, 40);
			}
		} else {
			// set the marker optimistically, fix as soon as an interpreter is created
			cm.setGutterMarker(
				line,
				"breakpoints",
				cm.lineInfo(line).gutterMarkers ? null : makeMarker()
			);
		}
	};

	// Check if the document has been changed and when this is the case, ask the user to discard the changes,
	// by opening a dialog. In this case the confirmFileDiscard returns directly after creating the dialog.
	// When the document was not changed, or the user allows to discard the changes the function onConfirm is
	// called.
	function confirmFileDiscard(title, onConfirm) {
		if (module.document.dirty) {
			tgui.msgBox({
				prompt: "The document may have unsaved changes.\nDo you want to discard the code?",
				icon: tgui.msgBoxQuestion,
				title: title,
				buttons: [
					{ text: "Discard", onClick: onConfirm, isDefault: true },
					{ text: "Cancel" },
				],
			});
		} else {
			onConfirm();
		}
	}

	let cmd_new = function () {
		confirmFileDiscard("New document", () => {
			clear();

			module.editor_title.innerHTML = "Editor";
			module.document.filename = "";
			module.sourcecode.setValue("");
			module.sourcecode.getDoc().clearHistory();
			module.document.dirty = false;

			updateControls();
			module.sourcecode.focus();
		});
	};

	let cmd_load = function () {
		confirmFileDiscard("Open document", () => {
			fileDlg(
				"Load file",
				module.document.filename,
				false,
				"Load",
				function (filename) {
					clear();

					module.editor_title.innerHTML = "Editor &mdash; ";
					tgui.createText(filename, module.editor_title);
					module.document.filename = filename;
					module.sourcecode.setValue(
						localStorage.getItem("tscript.code." + filename)
					);
					module.sourcecode.getDoc().setCursor({ line: 0, ch: 0 });
					module.sourcecode.getDoc().clearHistory();
					module.document.dirty = false;

					updateControls();
					module.sourcecode.focus();
				}
			);
		});
	};

	let cmd_save = function () {
		if (module.document.filename === "") {
			cmd_save_as();
			return;
		}

		localStorage.setItem(
			"tscript.code." + module.document.filename,
			module.sourcecode.getValue()
		);
		module.document.dirty = false;
	};

	let cmd_save_as = function () {
		let dlg = fileDlg(
			"Save file as ...",
			module.document.filename,
			true,
			"Save",
			function (filename) {
				module.editor_title.innerHTML = "Editor &mdash; ";
				tgui.createText(filename, module.editor_title);
				module.document.filename = filename;
				cmd_save();
				module.sourcecode.focus();
			}
		);
	};

	// TODO: disable toolbar focus?
	let buttons: any = [
		{
			click: cmd_new,
			icon: icons.newDocument,
			tooltip: "New document",
			hotkey: "shift-control-n",
			group: "file",
		},
		{
			click: cmd_load,
			icon: icons.openDocument,
			tooltip: "Open document",
			hotkey: "control-o",
			group: "file",
		},
		{
			click: cmd_save,
			icon: icons.saveDocument,
			tooltip: "Save document",
			hotkey: "control-s",
			group: "file",
		},
		{
			click: cmd_save_as,
			icon: icons.saveDocumentAs,
			tooltip: "Save document as ...",
			hotkey: "shift-control-s",
			group: "file",
		},
		{
			click: cmd_run,
			icon: icons.run,
			tooltip: "Run/continue program",
			hotkey: "F7",
			group: "execution",
		},
		{
			click: cmd_interrupt,
			icon: icons.interrupt,
			tooltip: "Interrupt program",
			hotkey: "shift-F7",
			group: "execution",
		},
		{
			click: cmd_reset,
			icon: icons.reset,
			tooltip: "Abort program",
			hotkey: "F10",
			group: "execution",
		},
		{
			click: cmd_step_into,
			icon: icons.stepInto,
			tooltip: "Run current command, step into function calls",
			hotkey: "shift-control-F11",
			group: "debug",
		},
		{
			click: cmd_step_over,
			icon: icons.stepOver,
			tooltip: "Run current line of code, do no step into function calls",
			hotkey: "control-F11",
			group: "debug",
		},
		{
			click: cmd_step_out,
			icon: icons.stepOut,
			tooltip: "Step out of current function",
			hotkey: "shift-F11",
			group: "debug",
		},
		{
			click: cmd_toggle_breakpoint,
			icon: icons.breakPoint,
			tooltip: "Toggle breakpoint",
			hotkey: "F8",
			group: "debug",
		},
		/*{
				click: function() { module.sourcecode.execCommand("findPersistent"); },
				icon: icons.search,
				tooltip: "Search",
				group: "edit",
			},*/
	];

	// load hotkeys & other settings
	function loadConfig() {
		let str = localStorage.getItem("tscript.ide.config");
		if (str) {
			let config = JSON.parse(str);
			if (config.hasOwnProperty("hotkeys")) {
				let n = Math.min(buttons.length, config.hotkeys.length);
				for (let i = 0; i < n; i++) {
					buttons[i].hotkey = config.hotkeys[i];
				}
			}
			if (config.hasOwnProperty("options")) {
				options = Object.assign(
					options,
					defaultOptions,
					config.options
				);
			}
			if (config.hasOwnProperty("theme")) {
				theme = config.theme;
			}
		}
		document.addEventListener("DOMContentLoaded", function () {
			tgui.setTheme(theme);
		});
		return null;
	}
	loadConfig();

	// save hotkeys
	function saveConfig() {
		let config: any = { options: options, hotkeys: [], theme };
		for (let i = 0; i < buttons.length; i++) {
			config.hotkeys.push(buttons[i].hotkey);
		}
		localStorage.setItem("tscript.ide.config", JSON.stringify(config));
	}

	function configDlg() {
		let dlg = tgui.createModal({
			title: "Configuration",
			scalesize: [0.5, 0.5],
			minsize: [370, 270],
			buttons: [{ text: "Done", isDefault: true }],
			onClose: saveConfig,
		});
		let div_hotkey = tgui.createElement({
			parent: dlg.content,
			type: "div",
		});
		let h3_hotkey = tgui.createElement({
			parent: div_hotkey,
			type: "h3",
			text: "Configure Hotkeys",
		});
		let p_hotkey = tgui.createElement({
			parent: div_hotkey,
			type: "p",
			text: "Click a button to configure its hotkey.",
		});

		let dlg_buttons = new Array();
		let div_buttons = tgui.createElement({
			parent: div_hotkey,
			type: "div",
			classname: "ide-toolbar",
		});
		let curgroup: string = buttons[0].group;
		for (let i = 0; i < buttons.length; i++) {
			let description = Object.assign({}, buttons[i]);

			if (description.group !== curgroup) {
				tgui.createElement({
					type: "div",
					parent: div_buttons,
					classname: "tgui tgui-control tgui-toolbar-separator",
				});
				curgroup = description.group;
			}

			description.width = 20;
			description.height = 20;
			description.style = { float: "left", height: "22px" };
			if (description.hotkey)
				description.tooltip += " (" + description.hotkey + ")";
			delete description.hotkey;
			description.parent = div_buttons;
			{
				let btn = i;
				description.click = function () {
					let dlg = tgui.createModal({
						title: "Set hotkey",
						scalesize: [0.3, 0.3],
						minsize: [340, 220],
						buttons: [{ text: "Cancel" }],
						onClose: saveConfig,
					});
					let icon = tgui.createIcon({
						parent: dlg.content,
						width: 20,
						height: 20,
						icon: buttons[btn].icon,
						style: {
							position: "absolute",
							left: "15px",
							top: "16px",
						},
					});

					tgui.createElement({
						parent: dlg.content,
						type: "label",
						text: buttons[btn].tooltip,
						style: {
							position: "absolute",
							left: "50px",
							top: "16px",
							right: "15px",
						},
					});
					tgui.createElement({
						parent: dlg.content,
						type: "label",
						text:
							"Current hotkey: " +
							(buttons[btn].hotkey
								? buttons[btn].hotkey
								: "<None>"),
						style: {
							position: "absolute",
							left: "50px",
							top: "46px",
							right: "15px",
						},
					});
					tgui.createElement({
						parent: dlg.content,
						type: "label",
						text: "Press the hotkey to assign, or press escape to remove the current hotkey",
						style: {
							position: "absolute",
							left: "15px",
							top: "106px",
							right: "15px",
						},
					});

					dlg.onKeyDownOverride = true; // Do not handle [escape]
					dlg.onKeyDown = function (event) {
						event.preventDefault();
						event.stopPropagation();

						let key = event.key;
						if (
							key === "Shift" ||
							key === "Control" ||
							key === "Alt" ||
							key === "OS" ||
							key === "Meta"
						)
							return;
						if (buttons[btn].hotkey) {
							tgui.setTooltip(
								buttons[btn].control.dom,
								buttons[btn].tooltip
							);
							tgui.setTooltip(
								dlg_buttons[btn].dom as any,
								buttons[btn].tooltip
							);
							tgui.releaseHotkey(buttons[btn].hotkey);
							delete buttons[btn].hotkey;
						}
						if (key === "Escape") {
							tgui.stopModal();
							return false;
						}

						if (event.altKey) key = "alt-" + key;
						if (event.ctrlKey) key = "control-" + key;
						if (event.shiftKey) key = "shift-" + key;
						key = tgui.normalizeHotkey(key);

						if (tgui.hotkey(key)) {
							alert("hotkey " + key + " is already in use");
						} else {
							buttons[btn].hotkey = key;
							tgui.setHotkey(key, buttons[btn].click);
							tgui.setTooltip(
								buttons[btn].control.dom,
								buttons[btn].tooltip + " (" + key + ")"
							);
							tgui.setTooltip(
								dlg_buttons[btn].dom,
								buttons[btn].tooltip + " (" + key + ")"
							);
							tgui.stopModal();
						}
						return false;
					};

					tgui.startModal(dlg);
				};
			}
			dlg_buttons.push(tgui.createButton(description));
		}

		{
			// Appearance
			let checked = "";

			let div_appearance = tgui.createElement({
				parent: dlg.content,
				type: "div",
			});
			let h3_appearance = tgui.createElement({
				parent: div_appearance,
				type: "h3",
				style: { "margin-top": "20px" },
				text: "Appearance",
			});
			let p_appearance = tgui.createElement({
				parent: div_appearance,
				type: "p",
			});
			const themes = [
				{ id: "default", display: "System Default" },
				{ id: "light", display: "Light" },
				{ id: "dark", display: "Dark" },
			];

			let lbl = tgui.createElement({
				parent: p_appearance,
				type: "label",
				html: "Theme",
				properties: { for: "selTheme" },
				style: { "padding-right": "5px" },
			});
			let sel = tgui.createElement({
				parent: p_appearance,
				type: "select",
				classname: "tgui-modal-dropdown",
				id: "selTheme",
				properties: { size: "1" },
			});

			for (let t of themes) {
				let opt = tgui.createElement({
					parent: sel,
					type: "option",
					properties: { value: t.id },
					style: { width: "100px" },
					html: t.display,
				});
			}
			sel.value = theme;
			sel.addEventListener("change", function (event) {
				theme = sel.value;
				tgui.setTheme(theme);
			});
		}

		{
			// Coding Style
			let checked = "";

			let div_codingStyle = tgui.createElement({
				parent: dlg.content,
				type: "div",
			});
			let h3_codingStyle = tgui.createElement({
				parent: div_codingStyle,
				type: "h3",
				style: { "margin-top": "20px" },
				text: "Coding Style",
			});
			let p_codingStyle = tgui.createElement({
				parent: div_codingStyle,
				type: "p",
			});
			let checkbox = tgui.createElement({
				parent: p_codingStyle,
				type: "input",
				id: "chkCodingStyle",
				properties: { type: "checkbox" },
				click: function (event) {
					options.checkstyle = checkbox.checked;
				},
			});
			let lbl = tgui.createElement({
				parent: p_codingStyle,
				type: "label",
				html: "Enable style errors",
				properties: { for: "chkCodingStyle" },
				style: { "padding-left": "5px" },
			});
			if (options.checkstyle) checkbox.checked = true;
		}

		tgui.startModal(dlg);
	}

	function fileDlg(
		title: string,
		filename,
		allowNewFilename: boolean,
		confirmText: string,
		onOkay
	) {
		// 10px horizontal spacing
		//  7px vertical spacing
		// populate array of existing files
		let files = new Array();
		for (let key in localStorage) {
			if (key.substr(0, 13) === "tscript.code.")
				files.push(key.substr(13));
		}
		files.sort();

		// return true on failure, that is when the dialog should be kept open
		let onFileConfirmation = function () {
			let fn = name.value;
			if (fn != "") {
				if (allowNewFilename || files.indexOf(fn) >= 0) {
					onOkay(fn);
					return false; // close dialog
				}
			}
			return true; // keep dialog open
		};

		// create dialog and its controls
		let dlg = tgui.createModal({
			title: title,
			scalesize: [0.5, 0.7],
			minsize: [440, 260],
			buttons: [
				{
					text: confirmText,
					isDefault: true,
					onClick: onFileConfirmation,
				},
				{ text: "Cancel" },
			],
			enterConfirms: true,
			contentstyle: {
				display: "flex",
				"flex-direction": "column",
				"justify-content": "space-between",
			},
		});

		let toolbar = tgui.createElement({
			parent: dlg.content,
			type: "div",
			style: {
				display: "flex",
				"flex-direction": "row",
				"justify-content": "space-between",
				width: "100%",
				height: "25px",
				"margin-top": "7px",
			},
		});
		// toolbar
		{
			let deleteBtn = tgui.createElement({
				parent: toolbar,
				type: "button",
				style: {
					width: "100px",
					height: "100%",
					"margin-right": "10px",
				},
				text: "Delete file",
				click: () => deleteFile(name.value),
				classname: "tgui-modal-button",
			});

			let importBtn = tgui.createElement({
				parent: toolbar,
				type: "button",
				style: {
					width: "100px",
					height: "100%",
					"margin-right": "10px",
				},
				text: "Import",
				click: () => importFile(),
				classname: "tgui-modal-button",
			});

			let exportBtn = tgui.createElement({
				parent: toolbar,
				type: "button",
				style: {
					width: "100px",
					height: "100%",
					"margin-right": "10px",
				},
				text: "Export",
				click: () => exportFile(name.value),
				classname: "tgui-modal-button",
			});

			// allow multiple selection: export selected
			// TODO: allow to export all TScript files at once to a zip file
			// TODO: allow to export whole TScript local storage

			let status = tgui.createElement({
				parent: toolbar,
				type: "label",
				style: {
					flex: 1,
					height: "100%",
					"white-space": "nowrap",
				},
				text:
					(files.length > 0 ? files.length : "No") +
					" document" +
					(files.length == 1 ? "" : "s"),
				classname: "tgui-status-box",
			});
		}
		// end toolbar

		let list = tgui.createElement({
			parent: dlg.content,
			type: "select",
			properties: { size: Math.max(2, files.length), multiple: false },
			classname: "tgui-list-box",
			style: {
				flex: "auto",
				//background: "#fff",
				margin: "7px 0px",
				overflow: "scroll",
			},
		});
		let name = { value: filename };
		if (allowNewFilename) {
			name = tgui.createElement({
				parent: dlg.content,
				type: "input",
				style: {
					height: "25px",
					//background: "#fff",
					margin: "0 0px 7px 0px",
				},
				classname: "tgui-text-box",
				text: filename,
				properties: { type: "text", placeholder: "Filename" },
			});
		}

		// populate options
		for (let i = 0; i < files.length; i++) {
			let option = new Option(files[i], files[i]);
			list.options[i] = option;
		}

		// event handlers
		list.addEventListener("change", function (event) {
			if (event.target && event.target.value)
				name.value = event.target.value;
		});
		list.addEventListener("keydown", function (event) {
			if (event.key === "Backspace" || event.key === "Delete") {
				event.preventDefault();
				event.stopPropagation();
				deleteFile(name.value);
				return false;
			}
		});
		list.addEventListener("dblclick", function (event) {
			event.preventDefault();
			event.stopPropagation();
			if (!onFileConfirmation()) tgui.stopModal();
			return false;
		});

		tgui.startModal(dlg);
		(allowNewFilename ? name : list).focus();
		return dlg;

		function deleteFile(filename) {
			let index = files.indexOf(filename);
			if (index >= 0) {
				let onDelete = () => {
					localStorage.removeItem("tscript.code." + filename);
					files.splice(index, 1);
					list.remove(index);
				};

				tgui.msgBox({
					title: "Delete file",
					icon: tgui.msgBoxExclamation,
					prompt: 'Delete file "' + filename + '"\nAre you sure?',
					buttons: [
						{ text: "Delete", isDefault: true, onClick: onDelete },
						{ text: "Cancel" },
					],
				});
			}
		}

		function download(filename, text, mime = "text/plain") {
			var element = document.createElement("a");
			element.setAttribute(
				"href",
				"data:" + mime + ";charset=utf-8," + encodeURIComponent(text)
			);
			element.setAttribute("download", filename);

			element.style.display = "none";
			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
		}

		function exportFile(filename) {
			let data = localStorage.getItem("tscript.code." + filename);
			download(filename + ".tscript", data);
		}

		function importFile() {
			let fileImport = document.createElement("input");
			fileImport.type = "file";
			fileImport.multiple = true;
			fileImport.style.display = "none";
			fileImport.accept = ".tscript";

			fileImport.addEventListener("change", async (event: any) => {
				if (event.target.files) {
					for (let file of event.target.files) {
						let filename = file.name.split(".tscript")[0];
						if (files.includes(filename)) {
							/*if(!confirm("Replace file \"" + filename + "\"\nAre you sure?"))
							{
								return;
							}*/
						}
						let data = await file.text();
						localStorage.setItem("tscript.code." + filename, data);
						if (!files.includes(filename)) {
							files.push(filename);
							let option = new Option(filename, filename);
							list.appendChild(option);
						}
					}
				}
			});

			fileImport.click();
		}
	}

	module.create = function (container, options) {
		if (!options)
			options = { "export-button": true, "documentation-button": true };

		tgui.releaseAllHotkeys();

		// create HTML elements of the GUI
		module.main = tgui.createElement({
			type: "div",
			parent: container,
			classname: "ide ide-main",
		});
		tgui.setHotkeyElement(module.main);

		module.toolbar = tgui.createElement({
			type: "div",
			parent: module.main,
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
					parent: module.toolbar,
					classname: "tgui tgui-control tgui-toolbar-separator",
				});
				curgroup = description.group;
			}

			description.width = 20;
			description.height = 20;
			description.style = { float: "left", height: "22px" };
			if (description.hotkey)
				description.tooltip += " (" + description.hotkey + ")";
			description.parent = module.toolbar;
			buttons[i].control = tgui.createButton(description);
		}

		tgui.createElement({
			type: "div",
			parent: module.toolbar,
			classname: "tgui tgui-control tgui-toolbar-separator",
		});

		module.programstate = tgui.createLabel({
			parent: module.toolbar,
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

		module.programstate.setStateCss = function (state) {
			let cls = `ide-state-${state}`;
			if (this.hasOwnProperty("state_css_class"))
				this.dom.classList.replace(this.state_css_class, cls);
			else this.dom.classList.add(cls);
			this.state_css_class = cls;
			return this;
		};
		// TODO set tooltip text to the content text, this should apply when the statusbox is too narrow
		module.programstate.unchecked = function () {
			this.setText("program has not been checked").setStateCss(
				"unchecked"
			);
		};
		module.programstate.error = function () {
			this.setText("an error has occurred").setStateCss("error");
		};
		module.programstate.running = function () {
			this.setText("program is running").setStateCss("running");
		};
		module.programstate.waiting = function () {
			this.setText("program is waiting").setStateCss("waiting");
		};
		module.programstate.stepping = function () {
			this.setText("program is in stepping mode").setStateCss("stepping");
		};
		module.programstate.finished = function () {
			this.setText("program has finished").setStateCss("finished");
		};
		module.programstate.unchecked();

		tgui.createElement({
			type: "div",
			parent: module.toolbar,
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
			parent: module.toolbar,
			style: { float: "left" },
			tooltip: "Restore panels",
		});

		tgui.createElement({
			type: "div",
			parent: module.toolbar,
			classname: "tgui tgui-control tgui-toolbar-separator",
		});

		module.iconlist = tgui.createElement({
			type: "div",
			parent: module.toolbar,
			classname: "tgui",
			style: {
				float: "left",
				width: "200px",
				height: "100%",
				border: "none",
				margin: "3px",
			},
		});

		tgui.createElement({
			type: "div",
			parent: module.toolbar,
			classname: "tgui tgui-control tgui-toolbar-separator",
		});

		if (options["documentation-button"]) {
			tgui.createButton({
				click: () => showdoc(""),
				text: "Documentation",
				parent: module.toolbar,
				style: { position: "absolute", height: "22px", right: "0px" },
			});

			// pressing F1
			tgui.setHotkey("F1", function () {
				let selection = module.sourcecode.getSelection();
				// maximum limit of 30 characters
				// so that there is no problem, when accedentially everything
				// in a file is selected
				if (!selection) {
					// get current word under the cursor
					let cursor = module.sourcecode.getCursor();

					let word = module.sourcecode.findWordAt(cursor);

					selection = module.sourcecode.getRange(
						word.anchor,
						word.head
					);
				}
				selection = selection.substr(0, 30);
				const words = selection.match(/[a-z]+/gi); // global case insensitive
				showdocConfirm(undefined, words?.join(" "));
			});
		}

		// area containing all panels
		let area = tgui.createElement({
			type: "div",
			parent: module.main,
			classname: "ide ide-panel-area",
		});

		// prepare tgui panels
		tgui.preparePanels(area, module.iconlist);

		let panel_editor = tgui.createPanel({
			name: "editor",
			title: "Editor",
			state: "left",
			fallbackState: "float",
			dockedheight: 600,
			onArrange: function () {
				if (module.sourcecode) module.sourcecode.refresh();
			},
			icon: icons.editor,
		});
		panel_editor.textarea = tgui.createElement({
			type: "textarea",
			parent: panel_editor.content,
			classname: "ide ide-sourcecode",
		});
		module.highlight = null;
		module.sourcecode = CodeMirror.fromTextArea(panel_editor.textarea, {
			gutters: ["CodeMirror-linenumbers", "breakpoints"],
			lineNumbers: true,
			matchBrackets: true,
			styleActiveLine: true,
			mode: "text/tscript",
			indentUnit: 4,
			tabSize: 4,
			indentWithTabs: true,
			// TODO: Setting in configuration: lineWrapping: true/false,
			extraKeys: {
				"Ctrl-D": "toggleComment",
				"Cmd-D": "toggleComment",
				"Ctrl-R": "replace",
				F3: "findNext",
				"Shift-F3": "findPrev",
				"Ctrl-Up": "goDocEnd",
				"Ctrl-Down": "goDocStart",
				"Shift-Tab": "indentLess",
			},
		});
		module.sourcecode.on("change", function (cm, changeObj) {
			module.document.dirty = true;
			if (module.interpreter) {
				clear();
				updateControls();
			}
		});
		module.sourcecode.on("gutterClick", function (cm, line) {
			if (module.interpreter) {
				// ask the interpreter for the correct position of the marker
				let result = module.interpreter.toggleBreakpoint(line + 1);
				if (result !== null) {
					line = result.line;
					cm.setGutterMarker(
						line - 1,
						"breakpoints",
						result.active ? makeMarker() : null
					);
					module.sourcecode.scrollIntoView({ line: line }, 40);
				}
			} else {
				// set the marker optimistically, fix as soon as an interpreter is created
				cm.setGutterMarker(
					line,
					"breakpoints",
					cm.lineInfo(line).gutterMarkers ? null : makeMarker()
				);
			}
		});
		module.sourcecode.on("cursorActivity", function (cm) {
			if (
				module.interpreter &&
				module.interpreter.status === "running" &&
				!module.interpreter.background
			) {
				// highlight variable values in the debugger in stepping mode
				let cursor = cm.getCursor();
				let line = cursor.line + 1;
				let ch = cursor.ch;
				let highlight_var: any = null,
					highlight_func: any = null;
				function rec(pe) {
					if (pe.buildin) return;
					if (pe?.where?.line == line && pe.where.ch <= ch) {
						if (pe.petype == "variable") {
							if (pe.where.ch + pe.name.length >= ch) {
								highlight_var = pe;
								highlight_func = get_function(pe);
							}
						} else if (
							pe.petype == "name" &&
							pe.reference.petype == "variable"
						) {
							if (pe.where.ch + pe.name.length >= ch) {
								highlight_var = pe.reference;
								highlight_func = get_function(pe);
							}
						}
					}
					if (pe.children) {
						for (let sub of pe.children) rec(sub);
					}
				}
				rec(module.interpreter.program);
				if (highlight_var) {
					// find the value of the variable, if any
					let scope: any = null;
					if (highlight_var.scope === "global")
						scope = module.interpreter.stack[0];
					else if (highlight_var.scope === "local") {
						for (
							let s = module.interpreter.stack.length - 1;
							s > 0;
							s--
						) {
							let frame = module.interpreter.stack[s];
							if (
								frame.pe.length > 0 &&
								frame.pe[0] === highlight_func
							) {
								scope = frame;
								break;
							}
						}
					}
					if (scope) {
						console.log(scope, highlight_var);
						let tv = scope.variables[highlight_var.id];
						if (!tv) return;
						let text = TScript.previewValue(tv);
						if (module.highlight) module.highlight.remove();
						module.highlight = tgui.createElement({
							type: "div",
							parent: document.body,
							classname: "highlight-overlay",
							text: highlight_var.name + " = " + text,
						});
						window.setTimeout(function () {
							module.highlight.style.opacity = 0;
						}, 100);
						window.setTimeout(
							(function (dom) {
								return function () {
									dom.remove();
								};
							})(module.highlight),
							4200
						);
					}
				}
			}
		});
		module.editor_title = panel_editor.titlebar; // TODO: remove this, this is only used to update the title
		//       - add functionality to update title in tgui.js

		let panel_messages = tgui.createPanel({
			name: "messages",
			title: "Messages",
			state: "left",
			dockedheight: 200,
			icon: icons.messages,
		});
		module.messagecontainer = tgui.createElement({
			type: "div",
			parent: panel_messages.content,
			classname: "ide ide-messages",
		});
		module.messages = tgui.createElement({
			type: "table",
			parent: module.messagecontainer,
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
		module.stacktree = tgui.createTreeControl({
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
		module.programtree = tgui.createTreeControl({
			parent: panel_programview.content,
			nodeclick: function (event, value, id) {
				if (value.where) {
					setCursorPosition(value.where.line, value.where.ch);
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
		module.turtle = tgui.createElement({
			type: "canvas",
			parent: panel_turtle.content,
			properties: { width: 600, height: 600 },
			classname: "ide ide-turtle",
		});
		module.turtle.addEventListener("contextmenu", function (event) {
			event.preventDefault();
			return false;
		});

		// ensure that the turtle area remains square and centered
		let makeSquare = function () {
			let w = module.turtle.parentElement.offsetWidth;
			let h = module.turtle.parentElement.offsetHeight;
			let size = Math.min(w, h);
			module.turtle.style.width = size + "px";
			module.turtle.style.height = size + "px";
			module.turtle.style.marginLeft =
				(w > size ? Math.floor((w - size) / 2) : 0) + "px";
			module.turtle.style.marginTop =
				(h > size ? Math.floor((h - size) / 2) : 0) + "px";
		};
		panel_turtle.onArrange = makeSquare;
		panel_turtle.onResize = makeSquare;

		let createTypedEvent = function (displayname, dict) {
			if (!module.interpreter)
				throw new Error("[createTypedEvent] internal error");
			let p = module.interpreter.program;
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
						obj.value.a[t.members[key].id] =
							TScript.json2typed.call(
								module.interpreter,
								dict[key]
							);
					}
					return obj;
				}
			}
			throw new Error("[createTypedEvent] unknown type " + displayname);
		};
		module.createTypedEvent = createTypedEvent;

		// prepare canvas output panel
		let panel_canvas = tgui.createPanel({
			name: "canvas",
			title: "Canvas",
			state: "icon",
			fallbackState: "right",
			onResize: function (w, h) {
				if (!module.hasOwnProperty("standalone") && module.canvas) {
					module.canvas.width = w;
					module.canvas.height = h;
				}
				if (module.interpreter) {
					let e: any = { width: w, height: h };
					e = createTypedEvent("canvas.ResizeEvent", e);
					module.interpreter.enqueueEvent("canvas.resize", e);
				}
			},
			icon: icons.canvas,
		});
		module.canvas = tgui.createElement({
			type: "canvas",
			parent: panel_canvas.content,
			properties: {
				width: panel_canvas.content.clientWidth,
				height: panel_canvas.content.clientHeight,
			},
			classname: "ide ide-canvas",
		});
		module.canvas.addEventListener("contextmenu", function (event) {
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
		let ctx = module.canvas.getContext("2d");
		ctx.lineWidth = 1;
		ctx.fillStyle = "#000";
		ctx.strokeStyle = "#000";
		ctx.font = "16px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		module.canvas.addEventListener("mousedown", function (event) {
			if (
				!module.interpreter ||
				!module.interpreter.background ||
				(module.interpreter.status != "running" &&
					module.interpreter.status != "waiting" &&
					module.interpreter.status != "dialog")
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
			e = Object.assign(
				e,
				relpos(module.canvas, event.pageX, event.pageY)
			);
			e = createTypedEvent("canvas.MouseButtonEvent", e);
			module.interpreter.enqueueEvent("canvas.mousedown", e);
		});
		module.canvas.addEventListener("mouseup", function (event) {
			if (
				!module.interpreter ||
				!module.interpreter.background ||
				(module.interpreter.status != "running" &&
					module.interpreter.status != "waiting" &&
					module.interpreter.status != "dialog")
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
			e = Object.assign(
				e,
				relpos(module.canvas, event.pageX, event.pageY)
			);
			e = createTypedEvent("canvas.MouseButtonEvent", e);
			module.interpreter.enqueueEvent("canvas.mouseup", e);
		});
		module.canvas.addEventListener("mousemove", function (event) {
			if (
				!module.interpreter ||
				!module.interpreter.background ||
				(module.interpreter.status != "running" &&
					module.interpreter.status != "waiting" &&
					module.interpreter.status != "dialog")
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
			e = Object.assign(
				e,
				relpos(module.canvas, event.pageX, event.pageY)
			);
			e = createTypedEvent("canvas.MouseMoveEvent", e);
			module.interpreter.enqueueEvent("canvas.mousemove", e);
		});
		module.canvas.addEventListener("mouseout", function (event) {
			if (
				!module.interpreter ||
				!module.interpreter.background ||
				(module.interpreter.status != "running" &&
					module.interpreter.status != "waiting" &&
					module.interpreter.status != "dialog")
			)
				return;
			let e = {
				type: module.interpreter.program.types[Typeid.typeid_null],
				value: { b: null },
			};
			module.interpreter.enqueueEvent("canvas.mouseout", e);
		});
		panel_canvas.content.addEventListener("keydown", function (event) {
			if (
				!module.interpreter ||
				!module.interpreter.background ||
				(module.interpreter.status != "running" &&
					module.interpreter.status != "waiting" &&
					module.interpreter.status != "dialog")
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
			module.interpreter.enqueueEvent("canvas.keydown", e);
		});
		panel_canvas.content.addEventListener("keyup", function (event) {
			if (
				!module.interpreter ||
				!module.interpreter.background ||
				(module.interpreter.status != "running" &&
					module.interpreter.status != "waiting" &&
					module.interpreter.status != "dialog")
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
			module.interpreter.enqueueEvent("canvas.keyup", e);
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
				return module.sourcecode.getValue();
			},
			function () {
				module.messages.innerHTML = "";
			},
			function (error) {
				module.addMessage("error", error);
			}
		);

		tgui.arrangePanels();

		module.sourcecode.focus();

		window["TScriptIDE"] = { tgui: tgui, ide: module };
	};

	return module;
})();
