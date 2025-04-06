import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { parse_statement } from "./parse_statement";
import { ParseOptions, ParserState } from ".";

export function parse_dowhile(
	state: ParserState,
	parent,
	options: ParseOptions
) {
	// handle "do" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "do",
		"[parse_dowhile] internal error"
	);

	// create the loop object
	let dowhile: any = {
		petype: "do-while-loop",
		children: new Array(),
		where: where,
		parent: parent,
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			if (ip === -2) {
				// handle "break" statement
				frame.pe.pop();
				frame.ip.pop();
				return false;
			} else if (ip === -1) {
				// recover from "continue" statement
				return false;
			} else if (ip === 0) {
				// push the body onto the stack
				frame.pe.push(pe.body);
				frame.ip.push(-1);
				return false;
			} else if (ip === 1) {
				// push the condition onto the stack
				frame.pe.push(pe.condition);
				frame.ip.push(-1);
				return false;
			} else if (ip === 2) {
				// evaluate the condition
				let cond = frame.temporaries.pop();
				if (!TScript.isDerivedFrom(cond.type, Typeid.typeid_boolean))
					state.error("/argument-mismatch/am-36", [
						TScript.displayname(cond.type),
					]);
				if (cond.value.b) {
					// start over
					frame.ip.pop();
					frame.ip.push(-1);
				} else {
					// leave the loop
					frame.pe.pop();
					frame.ip.pop();
				}
				return true;
			}
		},
		sim: function () {
			let frame = this.stack[this.stack.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			return ip === 2;
		},
	};

	// parse the loop body
	dowhile.body = parse_statement(state, dowhile, options);
	dowhile.children.push(dowhile.body);

	// parse the "while" keyword
	token = Lexer.get_token(state, options);
	if (token.type !== "keyword" || token.value !== "while") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-74");
	}

	// parse the condition
	dowhile.condition = parse_expression(state, parent, options);
	dowhile.children.push(dowhile.condition);

	// parse the final semicolon
	token = Lexer.get_token(state, options);
	if (token.type !== "delimiter" || token.value !== ";") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-75");
	}

	return dowhile;
}
