import { icons } from "../icons";
import * as tgui from "../tgui";
import { type Panel } from "../tgui/panels";
import { projectsFSP, rmdirRecursive } from "../projects-fs";
import { createEditorTab } from "./editor-tabs";

type FileTreeNode = {
	/** path relative to project root */
	path: string;
	/** part of path after last / */
	basename: string;
	parent: FileTreeNode | null;
	type: "dir" | "file";
};

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

export class FileTree {
	private panel: Panel;
	private treeControl: tgui.TreeControl<FileTreeNode>;
	/** The current root directory */
	private dir: string | null = null;

	constructor() {
		this.panel = tgui.createPanel({
			name: "file_tree",
			title: "Files",
			state: "icon",
			fallbackState: "left",
			icon: icons.editor, // TODO add own icon
		});
		this.treeControl = new tgui.TreeControl({
			parent: this.panel.content,
			info: this._info.bind(this),
			cursorStyle: "pointer",
			nodeEventHandlers: {
				dblclick: this.onNodeDblClick.bind(this),
				contextmenu: this.onNodeContextMenu.bind(this),
			},
		});
	}

	async init() {
		this.treeControl.update();
	}

	async changeRootDir(dir: string | null) {
		this.dir = dir;
		await this.treeControl.update();
	}

	/**
	 * Callback for TreeControl.info
	 */
	_info: Exclude<(typeof this.treeControl)["info"], undefined> = async (
		value,
		_node_id
	) => {
		if (this.dir === null) {
			return {
				children: [],
				ids: [],
			};
		}
		if (value === null) {
			// skip to root directory
			return await this._info(
				{
					type: "dir",
					basename: "",
					path: "/",
					parent: null,
				},
				"/"
			);
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
				});
				ids.push(absEntry);
			}
		}
		return {
			element: tgui.createElement({
				type: "span",
				text: value.basename + (value.type === "dir" ? "/" : ""),
			}),
			children,
			ids,
			// open all directories in root directory
			opened: value.parent !== null && value.parent.parent === null,
		};
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

	private readonly onNodeDblClick: tgui.NodeEventHandler<
		FileTreeNode,
		"dblclick"
	> = async (_event, value, _id) => {
		if (value.type === "file") {
			try {
				const absPath = simplifyPath(`${this.dir}/${value.path}`);
				// TODO: same file name in other projects/dirs?
				// TODO: if file is open already, focus this editor instead of creating new one
				const fileContent = await readFileContent(absPath);
				createEditorTab(value.basename, fileContent.toString());
			} catch (error) {
				console.error("Failed to read file:", error);
			}
		}
	};
}
