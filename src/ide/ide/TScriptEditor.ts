import {
	Compartment,
	EditorState,
	Extension,
	StateEffect,
} from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { cmtsmode } from "../codemirror-tscriptmode";
import { breakpointGutter, hasBreakpoint } from "./breakpoint";
import { baseTheme, highlighting } from "./styling";

let instanceCounter = 1;

interface EditorPosition {
	line: number;
	ch: number;
}

export class TScriptEditor {
	private ev: EditorView;
	private extensions!: Extension[];
	private static instances: TScriptEditor[] = [];
	private instanceId: string;
	private static focusedInstance: TScriptEditor | null = null;

	private readOnlyState = new Compartment();
	private readOnlyDim = new Compartment();

	public constructor(textarea: any, extensions?: Extension[]) {
		// Default extensions
		if (!extensions)
			extensions = [
				cmtsmode,
				baseTheme,
				highlighting,
				breakpointGutter,
				basicSetup,
			];

		// ReadOnly Extensions
		extensions.push(this.readOnlyState.of(EditorState.readOnly.of(false)));
		extensions.push(
			this.readOnlyDim.of(EditorView.editorAttributes.of({}))
		);

		this.extensions = extensions;
		this.ev = this.editorFromTextArea(textarea);
		this.setupEventListeners();
		TScriptEditor.instances.push(this);
		this.instanceId = `Editor${instanceCounter++}`;
		this.focus();
	}

	/**
	 * Event listener for Editor dom Element, used to focus current Editor und blur others
	 */
	private setupEventListeners() {
		this.ev.dom.addEventListener("click", () => {
			this.focus();
			this.resetStyle();
			console.log(`Focused editor: ${this.getInstanceId()}`);
		});
	}

	private setStyle() {
		// Modify styles of the EditorView's DOM element
		this.ev.dom.style.backgroundColor = "darkblue";
		this.ev.dom.style.opacity = "0.2";
	}

	private resetStyle() {
		this.ev.dom.removeAttribute("style");
	}

	/**
	 *  return all Instances of the editor
	 */
	public static getInstances() {
		return TScriptEditor.instances;
	}

	/**
	 *  return current InstanceId of the Editor
	 */
	public getInstanceId() {
		return this.instanceId;
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

	/**
	 * Runs the callback function whenever the cursor position changes
	 * @param callback
	 */
	public onCursorActivity(callback: (d: TScriptEditor) => any) {
		// Add the event listener to the extensions
		this.extensions.push(
			EditorView.updateListener.of((viewUpdate) => {
				if (viewUpdate.selectionSet) callback(this);
			})
		);

		// Refresh extensions
		this.ev.dispatch({
			effects: StateEffect.reconfigure.of(this.extensions),
		});
	}

	/**
	 * remove Focus from Editor
	 */
	public blur() {
		this.ev.contentDOM.blur();
	}

	/**
	 * Edited focus method, blurs and styles all other Editors to focus on Main Editor
	 */
	public focus() {
		if (TScriptEditor.focusedInstance !== this) {
			TScriptEditor.blurAllExcept(this);
			this.ev.focus();
			this.resetStyle();
			TScriptEditor.focusedInstance = this;
		}
	}

	/**
	 * Blurs all other Editor Instances
	 */
	private static blurAllExcept(instance: TScriptEditor) {
		TScriptEditor.getInstances().forEach((otherInstance) => {
			if (otherInstance !== instance) {
				otherInstance.blur();
				otherInstance.setStyle();
			}
		});
	}

	/**
	 * Check if Editor has Focus for Interpreter
	 */
	// public isFocused(): boolean {
	// 	return this.ev.hasFocus;
	// }

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
	 * Gets the readOnly state of the editor
	 */
	public isReadOnly() {
		return this.ev.state.readOnly;
	}

	/**
	 * Sets the readOnly state of the editor
	 */
	public setReadOnly(readOnly: boolean) {
		this.ev.dispatch({
			effects: this.readOnlyState.reconfigure(
				EditorState.readOnly.of(readOnly)
			),
		});

		this.ev.dispatch({
			effects: this.readOnlyDim.reconfigure(
				EditorView.editorAttributes.of(
					readOnly ? { style: "opacity: 0.6" } : {}
				)
			),
		});
	}

	/**
	 * Sets the cursor to the given position
	 * @param pos (CM5 position syntax)
	 */
	public setCursor(pos: EditorPosition) {
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
		this.ev.dispatch({
			effects: EditorView.scrollIntoView(
				TScriptEditor.posToOffset(this.ev, pos),
				{ y: "center" }
			),
		});
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
