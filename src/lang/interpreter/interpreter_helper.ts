import { binary_operator_impl, left_unary_operator_impl } from "../parser/parser_helper";
import { simfalse } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";

export function deepcopy(value, excludekeys) {
	if (typeof excludekeys === "undefined") excludekeys = {};
	if (Array.isArray(value)) {
		let ret = new Array();
		for (let i = 0; i < value.length; i++) ret.push(deepcopy(value[i], excludekeys));
		return ret;
	} else if (typeof value === "object" && value !== null) {
		let ret = {};
		for (let key in value) {
			if (!value.hasOwnProperty(key)) continue;
			if (excludekeys.hasOwnProperty(key)) continue;
			ret[key] = deepcopy(value[key], excludekeys);
		}
		return ret;
	} else return value;
}

// deep copy of a boxed constant
export function copyconstant(constant) {
	if (constant.type.id === Typeid.typeid_array) {
		let value = new Array();
		for (let i = 0; i < constant.value.b.length; i++)
			value.push(copyconstant.call(this, constant.value.b[i]));
		return {
			type: this.program.types[Typeid.typeid_array],
			value: { b: value },
		};
	} else if (constant.type.id === Typeid.typeid_dictionary) {
		let value = {};
		for (let key in constant.value.b) {
			if (constant.value.b.hasOwnProperty(key))
				value[key] = copyconstant.call(this, constant.value.b[key]);
		}
		return {
			type: this.program.types[Typeid.typeid_dictionary],
			value: { b: value },
		};
	} else return constant;
}

// Create a program element of type breakpoint.
// The breakpoint is initially inactive.
export function create_breakpoint(parent, state) {
	let active = false;
	return {
		petype: "breakpoint",
		parent: parent,
		line: state.line,
		where: state.get(),
		active: function () {
			return active;
		},
		set: function () {
			active = true;
		},
		clear: function () {
			active = false;
		},
		toggle: function () {
			active = !active;
		},
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			if (active) {
				this.interrupt();
				if (this.service.breakpoint) this.service.breakpoint();
			}
			frame.pe.pop();
			frame.ip.pop();
			return false;
		},
		sim: () => active,
	};
}
