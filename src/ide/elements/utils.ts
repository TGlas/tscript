import * as ide from ".";
import { Interpreter } from "../../lang/interpreter/interpreter";
import { localstorageFileID } from "../../lang/parser/file_id";
import { saveAsDialog } from "./dialogs";

export const type2css = [
	"ide-keyword",
	"ide-keyword",
	"ide-integer",
	"ide-real",
	"ide-string",
	"ide-collection",
	"ide-collection",
	"ide-builtin",
	"ide-builtin",
	"ide-builtin",
	"ide-builtin",
];

export const interpreterEnded = (interpreter: Interpreter) =>
	interpreter.status === "finished" || interpreter.status === "error";

/**
 * Clean up filenames originating from external sources
 *
 * - if the filename contains forward slashes, the last segment is picked
 * - the extension `.tscript` is removed from the end
 */
export const cleanupExternalFilename = (filename: string) =>
	filename
		.split("/")
		.at(-1)! // split arrays always have at least one element
		.replace(/\.tscript$/i, "");

/**
 * Import existing text as a new file
 *
 * If a file with this name exists or the name is empty, the user is asked for a new name.
 */
export function importData(text: string, filename?: string) {
	if (filename) {
		const isSavedDoc =
			localStorage.getItem("tscript.code." + filename) !== null;
		const fileID = localstorageFileID(filename);
		if (!isSavedDoc && !ide.collection.getEditor(fileID)) {
			ide.collection.openEditorFromData(fileID, text);
			return;
		}
	}

	return saveAsDialog(filename ?? null, (filename) => {
		// the user has chosen, replace existing files
		ide.collection.openEditorFromData(localstorageFileID(filename), text);
	});
}
