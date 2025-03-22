import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { peek_keyword } from "./parser_helper";
import { parse_expression, is_name } from "./parse_expression";
import { ParserState } from ".";

// Parse a "use" declaration.
export function parse_use(state: ParserState, parent, options) {
	// handle "use" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" &&
			(token.value === "use" || token.value === "from"),
		"[parse_use] internal error"
	);

	// create the use directive
	let use: any = {
		petype: "use",
		children: new Array(),
		where: where,
		parent: parent,
		declaration: true,
		names: new Map(),
	};

	// handle the optional "from" part
	let from = parent;
	if (token.value === "from") {
		let where = state.get();
		from = parse_expression(state, parent, options, false, true);
		if (!is_name(from) || from["super"]) {
			state.set(where);
			state.error("/syntax/se-10", ["use directive"]);
		}
		use.from = from;
		use.children.push(from);

		token = Lexer.get_token(state, options);
		if (token.type !== "keyword" || token.value !== "use") {
			state.set(Lexer.before_token);
			state.error("/syntax/se-65");
		}
	}

	// parse names with optional identifiers
	while (true) {
		// check for namespace keyword
		let kw = peek_keyword(state);
		let nspace = kw === "namespace";
		if (nspace) Lexer.get_token(state, options);

		// parse a name
		let where = state.get();
		let ex = parse_expression(state, parent, options, false, true);
		if (!is_name(ex) || ex["super"]) {
			state.set(where);
			state.error("/syntax/se-10", ["use directive"]);
		}
		use.children.push(ex);

		// parse optional "as" part
		token = Lexer.get_token(state, options);
		if (token.type === "identifier" && token.value === "as") {
			if (nspace) state.error("/syntax/se-66");
			token = Lexer.get_token(state, options);
			if (token.type !== "identifier") {
				state.set(Lexer.before_token);
				state.error("/syntax/se-67");
			}
			let identifier = token.value;
			use.names.set(ex, identifier);
			token = Lexer.get_token(state, options);
		} else use.names.set(ex, nspace);

		// check for delimiter
		if (token.type === "delimiter" && token.value === ";") break;
		else if (token.type === "delimiter" && token.value === ",") {
		} else {
			state.set(Lexer.before_token);
			state.error("/syntax/se-68");
		}
	}

	// resolve the "from" term (if given) and patch the name expressions
	use.passResolve = function (state) {
		if (use.from) {
			use.from.passResolve(state);
			use.from.passResolveBack(state);
			delete use.from.passResolve;
			delete use.from.passResolveBack;
			if (
				(use.from.petype === "name" ||
					use.from.petype === "constant") &&
				use.from.reference
			)
				use.from = use.from.reference;
			for (let [ex, name] of use.names.entries()) ex.parent = use.from;
		}
	};

	// actual name import
	use.passResolveBack = function (state) {
		let from = use.from ? use.from : use.parent;

		for (let [ex, name] of use.names.entries()) {
			if (ex.petype === "name" || ex.petype === "constant")
				ex = ex.reference;
			if (name === true) {
				// import a whole namespace
				if (ex.petype !== "namespace")
					state.error("/name/ne-23", [ex.name]);
				for (let key in ex.names) {
					if (!ex.names.hasOwnProperty(key)) continue;
					if (parent.names.hasOwnProperty(key)) {
						// tolerate double import of the same entity, otherwise report an error
						if (parent.names[key] !== ex.names[key])
							state.error("/name/ne-24", [key]);
					} else {
						// import the name
						parent.names[key] = ex.names[key];
					}
				}
			} else {
				// import a single namespace
				if (name === false) name = ex.name;
				if (parent.names.hasOwnProperty(name)) {
					// tolerate duplicate import of the same entity, otherwise report an error
					if (parent.names[name] !== ex)
						state.error("/name/ne-24", [name]);
				} else {
					// import the name
					parent.names[name] = ex;
				}
			}
		}

		delete use.names;
	};

	return use;
}
