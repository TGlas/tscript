import { icons } from "../icons";
import { type TreeControl } from "../tgui";
import * as tgui from "../tgui";
import { type Panel } from "../tgui/panels";
import { projectsFS, projectsFSP, rmdirRecursive } from "../projects-fs";
import { createEditorTab } from "./editor-tabs";
import { collection } from "./index";

type FileTreeNode = {
	/** path relative to project root */
	path: string;
	/** part of path after last / */
	basename: string;
	parent: FileTreeNode | null;
	type: "dir" | "file";
};

async function fileTreeNodeCreateHTML(node: FileTreeNode): Promise<HTMLElement> {
	const newElement = tgui.createElement({
		type: "span",
		text: node.basename + (node.type === "dir" ? "/" : ""),
	});

	newElement.addEventListener("dblclick", async () => {
		if (node.type === "file") {
			try {
				// TODO: get root dir instead of /tmp hardcoded, pass as to fileTreeNodeCreateHTML as param?
				const absPath = simplifyPath(`/tmp${node.parent?.path}/${node.basename}`);
				// TODO: same file name in other projects/dirs?
				const existingEditor = collection.getEditor(node.basename);
				if (existingEditor) {
					collection.setActiveEditor(existingEditor);
					existingEditor.focus();
					return;
				}
				const fileContent = await readFileContent(absPath);
				createEditorTab(node.basename, fileContent.toString());
			} catch (error) {
				console.error("Failed to read file:", error);
			}
		}
	});

	return newElement;
}

async function readFileContent(filePath: string): Promise<string> {
	try {
	  const fileContent = await projectsFSP.readFile(filePath, { encoding: "utf8" });
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
	_panel: Panel;
	_treeControl: TreeControl<FileTreeNode>;
	_dir: string | null = null;

	constructor() {
		this._panel = tgui.createPanel({
			name: "file_tree",
			title: "Files",
			state: "icon",
			fallbackState: "left",
			icon: icons.editor, // TODO add own icon
		});
		this._treeControl = undefined as unknown as typeof this._treeControl;
	}

	async init() {
		this._treeControl = await tgui.createTreeControl({
			parent: this._panel.content,
			info: this._info.bind(this),
		});
		(this._treeControl as any).update(this._treeControl.info);
	}

	async changeRootDir(dir: string | null) {
		this._dir = dir;
		await (this._treeControl as any).update(this._treeControl.info);
	}

	/**
	 * Callback for TreeControl.info
	 */
	_info: Exclude<(typeof this._treeControl)["info"], undefined> = async (
		value,
		_node_id
	) => {
		if (this._dir === null) {
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
			const absPath = simplifyPath(`${this._dir}/${value.path}`);
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
			element: await fileTreeNodeCreateHTML(value),
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
}
