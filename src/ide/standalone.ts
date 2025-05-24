import { ParseInput, parseProgram } from "../lang/parser";
import {
	createCanvas,
	createIDEInterpreter,
	createTurtle,
} from "./elements/create-interpreter";

export type StandaloneCode = {
	includeSourceResolutions: Record<string, string>;
	/**
	 * triples [includingFile, includeOperand, stdFilename], where stdFilename
	 * is in the key set of includeSourceResolutions.
	 */
	includeResolutions: [string, string, string][] | null;
	main: string;
};
export type StandaloneData = {
	code: StandaloneCode;
	mode: "canvas" | "turtle";
};

export function showStandalonePage(
	container: HTMLElement,
	data: StandaloneData
): void {
	const { includeSourceResolutions, includeResolutions } = data.code;
	function resolveIncludeToStdFilename(
		includingFile: string,
		includeOperand: string
	): string | null {
		if (includeResolutions === null) {
			return includeOperand;
		} else {
			const relevantTriple = includeResolutions.find(
				(val) => val[0] === includingFile && val[1] === includeOperand
			);
			if (relevantTriple === undefined) {
				console.error(
					`Unexpectedly could not resolve include in "${includingFile}" operand "${includeOperand}" to standardized filename`
				);
				return null;
			}
			return relevantTriple[2];
		}
	}
	function getParseInput(filename: string): ParseInput<false> | null {
		return {
			filename,
			source: includeSourceResolutions[filename],
			resolveIncludeToStdFilename: resolveIncludeToStdFilename,
			resolveInclude: getParseInput,
		};
	}
	const mainFile = getParseInput(data.code.main);
	if (!mainFile) {
		console.error("Could not get parse input of main file");
		return; // This has been validated on export
	}

	const { program, errors } = parseProgram(mainFile, false);
	if (program == null) {
		console.error("Could not parse program", errors);
		return; // This has been validated on export
	}

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
