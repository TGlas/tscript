import * as ide from ".";
import { Parser } from "../../lang/parser";
import { icons } from "../icons";
import * as tgui from "./../tgui";
import { toggleBreakpoint } from "./breakpoint";
import { confirmFileDiscard, fileDlg, options } from "./dialogs";
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

	// check that the code at least compiles
	let source = ide.sourcecode.getValue();
	ide.clear();
	let result = Parser.parse(source, options);
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
	let title = ide.ide_document.filename;
	if (!title || title === "") title = "tscript-export";
	let fn = title;
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
		var xhr = new XMLHttpRequest();
		xhr.open("GET", window.location.href, true);
		xhr.overrideMimeType("text/html");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				// hide the IDE and let canvas or turtle run in full screen
				let page = xhr.responseText;

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
	let cm = ide.sourcecode;
	let line = cm.getCursor().line;
	if (ide.interpreter) {
		// ask the interpreter for the correct position of the marker
		let result = ide.interpreter.toggleBreakpoint(line + 1);
		if (result !== null) {
			line = result.line;
			toggleBreakpoint(cm.getEditorView(), line);
			ide.sourcecode.scrollIntoView({ line: line - 1, ch: 0 }, 40);
		}
	} else {
		// set the marker optimistically, fix as soon as an interpreter is created
		toggleBreakpoint(cm.getEditorView(), line);
	}
}

function cmd_new() {
	confirmFileDiscard("New document", () => {
		ide.clear();

		ide.editor_title.innerHTML = "Editor";
		ide.ide_document.filename = "";
		ide.sourcecode.setValue("");
		ide.sourcecode.clearHistory();
		ide.ide_document.dirty = false;

		updateControls();
		ide.sourcecode.focus();
	});
}

function cmd_load() {
	confirmFileDiscard("Open document", () => {
		fileDlg(
			"Load file",
			ide.ide_document.filename,
			false,
			"Load",
			function (filename) {
				ide.clear();

				ide.editor_title.innerHTML = "Editor &mdash; ";
				tgui.createText(filename, ide.editor_title);
				ide.ide_document.filename = filename;
				ide.sourcecode.setValue(
					localStorage.getItem("tscript.code." + filename)!
				);
				ide.sourcecode.setCursor({ line: 0, ch: 0 });
				ide.sourcecode.clearHistory();
				ide.ide_document.dirty = false;

				updateControls();
				ide.sourcecode.focus();
			}
		);
	});
}

function cmd_save() {
	if (ide.ide_document.filename === "") {
		cmd_save_as();
		return;
	}

	localStorage.setItem(
		"tscript.code." + ide.ide_document.filename,
		ide.sourcecode.getValue()
	);
	ide.ide_document.dirty = false;
}

function cmd_save_as() {
	let dlg = fileDlg(
		"Save file as ...",
		ide.ide_document.filename,
		true,
		"Save",
		function (filename) {
			ide.editor_title.innerHTML = "Editor &mdash; ";
			tgui.createText(filename, ide.editor_title);
			ide.ide_document.filename = filename;
			cmd_save();
			ide.sourcecode.focus();
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
