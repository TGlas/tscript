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
	if (ide.sourcecode) {
		let should =
			ide.interpreter !== null &&
			(ide.interpreter.status === "running" ||
				ide.interpreter.status === "waiting" ||
				ide.interpreter.status === "dialog");
		if (ide.sourcecode.getOption("readOnly") != should) {
			ide.sourcecode.setOption("readOnly", should);
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
			if (pe.where) setCursorPosition(pe.where.line, pe.where.ch);
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
export function setCursorPosition(line: number, ch: number) {
	if (typeof ch === "undefined") ch = 0;
	ide.sourcecode.setCursor({ line: line - 1, ch });
	ide.sourcecode.focus();
	//	module.sourcecode.scrollIntoView({"line": line-1, "ch": 0}, 40);
	let s = ide.sourcecode.getScrollInfo();
	let y = ide.sourcecode.charCoords({ line: line - 1, ch: 0 }, "local").top;
	let h = ide.sourcecode.getScrollerElement().offsetHeight;
	if (y < s.top + 0.1 * s.clientHeight || y >= s.top + 0.9 * s.clientHeight) {
		y = y - 0.5 * h - 5;
		ide.sourcecode.scrollTo(null, y);
	}
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
