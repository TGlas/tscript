import {
	app_id_gitlab,
	client_id_github,
	proxy_server_url,
} from "../github_creds";
import { decodeJWT, getRawToken } from "./git_token";
import * as git from "isomorphic-git";
import { getCurrentProject, getProjectPath, projectsFS } from "./projects-fs";
import http from "isomorphic-git/http/web/index";
import { addMessage, filetree } from "./elements";
import { reloadProjectEditorTabsRecursively } from "./editor/editor";

/**
 * Function to start git login flow. User will be redirected to GitHub / GitLab
 * @param type Indicates the platform (GitHub / GitLab)
 */
export async function startGitLoginFlow(type: "hub" | "lab") {
	switch (type) {
		case "hub":
			sessionStorage.setItem("git_auth_type", "hub");
			window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id_github}&scope=repo&redirect_uri=${window.location.href}`;
			break;
		case "lab":
			sessionStorage.setItem("git_auth_type", "lab");
			window.location.href = `https://gitlab.ruhr-uni-bochum.de/oauth/authorize?client_id=${app_id_gitlab}&redirect_uri=${window.location.href}&response_type=code&scope=api+write_repository`;
			break;
	}
}

/**
 * Function to implement git clone
 * @param url url to the remote git repo
 * @returns promisified boolean to indicate whether clone was successful
 */
export async function gitClone(url: string): Promise<boolean> {
	const projName = getCurrentProject() || "/";
	const dir = getProjectPath(projName);
	try {
		const tokenData = decodeJWT(getRawToken()).data;
		await git.clone({
			fs: projectsFS,
			http,
			dir: dir,
			url: url,
			depth: 1,
			corsProxy: "https://cors.isomorphic-git.org",
			remote: "origin",
			onAuth: () => ({
				username:
					tokenData.type === "hub" ? tokenData.info.access_token : "",
				password:
					tokenData.type === "lab" ? tokenData.info.access_token : "",
			}),
			onAuthFailure: () => {
				addMessage(
					"error",
					"Not authorized to clone, make sure that you have full read access to this repository."
				);
			},
		});
		filetree.refresh();
		await reloadProjectEditorTabsRecursively(projName, "/");
		return true;
	} catch (err) {
		addMessage("error", "Could not clone remote repository.");
		console.log(err);
		return false;
	}
}

/**
 * Function to implement git pull
 * @returns promisified boolean to indicate whether pull was successful
 */
export async function gitPull(): Promise<boolean> {
	const projName = getCurrentProject() || "/";
	const dir = getProjectPath(projName);
	try {
		const tokenData = decodeJWT(getRawToken()).data;
		await git.pull({
			fs: projectsFS,
			http,
			dir: dir,
			onAuth: () => ({
				username:
					tokenData.type === "hub" ? tokenData.info.access_token : "",
				password:
					tokenData.type === "lab" ? tokenData.info.access_token : "",
			}),
			onAuthFailure: () => {
				addMessage(
					"error",
					"Not authorized to pull, make sure that you have full read access to this repository."
				);
			},
			singleBranch: true,
			author: {
				name: "TScript",
			},
			fastForward: true,
		});
		await git.checkout({
			fs: projectsFS,
			dir,
			force: true,
		});
		filetree.refresh();
		await reloadProjectEditorTabsRecursively(projName, "/");
		return true;
	} catch (err) {
		addMessage("error", "Could not pull from remote repository.");
		console.log(err);
		return false;
	}
}

/**
 * Function to implement git push
 * @returns promisified boolean to indicate whether push was successful
 */
export async function gitPush(commitMsg: string): Promise<boolean> {
	const dir = getProjectPath(getCurrentProject() || "/");

	try {
		const tokenData = decodeJWT(getRawToken()).data;
		let statusMatrix: Promise<git.StatusRow[]> = git.statusMatrix({
			fs: projectsFS,
			dir,
		});

		const repoDirty = (await statusMatrix).some((row) => {
			return row[1] !== row[2] || row[2] !== row[3];
		});

		if (repoDirty) {
			statusMatrix.then((status) => {
				Promise.all(
					status.map(([filepath, _, worktreeStatus]) => {
						worktreeStatus
							? git.add({ fs: projectsFS, dir, filepath })
							: git.remove({ fs: projectsFS, dir, filepath });
					})
				);
			});

			let sha = await git.commit({
				fs: projectsFS,
				dir,
				author: {
					name: "TScript",
				},
				message: commitMsg,
			});

			let pushResult: git.PushResult = await git.push({
				fs: projectsFS,
				http,
				dir,
				onAuth: () => ({
					username:
						tokenData.type === "hub"
							? tokenData.info.access_token
							: "",
					password:
						tokenData.type === "lab"
							? tokenData.info.access_token
							: "",
				}),
				onAuthFailure: () => {
					addMessage(
						"error",
						"Not authorized to push, make sure that you have full write access to this repository."
					);
				},
				force: true,
			});
			if (pushResult.ok) {
				return true;
			} else {
				return false;
			}
			return true;
		} else {
			addMessage("print", "No changes to push.");
			return true;
		}
	} catch (err) {
		console.log(err);
		addMessage("error", "Could not push to remote repository.");
		return false;
	}
}

export interface Repo {
	name: string;
	url: string;
	private: boolean | null;
}

/**
 * Function to get the info of the repo that is currently loaded in the filetree
 * @returns a repo or undefined if the current project is not a valid git repo
 */
export async function getCurrentProjectGitInfo(): Promise<Repo | undefined> {
	const currentProject = getCurrentProject();
	if (currentProject) {
		let value = await git.getConfig({
			fs: projectsFS,
			dir: getProjectPath(currentProject),
			path: "remote.origin.url",
		});
		let repo: Repo | undefined = undefined;
		if (value) {
			repo = {
				name: "",
				url: value,
				private: null,
			};
		}
		return repo;
	}
	return undefined;
}

/**
 * Function to get all repos from the user's GitHub / GitLab account
 * @returns List of repos
 */
export async function getGitRepos(): Promise<Repo[]> {
	const repos = sessionStorage.getItem("repos");
	if (repos) return JSON.parse(repos);
	try {
		const token = decodeJWT(getRawToken());
		if (token) {
			let result;

			if (token.data.type == "lab") {
				result = await fetch(
					`${proxy_server_url}/repos?token=${token.data.info.access_token}&type=lab`,
					{
						method: "get",
					}
				);
			} else if (token.data.type == "hub") {
				result = await fetch(
					`${proxy_server_url}/repos?token=${token.data.info.access_token}&type=hub`,
					{
						method: "get",
					}
				);
			}

			if (result.ok) {
				const repoArray: Repo[] = await result.json();
				sessionStorage.setItem("repos", JSON.stringify(repoArray));
				return repoArray;
			} else {
				return [];
			}
		} else {
			return [];
		}
	} catch (err) {
		return [];
	}
}

/**
 * Function to logout from git. The access will be revoked on the respective platform (github / gitlab)
 * @returns Promisified boolean to indicate whether logout was successful
 */
export async function gitLogout(): Promise<boolean> {
	try {
		const token = localStorage.getItem("git_token");
		if (token) {
			let decoded = decodeJWT(token);
			let result;
			if (decoded.data.type == "lab") {
				result = await fetch(
					`${proxy_server_url}/auth-token?token=${decoded.data.info.access_token}&client_id=${app_id_gitlab}&type=lab`,
					{
						method: "delete",
					}
				);
			} else if (decoded.data.type == "hub") {
				result = await fetch(
					`${proxy_server_url}/auth-token?token=${decoded.data.info.access_token}&client_id=${client_id_github}&type=hub`,
					{
						method: "delete",
					}
				);
			}

			if (result.status == 200) {
				localStorage.removeItem("git_token");
				sessionStorage.removeItem("repos");
				return true;
			} else {
				return false;
			}
		}
	} catch (err) {
		return false;
	}
	return false;
}
