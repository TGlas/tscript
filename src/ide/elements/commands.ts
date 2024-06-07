import * as ide from ".";
import { Parser } from "../../lang/parser";
import { icons } from "../icons";
import * as tgui from "./../tgui";
import { fileDlg, options } from "./dialogs";
import {
	closeEditor,
	createEditorTabByModal,
	openEditorFromLocalStorage,
} from "./editor-tabs";
import { showdoc, showdocConfirm } from "./show-docs";
import { updateControls } from "./utils";

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
	/*{
		click: function() { module.sourcecode.execCommand("findPersistent"); },
		icon: icons.search,
		tooltip: "Search",
		group: "edit",
	},*/
];

function cmd_reset() {
	ide.clear();
	updateControls();
}

function cmd_run() {
	if (isInterpreterBusy()) ide.prepare_run();
	if (!ide.interpreter) return;
	ide.interpreter.run();
	ide.canvas.parentElement.focus();
}

function cmd_interrupt() {
	if (isInterpreterBusy()) return;
	ide.interpreter!.interrupt();
}

function cmd_step_into() {
	if (isInterpreterBusy()) ide.prepare_run();
	if (!ide.interpreter) return;
	if ((ide.interpreter as any).running) return;
	ide.interpreter.step_into();
}

function cmd_step_over() {
	if (isInterpreterBusy()) ide.prepare_run();
	if (!ide.interpreter) return;
	if ((ide.interpreter as any).running) return;
	ide.interpreter.step_over();
}

function cmd_step_out() {
	if (isInterpreterBusy()) ide.prepare_run();
	if (!ide.interpreter) return;
	if ((ide.interpreter as any).running) return;
	ide.interpreter.step_out();
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

	if (!ide.collection.getCurrentEditor()) return;

	// check that the code at least compiles
	let source = ide.collection.getCurrentEditor()!.text();
	ide.clear();

	const toParse = {
		documents: ide.collection.getValues(),
		main: ide.getRunSelection(),
	};

	let result = Parser.parse(toParse, options);
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
				err.filename,
				err.line,
				err.ch,
				err.href
			);
		}
		return;
	}
	if (!program) {
		alert("internal error during export");
		return;
	}

	// create a filename for the file download from the title
	let title = ide.getRunSelection();
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

	// escape the TScript source code; prepare it to reside inside a single-quoted string
	source = escape(source);

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
					'window.TScript = {}; window.TScript.code = unescape("' +
					source +
					'"); ' +
					"window.TScript.mode = ";
				let scriptClose =
					';window.TScript.name = unescape("' + escape(title) + '")';

				let genCode = function genCode(mode) {
					let s = document.createElement("script");
					s.innerHTML =
						scriptOpen + '"' + escape(mode) + '"' + scriptClose;
					let script = s.outerHTML;

					let blob = new Blob([header + script + footer], {
						type: "text/html",
					});

					return URL.createObjectURL(blob); //"data:text/html," + encodeURIComponent(header + script + footer);
				};

				status.innerHTML = "status: ready for download";
				download_turtle.href = genCode("turtle");
				download_turtle.style.display = "block";
				download_canvas.href = genCode("canvas");
				download_canvas.style.display = "block";
			}
		};
		xhr.send();
	}
}

function cmd_toggle_breakpoint() {
	let ed = ide.collection.getCurrentEditor();
	if (!ed) return;

	let line = ed.getCursorPosition().row;
	if (ide.interpreter) {
		// ask the interpreter for the correct position of the marker
		let result = ide.interpreter.toggleBreakpoint(
			line + 1,
			ed.properties().name
		);
		if (result !== null) {
			line = result.line - 1;
			ed.properties().toggleBreakpoint(line);
			ed.scrollTo(line, 0);
		}
	} else {
		// set the marker optimistically, fix as soon as an interpreter is created
		ed.properties().toggleBreakpoint(line);
	}
}

function cmd_new() {
	createEditorTabByModal();
}

function cmd_load() {
	fileDlg("Load file", "", false, "Load", function (name) {
		let ed = ide.collection.getEditor(name);
		if (ed) {
			ed.focus();
			return;
		}

		openEditorFromLocalStorage(name);
		updateControls();
	});
}

function cmd_save() {
	const ed = ide.collection.getCurrentEditor();
	if (!ed) return;
	let name = ed.properties().name;

	localStorage.setItem("tscript.code." + name, ed.text());
	ed.setClean();
}

function cmd_save_as() {
	const ed = ide.collection.getCurrentEditor();
	if (!ed) return;

	fileDlg(
		"Save file as ...",
		ed.properties().name,
		true,
		"Save",
		function (filename) {
			closeEditor(filename);
			localStorage.setItem("tscript.code." + filename, ed.text());
			openEditorFromLocalStorage(filename);
		}
	);
}

function isInterpreterBusy() {
	return (
		!ide.interpreter ||
		(ide.interpreter.status != "running" &&
			ide.interpreter.status != "waiting" &&
			ide.interpreter.status != "dialog")
	);
}
