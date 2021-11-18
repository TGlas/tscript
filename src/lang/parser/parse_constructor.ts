import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { constantstep, get_program } from "../interpreter/interpreter_helper";
import { simfalse } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";
import { callsim, callstep, parse_call } from "./parse_call";
import { parse_expression } from "./parse_expression";
import { parse_statement_or_declaration } from "./parse_statementordeclaration";
import { Options } from "../helpers/options";

// Parse a constructor declaration.
export function parse_constructor(state, parent, options: Options) {
	// check that the parent is indeed a type
	ErrorHelper.assert(
		parent.petype === "type",
		"[parse_constructor] internal error; parent is expected to be a type"
	);

	// handle "constructor" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "constructor",
		"[parse_constructor] internal error"
	);

	// create the function
	let func: any = {
		petype: "method",
		where: where,
		declaration: true,
		parent: parent,
		commands: new Array(),
		variables: new Array(),
		name: "constructor",
		names: {},
		params: new Array(),
		step: constructorstep,
		sim: simfalse,
	};

	// parse the parameters
	token = Lexer.get_token(state, options);
	if (token.type !== "grouping" || token.value !== "(")
		state.error("/syntax/se-36", ["constructor declaration"]);
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
		if (token.type !== "identifier") state.error("/syntax/se-33");
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
		let param: any = { name: name };

		// check for a default value
		token = Lexer.get_token(state, options, true);
		if (token.type === "operator" && token.value === "=") {
			Lexer.get_token(state, options);
			let defaultvalue = parse_expression(state, func, options);
			if (defaultvalue.petype !== "constant")
				state.error("/syntax/se-38");
			param.defaultvalue = defaultvalue.typedvalue;
		}

		// register the parameter
		if (func.names.hasOwnProperty(name)) state.error("/name/ne-16", [name]);
		func.names[name] = variable;
		func.variables[id] = variable;
		func.params.push(param);
	}

	token = Lexer.get_token(state, options);
	if (parent.hasOwnProperty("superclass")) {
		// implicit expression to the left of the super call
		let base = {
			petype: "constant",
			where: state.get(),
			typedvalue: {
				type: get_program(parent).types[Typeid.typeid_type],
				value: { b: parent.superclass },
			},
			step: constantstep,
			sim: simfalse,
		};

		if (token.type === "operator" && token.value === ":") {
			// parse explicit super class constructor call
			token = Lexer.get_token(state, options);
			if (token.type !== "keyword" || token.value !== "super")
				state.error("/syntax/se-53");
			func.supercall = parse_call(state, func, base, options);
			func.supercall.petype = "super call";

			// prepare parsing of '{'
			token = Lexer.get_token(state, options);
		} else {
			// create the implicit default super class constructor call
			func.supercall = {
				petype: "super call",
				where: where,
				parent: func,
				base: base,
				arguments: new Array(),
				step: callstep,
				sim: callsim,
			};
		}
	} else if (token.type === "operator" && token.value === ":")
		state.error("/name/ne-21");

	// parse the constructor body
	if (token.type !== "grouping" || token.value !== "{")
		state.error("/syntax/se-40", ["constructor declaration"]);
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
	}

	// replace the function body with built-in functionality
	if (func.commands.length === 0) {
		let fullname = new Array();
		let p = func;
		while (p.parent) {
			fullname.unshift(p.name);
			p = p.parent;
		}
		let d = state.impl;
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
					this.stack.pop();
					return false;
				};
				func.sim = simfalse;
				func.body = d;
			} else if (d.hasOwnProperty("step")) {
				func.step = d.step;
				func.sim = d.hasOwnProperty("sim") ? d.sim : simfalse;
			} else throw "[parse_constructor] invalid built-in function";
		}
	}

	return func;
}

// step function of constructors
export function constructorstep() {
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	if (ip === 0) {
		// call the super class constructor
		if (pe.hasOwnProperty("supercall")) {
			frame.pe.push(pe.supercall);
			frame.ip.push(-1);
		}
		return false;
	} else if (ip < pe.commands.length + 1) {
		// run the constructor commands
		if (!pe.commands[ip - 1].declaration) {
			frame.pe.push(pe.commands[ip - 1]);
			frame.ip.push(-1);
		}
		return false;
	} else {
		// return without a value
		frame.pe.pop();
		frame.ip.pop();
		this.stack.pop();
		return false;
	}
}
