/**
 * Namespaces used as the prefix in FileID. "string" is used for inputs that
 * aren't attached to a file, as in parseProgramFromString.
 *
 * localstorage: The corresponding FileID suffix is just the name of the "file"
 * string: The corresponding FileID suffix should be the context dependent
 *		filename as returned by fileIDToContextDependentFilename.
 */
export const fileIDNamespaces = ["localstorage", "string"] as const;
export type FileIDNamespace = (typeof fileIDNamespaces)[number];
export const loadableFileIDNamespaces = ["localstorage"] as const;
export type LoadableFileIDNamespace = (typeof loadableFileIDNamespaces)[number];

export type StringFileID = `string:${string}`;
export type LocalStorageFileID = `localstorage:${string}`;
export type FileID = StringFileID | LocalStorageFileID;
/** Subset of files that are actually stored somewhere */
export type LoadableFileID = LocalStorageFileID;

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

/**
 * Given a file id, returns a string that unambiguously represents that file to
 * the user, but leaving out the namespace (and in future uses, other contexts
 * that the user should be aware of).
 */
export function fileIDToContextDependentFilename(fileID: FileID): string {
	const [ns, suffix] = splitFileIDAtColon(fileID);
	switch (ns) {
		case "localstorage":
			return suffix;
		case "string":
			return suffix;
	}
}

export function fileIDToHumanFriendly(fileID: FileID): string {
	const [ns, suffix] = splitFileIDAtColon(fileID);
	switch (ns) {
		case "localstorage":
			return suffix;
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

export function localStorageFileIDToFilename(
	fileID: LocalStorageFileID
): string {
	return splitFileIDAtColon(fileID)[1];
}

export function fileIDChangeNamespace<FileIDNamespaceT extends FileIDNamespace>(
	fileID: FileID,
	namespace: FileIDNamespaceT
): `${FileIDNamespaceT}:${string}` {
	const [_, suffix] = splitFileIDAtColon(fileID);
	return `${namespace}:${suffix}`;
}
