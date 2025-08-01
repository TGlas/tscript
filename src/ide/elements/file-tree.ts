import { icons } from "../icons";
import * as tgui from "../tgui";
import { type Panel } from "../tgui/panels";
import {
	addListenerOnChangeProject,
	isInvalidBasename,
	deleteProject,
	getCurrentProject,
	getProjectPath,
	pathExists,
	ProjectNotFoundError,
	projectsFSP,
	rmdirRecursive,
	tryCreateProject,
	simplifyPath,
	readFileContent,
	setCurrentProject,
} from "../projects-fs";
import { collection, filetree } from "./index";
import { deleteFileDlg, tabNameDlg } from "./dialogs";
import { errorMsgBox, msgBox } from "../tgui";
import Path from "@isomorphic-git/lightning-fs/src/path";
import {
	FileID,
	fileIDHasNamespace,
	fileIDNamespaces,
	projectFileID,
	ProjectFileID,
	projectFileIDToProjAbsPath,
	projectFileIDSplit,
	splitFileIDAtColon,
} from "../../lang/parser/file_id";
import { Editor } from "../editor";
import { EditorController } from "./editor-controller";
import { closeProjectEditorTabsRecursively } from "../editor/editor";

type FileTreeNode = {
	/** path relative to project root */
	path: string;
	/** part of path after last / */
	basename: string;
	parent: FileTreeNode | null;
	type: "dir" | "file";
};

/**
 * @param node The node whose path we format
 * @param basename if true, format basename instead
 */
function formatPath(node: FileTreeNode, basename: boolean = false): string {
	const str = basename ? node.basename : node.path;
	return node.type === "dir" ? str + "/" : str;
}

async function createMissingDirectories(fileTreePath: string) {
	const parts = fileTreePath.split("/");
	if (parts[0] === "") {
		// sanity check, should always be the case, because path starts with '/'
		parts.shift();
	}
	const currentProjectName = getCurrentProject();
	if (parts[0] !== currentProjectName) {
		msgBox({
			title: "File from other project",
			prompt: `Cannot save this file from project ${parts[0]} in currently open project ${currentProjectName}`,
		});
		return false;
	}

	const projPath = getProjectPath(currentProjectName);
	let currentPath = projPath;
	for (let i = 1; i < parts.length - 1; i++) {
		currentPath = Path.join(currentPath, parts[i]);
		if (!(await pathExists(currentPath))) {
			await projectsFSP.mkdir(currentPath);
		}
	}
	return true;
}

export async function saveFileTreeFile(
	fileID: ProjectFileID,
	editorContent: string
) {
	const [projName, projAbsPath] = projectFileIDSplit(fileID);
	const fileTreePath = Path.join(getProjectPath(projName), projAbsPath);
	if (!(await pathExists(fileTreePath))) {
		let modal = tgui.createModal({
			title: "File not present in file tree anymore",
			scalesize: [0, 0],
			minsize: [400, 120],
			buttons: [
				{
					text: "Delete",
					onClick: () => {
						collection.getEditor(fileID)?.close();
						return;
					},
				},
				{
					text: "Save",
					isDefault: true,
					onClick: async () => {
						if (!(await createMissingDirectories(fileTreePath))) {
							return;
						}
						await projectsFSP.writeFile(
							fileTreePath,
							editorContent
						);
						await filetree.refresh();
					},
				},
				{
					text: "Cancel",
				},
			],
			enterConfirms: true,
			contentstyle: {
				display: "flex",
				"align-items": "center",
			},
		});
		tgui.createText(
			"Irreversibly delete file content or save it again at old location in file tree?",
			modal.content
		);
		tgui.startModal(modal);
		return;
	}
	await projectsFSP.writeFile(fileTreePath, editorContent);
	await filetree.refresh();
}

function renameFilePathsInEditors(
	projectName: string,
	oldPath: string,
	newPath: string
) {
	const eds = collection.editors;
	for (const ed of eds) {
		const edFileID = ed.filename;
		if (!fileIDHasNamespace(edFileID, "project")) {
			continue;
		}
		const [edProjName, curPath] = projectFileIDSplit(edFileID);
		if (edProjName !== projectName) {
			continue;
		}
		if (curPath === oldPath) {
			// This editors file has been renamedS
			renameEditor(ed, projectFileID(projectName, newPath));
		} else if (curPath.startsWith(oldPath + "/")) {
			// renamed ancestor directory of editor file
			const newEdPath = Path.join(newPath, curPath.slice(oldPath.length));
			renameEditor(ed, projectFileID(projectName, newEdPath));
		} else {
			// Editor file not affected
			continue;
		}
	}
	return;

	function renameEditor(ed: EditorController, newFile: FileID) {
		const text = ed.editorView.text();
		ed.close();
		collection.openEditorFromData(newFile, text);
	}
}

export function fileTreePathToProjectNameFileName(fileTreePath: string): {
	project: string;
	filename: string;
} {
	const pathSegments = simplifyPath(fileTreePath)
		.split("/")
		.filter((val) => val.length > 0);
	const project = pathSegments[0];
	const filename = pathSegments.slice(1).join("/");
	return { project, filename };
}

type FileTreeControlInfo = Exclude<
	tgui.TreeControl<FileTreeNode>["info"],
	undefined
>;

function informInvalidBasename(msg: string, isFile: boolean = true) {
	isFile
		? msgBox({
				title: "Invalid file name",
				prompt: `Filenames ${msg}`,
		  })
		: msgBox({
				title: "Invalid directory name",
				prompt: `Directory names ${msg}`,
		  });
}

function informNodeAlreadyExists(path: string) {
	msgBox({
		title: "File or directory exists already",
		prompt: `File or directory "${path}" exists already`,
	});
}

/**
 * This class manages its async operations by itself: The public methods that return a
 * Promise (init, changeRootDir, refresh, addSampleContent) can be called
 * without awaiting, and it will be guaranteed that these calls will be executed
 * sequentially (one after another by chaining them using Promise.then)
 */
export class FileTree {
	panel: Panel;
	private treeControl: tgui.TreeControl<FileTreeNode>;
	/** The current root directory */
	private dir: string | null = null;
	private openedProject: string | null = null;
	private selectedPath: string | null = null;
	/**
	 * Map from a project-absolute path to the corresponding
	 * `TreeNodeInfo`
	 */
	private path2NodeInfo: Record<string, tgui.TreeNodeInfo<FileTreeNode>>;
	private path2FileTreeNode: Record<string, FileTreeNode>;
	/**
	 * All tasks that would interfere with refresh should .then to this and
	 * overwrite this with the resulting promise
	 */
	private refreshDoneProm: Promise<void> = Promise.resolve();
	private buttons: HTMLButtonElement[];

	constructor() {
		this.panel = tgui.createPanel({
			name: "file_tree",
			title: "Files (No project selected)",
			state: "icon",
			fallbackState: "left",
			icon: icons.fileTree,
		});

		const topBar = tgui.createElement({
			type: "div",
			style: {
				width: "100%",
				height: "25px",
			},
			parent: this.panel.content,
		});

		tgui.createElement({
			type: "hr",
			classname: "file-tree",
			parent: this.panel.content,
		});
		const btnNew = tgui.createButton({
			click: this.handleCreate.bind(this),
			parent: topBar,
			text: "New",
		});
		const btnRename = tgui.createButton({
			click: this.handleRename.bind(this),
			parent: topBar,
			text: "Rename",
		});
		const btnDelete = tgui.createButton({
			click: this.handleDelete.bind(this),
			parent: topBar,
			text: "Delete",
		});
		const btnNewDir = tgui.createButton({
			click: this.handleCreateDir.bind(this),
			parent: topBar,
			text: "New Dir",
		});
		const btnCloseProject = tgui.createButton({
			click: this.handleCloseProject.bind(this),
			parent: topBar,
			text: "Close Project",
		});
		this.buttons = [
			btnNew.dom,
			btnRename.dom,
			btnDelete.dom,
			btnNewDir.dom,
			btnCloseProject.dom,
		];
		this.setButtonsDisabled(true);

		const treeContainer = tgui.createElement({
			type: "div",
			style: {
				overflowY: "hidden",
				overflowX: "hidden",
				height: "calc(100% - 30px)",
			},
			parent: this.panel.content,
		});

		this.treeControl = new tgui.TreeControl({
			parent: treeContainer,
			info: this.info.bind(this),
			cursorStyle: "pointer",
			nodeEventHandlers: {
				dblclick: this.onNodeDblClick.bind(this),
				click: this.onNodeClick.bind(this),
			},
		});
		this.path2NodeInfo = {};
		this.path2FileTreeNode = {};
		addListenerOnChangeProject((newProjectName) => {
			this.changeRootDir(newProjectName ?? null);
		});

		this.panel.content.setAttribute("tabindex", "0");
		this.panel.content.addEventListener(
			"keydown",
			async (event: KeyboardEvent) => {
				if (event.key === "Backspace" || event.key === "Delete") {
					event.preventDefault();
					event.stopPropagation();
					await this.handleDelete();
				}
			}
		);
	}

	/**
	 * asynchroncity managed internally by the instance, see class description
	 */
	init(): Promise<void> {
		return this.chainToPromise(async () => {
			await this.refreshMux(true);
		});
	}

	/**
	 * asynchroncity managed internally by the instance, see class description
	 */
	changeRootDir(newProjectName: string | null): Promise<void> {
		const dir =
			newProjectName === null ? null : getProjectPath(newProjectName);
		return this.chainToPromise(async () => {
			this.dir = dir;
			this.openedProject = newProjectName;
			return await this.refreshMux(true);
		});
	}

	/**
	 * @returns Promise that resolves after this refresh round is done
	 *
	 * asynchroncity managed internally by the instance, see class description
	 */
	refresh(): Promise<void> {
		return this.refreshMux(false);
	}

	/**
	 * @param hasLocak If true, then the execution is not chained to
	 * {@link refreshDoneProm} but executed immediately. This should be true if
	 * coming from an already sequentialized call, i.e., there is no concurrent
	 * call to any async method of this instance and the current call needs to
	 * be completed for this.refreshDoneProm to be resolved.
	 */
	private refreshMux(hasLock: boolean = false): Promise<void> {
		/**
		 * Performs update and returns promise that resolves when it's done
		 */
		const performUpdate = (): Promise<void> => {
			this.setButtonsDisabled(true);
			this.path2NodeInfo = {};
			this.path2FileTreeNode = {};
			return new Promise((res) => {
				this.treeControl.update(undefined, async () => {
					if (
						this.selectedPath &&
						this.pathToNodeInfo(this.selectedPath) === null
					) {
						this.selectPath(null);
					} else {
						// add the css class
						this.selectPath(this.selectedPath);
					}
					if (this.projectName !== null) {
						this.setButtonsDisabled(false);
					}
					res(undefined);
				});
			});
		};

		if (hasLock) {
			return performUpdate();
		} else {
			return this.chainToPromise(performUpdate);
		}
	}

	private setButtonsDisabled(disabled: boolean) {
		for (const btn of this.buttons) {
			btn.disabled = disabled;
		}
	}

	/**
	 * Callback for TreeControl.info
	 */
	private readonly info: FileTreeControlInfo = async (
		value,
		_node_id
	): Promise<tgui.TreeNodeInfo<FileTreeNode>> => {
		if (this.dir === null) {
			return {
				children: [],
				ids: [],
			};
		}
		if (value === null) {
			// skip to root directory
			const rootFTNode = {
				type: "dir",
				basename: "",
				path: "/",
				parent: null,
			} as const;
			this.path2FileTreeNode[rootFTNode.path] = rootFTNode;
			return await this.info(rootFTNode, rootFTNode.path);
		}
		let info = this.pathToNodeInfo(value.path);
		if (info !== null) {
			return info;
		}
		const children: [FileTreeNode, string][] = [];
		if (value.type === "dir") {
			const absPath = simplifyPath(`${this.dir}/${value.path}`);
			const dir = await projectsFSP.readdir(absPath);
			for (const entry of dir) {
				const absEntry = simplifyPath(`${absPath}/${entry}`);
				const projRelEntry = simplifyPath(`${value.path}/${entry}`);
				if (projRelEntry === "/.git") {
					continue;
				}
				const stat = await projectsFSP.stat(absEntry);
				const ftn = {
					type: stat.type,
					path: projRelEntry,
					basename: entry,
					parent: value,
				};
				this.path2FileTreeNode[ftn.path] = ftn;
				children.push([ftn, absEntry]);
			}
		}
		const strcmp = (s: string, t: string) => (s < t ? -1 : s == t ? 0 : 1);
		children.sort(([ftn1], [ftn2]) => {
			if (ftn1.type === "dir") {
				return ftn2.type === "dir" ? strcmp(ftn1.path, ftn2.path) : -1;
			} else {
				return ftn2.type === "dir" ? 1 : strcmp(ftn1.path, ftn2.path);
			}
		});
		info = {
			element: tgui.createElement({
				type: "div",
				text: formatPath(value, true),
				style: {
					minWidth: "8px",
					width: "fit-content",
					minHeight: "var(--general-page-style--line-height)",
				},
			}),
			children: children.map(([ftn]) => ftn),
			ids: children.map(([_, id]) => id),
			// open all directories in root directory
			opened: value.parent !== null && value.parent.parent === null,
		};
		this.path2NodeInfo[value.path] = info;
		return info;
	};

	/**
	 * asynchroncity managed internally by the instance, see class description
	 */
	async addSampleContent() {
		return this.chainToPromise(async () => {
			try {
				await deleteProject("tmp");
			} catch (e) {
				if (!(e instanceof ProjectNotFoundError)) throw e;
			}

			const projName = getProjectPath("tmp");
			if (!(await tryCreateProject("tmp")))
				throw "Sample project should not exist right now";
			await projectsFSP.writeFile(
				Path.join(projName, "root"),
				`\
include "sub/file";
print("Hello");`
			);
			await projectsFSP.mkdir(Path.join(projName, "sub"));
			await projectsFSP.writeFile(
				Path.join(projName, "sub/file"),
				`\
include "../sub2/file2";
include "ssub/sfile";
print("Hello file");`
			);
			await projectsFSP.mkdir(Path.join(projName, "sub2"));
			await projectsFSP.writeFile(
				Path.join(projName, "sub2/file2"),
				`\
include "/sub/ssub/sfile";
print("Hello file2");`
			);
			await projectsFSP.mkdir(Path.join(projName, "sub/ssub"));
			await projectsFSP.writeFile(
				Path.join(projName, "sub/ssub/sfile"),
				`\
include "../../root";
print("Hello sfile");`
			);
		});
	}

	private pathToNodeInfo(
		path: string
	): tgui.TreeNodeInfo<FileTreeNode> | null {
		return this.path2NodeInfo[path] ?? null;
	}

	private pathToFileTreeNode(path: string): FileTreeNode | null {
		return this.path2FileTreeNode[path] ?? null;
	}

	private selectPath(path: string | null) {
		if (this.selectedPath) {
			this.pathToNodeInfo(this.selectedPath)?.element?.classList.remove(
				"file-tree-selected"
			);
		}
		this.selectedPath = path;
		if (this.selectedPath) {
			this.pathToNodeInfo(this.selectedPath)?.element?.classList.add(
				"file-tree-selected"
			);
		}
	}

	private readonly onNodeDblClick: tgui.NodeEventHandler<
		FileTreeNode,
		"dblclick"
	> = async (_event, value, _id) => {
		this.selectPath(value.path);
		if (value.type === "file") {
			const fileID = projectFileID(
				this.openedProject!,
				simplifyPath(value.path)
			);
			const ed = await collection.openEditorFromFile(fileID);
			if (ed instanceof Error || ed === null) {
				errorMsgBox(
					`Could not open file: ${
						ed === null ? "Doesn't exists" : ed.message
					}`
				);
				return;
			}
		}
	};

	private readonly onNodeClick: tgui.NodeEventHandler<FileTreeNode, "click"> =
		(_event, value, _id) => {
			if (this.selectedPath === value.path) {
				this.selectPath(null);
			} else {
				this.selectPath(value.path);
			}
		};

	private toAbs(path: string): string {
		if (this.dir === null) throw "root directory is not set";
		return simplifyPath(this.dir! + "/" + path);
	}

	private async handleDelete() {
		if (this.openedProject === null || this.selectedPath === null) return;
		const proj = this.openedProject;
		const abs = this.toAbs(this.selectedPath);
		const projAbsDeletePath = this.selectedPath;
		const onDlgConfirm = async () => {
			switch (this.pathToFileTreeNode(projAbsDeletePath)!.type) {
				case "dir":
					await closeProjectEditorTabsRecursively(
						proj,
						projAbsDeletePath
					);
					await rmdirRecursive(abs);
					break;
				case "file":
					collection
						.getEditor(projectFileID(proj, projAbsDeletePath))
						?.close();
					await projectsFSP.unlink(abs);
					break;
			}
			this.chainToPromise(async () => {
				this.selectPath(null);
				await this.refreshMux(true);
			});

			return false;
		};
		deleteFileDlg(this.selectedPath, onDlgConfirm);
	}

	private handleCreate() {
		tabNameDlg(async (filename: string) => {
			const namingErr = isInvalidBasename(filename);
			if (namingErr !== undefined) {
				informInvalidBasename(namingErr);
				return true;
			}
			/* set to "/" if nothing selected, dirname if file selected, path if
			 * directory selected
			 */
			let basePath = "/";
			if (this.selectedPath !== null) {
				const selectedNode = this.pathToFileTreeNode(
					this.selectedPath
				)!;

				basePath =
					selectedNode.type === "file"
						? Path.dirname(this.selectedPath)
						: this.selectedPath;
			}

			const projAbs = Path.join(basePath, filename);
			const abs = this.toAbs(projAbs);
			if (await pathExists(abs)) {
				informNodeAlreadyExists(projAbs);
				return true;
			}

			await projectsFSP.writeFile(abs, "");
			await this.refresh();
			return false;
		}, "New file");
	}

	private handleCreateDir() {
		tabNameDlg(
			async (dirname: string) => {
				const namingErr = isInvalidBasename(dirname);
				if (namingErr !== undefined) {
					informInvalidBasename(namingErr, false);
					return true;
				}
				/* set to "/" if nothing selected, dirname if file selected, path if
				 * directory selected
				 */
				let basePath = "/";
				if (this.selectedPath !== null) {
					const selectedNode = this.pathToFileTreeNode(
						this.selectedPath
					)!;

					basePath =
						selectedNode.type === "file"
							? Path.dirname(this.selectedPath)
							: this.selectedPath;
				}

				const projAbs = Path.join(basePath, dirname);
				const abs = this.toAbs(projAbs);
				if (await pathExists(abs)) {
					informNodeAlreadyExists(projAbs);
					return true;
				}

				await projectsFSP.mkdir(abs);
				await this.refresh();
				return false;
			},
			"New directory",
			undefined,
			"Directory name"
		);
	}

	private async handleRename() {
		if (this.selectedPath === null) {
			return;
		}
		const projName = this.openedProject;
		if (projName === null) return;
		tabNameDlg(
			async (filename: string) => {
				if (this.selectedPath === null) {
					return false;
				}
				const namingErr = isInvalidBasename(filename);
				if (namingErr !== undefined) {
					informInvalidBasename(namingErr);
					return true;
				}
				const newProjPath = Path.join(
					Path.dirname(this.selectedPath),
					filename
				);
				const newAbs = this.toAbs(newProjPath);
				if (await pathExists(newAbs)) {
					informNodeAlreadyExists(newProjPath);
					return true;
				}
				renameFilePathsInEditors(
					projName,
					simplifyPath(this.selectedPath),
					simplifyPath(newProjPath)
				);
				await projectsFSP.rename(this.toAbs(this.selectedPath), newAbs);
				this.chainToPromise(async () => {
					await this.refreshMux(true);
					this.selectPath(newProjPath);
				});
				return false;
			},
			"Rename into...",
			this.pathToFileTreeNode(this.selectedPath)!.basename
		);
	}

	private handleCloseProject() {
		setCurrentProject(undefined);
	}

	/**
	 * Adds {@link callback} to sequentialized queue and returns Promise that
	 * resolves once {@link callback} is done.
	 */
	private chainToPromise(callback: () => Promise<void>): Promise<void> {
		return (this.refreshDoneProm = this.refreshDoneProm
			.then(callback)
			.catch((e) => {
				const msg = e instanceof Error ? e.message : "" + e;
				errorMsgBox(`Error in file tree: ${msg}`);
			}));
	}

	get projectName(): string | null {
		return this.openedProject;
	}
}
