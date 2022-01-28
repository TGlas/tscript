import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { Options } from "../helpers/options";
import { get_function, get_type } from "../interpreter/interpreter_helper";
import { TScript } from "..";
import { resolve_name, resolve_namespace_name } from "./parse_fn";

// Parse a name. This can be a simple identifier, or it can be
// super.name, or it can be a name inside of a namespace of the form
// namespace1.namespace2. [...] .name . The function looks up only the
// namespaces, not the name itself. It returns an object with the
// following fields:
//   super: super class or null
//   namespace: containing namespace or null
//   name: actual name (string)
//   fullname: fully qualified name containing the namespace chain (string)
export function parse_name(
	state,
	parent,
	options: Options,
	errorname,
	allow_namespace: boolean = false
) {
	let ret:any = { "super": null, "namespace": null, "name": null, "fullname": null };

	let token = Lexer.get_token(state, options);
	if (token.type === "keyword" && token.value === "super") {
		// check for a super class
		let cls = get_type(parent);
		if (cls === null) state.error("/syntax/se-6");
		if (!cls.hasOwnProperty("superclass")) state.error("/syntax/se-7");
		ret["super"] = cls.superclass;

		// parse super.identifier
		token = Lexer.get_token(state, options);
		if (token.type !== "delimiter" || token.value !== ".")
			state.error("/syntax/se-8");
		token = Lexer.get_token(state, options);
		if (token.type !== "identifier") state.error("/syntax/se-9");
		ret.name = token.value;
		ret.fullname = "super." + token.value;
	} else if (token.type === "identifier") {
		// resolve a name, potentially within a chain of namespaces
		let nspace = resolve_namespace_name(token.value, parent);
		if (nspace) {
			ret.name = token.value;
			ret.fullname = token.value;
			while (true) {
				token = Lexer.get_token(state, options, true);
				if (token.type !== "delimiter" || token.value !== ".") {
					if (allow_namespace) break;
					else state.error("/name/ne-11");
				}
				Lexer.get_token(state, options);
				token = Lexer.get_token(state, options);
				if (token.type !== "identifier") state.error("/syntax/se-11");
				ret["namespace"] = nspace;
				ret.name = token.value;
				ret.fullname += "." + token.value;
				if (! nspace.names.hasOwnProperty(token.value)) break;
				let pe = nspace.names[token.value];
				if (pe.type != "namespace") break;
				nspace = pe;
			}
		} else {
			ret.name = token.value;
			ret.fullname = token.value;
		}
	} else
		state.error("/syntax/se-10", [errorname]);

	return ret;
}

// Lookup a name, based on the object returned by parse_name.
// If this happens after the complete AST was built then forward lookup
// of classes and functions (hoisting) is possible. The function returns
// the full name, the program element holding the entity as a name, and
// the result of the lookup.
// In addition, the function reports an error if the name refers to a
// non-static member for which "this" is not available.
export function lookup_name(
	name,
	state,
	parent,
	errorname,
	allow_namespace: boolean = false
) {
	// reference object for the loopup
	let ref = parent;
	if (name["super"])
		ref = name["super"];
	else if (name["namespace"])
		ref = name["namespace"];

// TODO: make sure that non-member variables are not hoisted!!!

	// look up the name
	let pe: any = resolve_name(state, name.name, ref, errorname);
	let lookup = pe.names[name.name];
	if (
		name["super"] &&
		lookup.hasOwnProperty("access") &&
		lookup.access === "private"
	)
		state.error("/name/ne-8", [
			"name lookup",
			name.fullname,
			TScript.displayname(pe),
		]);

	if (! allow_namespace && lookup.petype === "namespace")
		state.error("/name/ne-11");

	// check whether "this" is available
	if (lookup.petype === "attribute" || lookup.petype === "method") {
		// check for the enclosing type
		let sub_cl = get_type(parent);
		let super_cl = get_type(lookup);
		ErrorHelper.assert(
			sub_cl && TScript.isDerivedFrom(sub_cl, super_cl.id)
		); // this used to raise se-12, however, that case should now be covered in resolve_name

		// check for an enclosing non-static method
		let fn = get_function(parent);
		if (fn && fn.petype !== "method")
			state.error("/syntax/se-13", [errorname, lookup.petype, name]);
	}

	return { name: name.name, pe: pe, lookup: lookup };
}

// parse_name and lookup_name combined into one process
export function parse_static_name(
	state,
	parent,
	options: Options,
	errorname,
	allow_namespace: boolean = false
) {
	let name = parse_name(state,
		parent,
		options,
		errorname,
		allow_namespace
	);
	return lookup_name(
		name,
		state,
		parent,
		errorname,
		allow_namespace,
	);
}
