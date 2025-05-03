import { icons } from "../icons";
import * as tgui from "../tgui";
import { type Panel } from "../tgui/panels";
import { pathExists, projectsFSP, rmdirRecursive } from "../projects-fs";
import { createEditorTab } from "./editor-tabs";
import { collection } from "./index";
import { deleteFileDlg, tabNameDlg } from "./dialogs";
import { msgBox } from "../tgui";
import Path from "@isomorphic-git/lightning-fs/src/path";

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
		console.error("Error reading file:", error);
		return "";
	}
}

function simplifyPath(path: string): string {
	return path.replaceAll(/\/+/g, "/");
}

type FileTreeControlInfo = Exclude<
	tgui.TreeControl<FileTreeNode>["info"],
	undefined
>;

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
			click: this.handleDelete.bind(this),
			parent: topBar,
			text: "Delete",
		});

		this.treeControl = new tgui.TreeControl({
			parent: this.panel.content,
			info: this.info.bind(this),
			cursorStyle: "pointer",
			nodeEventHandlers: {
				dblclick: this.onNodeDblClick.bind(this),
				click: this.onNodeClick.bind(this),
			},
		});
		this.path2NodeInfo = {};
		this.path2FileTreeNode = {};
	}

	async init() {
		await this.refresh();
	}

	async changeRootDir(dir: string | null) {
		this.dir = dir;
		await this.refresh();
	}

	async refresh() {
		this.path2NodeInfo = {};
		this.path2FileTreeNode = {};
		await this.treeControl.update();
		if (
			this.selectedPath &&
			this.pathToNodeInfo(this.selectedPath) === null
		) {
			this.selectPath(null);
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
		const children: FileTreeNode[] = [];
		const ids: string[] = [];
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
				children.push(ftn);
				ids.push(absEntry);
			}
		}
		info = {
			element: tgui.createElement({
				type: "span",
				text: formatPath(value, true),
			}),
			children,
			ids,
			// open all directories in root directory
			opened: value.parent !== null && value.parent.parent === null,
		};
		this.path2NodeInfo[value.path] = info;
		return info;
	};

	async addSampleContent() {
		try {
			await rmdirRecursive("/tmp");
		} catch (e) {
			if ((e as any).code !== "ENOENT") throw e;
		}

		await projectsFSP.mkdir("/tmp");
		await projectsFSP.writeFile("/tmp/root", "Hello");
		await projectsFSP.mkdir("/tmp/sub");
		await projectsFSP.writeFile("/tmp/sub/file", "Hello file");
		await projectsFSP.mkdir("/tmp/sub2");
		await projectsFSP.writeFile("/tmp/sub2/file2", "Hello file2");
		await projectsFSP.mkdir("/tmp/sub/ssub");
		await projectsFSP.writeFile("/tmp/sub/ssub/sfile", "Hello sfile");
		await this.changeRootDir("/tmp");
	}

	private pathToNodeInfo(
		path: string
	): tgui.TreeNodeInfo<FileTreeNode> | null {
		return this.path2NodeInfo[path] ?? null;
	}

	private pathToFileTreeNode(path: string): FileTreeNode | null {
		return this.path2FileTreeNode[path] ?? null;
	}

	private async selectPath(path: string | null) {
		if (this.selectedPath) {
			this.pathToNodeInfo(this.selectedPath)!.element!.classList.remove(
				"file-tree-selected"
			);
		}
		await Promise.resolve();
		this.selectedPath = path;
		if (this.selectedPath) {
			this.pathToNodeInfo(this.selectedPath)!.element!.classList.add(
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
				// TODO: same file name in other projects/dirs?
				const existingEditor = collection.getEditor(value.basename);
				if (existingEditor) {
					collection.setActiveEditor(existingEditor);
					existingEditor.focus();
					return;
				}
				const fileContent = await readFileContent(absPath);
				createEditorTab(value.basename, fileContent.toString());
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
		deleteFileDlg(abs, onDlgConfirm);
	}

	private async handleCreate() {
		tabNameDlg(async (filename) => {
			if (filename.includes("/")) {
				msgBox({
					title: "Invalid file name",
					prompt: `File names may not contain "/"`,
				});
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
				msgBox({
					title: "File or directory exists already",
					prompt: `File or directory "${projAbs}" exists already`,
				});
				return true;
			}

			await projectsFSP.writeFile(abs, "");
			await this.refresh();
			return false;
		}, "New file");
	}
}
