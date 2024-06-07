import * as ide from ".";
import { getPanel, removePanel } from "../tgui";
import { updateRunSelection } from ".";
import { updateStatus, updateControls } from "./utils";
import { Editor, Document } from "../editor";

// This class collects all editor instances. It keeps track of the
// currently active "main" document.
export class EditorCollection {
	private editors: Set<Editor> = new Set<Editor>();
	private current: Editor | null = null;
	public keybindings: Map<string, string> = Editor.defaultKeyBindings;

	public constructor() {}

	public getEditors() {
		return this.editors;
	}

	public getEditor(name: string): Editor | null {
		for (let ed of this.editors)
			if (ed.properties().name === name) return ed;
		return null;
	}

	public getValues() {
		let values: Record<string, string> = {};
		for (let ed of this.editors) values[ed.properties().name] = ed.text();
		return values;
	}

	public getCurrentEditor(): Editor | null {
		return this.current;
	}

	public closeEditor(name: string) {
		let ed = this.getEditor(name);
		if (!ed) return;

		this.editors.delete(ed);
		if (this.current === ed) this.current = null;
		removePanel(ed.properties().panelID);
		updateRunSelection();
	}

	//	/**
	//	 * Runs the callback function whenever the content of the document changes
	//	 * @param callback
	//	 */
	//	public onDocChange(callback: (doc: TScriptDocument) => any) {
	//		// Add the event listener to the extensions
	//		this.extensions.push(
	//			EditorView.updateListener.of((viewUpdate) => {
	//				const doc = this.documents.find(
	//					(doc) => doc.getEditorView() === viewUpdate.view
	//				);
	//
	//				if (viewUpdate.docChanged) callback(doc!);
	//			})
	//		);
	//
	//		// Refresh extensions
	//		this.documents.forEach((doc) =>
	//			doc.getEditorView().dispatch({
	//				effects: StateEffect.reconfigure.of(this.extensions),
	//			})
	//		);
	//	}

	//	/**
	//	 * Runs the callback function whenever the cursor position changes
	//	 * @param callback
	//	 */
	//	public onCursorActivity(callback: (doc: TScriptDocument) => any) {
	//		// Add the event listener to the extensions
	//		this.extensions.push(
	//			EditorView.updateListener.of((viewUpdate) => {
	//				if (!viewUpdate.selectionSet) return;
	//
	//				const doc = this.documents.find(
	//					(doc) => doc.getEditorView() === viewUpdate.view
	//				);
	//
	//				if (doc) callback(doc);
	//			})
	//		);
	//
	//		// Refresh extensions
	//		this.documents.forEach((doc) =>
	//			doc.getEditorView().dispatch({
	//				effects: StateEffect.reconfigure.of(this.extensions),
	//			})
	//		);
	//	}

	//	/**
	//	 * Gets the readOnly state of the editor
	//	 */
	//	public isReadOnly() {
	//		return this.documents[0]?.getEditorView().state.readOnly;
	//	}

	/**
	 * Sets the readOnly state of the editor
	 */
	public setReadOnly(readOnly: boolean) {
		for (let e of this.editors) e.setReadOnly(readOnly);
	}

	//	/**
	//	 * Converts CM5 position syntax to CM6 syntax
	//	 */
	//	public static posToOffset(ev: EditorView, pos: EditorPosition) {
	//		return ev.state.doc.line(pos.line + 1).from + pos.ch;
	//	}

	//	/**
	//	 * Converts CM6 position syntax to CM5 syntax
	//	 */
	//	public static offsetToPos(ev: EditorView, offset: number): EditorPosition {
	//		let line = ev.state.doc.lineAt(offset);
	//		return { line: line.number - 1, ch: offset - line.from };
	//	}

	//	public clearHistory() {
	//		this.documents.forEach((doc) => doc.clearHistory());
	//	}

	//	/**
	//	 *
	//	 */
	//	public newDocument(
	//		textarea,
	//		name: string,
	//		panelId: number
	//	): TScriptDocument {
	//		const doc = new TScriptDocument(
	//			textarea,
	//			name,
	//			panelId,
	//			this.extensions
	//		);
	//		this.documents.push(doc);
	//
	//		this.currentDocument = doc;
	//		doc.focus();
	//
	//		this.setReadOnly(this.isReadOnly());
	//
	//		return doc;
	//	}

	public createEditor(
		name: string,
		panelID: number,
		text: string | null = null
	) {
		let config: any = {
			language: "TScript",
			keybindings: this.keybindings,
		};
		if (text) config.text = text;
		let ed = new Editor(config);
		this.editors.add(ed);
		ed.properties().name = name;
		ed.properties().panelID = panelID;
		ed.properties().breakpoints = new Set<number>();
		ed.properties().toggleBreakpoint = (function (ed) {
			return function (line) {
				let breakpoints = ed.properties().breakpoints;
				if (breakpoints.has(line)) breakpoints.delete(line);
				else breakpoints.add(line);
				ed.draw();
			};
		})(ed);
		ed.setEventHandler(
			"barDraw",
			(function (breakpoints) {
				return function (begin, end) {
					let a = new Array<string | null>();
					for (let line = begin; line < end; line++) {
						if (breakpoints.has(line)) a.push("\u23FA");
						else a.push(null);
					}
					return a;
				};
			})(ed.properties().breakpoints)
		);
		ed.setEventHandler("barClick", ed.properties().toggleBreakpoint);
		ed.setEventHandler(
			"focus",
			(function (collection, ed) {
				return function (event) {
					collection.current = ed;
				};
			})(this, ed)
		);
		ed.setEventHandler("changed", () => {
			ide.clear();
			updateStatus();
		});
		return ed;
	}
}
