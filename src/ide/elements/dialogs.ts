import { update } from "lodash";
import { defaultParseOptions, ParseOptions } from "../../lang/parser";
import {
	deleteProject,
	getCurrentProject,
	getProjectPath,
	InvalidProjectName,
	listProjects,
	recurseDirectory,
	setCurrentProject,
	tryCreateProject,
} from "../projects-fs";
import * as tgui from "./../tgui";
import { tryStopModal } from "./../tgui";
import { buttons } from "./commands";
import { openEditorFromLocalStorage, tab_config } from "./editor-tabs";
import * as ide from "./index";
import { updateControls } from "./utils";

export let parseOptions: ParseOptions = defaultParseOptions;

/**
 * Check if the document has been changed and when this is the case, ask the user to discard the changes,
 * by opening a dialog. In this case the confirmFileDiscard returns directly after creating the dialog.
 * When the document was not changed, or the user allows to discard the changes the function onConfirm is
 * called.
 */
export function confirmFileDiscard(name: string, onConfirm: () => any) {
	const ed = ide.collection.getEditor(name);
	if (!ed) return;

	if (ed.isDirty()) {
		tgui.msgBox({
			prompt: "The document may have unsaved changes.\nDo you want to discard the code?",
			icon: tgui.msgBoxQuestion,
			title: name,
			buttons: [
				{ text: "Discard", onClick: onConfirm, isDefault: true },
				{ text: "Cancel" },
			],
		});
	} else {
		onConfirm();
	}
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
	let config: any = {
		options: parseOptions,
		hotkeys: [],
		theme: tgui.getThemeConfig(),
		tabs: tab_config,
		open: ide.collection.getFilenames(),
		main: ide.getRunSelection(),
	};
	let active = ide.collection.getActiveEditor();
	if (active) config.active = active.properties().name;
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

/**
 * Represents an HTML element that renders a list of items, which can be
 * selected, opened/saved as (onClickConfirmation), and deleted.
 */
interface FileDlgView {
	/** Element containinng the view */
	element: HTMLElement;
	/** Needs to be called after the view was attached to a parent (rendered) */
	onAttached: () => void;
	/**
	 * Event handler for when the primary action on items in the list is
	 * performed (e.g., open or save). Use `this.getSelectedItem()` to get the
	 * item the operation pertains to.
	 *
	 * @returns
	 * true when the dialog should remain open (see `ModalButton.onClick`)
	 */
	onClickConfirmation: (event: Event) => boolean;
	/** Set the status text (e.g., "5 Documents") */
	setStatus: (status: string) => void;
	/**
	 * Get the relevant item. This is resolved as follows:
	 *	- If the input field was created (includeInputField=true), then takes its value
	 *	- Otherwise, if an item was selected, return it
	 *	- Otherwise, if the promise of the list of items has resolved, return
	 *	  the inital item passed as initItem
	 *	- Otherwise, return null
	 */
	getSelectedItem: () => string | null;
	/**
	 * Get the current list of items, null if the promise wasn't resolved yet
	 */
	getItems: () => string[] | null;
	/** Remove an item from the list */
	removeItemFromList: (item: string) => void;
	/**
	 * Resolves once fully rendered. Might not be resolved (if the modal closed
	 * beforehand)
	 */
	fullyRendered: Promise<void>;
}

export const fileDlgSize = {
	scalesize: [0.5, 0.7],
	minsize: [440, 260],
} as const;

export function loadFileProjDlg() {
	const title = "Load file";
	let fileView: FileDlgView,
		projectView: FileDlgView,
		currentView: FileDlgView;
	const ac = new AbortController();
	/** If true, the modal won't be closed. Used by views to keep state from
	 * changing during async tasks */
	fileView = createFileDlgFileView(
		"",
		false,
		loadFile,
		switchToProjectView,
		ac.signal
	);
	projectView = createFileDlgProjectView(switchToFileView, ac.signal);
	currentView = fileView;
	// create dialog and its controls
	let dlg = tgui.createModal({
		title: title,
		minsize: [...fileDlgSize.minsize],
		scalesize: [...fileDlgSize.scalesize],
		buttons: [
			{
				text: "Load",
				isDefault: true,
				onClick: onClickConfirmation,
			},
			{ text: "Cancel" },
		],
		enterConfirms: true,
		onClose: () => ac.abort(),
	});

	tgui.startModal(dlg);
	updateView();
	return dlg;

	function switchToProjectView() {
		currentView = projectView;
		dlg.setTitle("Load project");
		updateView();
	}
	function switchToFileView() {
		currentView = fileView;
		dlg.setTitle(title);
		updateView();
	}

	function onClickConfirmation(event: Event) {
		return currentView.onClickConfirmation(event);
	}

	function updateView() {
		dlg.content.replaceChildren(currentView.element);
		currentView.onAttached();
	}

	function loadFile(name: string) {
		let ed = ide.collection.getEditor(name);
		if (ed) {
			ed.focus();
			return;
		}

		openEditorFromLocalStorage(name);
		return updateControls().then(() => undefined);
	}
}

/**
 * @param initItem Item that is initially considered the current item, and if
 *	`includeInputField=true`, then also the value of the input field.
 * @param includeInputField Includes an text input field in the view, which sets
 *	the value of the current item.
 * @param onDelete Callback for when the delete button / Del is pressed
 * @param onClickConfirmation Callback for when the modal is confirmed / an item
 *	is double clicked
 * @param close Callback that closes the modal
 * @param setMayClose prevent/allow closing the modal
 */
function createFileDlgViewConfigurable(
	initItem: string,
	includeInputField: boolean,
	initItemListP: Promise<string[]>,
	onDelete: () => void,
	onClickConfirmation: () => boolean | Promise<boolean>,
	switchView: (() => void) | null,
	deleteBtnText: string,
	inputFieldPlaceholder: string,
	switchBtnText: string,
	detachSignal: AbortSignal
): FileDlgView {
	let items: string[] | null = null;
	let ret: FileDlgView;

	const container = tgui.createElement({
		type: "div",
		style: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			height: "100%",
			width: "100%",
		},
	});

	let toolbar = tgui.createElement({
		parent: container,
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
	let deleteBtn = tgui.createElement({
		parent: toolbar,
		type: "button",
		style: {
			width: "100px",
			height: "100%",
			"margin-right": "10px",
		},
		text: deleteBtnText,
		click: onDelete,
		classname: "tgui-modal-button",
	});
	deleteBtn.disabled = true;

	let status = tgui.createElement({
		parent: toolbar,
		type: "label",
		style: {
			flex: "1",
			height: "100%",
			"white-space": "nowrap",
		},
		text: "",
		classname: "tgui-status-box",
	});

	if (switchView !== null) {
		// switch button
		tgui.createElement({
			parent: toolbar,
			type: "button",
			style: {
				height: "100%",
				marginLeft: "auto",
				padding: "0px 10px",
				//display: "inline-flex",
				//alignItems: "center",
			},
			text: switchBtnText,
			click: switchView,
			classname: "tgui-modal-button",
		});
	}
	// end toolbar

	type NameType = { value: string } | HTMLInputElement;
	let nameRes: (value: NameType) => void;
	const nameP = new Promise<NameType>((res) => (nameRes = res));
	let name: NameType | null = null;
	let listRes: (value: HTMLSelectElement) => void;
	let list: HTMLSelectElement | null = null;
	const listP = new Promise<HTMLSelectElement>((res) => (listRes = res));
	/** `initItemListP` was resolved and the rest of the view was rendered */
	let fullyRendered = false;
	// render rest once items are ready
	initItemListP.then((initItemListP) => {
		items = [...initItemListP];

		list = tgui.createElement({
			parent: container,
			type: "select",
			properties: {
				size: Math.max(2, items.length).toString(),
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
		name = { value: initItem };
		if (includeInputField) {
			name = tgui.createElement({
				parent: container,
				type: "input",
				style: {
					height: "25px",
					//background: "#fff",
					margin: "0 0px 7px 0px",
				},
				classname: "tgui-text-box",
				text: initItem,
				properties: {
					type: "text",
					placeholder: inputFieldPlaceholder,
				},
			});
		}

		// populate options
		for (let i = 0; i < items.length; i++) {
			let option = new Option(items[i], items[i]);
			list.options[i] = option;
		}

		// event handlers
		list.addEventListener("change", function (event: any) {
			if (event.target && event.target.value)
				name!.value = event.target.value;
		});
		list.addEventListener("keydown", function (event) {
			if (event.key === "Backspace" || event.key === "Delete") {
				event.preventDefault();
				event.stopPropagation();
				onDelete();
			}
		});
		list.addEventListener("dblclick", function (event) {
			event.preventDefault();
			event.stopPropagation();
			syncOnClickConfirmation();
			return false;
		});
		deleteBtn.disabled = false;

		fullyRendered = true;
		nameRes(name);
		listRes(list);
	});

	return (ret = {
		element: container,
		onAttached: () => {
			nameP.then((name) => {
				if (!detachSignal.aborted && name instanceof HTMLInputElement) {
					name.focus();
				}
			});
		},
		onClickConfirmation: syncOnClickConfirmation,
		getSelectedItem: () => (name === null ? null : name.value),
		setStatus: (newStatus) => {
			status.innerText = newStatus;
		},
		removeItemFromList: (item) => {
			if (!fullyRendered) {
				listP.then(() => {
					if (!detachSignal.aborted) ret.removeItemFromList(item);
				});
				return;
			}

			const idx = items!.indexOf(item);
			if (idx >= 0) {
				items!.splice(idx, 1);
				list!.remove(idx);
				return true;
			}
			return false;
		},
		getItems: () => items,
		fullyRendered: nameP.then(() => {
			if (!detachSignal.aborted) return;
			return new Promise(() => undefined); // doesn't resolve
		}),
	});

	function syncOnClickConfirmation() {
		Promise.resolve(onClickConfirmation()).then((keepOpen) => {
			if (!keepOpen && !detachSignal.aborted) tgui.tryStopModal();
		});
		return true;
	}
}

/**
 * Computes and updates status text like "5 documents" (if itemTerm="document")
 */
function fileViewUpdateStatusText(view: FileDlgView, itemTerm: string) {
	const fileList = view.getItems();
	let text: string;
	if (fileList === null) {
		text = "Loading...";
	} else {
		text =
			(fileList.length > 0 ? fileList.length : "No") +
			" " +
			itemTerm +
			(fileList.length === 1 ? "" : "s");
	}
	view.setStatus(text);
}

export function createFileDlgFileView(
	filename: string,
	allowNewFilename: boolean,
	onOkay: (filename: string) => void,
	switchView: (() => void) | null,
	detachSignal: AbortSignal
): FileDlgView {
	let ret: FileDlgView;

	// 10px horizontal spacing
	//  7px vertical spacing
	// populate array of existing files
	let files: string[] = new Array();
	for (let key in localStorage) {
		if (key.substring(0, 13) === "tscript.code.")
			files.push(key.substring(13));
	}
	files.sort();

	// return true on failure, that is when the dialog should be kept open
	let onFileConfirmation = function () {
		let fn = ret.getSelectedItem();
		if (fn === null) return true;
		if (fn != "") {
			if (allowNewFilename || files.indexOf(fn) >= 0) {
				onOkay(fn);
				return false; // close dialog
			}
		}
		return true; // keep dialog open
	};

	ret = createFileDlgViewConfigurable(
		filename,
		allowNewFilename,
		Promise.resolve(files),
		() => {
			const selectedFile = ret.getSelectedItem();
			if (selectedFile !== null) deleteFile(selectedFile);
		},
		onFileConfirmation,
		switchView,
		"Delete file",
		"Filename",
		"Show projects",
		detachSignal
	);

	const updateStatusText = () => fileViewUpdateStatusText(ret, "document");
	updateStatusText();
	ret.fullyRendered.then(updateStatusText);
	return ret;

	function deleteFile(filename: string) {
		if (ret.getItems()?.includes(filename)) {
			let onDelete = () => {
				ide.collection.closeEditor(filename);
				localStorage.removeItem("tscript.code." + filename);
				ret.removeItemFromList(filename);
				updateStatusText();
			};

			deleteFileDlg(filename, onDelete);
		}
	}
}

function createFileDlgProjectView(
	switchView: (() => void) | null,
	detachSignal: AbortSignal
): FileDlgView {
	const projs = listProjects().then((projs) => projs.sort());
	const ret = createFileDlgViewConfigurable(
		getCurrentProject() ?? "",
		true,
		projs,
		onDelete,
		onLoad,
		switchView,
		"Delete project",
		"New project",
		"Show files",
		detachSignal
	);
	updateStatusText();
	ret.fullyRendered.then(updateStatusText);
	return ret;

	function updateStatusText() {
		fileViewUpdateStatusText(ret, "project");
	}

	function onDelete() {
		const proj = ret.getSelectedItem();
		if (proj === null) {
			return;
		}
		if (!ret.getItems()!.includes(proj)) {
			return;
		}

		const msgBoxAC = new AbortController();

		const onDeleteConfirm = async () => {
			const projPath = getProjectPath(proj);
			for await (const entry of recurseDirectory(projPath)) {
				ide.collection.closeEditor(
					entry.substring(1 + projPath.length)
				);
			}
			await deleteProject(proj);
			ret.removeItemFromList(proj);
			updateStatusText();
			return false;
		};

		let msgBox = tgui.msgBox({
			title: "Delete project",
			icon: tgui.msgBoxExclamation,
			prompt: 'Delete project "' + proj + '"\nAre you sure?',
			buttons: [
				{
					text: "Delete",
					isDefault: true,
					onClick: () => {
						onDeleteConfirm().then((keepOpen) => {
							if (!keepOpen && !msgBoxAC.signal.aborted) {
								msgBoxAC.abort();
								tryStopModal(msgBox);
							}
						});
						return true;
					},
				},
				{ text: "Cancel" },
			],
			onClose: () => msgBoxAC.abort(),
		});
	}

	async function onLoad() {
		const proj = ret.getSelectedItem();
		if (proj === null) {
			return true;
		}
		try {
			await tryCreateProject(proj);
		} catch (e) {
			if (e instanceof InvalidProjectName) {
				tgui.msgBox({
					title: "Invalid project name",
					prompt: e.reason,
					enterConfirms: true,
					buttons: [
						{
							text: "Okay",
							isDefault: true,
						},
					],
				});
				return true;
			} else {
				throw e;
			}
		} finally {
		}
		await setCurrentProject(proj);
		return false;
	}
}

/**
 * @param onDelete See `ModalButton.onClick` for meaning of return value
 */
export function deleteFileDlg(
	filename: string,
	onDelete: () => boolean | Promise<boolean> | void
): void {
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

/**
 * @param onOkay See `ModalButton.onClick` for meaning of return value
 */
export function tabNameDlg(
	onOkay: (filename: string) => boolean | Promise<boolean> | void,
	title: string = "New tab",
	defaultInput: string | undefined = undefined
) {
	// return true on failure, that is when the dialog should be kept open
	let onFileConfirmation = function () {
		return onOkay(name.value);
	};

	// create dialog and its controls
	let modal = tgui.createModal({
		title,
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
	const inputProps: Record<string, string> = {
		type: "text",
		placeholder: "Filename",
	};
	if (defaultInput !== undefined) {
		inputProps.value = defaultInput;
	}
	name = tgui.createElement({
		parent: modal.content,
		type: "input",
		style: {
			width: "100%",
			height: "25px",
			"margin-vertical": "7px",
		},
		classname: "tgui-text-box",
		properties: inputProps,
	});

	tgui.startModal(modal);
}
