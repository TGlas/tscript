import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { peek_keyword } from "./parser_helper";
import { parse_name } from "./parse_name";

// Parse a "use" declaration.
export function parse_use(state, parent, options)
{
	// handle "use" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(token.type === "keyword" && (token.value === "use" || token.value === "from"), "[parse_use] internal error");

	// create the use directive
	let use:any = { "petype": "use", "where": where, "parent": parent, "declaration": true };

	// handle the optional "from" part
	let from = parent;
	if (token.value === "from")
	{
		let result = parse_name(state, parent, options, "use directive", true);
		from = result.lookup;
		use.from = from;
		if (from.petype !== "namespace") state.error("/name/ne-23", [result.name]);

		token = Lexer.get_token(state, options);
		if (token.type !== "keyword" || token.value !== "use") state.error("/syntax/se-65");
	}

	// parse names with optional identifiers
	while (true)
	{
		// check for namespace keyword
		let kw = peek_keyword(state);
		if (kw === "namespace") Lexer.get_token(state, options);

		// parse a name
		let result = parse_name(state, from, options, "use directive", true);
		let identifier = result.name.split(".").pop();

		// parse optional "as" part
		token = Lexer.get_token(state, options);
		if (token.type === "identifier" && token.value === "as")
		{
			if (kw === "namespace") state.error("/syntax/se-66");
			token = Lexer.get_token(state, options);
			if (token.type !== "identifier") state.error("/syntax/se-67");
			identifier = token.value;
			token = Lexer.get_token(state, options);
		}

		// actual name import
		if (kw === "namespace")
		{
			// import all names from the namespace
			if (result.lookup.petype !== "namespace") state.error("/name/ne-23", [result.name]);
			for (let key in result.lookup.names)
			{
				if (! result.lookup.names.hasOwnProperty(key)) continue;
				if (parent.names.hasOwnProperty(key))
				{
					// tolerate double import of the same entity, otherwise report an error
					if (parent.names[key] !== result.lookup.names[key]) state.error("/name/ne-24", [key]);
				}
				else
				{
					// import the name
					parent.names[key] = result.lookup.names[key];
				}
			}
		}
		else
		{
			// import a single name
			if (parent.names.hasOwnProperty(identifier))
			{
				// tolerate double import of the same entity, otherwise report an error
				if (parent.names[identifier] !== result.lookup) state.error("/name/ne-24", [identifier]);
			}
			else
			{
				// import the name
				parent.names[identifier] = result.lookup;
			}
		}

		// check for delimiter
		if (token.type === "delimiter" && token.value === ';') break;
		else if (token.type === "delimiter" && token.value === ',') { }
		else state.error("/syntax/se-68");
	}

	return use;
}