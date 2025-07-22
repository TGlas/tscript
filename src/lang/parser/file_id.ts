/**
 * Namespaces used as the prefix in FileID. "string" is used for inputs that
 * aren't attached to a file, as in parseProgramFromString.
 *
 * project: The corresponding FileID suffix (part after :) is
 *		`${projectName}${projectAbsolutePath}`, where projectAbsolutePath
 *		is the with simplifyPath normalized absolute path (where the
 *		project directory is taken to be the root "/")
 * localstorage: The corresponding FileID suffix is just the name of the "file"
 * string: The corresponding FileID suffix should be the context dependent
 *		filename as returned by fileIDToContextDependentFilename.
 */
export const fileIDNamespaces = ["project", "localstorage", "string"] as const;
export type FileIDNamespace = (typeof fileIDNamespaces)[number];
export const loadableFileIDNamespaces = ["project", "localstorage"] as const;
export type LoadableFileIDNamespace = (typeof loadableFileIDNamespaces)[number];

export type ProjectFileID = `project:${string}`;
export type StringFileID = `string:${string}`;
export type LocalStorageFileID = `localstorage:${string}`;
export type FileID = ProjectFileID | StringFileID | LocalStorageFileID;
/** Subset of files that are actually stored somewhere */
export type LoadableFileID = LocalStorageFileID | ProjectFileID;

export function isLoadableFileID(fileID: FileID): fileID is LoadableFileID {
	return loadableFileIDNamespaces.some((ns) =>
		fileIDHasNamespace(fileID, ns)
	);
}

export function localstorageFileID(filename: string): LocalStorageFileID {
	return `localstorage:${filename}`;
}

export function stringFileID(filename: string): StringFileID {
	return `string:${filename}`;
}

export function projectFileID(
	projectName: string,
	path: string
): ProjectFileID {
	return `project:${projectName}${path}`;
}

/**
 * Given a file id, returns a string that unambiguously represents that file to
 * the user:
 *	- within the localStorage if the fileID represents a file in localStorage
 *	- within the project if the fileID represents a file in a project
 * For fileIDs starting with "string", it just returns the file id suffix after
 * ":".
 */
export function fileIDToContextDependentFilename(fileID: FileID): string {
	const [ns, suffix] = splitFileIDAtColon(fileID);
	switch (ns) {
		case "localstorage":
			return suffix;
		case "project":
			return projectFileIDToProjAbsPath(fileID as ProjectFileID);
		case "string":
			return suffix;
	}
}

export function fileIDToHumanFriendly(fileID: FileID): string {
	const [ns, suffix] = splitFileIDAtColon(fileID);
	switch (ns) {
		case "localstorage":
			return suffix;
		case "project":
			const [projName, path] = projectFileIDSplit(
				fileID as ProjectFileID
			);
			return `${path} (${projName})`;
		case "string":
			return `${suffix} (no file)`;
	}
}

export function fileIDHasNamespace<NamespaceT extends FileIDNamespace>(
	fileID: FileID,
	namespace: NamespaceT
): fileID is `${NamespaceT}:${string}` {
	return fileID.startsWith(namespace);
}

export function splitFileIDAtColon(fileID: FileID): [FileIDNamespace, string] {
	const ns = fileID.split(":", 1)[0] as FileIDNamespace;
	const suffix = fileID.slice(ns.length + 1);
	return [ns, suffix];
}

export function projectFileIDToProjAbsPath(fileID: ProjectFileID): string {
	return projectFileIDSplit(fileID)[1];
}

export function localStorageFileIDToFilename(
	fileID: LocalStorageFileID
): string {
	return splitFileIDAtColon(fileID)[1];
}

/**
 * @returns [projectName, projAbsPath]
 */
export function projectFileIDSplit(fileID: ProjectFileID): [string, string] {
	const [_, suffix] = splitFileIDAtColon(fileID);
	const projectName = suffix.split("/", 1)[0];
	const projAbsPath = suffix.slice(projectName.length);
	return [projectName, projAbsPath];
}

export function fileIDChangeNamespace<FileIDNamespaceT extends FileIDNamespace>(
	fileID: FileID,
	namespace: FileIDNamespaceT
): `${FileIDNamespaceT}:${string}` {
	const [_, suffix] = splitFileIDAtColon(fileID);
	return `${namespace}:${suffix}`;
}
