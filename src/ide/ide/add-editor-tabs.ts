import { icons } from "../icons";
import * as tgui from "../tgui";
import { TScriptEditor } from "./TScriptEditor";
import {tabRnm} from "./dialogs";

export function add_editor_tabs() {
	let rnm = tabRnm(
		"Set Editor Tab name",
		true,
		"Set",
		function (filename) {
			createEditorTab(filename)
		}
	);
}

function createEditorTab(name: string) {
	let panel_tab_editor = tgui.createPanel({
		name: "tab_editor",
		title: name,
		state: "right",
		fallbackState: "float",
		icon: icons.editor,
	});

	const tab_editor = tgui.createElement({
		type: "textarea",
		parent: panel_tab_editor.content,
		classname: "ide ide-tab-sourcecode",
	});

	const newSourcecode = new TScriptEditor(tab_editor);

	tab_editor.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		return false;
	});

	/*const editorCounter = sourcecodeTabs.length + 1;
	console.log(editorCounter);
	localStorage.setItem(`Editor${editorCounter}`, newSourcecode.getValue());
*/
	return false;
}
