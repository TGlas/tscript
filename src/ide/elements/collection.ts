import * as ide from ".";
import { getPanel, removePanel } from "../tgui";
import { updateRunSelection } from ".";
import { updateStatus, updateControls } from "./utils";
import { Editor, Document } from "../editor";

// This class collects all editor instances of the multi-document IDE.
// It keeps track of the currently "active" document.
export class EditorCollection {
	private editors: Set<Editor> = new Set<Editor>();
	private active: Editor | null = null;
	public keybindings: Map<string, string> = Editor.defaultKeyBindings;

	public constructor() {}

	// return the collection of all editors as a set
	public getEditors() {
		return this.editors;
	}

	// find an editor by (file) name
	public getEditor(name: string): Editor | null {
		for (let ed of this.editors)
			if (ed.properties().name === name) return ed;
		return null;
	}

	// obtain the texts (strings) represented by all editors
	public getValues() {
		let values: Record<string, string> = {};
		for (let ed of this.editors) values[ed.properties().name] = ed.text();
		return values;
	}

	// obtain the currently active editor
	public getActiveEditor(): Editor | null {
		return this.active;
	}

	// convenience function for setting the read-only state of all editors
	public setReadOnly(readOnly: boolean) {
		for (let e of this.editors) e.setReadOnly(readOnly);
	}

	// create a new editor instance
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
				let toggle = true;
				if (ide.interpreter) {
					// ask the interpreter for the correct position of the marker
					let result = ide.interpreter.toggleBreakpoint(
						line + 1,
						ed.properties().name
					);
					if (result !== null) {
						line = result.line - 1;
						ed.scrollTo(line, 0);
					} else toggle = false;
				}
				if (toggle)
				{
					let breakpoints = ed.properties().breakpoints;
					if (breakpoints.has(line)) breakpoints.delete(line);
					else breakpoints.add(line);
					ed.focus();
					ed.draw();
				}
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
					collection.active = ed;
				};
			})(this, ed)
		);
		ed.setEventHandler("changed", (line, removed, inserted) => {
			if (line !== null) {
				console.log("lines changed", line, removed, inserted);
				// change breakpoints
				let br = ed.properties().breakpoints;
				let new_br = new Set();
				for (let b of br)
				{
					if (b < line) new_br.add(b);
					else if (b >= line + removed) new_br.add(b + inserted - removed);
				}
				// modify the existing set instead of assigning a new one since it is enclosed in handlers
				br.clear();
				for (let b of new_br) br.add(b);
				ed.draw();
			}
			ide.clear();
			updateStatus();
		});
		return ed;
	}

	// close an editor, remove it from the set
	public closeEditor(name: string) {
		let ed = this.getEditor(name);
		if (!ed) return;

		this.editors.delete(ed);
		if (this.active === ed)
			this.active = this.editors.values().next().value;
		removePanel(ed.properties().panelID);
		updateRunSelection();
	}
}
