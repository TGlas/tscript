import { icons } from "../icons";
import * as tgui from "../tgui";
import {
	confirmFileDiscard,
	confirmFileOverwrite,
	tabNameDlg,
} from "./dialogs";
import * as ide from "./index";

// Return an Editor instance
export function openEditorFromLocalStorage(name: string) {
	const sourcecode = localStorage.getItem("tscript.code." + name);
	if (sourcecode === null) return null;
	return createEditorTab(name, sourcecode);
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

export function createEditorTab(name: string, text: string | null = null) {
	let panel_tab_editor = tgui.createPanel({
		name: "tab_editor",
		title: `Editor \u2014 ${name}`,
		state: "left",
		fallbackState: "icon",
		icon: icons.editor,
		onClose: () => {
			confirmFileDiscard(name, () => closeEditor(name));
		},
	});

	let ed = ide.collection.createEditor(name, panel_tab_editor.panelID, text);
	panel_tab_editor.content.appendChild(ed.dom());
	ed.focus();

	panel_tab_editor.content.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		return false;
	});

	ide.updateRunSelection();
	return ed;
}

export function closeEditor(filename: string) {
	ide.collection.closeEditor(filename);
}
