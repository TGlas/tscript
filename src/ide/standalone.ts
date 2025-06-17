import { ParseInput, parseProgram } from "../lang/parser";
import { IncludeResolutionList } from "./elements";
import { StringFileID, fileIDToHumanFriendly } from "../lang/parser/file_id";
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
	main: StringFileID;
};
export type StandaloneData = {
	code: StandaloneCode;
	mode: "canvas" | "turtle";
};

export async function showStandalonePage(
	container: HTMLElement,
	data: StandaloneData
) {
	const { includeSourceResolutions, includeResolutions } = data.code;
	class StandaloneParseInput implements ParseInput<StringFileID> {
		declare filename: StringFileID;
		declare source: string;

		constructor(filename: StringFileID, source: string) {
			this.filename = filename;
			this.source = source;
		}

		resolveIncludeToFileID(includeOperand: string): StringFileID | null {
			const relevantTriple = includeResolutions.find(
				(val) => val[0] === this.filename && val[1] === includeOperand
			);
			if (relevantTriple === undefined) {
				console.error(
					`Unexpectedly could not resolve include in ${fileIDToHumanFriendly(
						this.filename
					)} operand "${includeOperand}" to fileID`
				);
				return null;
			}
			return relevantTriple[2];
		}
		async resolveInclude(
			fileID: StringFileID
		): Promise<ParseInput<StringFileID> | null> {
			return StandaloneParseInput.getParseInput(fileID);
		}
		static getParseInput(
			fileID: StringFileID
		): ParseInput<StringFileID> | null {
			return new StandaloneParseInput(
				fileID,
				includeSourceResolutions[fileID]
			);
		}
	}
	const mainFile = StandaloneParseInput.getParseInput(data.code.main);
	if (!mainFile) {
		console.error("Could not get parse input of main file");
		return; // This has been validated on export
	}

	const { program, errors } = await parseProgram(mainFile);
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
