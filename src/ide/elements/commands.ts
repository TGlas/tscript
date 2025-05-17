import * as ide from ".";
import { ParseInput, parseProgram } from "../../lang/parser";
import { icons } from "../icons";
import * as tgui from "./../tgui";
import {
	createFileDlgFileView,
	loadFileProjDlg,
	fileDlgSize,
	parseOptions,
} from "./dialogs";
import {
	closeEditor,
	createEditorTabByModal,
	openEditorFromLocalStorage,
} from "./editor-tabs";
import { showdoc, showdocConfirm } from "./show-docs";
import { interpreterEnded, updateControls } from "./utils";

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

async function cmd_reset() {
	ide.clear();
	await updateControls();
}

/**
 * Gets the active interpreter session or creates a new one if no program is running
 */
function getOrRestartSession() {
	let session = ide.interpreterSession;
	if (!session || interpreterEnded(session.interpreter)) {
		// (re-)start the interpreter
		session = ide.prepareRun();
	}

	return session;
}

function cmd_run() {
	getOrRestartSession()?.interpreter.run();
}

function cmd_interrupt() {
	const interpreter = ide.interpreterSession?.interpreter;
	if (interpreter && !interpreterEnded(interpreter)) interpreter.interrupt();
}

function cmd_step_into() {
	getOrRestartSession()?.interpreter.step_into();
}

function cmd_step_over() {
	getOrRestartSession()?.interpreter.step_over();
}

function cmd_step_out() {
	getOrRestartSession()?.interpreter.step_out();
}

export function cmd_export() {
	// don't interrupt a running program
	if (ide.interpreter) {
		if (
			ide.interpreter.status === "running" ||
			ide.interpreter.status === "waiting" ||
			ide.interpreter.status === "dialog"
		)
			return;
	}

	const parsedFiles = new Map<string, ParseInput>();
	const parseInput = ide.createParseInput(parsedFiles);
	if (!parseInput) return;

	ide.clear();

	// check that the code at least compiles
	let result = parseProgram(parseInput, parseOptions);
	let program = result.program;
	let errors = result.errors;
	if (errors && errors.length > 0) {
		for (let i = 0; i < errors.length; i++) {
			let err = errors[i];
			ide.addMessage(
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
		return;
	}
	if (!program) {
		alert("internal error during export");
		return;
	}

	// create a filename for the file download from the title
	let title = parseInput.filename;
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

	// escape the TScript source code; prepare it to reside inside an html document
	let source = JSON.stringify({
		documents: Object.fromEntries(
			Array.from(parsedFiles.values(), (f) => [f.filename, f.source])
		),
		main: parseInput.filename,
	});

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
	let ed = ide.collection.getActiveEditor();
	if (!ed) return;

	let line = ed.getCursorPosition().row;
	ed.properties().toggleBreakpoint(line);
}

function cmd_new() {
	createEditorTabByModal();
}

function cmd_load() {
	loadFileProjDlg();
}

function cmd_save() {
	const ed = ide.collection.getActiveEditor();
	if (!ed) return;
	let name = ed.properties().name;

	localStorage.setItem("tscript.code." + name, ed.text());
	ed.setClean();
}

function cmd_save_as() {
	const ed = ide.collection.getActiveEditor();
	if (!ed) return;

	const filename = ed.properties.name;
	const fileView = createFileDlgFileView(
		filename,
		true,
		function (filename) {
			closeEditor(filename);
			localStorage.setItem("tscript.code." + filename, ed.text());
			openEditorFromLocalStorage(filename);
		},
		{
			switchView: null,
			clickConfirmation: () => dlg.pressButton(confirmationButton),
		}
	);
	const confirmationButton = {
		text: "Save",
		isDefault: true,
		onClick: () => fileView.onClickConfirmation(),
	};
	let dlg = tgui.createModal({
		title: "Save file as ...",
		minsize: [...fileDlgSize.minsize],
		scalesize: [...fileDlgSize.scalesize],
		buttons: [confirmationButton, { text: "Cancel" }],
		enterConfirms: true,
	});

	tgui.startModal(dlg);
	dlg.content.replaceChildren(fileView.element);
	return dlg;
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
					let filename = file.name.split(".tscript")[0];
					let content = await file.text();
					if (!content) continue;
					localStorage.setItem("tscript.code." + filename, content); // write or overwrite
					let ed = ide.collection.getEditor(filename);
					if (ed) {
						ide.collection.setActiveEditor(ed);
						ed.setText(content);
						ed.focus();
					} else {
						openEditorFromLocalStorage(filename);
					}
					await updateControls();
				}
			},
		},
	});
	dom_file.click();
	dom_file.remove();
}

export function cmd_download() {
	const ed = ide.collection.getActiveEditor();
	if (!ed) return;
	let filename = ed.properties().name;
	let content = ed.text();

	let link = tgui.createElement({
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
