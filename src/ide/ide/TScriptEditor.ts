import { indentWithTab } from "@codemirror/commands";
import {
	Compartment,
	EditorState,
	Extension,
	StateEffect,
} from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { cmtsmode } from "../codemirror-tscriptmode";
import { getPanel, removePanel } from "../tgui";
import { breakpointGutter, hasBreakpoint } from "./breakpoint";
import { baseTheme, highlighting } from "./styling";

interface EditorPosition {
	line: number;
	ch: number;
}

export class TScriptEditor {
	private extensions!: Extension[];
	private documents: TScriptDocument[] = [];
	private currentDocument?: TScriptDocument;

	private readOnlyState = new Compartment();
	private readOnlyDim = new Compartment();

	public constructor(extensions?: Extension[]) {
		// Default extensions
		if (!extensions)
			extensions = [
				cmtsmode,
				baseTheme,
				highlighting,
				breakpointGutter,
				basicSetup,
				keymap.of([indentWithTab]),
			];

		// ReadOnly Extensions
		extensions.push(this.readOnlyState.of(EditorState.readOnly.of(false)));
		extensions.push(
			this.readOnlyDim.of(EditorView.editorAttributes.of({}))
		);

		extensions.push(
			EditorView.updateListener.of((viewUpdate) => {
				if (!viewUpdate.focusChanged) return;

				let doc = this.documents.find(
					(doc) => doc.getEditorView().hasFocus
				);

				if (doc) this.currentDocument = doc;
			})
		);

		this.extensions = extensions;
	}

	/**
	 *  return all Instances of the editor
	 */
	public getDocuments() {
		return this.documents;
	}

	public getCurrentDocument() {
		return this.currentDocument;
	}

	public getValues() {
		const values: Record<string, string> = {};

		this.documents.forEach(
			(doc) => (values[doc.getFilename()] = doc.getValue())
		);

		return values;
	}

	public closeDocument(filename) {
		const doc = this.documents.find(
			(doc) => doc.getFilename() === filename
		);

		if (!doc) return;

		if (this.currentDocument?.getFilename() === filename)
			this.currentDocument = this.documents.find(
				(d) => d.getFilename() != filename
			)!;

		this.documents = this.documents.filter((d) => d != doc);
		removePanel(doc.getPanelId());
	}

	/**
	 * Runs the callback function whenever the content of the document changes
	 * @param callback
	 */
	public onDocChange(callback: (doc: TScriptDocument) => any) {
		// Add the event listener to the extensions
		this.extensions.push(
			EditorView.updateListener.of((viewUpdate) => {
				const doc = this.documents.find(
					(doc) => doc.getEditorView() === viewUpdate.view
				);

				if (viewUpdate.docChanged) callback(doc!);
			})
		);

		// Refresh extensions
		this.documents.forEach((doc) =>
			doc.getEditorView().dispatch({
				effects: StateEffect.reconfigure.of(this.extensions),
			})
		);
	}

	/**
	 * Runs the callback function whenever the cursor position changes
	 * @param callback
	 */
	public onCursorActivity(callback: (doc: TScriptDocument) => any) {
		// Add the event listener to the extensions
		this.extensions.push(
			EditorView.updateListener.of((viewUpdate) => {
				if (!viewUpdate.selectionSet) return;

				const doc = this.documents.find(
					(doc) => doc.getEditorView() === viewUpdate.view
				);

				if (doc) callback(doc);
			})
		);

		// Refresh extensions
		this.documents.forEach((doc) =>
			doc.getEditorView().dispatch({
				effects: StateEffect.reconfigure.of(this.extensions),
			})
		);
	}

	/**
	 * Gets the readOnly state of the editor
	 */
	public isReadOnly() {
		return this.documents[0]?.getEditorView().state.readOnly;
	}

	/**
	 * Sets the readOnly state of the editor
	 */
	public setReadOnly(readOnly: boolean) {
		this.documents.forEach((doc) =>
			doc.getEditorView().dispatch({
				effects: this.readOnlyState.reconfigure(
					EditorState.readOnly.of(readOnly)
				),
			})
		);

		this.documents.forEach((doc) =>
			doc.getEditorView().dispatch({
				effects: this.readOnlyDim.reconfigure(
					EditorView.editorAttributes.of(
						readOnly ? { style: "opacity: 0.6" } : {}
					)
				),
			})
		);
	}

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

	public clearHistory() {
		this.documents.forEach((doc) => doc.clearHistory());
	}

	/**
	 *
	 */
	public newDocument(
		textarea,
		name: string,
		panelId: number
	): TScriptDocument {
		const doc = new TScriptDocument(
			textarea,
			name,
			panelId,
			this.extensions
		);
		this.documents.push(doc);

		this.currentDocument = doc;
		doc.focus();

		this.setReadOnly(this.isReadOnly());

		return doc;
	}
}

export class TScriptDocument {
	private filename: string;
	private ev: EditorView;
	private extensions: Extension[];
	private panelId: number;
	private dirty: boolean;

	constructor(
		textarea: any,
		name: string,
		panelId: number,
		extensions: Extension[]
	) {
		let view = new EditorView({ doc: textarea.value, extensions });
		textarea.parentNode.insertBefore(view.dom, textarea);
		textarea.style.display = "none";
		if (textarea.form)
			textarea.form.addEventListener("submit", () => {
				textarea.value = view.state.doc.toString();
			});

		this.ev = view;
		this.filename = name;
		this.panelId = panelId;
		this.dirty = false;
		this.extensions = extensions;
	}

	/**
	 * Edited focus method
	 */
	public focus() {
		this.ev.focus();

		const panel = getPanel(this.panelId);
		if (panel && (!panel.state || panel.state === "icon")) {
			panel.dock("left");
		}
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

	/**
	 * Sets the cursor to the given position
	 * @param pos (CM5 position syntax)
	 */
	public setCursor(pos: EditorPosition) {
		this.focus();
		const offset = TScriptEditor.posToOffset(this.ev, pos);
		this.ev.dispatch({ selection: { anchor: offset } });
	}

	/**
	 * Returns the scroll info of the editor
	 */
	public getScrollInfo() {
		const scroller = this.getScrollerElement();
		return {
			left: scroller.scrollLeft,
			top: scroller.scrollTop,
			width: scroller.scrollWidth,
			height: scroller.scrollHeight,
			clientWidth: scroller.clientWidth,
			clientHeight: scroller.clientHeight,
		};
	}

	/**
	 * Returns the bounding box of the character at the given position
	 */
	public charCoords(pos: EditorPosition, mode = "") {
		const rect = this.ev.coordsForChar(
			TScriptEditor.posToOffset(this.ev, pos)
		);
		if (rect == null)
			throw new Error("Pos does not point in front of a character");
		return rect;
	}

	/**
	 * Returns the scroller element of the editor
	 */
	public getScrollerElement(): HTMLElement {
		return this.ev.scrollDOM;
	}

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

	/**
	 * Returns the currently selected text
	 */
	public getSelection() {
		const selection = this.ev.state.selection.main;
		return this.getRange(selection.from, selection.to);
	}

	/**
	 * Returns the current cursor position
	 */
	public getCursor() {
		return TScriptEditor.offsetToPos(
			this.ev,
			this.ev.state.selection.main.head
		);
	}

	/**
	 * Returns the current word at the given position
	 */
	public findWordAt(pos: EditorPosition) {
		const word = this.ev.state.wordAt(
			TScriptEditor.posToOffset(this.ev, pos)
		);
		if (word) return this.getRange(word.from, word.to);
		else return "";
	}

	/**
	 * Returns text from the document within the given range
	 */
	public getRange(from: number, to: number) {
		return this.ev.state.sliceDoc(from, to);
	}

	/**
	 * Scrolls a line into view
	 */
	public scrollIntoView(pos: EditorPosition) {
		this.focus();

		this.ev.dispatch({
			effects: EditorView.scrollIntoView(
				TScriptEditor.posToOffset(this.ev, pos),
				{ y: "center" }
			),
		});
	}

	/**
	 * Returns the editor filename
	 */
	public getFilename() {
		return this.filename;
	}

	/**
	 * Returns the editor panelid
	 */
	public getPanelId() {
		return this.panelId;
	}

	/**
	 * Returns true if the editor has unsaved changes
	 */
	public isDirty() {
		return this.dirty;
	}

	/**
	 * Returns true if the editor has unsaved changes
	 */
	public setDirty(dirty: boolean) {
		this.dirty = dirty;
	}
}
