import { icons } from "../icons";
import * as tgui from "../tgui";
import { type Panel } from "../tgui/panels";
import {
	addListenerOnChangeProject,
	deleteProject,
	getProjectPath,
	pathExists,
	ProjectNotFoundError,
	projectsFSP,
	rmdirRecursive,
	tryCreateProject,
} from "../projects-fs";
import { createEditorTab } from "./editor-tabs";
import { collection, filetree } from "./index";
import { deleteFileDlg, tabNameDlg } from "./dialogs";
import { msgBox } from "../tgui";
import Path from "@isomorphic-git/lightning-fs/src/path";
import { mod } from "../../interop";

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

async function readFileContent(filePath: string): Promise<string> {
	try {
		const fileContent = await projectsFSP.readFile(filePath, {
			encoding: "utf8",
		});
		return fileContent.toString();
	} catch (error) {
		console.error(`path: ${filePath}, Error reading file:`, error);
		return "";
	}
}

export async function saveFileTreeFile(
	fileTreePath: string,
	editorContent: string
) {
	if (!(await pathExists(fileTreePath))) {
		// TODO: handle case, when parent dir is deleted
		let modal = tgui.createModal({
			title: "File not present in file tree anymore",
			scalesize: [0, 0],
			minsize: [400, 120],
			buttons: [
				{
					text: "Delete",
					onClick: () => {
						collection.closeEditor(
							fileTreePath.slice(
								fileTreePath.lastIndexOf("/") + 1
							)
						);
						return;
					},
				},
				{
					text: "Save",
					isDefault: true,
					onClick: async () => {
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

function simplifyPath(path: string): string {
	return path.replaceAll(/\/+/g, "/");
}

type FileTreeControlInfo = Exclude<
	tgui.TreeControl<FileTreeNode>["info"],
	undefined
>;

function checkValidBasename(basename: string): boolean {
	return !basename.includes("/");
}

function informInvalidBasename(_basename: string) {
	msgBox({
		title: "Invalid file name",
		prompt: `File names may not contain "/"`,
	});
}

function informNodeAlreadyExists(path: string) {
	msgBox({
		title: "File or directory exists already",
		prompt: `File or directory "${path}" exists already`,
	});
}

export class FileTree {
	private panel: Panel;
	private treeControl: tgui.TreeControl<FileTreeNode>;
	/** The current root directory */
	private dir: string | null = null;
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

	// list.addEventListener("keydown", async function (event) {
	// 	if (event.key === "Backspace" || event.key === "Delete") {
	// 		event.preventDefault();
	// 		event.stopPropagation();
	// 		await onDelete();
	// 	}
	// });

	constructor() {
		this.panel = tgui.createPanel({
			name: "file_tree",
			title: "Files",
			state: "icon",
			fallbackState: "left",
			icon: icons.editor, // TODO add own icon
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
		tgui.createButton({
			click: this.handleCreate.bind(this),
			parent: topBar,
			text: "New",
		});
		tgui.createButton({
			click: this.handleRename.bind(this),
			parent: topBar,
			text: "Rename",
		});
		tgui.createButton({
			click: this.handleDelete.bind(this),
			parent: topBar,
			text: "Delete",
		});

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
		addListenerOnChangeProject((newProjectName) =>
			this.changeRootDir(
				newProjectName === undefined
					? null
					: getProjectPath(newProjectName)
			)
		);
	}

	init(): Promise<void> {
		return (this.refreshDoneProm = this.refreshDoneProm.then(async () => {
			await this.refresh();
		}));
	}

	changeRootDir(dir: string | null): Promise<void> {
		return (this.refreshDoneProm = this.refreshDoneProm.then(async () => {
			this.dir = dir;
			return await this.refresh();
		}));
	}

	/**
	 * @returns Promise that resolves after this refresh round is done
	 */
	async refresh() {
		this.path2NodeInfo = {};
		this.path2FileTreeNode = {};
		return (this.refreshDoneProm = new Promise((res) => {
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
				res();
			});
		}));
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
				type: "span",
				text: formatPath(value, true),
			}),
			children: children.map(([ftn]) => ftn),
			ids: children.map(([_, id]) => id),
			// open all directories in root directory
			opened: value.parent !== null && value.parent.parent === null,
		};
		this.path2NodeInfo[value.path] = info;
		return info;
	};

	async addSampleContent() {
		return (this.refreshDoneProm = this.refreshDoneProm.then(async () => {
			try {
				await deleteProject("tmp");
			} catch (e) {
				if (!(e instanceof ProjectNotFoundError)) throw e;
			}

			const projName = getProjectPath("tmp");
			if (!(await tryCreateProject("tmp")))
				throw "Sample project should not exist right now";
			await projectsFSP.writeFile(Path.join(projName, "root"), "Hello");
			await projectsFSP.mkdir(Path.join(projName, "sub"));
			await projectsFSP.writeFile(
				Path.join(projName, "sub/file"),
				"Hello file"
			);
			await projectsFSP.mkdir(Path.join(projName, "sub2"));
			await projectsFSP.writeFile(
				Path.join(projName, "sub2/file2"),
				"Hello file2"
			);
			await projectsFSP.mkdir(Path.join(projName, "sub/ssub"));
			await projectsFSP.writeFile(
				Path.join(projName, "sub/ssub/sfile"),
				"Hello sfile"
			);
		}));
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
			try {
				const absPath = simplifyPath(`${this.dir}/${value.path}`);
				console.log(absPath);
				// TODO: same file name in other projects/dirs?
				const existingEditor = collection.getEditor(value.basename);
				if (existingEditor) {
					collection.setActiveEditor(existingEditor);
					existingEditor.focus();
					return;
				}
				const fileContent = await readFileContent(absPath);
				createEditorTab(
					value.basename,
					fileContent.toString(),
					true,
					absPath
				);
			} catch (error) {
				console.error("Failed to read file:", error);
			}
		}
	};

	private readonly onNodeClick: tgui.NodeEventHandler<FileTreeNode, "click"> =
		(_event, value, _id) => {
			this.selectPath(value.path);
		};

	private toAbs(path: string): string {
		if (this.dir === null) throw "root directory is not set";
		return simplifyPath(this.dir! + "/" + path);
	}

	private async handleDelete() {
		if (this.selectedPath === null) {
			return;
		}
		const abs = this.toAbs(this.selectedPath);
		const onDlgConfirm = async () => {
			if (this.selectedPath === null) {
				return false;
			}
			switch (this.pathToFileTreeNode(this.selectedPath)!.type) {
				case "dir":
					await rmdirRecursive(abs);
					break;
				case "file":
					await projectsFSP.unlink(abs);
					break;
			}
			this.selectPath(null);
			await this.refresh();

			return false;
		};
		deleteFileDlg(this.selectedPath, onDlgConfirm);
	}

	private handleCreate() {
		tabNameDlg(async (filename: string) => {
			if (!checkValidBasename(filename)) {
				informInvalidBasename(filename);
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

	private async handleRename() {
		if (this.selectedPath === null) {
			return;
		}
		tabNameDlg(
			async (filename: string) => {
				if (this.selectedPath === null) {
					return false;
				}
				if (!checkValidBasename(filename)) {
					informInvalidBasename(filename);
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
				await projectsFSP.rename(this.toAbs(this.selectedPath), newAbs);
				this.selectPath(newProjPath);
				await this.refresh();
				return false;
			},
			"Rename into...",
			this.pathToFileTreeNode(this.selectedPath)!.basename
		);
	}
}
