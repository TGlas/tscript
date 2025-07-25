import * as ide from ".";
import { parseProgram } from "../../lang/parser";
import { type StandaloneCode } from "../standalone";
import { ErrorHelper } from "../../lang/errors/ErrorHelper";
import {
	fileIDToContextDependentFilename,
	localstorageFileID,
} from "../../lang/parser/file_id";
import { icons } from "../icons";
import * as tgui from "./../tgui";
import {
	confirmFileOverwrite,
	loadFileProjDlg,
	parseOptions,
	saveAsDialog,
	tabNameDlg,
	gitDlg,
} from "./dialogs";
import { showdoc, showdocConfirm } from "./show-docs";
import { cleanupExternalFilename, importData, interpreterEnded } from "./utils";

/**
 * click may be async
 */
export let buttons: any = [
	{
		click: cmd_new,
		icon: icons.newDocument,
		tooltip: "New document",
		hotkey: "shift-control-n",
		group: "file",
	},
	{
		click: cmd_load,
		icon: icons.openDocument,
		tooltip: "Open document",
		hotkey: "control-o",
		group: "file",
	},
	{
		click: cmd_save,
		icon: icons.saveDocument,
		tooltip: "Save document",
		hotkey: "control-s",
		group: "file",
	},
	{
		click: cmd_save_as,
		icon: icons.saveDocumentAs,
		tooltip: "Save document as ...",
		hotkey: "shift-control-s",
		group: "file",
	},
	{
		click: cmd_git,
		icon: icons.git,
		tooltip: "GIT",
		hotkey: "shift-control-g",
		group: "file",
	},
	{
		click: cmd_run,
		icon: icons.run,
		tooltip: "Run/continue program",
		hotkey: "F7",
		group: "execution",
	},
	{
		click: cmd_interrupt,
		icon: icons.interrupt,
		tooltip: "Interrupt program",
		hotkey: "shift-F7",
		group: "execution",
	},
	{
		click: cmd_reset,
		icon: icons.reset,
		tooltip: "Abort program",
		hotkey: "F10",
		group: "execution",
	},
	{
		click: cmd_step_into,
		icon: icons.stepInto,
		tooltip: "Run current command, step into function calls",
		hotkey: "shift-control-F11",
		group: "debug",
	},
	{
		click: cmd_step_over,
		icon: icons.stepOver,
		tooltip: "Run current line of code, do no step into function calls",
		hotkey: "control-F11",
		group: "debug",
	},
	{
		click: cmd_step_out,
		icon: icons.stepOut,
		tooltip: "Step out of current function",
		hotkey: "shift-F11",
		group: "debug",
	},
	{
		click: cmd_toggle_breakpoint,
		icon: icons.breakPoint,
		tooltip: "Toggle breakpoint",
		hotkey: "F8",
		group: "debug",
	},
];

function cmd_reset() {
	ide.clear();
}

/**
 * Gets the active interpreter session or creates a new one if no program is running
 */
async function getOrRestartSession(): Promise<ide.InterpreterSession | null> {
	let session = ide.interpreterSession;
	if (session && !interpreterEnded(session.interpreter)) {
		return session;
	} else {
		// (re-)start the interpreter
		return await ide.prepareRun();
	}
}

async function cmd_run() {
	(await getOrRestartSession())?.interpreter.run();
}

function cmd_git() {
	gitDlg();
}

function cmd_interrupt() {
	const interpreter = ide.interpreterSession?.interpreter;
	if (interpreter && !interpreterEnded(interpreter)) interpreter.interrupt();
}

async function cmd_step_into() {
	(await getOrRestartSession())?.interpreter.step_into();
}

async function cmd_step_over() {
	(await getOrRestartSession())?.interpreter.step_over();
}

async function cmd_step_out() {
	(await getOrRestartSession())?.interpreter.step_out();
}

export async function cmd_export() {
	const resolveEntryRes = await ide.createParseInput();
	if (!resolveEntryRes) return;
	const [mainEntry, includeResolutions] = resolveEntryRes;

	// check that the code at least compiles
	let result = await parseProgram<any>(mainEntry, parseOptions);

	// everything after that should ideally be synchronous
	ide.clear();

	let program = result.program;
	let errors = result.errors;
	if (errors && errors.length > 0) {
		for (let i = 0; i < errors.length; i++) {
			let err = errors[i];
			ide.addMessage(
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
		return;
	}
	if (!program) {
		alert("internal error during export");
		return;
	}

	// create a filename for the file download from the title
	const humandReadableFilename = fileIDToContextDependentFilename(
		mainEntry.filename
	);
	let title = humandReadableFilename;
	let fn = "tscript-export";
	if (
		!fn.endsWith("html") &&
		!fn.endsWith("HTML") &&
		!fn.endsWith("htm") &&
		!fn.endsWith("HTM")
	)
		fn += ".html";

	let dlg = tgui.createModal({
		title: "Export program as webpage",
		scalesize: [0.5, 0.5],
		minsize: [400, 260],
		onHelp: (initiatedByKey) =>
			(initiatedByKey ? showdocConfirm : showdoc)("#/ide/exportdialog"),
		buttons: [{ text: "Close" }],
	});

	let status = tgui.createElement({
		parent: dlg.content,
		type: "div",
		text: "status: preparing ...",
		classname: "ide-export-status",
		style: { top: "20px" },
	});
	let download_turtle = tgui.createElement({
		parent: dlg.content,
		type: "a",
		properties: { target: "_blank", download: fn },
		text: "download standalone turtle application",
		classname: "ide-export-download",
		style: { top: "80px" },
	});
	let download_canvas = tgui.createElement({
		parent: dlg.content,
		type: "a",
		properties: { target: "_blank", download: fn },
		text: "download standalone canvas application",
		classname: "ide-export-download",
		style: { top: "140px" },
	});

	tgui.startModal(dlg);

	const standaloneCode: StandaloneCode = {
		includeSourceResolutions: Object.fromEntries(
			includeResolutions.includeSourceResolutions.entries()
		),
		includeResolutions: includeResolutions.includeResolutions,
		main: includeResolutions.main,
	};
	// escape the TScript source code; prepare it to reside inside an html document
	let source = JSON.stringify(standaloneCode);

	// obtain the page itself as a string
	{
		let defer = "defer"; // avoid search key below as string literal
		let xhr = new XMLHttpRequest();
		xhr.open("GET", window.location.href, true);
		xhr.overrideMimeType("text/html");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				// hide the IDE and let canvas or turtle run in full screen
				let page = xhr.responseText;
				page = page.replace(
					"<title>TScript IDE</title>",
					"<title>" + title + "</title>"
				);
				if (page.includes("<script " + defer + ' src="main.js">')) {
					console.log(page);
					alert(
						"It seems that the TScript IDE is running in development mode. Expect the exported website to be broken."
					);
				}

				let headEnd = page.indexOf("<head>") + "<head>".length;
				let header = page.substr(0, headEnd);
				let footer = page.substr(headEnd);

				let scriptOpen =
					"window.TScript = {}; window.TScript.code = " +
					source +
					"; " +
					"window.TScript.mode = ";
				let scriptClose =
					"; window.TScript.name = " + JSON.stringify(title) + ";\n";

				let genCode = function genCode(mode) {
					let s = document.createElement("script");
					s.innerHTML =
						scriptOpen + JSON.stringify(mode) + scriptClose;
					let script = s.outerHTML;

					let blob = new Blob([header + script + footer], {
						type: "text/html",
					});

					return URL.createObjectURL(blob); //"data:text/html," + encodeURIComponent(header + script + footer);
				};

				status.innerHTML = "status: ready for download";
				download_turtle.href = genCode("turtle");
				download_turtle.style.display = "block";
				download_turtle.download = title + ".html";
				download_canvas.href = genCode("canvas");
				download_canvas.style.display = "block";
				download_canvas.download = title + ".html";
			}
		};
		xhr.send();
	}
}

function cmd_toggle_breakpoint() {
	const controller = ide.collection.activeEditor;
	if (!controller) return;

	const line = controller.editorView.getCursorPosition().row;
	controller.toggleBreakpoint(line);
}

function cmd_new() {
	tabNameDlg((name) => {
		// Don't accept empty filenames
		if (!name) return true; // keep dialog open

		const isSavedDoc =
			localStorage.getItem("tscript.code." + name) !== null;

		const fileID = localstorageFileID(name);
		if (isSavedDoc || ide.collection.getEditor(fileID)) {
			confirmFileOverwrite(name, () => {
				// replace the existing file/editor
				ide.collection.openEditorFromData(fileID, "");
			});
		} else {
			ide.collection.openEditorFromData(fileID, "");
		}

		return false;
	});
}

function cmd_load() {
	loadFileProjDlg();
}

function cmd_save() {
	ide.collection.activeEditor?.save();
}

function cmd_save_as() {
	const controller = ide.collection.activeEditor;
	if (!controller) return;

	const filename = fileIDToContextDependentFilename(controller.filename);
	return saveAsDialog(
		filename,
		(filename) => void controller.saveAs(localstorageFileID(filename))
	);
}

export function cmd_upload() {
	let dom_file = tgui.createElement({
		type: "input",
		parent: document.body,
		properties: { type: "file", multiple: "multiple" },
		events: {
			change: async (event) => {
				event.preventDefault();
				if (!dom_file.files) return;
				for (let i = 0; i < dom_file.files.length; i++) {
					let file = dom_file.files[i];
					let content = await file.text();
					if (content)
						importData(content, cleanupExternalFilename(file.name));
				}
			},
		},
	});
	dom_file.click();
	dom_file.remove();
}

export function cmd_download() {
	const controller = ide.collection.activeEditor;
	if (!controller) return;
	const filename = fileIDToContextDependentFilename(controller.filename);
	const content = controller.editorView.text();

	const link = tgui.createElement({
		type: "a",
		parent: document.body,
		properties: {
			href:
				"data:text/plain;charset=utf-8," + encodeURIComponent(content),
			download: filename + ".tscript",
		},
	});
	link.click();
	link.remove();
}
