import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { parse_statement } from "./parse_statement";
import { ParserState } from ".";

export function parse_whiledo(state: ParserState, parent, options) {
	// handle "while" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "while",
		"[parse_whiledo] internal error"
	);

	// create the loop object
	let whiledo: any = {
		petype: "while-do-loop",
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
				// push the condition onto the stack
				frame.pe.push(pe.condition);
				frame.ip.push(-1);
				return false;
			} else if (ip === 1) {
				// evaluate the condition
				let cond = frame.temporaries.pop();
				if (!TScript.isDerivedFrom(cond.type, Typeid.typeid_boolean))
					state.error("/argument-mismatch/am-37", [
						TScript.displayname(cond.type),
					]);
				if (cond.value.b) {
					// push the body onto the stack
					frame.pe.push(pe.body);
					frame.ip.push(-1);
				} else {
					// leave the loop
					frame.pe.pop();
					frame.ip.pop();
				}
				return true;
			} else if (ip === 2) {
				// return to the condition
				frame.ip.pop();
				frame.ip.push(-1);
				return false;
			}
		},
		sim: function () {
			let frame = this.stack[this.stack.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			return ip === 1;
		},
	};

	// parse the condition
	whiledo.condition = parse_expression(state, parent, options);

	// parse the "do" keyword
	token = Lexer.get_token(state, options);
	if (token.type !== "keyword" || token.value !== "do") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-76");
	}

	// parse the loop body
	whiledo.body = parse_statement(state, whiledo, options);

	whiledo.children = [whiledo.condition, whiledo.body];

	return whiledo;
}
