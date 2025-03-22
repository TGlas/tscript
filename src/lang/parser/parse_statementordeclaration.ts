import { ParserState } from ".";
import { create_breakpoint } from "../interpreter/interpreter_helper";
import { parse_declaration } from "./parse_declaration";
import { parse_statement } from "./parse_statement";

export function parse_statement_or_declaration(
	state: ParserState,
	parent,
	options
) {
	function markAsBuiltin(value) {
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) markAsBuiltin(value[i]);
		} else if (
			value !== null &&
			typeof value === "object" &&
			value.constructor === Object
		) {
			if (value.hasOwnProperty("builtin") && value.builtin) return;
			if (value.hasOwnProperty("petype")) {
				if (value.hasOwnProperty("where")) delete value.where;
				value.builtin = true;
			}
			for (let key in value) {
				if (!value.hasOwnProperty(key)) continue;
				if (key === "parent") continue;
				markAsBuiltin(value[key]);
			}
		}
	}

	if (!state.builtin() && state.filename) {
		state.skip();

		const breakpoints = state.program.breakpoints[state.filename];

		if (!breakpoints.hasOwnProperty(state.line)) {
			// create and register a new breakpoint
			let b = create_breakpoint(parent, state);
			breakpoints[state.line] = b;
			parent.commands.push(b);
		}
	}

	let ret = parse_declaration(state, parent, options);
	if (ret !== null) {
		if (state.builtin()) markAsBuiltin(ret);
		return ret;
	}
	ret = parse_statement(state, parent, options);
	if (state.builtin()) markAsBuiltin(ret);
	return ret;
}
