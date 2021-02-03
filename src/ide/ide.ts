"use strict";

import { Typeid } from "../lang/helpers/typeIds";
import { TScript } from "../lang";
import { tgui } from "./tgui";
import { Parser } from "../lang/parser";
import { Interpreter } from "../lang/interpreter/interpreter";
import { defaultOptions } from "../lang/helpers/options";
import { defaultService } from "../lang/interpreter/defaultService";
import { default as cm } from "codemirror";
import { cmtsmode } from './codemirror-tscriptmode';


cmtsmode;// use the mode so it gets used somewhere
let CodeMirror:any = cm; 

///////////////////////////////////////////////////////////
// IDE for TScript development
//

export let ide = (function() {
	if (window.location.search != "" && window.location.search !== "?run") return null;
	
	let module:any = {};
	let options:any = {};
	
	function guid()
	{
		return (((1 + Math.random()) * 0x10000000000) | 0).toString(16).substring(1)
				+ "-"
				+ (((new Date()).getTime() * 1000 | 0) % 0x1000000 + 0x1000000).toString(16).substring(1);
	}
	
	function makeMarker()
	{
		let marker = document.createElement("span");
		marker.style.color = "#a00";
		marker.innerHTML = "\u25CF";
		return marker;
	};
	
	function relpos(element, x, y)
	{
		while (element)
		{
			x -= element.offsetLeft;
			y -= element.offsetTop;
			element = element.offsetParent;
		}
		return {"x": x, "y": y};
	}
	
	// manage documentation container or window
	module.onDocumentationClick = null;
	module.documentationWindow = null;
	function showdoc(path)
	{
		if (! path) path = "";
		if (module.onDocumentationClick)
		{
			// notify a surrounding application of a doc link click
			module.onDocumentationClick(path);
		}
		else
		{
			// open documentation in a new window; this enables proper browser navigation
			if (module.documentationWindow)
			{
				module.documentationWindow.close();
				module.documentationWindow = null;
			}
			let fn = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
			module.documentationWindow = window.open(fn + "?doc" + path, 'TScript documentation');
		}
	}
	
	
	// document properties
	module.document = {
				filename: "",     // name in local storage, or empty string
				dirty: false,     // does the state differ from the last saved state?
			},
	
	
	// current interpreter, non-null after successful parsing
	module.interpreter = null;
	
	
	// set the cursor in the editor; line is 1-based, ch (char within the line) is 0-based
	let setCursorPosition = function(line, ch)
	{
		if (typeof ch === 'undefined') ch = 0;
		module.sourcecode.setCursor(line-1, ch);
		module.sourcecode.focus();
	//	module.sourcecode.scrollIntoView({"line": line-1, "ch": 0}, 40);
		let s = module.sourcecode.getScrollInfo();
		let y = module.sourcecode.charCoords({"line": line-1, "ch": 0}, "local").top;
		let h = module.sourcecode.getScrollerElement().offsetHeight;
		if (y < s.top + 0.1 * s.clientHeight || y >= s.top + 0.9 * s.clientHeight)
		{
			y = y - 0.5 * h - 5;
			module.sourcecode.scrollTo(null, y);
		}
	};
	
	let text2html = function(s)
	{
		return s.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
	}
	
	const type2css = ["ide-keyword", "ide-keyword", "ide-integer", "ide-real", "ide-string", "ide-collection", "ide-collection", "ide-builtin", "ide-builtin", "ide-builtin", "ide-builtin"];
	
	// This function defines the stack trace tree.
	function stackinfo(value, node_id)
	{
		let ret:any = { "children": [], "ids": [] };
		if (! module.interpreter) return ret;
	
		if (value === null)
		{
			for (let i=module.interpreter.stack.length-1; i>=0; i--)
			{
				ret.children.push({
						"nodetype": "frame",
						"index": i,
						"frame": module.interpreter.stack[i],
					});
				ret.ids.push("/" + i);
			}
		}
		else
		{
			if (! value.hasOwnProperty("nodetype")) throw "[stacktree.update] missing value.nodetype";
			if (value.nodetype === "frame")
			{
				ret.opened = true;
				let func = value.frame.pe[0];
				ret.element = document.createElement("span");
				tgui.createElement({
						"type": "span",
						"parent": ret.element,
						"text": "[" + value.index + "] ",
						"classname": "ide-index",
					});
					
				let frame_head = tgui.createText(func.petype + " " + TScript.displayname(func), ret.element);
				
				let inner_element = value.frame.pe[value.frame.pe.length-1];
				if(inner_element.hasOwnProperty("where"))
				{
					// on click, jump to line where the call into the next frame happened
					let where = inner_element.where;
					let where_str = " (" + where.line + ":" + where.ch + ")";
					
					tgui.createElement({"type": "span", "parent": ret.element, "text": " (" + where.line + ":" + where.ch + ")", "classname": "ide-index"});
			
					ret.element.addEventListener("click", function(event)
					{
						setCursorPosition(where.line, where.ch);
						return false;
					});
				}
				
				if (value.frame.object)
				{
					ret.children.push({
							"nodetype": "typedvalue",
							"index": "this",
							"typedvalue": value.frame.object,
						});
					ret.ids.push(node_id + "/this");
				}
				for (let i=0; i<value.frame.variables.length; i++)
				{
					if (! value.frame.variables[i]) continue;
					ret.children.push({
							"nodetype": "typedvalue",
							"index": TScript.displayname(func.variables[i]),
							"typedvalue": value.frame.variables[i],
						});
					ret.ids.push(node_id + "/" + func.variables[i].name);
				}
				if (value.frame.temporaries.length > 0)
				{
					ret.children.push({
							"nodetype": "temporaries",
							"index": "temporaries",
							"frame": value.frame,
						});
					ret.ids.push(node_id + "/<temporaries>");
				}
			}
			else if (value.nodetype === "typedvalue")
			{
				ret.opened = false;
				ret.element = document.createElement("span");
	
				let s = ret.opened ? value.typedvalue.type.name : TScript.previewValue(value.typedvalue);
				if (value.typedvalue.type.id === Typeid.typeid_array)
				{
					for (let i=0; i<value.typedvalue.value.b.length; i++)
					{
						ret.children.push({
								"nodetype": "typedvalue",
								"index": i,
								"typedvalue": value.typedvalue.value.b[i],
							});
						ret.ids.push(node_id + "/" + i);
					}
					s = "Array(" + ret.children.length + ") " + s;
				}
				else if (value.typedvalue.type.id === Typeid.typeid_dictionary)
				{
					for (let key in value.typedvalue.value.b)
					{
						if (value.typedvalue.value.b.hasOwnProperty(key))
						{
							ret.children.push({
									"nodetype": "typedvalue",
									"index": key,
									"typedvalue": value.typedvalue.value.b[key],
								});
							ret.ids.push(node_id + "/" + key);
						}
					}
					s = "Dictionary(" + ret.children.length + ") " + s;
				}
				else if (value.typedvalue.type.id === Typeid.typeid_function)
				{
					if (value.typedvalue.value.b.hasOwnProperty("object"))
					{
						ret.children.push({
								"nodetype": "typedvalue",
								"index": "this",
								"typedvalue": value.typedvalue.value.b.object,
							});
						ret.ids.push(node_id + "/this");
					}
					if (value.typedvalue.value.b.hasOwnProperty("enclosed"))
					{
						for (let i=0; i<value.typedvalue.value.b.enclosed.length; i++)
						{
							ret.children.push({
									"nodetype": "typedvalue",
									"index": value.typedvalue.value.b.func.closureparams[i].name,
									"typedvalue": value.typedvalue.value.b.enclosed[i],
								});
							ret.ids.push(node_id + "/" + value.typedvalue.value.b.func.closureparams[i].name);
						}
					}
				}
				else if (value.typedvalue.type.id >= Typeid.typeid_class)
				{
					let type = value.typedvalue.type;
					let types:any = [];
					while (type)
					{
						types.unshift(type);
						type = type.superclass;
					}
					for (let j=0; j<types.length; j++)
					{
						type = types[j];
						if (! type.variables) continue;
						for (let i=0; i<type.variables.length; i++)
						{
							ret.children.push({
									"nodetype": "typedvalue",
									"index": type.variables[i].name,
									"typedvalue": value.typedvalue.value.a[type.variables[i].id],
								});
							ret.ids.push(node_id + "/" + type.variables[i].name);
						}
					}
				}
				tgui.createElement({"type": "span", "parent": ret.element, "text": value.index + ": ", "classname": "ide-index"});
				tgui.createElement({
						"type": "span",
						"parent": ret.element,
						"classname": (value.typedvalue.type.id < type2css.length) ? type2css[value.typedvalue.type.id] : "ide-userclass",
						"text": s,
					});
			}
			else if (value.nodetype === "temporaries")
			{
				ret.opened = true;
				ret.element = tgui.createElement({"type": "span", "parent": ret.element, "text": "[temporaries]"});
				let j = 0;
				for (let i=0; i<value.frame.temporaries.length; i++)
				{
		if (! value.frame.temporaries[i]) continue;
					if (value.frame.temporaries[i].hasOwnProperty("type") && value.frame.temporaries[i].hasOwnProperty("value"))
					{
						ret.children.push({
								"nodetype": "typedvalue",
								"index": i,
								"typedvalue": value.frame.temporaries[i],
							});
						ret.ids.push(node_id + "/" + j);
						j++;
					}
				}
			}
			else throw "[stacktree.update] unknown nodetype: " + value.nodetype;
		}
		return ret;
	}
	
	// This function defines the program tree.
	function programinfo(value, node_id)
	{
		let ret:any = { "children": [], "ids": [] };
		if (! module.interpreter) return ret;
		if (module.interpreter.stack.length === 0) return ret;
	
		let frame = module.interpreter.stack[module.interpreter.stack.length - 1];
		let current_pe = frame.pe[frame.pe.length - 1];
		let current_pes = new Set();
		for (let i=0; i<frame.pe.length; i++) current_pes.add(frame.pe[i]);
	
		if (value === null)
		{
			ret.children.push(module.interpreter.program);
			ret.ids.push("");
		}
		else
		{
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
			if (petype === "global scope" || petype === "scope" || petype === "namespace")
			{
				for (let i=0; i<pe.commands.length; i++)
				{
					if (pe.commands[i].hasOwnProperty("builtin") && pe.commands[i].builtin) continue;
					if (pe.commands[i].petype === "breakpoint") continue;
					ret.children.push(pe.commands[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "conditional statement")
			{
				ret.children.push(pe.condition);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.then_part);
				ret.ids.push(node_id + "/" + ret.children.length);
				if (pe.else_part)
				{
					ret.children.push(pe.else_part);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "for-loop")
			{
				ret.children.push(pe.iterable);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.body);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype === "do-while-loop" || petype === "while-do-loop")
			{
				ret.children.push(pe.condition);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.body);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype === "break")
			{ }
			else if (petype === "continue")
			{ }
			else if (petype === "return")
			{
				if (pe.argument)
				{
					ret.children.push(pe.argument);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "variable declaration")
			{
				for (let i=0; i<pe.vars.length; i++)
				{
					ret.children.push(pe.vars[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "variable" || petype === "attribute")
			{
				if (pe.initializer)
				{
					ret.children.push(pe.initializer);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "function" || petype === "method")
			{
				for (let i=0; i<pe.params.length; i++)
				{
					let n = pe.names[pe.params[i].name];
					if (n)
					{
						ret.children.push(n);
						ret.ids.push(node_id + "/" + ret.children.length);
					}
				}
				for (let i=0; i<pe.commands.length; i++)
				{
					if (pe.commands[i].petype === "breakpoint") continue;
					ret.children.push(pe.commands[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "type")
			{
				ret.children.push(pe.class_constructor);
				ret.ids.push(node_id + "/" + ret.children.length);
				for (let key in pe.members)
				{
					if (pe.members.hasOwnProperty(key))
					{
						ret.children.push(pe.members[key]);
						ret.ids.push(node_id + "/" + ret.children.length);
					}
				}
				for (let key in pe.staticmembers)
				{
					if (pe.staticmembers.hasOwnProperty(key))
					{
						ret.children.push(pe.staticmembers[key]);
						ret.ids.push(node_id + "/" + ret.children.length);
					}
				}
			}
			else if (petype === "constant")
			{
				s = TScript.previewValue(pe.typedvalue);
				css = (pe.typedvalue.type.id < type2css.length) ? type2css[pe.typedvalue.type.id] : "ide-userclass";
			}
			else if (petype === "name")
			{
				// nothing to do...?
			}
			else if (petype === "this")
			{ }
			else if (petype === "closure")
			{
				ret.children.push(pe.func);
				ret.ids.push(node_id + "/" + ret.children.length);
				for (let i=0; i<pe.func.closureparams.length; i++)
				{
					ret.children.push(pe.func.closureparams[i].initializer);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "array")
			{
				for (let i=0; i<pe.elements.length; i++)
				{
					ret.children.push(pe.elements[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "dictionary")
			{
				for (let i=0; i<pe.values.length; i++)
				{
					ret.children.push(pe.values[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "function call")
			{
				ret.children.push(pe.base);
				ret.ids.push(node_id + "/" + ret.children.length);
				for (let i=0; i<pe.arguments.length; i++)
				{
					ret.children.push(pe.arguments[i]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "named argument")
			{
				s = pe.name;
				if (pe.argument)
				{
					ret.children.push(pe.argument);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			else if (petype === "item access")
			{
				ret.children.push(pe.base);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.argument);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype.substr(0, 17) === "access of member ")
			{
				ret.children.push(pe.object);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype.substr(0, 11) === "assignment ")
			{
				ret.children.push(pe.lhs);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.rhs);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype.substr(0, 20) === "left-unary operator ")
			{
				ret.children.push(pe.argument);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype.substr(0, 16) === "binary operator ")
			{
				ret.children.push(pe.lhs);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.rhs);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype === "try-catch")
			{
				ret.children.push(pe.try_part);
				ret.ids.push(node_id + "/" + ret.children.length);
				ret.children.push(pe.catch_part);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype === "try")
			{
				ret.children.push(pe.command);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype === "catch")
			{
				ret.children.push(pe.command);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype === "throw")
			{
				ret.children.push(pe.argument);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
			else if (petype === "use")
			{ }
			else if (petype === "no-operation")
			{ }
			else if (petype === "breakpoint")
			{
				throw "[programinfo] internal error; breakpoints should not be listed";
			}
			else
			{
				throw "[programinfo] petype '" + petype + "' not covered";
			}
	
			if (current_pes.has(pe))
			{
				if (pe === current_pe)
				{
					css += " ide-program-current";
					ret.visible = true;
				}
				else css += " ide-program-ancestor";
			}
	
			tgui.createElement({
					"type": "span",
					"parent": ret.element,
					"classname": css,
					"text": s,
				});
			if (pe.where) tgui.createElement({"type": "span", "parent": ret.element, "text": " (" + pe.where.line + ":" + pe.where.ch + ")", "classname": "ide-index"});
		}
	
		return ret;
	}
	
	// visually indicate the interpreter state
	function updateStatus()
	{
		// update status indicator
		if (module.interpreter)
		{
			if (module.interpreter.status === "running")
			{
				if (module.interpreter.background) module.programstate.running();
				else module.programstate.stepping();
			}
			else if (module.interpreter.status === "waiting") module.programstate.waiting();
			else if (module.interpreter.status === "error") module.programstate.error();
			else if (module.interpreter.status === "finished") module.programstate.finished();
			else throw "internal error; unknown interpreter state";
		}
		else
		{
			if (module.messages.innerHTML != "") module.programstate.error();
			else module.programstate.unchecked();
		}
	
		// update read-only state of the editor
		if (module.sourcecode)
		{
			let should = module.interpreter && (module.interpreter.status === "running" || module.interpreter.status === "waiting");
			if (module.sourcecode.getOption("readOnly") != should)
			{
				module.sourcecode.setOption("readOnly", should);
				let ed:any = document.getElementsByClassName("CodeMirror");
				let value = should ? 0.6 : 1;
				for (let i=0; i<ed.length; i++) ed[i].style.opacity = value;
			}
		}
	}
	
	// update the controls to reflect the interpreter state
	function updateControls()
	{
		// move the cursor in the source code
		if (module.interpreter)
		{
			if (module.interpreter.stack.length > 0)
			{
				let frame = module.interpreter.stack[module.interpreter.stack.length - 1];
				let pe = frame.pe[frame.pe.length - 1];
				if (pe.where) setCursorPosition(pe.where.line, pe.where.ch);
			}
			else
			{
				// it might be appropiate to keep the scroll position after running the program,
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
	module.addMessage = function(type, text, line, ch, href)
	{
		let color = {"print": "#00f", "warning": "#f80", "error": "#f00"};
		let tr = tgui.createElement({"type": "tr", "parent": module.messages, "classname": "ide", "style": {"vertical-align": "top"}});
		let th = tgui.createElement({"type": "th", "parent": tr, "classname": "ide", "style": {"width": "20px"}});
		let bullet = tgui.createElement({"type": "span", "parent": th, "style": {"width": "20px", "color": color[type]}, "html": (href ? "&#128712;" : "\u2022")});
		if (href)
		{
			bullet.style.cursor = "pointer";
			bullet.addEventListener("click", function(event)
					{
						showdoc(href);
						return false;
					});
		}
		let td = tgui.createElement({"type": "td", "parent": tr, "classname": "ide"});
		let lines = text.split('\n');
		for (let i=0; i<lines.length; i++)
		{
			let s = lines[i];
			let msg = tgui.createElement({"type": "div", "parent": td, "classname": "ide ide-message" + (type != "print" ? " ide-errormessage" : ""), "text": s});
			if (typeof line !== 'undefined')
			{
				msg.ide_line = line;
				msg.ide_ch = ch;
				msg.addEventListener("click", function(event)
						{
							setCursorPosition(event.target.ide_line, event.target.ide_ch);
							if (module.interpreter && (module.interpreter.status != "running" || !module.interpreter.background))
							{
								updateControls();
							}
							return false;
						});
			}
		}
		module.messagecontainer.scrollTop = module.messagecontainer.scrollHeight;
		if (href) module.sourcecode.focus();
	}
	
	// Stop the interpreter and clear all output,
	// put the IDE into "not yet checked" mode.
	function clear()
	{
		if (module.interpreter) module.interpreter.stopthread();
		module.interpreter = null;
	
		tgui.clearElement(module.messages);
		{
			let ctx = module.turtle.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, module.turtle.width, module.turtle.height);
		}
		if (module.interpreter) module.interpreter.service.turtle.reset.call(module.interpreter, 0, 0, 0, true);
	
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
	module.prepare_run = function()
	{
		clear();
	
		// make sure that there is a trailing line for the "end" breakpoint
		let source = module.sourcecode.getValue();
		if (source.length != 0 && source[source.length - 1] != '\n')
		{
			source += '\n';
			module.sourcecode.getDoc().replaceRange('\n', CodeMirror.Pos(module.sourcecode.lastLine()));
		}
	
		let result = Parser.parse(source, options);
		let program = result.program;
		let html = "";
		let errors = result.errors;
		if (errors)
		{
			for (let i=0; i<errors.length; i++)
			{
				let err = errors[i];
				module.addMessage(err.type, err.type + " in line " + err.line + ": " + err.message, err.line, err.ch, err.href);
			}
		}
	
		if (program)
		{
			module.interpreter = new Interpreter(program, defaultService);
			module.interpreter.service.documentation_mode = false;
			module.interpreter.service.print = (function(msg) { module.addMessage("print", msg); });
			module.interpreter.service.alert = (function(msg) { alert(msg); });
			module.interpreter.service.confirm = (function(msg) { return confirm(msg); });
			module.interpreter.service.prompt = (function(msg) { return prompt(msg); });
			module.interpreter.service.message = (function(msg, line, ch, href)
					{
						if (typeof line === 'undefined') line = null;
						if (typeof ch === 'undefined') ch = null;
						if (typeof href === 'undefined') href = "";
						module.addMessage("error", msg, line, ch, href);
					});
			module.interpreter.service.statechanged = function(stop)
					{
						if (stop) updateControls();
						else updateStatus();
						if (module.interpreter.status === "finished") module.sourcecode.focus();
					};
			module.interpreter.service.breakpoint = function()
					{
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
			for (let i=1; i<=module.sourcecode.lineCount(); i++)
			{
				if (module.sourcecode.lineInfo(i-1).gutterMarkers) br.push(i);
			}
			let result = module.interpreter.defineBreakpoints(br);
			if (result !== null)
			{
				for (let i=1; i<=module.sourcecode.lineCount(); i++)
				{
					if (module.sourcecode.lineInfo(i-1).gutterMarkers)
					{
						if (! result.hasOwnProperty(i)) module.sourcecode.setGutterMarker(i-1, "breakpoints", null);
					}
					else
					{
						if (result.hasOwnProperty(i)) module.sourcecode.setGutterMarker(i-1, "breakpoints", makeMarker());
					}
				}
				alert("Note: breakpoints were moved to valid locations");
			}
		}
	};
	
	let cmd_reset = function()
	{
		clear();
		updateControls();
	}
	
	let cmd_run = function()
	{
		if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) module.prepare_run();
		if (! module.interpreter) return;
		module.interpreter.run();
		module.canvas.parentElement.focus();
	};
	
	let cmd_interrupt = function()
	{
		if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
		module.interpreter.interrupt();
	};
	
	let cmd_step_into = function()
	{
		if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) module.prepare_run();
		if (! module.interpreter) return;
		if (module.interpreter.running) return;
		module.interpreter.step_into();
	};
	
	let cmd_step_over = function()
	{
		if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) module.prepare_run();
		if (! module.interpreter) return;
		if (module.interpreter.running) return;
		module.interpreter.step_over();
	};
	
	let cmd_step_out = function()
	{
		if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) module.prepare_run();
		if (! module.interpreter) return;
		if (module.interpreter.running) return;
		module.interpreter.step_out();
	};
	
	let cmd_export = function()
	{
		// don't interrupt a running program
		if (module.interpreter)
		{
			if (module.interpreter.status === "running" || module.interpreter.status === "waiting") return;
		}
	
		// check that the code at least compiles
		let source = ide.sourcecode.getValue();
		clear();
		let result = Parser.parse(source);
		let program = result.program;
		let errors = result.errors;
		if (errors && errors.length > 0)
		{
			for (let i=0; i<errors.length; i++)
			{
				let err = errors[i];
				module.addMessage(err.type, err.type + " in line " + err.line + ": " + err.message, err.line, err.ch, err.href);
			}
			return;
		}
		if (! program) { alert("internal error during export"); return; }
	
		// create a filename for the file download from the title
		let title = module.document.filename;
		if (! title || title === "") title = "tscript-export";
		let fn = title;
		if (! fn.endsWith("html") && ! fn.endsWith("HTML") && ! fn.endsWith("htm") && ! fn.endsWith("HTM")) fn += ".html";
		let dlg = createDialog("export program as webpage", {"width": "calc(max(400px, 50vw))", "height": "calc(max(260px, 50vh))"});
		let status = tgui.createElement({
				"parent": dlg,
				"type": "div",
				"text": "status: preparing ...",
				"style": {"position": "absolute", "width": "80%", "left": "10%", "height": "40px", "line-height": "35px", "top": "40px", "color": "#000", "padding": "2px 10px", "vertical-align": "middle", "border": "1px solid #000"},
			});
		let download_turtle = tgui.createElement({
				"parent": dlg,
				"type": "a",
				"properties": {"target": "_blank", "download": fn},
				"text": "download standalone turtle application",
				"style": {"position": "absolute", "width": "80%", "left": "10%", "height": "40px", "line-height": "35px", "top": "100px", "background": "#fff", "color": "#44c", "font-decoration": "underline", "padding": "2px 10px", "vertical-align": "middle", "border": "1px solid #000", "display": "none"},
			});
		let download_canvas = tgui.createElement({
				"parent": dlg,
				"type": "a",
				"properties": {"target": "_blank", "download": fn},
				"text": "download standalone canvas application",
				"style": {"position": "absolute", "width": "80%", "left": "10%", "height": "40px", "line-height": "35px", "top": "160px", "background": "#fff", "color": "#44c", "font-decoration": "underline", "padding": "2px 10px", "vertical-align": "middle", "border": "1px solid #000", "display": "none"},
			});
	
		let close = tgui.createElement({
				"parent": dlg,
				"type": "button",
				"style": {"position": "absolute", "right": "10px", "bottom": "10px", "width": "100px", "height": "25px"},
				"text": "Close",
				"classname": "tgui-dialog-button"
			});
		close.addEventListener("click", handleDialogCloseWith(null));
	
		tgui.startModal(dlg);
	
		// escape the TScript source code; prepare it to reside inside a single-quoted string
		source = escape(source);
		
		// obtain the page itself as a string
		{
			var xhr = new XMLHttpRequest();
			xhr.open("GET", window.location.href, true);
			xhr.overrideMimeType("text/html");
			xhr.onreadystatechange = function()
			{
				if (xhr.readyState === 4)
				{
					// hide the IDE and let canvas or turtle run in full screen
					let page = xhr.responseText;
	
					let headEnd = page.indexOf("<head>") + "<head>".length;
					let header = page.substr(0, headEnd);
					let footer = page.substr(headEnd);
					
					let scriptOpen = "window.TScript = {}; window.TScript.code = unescape(\"" + source + "\"); "
					+ "window.TScript.mode = ";
					let scriptClose = ";window.TScript.name = unescape(\""+escape(title)+"\")";

					let genCode = function genCode(mode){
						let s = document.createElement('script');
						s.innerHTML = scriptOpen + "\""+escape(mode)+"\"" + scriptClose;
						let script = s.outerHTML;
						
						let blob = new Blob([header + script + footer], {type: "text/html"});

						return URL.createObjectURL(blob); //"data:text/html," + encodeURIComponent(header + script + footer);
					}
					
					status.innerHTML = "status: ready for download";
					download_turtle.href=genCode("turtle")
					download_turtle.style.display = "block";
					download_canvas.href=genCode("canvas");
					download_canvas.style.display = "block";
				}
			}
			xhr.send();
		}
	}
	
	let cmd_toggle_breakpoint = function()
	{
		let cm = module.sourcecode;
		let line = cm.doc.getCursor().line;
		if (module.interpreter)
		{
			// ask the interpreter for the correct position of the marker
			let result = module.interpreter.toggleBreakpoint(line+1);
			if (result !== null)
			{
				line = result.line;
				cm.setGutterMarker(line-1, "breakpoints", result.active ? makeMarker() : null);
				module.sourcecode.scrollIntoView({"line": line-1}, 40);
			}
		}
		else
		{
			// set the marker optimistically, fix as soon as an interpreter is created
			cm.setGutterMarker(line, "breakpoints", cm.lineInfo(line).gutterMarkers ? null : makeMarker());
		}
	}
	
	let cmd_new = function()
	{
		if (module.document.dirty)
		{
			if (! confirm("The document may have unsaved changes.\nDo you want to discard the code?")) return;
		}
	
		clear();
	
		module.editor_title.innerHTML = "editor";
		module.document.filename = "";
		module.sourcecode.setValue("");
		module.sourcecode.getDoc().clearHistory();
		module.document.dirty = false;
	
		updateControls();
		module.sourcecode.focus();
	}
	
	let cmd_load = function()
	{
		if (module.document.dirty)
		{
			if (! confirm("The document has unsaved changes.\nDo you want to discard the code?")) return;
		}
	
		let dlg = fileDlg("load file", module.document.filename, false, function(filename)
				{
					clear();
	
					module.editor_title.innerHTML = "editor &mdash; ";
					tgui.createText(filename, module.editor_title);
					module.document.filename = filename;
					module.sourcecode.setValue(localStorage.getItem("tscript.code." + filename));
					module.sourcecode.getDoc().setCursor({line: 0, ch: 0}, );
					module.sourcecode.getDoc().clearHistory();
					module.document.dirty = false;
	
					updateControls();
					module.sourcecode.focus();
				});
	}
	
	let cmd_save = function()
	{
		if (module.document.filename === "")
		{
			cmd_save_as();
			return;
		}
	
		localStorage.setItem("tscript.code." + module.document.filename, module.sourcecode.getValue());
		module.document.dirty = false;
	}
	
	let cmd_save_as = function()
	{
		let dlg = fileDlg("save file as ...", module.document.filename, true, function(filename)
				{
					module.editor_title.innerHTML = "editor &mdash; ";
					tgui.createText(filename, module.editor_title);
					module.document.filename = filename;
					cmd_save();
					module.sourcecode.focus();
				});
	}
	
	
	
	// Toolbar icons
	// icon parts used several times are written as a function,
	// the 2d context of the canvas is passed as a parameter,
	// resulting in less code
	
	function draw_icon_paper(ctx)
	{
		ctx.strokeStyle = "#333";
		ctx.fillStyle = "#fff";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(4.5, 7.5);
		ctx.lineTo(8.5, 3.5);
		ctx.lineTo(14.5, 3.5);
		ctx.lineTo(14.5, 16.5);
		ctx.lineTo(4.5, 16.5);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	
		ctx.beginPath();
		ctx.moveTo(4.5, 7.5);
		ctx.lineTo(8.5, 7.5);
		ctx.lineTo(8.5, 3.5);
		ctx.stroke();
	}
	
	function draw_icon_floppy_disk(ctx)
	{
		ctx.fillStyle = "#36d";
		ctx.strokeStyle = "#139";
		ctx.beginPath();
		ctx.moveTo(3.5, 3.5);
		ctx.lineTo(16.5, 3.5);
		ctx.lineTo(16.5, 16.5);
		ctx.lineTo(5.5, 16.5);
		ctx.lineTo(3.5, 14.5);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	
		ctx.fillStyle = "#eef";
		ctx.fillRect(7, 11, 6, 5);
		ctx.fillStyle = "#36d";
		ctx.fillRect(8, 12, 2, 3);
	
		ctx.fillStyle = "#fff";
		ctx.fillRect(6, 4, 8, 5);
	}
	
	function draw_icon_pencil_overlay(ctx)
	{
		// draw pencil
		// shadow
		ctx.strokeStyle = "#0005";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(8, 8);
		ctx.lineTo(8+10, 8+10);
		ctx.stroke();
	
	
		ctx.fillStyle = "#fc9";
		ctx.beginPath();
		ctx.moveTo( 8,  6);
		ctx.lineTo(11,  7);
		ctx.lineTo( 9,  9);
		ctx.fill();
	
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.moveTo( 8,      6);
		ctx.lineTo( 9.5,  6.5);
		ctx.lineTo( 8.5,  7.5);
		ctx.fill();
	
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(10, 8);
		ctx.lineTo(18, 16);
		ctx.stroke();
	
		ctx.strokeStyle = "#dd0";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(10, 8);
		ctx.lineTo(18, 16);
		ctx.stroke();
	
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.arc(18, 16, 1.5, 1.75*Math.PI, 2.75*Math.PI, false);
		ctx.fill();
	
		ctx.fillStyle = "#f33";
		ctx.beginPath();
		ctx.arc(18, 16, 1, 0, 2*Math.PI, false);
		ctx.fill();
		
	}
	
	
	
	let buttons:any = [
			{
				"click": cmd_new,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
	
							draw_icon_paper(ctx);
	
							ctx.strokeStyle = "#030";
							ctx.fillStyle = "#0a0";
							ctx.beginPath();
							ctx.arc(14, 14, 4.75, 0, 2 * Math.PI, false);
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
	
							ctx.strokeStyle = "#fff";
							ctx.lineWidth = 2;
							ctx.beginPath();
							ctx.moveTo(14, 17);
							ctx.lineTo(14, 11);
							ctx.stroke();
							ctx.beginPath();
							ctx.moveTo(11, 14);
							ctx.lineTo(17, 14);
							ctx.stroke();
						},
				"tooltip": "new document",
				"hotkey": "shift-control-n",
			},
			{
				"click": cmd_load,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
	
							ctx.fillStyle = "#ec5";
							ctx.strokeStyle = "#330";
							ctx.lineWidth = 1;
							ctx.beginPath();
							ctx.moveTo(2.5, 4.5);
							ctx.lineTo(7.5, 4.5);
							ctx.lineTo(9.5, 6.5);
							ctx.lineTo(15.5, 6.5);
							ctx.lineTo(15.5, 15.5);
							ctx.lineTo(2.5, 15.5);
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
	
							ctx.fillStyle = "#fd6";
							ctx.strokeStyle = "#330";
							ctx.lineWidth = 1;
							ctx.beginPath();
							ctx.moveTo(5.5, 8.5);
							ctx.lineTo(17.5, 8.5);
							ctx.lineTo(15.5, 15.5);
							ctx.lineTo(3.5, 15.5);
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
						},
				"tooltip": "open document",
				"hotkey": "control-o",
			},
			{
				"click": cmd_save,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
	
							draw_icon_floppy_disk(ctx);
						},
				"tooltip": "save document",
				"hotkey": "control-s",
			},
			{
				"click": cmd_save_as,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
	
							draw_icon_floppy_disk(ctx);
							draw_icon_pencil_overlay(ctx);
						},
				"tooltip": "save document as ...",
				"hotkey": "shift-control-s",
			},
			{
				"click": cmd_run,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.fillStyle = "#080";
							ctx.beginPath();
							ctx.moveTo(5, 5);
							ctx.lineTo(15, 10);
							ctx.lineTo(5, 15);
							ctx.fill();
						},
				"tooltip": "run/continue program",
				"hotkey": "F7",
			},
			{
				"click": cmd_interrupt,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.fillStyle = "#c00";
							ctx.fillRect(5, 5, 4, 10);
							ctx.fillRect(11, 5, 4, 10);
						},
				"tooltip": "interrupt program",
				"hotkey": "shift-F7",
			},
			{
				"click": cmd_reset,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.fillStyle = "#c00";
							ctx.fillRect(5, 5, 10, 10);
						},
				"tooltip": "abort program",
				"hotkey": "F10",
			},
			{
				"click": cmd_step_into,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.fillStyle = "#000";
							ctx.fillRect(10,  3, 7, 2);
							ctx.fillRect(13,  6, 4, 2);
							ctx.fillRect(13,  9, 4, 2);
							ctx.fillRect(13, 12, 4, 2);
							ctx.fillRect(10, 15, 7, 2);
							ctx.lineWidth = 1;
							ctx.strokeStyle = "#00f";
							ctx.beginPath();
							ctx.moveTo(8, 4);
							ctx.lineTo(3, 4);
							ctx.lineTo(3, 10);
							ctx.lineTo(6, 10);
							ctx.stroke();
							ctx.fillStyle = "#00f";
							ctx.beginPath();
							ctx.moveTo(5, 7);
							ctx.lineTo(5, 13);
							ctx.lineTo(9.5, 10);
							ctx.fill();
						},
				"tooltip": "run current command, step into function calls",
				"hotkey": "shift-control-F11",
			},
			{
				"click": cmd_step_over,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.fillStyle = "#000";
							ctx.fillRect(10,  3, 7, 2);
							ctx.fillRect(13,  6, 4, 2);
							ctx.fillRect(13,  9, 4, 2);
							ctx.fillRect(13, 12, 4, 2);
							ctx.fillRect(10, 15, 7, 2);
							ctx.lineWidth = 1;
							ctx.strokeStyle = "#00f";
							ctx.beginPath();
							ctx.moveTo(8, 4);
							ctx.lineTo(3, 4);
							ctx.lineTo(3, 16);
							ctx.lineTo(6, 16);
							ctx.stroke();
							ctx.fillStyle = "#00f";
							ctx.beginPath();
							ctx.moveTo(5, 13);
							ctx.lineTo(5, 19);
							ctx.lineTo(9.5, 16);
							ctx.fill();
						},
				"tooltip": "run current line of code, do no step into function calls",
				"hotkey": "control-F11",
			},
			{
				"click": cmd_step_out,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.fillStyle = "#000";
							ctx.fillRect(10,  3, 7, 2);
							ctx.fillRect(13,  6, 4, 2);
							ctx.fillRect(13,  9, 4, 2);
							ctx.fillRect(13, 12, 4, 2);
							ctx.fillRect(10, 15, 7, 2);
							ctx.lineWidth = 1;
							ctx.strokeStyle = "#00f";
							ctx.beginPath();
							ctx.moveTo(11, 10);
							ctx.lineTo(3, 10);
							ctx.lineTo(3, 16);
							ctx.lineTo(6, 16);
							ctx.stroke();
							ctx.fillStyle = "#00f";
							ctx.beginPath();
							ctx.moveTo(5, 13);
							ctx.lineTo(5, 19);
							ctx.lineTo(9.5, 16);
							ctx.fill();
						},
				"tooltip": "step out of current function",
				"hotkey": "shift-F11",
			},
			{
				"click": cmd_toggle_breakpoint,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.fillStyle = "#c00";
							ctx.arc(10, 10, 3.9, 0, 2 * Math.PI, false);
							ctx.fill();
						},
				"tooltip": "toggle breakpoint",
				"hotkey": "F8",
			},
			/*{
				"click": function() { module.sourcecode.execCommand("findPersistent"); },
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.strokeStyle = "#000";
							ctx.lineWidth = 1.5;
							ctx.arc(8, 8, 5, 0.25*Math.PI, 2.25*Math.PI, false); // starting/ending point at 45 degrees south-east
							ctx.lineTo(17, 17);
							ctx.stroke();
						},
				"tooltip": "Search",
			},*/
		];
	
	// load hotkeys
	function loadConfig()
	{
		let str = localStorage.getItem("tscript.ide.config");
		if (str)
		{
			let config = JSON.parse(str);
			if (config.hasOwnProperty("hotkeys"))
			{
				let n = Math.min(buttons.length, config.hotkeys.length);
				for (let i=0; i<n; i++)
				{
					buttons[i].hotkey = config.hotkeys[i];
				}
			}
			if (config.hasOwnProperty("options"))
			{
				options = config.options;
			}
		}
		return null;
	}
	loadConfig();
	
	// save hotkeys
	function saveConfig()
	{
		let config:any = {"options": options, "hotkeys": []};
		for (let i=0; i<buttons.length; i++)
		{
			config.hotkeys.push(buttons[i].hotkey);
		}
		localStorage.setItem("tscript.ide.config", JSON.stringify(config));
	}
	
	
	// TODO move to tgui.js
	// creates an event handler for a dialog, whenever it is going to be closed.
	// * onClose - a cleanup callback, use null for no cleanup
	function handleDialogCloseWith(onClose)
	{
		return function(event)
		{
			if(onClose!=null) onClose();
			tgui.stopModal();
			if(event)
			{
				event.preventDefault();
				event.stopPropagation();
			}
			return false;
		}
	}
	
	// TODO move to tgui.js
	function createTitleBar(dlg, title, onClose)
	{
		let titlebar = tgui.createElement({
				"parent": dlg,
				"type": "div",
				"style": {"position": "absolute", "width": "100%", "left": "0", "height": "24px", "top": "0"},
				"classname": "tgui-modal-titlebar",
			});
			
		let titlebar_title = tgui.createElement({
				"parent": titlebar,
				"type": "span",
				"style": {},
				"classname": "tgui-modal-titlebar-title",
				"text": title,
			});
			
		let close = tgui.createButton({
				"parent": titlebar,
				"click": function ()
						{
							return handleDialogCloseWith(onClose)(null);
						},
				"width": 20,
				"height": 20,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.lineWidth = 2;
							ctx.strokeStyle = "#000";
							ctx.beginPath();
							ctx.moveTo( 4,  4);
							ctx.lineTo(14, 14);
							ctx.stroke();
							ctx.beginPath();
							ctx.moveTo( 4, 14);
							ctx.lineTo(14,  4);
							ctx.stroke();
						},
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "close",
			});
			
		return titlebar;
	}
	
	// TODO move to tgui.js
	function createDialog(title, size, onClose:any = undefined)
	{
		let dlg = tgui.createElement({
				"type": "div",
				"style": {"width": size["width"], "height": size["height"], "background": "#eee", "overflow": "hidden"},
			});
		let titlebar = createTitleBar(dlg, title, onClose);
	
		dlg.onKeyDown = function(event)
			{
				if (event.key == "Escape")
				{
					return handleDialogCloseWith(onClose)(event);
				}
			};
	
		return dlg;
	}
	
	function configDlg()
	{
		let dlg = createDialog("configuration", {"width": "calc(max(370px, 50vw))", "left": "25vw", "height": "calc(max(270px, 50vh))", "top": "25vh"}, saveConfig);
		let content = tgui.createElement({
				"parent": dlg,
				"type": "div",
				"html": "<h3 style=\"margin-top: 20px;\">Configure Hotkeys</h3><p>Click a button to configure its hotkey.</p>",
			});
		let dlg_buttons:any = [];
		let div = tgui.createElement({parent: dlg, type: "div"});
		for (let i=0; i<buttons.length; i++)
		{
			let description:any = Object.assign({}, buttons[i]);
			description.width = 20;
			description.height = 20;
			description.style = {"height": "22px"};
			if (description.hotkey) description.tooltip += " (" + description.hotkey + ")";
			delete description.hotkey;
			description.parent = div;
			{
				let btn = i;
				description.click = function()
						{
							let dlg = createDialog("set hotkey", {"width": "calc(max(340px, 30vw))", "height": "calc(max(220px, 30vh))"});
							let icon = tgui.createCanvasIcon({
								"parent": dlg, 
								"width": 20, "height": 20, 
								"draw": buttons[btn].draw, 
								"style": {"position": "absolute", "left": "15px", "top": "40px"}
							});
							
							tgui.createElement({
								parent: dlg, 
								type: "label", 
								"text":buttons[btn].tooltip, 
								"style":{"position": "absolute", "left": "50px", "top": "40px"}
							});
							tgui.createElement({
								parent: dlg, 
								type: "label", 
								"text": "current hotkey: " + (buttons[btn].hotkey ? buttons[btn].hotkey : "<None>"),
								"style":{"position": "absolute", "left": "50px", "top": "70px"}
							});
							tgui.createElement({
								parent: dlg, 
								type: "label", 
								"text":"press the hotkey to assign, or press escape to remove the current hotkey", 
								"style":{"position": "absolute", "left": "15px", "top": "130px"}
							});
							dlg.onKeyDown = function(event)
									{
										event.preventDefault();
										event.stopPropagation();
	
										let key = event.key;
										if (key === "Shift" || key === "Control" || key === "Alt" || key === "OS" || key === "Meta") return;
										if (buttons[btn].hotkey)
										{
											tgui.setTooltip(buttons[btn].control.dom, buttons[btn].tooltip);
											tgui.setTooltip(dlg_buttons[btn].dom, buttons[btn].tooltip);
											tgui.releaseHotkey(buttons[btn].hotkey);
											delete buttons[btn].hotkey;
										}
										if (key === "Escape")
										{
											tgui.stopModal();
											return false;
										}
	
										if (event.altKey) key = "alt-" + key;
										if (event.ctrlKey) key = "control-" + key;
										if (event.shiftKey) key = "shift-" + key;
										key = tgui.normalizeHotkey(key);
	
										if (tgui.hotkey(key))
										{
											alert("hotkey " + key + " is already in use");
										}
										else
										{
											buttons[btn].hotkey = key;
											tgui.setHotkey(key, buttons[btn].click);
											tgui.setTooltip(buttons[btn].control.dom, buttons[btn].tooltip + " (" + key + ")");
											tgui.setTooltip(dlg_buttons[btn].dom, buttons[btn].tooltip + " (" + key + ")");
											tgui.stopModal();
										}
										return false;
									};
								
							let cancel = tgui.createElement({
									"parent": dlg,
									"type": "button",
									"style": {"position": "absolute", "right": "10px", "bottom": "10px", "width": "100px", "height": "25px"},
									"text": "Cancel",
									"classname": "tgui-dialog-button"
								});
							cancel.addEventListener("click", handleDialogCloseWith(saveConfig));
							tgui.startModal(dlg);
						};
			}
			dlg_buttons.push(tgui.createButton(description));
		}
	
		let checked = "";
	
		div = tgui.createElement({parent: dlg, type: "div"});
		let h3 = tgui.createElement({parent: div, type: "h3", style: {"margin-top": "20px"}, text: "Coding Style"});
		let p = tgui.createElement({parent: div, type: "p"});
		let lbl = tgui.createElement({parent: p, type: "label", "html":" enable style errors "});
		let checkbox = tgui.createElement({parent: lbl, type: "input", properties: {type: "checkbox"},
					click: function(event)
					{ options.checkstyle = checkbox.checked; },
				});
		if (options.checkstyle) checkbox.checked = true;
	
		let close = tgui.createElement({
				"parent": dlg,
				"type": "button",
				"style": {"position": "absolute", "right": "10px", "bottom": "10px", "width": "100px", "height": "25px"},
				"text": "Close",
				"classname": "tgui-dialog-button"
			});
		close.addEventListener("click", handleDialogCloseWith(saveConfig));
	
		tgui.startModal(dlg);
	}
	
	function fileDlg(title, filename, allowNewFilename, onOkay)
	{
		// 10px horizontal spacing
		//  7px vertical spacing
		// populate array of existing files
		let files = new Array();
		for (let key in localStorage)
		{
			if (key.substr(0, 13) === "tscript.code.") files.push(key.substr(13));
		}
		files.sort();
	
		// create controls
		let dlg = createDialog(title, {"width": "calc(max(440px, 50vw))", "left": "25vw", "height": "calc(max(260px, 70vh))", "top": "15vh"});
		let dlgContent = tgui.createElement({
			"parent": dlg,
			"type": "div",
			"classname": "tgui-modal-content",
			"style": {"display": "flex", "flex-direction": "column", "justify-content": "space-between"}
		});
		
		let toolbar = tgui.createElement({
				"parent": dlgContent,
				"type": "div",
				"style": {"width": "100%", "height": "25px", "margin-top": "7px"},
			});
		// Toolbar contents
		let deleteBtn = tgui.createElement({
				"parent": toolbar,
				"type": "button",
				"style": {"width": "100px", "height": "100%", "margin-left": "10px"},
				"text": "Delete file",
				"click": () => deleteFile(name.value),
				"classname": "tgui-dialog-button"
			});
	
		let exportBtn = tgui.createElement({
				"parent": toolbar,
				"type": "button",
				"style": {"width": "100px", "height": "100%", "margin-left": "10px"},
				"text": "Export",
				"click": () => exportFile(name.value),
				"classname": "tgui-dialog-button"
			});
		
		let importBtn = tgui.createElement({
				"parent": toolbar,
				"type": "button",
				"style": {"width": "100px", "height": "100%", "margin-left": "10px"},
				"text": "Import",
				"click": () => importFile(),
				"classname": "tgui-dialog-button"
			});
	
		let status = tgui.createElement({
				"parent": toolbar,
				"type": "label",
				"style": {"width": "100px", "height": "100%", "margin-left": "10px"},
				"text": (files.length > 0 ? files.length : "No") + " document"+(files.length == 1?"":"s"),
				"classname": "tgui-status-box"
			});
		// end Toolbar contents
		
		let list = tgui.createElement({
				"parent": dlgContent,
				"type": files.length > 0 ? "select" : "text",
				"properties": {"size": Math.max(2, files.length)},
				"classname": "tgui-list-box",
				"style": {"flex": "auto", "background": "#fff", "margin": "7px 10px", "overflow": "scroll"}
			});
		let name = {value: filename};
		if (allowNewFilename)
		{
			name = tgui.createElement({
					"parent": dlgContent,
					"type": "input",
					"style": {"height": "25px", "background": "#fff", "margin": "0 10px 7px 10px"},
					"classname": "tgui-text-box",
					"text": filename,
					"properties": {type:"text", placeholder:"Filename"}
				});
		}
		let buttons = tgui.createElement({
				"parent": dlgContent,
				"type": "div",
				"style": {"width": "100%", "height": "25px", "margin-bottom": "7px", "display": "flex", "justify-content": "flex-end"},
			});
		let okay = tgui.createElement({
				"parent": buttons,
				"type": "button",
				"style": {"width": "100px", "height": "100%", "margin-right": "10px"},
				"text": "Okay",
				"classname": "tgui-dialog-button"
			});
		let cancel = tgui.createElement({
				"parent": buttons,
				"type": "button",
				"style": {"width": "100px", "height": "100%", "margin-right": "10px"},
				"text": "Cancel",
				"classname": "tgui-dialog-button"
			});
		// populate options
		for (let i=0; i<files.length; i++)
		{
			let option = new Option(files[i], files[i]);
			list.options[i] = option;
		}
	
		// event handlers
		list.addEventListener("change", function(event)
				{
					if (event.target && event.target.value) name.value = event.target.value;
				});
		list.addEventListener("keydown", function(event)
				{
					if (event.key === "Backspace" || event.key === "Delete")
					{
						event.preventDefault();
						event.stopPropagation();
						deleteFile(name.value);
						return false;
					}
				})
		let handleFileConfirmation = function(event)
				{
					event.preventDefault();
					event.stopPropagation();
					let fn = name.value;
					if (fn != "")
					{
						if (allowNewFilename || files.indexOf(fn) >= 0)
						{
							tgui.stopModal();
							onOkay(fn);
						}
					}
					return false;
				};
		list.addEventListener("dblclick", handleFileConfirmation);
		okay.addEventListener("click", handleFileConfirmation);
		cancel.addEventListener("click", handleDialogCloseWith(null));
	
		dlg.onKeyDown = function(event)
				{
					if (event.key === "Escape")
					{
						tgui.stopModal();
						event.preventDefault();
						event.stopPropagation();
						return false;
					}
					else if (event.key === "Enter")
					{
						event.preventDefault();
						event.stopPropagation();
						let fn = name.value;
						if (fn != "")
						{
							if (allowNewFilename || files.indexOf(fn) >= 0)
							{
								tgui.stopModal();
								onOkay(fn);
							}
						}
						return false;
					}
				};
	
		tgui.startModal(dlg);
		(allowNewFilename ? name : list).focus();
		return dlg;
	
		function deleteFile(filename)
		{
			let index = files.indexOf(filename);
			if (index >= 0)
			{
				if (confirm("Delete file \"" + filename + "\"\nAre you sure?"))
				{
					localStorage.removeItem("tscript.code." + filename);
					files.splice(index, 1);
					list.remove(index);
				}
			}
		}
	
		function download(filename, text, mime = "text/plain")
		{
			var element = document.createElement('a');
			element.setAttribute('href', 'data:' + mime + ';charset=utf-8,' + encodeURIComponent(text));
			element.setAttribute('download', filename);
	
			element.style.display = 'none';
			document.body.appendChild(element);
	
			element.click();
	
			document.body.removeChild(element);
		}
	
		function exportFile(filename)
		{
			let data = localStorage.getItem("tscript.code." + filename);
			download(filename + ".tscript", data);
		}
	
		function importFile()
		{
			let fileImport = document.createElement('input');
			fileImport.type = "file";
			fileImport.multiple = true;
			fileImport.style.display = "none";
			fileImport.accept = ".tscript";
	
			fileImport.addEventListener('change', async (event:any) =>
			{
				if(event.target.files){
					for(let file of event.target.files)
					{
						let filename = file.name.split('.tscript')[0];
						if(files.includes(filename))
						{
							/*if(!confirm("Replace file \"" + filename + "\"\nAre you sure?"))
							{
								return;
							}*/
						}
						let data = await file.text();
						localStorage.setItem("tscript.code." + filename, data);
						if(!files.includes(filename))
						{
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
	
	module.create = function(container, options)
	{
		if (! options) options = {"export-button": true, "documentation-button": true};
	
		tgui.releaseAllHotkeys();
	
		// create HTML elements of the GUI
		module.main = tgui.createElement({"type": "div", "parent": container, "classname": "ide ide-main"});
		tgui.setHotkeyElement(module.main);
	
		module.toolbar = tgui.createElement({"type": "div", "parent": module.main, "classname": "ide ide-toolbar"});
	
		// add the export button on demand
		if (options["export-button"])
		{
			buttons.push(
				{
					"click": cmd_export,
					"draw": function(canvas)
							{
								let ctx = canvas.getContext("2d");
								ctx.strokeStyle = "#080";
								ctx.lineWidth = 2;
								ctx.beginPath();
								ctx.moveTo( 3,  7);
								ctx.lineTo(10,  7);
								ctx.lineTo(10,  3);
								ctx.lineTo(17, 10);
								ctx.lineTo(10, 17);
								ctx.lineTo(10, 13);
								ctx.lineTo( 3, 13);
								ctx.closePath();
								ctx.stroke();
							},
					"tooltip": "export program as webpage",
				},
			);
		}
	
		// prepare menu bar
		let sep = [false, false, false, true, false, false, true, false, false, false, true, true];
		for (let i=0; i<buttons.length; i++)
		{
			let description = Object.assign({}, buttons[i]);
			description.width = 20;
			description.height = 20;
			description.style = {"float": "left", "height": "22px"};
			if (description.hotkey) description.tooltip += " (" + description.hotkey + ")";
			description.parent = module.toolbar;
			buttons[i].control = tgui.createButton(description);
	
			if (sep[i])
			{
				tgui.createElement({
							"type": "div",
							"parent": module.toolbar,
							"classname": "tgui tgui-control tgui-toolbar-separator"
						});
			}
		}
	
		tgui.createButton({
				"click": function ()
						{
							configDlg();
							return false;
						},
				"width": 20,
				"height": 20,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.fillStyle = "#000";
							ctx.strokeStyle = "#000";
							ctx.arc(10, 10, 2.0, 0, 2 * Math.PI, false);
							ctx.fill();
							ctx.lineWidth = 2;
							ctx.strokeStyle = "#000";
							ctx.beginPath();
							ctx.arc(10, 10, 5.7, 0, 2 * Math.PI, false);
							ctx.closePath();
							ctx.stroke();
							ctx.lineWidth = 2;
							ctx.beginPath();
							for (let i=0; i<12; i++)
							{
								let a = (i+0.5) * Math.PI / 6;
								ctx.moveTo(10 + 6.0 * Math.cos(a), 10 + 6.0 * Math.sin(a));
								ctx.lineTo(10 + 9.4 * Math.cos(a), 10 + 9.4 * Math.sin(a));
							}
							ctx.stroke();
						},
				"parent": module.toolbar,
				"style": {"float": "left"},
				"tooltip": "configuration",
			});
	
		tgui.createElement({
					"type": "div",
					"parent": module.toolbar,
					"classname": "tgui tgui-control tgui-toolbar-separator"
				});
	
		module.programstate = tgui.createLabel({
					"parent": module.toolbar,
					"style": {
						"float": "left",
						"width": "calc(min(250px, max(20px, 50vw - 270px)))",
						"height": "23px",
						// clipping
						"white-space": "nowrap",
						"overflow": "hidden",
						"direction": "rtl",
						"text-overflow": "ellipsis clip",
						
						"text-align": "center",
						"background": "#fff"
						}
			});
		// TODO set tooltip text to the content text, this should apply when the statusbox is too narrow
		module.programstate.unchecked = function() { this.setText("program has not been checked").setBackground("#ee8"); }
		module.programstate.error     = function() { this.setText("an error has occurred").setBackground("#f44"); }
		module.programstate.running   = function() { this.setText("program is running").setBackground("#8e8"); }
		module.programstate.waiting   = function() { this.setText("program is waiting").setBackground("#aca"); }
		module.programstate.stepping  = function() { this.setText("program is in stepping mode").setBackground("#8ee"); }
		module.programstate.finished  = function() { this.setText("program has finished").setBackground("#88e"); }
		module.programstate.unchecked();
	
		tgui.createElement({
					"type": "div",
					"parent": module.toolbar,
					"classname": "tgui tgui-control tgui-toolbar-separator"
				});
	
		tgui.createButton({
				"click": function ()
						{
							for (let i=0; i<tgui.panels.length; i++)
							{
								let p = tgui.panels[i];
								if (p.title === "editor" || p.title === "messages")
									p.dock("left");
								else
									p.dock("right");
							}
							tgui.savePanelData();
							return false;
						},
				"width": 20,
				"height": 20,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.lineWidth = 1;
							ctx.fillStyle = "#fff";
							ctx.strokeStyle = "#aaa";
							
							ctx.beginPath();
							ctx.rect(2.5, 2.5, 15, 15);
							ctx.fill();
							ctx.stroke();
							
							ctx.fillStyle = "#ccc";
							ctx.fillRect(11, 3, 1, 14);
							
							ctx.fillStyle = "#77f";
							ctx.fillRect(3, 3, 14, 1);
							ctx.fillRect(3, 12, 8, 1);
							
							
							ctx.strokeStyle = "#222";
							ctx.lineWidth = 1.7;
							ctx.beginPath();
							ctx.arc( 9.5, 10.5, 4, 1.25*Math.PI, 2.6*Math.PI);
							ctx.stroke();
							
							ctx.fillStyle = "#222";
							ctx.beginPath();
							ctx.moveTo( 5,  5);
							ctx.lineTo( 5,  10);
							ctx.lineTo(10,  10);
							ctx.fill();
						},
				"parent": module.toolbar,
				"style": {"float": "left"},
				"tooltip": "restore panels",
			});
	
		tgui.createElement({
					"type": "div",
					"parent": module.toolbar,
					"classname": "tgui tgui-control tgui-toolbar-separator"
				});
	
		module.iconlist = tgui.createElement({
				"type": "div",
				"parent": module.toolbar,
				"classname": "tgui",
					"style": {
							"float": "left",
							"width": "200px",
							"height": "100%",
							"border": "none",
							"margin": "3px",
						},
			});
	
		tgui.createElement({
					"type": "div",
					"parent": module.toolbar,
					"classname": "tgui tgui-control tgui-toolbar-separator"
				});
	
		if (options["documentation-button"])
		{
			tgui.createButton({
					"click": () => showdoc(""),
					"text": "documentation",
					"parent": module.toolbar,
					"style": {"position": "absolute", "right": "0px"},
				});
				
			
			// pressing F1 
			tgui.setHotkey("F1", function()
				{
					let dlg = createDialog("open documentation", {"width": "calc(max(300px, 20vw))", "height": "calc(max(150px, 15vh))"});
					
					let selection = module.sourcecode.getSelection();
					// maximum limit of 30 characters
					// so that there is no problem, when accedentially everything
					// in a file is selected
					if(!selection)
					{
						// get current word under the cursor
						let cursor = module.sourcecode.getCursor();
						
						let word = module.sourcecode.findWordAt(cursor);
	
						selection = module.sourcecode.getRange(word.anchor, word.head);
					}
					selection = selection.substr(0, 30);
					let words = selection.match(/[a-z]+/gi); // global case insensitive
					let href = "";
					
					if(words)
					{
						href = "#search/"+words.join("/");
					}
						
					tgui.createElement({
						"parent": dlg,
						"type": "div",
						"style": {"margin-top": "20px"},
						"text": "Open the documentation in another tab?",
					});
						
					if(words)
					{
						tgui.createElement({
							"parent": dlg,
							"type": "div",
							"style": {"margin-top": "10px"},
							"text": "Search for \"" + words.join(" ") + "\"?",
						});
					}
					
					let okay = tgui.createElement({
							"parent": dlg,
							"type": "button",
							"style": {"position": "absolute", "right": "120px", "bottom": "10px", "width": "100px", "height": "25px"},
							"text": "Okay",
							"classname": "tgui-dialog-button"
						});
					okay.addEventListener("click", (event) => 
						{
							tgui.stopModal();
							event.preventDefault();
							event.stopPropagation();
							showdoc(href)
							return false;
						});
						
					let cancel = tgui.createElement({
							"parent": dlg,
							"type": "button",
							"style": {"position": "absolute", "right": "10px", "bottom": "10px", "width": "100px", "height": "25px"},
							"text": "Cancel",
							"classname": "tgui-dialog-button"
						});
					cancel.addEventListener("click", handleDialogCloseWith(null));
							
					tgui.startModal(dlg);
					
					okay.focus();
				});
		}
	
		// area containing all panels
		let area = tgui.createElement({"type": "div", "parent": module.main, "classname": "ide ide-panel-area"});
	
		// prepare tgui panels
		tgui.preparePanels(area, module.iconlist);
	
		let panel_editor = tgui.createPanel({
				"title": "editor",
				"state": "left",
				"fallbackState": "float",
				"dockedheight": 600,
				"onArrange": function() { if (module.sourcecode) module.sourcecode.refresh(); },
				"icondraw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							draw_icon_paper(ctx);
	
							ctx.fillStyle = "#777";
							ctx.fillRect(10, 5, 3, 1);
							ctx.fillRect(10, 7, 2, 1);
							ctx.fillRect( 7, 9, 4, 1);
							ctx.fillRect( 6,11, 7, 1);
							ctx.fillRect( 9,13, 4, 1);
						}
			});
		panel_editor.textarea = tgui.createElement({"type": "textarea", "parent": panel_editor.content, "classname": "ide ide-sourcecode"});
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
						"F3": "findNext",
						"Shift-F3": "findPrev",
						"Ctrl-Up": "scrollUp",
						"Ctrl-Down": "scrollDown",
						"Shift-Tab": "unindent",
					},
			});
		module.sourcecode.on("change", function(cm, changeObj)
				{
					module.document.dirty = true;
					if (module.interpreter)
					{
						clear();
						updateControls();
					}
				});
		module.sourcecode.on("gutterClick", function(cm, line)
				{
					if (module.interpreter)
					{
						// ask the interpreter for the correct position of the marker
						let result = module.interpreter.toggleBreakpoint(line+1);
						if (result !== null)
						{
							line = result.line;
							cm.setGutterMarker(line-1, "breakpoints", result.active ? makeMarker() : null);
							module.sourcecode.scrollIntoView({"line": line}, 40);
						}
					}
					else
					{
						// set the marker optimistically, fix as soon as an interpreter is created
						cm.setGutterMarker(line, "breakpoints", cm.lineInfo(line).gutterMarkers ? null : makeMarker());
					}
				});
		module.editor_title = panel_editor.titlebar;
	
		let panel_messages = tgui.createPanel({
				"title": "messages",
				"state": "left",
				"dockedheight": 200,
				"icondraw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
	
							ctx.fillStyle = "#fff";
							ctx.strokeStyle = "#222";
							ctx.beginPath();
							ctx.ellipse(9.5, 8.5, 7, 6, 0, 0.73*Math.PI, 2.57*Math.PI, false);
							ctx.lineTo(4.5, 17);
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
	
							ctx.fillStyle = "#777";
							ctx.fillRect(8,  6, 3, 1);
							ctx.fillRect(6,  8, 2, 1);
							ctx.fillRect(9,  8, 5, 1);
							ctx.fillRect(7, 10, 4, 1);
						}
			});
		module.messagecontainer = tgui.createElement({"type": "div", "parent": panel_messages.content, "classname": "ide ide-messages"});
		module.messages = tgui.createElement({"type": "table", "parent": module.messagecontainer, "classname": "ide", "style": {"width": "100%"}});
	
		// prepare stack tree control
		let panel_stackview = tgui.createPanel({
				"title": "stack",
				"state": "icon",
				"fallbackState": "right",
				"icondraw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
	
							ctx.strokeStyle = "#222";
							ctx.lineWidth = 0.6;
	
							// white top
							ctx.fillStyle = "#fff";
							ctx.beginPath();
							ctx.moveTo( 4,  5.5);
							ctx.lineTo(10,  8.5);
							ctx.lineTo(16,  5.5);
							ctx.lineTo(10,  2.5);
							ctx.fill();
	
							// shaded lower pages
							ctx.fillStyle = "#bbb";
							ctx.beginPath();
							ctx.moveTo( 4,  5.5);
							ctx.lineTo( 4, 14.5);
							ctx.lineTo(10, 17.5);
							ctx.lineTo(10,  8.5);
							ctx.fill();
							
							ctx.fillStyle = "#999";
							ctx.beginPath();
							ctx.moveTo(10, 17.5);
							ctx.lineTo(16, 14.5);
							ctx.lineTo(16,  5.5);
							ctx.lineTo(10,  8.5);
							ctx.fill();
	
	
							for(let i = 8; i < 17; i+=3)
							{
								ctx.beginPath();
								ctx.moveTo( 3, i + 0.5);
								ctx.lineTo(10, i + 3.5);
								ctx.lineTo(17, i + 0.5);
								ctx.stroke();
							}
	
							// top frame
							ctx.beginPath();
							ctx.moveTo( 3.5, 5.3);
							ctx.lineTo( 3.5, 5.7);
							ctx.lineTo(10,   8.5);
							ctx.lineTo(16.5, 5.7);
							ctx.lineTo(16.5, 5.3);
							ctx.lineTo(10,   2.5);
							ctx.closePath();
							ctx.stroke();
						}
			});
		module.stacktree = tgui.createTreeControl({"parent": panel_stackview.content});
	
		// prepare program tree control
		let panel_programview = tgui.createPanel({
				"title": "program",
				"state": "icon",
				"fallbackState": "right",
				"icondraw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							
							// Outline
							ctx.fillStyle = "#eeeeeec0";
							ctx.moveTo( 3,  2);
							ctx.lineTo(13,  2);
							ctx.lineTo(13,  5);
							ctx.lineTo(15,  5);
							ctx.lineTo(15,  8);
							ctx.lineTo(17,  8);
							ctx.lineTo(17, 12);
							ctx.lineTo(13, 12);
							ctx.lineTo(13, 14);
							ctx.lineTo(15, 14);
							ctx.lineTo(15, 18);
							ctx.lineTo( 5, 18);
							ctx.lineTo( 5, 15);
							ctx.lineTo( 3, 15);
							ctx.lineTo( 3, 11);
							ctx.lineTo( 7, 11);
							ctx.lineTo( 7,  9);
							ctx.lineTo( 5,  9);
							ctx.lineTo( 5,  6);
							ctx.lineTo( 3,  6);
							ctx.fill();
							
							// Black boxes
							ctx.fillStyle = "#000";
							ctx.fillRect(4,  3,  8, 2);
							ctx.fillRect(6,  6,  8, 2);
							ctx.fillRect(8,  9,  8, 2);
							ctx.fillRect(4, 12,  8, 2);
							ctx.fillRect(6, 15,  8, 2);
						}
			});
		module.programtree = tgui.createTreeControl({
				"parent": panel_programview.content,
				"nodeclick": function(event, value, id)
						{
							if (value.where)
							{
								setCursorPosition(value.where.line, value.where.ch);
							}
						},
			});
	
		// prepare turtle output panel
		let panel_turtle = tgui.createPanel({
				"title": "turtle",
				"state": "right",
				"fallbackState": "float",
				"icondraw": function(canvas)
						{
							// draws literally a turtle
							let ctx = canvas.getContext("2d");
	
							ctx.fillStyle = "#2c3";
							ctx.strokeStyle = "#070";
	
							// head
							ctx.beginPath();
							ctx.ellipse(9.5, 5, 2, 2.5, 0, 0*Math.PI, 2*Math.PI, false);
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
	
							// legs
							ctx.lineWidth = 1.6;
	
							ctx.beginPath();
							ctx.moveTo(3.5, 6);
							ctx.lineTo(9.5, 11);
							ctx.lineTo(15.5, 6);
							ctx.stroke();
	
							ctx.beginPath();
							ctx.moveTo(4.5, 17);
							ctx.lineTo(9.5, 10);
							ctx.lineTo(14.5, 17);
							ctx.stroke();
	
							// tail
							ctx.lineWidth = 1.3;
	
							ctx.beginPath();
							ctx.moveTo(9.5, 17);
							ctx.lineTo(8.5, 19);
							ctx.stroke();
	
							// main body
							ctx.lineWidth = 1;
							ctx.beginPath();
							ctx.ellipse(9.5, 11.5, 4, 5, 0, 0*Math.PI, 2*Math.PI, false);
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
	
							ctx.strokeStyle = "#0709";
							ctx.beginPath();
							ctx.ellipse(8.7, 10.7, 4, 5, 0, -0.3*Math.PI, 0.8*Math.PI, false);
							ctx.stroke();
						}
			});
		module.turtle = tgui.createElement({
				"type": "canvas",
				"parent": panel_turtle.content,
				"properties": {"width": 600, "height": 600},
				"classname": "ide ide-turtle",
			});
		module.turtle.addEventListener("contextmenu", function(event) { event.preventDefault(); return false; });
	
		// ensure that the turtle area remains square and centered
		let makeSquare = function()
		{
			let w = module.turtle.parentElement.offsetWidth;
			let h = module.turtle.parentElement.offsetHeight;
			let size = Math.min(w, h);
			module.turtle.style.width = size + "px";
			module.turtle.style.height = size + "px";
			module.turtle.style.marginLeft = ((w > size) ? Math.floor((w - size) / 2) : 0) + "px";
			module.turtle.style.marginTop = ((h > size) ? Math.floor((h - size) / 2) : 0) + "px";
		};
		panel_turtle.onArrange = makeSquare;
		panel_turtle.onResize = makeSquare;
	
		function createTypedEvent(displayname, dict)
		{
			if (! module.interpreter) throw new Error("[createTypedEvent] internal error");
			let p = module.interpreter.program;
			for (let idx=10; idx<p.types.length; idx++)
			{
				let t = p.types[idx];
				if (t.displayname === displayname)
				{
					// create the object without calling the constructor, considering default values, etc
					let obj:any = { "type": t, "value": { "a": [] } };
					let n = {"type": p.types[module.typeid_null], "value": {"b": null}};
					for (let i=0; i<t.objectsize; i++) obj.value.a.push(n);
	
					// fill its attributes
					for (let key in t.members)
					{
						if (! dict.hasOwnProperty(key)) continue;
						obj.value.a[t.members[key].id] = TScript.json2typed.call(module.interpreter, dict[key]);
					}
					return obj;
				}
			}
			throw new Error("[createTypedEvent] unknown type " + displayname);
		}
	
		// prepare canvas output panel
		let panel_canvas = tgui.createPanel({
				"title": "canvas",
				"state": "icon",
				"fallbackState": "right",
				"onResize": function(w, h)
						{
							if (!module.hasOwnProperty('standalone') && module.canvas)
							{
								module.canvas.width = w;
								module.canvas.height = h;
							}
							if (module.interpreter)
							{
								let e:any = {"width": w, "height": h};
								e = createTypedEvent("canvas.ResizeEvent", e);
								module.interpreter.enqueueEvent("canvas.resize", e);
							}
						},
				"icondraw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
	
							ctx.fillStyle = "#333";
							ctx.fillRect(3, 2, 14, 16);
							ctx.fillStyle = "#fff";
							ctx.fillRect(4, 3, 12, 14);
							ctx.fillStyle = "#00c8";
							ctx.strokeStyle = "#00cc";
							ctx.beginPath();
							ctx.rect(5.5, 5.5, 6, 6);
							ctx.fill();
							ctx.stroke();
							ctx.fillStyle = "#c008";
							ctx.strokeStyle = "#c00c";
							ctx.beginPath();
							ctx.arc(11, 11, 3.5, 0, 2*Math.PI);
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
						}
			});
		module.canvas = tgui.createElement({
				"type": "canvas",
				"parent": panel_canvas.content,
				"properties": {"width": panel_canvas.content.clientWidth, "height": panel_canvas.content.clientHeight},
				"classname": "ide ide-canvas",
			});
		module.canvas.addEventListener("contextmenu", function(event) { event.preventDefault(); return false; });
		panel_canvas.content.tabIndex = -1;
		panel_canvas.size = [0, 0];
	//	module.canvas.font_size = 16;
		function buttonName(button)
		{
			if (button === 0) return "left";
			else if (button === 1) return "middle";
			else return "right";
		}
		function buttonNames(buttons)
		{
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
		module.canvas.addEventListener("mousedown", function(event) {
					if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
					let e:any = {
							"button": buttonName(event.button),
							"buttons": buttonNames(event.buttons),
							"shift": event.shiftKey,
							"control": event.ctrlKey,
							"alt": event.altKey,
							"meta": event.metaKey,
						};
					e = Object.assign(e, relpos(module.canvas, event.pageX, event.pageY));
					e = createTypedEvent("canvas.MouseButtonEvent", e);
					module.interpreter.enqueueEvent("canvas.mousedown", e);
				});
		module.canvas.addEventListener("mouseup", function(event) {
					if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
					let e:any = {
							"button": buttonName(event.button),
							"buttons": buttonNames(event.buttons),
							"shift": event.shiftKey,
							"control": event.ctrlKey,
							"alt": event.altKey,
							"meta": event.metaKey,
						};
					e = Object.assign(e, relpos(module.canvas, event.pageX, event.pageY));
					e = createTypedEvent("canvas.MouseButtonEvent", e);
					module.interpreter.enqueueEvent("canvas.mouseup", e);
				});
		module.canvas.addEventListener("mousemove", function(event) {
					if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
					let e:any = {
							"button": 0,
							"buttons": buttonNames(event.buttons),
							"shift": event.shiftKey,
							"control": event.ctrlKey,
							"alt": event.altKey,
							"meta": event.metaKey,
						};
					e = Object.assign(e, relpos(module.canvas, event.pageX, event.pageY));
					e = createTypedEvent("canvas.MouseMoveEvent", e);
					module.interpreter.enqueueEvent("canvas.mousemove", e);
				});
		module.canvas.addEventListener("mouseout", function(event) {
					if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
					let e = {"type": module.interpreter.program.types[module.typeid_null], "value": {"b": null}};
					module.interpreter.enqueueEvent("canvas.mouseout", e);
				});
		panel_canvas.content.addEventListener("keydown", function(event) {
					if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
					let e:any = {
							"key": event.key,
							"shift": event.shiftKey,
							"control": event.ctrlKey,
							"alt": event.altKey,
							"meta": event.metaKey,
						};
					e = createTypedEvent("canvas.KeyboardEvent", e);
					module.interpreter.enqueueEvent("canvas.keydown", e);
				});
		panel_canvas.content.addEventListener("keyup", function(event) {
					if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
					let e:any = {
							"key": event.key,
							"shift": event.shiftKey,
							"control": event.ctrlKey,
							"alt": event.altKey,
							"meta": event.metaKey,
						};
					e = createTypedEvent("canvas.KeyboardEvent", e);
					module.interpreter.enqueueEvent("canvas.keyup", e);
				});
		tgui.arrangePanels();
	
		module.sourcecode.focus();
	}
	
	return module;
	}());
	
	window.onbeforeunload = function(event){
	if (String(document.title).startsWith("TScript IDE")) { event.preventDefault(); event.returnValue = ''; }
	};