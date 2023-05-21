import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { Options } from "../helpers/options";
import { TScript } from "..";

// return the included string in case of an include statement and null otherwise
export function parse_include(state, parent, options: Options) {
	// handle "include" keyword
	if (Lexer.peek_keyword(state) !== "include") return null;
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "include",
		"[parse_include] internal error"
	);

	// parse the filename
	let where = state.get();
	token = Lexer.get_token(state, options);
	if (token.type !== "string") state.error("/syntax/se-91");
	let fn = token.value;

	// parse the final semicolon
	token = Lexer.get_token(state, options);
	if (token.type !== "delimiter" || token.value !== ";")
		state.error("/syntax/se-92");

	// handle multiple includes
	if (state.includes.has(fn)) return { filename: fn, source: "" };
	state.includes.add(fn);

	// load the file
	let content = localStorage.getItem("tscript.code." + fn);
	if (content === null) state.error("/argument-mismatch/am-48", [fn]);

	return { filename: fn, source: content };
}
