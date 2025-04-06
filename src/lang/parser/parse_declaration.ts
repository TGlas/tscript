import { peek_keyword } from "./parser_helper";
import { parse_class } from "./parse_class";
import { parse_function } from "./parse_function";
import { parse_namespace } from "./parse_namespace";
import { parse_use } from "./parse_use";
import { parse_var } from "./parse_var";
import { ParseOptions, ParserState } from ".";

// Parse var, function, class, or namespace
// The function return null if no declaration is found.
export function parse_declaration(
	state: ParserState,
	parent,
	options: ParseOptions
) {
	let kw = peek_keyword(state);

	if (kw === "var") return parse_var(state, parent, options);
	else if (kw === "function") return parse_function(state, parent, options);
	else if (kw === "class") return parse_class(state, parent, options);
	else if (kw === "namespace") return parse_namespace(state, parent, options);
	else if (kw === "use" || kw === "from")
		return parse_use(state, parent, options);
	else return null;
}
