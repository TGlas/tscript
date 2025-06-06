import { Interpreter } from "../../lang/interpreter/interpreter";
import { ProgramRoot } from "../../lang/interpreter/program-elements";
import {
	ParseInput,
	parseProgram,
	FileID,
	ProjectFileID,
	projectFileIDToProjAbsPath,
	LocalStorageFileID,
	StringFileID,
	fileIDChangeNamespace,
	splitFileIDAtColon,
	fileIDHasNamespace,
	LoadableFileID,
	localStorageFileIDToFilename,
	projectFileIDTripleSplit,
	localstorageFileID,
	projectFileID,
	stringFileID,
} from "../../lang/parser";
import { toClipboard } from "../clipboard";
import { icons } from "../icons";
import * as tgui from "../tgui";
import { tutorial } from "../tutorial";
import { buttons, cmd_upload, cmd_download, cmd_export } from "./commands";
import { configDlg, loadConfig, saveConfig, parseOptions } from "./dialogs";
import { showdoc, showdocConfirm } from "./show-docs";
import * as utils from "./utils";
import { EditorCollection } from "./collection";
import {
	tab_config,
	createEditorTab,
	openEditorFromLocalStorage,
	openEditorFromStorage,
} from "./editor-tabs";
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

export { createEditorTab };

///////////////////////////////////////////////////////////
// IDE for TScript development
//

export let collection!: EditorCollection;
export let editor_title: any = null;
export let panel_editor: any = null;
export let editorcontainer: any = null;
export let editortabs: any = null;

export let messages: any = null;
let messagecontainer: any = null;

export let stacktree: tgui.TreeControl<any> | null = null;
export let programtree: tgui.TreeControl<any> | null = null;
export let programstate: any = null;

let canvasContainer!: HTMLElement;
let turtleContainer!: HTMLElement;

/**
 * current interpreter, non-null after successful parsing.
 * Only for convenience, always equals `interpreterSession.interpreter`
 */
export let interpreter: Interpreter | null = null;
export let interpreterSession: InterpreterSession | null = null;

let main: any = null;
let toolbar: any = null;
let iconlist: any = null;
let highlight: any = null;
export let runselector: HTMLSelectElement;

export let filetree!: FileTree;

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
		}) as any;
		if (typeof line !== "undefined") {
			msg.ide_filename = filename;
			msg.ide_line = line;
			msg.ide_ch = ch;
			msg.addEventListener("click", function (event) {
				utils.setCursorPosition(
					event.target.ide_line,
					event.target.ide_ch,
					filename!
				);
				if (
					interpreter &&
					(interpreter.status != "running" || !interpreter.background)
				) {
					utils.updateControls();
				}
				return false;
			});
		}
	}
	messagecontainer.scrollTop = messagecontainer.scrollHeight;
	return { symbol: th, content: td };
}

/**
 * Stop the interpreter and clear all output,
 * put the IDE into "not yet checked" mode.
 */
export function clear() {
	interpreterSession?.destroy();
	interpreterSession = null;
	interpreter = null;

	tgui.clearElement(messages);
}

export type IncludeResolutionList = [StringFileID, string, StringFileID][];

/** @see createParseInput */
export type ParseInputIncludeSpecification = {
	includeResolutions: IncludeResolutionList;
	includeSourceResolutions: Map<StringFileID, string>;
};

async function createParseInputProject(
	projectName: string,
	entryFilename: string
): Promise<
	[ParseInput<ProjectFileID, true>, ParseInputIncludeSpecification] | null
> {
	const includeResolutions: IncludeResolutionList = [];
	const includeSourceResolutions: Map<StringFileID, string> = new Map();
	const projectPath = getProjectPath(projectName);

	/**
	 * @param includingFileID `null` to signal that this wasn't an actual include
	 */
	const resolveIncludeToFileID = (
		includingFileID: ProjectFileID | null,
		includeOperand: string
	): ProjectFileID | null => {
		const includingAbs =
			includingFileID === null
				? null
				: projectFileIDToProjAbsPath(includingFileID);
		const dirname =
			includingAbs === null ? "/" : Path.dirname(includingAbs);

		let resolved: string;
		try {
			// both functions can throw
			resolved = Path.normalize(Path.resolve(dirname, includeOperand));
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
	};

	const resolveInclude = async (
		fileID: ProjectFileID
	): Promise<ParseInput<ProjectFileID, true> | null> => {
		const projAbsPath = projectFileIDToProjAbsPath(fileID);
		const editor = collection.getEditor(fileID);
		if (editor) {
			// file is opened
			const source = editor.text();
			includeSourceResolutions.set(
				fileIDChangeNamespace(fileID, "string"),
				source
			);
			return {
				source,
				filename: fileID,
				resolveIncludeToFileID,
				resolveInclude,
			};
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
			return {
				source: readRes,
				filename: fileID,
				resolveInclude,
				resolveIncludeToFileID,
			};
		}
	};

	const entryStdFilename = resolveIncludeToFileID(null, entryFilename);
	if (entryStdFilename === null) return null;
	const mainParseInput = await resolveInclude(entryStdFilename);
	if (mainParseInput === null) return null;
	return [
		mainParseInput,
		{
			includeResolutions,
			includeSourceResolutions,
		},
	];
}

function createParseInputLocalStorage(
	entryFilename: string
): [ParseInput<LocalStorageFileID>, ParseInputIncludeSpecification] | null {
	const includeSourceResolutions: Map<StringFileID, string> = new Map();
	const includeResolutions: [StringFileID, string, StringFileID][] = [];

	const resolveIncludeToFileID = (
		includingFile: LocalStorageFileID,
		includeOperand: string
	): LocalStorageFileID => {
		includeResolutions.push([
			fileIDChangeNamespace(includingFile, "string"),
			includeOperand,
			stringFileID(includeOperand),
		]);
		return localstorageFileID(includeOperand);
	};
	const resolveInclude = (
		fileID: LocalStorageFileID
	): ParseInput<LocalStorageFileID, true> | null => {
		const filename = splitFileIDAtColon(fileID)[1];
		const source =
			collection.getEditor(fileID)?.text() ??
			localStorage.getItem(`tscript.code.${filename}`);
		if (source === null) return null;
		includeSourceResolutions.set(
			fileIDChangeNamespace(fileID, "string"),
			source
		);
		return {
			source,
			filename: fileID,
			resolveInclude,
			resolveIncludeToFileID,
		};
	};

	const mainParseInput = resolveInclude(localstorageFileID(entryFilename));
	if (mainParseInput === null) return null;
	return [mainParseInput, { includeSourceResolutions, includeResolutions }];
}

/**
 * Create ParseInput from the current editors
 *
 * @returns `[parseInput, spec]`, where
 *	- `spec.includeResolutions`: array of triples `[includingFile, includeOperand,
 *		resolvedFilename]`, meaning that that in `includingFile`, an include with
 *		operand `includeOperand` resolves to the file `resolvedFilename`.
 *	- `spec.includeSourceResolutions`: Map from resolved filenames (third entry in
 *		includeResolutions triples) to their sources
 *	or null if the current run selection could not be resolved.
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

/**
 * Prepare everything for the program to start running,
 * put the IDE into stepping mode at the start of the program.
 * @returns An {@link InterpreterSession} or `null` on error
 */
export async function prepareRun(): Promise<InterpreterSession | null> {
	const parseInput = (await createParseInput())?.[0];
	if (!parseInput) {
		return null;
	}

	const { program, errors } = await parseProgram(
		parseInput,
		true,
		parseOptions
	);

	// everything after that should ideally be synchronous
	clear();
	for (const err of errors) {
		addMessage(
			err.type,
			err.type +
				(err.filename ? " in file '" + err.filename + "'" : "") +
				" in line " +
				err.line +
				": " +
				err.message,
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
	interpreter = interpreterSession.interpreter;

	for (let ed of collection.getEditors()) {
		// set and correct breakpoints
		let br = ed.properties().breakpoints;
		let a = new Array<number>();
		for (let line of br) a.push(line + 1);

		let result = interpreter.defineBreakpoints(a, ed.properties().name);
		if (result !== null) {
			for (let line of br)
				if (!result.has(line)) ed.properties().toggleBreakpoint(line);
			for (let line of result)
				if (!br.has(line)) ed.properties().toggleBreakpoint(line);
		}
	}

	return interpreterSession;
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
		interpreter.service.statechanged = (stop: boolean) => {
			if (stop) utils.updateControls();
			else utils.updateStatus();
			if (interpreter.status === "finished") {
				let ed = collection.getActiveEditor();
				if (ed) ed.focus();
			}
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

	run() {
		// Start background execution and focus the canvas container for keyboard input
		this.interpreter.run();
		this.#canvas.parentElement!.focus();
	}

	destroy() {
		this.#controller.abort();

		this.interpreter.stopthread();

		this.#turtle.remove();
		this.#canvas.remove();
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

	programstate = tgui.createLabel({
		parent: toolbar,
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

	programstate.setStateCss = function (state) {
		let cls = `ide-state-${state}`;
		if (this.hasOwnProperty("state_css_class"))
			this.dom.classList.replace(this.state_css_class, cls);
		else this.dom.classList.add(cls);
		this.state_css_class = cls;
		return this;
	};
	// TODO set tooltip text to the content text, this should apply when the statusbox is too narrow
	programstate.unchecked = function () {
		this.setText("program has not been checked").setStateCss("unchecked");
	};
	programstate.error = function () {
		this.setText("an error has occurred").setStateCss("error");
	};
	programstate.running = function () {
		this.setText("program is running").setStateCss("running");
	};
	programstate.waiting = function () {
		this.setText("program is waiting").setStateCss("waiting");
	};
	programstate.stepping = function () {
		this.setText("program is in stepping mode").setStateCss("stepping");
	};
	programstate.finished = function () {
		this.setText("program has finished").setStateCss("finished");
	};
	programstate.unchecked();

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
			const ed = collection.getActiveEditor();
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

	collection = new EditorCollection();

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
	editortabs = tgui.createElement({
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
	editorcontainer = tgui.createElement({
		type: "div",
		parent: p,
		classname: "editorcontainer",
	});

	(async () => {
		if (config && config.hasOwnProperty("open")) {
			for (let filename of config.open) {
				await openEditorFromStorage(filename, false);
			}
		}
		if (
			config &&
			config.hasOwnProperty("active") &&
			config.active !== undefined
		) {
			let ed = collection.getEditor(config.active);
			if (ed) collection.setActiveEditor(ed, false);
		}
		if (config && config.hasOwnProperty("main")) {
			runselector.value = config.main;
		}
		if (collection.getEditors().size === 0) {
			const ed = openEditorFromLocalStorage("Main");
			if (!ed) createEditorTab(localstorageFileID("Main"));
		}
	})();

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
		nodeclick: function (event, value, id) {
			if (value.where) {
				utils.setCursorPosition(
					value.where.line,
					value.where.ch,
					value.where.filename
				);
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
		function () {
			let ed = collection.getActiveEditor();
			return ed ? ed.text() : "";
		},
		function () {
			messages.innerHTML = "";
		},
		function (error) {
			addMessage("error", error);
		}
	);

	filetree = new FileTree();
	// for testing
	(async () => {
		await filetree.addSampleContent();
		await filetree.init();
		await setCurrentProject("tmp");
	})();

	tgui.arrangePanels();
	window["TScriptIDE"] = { tgui: tgui, ide: module };
}

/**
 * Returns the current filename, selected in the run-selector
 */
export function getRunSelection(): FileID {
	return runselector.value as FileID;
}
