import { icons } from "../icons";
import * as tgui from "../tgui";
import { type Panel } from "../tgui/panels";
import { projectsFSP, rmdirRecursive } from "../projects-fs";
import { createEditorTab } from "./editor-tabs";
import { collection } from "./index";
import { deleteFileDlg } from "./dialogs";

type FileTreeNode = {
	/** path relative to project root */
	path: string;
	/** part of path after last / */
	basename: string;
	parent: FileTreeNode | null;
	type: "dir" | "file";
	/**
	 * Reference to the corresponding TreeNodeInfo of the file tree. undefined
	 * if this node has not yet been rendered.
	 */
	treeNodeInfo: tgui.TreeNodeInfo<FileTreeNode> | undefined;
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
	private selectedNode: FileTreeNode | null = null;

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
	}

	async init() {
		this.treeControl.update();
	}

	async changeRootDir(dir: string | null) {
		await this.selectNode(null);
		this.dir = dir;
		await this.treeControl.update();
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
			return await this.info(
				{
					type: "dir",
					basename: "",
					path: "/",
					parent: null,
					treeNodeInfo: undefined,
				},
				"/"
			);
		}
		if (value.treeNodeInfo) {
			return value.treeNodeInfo;
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
				children.push({
					type: stat.type,
					path: projRelEntry,
					basename: entry,
					parent: value,
					treeNodeInfo: undefined,
				});
				ids.push(absEntry);
			}
		}
		value.treeNodeInfo = {
			element: tgui.createElement({
				type: "span",
				text: formatPath(value, true),
			}),
			children,
			ids,
			// open all directories in root directory
			opened: value.parent !== null && value.parent.parent === null,
		};
		return value.treeNodeInfo;
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

	private async selectNode(node: FileTreeNode | null) {
		if (this.selectedNode) {
			this.selectedNode.treeNodeInfo!.element!.classList.remove(
				"file-tree-selected"
			);
		}
		await Promise.resolve();
		this.selectedNode = node;
		if (this.selectedNode) {
			this.selectedNode.treeNodeInfo!.element!.classList.add(
				"file-tree-selected"
			);
		}
	}

	private readonly onNodeDblClick: tgui.NodeEventHandler<
		FileTreeNode,
		"dblclick"
	> = async (_event, value, _id) => {
		this.selectNode(value);
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
			this.selectNode(value);
		};

	private async handleDelete() {
		if (this.selectedNode === null) {
			return;
		}
		const abs = `${this.dir}/${this.selectedNode.path}`;
		const onDlgConfirm = async () => {
			if (this.selectedNode === null) {
				return false;
			}
			switch (this.selectedNode.type) {
				case "dir":
					await rmdirRecursive(abs);
					break;
				case "file":
					await projectsFSP.unlink(abs);
					break;
			}
			this.selectNode(null);
			this.treeControl.update();

			return false;
		};
		deleteFileDlg(formatPath(this.selectedNode), onDlgConfirm);
	}
}
