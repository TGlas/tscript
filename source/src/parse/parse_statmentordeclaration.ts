import { create_breakpoint } from "../interpreter/runner_helper";
import { parse_declaration } from "./parse_declaration";
import { parse_statement } from "./parse_statment";

export function parse_statement_or_declaration(state, parent, options)
{
	function markAsBuiltin(value)
			{
				if (Array.isArray(value))
				{
					for (let i=0; i<value.length; i++) markAsBuiltin(value[i]);
				}
				else if (value !== null && typeof value === "object" && value.constructor === Object)
				{
					if (value.hasOwnProperty("builtin") && value.builtin) return;
					if (value.hasOwnProperty("petype"))
					{
						if (value.hasOwnProperty("where")) delete value.where;
						value.builtin = true;
					}
					for (let key in value)
					{
						if (! value.hasOwnProperty(key)) continue;
						if (key === "parent") continue;
						markAsBuiltin(value[key]);
					}
				}
			};

	if (! state.builtin())
	{
		state.skip();

		if (! state.program.breakpoints.hasOwnProperty(state.line))
		{
			// create and register a new breakpoint
			let b = create_breakpoint(parent, state);
			state.program.breakpoints[state.line] = b;
			parent.commands.push(b);
		}
	}

	let ret = parse_declaration(state, parent, options);
	if (ret !== null)
	{
		if (state.builtin()) markAsBuiltin(ret);
		return ret;
	}
	ret = parse_statement(state, parent, options);
	if (state.builtin()) markAsBuiltin(ret);
	return ret;
}