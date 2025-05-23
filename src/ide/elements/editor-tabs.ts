import { Editor } from "../editor";
import { icons } from "../icons";
import * as tgui from "../tgui";
import {
	saveConfig,
	confirmFileDiscard,
	confirmFileOverwrite,
	tabNameDlg,
} from "./dialogs";
import * as ide from "./index";

export let tab_config: any = { align: "horizontal" };

// Return an Editor instance
export function openEditorFromLocalStorage(
	name: string,
	save_config: boolean = true
) {
	const sourcecode = localStorage.getItem("tscript.code." + name);
	if (sourcecode === null) return null;
	let ed = createEditorTab(name, sourcecode, save_config);
	if (save_config) saveConfig();
	return ed;
}

export function createEditorTabByModal() {
	tabNameDlg(function (name) {
		// Don't accept empty filenames
		if (!name) return true; // keep dialog open

		let eds = ide.collection.getEditors();
		let ed = ide.collection.getEditor(name);
		const isOpenDoc = !!ed;
		const isSavedDoc =
			localStorage.getItem("tscript.code." + name) !== null;

		if (isOpenDoc || isSavedDoc) {
			confirmFileOverwrite(name, () => {
				ide.collection.closeEditor(name);
				createEditorTab(name);
			});
			return false;
		} else createEditorTab(name);

		return false;
	});
}

export function updateTabTitle(editor: any, newTitle: string) {
	const editorProperties = editor.properties();
	if (!editorProperties || !editorProperties.tab) return;
	const nameSpan = editorProperties.tab.querySelector(".name");
	if (nameSpan) {
		nameSpan.textContent = newTitle;
	}

	if (editorProperties.runoption) {
		editorProperties.runoption.textContent = newTitle;
		editorProperties.runoption.value = newTitle;
	}
}

export function createEditorTab(
	name: string,
	text: string | null = null,
	save_config: boolean = true,
	fileTreePath: string | null = null
) {
	// create a new tab
	let tab = tgui.createElement({
		type: "div",
		parent: ide.editortabs,
		classname: "file active",
	});
	tgui.createElement({
		type: "span",
		parent: tab,
		classname: "name",
		text: name,
		click: function (event) {
			let ed = ide.collection.getEditorByTab(tab);
			if (ed) ide.collection.setActiveEditor(ed);
		},
	});
	tgui.createElement({
		type: "span",
		parent: tab,
		classname: "close",
		text: "\u00d7",
		click: function (event) {
			let ed = ide.collection.getEditorByTab(tab);
			if (!ed) return;
			let filename = ed.properties().name;
			confirmFileDiscard(filename, () => closeEditor(filename));
		},
	});

	// create a "run" option
	let runoption = tgui.createElement({
		type: "option",
		parent: ide.runselector,
		properties: { value: name },
		text: name,
	});

	// create a new editor
	let ed = ide.collection.createEditor(
		tab,
		runoption,
		name,
		text,
		save_config,
		fileTreePath
	);

	return ed;
}

export function closeEditor(filename: string) {
	ide.collection.closeEditor(filename);
}
