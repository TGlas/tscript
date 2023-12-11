import * as tgui from "../tgui";
import {icons} from "../icons";
import { TScriptEditor } from "./TScriptEditor";

export function add_editor_tabs(tab_editor) {
    let panel_tab_editor = tgui.createPanel({
        name: "tab_editor",
        title: "Editor Tab",
        state: "right",
        fallbackState: "float",
        icon: icons.editor,
    });
    tab_editor = tgui.createElement({
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
