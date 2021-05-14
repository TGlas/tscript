import { ide } from "./ide";
import { tgui } from "./tgui";

export function handleTurtle() {
	tgui.releaseAllHotkeys();
	ide.turtle.parentNode.removeChild(ide.turtle);
	document.body.innerHTML = "";
	document.body.appendChild(ide.turtle);
	ide.turtle.style.width = "100vh";
	ide.turtle.style.height = "100vh";
}

export function handleCanvas() {
	tgui.releaseAllHotkeys();
	let cv = ide.canvas.parentNode;
	cv.parentNode.removeChild(cv);
	document.body.innerHTML = "";
	document.body.appendChild(cv);
	cv.style.width = "100vw";
	cv.style.height = "100vh";
	cv.style.top = "0px";
	ide.canvas.width = window.innerWidth;
	ide.canvas.height = window.innerHeight;
	window.addEventListener("resize", function (event) {
		let w = window.innerWidth;
		let h = window.innerHeight;
		ide.canvas.width = w;
		ide.canvas.height = h;
		let e: any = { width: w, height: h };
		e = ide.createTypedEvent("canvas.ResizeEvent", e);
		ide.interpreter.enqueueEvent("canvas.resize", e);
	});
}
