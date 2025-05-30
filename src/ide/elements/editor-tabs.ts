import Path from "@isomorphic-git/lightning-fs/src/path";
import {
	FileID,
	fileIDHasNamespace,
	fileIDToContextDependentFilename,
	fileIDToHumanFriendly,
	LoadableFileID,
	LocalStorageFileID,
	ProjectFileID,
	projectFileIDTripleSplit,
} from "../../lang/parser";
import { Editor } from "../editor";
import { icons } from "../icons";
import {
	getProjectPath,
	readFileContent,
	recurseDirectory,
	simplifyPath,
} from "../projects-fs";
import * as tgui from "../tgui";
import { errorMsgBox } from "../tgui";
import { EditorIDE } from "./collection";
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
): EditorIDE | null {
	const sourcecode = localStorage.getItem("tscript.code." + name);
	if (sourcecode === null) return null;
	let ed = createEditorTab(`localstorage:${name}`, sourcecode, save_config);
	if (save_config) saveConfig();
	return ed;
}

export async function openEditorFromStorage(
	fileID: LocalStorageFileID | ProjectFileID,
	save_config: boolean = true
): Promise<EditorIDE | null> {
	if (fileIDHasNamespace(fileID, "project")) {
		const ed = await openEditorFromProjectFS(fileID, true, save_config);
		if (ed instanceof Error) {
			if (
				!("code" in ed) ||
				(ed.code !== "ENOENT" && ed.code !== "EISDIR")
			)
				errorMsgBox(`Could not open file: ${ed.message}`);
			return null;
		}
		return ed;
	} else {
		return openEditorFromLocalStorage(fileID, save_config);
	}
}

/**
 * @param overwrite whether to replace the content of the existing editor (if
 * existent)
 * @returns null if the file doesn't exist, an error if there was some error,
 * and the file content otherwise.
 */
export async function openEditorFromProjectFS(
	fileID: ProjectFileID,
	overwrite: boolean,
	save_config: boolean = true
): Promise<EditorIDE | Error> {
	const [_, projName, projAbsPath] = projectFileIDTripleSplit(fileID);
	const projPath = getProjectPath(projName);
	const absPath = Path.join(projPath, projAbsPath);
	const existingEditor = ide.collection.getEditor(fileID);
	if (!overwrite && existingEditor) {
		ide.collection.setActiveEditor(existingEditor);
		existingEditor.focus();
		return existingEditor;
	}

	const fileContent = await readFileContent(absPath);
	if (fileContent instanceof Error) {
		return fileContent;
	}
	if (save_config) saveConfig();
	return createEditorTab(fileID, fileContent, save_config);
}

export function createEditorTabByModal() {
	tabNameDlg(function (name) {
		// Don't accept empty filenames
		if (!name) return true; // keep dialog open

		const fileID = `localstorage:${name}` as const;
		let ed = ide.collection.getEditor(fileID);
		const isOpenDoc = !!ed;
		const isSavedDoc =
			localStorage.getItem("tscript.code." + name) !== null;

		if (isOpenDoc || isSavedDoc) {
			confirmFileOverwrite(name, () => {
				ide.collection.closeEditor(fileID);
				createEditorTab(fileID);
			});
			return false;
		} else createEditorTab(fileID);

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
	name: FileID,
	text: string | null = null,
	save_config: boolean = true
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
		text: fileIDToContextDependentFilename(name),
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
		text: fileIDToHumanFriendly(name),
	});

	// create a new editor
	let ed = ide.collection.createEditor(
		tab,
		runoption,
		name,
		text,
		save_config
	);

	return ed;
}

export function closeEditor(fileID: FileID) {
	ide.collection.closeEditor(fileID);
}

export async function closeProjectEditorTabsRecursively(
	projectName: string,
	projAbsPath: string
): Promise<void> {
	const projPath = simplifyPath(getProjectPath(projectName));
	const absPath = Path.join(projPath, projAbsPath);
	for await (const entry of recurseDirectory(absPath)) {
		const projAbsPathToClose = simplifyPath(entry.slice(projPath.length));
		const fileID = `project:${projectName}${projAbsPathToClose}` as const;
		ide.collection.closeEditor(fileID);
	}
}
