/*
 * Currently the tests don't work in node (due to missing navigation) and have
 * to be run manually in the browser. At some point we should either correctly
 * use mocha for the browser or find some kind of polyfill.
 */
import Path from "@isomorphic-git/lightning-fs/src/path";
import { assert, expect } from "chai";
import {
	addListenerOnChangeProject,
	deleteProject,
	getCurrentProject,
	getProjectPath,
	OnChangeProjectListener,
	pathExists,
	ProjectNotFoundError,
	removeListenerOnChangeProject,
	setCurrentProject,
	tryCreateProject,
	tryRenameProject,
} from "./projects-fs";

function randomName() {
	const ret = "rnd" + Math.random();
	randomNames.push(ret);
	return ret;
}

let currentEnv: [string, () => void | Promise<void>][] = [];

async function describe(title: string, func: () => void) {
	console.log(`${title}:`);
	currentEnv = [];
	func();
	for (const [itTitle, itFunc] of currentEnv) {
		await itFunc();
		console.log(`- ${itTitle} passed`);
	}
}

async function it(title: string, func: () => void | Promise<void>) {
	currentEnv.push([title, func]);
}

const randomNames: string[] = [];

describe("Project managment", () => {
	it("create projects", async () => {
		const name = randomName();
		const res = await tryCreateProject(name);
		expect(res).equals(true);
		const res2 = await tryCreateProject(name);
		expect(res2).equals(false);
		expect(await pathExists(getProjectPath(name))).equals(true);
	});

	it("deletes projects", async () => {
		const name = randomName();
		const res = await tryCreateProject(name);
		expect(res).equals(true);
		await deleteProject(name);
		expect(await pathExists(getProjectPath(name))).equals(false);
	});

	it("renames projects", async () => {
		const name = randomName();
		const res = await tryCreateProject(name);
		expect(res).equals(true);
		const resRename = await tryRenameProject(name, name + "_");
		expect(resRename).equals(true);

		const name2 = randomName();
		const resCreate2 = await tryCreateProject(name2);
		expect(resCreate2).equals(true);
		const resRename2 = await tryRenameProject(name + "_", name2);
		expect(resRename2).equals(false);
	});

	it("throws when deleting or renaming non-existing project", async () => {
		const name = randomName();
		try {
			await deleteProject(name);
			assert(false);
		} catch (e) {
			expect(e).instanceOf(ProjectNotFoundError);
		}
		try {
			await tryRenameProject(name, name + "_");
			assert(false);
		} catch (e) {
			expect(e).instanceOf(ProjectNotFoundError);
		}
	});
})
	.then(() => {
		describe("Project event listeners", () => {
			it("get called when changing project manually", async () => {
				const name = randomName();
				const res = await tryCreateProject(name);
				expect(res).equals(true);
				await setCurrentProject(undefined);

				const listener: OnChangeProjectListener = (
					newProjectName,
					oldProjectName
				) => {
					expect(oldProjectName).equals(undefined);
					expect(newProjectName).equals(name);
					expect(getCurrentProject()).equals(name);
					removeListenerOnChangeProject(listener);
				};
				addListenerOnChangeProject(listener);
				await setCurrentProject(name);
			});

			it("can be deleted", async () => {
				const name = randomName();
				const res = await tryCreateProject(name);
				expect(res).equals(true);
				await setCurrentProject(undefined);

				let called = [0];
				const listener: OnChangeProjectListener = () => ++called[0];
				addListenerOnChangeProject(listener);
				await setCurrentProject(name);
				expect(called[0]).equals(1);
				removeListenerOnChangeProject(listener);
				await setCurrentProject(undefined);
				expect(called[0]).equals(1);
			});

			it("get called when deleting or renaming current project", async () => {
				const name = randomName();
				const res = await tryCreateProject(name);
				expect(res).equals(true);
				await setCurrentProject(name);

				let called = [0];
				const listenerRename: OnChangeProjectListener = (
					newProjectName,
					oldProjectName
				) => {
					++called[0];
					expect(newProjectName).equals(name + "_");
					expect(oldProjectName).equals(name);
					removeListenerOnChangeProject(listenerRename);
				};
				addListenerOnChangeProject(listenerRename);
				expect(await tryRenameProject(name, name + "_")).equals(true);
				expect(called[0]).equals(1);
				const listenerRemove: OnChangeProjectListener = (
					newProjectName,
					oldProjectName
				) => {
					++called[0];
					expect(newProjectName).equals(undefined);
					expect(oldProjectName).equals(name + "_");
					removeListenerOnChangeProject(listenerRemove);
				};
				addListenerOnChangeProject(listenerRemove);
				await deleteProject(name + "_");
			});
		});
	})
	.finally(async () => {
		for (const name of randomNames) {
			try {
				await deleteProject(name);
			} catch (e) {
				if (!(e instanceof ProjectNotFoundError)) {
					throw e;
				}
			}
		}
	});
