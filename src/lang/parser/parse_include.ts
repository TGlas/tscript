import { ParseOptions, ParserPosition, ParserState } from ".";
import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { peek_keyword } from "./parser_helper";

interface IncludeResult {
	/** the included filename, as specified in the include statement */
	filename: string;
	/** the position after the filename string, where any errors should be placed */
	position: ParserPosition;
}

// return the included filename in case of an include statement and null otherwise
export function parse_include(
	state: ParserState,
	parent,
	options: ParseOptions
): IncludeResult | null {
	// handle "include" keyword
	if (peek_keyword(state) !== "include") return null;
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "include",
		"[parse_include] internal error"
	);

	// parse the filename
	token = Lexer.get_token(state, options);
	if (token.type !== "string") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-91");
	}
	const filename = token.value;

	// parse the final semicolon
	token = Lexer.get_token(state, options);
	if (token.type !== "delimiter" || token.value !== ";") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-92");
	}

	return { filename, position: Lexer.before_token };
}
