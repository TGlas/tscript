import {
	FileID,
	fileIDHasNamespace,
	fileIDToContextDependentFilename,
	fileIDToHumanFriendly,
	splitFileIDAtColon,
} from "../../lang/parser/file_id";
import { Editor } from "../editor";
import * as tgui from "../tgui";
import { confirmFileDiscard } from "./dialogs";
import * as ide from "./index";

export interface NavigationRequest {
	line: number;
	column?: number;
	/** tabulators are counted as a single character */
	character?: number;
}

export interface EditorControllerOptions {
	filename: FileID;
	text: string;

	/** called whenever the editor wants to be activated */
	onActivate: () => void;

	/** called when the editor was closed */
	onClosed: () => void;

	/** called before {@link EditorController.filename} changes */
	onBeforeFilenameChange: (newFilename: FileID) => void;
}

export class EditorController {
	readonly tab: HTMLElement;
	readonly tabLabel: HTMLElement;
	readonly runOption: HTMLOptionElement;

	readonly editorView: Editor;

	readonly #breakpoints = new Set<number>();

	readonly #onActivate: () => void;
	readonly #onBeforeFilenameChange: (newFilename: FileID) => void;
	#filename: FileID;

	readonly close: () => void;

	constructor({
		filename,
		text,
		onActivate,
		onClosed,
		onBeforeFilenameChange,
	}: EditorControllerOptions) {
		this.#filename = filename;
		this.#onActivate = onActivate;
		this.close = onClosed;
		this.#onBeforeFilenameChange = onBeforeFilenameChange;

		// create tab
		this.tab = tgui.createElement({
			type: "div",
			classname: "file active",
		});
		this.tab.replaceChildren(
			(this.tabLabel = tgui.createElement({
				type: "span",
				classname: "name",
				text: "",
				click: () => onActivate(),
			})),
			tgui.createElement({
				type: "span",
				classname: "close",
				text: "\u00d7",
				click: () => {
					if (this.hasUnsavedChanges)
						confirmFileDiscard(this.filename, () => this.close());
					else this.close();
				},
			})
		);

		// create run option
		this.runOption = tgui.createElement({
			type: "option",
			properties: { value: filename },
			text: "",
		});
		this.updateUITextsForFileID();

		// create editor view
		const ed = (this.editorView = new Editor({
			language: "tscript",
			text: text ?? "",
			readOnly: ide.shouldLockEditors(),
		}));

		ed.events.barDraw = (begin, end) => {
			const a = new Array<string | null>();
			const breakpoints = this.#breakpoints;
			for (let line = begin; line < end; line++) {
				if (breakpoints.has(line)) a.push("\u23FA");
				else a.push(null);
			}
			return a;
		};
		ed.events.barClick = (line) => this.toggleBreakpoint(line);
		ed.events.changed = (lineChange) => {
			if (lineChange) {
				const { line, removed, inserted } = lineChange;
				const breakpoints = this.#breakpoints;
				// shift affected breakpoints
				for (const b of [...breakpoints]) {
					// iterate over copy
					// is the line of this breakpoint affected? -> delete
					if (b >= line) breakpoints.delete(b);

					// was the line _not_ removed? -> re-add with offset
					if (b >= line + removed)
						breakpoints.add(b + inserted - removed);
				}
				ed.draw();
			}
			ide.clear();
		};
	}

	get filename(): FileID {
		return this.#filename;
	}

	get breakpoints(): ReadonlySet<number> {
		return this.#breakpoints;
	}

	get hasUnsavedChanges(): boolean {
		return this.editorView.isDirty();
	}

	navigate(to: NavigationRequest) {
		this.#onActivate();
		if (to.character != null)
			this.editorView.setCursorPositionByCharacter(to.line, to.character);
		else this.editorView.setCursorPosition(to.line, to.column ?? 0);
		this.editorView.scrollIntoView();
	}

	toggleBreakpoint(line: number) {
		const interpreter = ide.interpreterSession?.interpreter;
		if (interpreter) {
			// ask the interpreter for the correct position of the marker
			const result = interpreter.toggleBreakpoint(
				line + 1,
				this.#filename
			);
			if (result !== null) {
				line = result.line - 1;
				this.editorView.scrollTo(line, 0);
			} else return;
		}

		if (!this.#breakpoints.delete(line)) this.#breakpoints.add(line);
		this.editorView.focus();
		this.editorView.draw();
	}

	updateInterpreter(session: ide.InterpreterSession | null) {
		if (!session) {
			this.editorView.setReadOnly(false);
			return;
		}

		this.editorView.setReadOnly(true);
		const result = session.interpreter.defineBreakpoints(
			// convert to one-based line indices
			Array.from(this.#breakpoints, (line) => line + 1),
			this.#filename
		);
		if (result) {
			this.#breakpoints.clear();
			for (const line of result) this.#breakpoints.add(line - 1);
			this.editorView.draw();
		}
	}

	saveAs(filename: FileID) {
		this.#onBeforeFilenameChange(filename);

		this.#filename = filename;
		this.updateUITextsForFileID();
		this.runOption.value = filename;
		this.save();
	}

	private updateUITextsForFileID() {
		this.tabLabel.innerText = fileIDToContextDependentFilename(
			this.#filename
		);
		this.runOption.innerText = fileIDToHumanFriendly(this.#filename);
	}

	save() {
		const [ns, suffix] = splitFileIDAtColon(this.filename);
		if (ns !== "localstorage")
			throw new Error("Saving only supported for files in localStorage");
		localStorage.setItem("tscript.code." + suffix, this.editorView.text());
		this.editorView.setClean();
	}
}
