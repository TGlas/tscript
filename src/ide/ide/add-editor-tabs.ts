import { icons } from "../icons";
import * as tgui from "../tgui";
import { tabNameDlg } from "./dialogs";
import * as ide from "./index";

export function add_editor_tabs() {
	tabNameDlg(function (filename) {
		createEditorTab(filename);
	});
}

function createEditorTab(name: string) {
	let panel_tab_editor = tgui.createPanel({
		name: "tab_editor",
		title: `Editor - ${name}`,
		state: "right",
		fallbackState: "float",
		icon: icons.editor,
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
