import { Lexer } from "./lexer";
import { peek_keyword } from "./parser_helper";
import { scopestep } from "../helpers/steps";
import { simfalse } from "../helpers/sims";
import { parse_assignment_or_expression } from "./parse_assignment_or_expression";
import { parse_break } from "./parse_break";
import { parse_continue } from "./parse_continue";
import { parse_dowhile } from "./parse_dowhile";
import { parse_for } from "./parse_for";
import { parse_ifthenelse } from "./parse_ifthenelse";
import { parse_return } from "./parse_return";
import { parse_statement_or_declaration } from "./parse_statementordeclaration";
import { parse_throw } from "./parse_throw";
import { parse_trycatch } from "./parse_trycatch";
import { parse_whiledo } from "./parse_whiledo";
import { ParserState } from ".";

// Parse a single statement, or a group of statements.
export function parse_statement(
	state: ParserState,
	parent,
	options,
	var_allowed: boolean = false
) {
	//	if (typeof var_allowed === "undefined") var_allowed = false;

	let kw = peek_keyword(state);

	if (kw === "if") return parse_ifthenelse(state, parent, options);
	else if (kw === "for") return parse_for(state, parent, options);
	else if (kw === "do") return parse_dowhile(state, parent, options);
	else if (kw === "while") return parse_whiledo(state, parent, options);
	else if (kw === "break") return parse_break(state, parent, options);
	else if (kw === "continue") return parse_continue(state, parent, options);
	else if (kw === "return") return parse_return(state, parent, options);
	else if (kw === "try") return parse_trycatch(state, parent, options);
	else if (kw === "throw") return parse_throw(state, parent, options);
	else {
		let where = state.get();
		let token = Lexer.get_token(state, options, true);
		if (token.type === "identifier") {
			return parse_assignment_or_expression(state, parent, options);
		} else if (
			(token.type === "keyword" &&
				(token.value === "null" ||
					token.value === "true" ||
					token.value === "false" ||
					token.value === "not" ||
					token.value === "this" ||
					token.value === "super")) ||
			(token.type === "grouping" &&
				(token.value === "(" || token.value === "[")) ||
			(token.type === "operator" &&
				(token.value === "+" || token.value === "-")) ||
			token.type === "integer" ||
			token.type === "real" ||
			token.type === "string"
		) {
			// rather stupid cases, forbid them??
			return parse_assignment_or_expression(state, parent, options);
		} else if (token.type === "delimiter" && token.value === ";") {
			// ignore solitude semicolon
			Lexer.get_token(state, options);
			return {
				petype: "no-operation",
				where: where,
				step: function () {
					let frame = this.stack[this.stack.length - 1];
					frame.pe.pop();
					frame.ip.pop();
					return false;
				},
				sim: simfalse,
			};
		} else if (token.type === "grouping" && token.value === "{") {
			// parse a scope
			Lexer.get_token(state, options);
			state.indent.push(-1 - token.line);
			let scope = {
				petype: "scope",
				children: new Array(),
				where: where,
				parent: parent,
				commands: new Array(),
				names: {},
				step: scopestep,
				sim: simfalse,
			};
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
				let cmd = parse_statement_or_declaration(state, scope, options);
				scope.commands.push(cmd);
				scope.children.push(cmd);
			}
			return scope;
		} else if (token.type === "grouping" && token.value === "}")
			state.error("/syntax/se-88");
		else if (token.type === "keyword")
			state.error("/syntax/se-89", [token.value]);
		else state.error("/syntax/se-90", [token.value]);
	}
}
