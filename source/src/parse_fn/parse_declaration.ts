// Parse var, function, class, or namespace

import { peek_keyword } from "./parser_helper";
import { parse_class } from "./parse_class";
import { parse_function } from "./parse_function";
import { parse_namespace } from "./parse_namespace";
import { parse_use } from "./parse_use";
import { parse_var } from "./parse_var";

// The function return null if no declaration is found.
export function parse_declaration(state, parent)
{
	let kw = peek_keyword(state);

	if (kw === "var") return parse_var(state, parent);
	else if (kw === "function") return parse_function(state, parent);
	else if (kw === "class") return parse_class(state, parent);
	else if (kw === "namespace") return parse_namespace(state, parent);
	else if (kw === "use" || kw === "from") return parse_use(state, parent);
	else return null;
}