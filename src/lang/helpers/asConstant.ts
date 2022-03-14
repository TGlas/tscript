import { simfalse } from "./sims";
import { constantstep } from "../helpers/steps";
import {
	binary_operator_impl,
	binary_operator_precedence,
	left_unary_operator_impl,
	left_unary_operator_precedence,
} from "../parser/parser_helper";
import { Typeid } from "../helpers/typeIds";
import { get_program } from "../helpers/getParents";

// Return an alternative pe, which is a constant, if possible.
// Otherwise return null.
export function asConstant(pe, state) {
	if (pe.petype === "constant") {
		return pe;
	} else if (pe.petype === "array") {
		let value = new Array();
		for (let i = 0; i < pe.elements.length; i++) {
			let sub = asConstant(pe.elements[i], state);
			if (sub === null) return null;
			value.push(sub.typedvalue);
		}
		return {
			petype: "constant",
			where: pe.where,
			typedvalue: {
				type: get_program(pe).types[Typeid.typeid_array],
				value: { b: value },
			},
			step: constantstep,
			sim: simfalse,
		};
	} else if (pe.petype === "dictionary") {
		let value = {};
		for (let i = 0; i < pe.keys.length; i++) {
			let sub = asConstant(pe.values[i], state);
			if (sub === null) return null;
			value["#" + pe.keys[i]] = sub.typedvalue;
		}
		return {
			petype: "constant",
			where: pe.where,
			typedvalue: {
				type: get_program(pe).types[Typeid.typeid_dictionary],
				value: { b: value },
			},
			step: constantstep,
			sim: simfalse,
		};
	} else if (pe.petype.substring(0, 20) === "left-unary operator ") {
		let sub = asConstant(pe.argument, state);
		if (sub === null) return null;
		let symbol = pe.petype.substring(20);
		return {
			petype: "constant",
			where: pe.where,
			typedvalue: left_unary_operator_impl[symbol].call(
				state,
				sub.typedvalue
			),
			step: constantstep,
			sim: simfalse,
		};
	} else if (pe.petype.substring(0, 16) === "binary operator ") {
		let lhs = asConstant(pe.lhs, state);
		if (lhs === null) return null;
		let rhs = asConstant(pe.rhs, state);
		if (rhs === null) return null;
		let symbol = pe.petype.substring(16);
		return {
			petype: "constant",
			where: pe.where,
			typedvalue: binary_operator_impl[symbol].call(
				state,
				lhs.typedvalue,
				rhs.typedvalue
			),
			step: constantstep,
			sim: simfalse,
		};
	} else return null;
}
