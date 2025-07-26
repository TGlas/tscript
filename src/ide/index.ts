import { doc } from "./doc";
import * as elements from "./elements";
import { cleanupExternalFilename, importData } from "./elements/utils";
import {
	initializeNavigation,
	IPageController,
	replaceUrl,
} from "./navigation";
import { searchengine } from "./search";
import { showStandalonePage } from "./standalone";

import "./css/documentation.css";
import "./css/responsive.css";
import "./css/icons.css";
import "./css/ide.css";
import "./css/tgui.css";
import "./css/tutorial.css";

import "./css-dark/documentation.css";
import "./css-dark/icons.css";
import "./css-dark/ide.css";
import "./css-dark/tgui.css";
import "./css-dark/tutorial.css";
import { app_id_gitlab, client_id_github, server_url } from "../github_creds";
import { validJWT } from "./git_token";
import { getGitRepos } from "./git_logic";

window.addEventListener("load", async () => {
	const container = document.getElementById("ide-container")!;
	container.replaceChildren(); // empties the container

	// handle standalone pages
	const standaloneData = window["TScript"];
	if (typeof standaloneData === "object") {
		showStandalonePage(container, standaloneData);
		return;
	}

	let currentUrl = new URL(location.href);

	// handle legacy urls
	const redirectUrl = translateLegacyURL(currentUrl);
	if (redirectUrl) {
		replaceUrl(redirectUrl);
		currentUrl = redirectUrl;
	}

	const gitCode = currentUrl.searchParams.get("code");
	const git_auth_type = sessionStorage.getItem("git_auth_type");
	if (gitCode && git_auth_type) {
		let res;
		if (git_auth_type == "hub") {
			replaceUrl(currentUrl.href.split("?")[0]);
			try {
				res = await fetch(
					`${server_url}/auth-token-exchange?client_id=${client_id_github}&code=${gitCode}&type=hub`,
					{
						method: "get",
					}
				);
			} catch (err) {
				alert("Error trying to login with GitHub.");
			}
		} else if (git_auth_type == "lab") {
			replaceUrl(currentUrl.href.split("?")[0]);
			try {
				res = await fetch(
					`${server_url}/auth-token-exchange?client_id=${app_id_gitlab}&code=${gitCode}&type=lab`,
					{
						method: "get",
					}
				);
			} catch (err) {
				alert("Error trying to login with GitLab.");
			}
		}

		if (res) {
			res.text().then((token) => {
				if (validJWT(token)) {
					localStorage.setItem("git_token", token);
					getGitRepos();
				}
			});
			sessionStorage.removeItem("git_auth_type");
		}
	}

	await initializeNavigation(currentUrl, container, (url) => {
		if (url.searchParams.has("doc")) return DocumentationPageController;
		return IDEPageController;
	});
});

function translateLegacyURL(currentUrl: URL): URL | null {
	if (currentUrl.search === "?doc") {
		const hash = currentUrl.hash.slice(1);
		const docParams = new URLSearchParams(
			hash.startsWith("search/")
				? { doc: "search", q: hash.slice(7).split("/").join(" ") }
				: { doc: hash }
		);
		return new URL("?" + docParams.toString(), location.href);
	}

	if (currentUrl.search === "?run") {
		const loadParams = new URLSearchParams({
			load: decodeURI(currentUrl.hash.slice(1)),
		});
		return new URL("?" + loadParams.toString(), location.href);
	}

	return null;
}

class IDEPageController implements IPageController {
	constructor(container: HTMLElement, location: URL) {
		elements.create(container);

		const loadUrl = location.searchParams.get("load");
		if (loadUrl) loadScriptFromUrl(loadUrl);
	}

	checkUnsavedChanges(): boolean {
		// does any open editor have unsaved changes?
		return elements.collection.editors.some((c) => c.hasUnsavedChanges);
	}
}

async function loadScriptFromUrl(url: string): Promise<void> {
	try {
		const parsedUrl = new URL(url);
		const response = await fetch(url);
		const text = await response.text();
		importData(text, cleanupExternalFilename(parsedUrl.pathname));
	} catch (error) {
		if ((error && typeof error === "object") || typeof error === "string")
			alert("The program could not be loaded:\n" + error.toString());
		else alert("The program could not be loaded.");
	}
}

class DocumentationPageController implements IPageController {
	constructor(container: HTMLElement, location: URL) {
		doc.create(container);
		this.showPage(location.searchParams);
	}

	navigate(newLocation: URL): boolean {
		if (newLocation.searchParams.has("doc")) {
			this.showPage(newLocation.searchParams);
			return true;
		}

		return false;
	}

	private showPage(params: URLSearchParams): void {
		const docPage = params.get("doc") ?? "";

		if (docPage.startsWith("search/")) {
			// This is not a url that anyone should link to,
			// but it needs to be handled because paths starting with "search/"
			// refer to search pages internally.

			const tokens = docPage.slice(7).split("/");

			// Since this is not a URL that should exist,
			// redirect to the _correct_ one.
			const redirectParams = new URLSearchParams({
				doc: "search",
				q: tokens.join(" "),
			});
			replaceUrl("?" + redirectParams.toString());

			doc.setpath("search/" + tokens.join("/"));
		} else if (docPage === "search") {
			const searchQuery = params.get("q") ?? "";
			const tokens = searchengine.tokenize(searchQuery);
			doc.setpath("search/" + tokens.join("/"));
		} else {
			doc.setpath(docPage);
		}
	}
}
