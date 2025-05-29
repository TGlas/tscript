import {
	ParseInput,
	parseProgram,
	FileID,
	StringFileID,
	fileIDToContextDependentFilename,
	splitFileIDAtColon,
} from "../lang/parser";
import { IncludeResolutionList } from "./elements";
import {
	createCanvas,
	createIDEInterpreter,
	createTurtle,
} from "./elements/create-interpreter";

export type StandaloneCode = {
	/** map from standardized filenames to their contents */
	includeSourceResolutions: Record<StringFileID, string>;
	/**
	 * triples [includingFile, includeOperand, stdFilename], where stdFilename
	 * is in the key set of includeSourceResolutions.
	 */
	includeResolutions: IncludeResolutionList;
	/** standardized filename of entry point file */
	main: FileID;
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
	function resolveIncludeToFileID(
		includingFile: StringFileID,
		includeOperand: string
	): StringFileID | null {
		const relevantTriple = includeResolutions.find(
			(val) => val[0] === includingFile && val[1] === includeOperand
		);
		if (relevantTriple === undefined) {
			console.error(
				`Unexpectedly could not resolve include in "${includingFile}" operand "${includeOperand}" to standardized filename`
			);
			return null;
		}
		fileIDToContextDependentFilename;
		return relevantTriple[2];
	}
	function getParseInput(
		fileID: StringFileID
	): ParseInput<StringFileID, false> | null {
		return {
			filename: fileID,
			source: includeSourceResolutions[fileID],
			resolveIncludeToFileID: resolveIncludeToFileID,
			resolveInclude: getParseInput,
		};
	}
	const mainFile = getParseInput(`string:${data.code.main}`);
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
