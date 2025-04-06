import { ParseInput, parseProgram } from "../lang/parser";
import {
	createCanvas,
	createIDEInterpreter,
	createTurtle,
} from "./elements/create-interpreter";

export type StandaloneData = {
	code: { documents: Record<string, string>; main: string };
	mode: "canvas" | "turtle";
};

export function showStandalonePage(
	container: HTMLElement,
	data: StandaloneData
): void {
	const { documents } = data.code;
	function getParseInput(filename: string): ParseInput | null {
		if (!Object.hasOwn(documents, filename)) return null;
		return {
			filename,
			source: documents[filename],
			resolveInclude: getParseInput,
		};
	}
	const mainFile = getParseInput(data.code.main);
	if (!mainFile) return; // This has been validated on export

	const { program } = parseProgram(mainFile);
	if (program == null) return; // This has been validated on export

	const interpreter = createIDEInterpreter(program);

	switch (data.mode) {
		case "canvas": {
			const canvas = createCanvas(interpreter, container);
			interpreter.service.canvas.dom = canvas;
			container.replaceChildren(canvas);

			// allow keyboard input
			container.tabIndex = -1;
			container.focus();
			break;
		}
		case "turtle": {
			const turtle = createTurtle(container);
			container.style.alignContent = "center";
			container.style.textAlign = "center";
			interpreter.service.turtle.dom = turtle;
			container.replaceChildren(turtle);
			break;
		}
	}

	interpreter.run();
}
