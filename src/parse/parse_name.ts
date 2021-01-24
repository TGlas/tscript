// Parse a name. This can be a simple identifier, or it can be
// super.name, or it can be a name inside a namespace of the form
// namespace1.namespace2. [...] .name . The function looks up the name.
// It returns the full name, the program element holding the entity as
// a name, and the result of the lookup.
// In addition, the function reports and error if the name refers to a

import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { Options } from "../helpers/options";
import { get_function, get_type } from "../interpreter/interpreter_helper";
import { TScript } from "../tscript";
import { resolve_name } from "./parse_fn";

// non-static member for which "this" is not available.
export function parse_name(state, parent, options:Options, errorname, allow_namespace:boolean = false)
{
	if (typeof allow_namespace === 'undefined') allow_namespace = false;

	let ref = parent;
	let token = Lexer.get_token(state, options);

	// handle "super"
	let isSuper = false;
	if (token.type === "keyword" && token.value === "super")
	{
		// check for a super class
		let cls = get_type(parent);
		if (cls === null) state.error("/syntax/se-6");
		if (! cls.hasOwnProperty("superclass")) state.error("/syntax/se-7");
		ref = cls.superclass;

		// parser super.identifier
		token = Lexer.get_token(state, options);
		if (token.type !== "delimiter" || token.value !== '.') state.error("/syntax/se-8");
		token = Lexer.get_token(state, options);
		if (token.type !== "identifier") state.error("/syntax/se-9");

		isSuper = true;
	}
	else if (token.type !== "identifier") state.error("/syntax/se-10", [errorname]);

	// look up the name
	let name = token.value;
	let pe:any = resolve_name(state, token.value, ref, errorname);
	let lookup = pe.names[token.value];
	if (isSuper && lookup.hasOwnProperty("access") && lookup.access === "private") state.error("/name/ne-8", ["name lookup", name, TScript.displayname(pe)]);

	// handle namespace names
	while (lookup.petype === "namespace")
	{
		token = Lexer.get_token(state, options, true);
		if (token.type !== "delimiter" || token.value !== '.')
		{
			if (allow_namespace) break;
			else state.error("/name/ne-11");
		}
		Lexer.get_token(state, options);
		token = Lexer.get_token(state, options);
		if (token.type !== "identifier") state.error("/syntax/se-11");

		if (! lookup.names.hasOwnProperty(token.value)) state.error("/name/ne-9", [token.value, name]);
		name += "." + token.value;
		pe = lookup;
		lookup = lookup.names[token.value];
	}

	// check whether "this" is available
	if (lookup.petype === "attribute" || lookup.petype === "method")
	{
		// check for the enclosing type
		let sub_cl = get_type(parent);
		let super_cl = get_type(lookup);
		ErrorHelper.assert(sub_cl && TScript.isDerivedFrom(sub_cl, super_cl.id));   // this used to raise se-12, however, that case should now be covered in resolve_name

		// check for an enclosing non-static method
		let fn = get_function(parent);
		if (fn && fn.petype !== "method") state.error("/syntax/se-13", [errorname, lookup.petype, name]);
	}

	return { "name": name, "pe": pe, "lookup": lookup };
}