import Path from "@isomorphic-git/lightning-fs/src/path";
import * as ide from ".";
import {
	FileID,
	fileIDHasNamespace,
	fileIDToHumanFriendly,
	isLoadableFileID,
	LoadableFileID,
	projectFileIDTripleSplit,
	splitFileIDAtColon,
} from "../../lang/parser/file_id";
import { getProjectPath, readFileContent } from "../projects-fs";
import { getResolvedTheme, subscribeOnThemeChange } from "../tgui";
import { EditorController, NavigationRequest } from "./editor-controller";

interface SavedEditorCollectionState {
	open: LoadableFileID[];
	active: LoadableFileID | null;
}

/**
 * This class collects all editor instances of the multi-document IDE.
 * It keeps track of the currently "active" document.
 */
export class EditorCollection {
	readonly #editorContainer: HTMLElement;
	readonly #tabContainer: HTMLElement;
	readonly #runSelector: HTMLSelectElement;

	readonly #editors: EditorController[] = [];
	#active: EditorController | null = null;

	constructor(
		editorContainer: HTMLElement,
		tabContainer: HTMLElement,
		runSelector: HTMLSelectElement,
		/** called after state changes (e.g. open editors, active editor) */
		public onStateChanged: () => void
	) {
		this.#editorContainer = editorContainer;
		this.#tabContainer = tabContainer;
		this.#runSelector = runSelector;

		subscribeOnThemeChange(() => {
			const theme = getResolvedTheme();
			for (const controller of this.#editors)
				controller.editorView.setTheme(theme);
		});
	}

	/** an iterable of all currently opened editor controllers */
	get editors(): readonly EditorController[] {
		return this.#editors;
	}

	/** find an editor controller by (file) name */
	getEditor(name: FileID): EditorController | null {
		return this.#editors.find((c) => c.filename === name) ?? null;
	}

	/** the currently active editor controller */
	get activeEditor(): EditorController | null {
		return this.#active;
	}

	/** get state for saving */
	getSerializedState(): SavedEditorCollectionState {
		const activeFile = this.#active?.filename;
		return {
			open: this.#editors.map((c) => c.filename).filter(isLoadableFileID),
			active:
				activeFile !== undefined && isLoadableFileID(activeFile)
					? activeFile
					: null,
		};
	}

	async restoreState(state: SavedEditorCollectionState) {
		for (const controller of this.#editors) this.#removeEditor(controller);

		let active: EditorController | null = null;
		for (const filename of state.open) {
			const controller = await this.openEditorFromFile(filename);
			if (
				controller instanceof EditorController &&
				filename === state.active
			)
				active = controller;
		}
		if (active) this.#setActiveEditor(active);
	}

	#setActiveEditor(controller: EditorController | null) {
		if (controller === this.#active) return;

		this.#active?.tab.classList.remove("active");
		this.#active = controller;

		if (controller) {
			const editorView = controller.editorView;
			controller.tab.classList.add("active");
			this.#editorContainer.replaceChildren(editorView.dom());
			editorView.focus();
			editorView.updateScrollbars();
		} else {
			this.#editorContainer.replaceChildren();
		}

		this.#updateActiveFilename(controller?.filename ?? null);

		this.onStateChanged();
	}

	#updateActiveFilename(filename: FileID | null) {
		if (ide.panel_editor) {
			const title = filename ? fileIDToHumanFriendly(filename) : null;
			ide.panel_editor.title = title;
			ide.panel_editor.titlebar.innerText =
				filename !== null ? "Editor \u2014 " + title : "Editor";
		}
	}

	/**
	 * Opens or focuses an existinng file
	 *
	 * @param filename the file to open
	 * @param navigateTo a position to navigate to
	 * @returns the editor controller, `null` if the file doesn't exist, an
	 * Error if there was some other error while opening the file
	 */
	async openEditorFromFile(
		filename: LoadableFileID,
		navigateTo?: NavigationRequest
	): Promise<EditorController | null | Error> {
		let controller = this.getEditor(filename);
		if (controller) {
			this.#setActiveEditor(controller);
		} else if (fileIDHasNamespace(filename, "localstorage")) {
			const [_, suffix] = splitFileIDAtColon(filename);
			const text = localStorage.getItem("tscript.code." + suffix);
			if (text !== null) {
				controller = this.openEditorFromData(filename, text);
			}
		} else {
			const [_, projName, projAbsPath] =
				projectFileIDTripleSplit(filename);
			const projPath = getProjectPath(projName);
			const absPath = Path.join(projPath, projAbsPath);
			const text = await readFileContent(absPath);
			if (text instanceof Error) {
				if (["EISDIR", "ENONENT"].includes(text.code!)) {
					return null;
				} else {
					return text;
				}
			}
			controller = this.openEditorFromData(filename, text);
		}

		if (navigateTo) controller?.navigate(navigateTo);

		return controller;
	}

	/**
	 * Create a new editor
	 *
	 * If there exists an editor for {@link filename}, it is closed.
	 *
	 * @returns the created {@link EditorController}
	 */
	openEditorFromData(filename: FileID, text: string): EditorController {
		// close an existing Editor for this file
		this.getEditor(filename)?.close();

		const controller = new EditorController({
			filename,
			text,
			onClosed: () => {
				this.#removeEditor(controller);
			},
			onActivate: () => {
				this.#setActiveEditor(controller);
			},
			onBeforeFilenameChange: (newFilename) => {
				this.getEditor(newFilename)?.close();
				if (this.#active === controller)
					this.#updateActiveFilename(newFilename);
			},
		});

		// optionally lock the new editor
		const session = ide.interpreterSession;
		if (session && ide.shouldLockEditors())
			controller.updateInterpreter(session);

		this.#editors.push(controller);
		this.#tabContainer.appendChild(controller.tab);
		this.#runSelector.appendChild(controller.runOption);
		this.#setActiveEditor(controller); // calls onStateChanged

		return controller;
	}

	#removeEditor(controller: EditorController): boolean {
		controller.tab.remove();
		controller.runOption.remove();

		const index = this.#editors.indexOf(controller);
		if (index === -1) return false;

		this.#editors.splice(index, 1);
		const nextActive =
			this.#editors.at(index) ?? this.#editors.at(-1) ?? null;
		this.#setActiveEditor(nextActive); // calls onStateChanged
		return true;
	}
}
