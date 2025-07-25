import { collection, interpreterSession } from ".";
import { TScript } from "../../lang";
import { Typeid } from "../../lang/helpers/typeIds";
import * as tgui from "./../tgui";
import { type2css } from "./utils";

/**
 *  This function defines the stack trace tree.
 */
export function stackinfo(value, node_id) {
	let ret: tgui.TreeNodeInfo<any> = { children: [], ids: [] };
	const interpreter = interpreterSession?.interpreter;
	if (!interpreter) return ret;

	if (value === null) {
		for (let i = interpreter.stack.length - 1; i >= 0; i--) {
			ret.children.push({
				nodetype: "frame",
				index: i,
				frame: interpreter.stack[i],
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

				ret.element.addEventListener("click", async (event) => {
					event.preventDefault();
					await collection.openEditorFromFile(where.filename, {
						line: where.line - 1,
						character: where.ch,
					});
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
				if (!value.frame.variables[i] || !func.variables[i]) continue;
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
			} else if (value.typedvalue.type.id === Typeid.typeid_dictionary) {
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
			} else if (value.typedvalue.type.id === Typeid.typeid_function) {
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
							index: value.typedvalue.value.b.func.closureparams[
								i
							].name,
							typedvalue: value.typedvalue.value.b.enclosed[i],
						});
						ret.ids.push(
							node_id +
								"/" +
								value.typedvalue.value.b.func.closureparams[i]
									.name
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
								value.typedvalue.value.a[type.variables[i].id],
						});
						ret.ids.push(node_id + "/" + type.variables[i].name);
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
		} else throw "[stacktree.update] unknown nodetype: " + value.nodetype;
	}
	return ret;
}
