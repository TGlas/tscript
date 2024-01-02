import * as ide from ".";
import { programinfo } from "./programinfo";
import { stackinfo } from "./stackinfo";

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

	// update read-only state of the editor
	if (ide.editor) {
		let should =
			ide.interpreter !== null &&
			(ide.interpreter.status === "running" ||
				ide.interpreter.status === "waiting" ||
				ide.interpreter.status === "dialog");
		if (ide.editor.isReadOnly() != should) {
			ide.editor.setReadOnly(should);
			let ed: any = document.getElementsByClassName("CodeMirror");
			let value = should ? 0.6 : 1;
			for (let i = 0; i < ed.length; i++) ed[i].style.opacity = value;
		}
	}
}

/**
 * update the controls to reflect the interpreter state
 */
export function updateControls() {
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
	ide.stacktree.update(stackinfo);

	// show the current program tree
	ide.programtree.update(programinfo);

	updateStatus();
}

/**
 * set the cursor in the editor; line is 1-based, ch (char within the line) is 0-based
 */
export function setCursorPosition(line: number, ch: number, filename: string) {
	const doc = ide.editor
		.getDocuments()
		.find((doc) => doc.getFilename() === filename);

	if (!doc) return;

	doc.setCursor({ line: line - 1, ch });
	doc.focus();
	doc.scrollIntoView({ line: line - 1, ch: 0 });
}

export function makeMarker() {
	let marker = document.createElement("span");
	marker.style.color = "#a00";
	marker.innerHTML = "\u25CF";
	return marker;
}

export function relpos(element, x, y) {
	while (element) {
		x -= element.offsetLeft;
		y -= element.offsetTop;
		element = element.offsetParent;
	}
	return { x: x, y: y };
}
