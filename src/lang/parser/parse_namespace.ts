import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { scopestep } from "../helpers/steps";
import { simfalse } from "../helpers/sims";
import { parse_statement_or_declaration } from "./parse_statementordeclaration";
import { ParserState } from ".";

// Parse a namespace declaration.
export function parse_namespace(state: ParserState, parent, options) {
	// handle "namespace" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "namespace",
		"[parse_namespace] internal error"
	);

	// check the parent
	if (parent.petype !== "global scope" && parent.petype !== "namespace") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-63");
	}

	// display name prefix
	let prefix = "";
	{
		let p = parent;
		while (p.petype === "namespace") {
			prefix = p.name + "." + prefix;
			p = p.parent;
		}
	}

	// obtain namespace name
	token = Lexer.get_token(state, options);
	if (token.type !== "identifier") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-64");
	}
	let nname = token.value;

	// check namespace name
	if (
		options.checkstyle &&
		!state.builtin() &&
		nname[0] >= "A" &&
		nname[0] <= "Z"
	) {
		state.set(Lexer.before_token);
		state.error("/style/ste-3", ["namespace", nname]);
	}

	// obtain the named object corresponding to the namespace globally across instances
	let global_nspace: any = null;
	if (parent.names.hasOwnProperty(nname)) {
		// extend the existing namespace
		global_nspace = parent.names[nname];
		if (global_nspace.petype !== "namespace") {
			state.set(Lexer.before_token);
			state.error("/name/ne-19", [nname]);
		}
	} else {
		// create the namespace
		global_nspace = {
			petype: "namespace",
			children: new Array(),
			parent: parent,
			name: nname,
			displayname: prefix + nname,
			names: {},
			declaration: true,
		};
		parent.names[nname] = global_nspace;
	}

	// create the local namespace PE instance containing the commands
	let local_nspace = {
		petype: "namespace",
		children: new Array(),
		where: where,
		parent: parent,
		names: global_nspace.names,
		commands: new Array(),
		name: nname,
		displayname: prefix + nname,
		step: scopestep,
		sim: simfalse,
	};

	// parse the namespace body
	token = Lexer.get_token(state, options);
	if (token.type !== "grouping" || token.value !== "{") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-40", ["namespace declaration"]);
	}
	state.indent.push(-1 - token.line);
	while (true) {
		// check for end-of-body
		token = Lexer.get_token(state, options, true);
		if (token.type === "grouping" && token.value === "}") {
			state.indent.pop();
			if (options.checkstyle && !state.builtin()) {
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost !== indent)
					state.error("/style/ste-2");
			}
			Lexer.get_token(state, options);
			break;
		}

		// parse sub-declarations
		let sub = parse_statement_or_declaration(state, local_nspace, options);
		if (sub.hasOwnProperty("name"))
			sub.displayname = prefix + nname + "." + sub.name;
		local_nspace.commands.push(sub);
		local_nspace.children.push(sub);
		global_nspace.children.push(sub);
	}

	return local_nspace;
}
