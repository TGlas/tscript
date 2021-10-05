import { ide } from "./ide";
import { IPageController } from "./navigation";

export default class IDEPageController implements IPageController {
	constructor(container: HTMLElement, location: URL) {
		ide.create(container);

		const loadUrl = location.searchParams.get("load");
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
		ide.sourcecode.setValue(text);
	} catch (error) {
		if ((error && typeof error === "object") || typeof error === "string")
			alert("The program could not be loaded:\n" + error.toString());
		else alert("The program could not be loaded.");
	}
}
