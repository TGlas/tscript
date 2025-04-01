import { defaultParseOptions, ParseOptions } from "../../lang/parser";
import * as tgui from "./../tgui";
import { buttons } from "./commands";
import * as ide from "./index";

export let parseOptions: ParseOptions = defaultParseOptions;

/**
 * Check if the document has been changed and when this is the case, ask the user to discard the changes,
 * by opening a dialog. In this case the confirmFileDiscard returns directly after creating the dialog.
 * When the document was not changed, or the user allows to discard the changes the function onConfirm is
 * called.
 */
export function confirmFileDiscard(name: string, onConfirm: () => any) {
	tgui.msgBox({
		prompt: "The document may have unsaved changes.\nDo you want to discard the code?",
		icon: tgui.msgBoxQuestion,
		title: name,
		buttons: [
			{ text: "Discard", onClick: onConfirm, isDefault: true },
			{ text: "Cancel" },
		],
	});
}

export function confirmFileOverwrite(name: string, onConfirm: () => any) {
	tgui.msgBox({
		prompt:
			"A document named " +
			name +
			" already exists.\nDo you want to overwrite it?",
		icon: tgui.msgBoxQuestion,
		title: name,
		buttons: [
			{ text: "Overwrite", onClick: onConfirm, isDefault: true },
			{ text: "Cancel" },
		],
	});
}

/**
 * Load hotkeys & other settings
 */
export function loadConfig() {
	let str = localStorage.getItem("tscript.ide.config");
	let config: any = null;
	if (str) {
		config = JSON.parse(str);
		if (config.hasOwnProperty("hotkeys")) {
			let n = Math.min(buttons.length, config.hotkeys.length);
			for (let i = 0; i < n; i++) {
				buttons[i].hotkey = config.hotkeys[i];
			}
		}
		if (config.hasOwnProperty("options")) {
			parseOptions = {
				...defaultParseOptions,
				...config.options,
			};
		}

		const configuredTheme = config.theme;
		tgui.setThemeConfig(
			tgui.isThemeConfig(configuredTheme) ? configuredTheme : "default"
		);
	}
	return config;
}

/**
 * Save hotkeys
 */
export function saveConfig() {
	const editorsState = ide.collection.getSerializedState();
	let config: any = {
		options: parseOptions,
		hotkeys: [],
		theme: tgui.getThemeConfig(),
		tabs: ide.tab_config,
		open: editorsState.open,
		main: ide.getRunSelection(),
		active: editorsState.active,
	};
	for (let i = 0; i < buttons.length; i++) {
		config.hotkeys.push(buttons[i].hotkey);
	}
	localStorage.setItem("tscript.ide.config", JSON.stringify(config));
}

export function configDlg() {
	let dlg = tgui.createModal({
		title: "Configuration",
		scalesize: [0.5, 0.5],
		minsize: [370, 270],
		buttons: [{ text: "Done", isDefault: true }],
		onClose: saveConfig,
	});
	let div_hotkey = tgui.createElement({
		parent: dlg.content,
		type: "div",
	});
	let h3_hotkey = tgui.createElement({
		parent: div_hotkey,
		type: "h3",
		text: "Configure Hotkeys",
	});
	let p_hotkey = tgui.createElement({
		parent: div_hotkey,
		type: "p",
		text: "Click a button to configure its hotkey.",
	});

	let dlg_buttons = new Array();
	let div_buttons = tgui.createElement({
		parent: div_hotkey,
		type: "div",
		classname: "ide-toolbar",
	});
	let curgroup: string = buttons[0].group;
	for (let i = 0; i < buttons.length; i++) {
		let description = Object.assign({}, buttons[i]);

		if (description.group !== curgroup) {
			tgui.createElement({
				type: "div",
				parent: div_buttons,
				classname: "tgui tgui-control tgui-toolbar-separator",
			});
			curgroup = description.group;
		}

		description.width = 20;
		description.height = 20;
		description.style = { float: "left", height: "22px" };
		if (description.hotkey)
			description.tooltip += " (" + description.hotkey + ")";
		delete description.hotkey;
		description.parent = div_buttons;
		{
			let btn = i;
			description.click = function () {
				let dlg = tgui.createModal({
					title: "Set hotkey",
					scalesize: [0.3, 0.3],
					minsize: [340, 220],
					buttons: [{ text: "Cancel" }],
					onClose: saveConfig,
				});
				let icon = tgui.createIcon({
					parent: dlg.content,
					width: 20,
					height: 20,
					icon: buttons[btn].icon,
					style: {
						position: "absolute",
						left: "15px",
						top: "16px",
					},
				});

				tgui.createElement({
					parent: dlg.content,
					type: "label",
					text: buttons[btn].tooltip,
					style: {
						position: "absolute",
						left: "50px",
						top: "16px",
						right: "15px",
					},
				});
				tgui.createElement({
					parent: dlg.content,
					type: "label",
					text:
						"Current hotkey: " +
						(buttons[btn].hotkey ? buttons[btn].hotkey : "<None>"),
					style: {
						position: "absolute",
						left: "50px",
						top: "46px",
						right: "15px",
					},
				});
				tgui.createElement({
					parent: dlg.content,
					type: "label",
					text: "Press the hotkey to assign, or press escape to remove the current hotkey",
					style: {
						position: "absolute",
						left: "15px",
						top: "106px",
						right: "15px",
					},
				});

				dlg.onKeyDownOverride = true; // Do not handle [escape]
				dlg.onKeyDown = function (event) {
					event.preventDefault();
					event.stopPropagation();

					let key = event.key;
					if (
						key === "Shift" ||
						key === "Control" ||
						key === "Alt" ||
						key === "OS" ||
						key === "Meta"
					)
						return;
					if (buttons[btn].hotkey) {
						tgui.setTooltip(
							buttons[btn].control.dom,
							buttons[btn].tooltip
						);
						tgui.setTooltip(
							dlg_buttons[btn].dom as any,
							buttons[btn].tooltip
						);
						tgui.releaseHotkey(buttons[btn].hotkey);
						delete buttons[btn].hotkey;
					}
					if (key === "Escape") {
						tgui.stopModal();
						return false;
					}

					if (event.altKey) key = "alt-" + key;
					if (event.ctrlKey) key = "control-" + key;
					if (event.shiftKey) key = "shift-" + key;
					key = tgui.normalizeHotkey(key);

					if (tgui.hotkey(key)) {
						alert("hotkey " + key + " is already in use");
					} else {
						buttons[btn].hotkey = key;
						tgui.setHotkey(key, buttons[btn].click);
						tgui.setTooltip(
							buttons[btn].control.dom,
							buttons[btn].tooltip + " (" + key + ")"
						);
						tgui.setTooltip(
							dlg_buttons[btn].dom,
							buttons[btn].tooltip + " (" + key + ")"
						);
						tgui.stopModal();
					}
					return false;
				};

				tgui.startModal(dlg);
			};
		}
		dlg_buttons.push(tgui.createButton(description));
	}

	{
		// Appearance
		let checked = "";

		let div_appearance = tgui.createElement({
			parent: dlg.content,
			type: "div",
		});
		let h3_appearance = tgui.createElement({
			parent: div_appearance,
			type: "h3",
			style: { "margin-top": "20px" },
			text: "Appearance",
		});
		let p_appearance = tgui.createElement({
			parent: div_appearance,
			type: "p",
		});
		const themes: { id: tgui.ThemeConfiguration; display: string }[] = [
			{ id: "default", display: "System Default" },
			{ id: "light", display: "Light" },
			{ id: "dark", display: "Dark" },
		];

		let lbl = tgui.createElement({
			parent: p_appearance,
			type: "label",
			html: "Theme",
			properties: { for: "selTheme" },
			style: { "padding-right": "5px" },
		});
		let sel = tgui.createElement({
			parent: p_appearance,
			type: "select",
			classname: "tgui-modal-dropdown",
			id: "selTheme",
			properties: { size: "1" },
		});

		for (let t of themes) {
			let opt = tgui.createElement({
				parent: sel,
				type: "option",
				properties: { value: t.id },
				style: { width: "100px" },
				html: t.display,
			});
		}
		sel.value = tgui.getThemeConfig();
		sel.addEventListener("change", () => {
			const theme = sel.value as tgui.ThemeConfiguration;
			tgui.setThemeConfig(theme);
		});
	}

	{
		// Coding Style
		let checked = "";

		let div_codingStyle = tgui.createElement({
			parent: dlg.content,
			type: "div",
		});
		let h3_codingStyle = tgui.createElement({
			parent: div_codingStyle,
			type: "h3",
			style: { "margin-top": "20px" },
			text: "Coding Style",
		});
		let p_codingStyle = tgui.createElement({
			parent: div_codingStyle,
			type: "p",
		});
		let checkbox = tgui.createElement({
			parent: p_codingStyle,
			type: "input",
			id: "chkCodingStyle",
			properties: { type: "checkbox" },
			click: function (event) {
				parseOptions.checkstyle = checkbox.checked;
			},
		});
		let lbl = tgui.createElement({
			parent: p_codingStyle,
			type: "label",
			html: "Enable style errors",
			properties: { for: "chkCodingStyle" },
			style: { "padding-left": "5px" },
		});
		if (parseOptions.checkstyle) checkbox.checked = true;
	}

	tgui.startModal(dlg);
}

export function fileDlg(
	title: string,
	filename: string,
	allowNewFilename: boolean,
	confirmText: string,
	onOkay: (filename: string) => any
) {
	// 10px horizontal spacing
	//  7px vertical spacing
	// populate array of existing files
	let files = new Array();
	for (let key in localStorage) {
		if (key.substr(0, 13) === "tscript.code.") files.push(key.substr(13));
	}
	files.sort();

	// return true on failure, that is when the dialog should be kept open
	let onFileConfirmation = function () {
		let fn = name.value;
		if (fn != "") {
			if (allowNewFilename || files.indexOf(fn) >= 0) {
				onOkay(fn);
				return false; // close dialog
			}
		}
		return true; // keep dialog open
	};

	// create dialog and its controls
	let dlg = tgui.createModal({
		title: title,
		scalesize: [0.5, 0.7],
		minsize: [440, 260],
		buttons: [
			{
				text: confirmText,
				isDefault: true,
				onClick: onFileConfirmation,
			},
			{ text: "Cancel" },
		],
		enterConfirms: true,
		contentstyle: {
			display: "flex",
			"flex-direction": "column",
			"justify-content": "space-between",
		},
	});

	let toolbar = tgui.createElement({
		parent: dlg.content,
		type: "div",
		style: {
			display: "flex",
			"flex-direction": "row",
			"justify-content": "space-between",
			width: "100%",
			height: "25px",
			"margin-top": "7px",
		},
	});
	// toolbar
	{
		let deleteBtn = tgui.createElement({
			parent: toolbar,
			type: "button",
			style: {
				width: "100px",
				height: "100%",
				"margin-right": "10px",
			},
			text: "Delete file",
			click: () => deleteFile(name.value),
			classname: "tgui-modal-button",
		});

		let status = tgui.createElement({
			parent: toolbar,
			type: "label",
			style: {
				flex: "1",
				height: "100%",
				"white-space": "nowrap",
			},
			text:
				(files.length > 0 ? files.length : "No") +
				" document" +
				(files.length === 1 ? "" : "s"),
			classname: "tgui-status-box",
		});
	}
	// end toolbar

	let list = tgui.createElement({
		parent: dlg.content,
		type: "select",
		properties: {
			size: Math.max(2, files.length).toString(),
			multiple: "false",
		},
		classname: "tgui-list-box",
		style: {
			flex: "auto",
			//background: "#fff",
			margin: "7px 0px",
			overflow: "scroll",
		},
	});
	let name = { value: filename };
	if (allowNewFilename) {
		name = tgui.createElement({
			parent: dlg.content,
			type: "input",
			style: {
				height: "25px",
				//background: "#fff",
				margin: "0 0px 7px 0px",
			},
			classname: "tgui-text-box",
			text: filename,
			properties: { type: "text", placeholder: "Filename" },
		});
	}

	// populate options
	for (let i = 0; i < files.length; i++) {
		let option = new Option(files[i], files[i]);
		list.options[i] = option;
	}

	// event handlers
	list.addEventListener("change", function (event: any) {
		if (event.target && event.target.value) name.value = event.target.value;
	});
	list.addEventListener("keydown", function (event) {
		if (event.key === "Backspace" || event.key === "Delete") {
			event.preventDefault();
			event.stopPropagation();
			deleteFile(name.value);
			return false;
		}
	});
	list.addEventListener("dblclick", function (event) {
		event.preventDefault();
		event.stopPropagation();
		if (!onFileConfirmation()) tgui.stopModal();
		return false;
	});

	tgui.startModal(dlg);
	(allowNewFilename ? (name as any) : list).focus();
	return dlg;

	function deleteFile(filename) {
		let index = files.indexOf(filename);
		if (index >= 0) {
			let onDelete = () => {
				ide.collection.getEditor(filename)?.close();
				localStorage.removeItem("tscript.code." + filename);
				files.splice(index, 1);
				list.remove(index);
			};

			tgui.msgBox({
				title: "Delete file",
				icon: tgui.msgBoxExclamation,
				prompt: 'Delete file "' + filename + '"\nAre you sure?',
				buttons: [
					{ text: "Delete", isDefault: true, onClick: onDelete },
					{ text: "Cancel" },
				],
			});
		}
	}
}

export function tabNameDlg(onOkay: (filename: string) => boolean) {
	// return true on failure, that is when the dialog should be kept open
	let onFileConfirmation = function () {
		return onOkay(name.value);
	};

	// create dialog and its controls
	let modal = tgui.createModal({
		title: "New tab",
		scalesize: [0, 0],
		minsize: [330, 120],
		buttons: [
			{
				text: "Confirm",
				isDefault: true,
				onClick: onFileConfirmation,
			},
			{ text: "Cancel" },
		],
		enterConfirms: true,
		contentstyle: {
			display: "flex",
			"align-items": "center",
		},
	});

	let name = { value: "" };
	name = tgui.createElement({
		parent: modal.content,
		type: "input",
		style: {
			width: "100%",
			height: "25px",
			"margin-vertical": "7px",
		},
		classname: "tgui-text-box",
		properties: { type: "text", placeholder: "Filename" },
	});

	tgui.startModal(modal);
}
