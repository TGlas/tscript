import * as ide from ".";
import { Interpreter } from "../../lang/interpreter/interpreter";
import { openEditorFromLocalStorage } from "./editor-tabs";

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
	let ed = ide.collection.getEditor(name);
	if (!ed) ed = openEditorFromLocalStorage(name);
	if (!ed) return;

	ide.collection.setActiveEditor(ed);
	ed.setCursorPositionByCharacter(line - 1, ch);
	ed.focus();
	ed.scrollIntoView();
}

export const interpreterEnded = (interpreter: Interpreter) =>
	interpreter.status === "finished" || interpreter.status === "error";
