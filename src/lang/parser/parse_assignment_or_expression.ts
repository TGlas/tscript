import { Lexer } from "./lexer";
import { assignments } from "./parser_helper";
import { simfalse } from "../helpers/sims";
import { parse_expression } from "./parse_expression";
import { parse_lhs } from "./parse_lhs";
import { Options } from "../helpers/options";

export function parse_assignment_or_expression(
	state,
	parent,
	options: Options
) {
	// try to parse an expression
	let where = state.get();
	let ex = parse_expression(state, parent, options);
	let token = Lexer.get_token(state, options);
	if (token.type === "operator" && assignments.hasOwnProperty(token.value)) {
		// retry as an assignment
		state.set(where);
		let lhs = parse_lhs(state, parent, options);
		where = state.get();
		let op = Lexer.get_token(state, options);
		let rhs = parse_expression(state, parent, options);
		token = Lexer.get_token(state, options);
		if (token.type !== "delimiter" || token.value !== ";")
			state.error("/syntax/se-48");

		return {
			petype: "assignment " + op.value,
			where: where,
			parent: parent,
			operator: op.value,
			lhs: lhs,
			rhs: rhs,
			step: function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				if (ip === 0) {
					// evaluate the rhs
					frame.pe.push(pe.rhs);
					frame.ip.push(-1);
					return false;
				} else if (ip === 1) {
					// push the operator
					frame.temporaries.push(pe.operator);

					// assign to the lhs
					frame.pe.push(pe.lhs);
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
	} else if (token.type === "delimiter" && token.value === ";") {
		return {
			petype: "expression",
			where: where,
			parent: parent,
			sub: ex,
			step: function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				if (ip === 0) {
					// run the expression as a statement
					frame.pe.push(pe.sub);
					frame.ip.push(-1);
					return false;
				} else {
					// ignore the return value
					frame.temporaries.pop();

					frame.pe.pop();
					frame.ip.pop();
					return false;
				}
			},
			sim: simfalse,
		};
	} else {
		state.error("/syntax/se-49");
	}
}
