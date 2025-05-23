import * as ide from ".";
import { Editor } from "../editor";
import { getResolvedTheme, subscribeOnThemeChange } from "../tgui";
import { saveConfig } from "./dialogs";
import { updateStatus } from "./utils";

// This class collects all editor instances of the multi-document IDE.
// It keeps track of the currently "active" document.
export class EditorCollection {
	private editors: Set<Editor> = new Set<Editor>();
	private active: Editor | null = null;

	public constructor() {
		subscribeOnThemeChange(() => {
			const theme = getResolvedTheme();
			for (const editor of this.editors) editor.setTheme(theme);
		});
	}

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

	// find an editor by the associated tab
	public getEditorByTab(tab: any): Editor | null {
		for (let ed of this.editors) if (ed.properties().tab === tab) return ed;
		return null;
	}

	// obtain the currently active editor
	public getActiveEditor(): Editor | null {
		return this.active;
	}

	// obtain an array containing all filenames of open editors
	public getFilenames() {
		let a = new Array<string>();
		for (let ed of this.editors) a.push(ed.properties().name);
		return a;
	}

	public setActiveEditor(ed: Editor | null, save_config: boolean = true) {
		if (ed === this.active) return;

		let active = ide.collection.getActiveEditor();
		if (active) active.properties().tab.classList.remove("active");

		this.active = ed;

		ide.editorcontainer.innerHTML = "";
		if (ed) {
			ed.properties().tab.classList.add("active");
			ide.editorcontainer.appendChild(ed.dom());
			ed.focus();
			ed.updateScrollbars();
		}

		if (ide.panel_editor) {
			let title = ed ? ed.properties().name : null;
			ide.panel_editor.title = title;
			if (ed)
				ide.panel_editor.titlebar.innerText = "Editor \u2014 " + title;
			else ide.panel_editor.titlebar.innerText = "Editor";
		}

		if (save_config) saveConfig();
	}

	// convenience function for setting the read-only state of all editors
	public setReadOnly(readOnly: boolean) {
		for (let e of this.editors) e.setReadOnly(readOnly);
	}

	// create a new editor instance
	public createEditor(
		tab: any,
		runoption: any,
		name: string,
		text: string | null = null,
		save_config: boolean = true,
		fileTreePath: string | null = null
	) {
		if (this.getEditor(name))
			throw new Error(
				"[collection] internal error: duplicate filename '" + name + "'"
			);

		let ed = new Editor({
			language: "tscript",
			text: text ?? "",
		});
		this.editors.add(ed);
		ed.properties().tab = tab;
		ed.properties().runoption = runoption;
		ed.properties().name = name;
		ed.properties().fileTreePath = fileTreePath;
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
				if (toggle) {
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
				// change breakpoints
				let br = ed.properties().breakpoints;
				let new_br = new Set();
				for (let b of br) {
					if (b < line) new_br.add(b);
					else if (b >= line + removed)
						new_br.add(b + inserted - removed);
				}
				// modify the existing set instead of assigning a new one since it is enclosed in handlers
				br.clear();
				for (let b of new_br) br.add(b);
				ed.draw();
			}
			ide.clear();
			updateStatus();
		});
		this.setActiveEditor(ed, save_config);
		return ed;
	}

	// close an editor, remove it from the set
	public closeEditor(name: string, save_config: boolean = true) {
		let ed = this.getEditor(name);
		if (!ed) return;

		ed.properties().tab.remove();
		ed.properties().runoption.remove();
		this.editors.delete(ed);
		if (this.active === ed) {
			const nextActive = this.editors.values().next().value;
			this.setActiveEditor(nextActive ?? null, false);
		}
		if (save_config) saveConfig();
	}
}
