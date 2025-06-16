import { app_id_gitlab, client_id_github, proxy_server_url } from "../github_creds";
import { decodeJWT, getRawToken } from "./git_token";
import * as git from "isomorphic-git"
import { getCurrentProject, getProjectPath, projectsFS } from "./projects-fs";
import http from "isomorphic-git/http/web/index";
import { addMessage, ft } from "./elements";

/**
 * Function to start git login flow. User will be redirected to GitHub / GitLab
 * @param type Indicates the platform (GitHub / GitLab)
 */
export async function startGitLoginFlow(type: 'hub' | 'lab') {
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

export async function git_clone(url: string): Promise<boolean> {
	const dir = getProjectPath(getCurrentProject() || '/');
	console.log(dir);
	try {
		await git.clone({
			fs: projectsFS,
			http,
			dir: dir,
			url: url,
			depth: 1,
			corsProxy: 'https://cors.isomorphic-git.org',
			remote: 'tscript',
			onAuth: () => ({
				username: decodeJWT(getRawToken()).data.info.access_token,
				password: '',
			}),
			onAuthFailure: () => {
				addMessage("error", "Not authorized to clone, make sure that you have full read/write access to this repository.");
			}
		});
		ft?.refresh();
		return true
	} catch(err) {
		console.log("ERROR");
		return false;
	}
}

export async function git_status(path: string) {
	console.log(getProjectPath(getCurrentProject() || ''));
	projectsFS.readdir(getProjectPath(getCurrentProject() ||''), undefined, (err, files) => {
		console.log(files);
	});
	git.listFiles({fs: projectsFS, dir: '/'}).then(val => console.log(val));
	git.status({
		fs: projectsFS,
		filepath: path,
		dir: getProjectPath(getCurrentProject() || ''),
	}).then(s => console.log(s));
}

/**
 * Function to logout from git. The access will be revoked on the respective platform (github / gitlab)
 * @returns Promisified boolean to indicate whether logout was successful
 */
export async function gitLogout(): Promise<boolean> {
	try {
		const token = localStorage.getItem("git_token");
		if(token) {
			let decoded = decodeJWT(token);
			let result;
			if(decoded.data.type == "lab") {
				result = await fetch(`${proxy_server_url}/auth-token?token=${decoded.data.info.access_token}&client_id=${app_id_gitlab}&type=lab`, {
					method: 'delete',
				});
			} else if(decoded.data.type == "hub") {
				result = await fetch(`${proxy_server_url}/auth-token?token=${decoded.data.info.access_token}&client_id=${client_id_github}&type=hub`, {
					method: "delete",
				});
			}

			if(result.status == 200) {
				localStorage.removeItem("git_token");
				return true;
			} else {
				return false;
			}
		}
	} catch(err) {
		return false;
	}
	return false;
}