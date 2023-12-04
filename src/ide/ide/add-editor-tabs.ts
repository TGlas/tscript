import * as tgui from "../tgui";
import {icons} from "../icons";

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
        properties: { width: "600", height: "600" },
        classname: "ide ide-sourcecode",
    });
    tab_editor.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        return false;
    });
    return false;
}
