import * as ide from ".";
import { Interpreter } from "../../lang/interpreter/interpreter";

export const type2css = [
	"ide-keyword",
	"ide-keyword",
	"ide-integer",
	"ide-real",
	"ide-string",
	"ide-collection",
	"ide-collection",
	"ide-builtin",
	"ide-builtin",
	"ide-builtin",
	"ide-builtin",
];

/**
 * set the cursor in the editor; line is 1-based, ch (char within the line) is 0-based
 */
export function setCursorPosition(line: number, ch: number, name: string) {
	ide.collection.openEditorFromFile(name, {
		line: line - 1,
		character: ch,
	});
}

export const interpreterEnded = (interpreter: Interpreter) =>
	interpreter.status === "finished" || interpreter.status === "error";
