import { tgui } from "./tgui";

export namespace storage {
	export interface File {
		isUnnamed: boolean;
		filename: string;
		isDevice: boolean;

		save?(contents: string): void;
		load?(): string;
	}

	export function newFile(isDevice: boolean = false): File {
		return {
			isUnnamed: true,
			filename: "",
			isDevice: isDevice,

			load(): string {
				return "";
			},
		};
	}

	export function localFile(filename: string): File {
		return {
			isUnnamed: false,
			filename,
			isDevice: false,

			save(contents: string): void {
				localStorage.setItem("tscript.code." + this.filename, contents);
			},
			load(): string {
				return (
					localStorage.getItem("tscript.code." + this.filename) ?? ""
				);
			},
		};
	}

	// device file contents loaded previously
	export function deviceFile(filename: string, contents: string): File {
		let prv_contents = contents;
		return {
			isUnnamed: false,
			filename,
			isDevice: true,

			save(contents: string): void {
				prv_contents = contents;
				saveDevice(this.filename, contents);
			},
			load(): string {
				return prv_contents;
			},
		};
	}

	function saveDevice(
		filename,
		text,
		mime = "text/plain"
	) {
		if (!filename.endsWith(".tscript")) filename += ".tscript";

		var element = document.createElement("a");
		element.setAttribute(
			"href",
			"data:" + mime + ";charset=utf-8," + encodeURIComponent(text)
		);
		element.setAttribute("download", filename);

		element.style.display = "none";
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	function loadDevice(
		multiple: boolean,
		handler: (filename: string, content: string) => void
	) {
		let fileImport = document.createElement("input");
		fileImport.type = "file";
		fileImport.multiple = multiple;
		fileImport.style.display = "none";
		fileImport.accept = ".tscript";

		fileImport.addEventListener("change", async (event: any) => {
			if (event.target.files) {
				for (let file of event.target.files) {
					let filename = file.name.split(".tscript")[0];
					let data = await file.text();

					handler(filename, data);
				}
			}
		});

		fileImport.click();
	}

	export enum DialogMode {
		OPEN,
		SAVE,
	}

	let dialogTitle = {
		[DialogMode.OPEN]: "Load file",
		[DialogMode.SAVE]: "Save file as ...",
	};

	let confirmText = {
		[DialogMode.OPEN]: "Load",
		[DialogMode.SAVE]: "Save",
	};

	export function fileDialog(
		file: File,
		mode: DialogMode,
		onSelection: (file: File) => void
	) {
		let allowNewFilename = mode == DialogMode.SAVE;

		// 10px horizontal spacing
		//  7px vertical spacing
		// populate array of existing files
		let files = new Array();
		for (let key in localStorage) {
			if (key.substr(0, 13) === "tscript.code.")
				files.push(key.substr(13));
		}
		files.sort();

		let selectedTab = "local";

		// return true on failure, that is when the dialog should be kept open
		let onFileConfirmation = function () {
			if (selectedTab == "device" && mode == DialogMode.OPEN) {
				loadDeviceBtn.click();
				return true;
			} else {
				let fn = name.value;
				if (fn != "") {
					if (allowNewFilename || files.indexOf(fn) >= 0) {
						onSelection(
							selectedTab == "device"
								? deviceFile(fn, "")
								: localFile(fn)
						);
						return false; // close dialog
					}
				}
				return true; // keep dialog open
			}
		};

		// create dialog and its controls
		let dlg = tgui.createModal({
			title: dialogTitle[mode],
			scalesize: [0.5, 0.7],
			minsize: [440, 260],
			buttons: [
				{
					text: confirmText[mode],
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

		let tabs = tgui.createElement({
			parent: dlg.content,
			type: "div",
			style: {
				display: "flex",
				"flex-direction": "row",
				"justify-content": "space-between",
				width: "100%",
				height: "43px",
				"margin-top": "0px",
				left: "0px",
				right: "0px",
				padding: "7px 0px 0px 10px",
				position: "absolute",
			},
			classname: "tgui-modal-tabs",
		});

		let loadDeviceBtn;

		let localBtn = tgui.createElement({
			parent: tabs,
			type: "button",
			style: {
				//flex: 1,
				"margin-right": "10px",
				width: "130px",
			},
			text: "Browser Storage",
			click: selectLocal,
			classname: "tgui-modal-selected-tab-button",
		});

		let deviceBtn = tgui.createElement({
			parent: tabs,
			type: "button",
			style: {
				//flex: 1,
				//"margin-right": "10px",

				width: "130px",
				"margin-right": "auto",
			},
			text: "Device Storage",
			click: selectDevice,
			classname: "tgui-modal-tab-button",
		});
		function selectLocal() {
			selectedTab = "local";
			divLocalStorage.style.display = "flex";
			localBtn.classList.replace(
				"tgui-modal-tab-button",
				"tgui-modal-selected-tab-button"
			);
			divDeviceStorage.style.display = "none";
			deviceBtn.classList.replace(
				"tgui-modal-selected-tab-button",
				"tgui-modal-tab-button"
			);
		}

		function selectDevice() {
			selectedTab = "device";
			divLocalStorage.style.display = "none";
			localBtn.classList.replace(
				"tgui-modal-selected-tab-button",
				"tgui-modal-tab-button"
			);
			divDeviceStorage.style.display = "flex";
			deviceBtn.classList.replace(
				"tgui-modal-tab-button",
				"tgui-modal-selected-tab-button"
			);
			//if(mode == DialogMode.OPEN) loadDeviceBtn.click();
		}

		let tabStyle = {
			flex: "auto",
			"flex-direction": "column",
			"justify-content": "space-between",

			width: "100%",
			//height: allowNewFilename ? "calc(100% - 100px)": "calc(100% - 50px)",
			//left: "0px",
			//top: "50px",
			//position: "absolute",
			padding: "0px 0px",
			"margin-top": "50px",
		};

		let divLocalStorage = tgui.createElement({
			parent: dlg.content,
			type: "div",
			style: { ...tabStyle, display: "flex" },
		});

		var focusedElement;
		let name = { value: file.filename }; // replaced by the text box
		// local storage
		{
			let toolbar = tgui.createElement({
				parent: divLocalStorage,
				type: "div",
				style: {
					display: "flex",
					"flex-direction": "row",
					"justify-content": "space-between",
					width: "100%",
					height: "25px",
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

				let importBtn = tgui.createElement({
					parent: toolbar,
					type: "button",
					style: {
						width: "100px",
						height: "100%",
						"margin-right": "10px",
					},
					text: "Import",
					click: () => importFile(),
					classname: "tgui-modal-button",
				});

				let exportBtn = tgui.createElement({
					parent: toolbar,
					type: "button",
					style: {
						width: "100px",
						height: "100%",
						"margin-right": "10px",
					},
					text: "Export",
					click: () => exportFile(name.value),
					classname: "tgui-modal-button",
				});

				// allow multiple selection: export selected
				// TODO: allow to export all TScript files at once to a zip file
				// TODO: allow to export whole TScript local storage

				let status = tgui.createElement({
					parent: toolbar,
					type: "label",
					style: {
						flex: 1,
						height: "100%",
						"white-space": "nowrap",
					},
					text:
						(files.length > 0 ? files.length : "No") +
						" document" +
						(files.length == 1 ? "" : "s"),
					classname: "tgui-status-box",
				});
			}
			// end toolbar

			let list = tgui.createElement({
				parent: divLocalStorage,
				type: "select",
				properties: {
					size: Math.max(2, files.length),
					multiple: false,
				},
				classname: "tgui-list-box",
				style: {
					flex: "auto",
					//background: "#fff",
					margin: "7px 0px",
					overflow: "scroll",
				},
			});

			// populate options
			for (let i = 0; i < files.length; i++) {
				let option = new Option(files[i], files[i]);
				list.options[i] = option;
			}

			// event handlers
			list.addEventListener("change", function (event) {
				if (event.target && event.target.value)
					name.value = event.target.value;
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

			focusedElement = list;

			function deleteFile(filename) {
				let index = files.indexOf(filename);
				if (index >= 0) {
					let onDelete = () => {
						localStorage.removeItem("tscript.code." + filename);
						files.splice(index, 1);
						list.remove(index);
					};

					tgui.msgBox({
						title: "Delete file",
						icon: tgui.msgBoxExclamation,
						prompt: 'Delete file "' + filename + '"\nAre you sure?',
						buttons: [
							{
								text: "Delete",
								isDefault: true,
								onClick: onDelete,
							},
							{ text: "Cancel" },
						],
					});
				}
			}

			function exportFile(filename) {
				let data = filename
					? localStorage.getItem("tscript.code." + filename)
					: null;
				if (data == null) {
					if (mode == DialogMode.SAVE) {
						tgui.msgBox({
							prompt: "There is no file to export. To save directly to the device switch to device storage or click on save current.",
							icon: tgui.msgBoxInformation,
							title: "Export File",
							buttons: [
								{
									text: "Save Current",
									onClick: () => selectDevice(),
									isDefault: true,
								},
								{ text: "Cancel" },
							],
						});
					}
					return;
				}

				if (filename == file.filename && mode == DialogMode.SAVE) {
					tgui.msgBox({
						prompt: "This only exports the old file contents. To save directly to the device switch to device storage or click on save current.",
						icon: tgui.msgBoxInformation,
						title: "Export File",
						buttons: [
							{
								text: "Export Old",
								onClick: () =>
									saveDevice(filename + ".tscript", data),
								isDefault: true,
							},
							{
								text: "Save Current",
								onClick: () => selectDevice(),
							},
							{ text: "Cancel" },
						],
					});
				} else {
					saveDevice(filename + ".tscript", data);
				}
			}

			function importFile() {
				loadDevice(/*multiple*/ true, (filename, content) => {
					if (files.includes(filename)) {
						/*if(!confirm("Replace file \"" + filename + "\"\nAre you sure?"))
                        {
                            return;
                        }*/
					}
					localStorage.setItem("tscript.code." + filename, content);
					if (!files.includes(filename)) {
						files.push(filename);
						let option = new Option(filename, filename);
						list.appendChild(option);
					}
				});
			}
		}

		let divDeviceStorage = tgui.createElement({
			parent: dlg.content,
			type: "div",
			style: { ...tabStyle, display: "none" },
		});

		{
			if (mode == DialogMode.OPEN) {
				loadDeviceBtn = tgui.createElement({
					parent: divDeviceStorage,
					type: "button",
					style: {
						width: "100%",
						height: "25px",
					},
					text: "Load file from disk",
					click: () => {
						loadDevice(false, (filename, content) => {
							onSelection(deviceFile(filename, content));
							tgui.stopModal(dlg);
						});
					},
					classname: "tgui-modal-button",
				});
			} else {
				//tgui.createText("Type the filename into the text box and click on Save to download the file.", divDeviceStorage);
			}
		}

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

				properties: {
					type: "text",
					placeholder: "Filename",
					value: file.filename,
				},
			});
			focusedElement = name;
		}

		if (file.isDevice) selectDevice();

		tgui.startModal(dlg);
		focusedElement.focus();
		return dlg;
	}

	/*export function fileDlg(
		title: string,
		filename: string,
		allowNewFilename: boolean,
		confirmText: string,
		onOkay
	) {
	}*/
}
