import FS from "@isomorphic-git/lightning-fs";

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
