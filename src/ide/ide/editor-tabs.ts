import { icons } from "../icons";
import * as tgui from "../tgui";
import { tabNameDlg } from "./dialogs";
import * as ide from "./index";

/**
 *
 * @param name Filename to open from local storage
 * @returns true if successful, false otherwhise
 */
export function openEditorFromLS(name: string) {
	const file = localStorage.getItem(`tscript.code.${name}`);
	if (file == undefined) return undefined;

	createEditorTab(name);
	const doc = ide.editor.getDocuments().find((d) => d.getFilename() == name);
	doc!.setValue(file);

	return doc;
}

export function createEditorTabByModal() {
	tabNameDlg(function (filename) {
		createEditorTab(filename);
	});
}

export function createEditorTab(name: string) {
	let panel_tab_editor = tgui.createPanel({
		name: "tab_editor",
		title: `Editor — ${name}`,
		state: "left",
		fallbackState: "float",
		icon: icons.editor,
		onClose: () => closeEditor(name),
	});

	const tab_editor = tgui.createElement({
		type: "textarea",
		parent: panel_tab_editor.content,
		classname: "ide ide-tab-sourcecode",
	});

	ide.editor.newDocument(tab_editor, name);

	tab_editor.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		return false;
	});

	return false;
}

export function closeEditor(filename: string) {
	ide.editor.closeDocument(filename);
}
