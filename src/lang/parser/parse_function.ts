import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { scopestep } from "../helpers/steps";
import { simfalse } from "../helpers/sims";
import { parse_expression } from "./parse_expression";
import { parse_statement_or_declaration } from "./parse_statementordeclaration";
import { ParserState } from ".";

// Parse a function declaration.
export function parse_function(
	state: ParserState,
	parent,
	options,
	petype: any = undefined
) {
	if (typeof petype === "undefined") petype = "function";

	// handle "function" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "function",
		"[parse_function] internal error"
	);

	// obtain function name
	token = Lexer.get_token(state, options);
	if (token.type !== "identifier") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-52");
	}
	let fname = token.value;
	if (parent.names.hasOwnProperty(fname)) {
		state.set(Lexer.before_token);
		state.error("/name/ne-15", [fname]);
	}

	// check function name
	if (
		options.checkstyle &&
		!state.builtin() &&
		fname[0] >= "A" &&
		fname[0] <= "Z"
	) {
		state.set(Lexer.before_token);
		state.error("/style/ste-3", ["function", fname]);
	}

	// create the function
	let func: any = {
		petype: petype,
		children: new Array(),
		where: where,
		declaration: true,
		parent: parent,
		commands: new Array(),
		variables: new Array(),
		name: fname,
		names: {},
		params: new Array(),
		step: scopestep,
		sim: simfalse,
	};
	parent.names[fname] = func;

	// parse the parameters
	token = Lexer.get_token(state, options);
	if (token.type !== "grouping" || token.value !== "(") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-36", ["function declaration"]);
	}
	while (true) {
		// parse ) or ,
		let token = Lexer.get_token(state, options, true);
		if (token.type === "grouping" && token.value === ")") {
			Lexer.get_token(state, options);
			break;
		}
		if (func.params.length !== 0) {
			if (token.type !== "delimiter" || token.value !== ",")
				state.error("/syntax/se-37");
			Lexer.get_token(state, options);
		}

		// parse the parameter name
		let where = state.get();
		token = Lexer.get_token(state, options);
		if (token.type !== "identifier") {
			state.set(Lexer.before_token);
			state.error("/syntax/se-33");
		}
		let name = token.value;
		let id = func.variables.length;
		let variable = {
			petype: "variable",
			where: where,
			parent: func,
			name: name,
			id: id,
			scope: "local",
		};
		func.children.push(variable);
		let param: any = { name: name };

		// check for a default value
		token = Lexer.get_token(state, options, true);
		if (token.type === "operator" && token.value === "=") {
			Lexer.get_token(state, options);
			param.defaultvalue = parse_expression(state, func, options);
			func.children.push(param.defaultvalue);
			let back = param.defaultvalue?.passResolveBack;
			param.defaultvalue.passResolveBack = function (state) {
				if (back) back(state);
				if (param.defaultvalue.petype !== "constant") {
					state.set(param.defaultvalue.where);
					state.error("/syntax/se-38");
				}
				param.defaultvalue = param.defaultvalue.typedvalue;
			};
		}

		// register the parameter
		if (func.names.hasOwnProperty(name)) {
			state.set(Lexer.before_token);
			state.error("/name/ne-16", [name]);
		}
		func.names[name] = variable;
		func.variables[id] = variable;
		func.params.push(param);
	}

	// parse the function body
	token = Lexer.get_token(state, options);
	if (token.type !== "grouping" || token.value !== "{") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-40", ["function declaration"]);
	}
	state.indent.push(-1 - token.line);
	while (true) {
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
		let cmd = parse_statement_or_declaration(state, func, options);
		func.commands.push(cmd);
		func.children.push(cmd);
	}

	// replace the function body with built-in functionality
	if (func.commands.length === 0 && state.impl) {
		let fullname = new Array();
		let p = func;
		while (p.parent) {
			fullname.unshift(p.name);
			p = p.parent;
		}
		let d: any = state.impl;
		for (let i = 0; i < fullname.length; i++) {
			if (d.hasOwnProperty(fullname[i])) d = d[fullname[i]];
			else {
				d = null;
				break;
			}
		}
		if (d) {
			if (typeof d === "function") {
				func.step = function () {
					let frame = this.stack[this.stack.length - 1];
					let pe: any = frame.pe[frame.pe.length - 1];
					let params = frame.variables;
					if (frame.object) params.unshift(frame.object);
					let ret = pe.body.apply(this, params);
					if (this.stack.length === 0) return false;
					this.stack.pop();
					frame = this.stack[this.stack.length - 1];
					frame.temporaries.push(ret);
					return false;
				};
				func.sim = simfalse;
				func.body = d;
			} else if (d.hasOwnProperty("step")) {
				func.step = d.step;
				func.sim = d.hasOwnProperty("sim") ? d.sim : simfalse;
			} else throw "[parse_function] invalid built-in function";
		}
	}

	return func;
}
