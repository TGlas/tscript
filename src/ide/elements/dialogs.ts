import {
	defaultParseOptions,
	FileID,
	fileIDHasNamespace,
	fileIDToContextDependentFilename,
	fileIDToHumanFriendly,
	isLoadableFileID,
	LoadableFileID,
	LocalStorageFileID,
	ParseOptions,
	ProjectFileID,
} from "../../lang/parser";
import {
	deleteProject,
	getCurrentProject,
	getProjectPath,
	InvalidProjectName,
	listProjects,
	recurseDirectory,
	setCurrentProject,
	simplifyPath,
	tryCreateProject,
} from "../projects-fs";
import * as tgui from "./../tgui";
import { tryStopModal } from "./../tgui";
import { buttons } from "./commands";
import {
	closeProjectEditorTabsRecursively,
	openEditorFromLocalStorage,
	tab_config,
} from "./editor-tabs";
import * as ide from "./index";
import { updateControls } from "./utils";

export let parseOptions: ParseOptions = defaultParseOptions;

/**
 * Check if the document has been changed and when this is the case, ask the user to discard the changes,
 * by opening a dialog. In this case the confirmFileDiscard returns directly after creating the dialog.
 * When the document was not changed, or the user allows to discard the changes the function onConfirm is
 * called.
 */
export function confirmFileDiscard(name: FileID, onConfirm: () => any) {
	const ed = ide.collection.getEditor(name);
	if (!ed) return;

	if (ed.isDirty()) {
		tgui.msgBox({
			prompt: "The document may have unsaved changes.\nDo you want to discard the code?",
			icon: tgui.msgBoxQuestion,
			title: fileIDToHumanFriendly(name),
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

type Config = {
	options: ParseOptions;
	hotkeys: string[];
	theme: tgui.ThemeConfiguration;
	tabs: any;
	open: LoadableFileID[];
	main: FileID;
	active?: LoadableFileID;
};

/**
 * Load hotkeys & other settings
 */
export function loadConfig() {
	let str = localStorage.getItem("tscript.ide.config");
	let config: Config | null = null;
	if (str) {
		config = JSON.parse(str) as Config;
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
	let config: Config = {
		options: parseOptions,
		hotkeys: [],
		theme: tgui.getThemeConfig(),
		tabs: tab_config,
		open: ide.collection.getFilenames().filter(isLoadableFileID),
		main: ide.getRunSelection(),
	};
	let active = ide.collection.getActiveEditor();
	if (active) {
		const activeFileID = active.properties().name;
		if (isLoadableFileID(activeFileID)) config.active = activeFileID;
	}
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

export const fileDlgSize = {
	scalesize: [0.5, 0.7],
	minsize: [440, 260],
} as const;

export function loadFileProjDlg() {
	const title = "Load file";
	let fileView: FileDlgView,
		projectView: FileDlgView,
		currentView: FileDlgView;
	/** Whether the modal wasn't yet closed */
	const ctxBase = {
		clickConfirmation: simulateClickConfirmation,
	};
	fileView = createFileDlgFileView("", false, loadFile, {
		...ctxBase,
		switchView: switchToProjectView,
	});
	projectView = createFileDlgProjectView({
		...ctxBase,
		switchView: switchToFileView,
	});
	currentView = fileView;

	// create dialog and its controls
	const confirmationBtn = {
		text: "Load",
		isDefault: true,
		onClick: onClickConfirmation,
	};
	let dlg = tgui.createModal({
		title: title,
		minsize: [...fileDlgSize.minsize],
		scalesize: [...fileDlgSize.scalesize],
		buttons: [confirmationBtn, { text: "Cancel" }],
		enterConfirms: true,
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

	async function onClickConfirmation() {
		return await currentView.onClickConfirmation();
	}

	function updateView() {
		dlg.content.replaceChildren(currentView.element);
		currentView.onAttached();
	}

	function loadFile(name: string) {
		let ed = ide.collection.getEditor(`localstorage:${name}`);
		if (ed) {
			ed.focus();
			return;
		}

		openEditorFromLocalStorage(name);
		return updateControls();
	}

	function simulateClickConfirmation() {
		dlg.pressButton(confirmationBtn);
	}
}

interface FileViewContext {
	/**
	 * callback for when the other view should be displayed. Set to null to
	 * remove button for switching views
	 */
	switchView: (() => void) | null;
	/** Simulates clicking on the confirmation button */
	clickConfirmation: () => void;
}

interface FileViewDescription {
	/**
	 * Item that is initially considered the current item, and if
	 * `includeInputField=true`, then also the value of the input field.
	 */
	initItem: string;
	/**
	 * Include an text input field in the view, which sets the value of the
	 * current item.
	 */
	includeInputField: boolean;
	initItemListP: Promise<string[]>;
	/** Callback for when the delete button / Del is pressed */
	onClickDelete: () => void;
	/** Callback for when the modal is confirmed / an item is double clicked */
	onClickConfirmation: () => boolean | Promise<boolean>;
	deleteBtnText: string;
	inputFieldPlaceholder: string;
	switchBtnText: string;
	/** E.g., "file", "project". Used for the status text */
	itemTerm: string;
}

type FileDlgViewLaterContent = {
	/** list displaying the items */
	readonly list: HTMLSelectElement;
	/**
	 * current list of items (which may be different from the initial list)
	 */
	readonly items: string[];
	/**
	 * Element containing at .value the currently selected item. If
	 * #ctx.includeInputField, then this is an HTMLInputElement, otherwise
	 * a dummy.
	 */
	readonly name: { value: string } | HTMLInputElement;
};

/**
 * Represents an HTML element that renders a list of items, which can be
 * selected, opened/saved as (onClickConfirmation), and deleted.
 */
class FileDlgView {
	/** Element containinng the view */
	readonly element: HTMLElement;
	/** Original description this View was created with */
	readonly #dsc: FileViewDescription;
	/** Original context this View was created with */
	readonly #ctx: FileViewContext;
	/** Element displaying the status */
	readonly #status: HTMLLabelElement;
	/**
	 * Resolves once fully rendered. Might not be resolved (if the modal closed
	 * beforehand)
	 */
	readonly fullyRendered: Promise<void>;
	/** set once the items have loaded and have been rendered */
	#laterContent: FileDlgViewLaterContent | null = null;
	readonly #laterContentP: Promise<FileDlgViewLaterContent>;

	constructor(dsc: FileViewDescription, ctx: FileViewContext) {
		this.#dsc = dsc;
		this.#ctx = ctx;

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
			text: dsc.deleteBtnText,
			click: dsc.onClickDelete,
			classname: "tgui-modal-button",
		});
		deleteBtn.disabled = true;

		this.#status = tgui.createElement({
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

		if (ctx.switchView !== null) {
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
				text: dsc.switchBtnText,
				click: ctx.switchView,
				classname: "tgui-modal-button",
			});
		}
		// end toolbar

		let laterContentRes: (value: FileDlgViewLaterContent) => void;
		this.#laterContentP = new Promise<FileDlgViewLaterContent>(
			(res) => (laterContentRes = res)
		);
		this.fullyRendered = this.#laterContentP.then(() => undefined);
		// render rest once items are ready
		dsc.initItemListP.then((initItemList) => {
			const items = [...initItemList];

			const list = tgui.createElement({
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
			let name = { value: dsc.initItem };
			if (dsc.includeInputField) {
				name = tgui.createElement({
					parent: container,
					type: "input",
					style: {
						height: "25px",
						//background: "#fff",
						margin: "0 0px 7px 0px",
					},
					classname: "tgui-text-box",
					text: dsc.initItem,
					properties: {
						type: "text",
						placeholder: dsc.inputFieldPlaceholder,
					},
				});
			}

			// populate options
			for (let i = 0; i < items.length; i++) {
				let option = new Option(items[i], items[i]);
				list.options[i] = option;
			}

			// event handlers
			list.addEventListener("change", (event: any) => {
				if (event.target && event.target!.value)
					name!.value = event.target!.value;
			});
			list.addEventListener("keydown", (event) => {
				if (event.key === "Backspace" || event.key === "Delete") {
					event.preventDefault();
					event.stopPropagation();
					dsc.onClickDelete();
				}
			});
			list.addEventListener("dblclick", (event) => {
				event.preventDefault();
				event.stopPropagation();
				this.#ctx.clickConfirmation();
				return false;
			});
			deleteBtn.disabled = false;

			this.#laterContent = {
				list,
				name,
				items,
			};
			laterContentRes(this.#laterContent);
		});

		this.element = container;
	}

	/**
	 * Needs to be called after the view was attached to a parent (switched to).
	 * Schedules focusing the input field (if present)
	 */
	onAttached() {
		this.#laterContentP.then((laterContent) => {
			if (
				laterContent.name instanceof HTMLInputElement &&
				laterContent.name.isConnected
			) {
				laterContent.name.focus();
			}
		});
	}

	/**
	 * Event handler for when the primary action on items in the list is
	 * performed (e.g., open or save). Use `this.getSelectedItem()` to get the
	 * item the operation pertains to.
	 *
	 * @returns
	 * true when the dialog should remain open (see `ModalButton.onClick`)
	 */
	async onClickConfirmation(): Promise<boolean> {
		return await this.#dsc.onClickConfirmation();
	}

	/**
	 * Get the relevant item. This is resolved as follows:
	 *	- If the input field was created (includeInputField=true), then takes its value
	 *	- Otherwise, if an item was selected, return it
	 *	- Otherwise, if the promise of the list of items has resolved, return
	 *	  the inital item passed as initItem
	 *	- Otherwise, return null
	 */
	getSelectedItem(): string | null {
		return this.#laterContent === null
			? null
			: this.#laterContent.name.value;
	}

	/** Remove an item from the list */
	removeItemFromList(item: string) {
		if (this.#laterContent === null) {
			this.#laterContentP.then(() => {
				this.removeItemFromList(item);
			});
			return;
		}

		const idx = this.#laterContent.items.indexOf(item);
		if (idx >= 0) {
			this.#laterContent.items.splice(idx, 1);
			this.#laterContent.list.remove(idx);
		}
	}

	/**
	 * Get the current list of items, null if the promise wasn't resolved yet
	 */
	getItems(): string[] | null {
		return this.#laterContent?.items ?? null;
	}

	isFullyRendered(): boolean {
		return this.#laterContent !== null;
	}

	/**
	 * Computes and updates status text like "5 documents" (if itemTerm="document")
	 */
	updateStatusText() {
		let text: string;
		if (this.#laterContent === null) {
			text = "Loading...";
		} else {
			const items = this.#laterContent.items;
			text =
				(items.length > 0 ? items.length : "No") +
				" " +
				this.#dsc.itemTerm +
				(items.length === 1 ? "" : "s");
		}
		this.#status.innerText = text;
	}
}

export function createFileDlgFileView(
	filename: string,
	allowNewFilename: boolean,
	onOkay: (filename: string) => void,
	ctx: FileViewContext
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

	ret = new FileDlgView(
		{
			initItem: filename,
			includeInputField: allowNewFilename,
			initItemListP: Promise.resolve(files),
			onClickDelete: () => {
				const selectedFile = ret.getSelectedItem();
				if (selectedFile !== null) deleteFile(selectedFile);
			},
			onClickConfirmation: onFileConfirmation,
			deleteBtnText: "Delete file",
			inputFieldPlaceholder: "Filename",
			switchBtnText: "Show projects",
			itemTerm: "document",
		},
		ctx
	);

	const updateStatusText = () => ret.updateStatusText();
	updateStatusText();
	ret.fullyRendered.then(updateStatusText);
	return ret;

	function deleteFile(filename: string) {
		if (ret.getItems()?.includes(filename)) {
			let onDelete = () => {
				ide.collection.closeEditor(`localstorage:${filename}`);
				localStorage.removeItem("tscript.code." + filename);
				ret.removeItemFromList(filename);
				updateStatusText();
			};

			deleteFileDlg(filename, onDelete);
		}
	}
}

function createFileDlgProjectView(ctx: FileViewContext): FileDlgView {
	const projs = listProjects().then((projs) => projs.sort());
	const ret = new FileDlgView(
		{
			initItem: getCurrentProject() ?? "",
			includeInputField: true,
			initItemListP: projs,
			onClickDelete: handleDelete,
			onClickConfirmation,
			deleteBtnText: "Delete project",
			inputFieldPlaceholder: "New project",
			switchBtnText: "Show files",
			itemTerm: "project",
		},
		ctx
	);
	ret.updateStatusText();
	ret.fullyRendered.then(() => ret.updateStatusText());
	return ret;

	function handleDelete() {
		const proj = ret.getSelectedItem();
		if (proj === null) {
			return;
		}
		if (!ret.getItems()!.includes(proj)) {
			return;
		}

		const onDeleteConfirm = async () => {
			await closeProjectEditorTabsRecursively(proj, "/");
			await deleteProject(proj);
			ret.removeItemFromList(proj);
			ret.updateStatusText();
			return false;
		};
		let msgBoxOpen = true;

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
							if (!keepOpen && msgBoxOpen) {
								tryStopModal(msgBox);
							}
						});
						return true;
					},
				},
				{ text: "Cancel" },
			],
			onClose: () => {
				msgBoxOpen = false;
			},
		});
	}

	async function onClickConfirmation() {
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
 *	If it is a promise, the modal is kept open and depending on the value it
 *	resolves to it is closed upon resolution.
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
