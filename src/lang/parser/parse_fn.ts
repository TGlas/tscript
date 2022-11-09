import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import {
	assignments,
	binary_operator_impl,
	binary_operator_precedence,
	left_unary_operator_impl,
	left_unary_operator_precedence,
	peek_keyword,
} from "./parser_helper";
import { create_breakpoint } from "../interpreter/interpreter_helper";
import {
	get_context,
	get_function,
	get_program,
	get_type,
} from "../helpers/getParents";
import { scopestep } from "../helpers/steps";
import { simfalse, simtrue } from "../helpers/sims";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";

export function resolve_name(state, name, parent, errorname) {
	// prepare a generic "not defined" error
	let error = "/name/ne-5";
	let arg = [errorname, name];
	let lookup = null;
	let pe: any = parent;
	while (pe) {
		// check name inside pe
		if (pe.hasOwnProperty("names") && pe.names.hasOwnProperty(name)) {
			let n = pe.names[name];

			// check whether a variable or function is accessible
			if (
				n.petype === "variable" ||
				n.petype === "function" ||
				n.petype === "attribute" ||
				n.petype === "method"
			) {
				// find the context
				let context = get_context(pe);
				if (
					n.petype !== "variable" &&
					context.petype === "global scope"
				) {
					// global scope is always okay
					ErrorHelper.assert(n.petype === "function");
				} else if (
					n.petype === "variable" &&
					(pe.petype === "global scope" || pe.petype === "namespace")
				) {
					// variables must be in a scope with indefinite lifetime,
					// sub-scopes are not allowed
				} else if (context.petype === "type") {
					// non-static members must live in the same class
					if (n.petype === "attribute" || n.petype === "method") {
						let cl = get_type(parent);
						if (cl !== context)
							state.error("/name/ne-6", [errorname, name]);
					}
				} else {
					// local variables must live in the same function
					ErrorHelper.assert(
						n.petype === "variable" || n.petype === "function"
					);
					if (n.petype === "variable") {
						let fn = get_function(parent);
						if (fn !== context)
							state.error("/name/ne-7", [errorname, name]);
					}
				}
			}

			// Ensure that the definition is located before the current position, or that it is hoisted.
			// Note: variable are not hoisted unless they are static within a class.
			if (
				n.petype !== "variable" ||
				n.parent.petype === "type" ||
				!n.hasOwnProperty("where") ||
				n.where.pos < state.pos
			)
				return pe;
		}

		// check the superclass chain
		if (pe.petype === "type") {
			let sup = pe.superclass;
			while (sup) {
				if (sup.names.hasOwnProperty(name)) {
					if (sup.names[name].access === "private") {
						// prepare the error, don't raise it yet!
						error = "/name/ne-8";
						arg = [errorname, name, TScript.displayname(sup)];
					} else return sup;
				}
				sup = sup.superclass;
			}
		}

		// move upwards in the scope hierarchy
		if (!pe.hasOwnProperty("parent")) break;
		pe = pe.parent;
	}
	state.error(error, arg);
}

// Resolve a name, assuming it refers to a namespace.
// Return the namespace if found, and null otherwise.
export function resolve_namespace_name(name, parent) {
	while (parent) {
		// check name inside pe
		if (
			parent.hasOwnProperty("names") &&
			parent.names.hasOwnProperty(name)
		) {
			let n = parent.names[name];
			if (n.petype === "namespace") return n;
			else return null;
		}

		// move upwards in the scope hierarchy
		if (!parent.hasOwnProperty("parent")) return null;
		parent = parent.parent;
	}
}

export function resolve_names(pe, state) {
	if (pe.hasOwnProperty("resolve")) {
		var temp = state.get();
		state.set(pe.where);
		pe.resolve(state);
		delete pe.resolve;
		state.set(temp);
	}
	if (pe.hasOwnProperty("commands")) {
		for (let p of pe.commands) resolve_names(p, state);
	}
	if (pe.type == "type") {
		for (let key in pe.members) resolve_names(pe.members[key], state);
		for (let key in pe.staticmembers)
			resolve_names(pe.staticmembers[key], state);
	}
}
