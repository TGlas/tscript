import { ParserState } from ".";
import { ErrorHelper } from "../errors/ErrorHelper";
import { Options } from "../helpers/options";
import { Lexer } from "./lexer";
import { peek_keyword } from "./parser_helper";

interface IncludeResult {
	filename: string;
	source: string;
}

// return the included string in case of an include statement and null otherwise
export function parse_include(
	state: ParserState,
	parent,
	options: Options
): IncludeResult | null {
	// handle "include" keyword
	if (peek_keyword(state) !== "include") return null;
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "include",
		"[parse_include] internal error"
	);

	// parse the filename
	let where = state.get();
	token = Lexer.get_token(state, options);
	if (token.type !== "string") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-91");
	}
	let fn = token.value;

	// parse the final semicolon
	token = Lexer.get_token(state, options);
	if (token.type !== "delimiter" || token.value !== ";") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-92");
	}

	// handle multiple includes
	if (state.includes.has(fn)) return { filename: fn, source: "" };
	state.includes.add(fn);

	// load the file either form the open documents or local storage
	let content =
		state.documents[fn] ?? localStorage.getItem(`tscript.code.${fn}`);
	if (content == undefined) {
		state.set(Lexer.before_token);
		state.error("/argument-mismatch/am-48", [fn]);
	}

	return { filename: fn, source: content };
}
