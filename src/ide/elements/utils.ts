import * as ide from ".";
import { openEditorFromLocalStorage } from "./editor-tabs";
import { programinfo } from "./programinfo";
import { stackinfo } from "./stackinfo";
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
 * visually indicate the interpreter state
 */
export function updateStatus() {
	// update status indicator
	if (ide.interpreter) {
		if (ide.interpreter.status === "running") {
			if (ide.interpreter.background) ide.programstate.running();
			else ide.programstate.stepping();
		} else if (ide.interpreter.status === "waiting")
			ide.programstate.waiting();
		else if (ide.interpreter.status === "dialog")
			ide.programstate.waiting();
		else if (ide.interpreter.status === "error") ide.programstate.error();
		else if (ide.interpreter.status === "finished")
			ide.programstate.finished();
		else throw "internal error; unknown interpreter state";
	} else {
		if (ide.messages.innerHTML != "") ide.programstate.error();
		else ide.programstate.unchecked();
	}

	// update read-only state of the editors
	if (ide.collection) {
		let should =
			ide.interpreter !== null &&
			(ide.interpreter.status === "running" ||
				ide.interpreter.status === "waiting" ||
				ide.interpreter.status === "dialog");
		ide.collection.setReadOnly(should);
		//		if (ide.editor.isReadOnly() != should) {
		//			ide.editor.setReadOnly(should);
		//			let ed: any = document.getElementsByClassName("CodeMirror");
		//			let value = should ? 0.6 : 1;
		//			for (let i = 0; i < ed.length; i++) ed[i].style.opacity = value;
		//		}
	}
}

/**
 * update the controls to reflect the interpreter state
 */
export async function updateControls() {
	// move the cursor in the source code
	if (ide.interpreter) {
		if (ide.interpreter.stack.length > 0) {
			let frame = ide.interpreter.stack[ide.interpreter.stack.length - 1];
			let pe = frame.pe[frame.pe.length - 1];
			if (pe.where)
				setCursorPosition(
					pe.where.line,
					pe.where.ch,
					pe.where.filename
				);
		} else {
			// it might be appropriate to keep the scroll position after running the program,
			// because in a large program one would continue editing some location in the middle
			// of the code
			//setCursorPosition(module.sourcecode.lineCount(), 1000000);
		}
	}

	// show the current stack state
	await ide.stacktree.update(stackinfo);

	// show the current program tree
	await ide.programtree.update(programinfo);

	updateStatus();
}

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
