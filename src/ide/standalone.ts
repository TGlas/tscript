import * as elements from "./elements";
import { createEditorTab } from "./elements/editor-tabs";
import * as tgui from "./tgui";

export type StandaloneData = {
	code: { documents: any; main: string };
	mode: "canvas" | "turtle";
};

export function showStandalonePage(
	container: HTMLElement,
	data: StandaloneData
): void {
	elements.setStandalone(true);
	elements.create(container, { standalone: data });

	for (let filename in data.code.documents)
		createEditorTab(filename, data.code.documents[filename], false);
	let ed = elements.collection.getActiveEditor();
	if (!ed) {
		alert("failed to open web application");
		document.body.innerHTML = "";
		return;
	}

	elements.prepare_run(data.code.main);

	switch (data.mode) {
		case "canvas":
			handleCanvas();
			break;
		case "turtle":
			handleTurtle();
			break;
	}
	elements.interpreter!.run();
}

function handleTurtle(): void {
	tgui.releaseAllHotkeys();
	elements.turtle.parentNode.removeChild(elements.turtle);
	document.body.innerHTML = "";
	document.body.appendChild(elements.turtle);
	elements.turtle.style.width = "100vh";
	elements.turtle.style.height = "100vh";
}

function handleCanvas(): void {
	tgui.releaseAllHotkeys();
	let cv = elements.canvas.parentNode;
	cv.parentNode.removeChild(cv);
	document.body.innerHTML = "";
	document.body.appendChild(cv);
	cv.style.width = "100vw";
	cv.style.height = "100vh";
	cv.style.top = "0px";
	elements.canvas.width = window.innerWidth;
	elements.canvas.height = window.innerHeight;
	window.addEventListener("resize", function (event) {
		let w = window.innerWidth;
		let h = window.innerHeight;
		elements.canvas.width = w;
		elements.canvas.height = h;
		let e: any = { width: w, height: h };
		e = elements.createTypedEvent("canvas.ResizeEvent", e);
		elements.interpreter!.enqueueEvent("canvas.resize", e);
	});
}
