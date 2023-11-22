import { EditorState, Extension, StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";

interface EditorPosition {
	line: number;
	ch: number;
}

export class Dummy {
	private ev: EditorView;
	private extensions!: Extension[];

	public constructor(textarea: any, extensions = [basicSetup]) {
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
		const offset = this.posToOffset(pos);
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

	public lineInfo(a: number): any {}

	public setGutterMarker(a: any, b: any, c: any) {}

	public getSelection(): any {}

	public getCursor(): any {}

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
	private posToOffset(pos: EditorPosition) {
		return this.ev.state.doc.line(pos.line + 1).from + pos.ch;
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
