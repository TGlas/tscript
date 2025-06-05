import { ParserPosition } from "../parser";
import { FileID } from "../parser/file_id";
import { Interpreter } from "./interpreter";

export interface ProgramElementBase<Type extends string> {
	readonly petype: Type;

	/** The position where this program element starts in the source code */
	where?: ParserPosition;

	/**
	 * Execute this program element
	 *
	 * @returns whether the program element is done. If false, it must be called again with an incremented instruction pointer.
	 */
	step(this: Interpreter): boolean;

	/**
	 * Determines whether the program element would be done after the next call to {@link step}.
	 *
	 * This controls when the debugger stops when stepping through a program.
	 * Since the debugger wants to stop just before the PE's last instruction,
	 * it halts when this method returns true.
	 *
	 * Some program elements don't want the debugger to halt on them and always return false
	 * (e.g. by using `simfalse`).
	 */
	sim(this: Interpreter): boolean;
}

export type StepFn = ProgramElementBase<any>["step"];
export type SimFn = ProgramElementBase<any>["sim"];

/** like a main function, but with more stuff */
export interface ProgramRoot extends ProgramElementBase<"global scope"> {
	/** children in the abstract syntax tree */
	children: any[];
	/** top of the hierarchy */
	parent: null;
	/** sequence of commands */
	commands: any[];
	/** array of all types */
	types: any[];
	/** names of all global things */
	names: Record<string, any>;
	/** mapping of index to name */
	variables: string[];
	/** mapping of line numbers to breakpoints (some lines do not have breakpoints) */
	breakpoints: Record<FileID, Record<number, Breakpoint>>;
	/** total number of lines in the program = maximal line number */
	lines: number;
}

export interface Breakpoint extends ProgramElementBase<"breakpoint"> {
	parent: ProgramElementBase<any>;
	where: ParserPosition;
	line: number;
	/** @returns whether the breakpoint is active */
	active(): boolean;
	set(): void;
	clear(): void;
	toggle(): void;
}
