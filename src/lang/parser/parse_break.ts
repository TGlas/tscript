import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { simtrue } from "../helpers/sims";
import { ParseOptions, ParserState } from ".";

export function parse_break(state: ParserState, parent, options: ParseOptions) {
	// handle "break" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "break",
		"[parse_break] internal error"
	);

	// ensure that we are inside a loop
	let p = parent;
	while (p) {
		if (
			p.petype === "function" ||
			p.petype === "method" ||
			p.petype === "global scope"
		)
			state.error("/syntax/se-77");
		if (p.petype.indexOf("loop") >= 0) break;
		p = p.parent;
	}

	// parse the closing semicolon
	token = Lexer.get_token(state, options);
	if (token.type !== "delimiter" || token.value !== ";") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-81b");
	}

	// create the break object
	return {
		petype: "break",
		where: where,
		parent: parent,
		step: function () {
			let frame = this.stack[this.stack.length - 1];

			// leave scopes until we hit a loop
			while (frame.pe.length > 0) {
				frame.ip.pop();
				let pe: any = frame.pe.pop();
				if (pe.petype.indexOf("loop") >= 0) {
					frame.pe.push(pe);
					frame.ip.push(-3); // special "break" marker handled by loops
					return true;
				}
			}
			ErrorHelper.assert(
				false,
				"internal error in break: no enclosing loop context found"
			);
		},
		sim: simtrue,
	};
}
