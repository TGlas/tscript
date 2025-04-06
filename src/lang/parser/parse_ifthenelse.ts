import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { peek_keyword } from "./parser_helper";
import { TScript } from "..";
import { simfalse } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { parse_statement } from "./parse_statement";
import { ParserState } from ".";

export function parse_ifthenelse(state: ParserState, parent, options) {
	// handle "if" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "if",
		"[parse_ifthenelse] internal error"
	);

	// create the conditional object
	let ifthenelse: any = {
		petype: "conditional statement",
		children: new Array(),
		where: where,
		parent: parent,
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			if (ip === 0) {
				// push the condition onto the stack
				frame.pe.push(pe.condition);
				frame.ip.push(-1);
				return false;
			} else if (ip === 1) {
				// evaluate the condition
				let cond = frame.temporaries.pop();
				if (!TScript.isDerivedFrom(cond.type, Typeid.typeid_boolean))
					state.error("/argument-mismatch/am-33", [
						TScript.displayname(cond.type),
					]);
				if (cond.value.b) {
					// push the "then" part onto the stack
					frame.pe.push(pe.then_part);
					frame.ip.push(-1);
				} else {
					// push the "else" part onto the stack, or skip it if there is none
					if (pe.hasOwnProperty("else_part")) {
						frame.pe.push(pe.else_part);
						frame.ip.push(-1);
					} else {
						frame.pe.pop();
						frame.ip.pop();
					}
				}
				return false;
			} else {
				frame.pe.pop();
				frame.ip.pop();
				return false;
			}
		},
		sim: simfalse,
	};

	// parse the condition
	ifthenelse.condition = parse_expression(state, parent, options);
	ifthenelse.children.push(ifthenelse.condition);

	// parse the then-part
	token = Lexer.get_token(state, options);
	if (token.type !== "keyword" || token.value !== "then") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-69");
	}
	ifthenelse.then_part = parse_statement(state, parent, options);
	ifthenelse.children.push(ifthenelse.then_part);

	// parse the else-part
	let kw = peek_keyword(state);
	if (kw === "else") {
		token = Lexer.get_token(state, options);
		ErrorHelper.assert(
			token.type === "keyword" && token.value === "else",
			"[parse_ifthenelse] internal error"
		);
		ifthenelse.else_part = parse_statement(state, parent, options);
		ifthenelse.children.push(ifthenelse.else_part);
	}

	return ifthenelse;
}
