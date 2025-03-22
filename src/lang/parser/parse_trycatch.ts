import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { get_function } from "../helpers/getParents";
import { simfalse } from "../helpers/sims";
import { parse_statement } from "./parse_statement";
import { ParserState } from ".";

export function parse_trycatch(state: ParserState, parent, options) {
	// handle "try" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "try",
		"[parse_trycatch] internal error"
	);

	// create the try-catch object
	let trycatch: any = {
		petype: "try-catch",
		where: where,
		parent: parent,
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			if (ip === 0) {
				// run the try part
				frame.temporaries.push({ "try marker": true });
				frame.pe.push(pe.try_part);
				frame.ip.push(-1);
				return false;
			} else if (ip === 2) {
				// catch landing point, an exception is on the temporary stack
				frame.pe.push(pe.catch_part);
				frame.ip.push(-1);
				return false;
			} else {
				// done, either with try or with catch
				frame.pe.pop();
				frame.ip.pop();
				frame.temporaries.pop();
				return false;
			}
		},
		sim: simfalse,
	};

	// create the try part
	trycatch.try_part = {
		petype: "try",
		parent: parent,
		where: where,
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			if (ip === 0) {
				// run the try part
				frame.pe.push(pe.command);
				frame.ip.push(-1);
				return false;
			} else {
				frame.pe.pop();
				frame.ip.pop();
				return false;
			}
		},
		sim: simfalse,
	};

	// parse the try part
	trycatch.try_part.command = parse_statement(state, parent, options);
	trycatch.try_part.children = [trycatch.try_part.command];

	// parse the catch statement
	let where_catch = state.get();
	token = Lexer.get_token(state, options);
	if (token.type !== "keyword" || token.value !== "catch") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-82");
	}

	// handle the "var" keyword
	token = Lexer.get_token(state, options);
	if (token.type !== "keyword" || token.value !== "var") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-84");
	}

	// parse the variable name
	// TODO: allow for more general names?
	let where_var = state.get();
	token = Lexer.get_token(state, options);
	if (token.type !== "identifier") {
		state.set(where_var);
		state.error("/syntax/se-85");
	}
	let name = token.value;

	// handle the "do" keyword
	token = Lexer.get_token(state, options);
	if (token.type !== "keyword" || token.value !== "do") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-86");
	}

	// create the catch part, which declares the exception variable
	trycatch.catch_part = {
		petype: "catch",
		parent: parent,
		where: where_catch,
		names: {},
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			if (ip === 0) {
				// initialize the variable
				frame.variables[pe.var_id] = frame.temporaries.pop();

				// run the catch part
				frame.pe.push(pe.command);
				frame.ip.push(-1);
				return false;
			} else {
				frame.pe.pop();
				frame.ip.pop();
				return false;
			}
		},
		sim: simfalse,
	};
	trycatch.children = [trycatch.try_part, trycatch.catch_part];

	// create and register a new variable
	// Note: the program element does *not* need a step function, it is only there to define the variable's id
	let fn = get_function(parent);
	let id = fn.variables.length;
	let pe: any = {
		petype: "variable",
		where: where_var,
		parent: trycatch.catch_part,
		name: name,
		id: id,
		scope: "local",
	};
	fn.variables.push(pe);
	trycatch.catch_part.names[name] = pe;
	trycatch.catch_part.var_id = id;

	// parse the catch part
	trycatch.catch_part.command = parse_statement(
		state,
		trycatch.catch_part,
		options
	);
	trycatch.catch_part.children = [pe, trycatch.catch_part.command];

	return trycatch;
}
