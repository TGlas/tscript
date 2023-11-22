import { EditorState, Extension, StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { breakpointGutter, hasBreakpoint } from "./breakpoint";

interface EditorPosition {
	line: number;
	ch: number;
}

export class Dummy {
	private ev: EditorView;
	private extensions!: Extension[];

	public constructor(
		textarea: any,
		extensions = [breakpointGutter, basicSetup]
	) {
		this.extensions = extensions;
		this.ev = this.editorFromTextArea(textarea);
	}

	// Missing in CM6
	public refresh() {}

	/**
	 * Runs the callback function whenever the content of the document changes
	 * @param callback
	 */
	public onDocChange(callback: () => any) {
		// Add the event listener to the extensions
		this.extensions.push(
			EditorView.updateListener.of((viewUpdate) => {
				if (viewUpdate.docChanged) callback();
			})
		);

		// Refresh extensions
		this.ev.dispatch({
			effects: StateEffect.reconfigure.of(this.extensions),
		});
	}

	// Makes the compiler happy
	public on(stage: string, func: any) {}

	//
	public focus() {
		this.ev.focus();
	}

	//
	public getValue(): string {
		return this.ev.state.doc.toString();
	}

	/**
	 * Set content of editor.
	 * @param content
	 */
	public setValue(content: string) {
		this.ev.dispatch({
			changes: { from: 0, to: this.getDoc().length, insert: content },
		});
	}

	/**
	 * Returns the document of the editor
	 */
	public getDoc() {
		return this.ev.state.doc;
	}

	/**
	 * Returns the editor view
	 */
	public getEditorView() {
		return this.ev;
	}

	/**
	 * Clears the undo / redo history without effecting the content
	 */
	public clearHistory() {
		const es = EditorState.create({
			doc: this.getDoc(),
			extensions: this.extensions,
		});
		this.ev.setState(es);
	}

	public getOption(opt: string): any {}

	public setOption(opt: string, val: any) {}

	/**
	 * Sets the cursor to the given position
	 * @param pos (CM5 position syntax)
	 */
	public setCursor(pos: EditorPosition) {
		const offset = Dummy.posToOffset(this.ev, pos);
		this.ev.dispatch({ selection: { anchor: offset } });
	}

	public getScrollInfo(): any {}

	public charCoords(a: any, b: any): any {}

	public getScrollerElement(): any {}

	public scrollTo(a: any, b: any) {}

	/**
	 * Returns the line count of the document (always c>=1)
	 */
	public lineCount() {
		return this.ev.state.doc.lines;
	}

	/**
	 * Returns the indexes of all breakpoints
	 */
	public getBreakpointLines() {
		const lines: number[] = [];
		for (let i = 0; i < this.lineCount() - 1; i++) {
			if (hasBreakpoint(this.ev, i)) lines.push(i);
		}
		return lines;
	}

	public setGutterMarker(a: any, b: any, c: any) {}

	public getSelection(): any {}

	/**
	 * Returns the current cursor position
	 */
	public getCursor() {
		return Dummy.offsetToPos(this.ev, this.ev.state.selection.main.head);
	}

	public findWordAt(a: any): any {}

	/**
	 * Returns text from the document within the given range
	 */
	public getRange(from: number, to: number) {
		return this.ev.state.sliceDoc(from, to);
	}

	public scrollIntoView(a: any, b: any) {}

	// public lastLine() {}

	/**
	 * Converts CM5 position syntax to CM6 syntax
	 */
	public static posToOffset(ev: EditorView, pos: EditorPosition) {
		return ev.state.doc.line(pos.line + 1).from + pos.ch;
	}

	/**
	 * Converts CM6 position syntax to CM5 syntax
	 */
	public static offsetToPos(ev: EditorView, offset: number): EditorPosition {
		let line = ev.state.doc.lineAt(offset);
		return { line: line.number - 1, ch: offset - line.from };
	}

	/**
	 * Wrapper from CM5 to CM6
	 */
	private editorFromTextArea(textarea) {
		let view = new EditorView({
			doc: textarea.value,
			extensions: this.extensions,
		});
		textarea.parentNode.insertBefore(view.dom, textarea);
		textarea.style.display = "none";
		if (textarea.form)
			textarea.form.addEventListener("submit", () => {
				textarea.value = view.state.doc.toString();
			});
		return view;
	}
}
