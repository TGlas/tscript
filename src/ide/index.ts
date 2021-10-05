import DocumentationPageController from "./DocumentationPageController";
import IDEPageController from "./IDEPageController";
import { initializeNavigation, replaceUrl } from "./navigation";
import { showStandalonePage } from "./standalone";

import "./css/ide.css";
import "./css/tgui.css";
import "./css/codemirror.css";
import "./css/documentation.css";
import "./css/tutorial.css";

import "./css-dark/ide.css";
import "./css-dark/tgui.css";
import "./css-dark/codemirror.css";
import "./css-dark/documentation.css";
import "./css-dark/tutorial.css";

window.addEventListener("load", () => {
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

	initializeNavigation(currentUrl, container, (url) => {
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
