import { doc } from "./doc";
import * as elements from "./elements";
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
	container: HTMLElement;
	location: URL;
	constructor(container: HTMLElement, location: URL) {
		this.container = container;
		this.location = location;
	}

	async init() {
		await elements.create(this.container);

		const loadUrl = this.location.searchParams.get("load");
		if (loadUrl) loadScriptFromUrl(loadUrl);
	}

	checkUnsavedChanges(): boolean {
		return true;
	}
}

async function loadScriptFromUrl(url: string): Promise<void> {
	try {
		const response = await fetch(url);
		const text = await response.text();
		elements.collection.getActiveEditor()!.setText(text);
	} catch (error) {
		if ((error && typeof error === "object") || typeof error === "string")
			alert("The program could not be loaded:\n" + error.toString());
		else alert("The program could not be loaded.");
	}
}

class DocumentationPageController implements IPageController {
	container: HTMLElement;
	location: URL;
	constructor(container: HTMLElement, location: URL) {
		this.container = container;
		this.location = location;
	}

	async init() {
		await doc.create(this.container);
		this.showPage(this.location.searchParams);
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
