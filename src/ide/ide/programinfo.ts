import { interpreter } from ".";
import { TScript } from "../../lang";
import * as tgui from "./../tgui";
import { type2css } from "./utils";

/**
 * This function defines the program tree.
 */
export function programinfo(value, node_id) {
	let ret: any = { children: [], ids: [] };
	if (!interpreter) return ret;
	if (interpreter.stack.length === 0) return ret;

	let frame = interpreter.stack[interpreter.stack.length - 1];
	let current_pe = frame.pe[frame.pe.length - 1];
	let current_pes = new Set();
	for (let i = 0; i < frame.pe.length; i++) current_pes.add(frame.pe[i]);

	if (value === null) {
		ret.children.push(interpreter.program);
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
		} else if (petype === "do-while-loop" || petype === "while-do-loop") {
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
