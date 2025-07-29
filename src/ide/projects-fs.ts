import FS from "@isomorphic-git/lightning-fs";
import Path from "@isomorphic-git/lightning-fs/src/path";
import { saveConfig } from "./elements/dialogs";
import { filetree } from "./elements";

/**
 * The error handling of lightning-fs is not that great. Currently, the
 * following error codes (given as .code on a thrown error) can occur:
 * EEXIST, ENOENT, ENOTDIR, ENOTEMPTY, ETIMEDOUT
 *
 * When calling readFile on a directory, EISDIR is not thrown, instead undefined
 * is returned.
 */

export const projectsFS = new FS("projects");
export const projectsFSP = projectsFS.promises;

export async function rmdirRecursive(path: string) {
	for (const entry of await projectsFSP.readdir(path)) {
		const abs = `${path}/${entry}`;
		const type = await projectsFSP.lstat(abs);
		if (type.isDirectory()) {
			await rmdirRecursive(abs);
		} else {
			await projectsFSP.unlink(abs);
		}
	}
	await projectsFSP.rmdir(path);
}

export async function pathExists(path: string): Promise<boolean> {
	try {
		await projectsFSP.lstat(path);
	} catch (e) {
		if ((e as any).code === "ENOENT") {
			return false;
		}
		throw e;
	}
	return true;
}

export type OnChangeProjectListener = (
	newProjectName: string | undefined,
	oldProjectName: string | undefined
) => void;

let currentProjectValue: string | undefined = undefined;
const projectChangeListeners: Map<OnChangeProjectListener, true> = new Map();

export function getCurrentProject(): string | undefined {
	return currentProjectValue;
}

export function simplifyPath(path: string): string {
	return path.replaceAll(/\/+/g, "/").replace(/\/$/, "");
}

/**
 * Loads the project with name projectName by calling all registered listeners
 * (via addListenerOnChangeProject).
 * May not be called from within a such listener.
 * @throws {ProjectNotFoundError} if the project doesn't exist
 */
export async function setCurrentProject(
	projectName: string | undefined
): Promise<void> {
	if (projectName === currentProjectValue) {
		return;
	}
	if (
		projectName !== undefined &&
		!(await pathExists(getProjectPath(projectName)))
	) {
		throw new ProjectNotFoundError(projectName);
	}
	const oldProjectName = currentProjectValue;
	currentProjectValue = projectName;
	for (const listener of projectChangeListeners.keys()) {
		listener(projectName, oldProjectName);
	}
	filetree.panel.titlebar.textContent = `Files (${
		projectName ? "Selected project: " + projectName : "No project selected"
	})`;
}

/**
 * @returns true if the project could be created, false if the project exists
 * already
 *
 * @throws {InvalidProjectName}
 */
export async function tryCreateProject(projectName: string): Promise<boolean> {
	const namingErr = isInvalidBasename(projectName);
	if (namingErr !== undefined) {
		throw new InvalidProjectName(projectName, `Project names ${namingErr}`);
	}
	try {
		await projectsFSP.mkdir(getProjectPath(projectName));
		return true;
	} catch (e) {
		if ((e as any).code === "EEXIST") {
			return false;
		}
		throw e;
	}
}

export function isInvalidBasename(basename: string): string | undefined {
	if (basename.includes("/")) return 'may not contain "/"';
	if (basename === ".") return 'may not be "."';
	if (basename === "..") return 'may not be ".."';
	if (basename === "") return "may not be empty";
}

export class ProjectNotFoundError extends Error {
	constructor(projectName: string) {
		super(`Project ${projectName} could not be found`);
	}
}

export class InvalidProjectName extends Error {
	reason: string;
	constructor(projectName: string, reason: string) {
		super(`Invalid project name "${projectName}"`);
		this.reason = reason;
	}
}

/**
 * @throws {ProjectNotFoundError} if the project doesn't exist
 * If the current project was deleted, automatically sets it to undefined
 * beforehand.
 */
export async function deleteProject(projectName: string): Promise<void> {
	if (getCurrentProject() === projectName) {
		await setCurrentProject(undefined);
	}
	try {
		await rmdirRecursive(getProjectPath(projectName));
	} catch (e) {
		if ((e as any).code === "ENOENT") {
			throw new ProjectNotFoundError(projectName);
		}
		throw e;
	}
}

/**
 * Renames the project. If the current project is being rename, automatically
 * changes the current project to new name.
 * @returns true if the project could be rename, false if a project
 * with name `newProjectName` exists already
 * @throws {ProjectNotFoundError} if no project with name `oldProjectName`
 * exists
 */
export async function tryRenameProject(
	oldProjectName: string,
	newProjectName: string
): Promise<boolean> {
	if (oldProjectName === newProjectName) {
		return true;
	}
	if (await pathExists(getProjectPath(newProjectName))) {
		return false;
	}
	try {
		await projectsFSP.rename(
			getProjectPath(oldProjectName),
			getProjectPath(newProjectName)
		);
	} catch (e) {
		const code = (e as any).code;
		if (code === "ENOENT") {
			throw new ProjectNotFoundError(oldProjectName);
		} else {
			throw e;
		}
	}
	await setCurrentProject(newProjectName);
	return true;
}

/**
 * Adds a new listener. Calling the function with the same object multiple times
 * has no effect.
 * Asynchronous listeners will not be awaited.
 */
export function addListenerOnChangeProject(listener: OnChangeProjectListener) {
	projectChangeListeners.set(listener, true);
}

/**
 * Removes listener if it was previously registered.
 * listener:
 *	Args:
 *		newProjectName: Name of new (current) project
 *		oldProjectName: Name of previous project, may not exist anymore
 */
export function removeListenerOnChangeProject(
	listener: OnChangeProjectListener
) {
	projectChangeListeners.delete(listener);
}

export function getProjectPath(projectName: string): string {
	return Path.join("/", projectName);
}

export async function listProjects(): Promise<string[]> {
	return await projectsFSP.readdir("/");
}

Promise.resolve().then(() => {
	addListenerOnChangeProject(() => void saveConfig());
});

/**
 * @throws ENOTDIR if dir is not dir
 */
export async function* recurseDirectory(dir: string): AsyncGenerator<string> {
	for (const entry of await projectsFSP.readdir(dir)) {
		const abs = Path.join(dir, entry);
		if ((await projectsFSP.stat(abs)).type === "dir") {
			yield* recurseDirectory(abs);
		} else {
			yield abs;
		}
	}
}

class IsDirError extends Error {
	declare code: string;
	constructor(filename: string) {
		super(`Can't open "${filename}: is a directory"`);
		this.code = "EISDIR";
	}
}

/**
 * Returns an error if could not read for any reason
 * @returns file content on success, otherwise error, possibly with .code
 * attribute (which is "EISDIR" if filePath is a directory)
 */
export async function readFileContent(
	filePath: string
): Promise<string | (Error & { code?: string })> {
	try {
		const fileContent = (await projectsFSP.readFile(filePath, {
			encoding: "utf8",
		})) as string | undefined; // undefined is returned for dirs
		if (fileContent === undefined) throw new IsDirError(filePath);
		return fileContent.toString();
	} catch (error) {
		if (error instanceof Error) {
			return error;
		} else {
			return new Error("" + error);
		}
	}
}
