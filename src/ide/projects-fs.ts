import FS from "@isomorphic-git/lightning-fs";
import Path from "@isomorphic-git/lightning-fs/src/path";

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
		!(await pathExists(Path.join("/", projectName)))
	) {
		throw new ProjectNotFoundError(projectName);
	}
	const oldProjectName = currentProjectValue;
	currentProjectValue = projectName;
	for (const listener of projectChangeListeners.keys()) {
		listener(projectName, oldProjectName);
	}
}

/**
 * @returns true if the project could be created, false if the project exists
 * already
 */
export async function tryCreateProject(projectName: string): Promise<boolean> {
	if (projectName.includes("/")) {
		throw 'Project names cannot include "/"';
	}
	try {
		await projectsFSP.mkdir(Path.join("/", projectName));
		return true;
	} catch (e) {
		if ((e as any).code === "EEXIST") {
			return false;
		}
		throw e;
	}
}

export class ProjectNotFoundError extends Error {
	constructor(projectName: string) {
		super(`Project ${projectName} could not be found`);
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
		await rmdirRecursive(Path.join("/", projectName));
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
	if (await pathExists(Path.join("/", newProjectName))) {
		return false;
	}
	try {
		await projectsFSP.rename(
			Path.join("/", oldProjectName),
			Path.join("/", newProjectName)
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
