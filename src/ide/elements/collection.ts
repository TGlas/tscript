import * as ide from ".";
import { getResolvedTheme, subscribeOnThemeChange } from "../tgui";
import { saveConfig } from "./dialogs";
import { EditorController, NavigationRequest } from "./editor-controller";

interface SavedEditorCollectionState {
	open: string[];
	active: string | null;
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
		runSelector: HTMLSelectElement
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
	getEditor(name: string): EditorController | null {
		return this.#editors.find((c) => c.filename === name) ?? null;
	}

	/** the currently active editor controller */
	get activeEditor(): EditorController | null {
		return this.#active;
	}

	/** get state for saving */
	getSerializedState(): SavedEditorCollectionState {
		return {
			open: this.#editors.map((c) => c.filename),
			active: this.#active?.filename ?? null,
		};
	}

	restoreState(state: SavedEditorCollectionState) {
		for (const controller of this.#editors)
			this.#removeEditor(controller, false);

		let active: EditorController | null = null;
		for (const filename of state.open) {
			const controller = this.openEditorFromFile(
				filename,
				undefined,
				false
			);
			if (filename === state.active) active = controller;
		}
		if (active) this.#setActiveEditor(active);
	}

	#setActiveEditor(
		controller: EditorController | null,
		save_config: boolean = true
	) {
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

		if (save_config) saveConfig();
	}

	#updateActiveFilename(filename: string | null) {
		if (ide.panel_editor) {
			ide.panel_editor.title = filename;
			ide.panel_editor.titlebar.innerText =
				filename !== null ? "Editor \u2014 " + filename : "Editor";
		}
	}

	// convenience function for setting the read-only state of all editors
	setReadOnly(readOnly: boolean) {
		for (const c of this.#editors) c.editorView.setReadOnly(readOnly);
	}

	/**
	 * Opens or focuses an existinng file
	 *
	 * @param filename the file to open
	 * @param navigateTo a position to navigate to
	 * @returns the editor controller or `null` if the file doesn't exist
	 */
	openEditorFromFile(
		filename: string,
		navigateTo?: NavigationRequest,
		save_config: boolean = true
	): EditorController | null {
		let controller = this.getEditor(filename);
		if (controller) {
			this.#setActiveEditor(controller, save_config);
		} else {
			const text = localStorage.getItem("tscript.code." + filename);
			if (text !== null) {
				controller = this.openEditorFromData(
					filename,
					text,
					save_config
				);
			}
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
	openEditorFromData(
		filename: string,
		text: string,
		save_config: boolean = true
	): EditorController {
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

		if (ide.shouldLockEditors()) controller.editorView.setReadOnly(true);

		this.#editors.push(controller);
		this.#tabContainer.appendChild(controller.tab);
		this.#runSelector.appendChild(controller.runOption);
		this.#setActiveEditor(controller, save_config);

		return controller;
	}

	#removeEditor(
		controller: EditorController,
		save_config: boolean = true
	): boolean {
		controller.tab.remove();
		controller.runOption.remove();

		const index = this.#editors.indexOf(controller);
		if (index === -1) return false;

		this.#editors.splice(index, 1);
		const nextActive =
			this.#editors.at(index) ?? this.#editors.at(-1) ?? null;
		this.#setActiveEditor(nextActive, save_config);
		return true;
	}
}
