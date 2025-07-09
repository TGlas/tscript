import { ErrorHelper } from "../../lang/errors/ErrorHelper";
import { Interpreter } from "../../lang/interpreter/interpreter";
import { ProgramRoot } from "../../lang/interpreter/program-elements";
import { ParseInput, parseProgram } from "../../lang/parser";
import {
	FileID,
	ProjectFileID,
	projectFileIDToProjAbsPath,
	LocalStorageFileID,
	StringFileID,
	fileIDChangeNamespace,
	splitFileIDAtColon,
	fileIDHasNamespace,
	localStorageFileIDToFilename,
	projectFileIDTripleSplit,
	localstorageFileID,
	projectFileID,
	stringFileID,
	fileIDToContextDependentFilename,
	isLoadableFileID,
} from "../../lang/parser/file_id";
import { toClipboard } from "../clipboard";
import { icons } from "../icons";
import * as tgui from "../tgui";
import { tutorial } from "../tutorial";
import { EditorCollection } from "./collection";
import { buttons, cmd_download, cmd_export, cmd_upload } from "./commands";
import {
	createCanvas,
	createIDEInterpreter,
	createTurtle,
} from "./create-interpreter";
import { FileTree, fileTreePathToProjectNameFileName } from "./file-tree";
import {
	getProjectPath,
	projectsFSP,
	setCurrentProject,
	simplifyPath,
} from "../projects-fs";
import Path from "@isomorphic-git/lightning-fs/src/path";

import { configDlg, loadConfig, parseOptions, saveConfig } from "./dialogs";
import { programinfo } from "./programinfo";
import { showdoc, showdocConfirm } from "./show-docs";
import { stackinfo } from "./stackinfo";
import { EditorController } from "./editor-controller";

///////////////////////////////////////////////////////////
// IDE for TScript development
//

export let collection!: EditorCollection;
export let editor_title: any = null;
export let panel_editor: any = null;

let messages!: HTMLElement;
let messagecontainer!: HTMLElement;
let hasErrorMessage = false;

export let stacktree: tgui.TreeControl<any> | null = null;
export let programtree: tgui.TreeControl<any> | null = null;
let programStatusLabel!: tgui.LabelControl;

let canvasContainer!: HTMLElement;
let turtleContainer!: HTMLElement;

/** current interpreter session, non-null after successful parsing */
export let interpreterSession: InterpreterSession | null = null;

let main: any = null;
let toolbar: any = null;
let iconlist: any = null;
let highlight: any = null;
export let runselector: HTMLSelectElement;

export let filetree!: FileTree;
export let tab_config: { align: "horizontal" | "vertical" } = {
	align: "horizontal",
};

/**
 * add a message to the message panel
 */
export function addMessage(
	type: "print" | "warning" | "error",
	text: string,
	filename?: FileID,
	line?: number,
	ch?: number,
	href?: string
) {
	let color = { print: "#00f", warning: "#f80", error: "#f00" };
	let tr = tgui.createElement({
		type: "tr",
		parent: messages,
		classname: "ide",
		style: { "vertical-align": "top" },
	});
	let th = tgui.createElement({
		type: "th",
		parent: tr,
		classname: "ide",
		style: { width: "20px" },
	});
	let bullet = tgui.createElement({
		type: "span",
		parent: th,
		style: { width: "20px", color: color[type] },
		html: href ? "\u2139" : "\u2022",
	});
	if (href) {
		bullet.style.cursor = "pointer";
		bullet.addEventListener("click", function (event) {
			showdoc(href);
			return false;
		});
	}
	let td = tgui.createElement({
		type: "td",
		parent: tr,
		classname: "ide",
	});
	let lines = text.split("\n");
	for (let i = 0; i < lines.length; i++) {
		let s = lines[i];
		let msg = tgui.createElement({
			type: "div",
			parent: td,
			classname:
				"ide ide-message" +
				(type !== "print" ? " ide-errormessage" : ""),
			text: s,
		});
		if (filename && line != null && isLoadableFileID(filename)) {
			msg.addEventListener("click", (event) => {
				event.preventDefault();
				collection.openEditorFromFile(filename!, {
					line: line - 1,
					character: ch,
				});
			});
		}
	}
	messagecontainer.scrollTop = messagecontainer.scrollHeight;

	if (type === "error") {
		hasErrorMessage = true;
		updateProgramState();
	}

	return { symbol: th, content: td };
}

/**
 * Stop the interpreter and clear all output,
 * put the IDE into "not yet checked" mode.
 */
export function clear() {
	interpreterSession?.destroy();
	interpreterSession = null;

	messages.replaceChildren();
	hasErrorMessage = false;

	updateProgramState({ interpreterChanged: true });
}

export type IncludeResolutionList = [StringFileID, string, StringFileID][];

/** @see createParseInput */
export type ParseInputIncludeSpecification = {
	includeResolutions: IncludeResolutionList;
	includeSourceResolutions: Map<StringFileID, string>;
	main: StringFileID;
};

async function createParseInputProject(
	projectName: string,
	entryFilename: string
): Promise<[ParseInput<ProjectFileID>, ParseInputIncludeSpecification] | null> {
	const includeResolutions: IncludeResolutionList = [];
	const includeSourceResolutions: Map<StringFileID, string> = new Map();
	const projectPath = getProjectPath(projectName);

	class ProjectParseInput implements ParseInput<ProjectFileID> {
		declare filename: ProjectFileID;
		declare source: string;

		constructor(filename: ProjectFileID, source: string) {
			this.filename = filename;
			this.source = source;
		}

		resolveIncludeToFileID(includeOperand: string) {
			return ProjectParseInput.resolveIncludeToFileID(
				this.filename,
				includeOperand
			);
		}

		resolveInclude(fileID: ProjectFileID) {
			return ProjectParseInput.getParseInput(fileID);
		}

		static async getParseInput(
			fileID: ProjectFileID
		): Promise<ParseInput<ProjectFileID> | null> {
			const projAbsPath = projectFileIDToProjAbsPath(fileID);
			const editor = collection.getEditor(fileID);
			if (editor) {
				// file is opened
				const source = editor.editorView.text();
				includeSourceResolutions.set(
					fileIDChangeNamespace(fileID, "string"),
					source
				);
				return new ProjectParseInput(fileID, source);
			}

			let readRes: string | undefined; // undefined if dir
			try {
				readRes = (await projectsFSP.readFile(
					Path.join(projectPath, projAbsPath),
					{ encoding: "utf8" }
				)) as string | undefined;
			} catch (e: any) {
				// EISDIR is not actually thrown, but it's undocumented
				if (
					e instanceof Error &&
					"code" in e &&
					(e.code === "ENOENT" || e.code === "EISDIR")
				) {
					return null;
				} else {
					throw e;
				}
			}
			if (readRes === undefined) {
				return null;
			} else {
				includeSourceResolutions.set(
					fileIDChangeNamespace(fileID, "string"),
					readRes
				);
				return new ProjectParseInput(fileID, readRes);
			}
		}

		/**
		 * @param includingFileID `null` to signal that this wasn't an actual include
		 */
		static resolveIncludeToFileID(
			includingFileID: ProjectFileID | null,
			includeOperand: string
		): ProjectFileID | null {
			const includingAbs =
				includingFileID === null
					? null
					: projectFileIDToProjAbsPath(includingFileID);
			const dirname =
				includingAbs === null ? "/" : Path.dirname(includingAbs);

			let resolved: string;
			try {
				// both functions can throw
				resolved = Path.normalize(
					Path.resolve(dirname, includeOperand)
				);
			} catch (e) {
				return null;
			}
			// simplifyPath for removing trailing "/"
			resolved = simplifyPath(resolved);
			const fileIDSuffix = `${projectName}${resolved}`;
			if (includingFileID !== null) {
				const newEntry: IncludeResolutionList[0] = [
					fileIDChangeNamespace(includingFileID, "string"),
					includeOperand,
					stringFileID(fileIDSuffix),
				];
				if (
					!includeResolutions.some((e) =>
						e.every((val, idx) => val === newEntry[idx])
					)
				) {
					// newEntry is in fact new
					includeResolutions.push(newEntry);
				}
			}
			return projectFileID(projectName, resolved);
		}
	}

	const entryStdFilename = ProjectParseInput.resolveIncludeToFileID(
		null,
		entryFilename
	);
	if (entryStdFilename === null) return null;
	const mainParseInput = await ProjectParseInput.getParseInput(
		entryStdFilename
	);
	if (mainParseInput === null) return null;
	return [
		mainParseInput,
		{
			includeResolutions,
			includeSourceResolutions,
			main: fileIDChangeNamespace(entryStdFilename, "string"),
		},
	];
}

async function createParseInputLocalStorage(
	entryFilename: string
): Promise<
	[ParseInput<LocalStorageFileID>, ParseInputIncludeSpecification] | null
> {
	const includeSourceResolutions: Map<StringFileID, string> = new Map();
	const includeResolutions: [StringFileID, string, StringFileID][] = [];

	class LStorageParseInput implements ParseInput<LocalStorageFileID> {
		declare filename: LocalStorageFileID;
		declare source: string;

		constructor(filename: LocalStorageFileID, source: string) {
			this.filename = filename;
			this.source = source;
		}

		resolveIncludeToFileID(includeOperand: string): LocalStorageFileID {
			includeResolutions.push([
				fileIDChangeNamespace(this.filename, "string"),
				includeOperand,
				stringFileID(includeOperand),
			]);
			return localstorageFileID(includeOperand);
		}

		async resolveInclude(
			fileID: LocalStorageFileID
		): Promise<ParseInput<LocalStorageFileID> | null> {
			return LStorageParseInput.getParseInput(fileID);
		}

		static getParseInput(
			fileID: LocalStorageFileID
		): ParseInput<LocalStorageFileID> | null {
			const filename = splitFileIDAtColon(fileID)[1];
			const source =
				collection.getEditor(fileID)?.editorView.text() ??
				localStorage.getItem(`tscript.code.${filename}`);
			if (source === null) return null;
			includeSourceResolutions.set(
				fileIDChangeNamespace(fileID, "string"),
				source
			);
			return new LStorageParseInput(fileID, source);
		}
	}

	const entryFileID = localstorageFileID(entryFilename);
	const mainParseInput = LStorageParseInput.getParseInput(entryFileID);
	if (mainParseInput === null) return null;
	return [
		mainParseInput,
		{
			includeSourceResolutions,
			includeResolutions,
			main: fileIDChangeNamespace(entryFileID, "string"),
		},
	];
}

/**
 * Create ParseInput from the current editors
 *
 * @returns null if the current run selection could not be resolved, otherwise
 * `[parseInput, spec]`. `parseInput` is the entry point of the program. `spec`
 * stores the content of the parsed
 * inputs, how they are included, and which one is the entry point. This is used
 * for serializing the program for creating the standalone page.
 *	- `spec.includeResolutions`: array of triples `[includingFile, includeOperand,
 *		resolvedFilename]`, meaning that that in `includingFile`, an include with
 *		operand `includeOperand` resolves to the file `resolvedFilename`.
 *	- `spec.includeSourceResolutions`: Map from resolved filenames (third entry in
 *		includeResolutions triples) to their sources
 *	- `spec.mainEntry`: main file/entry point
 *	`includeResolutions` and `includeSourceResolutions` will only be filled once
 *	`parseInput` is actually parsed. The FileIDs under `spec` have the "string"
 *	namespace, regardless of the actual namespace the original files came from.
 */
export async function createParseInput(): Promise<
	| [
			ParseInput<ProjectFileID> | ParseInput<LocalStorageFileID>,
			ParseInputIncludeSpecification
	  ]
	| null
> {
	const selection = getRunSelection();
	if (fileIDHasNamespace(selection, "project")) {
		const [_, projName, projAbsPath] = projectFileIDTripleSplit(selection);
		return createParseInputProject(projName, projAbsPath);
	} else if (fileIDHasNamespace(selection, "localstorage")) {
		return createParseInputLocalStorage(
			localStorageFileIDToFilename(selection)
		);
	} else {
		throw new Error("Not implemented");
	}
}

let pendingInterpreterSession: Promise<InterpreterSession | null> | null = null;

/**
 * Prepare everything for the program to start running,
 * put the IDE into stepping mode at the start of the program.
 * If this function is called while an earlier call to this function is still
 * ongoing, it returns the promise from the first call. Destroys current
 * interpreter.
 * @returns an {@link InterpreterSession} instance, or `null` on error.
 */
export async function prepareRun(): Promise<InterpreterSession | null> {
	return (pendingInterpreterSession ??= createInterpreterSession().finally(
		() => {
			pendingInterpreterSession = null;
		}
	));

	async function createInterpreterSession() {
		const parseInput = (await createParseInput())?.[0];
		if (!parseInput) {
			return null;
		}

		const { program, errors } = await parseProgram<any>(
			parseInput,
			parseOptions
		);

		clear();
		for (const err of errors) {
			addMessage(
				err.type,
				ErrorHelper.getLocatedErrorMsg(
					err.type,
					err.filename ?? undefined,
					err.line,
					err.message
				),
				err.filename ?? undefined,
				err.line,
				err.ch,
				err.type === "error" ? err.href : undefined
			);
		}
		if (!program) {
			return null;
		}

		interpreterSession = new InterpreterSession(
			program,
			turtleContainer,
			canvasContainer
		);

		// the IDE has an InterpreterSession now
		updateProgramState({ interpreterChanged: true });
		return interpreterSession;
	}
}

export class InterpreterSession {
	readonly interpreter: Interpreter;

	readonly #controller = new AbortController();
	readonly #canvas: HTMLCanvasElement;
	readonly #turtle: HTMLCanvasElement;

	constructor(
		program: ProgramRoot,
		turtleContainer: HTMLElement,
		canvasContainer: HTMLElement
	) {
		const interpreter = createIDEInterpreter(program);
		this.interpreter = interpreter;

		// add IDE-specific properties
		interpreter.service.print = (msg: string) => {
			if (msg.length > 1000) {
				const m = addMessage(
					"print",
					"[truncated long message; click the symbol to copy the full message to the clipboard]\n" +
						msg.substr(0, 1000) +
						" \u2026"
				);
				m.content.classList.add("ide-truncation");
				m.symbol.innerHTML = "&#x1f4cb;";
				m.symbol.style.cursor = "copy";
				m.symbol.addEventListener("click", () => {
					toClipboard(msg);
				});
			} else addMessage("print", msg);
			interpreter.flush();
		};
		interpreter.service.message = (
			msg: string,
			filename?: FileID,
			line?: number,
			ch?: number,
			href?: string
		) => {
			addMessage("error", msg, filename, line, ch, href);
		};
		interpreter.service.statechanged = () => {
			updateProgramState();
		};

		this.#turtle = createTurtle(turtleContainer, this.#controller.signal);
		turtleContainer.replaceChildren(this.#turtle);
		interpreter.service.turtle.dom = this.#turtle;

		this.#canvas = createCanvas(
			interpreter,
			canvasContainer,
			this.#controller.signal
		);
		canvasContainer.replaceChildren(this.#canvas);
		interpreter.service.canvas.dom = this.#canvas;
	}

	destroy() {
		this.#controller.abort();

		this.interpreter.stopthread();

		this.#turtle.remove();
		this.#canvas.remove();
	}
}

type ProgramStatus =
	| "unchecked"
	| "running"
	| "stepping"
	| "waiting"
	| "finished"
	| "error";

export const shouldLockEditors = (state = currentProgramState) =>
	state === "running" || state === "stepping" || state === "waiting";

const shouldShowSteppingInfo = (status: ProgramStatus) =>
	status === "stepping" || status === "error";

const shouldFocusCanvas = (status: ProgramStatus) =>
	status === "running" || status === "waiting";

function getProgramStatus(): ProgramStatus {
	const interpreter = interpreterSession?.interpreter;
	if (interpreter) {
		const status = interpreter.status;
		switch (status) {
			case "running":
				return interpreter.background ? "running" : "stepping";
			case "dialog":
				return "waiting";
			default:
				return status;
		}
	}

	return hasErrorMessage ? "error" : "unchecked";
}

const programStatusDescription: Record<ProgramStatus, string> = {
	unchecked: "program has not been checked",
	running: "program is running",
	stepping: "program is in stepping mode",
	waiting: "program is waiting",
	finished: "program has finished",
	error: "an error has ocurred",
};

let currentProgramState: ProgramStatus = "unchecked";
function updateProgramState(options?: { interpreterChanged: boolean }) {
	const previous = currentProgramState;
	const current = (currentProgramState = getProgramStatus());

	if (shouldShowSteppingInfo(current)) {
		// update stack info and program trees, relevant while stepping through the program
		stacktree!.update(stackinfo);
		programtree!.update(programinfo);

		// move the cursor to the position of the current program element
		const stack = interpreterSession?.interpreter.stack;
		if (stack && stack.length > 0) {
			const frame = stack[stack.length - 1];
			const pe = frame.pe[frame.pe.length - 1];
			if (
				pe.where &&
				pe.where.filename !== null &&
				isLoadableFileID(pe.where.filename)
			) {
				collection.openEditorFromFile(pe.where.filename, {
					line: pe.where.line - 1,
					character: pe.where.ch,
				});
			}
		}
	} else if (shouldShowSteppingInfo(previous)) {
		// empty stack info and program trees
		const emptyTree = () => ({ children: [], ids: [] });
		stacktree!.update(emptyTree);
		programtree!.update(emptyTree);
	}

	// if editors should be locked, tell them about the current interpreter
	const lockEditors = shouldLockEditors(current);
	if (
		options?.interpreterChanged ||
		lockEditors !== shouldLockEditors(previous)
	) {
		const session = lockEditors ? interpreterSession : null;
		for (const e of collection.editors) e.updateInterpreter(session);
	}

	if (previous !== current) {
		// update the program status label
		programStatusLabel.setText(programStatusDescription[current]);
		programStatusLabel.setClassName("ide-state-" + current);

		if (shouldFocusCanvas(current)) {
			// focus the canvas container for keyboard input when entering running/waiting
			if (!shouldFocusCanvas(previous)) canvasContainer.focus();
		} else if (current === "finished" || current === "unchecked") {
			// finished running the program? -> focus active editor
			collection.activeEditor?.editorView.focus();
		}
	}
}

export function create(container: HTMLElement, options?: any) {
	let config = loadConfig();

	if (!options)
		options = { "export-button": true, "documentation-button": true };

	tgui.releaseAllHotkeys();

	// create HTML elements of the GUI
	main = tgui.createElement({
		type: "div",
		parent: container,
		classname: "ide ide-main",
	});
	tgui.setHotkeyElement(main);

	toolbar = tgui.createElement({
		type: "div",
		parent: main,
		classname: "ide ide-toolbar",
	});

	buttons.push({
		click: cmd_upload,
		icon: icons.uploadDocument,
		tooltip: "Upload document",
		hotkey: null,
		group: "export",
	});
	buttons.push({
		click: cmd_download,
		icon: icons.downloadDocument,
		tooltip: "Download document",
		hotkey: null,
		group: "export",
	});

	// add the export button on demand
	if (options["export-button"]) {
		buttons.push({
			click: cmd_export,
			icon: icons.export,
			tooltip: "Export program as webpage",
			group: "export",
		});
	}

	buttons.push({
		click: function () {
			configDlg();
			return false;
		},
		icon: icons.config,
		tooltip: "Configuration",
		hotkey: "control-p",
		group: "config",
	});

	// prepare toolbar
	let curgroup: string = buttons[0].group;
	for (let i = 0; i < buttons.length; i++) {
		let description = Object.assign({}, buttons[i]);

		if (description.group !== curgroup) {
			tgui.createElement({
				type: "div",
				parent: toolbar,
				classname: "tgui tgui-control tgui-toolbar-separator",
			});
			curgroup = description.group;
		}

		description.style = { float: "left", height: "22px" };
		if (description.hotkey)
			description.tooltip += " (" + description.hotkey + ")";
		description.parent = toolbar;
		buttons[i].control = tgui.createButton(description);

		// Insert run-selector right after "run" button
		if (i === 4) {
			runselector = tgui.createElement({
				type: "select",
				parent: toolbar,
				classname: "tgui tgui-control",
				style: {
					float: "left",
					"min-width": "100px",
					height: "22px",
					"padding-left": "4px",
				},
			});
		}
	}

	tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui tgui-control tgui-toolbar-separator",
	});

	programStatusLabel = tgui.createLabel({
		parent: toolbar,
		text: programStatusDescription[currentProgramState],
		className: "ide-state-" + currentProgramState,
		style: {
			float: "left",
			width: "calc(min(250px, max(20px, 50vw - 270px)))",
			height: "22px",
			// clipping
			"white-space": "nowrap",
			overflow: "hidden",
			direction: "rtl",
			"text-overflow": "ellipsis clip",

			"text-align": "center",
		},
	});
	// TODO set tooltip text to the content text, this should apply when the statusbox is too narrow

	tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui tgui-control tgui-toolbar-separator",
	});

	tgui.createButton({
		click: function () {
			for (let i = 0; i < tgui.panels.length; i++) {
				let p = tgui.panels[i];
				if (p.name === "editor" || p.name === "messages")
					p.dock("left");
				else p.dock("right");
			}
			tgui.savePanelData();
			return false;
		},
		width: 20,
		height: 20,
		icon: icons.restorePanels,
		parent: toolbar,
		style: { float: "left" },
		tooltip: "Restore panels",
	});

	tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui tgui-control tgui-toolbar-separator",
	});

	iconlist = tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui",
		style: {
			float: "left",
			width: "fit-content",
			height: "100%",
			border: "none",
			margin: "3px",
		},
	});

	tgui.createElement({
		type: "div",
		parent: toolbar,
		classname: "tgui tgui-control tgui-toolbar-separator",
	});

	if (options["documentation-button"]) {
		tgui.createButton({
			click: () => showdoc(""),
			text: "Documentation",
			parent: toolbar,
			style: { position: "absolute", height: "22px", right: "0px" },
		});

		// pressing F1
		tgui.setHotkey("F1", function () {
			const ed = collection.activeEditor?.editorView;
			if (!ed) return;

			let selection = ed.selection();
			if (!selection) {
				ed.selectWordAtCursor();
				selection = ed.selection();
			}
			if (!selection) return;

			// maximum limit of 30 characters
			// so that there is no problem, when accidentally everything
			// in a file is selected
			selection = selection.slice(0, 30);
			const words = selection.match(/[a-z]+/gi); // global case insensitive
			showdocConfirm(undefined, words?.join(" "));
		});
	}

	// area containing all panels
	let area = tgui.createElement({
		type: "div",
		parent: main,
		classname: "ide ide-panel-area",
	});

	// prepare tgui panels
	tgui.preparePanels(area, iconlist);

	panel_editor = tgui.createPanel({
		name: "tab_editor",
		title: "Editor",
		state: "left",
		fallbackState: "icon",
		icon: icons.editor,
	});
	panel_editor.content.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		return false;
	});

	if (config && config.hasOwnProperty("tabs")) {
		for (let key in config.tabs) tab_config[key] = config.tabs[key];
	}
	let p = tgui.createElement({
		type: "div",
		parent: panel_editor.content,
		classname: "tabs-container " + tab_config.align,
	});
	const editortabs = tgui.createElement({
		type: "div",
		parent: p,
		classname: "tabs",
	});
	let s = tgui.createElement({
		type: "div",
		parent: editortabs,
		classname: "switch",
		text: "\u21CC",
		click: function (event) {
			p.classList.toggle("horizontal");
			p.classList.toggle("vertical");
			tab_config.align =
				tab_config.align === "horizontal" ? "vertical" : "horizontal";
			saveConfig();
		},
	});
	const editorcontainer = tgui.createElement({
		type: "div",
		parent: p,
		classname: "editorcontainer",
	});

	let configSaveScheduled = false;
	function scheduleEditorStateSave() {
		// save the config after a short delay
		// used to batch multiple changes into a single write to localStorage
		if (!configSaveScheduled) {
			configSaveScheduled = true;
			setTimeout(() => {
				configSaveScheduled = false;
				saveConfig();
			}, 500);
		}
	}
	collection = new EditorCollection(
		editorcontainer,
		editortabs,
		runselector,
		scheduleEditorStateSave
	);
	collection
		.restoreState({
			open: config?.open ?? [],
			active: config?.active ?? null,
		})
		.then(async () => {
			if (config && config.hasOwnProperty("main")) {
				runselector.value = config.main;
			}
			if (!collection.activeEditor) {
				const fileID = localstorageFileID("Main");
				if (
					!(
						(await collection.openEditorFromFile(fileID)) instanceof
						EditorController
					)
				)
					collection.openEditorFromData(fileID, "");
			}
		});

	let panel_messages = tgui.createPanel({
		name: "messages",
		title: "Messages",
		state: "left",
		dockedheight: 200,
		icon: icons.messages,
	});
	messagecontainer = tgui.createElement({
		type: "div",
		parent: panel_messages.content,
		classname: "ide ide-messages",
	});
	messages = tgui.createElement({
		type: "table",
		parent: messagecontainer,
		classname: "ide",
		style: { width: "100%" },
	});

	// prepare stack tree control
	let panel_stackview = tgui.createPanel({
		name: "stack",
		title: "Stack",
		state: "icon",
		fallbackState: "right",
		icon: icons.stackView,
	});
	stacktree = new tgui.TreeControl<any>({
		parent: panel_stackview.content,
	});

	// prepare program tree control
	let panel_programview = tgui.createPanel({
		name: "program",
		title: "Program",
		state: "icon",
		fallbackState: "right",
		icon: icons.programView,
	});

	programtree = new tgui.TreeControl<any>({
		parent: panel_programview.content,
		nodeclick: async function (event, value, id) {
			if (value.where) {
				await collection.openEditorFromFile(value.where.filename, {
					line: value.where.line - 1,
					character: value.where.ch,
				});
			}
		},
	});

	// prepare turtle output panel
	let panel_turtle = tgui.createPanel({
		name: "turtle",
		title: "Turtle",
		state: "right",
		fallbackState: "float",
		icon: icons.turtle,
	});
	turtleContainer = panel_turtle.content;
	turtleContainer.style.alignContent = "center";
	turtleContainer.style.textAlign = "center";

	// prepare canvas output panel
	let panel_canvas = tgui.createPanel({
		name: "canvas",
		title: "Canvas",
		state: "icon",
		fallbackState: "right",
		icon: icons.canvas,
	});
	panel_canvas.content.tabIndex = -1;
	panel_canvas.size = [0, 0];
	canvasContainer = panel_canvas.content;

	let panel_tutorial = tgui.createPanel({
		name: "tutorial",
		title: "Tutorial",
		state: "icon",
		fallbackState: "right",
		dockedheight: 400,
		icon: icons.tutorial,
	});
	let tutorial_container = tgui.createElement({
		type: "div",
		parent: panel_tutorial.content,
		classname: "ide ide-tutorial",
	});
	tutorial.init(
		tutorial_container,
		() => collection.activeEditor?.editorView.text() ?? "",
		function () {
			messages.innerHTML = "";
		},
		function (error) {
			addMessage("error", error);
		}
	);

	setCurrentProject(config?.currentProject ?? undefined);
	(filetree = new FileTree()).init();

	tgui.arrangePanels();
	window["TScriptIDE"] = { tgui: tgui, ide: module };
}

/**
 * Returns the current filename, selected in the run-selector
 */
export function getRunSelection(): FileID {
	return runselector.value as FileID;
}
