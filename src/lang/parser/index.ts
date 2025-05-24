import { ErrorHelper } from "../errors/ErrorHelper";
import { create_breakpoint } from "../interpreter/interpreter_helper";
import { ProgramRoot } from "../interpreter/program-elements";
import { core } from "../tscript-lib/core";
import { lib_canvas } from "../tscript-lib/lib-canvas";
import { lib_math } from "../tscript-lib/lib-math";
import { lib_turtle } from "../tscript-lib/lib-turtle";
import { lib_audio } from "../tscript-lib/lib-audio";
import { scopestep } from "../helpers/steps";
import { simfalse } from "../helpers/sims";
import { parse_statement_or_declaration } from "./parse_statementordeclaration";
import { parse_include } from "./parse_include";

export interface ParserPosition {
	/** filename or null */
	filename: StandardizedFilename | null;

	/** zero-based position in the source code string */
	pos: number;

	/** one-based line number */
	line: number;

	/** zero-based character number within the line */
	ch: number;

	/** sequential character index respecting include order */
	totalpos: number;
}

type ErrorPosition = Partial<Pick<ParserPosition, "filename" | "line" | "ch">>;
export type ParseError = ErrorPosition & {
	type: "error";
	message: string;
	href: string;
	name?: "Parse Error";
};
type ParseWarning = ErrorPosition & {
	type: "warning";
	message: string;
};
type ParseErrorOrWarning = ParseError | ParseWarning;

export interface ParserState extends ParserPosition {
	/** program tree to be built during parsing */
	program: ProgramRoot;

	/** current source code */
	source: string;

	/** stack of nested indentation widths */
	indent: number[];

	/** implementation of built-in functions */
	impl: object | null;

	/** @returns whether the parser has builtin implementations attached */
	builtin(this: ParserState): boolean;

	/**
	 * Sets the code to be parsed
	 *
	 * @param source the code to parse
	 * @param impl builtin implementations to attach to functions and constructors
	 * @param filename the filename related to the code
	 */
	setSource(
		this: ParserState,
		source: string,
		impl?: object | null,
		filename?: StandardizedFilename | null
	): void;

	/** @returns Whether there is text to parse and no errors have occurred */
	good(this: ParserState): boolean;

	/** inverse of {@link good} */
	bad(this: ParserState): boolean;

	/** @returns whether the end of the code has been reached */
	eof(this: ParserState): boolean;

	/**
	 * Emits an error. The error will be added to the state and also thrown.
	 *
	 * @param path the error path
	 * @param args formatting arguments for the error
	 */
	error(
		this: ParserState,
		path: string,
		args?: { toString(): string }[]
	): never;

	/**
	 * Emits a warning
	 *
	 * @param msg the message
	 */
	warning(this: ParserState, msg: string): void;

	/** @returns the current character at {@link pos} */
	current(this: ParserState): string;

	/** @returns the character at {@link pos} + 1 */
	next(this: ParserState): string;

	/**
	 * @param num the lookahead offset
	 * @returns the character at {@link pos} + {@link num}
	 */
	lookahead(this: ParserState, num: number): string;

	/** @returns the current position of the parser */
	get(this: ParserState): ParserPosition;

	/** Sets the current position */
	set(this: ParserState, pos: ParserPosition): void;

	/** @returns the current indentation level in spaces */
	indentation(this: ParserState): number;

	/**
	 * Advance the parser by {@link n} characters
	 *
	 * @param n the amount of characters to advance by (defaults to 1)
	 */
	advance(this: ParserState, n?: number): void;

	/** Skip whitespace and comments */
	skip(this: ParserState): void;
}

export interface ParseOptions {
	/** @default false */
	checkstyle: boolean;
}

export const defaultParseOptions: ParseOptions = {
	checkstyle: false,
};

/**
 * The thing on the right doesn't actually exist and is only meant to
 * distinguish this type from regular strings. See ParseInput on what
 * standardized filenames are.
 */
export type StandardizedFilename = string & {
	__standardized_filename_pseudo_attribute: undefined;
};

/**
 * If `AllowWait` is `false`, evaluates to `T`; if `AllowWait` is `true`,
 * evaluates to `T | Promise<T>`.
 */
export type ConditionallyIncludePromisified<T, AllowAwait extends boolean> =
	| T
	| (AllowAwait extends true ? Promise<T> : never);
/**
 * @param AllowAwait If true, resolveInclude may also return Promise
 */
export interface ParseInput<AllowAwait extends boolean = true> {
	/**
	 * standardized filename as returned by
	 * ParseInput.resolveIncludeToStdFilename. Also used in user output.
	 */
	filename: StandardizedFilename;
	/** file content / source code associated with this ParseInput */
	source: string;

	/**
	 * Resolve an include statement to a standardized filename. If not
	 * specified, the mapping `(includeFile, includeOperand) => includeOperand`
	 * is used.
	 *
	 * @param includingFile `ParseInput.filename` of the file where the include
	 * statement occured
	 * @param includeOperand the filename as specified in the include statement
	 * @returns the standardized filename or `null` if could not be resolved
	 */
	resolveIncludeToStdFilename?: (
		includingFile: StandardizedFilename,
		includeOperand: string
	) => StandardizedFilename | null;

	/**
	 * Given a standardized filename for an include as returned by
	 * `ParseInput.resolveIncludeToStdFilename`, return corresponding
	 * `ParseInput`, or `null` to signal that it is invalid.
	 */
	resolveInclude(
		stdFilename: StandardizedFilename
	): ConditionallyIncludePromisified<
		ParseInput<AllowAwait> | null,
		AllowAwait
	>;
}

export interface ParseResult {
	program: ProgramRoot | null;
	/** non-empty if {@link program} is null */
	errors: ParseErrorOrWarning[];
}

export function parseProgramFromString(
	source: string,
	options?: ParseOptions
): ParseResult {
	return parseProgram(
		{
			filename: "main" as StandardizedFilename,
			source,
			resolveInclude: () => null,
		},
		false,
		options
	);
}

/**
 * @param allowAwait corresponds to AllowAwait type parameter. If true,
 * mainInput.resolveInclude may return a promise and parseProgram also returns a
 * promise. true by default.
 * @param options `defaultParseOptions` by default
 */
export function parseProgram<AllowAwait extends boolean = true>(
	mainInput: ParseInput<AllowAwait>,
	allowAwait: AllowAwait,
	options?: ParseOptions
): AllowAwait extends true ? Promise<ParseResult> : ParseResult;
export function parseProgram(
	mainInput: ParseInput<any>,
	allowAwait: boolean = true,
	options: ParseOptions = defaultParseOptions
): Promise<ParseResult> | ParseResult {
	/** List of filenames of all included ParseInputs */
	const includedFiles = new Set<StandardizedFilename>();
	/** list of errors */
	const errors: ParseErrorOrWarning[] = [];
	const program = createEmptyProgram();
	const state = createParserState(program, errors);

	/**
	 * Parse one library or program from a string, optionally attaching built-in implementations.
	 * Includes are not supported.
	 */
	function parseString(
		source: string,
		impl: any = null,
		filename: StandardizedFilename | null = null
	) {
		state.setSource(source, impl, filename);
		while (state.good()) {
			let inc = parse_include(state, program, options);
			if (inc !== null) {
				// includes are not allowed
				// pretend the file was not found
				state.set(inc.position);
				state.error("/argument-mismatch/am-48", [inc.filename]);
			} else {
				let p = parse_statement_or_declaration(state, program, options);
				program.commands.push(p);
				program.children.push(p);
			}
		}
	}

	/**
	 * Parse one library or program from a file. Includes are supported.
	 *
	 * To support runtime switching between async and sync, parseFile and
	 * parseFileAsync both use parseFileGenerator under the hood
	 * and only act as event loops for the returned Generator. In parseFile, all
	 * yields are evaluated to its operand, which allows the function to remain
	 * synchronous. In parseFileAsync, yields are evaluated to the awaited value
	 * of the operand, thus making yields in parseFileGenerator equivalent to
	 * awaits.
	 */
	function parseFile(file: ParseInput<any>) {
		const gen = parseFileGenerator(file);
		// let yield expressions always evaluate to its operand
		for (let e = gen.next(); !e.done; e = gen.next(e.value)) {
			if (e.value instanceof Promise) {
				throw new Error("Unexpected Promise, async not allowed");
			}
		}
	}
	async function parseFileAsync(file: ParseInput<any>): Promise<void> {
		const gen = parseFileGenerator(file);
		let e = gen.next();
		while (!e.done) {
			// pass control to event loop and get result
			const awaitedVal = await e.value;
			// continue generator and provide result
			e = gen.next(awaitedVal);
		}
	}
	/**
	 * Depending on where this is called, yield corresponds to either just
	 * return the value (expecting it to not be a promise), or awaiting it if it
	 * is a promise.
	 */
	function* parseFileGenerator(
		file: ParseInput<any>
	): Generator<
		ParseInput | null | Promise<ParseInput | null>,
		void,
		ParseInput<any> | null
	> {
		includedFiles.add(file.filename);
		state.setSource(file.source, null, file.filename);
		while (state.good()) {
			const inc = parse_include(state, program, options);
			if (inc === null) {
				let p = parse_statement_or_declaration(state, program, options);
				program.commands.push(p);
				program.children.push(p);
				continue;
			}

			let targetFilename: StandardizedFilename | null;
			if (file.resolveIncludeToStdFilename) {
				targetFilename = file.resolveIncludeToStdFilename(
					file.filename,
					inc.filename
				);
			} else {
				targetFilename = inc.filename as StandardizedFilename;
			}
			if (targetFilename === null) {
				// the include could not be resolved
				state.set(inc.position);
				state.error("/argument-mismatch/am-48", [inc.filename]);
				return;
			}

			if (includedFiles.has(targetFilename)) {
				continue;
			}

			const targetFile = yield file.resolveInclude(targetFilename);
			if (targetFile === null) {
				// the file was not found
				state.set(inc.position);
				state.error("/argument-mismatch/am-48", [inc.filename]);
				return;
			}

			// safe the state
			let backup = {
				source: state.source,
				pos: state.pos,
				line: state.line,
				filename: state.filename,
				ch: state.ch,
				indent: state.indent.slice(),
			};

			// import the file
			yield* parseFileGenerator(targetFile);

			// restore the state
			state.source = backup.source;
			state.pos = backup.pos;
			state.line = backup.line;
			state.filename = backup.filename;
			state.ch = backup.ch;
			state.indent = backup.indent;
		}
	}

	try {
		// pass 1: build an abstract syntax tree

		// parse the language core
		parseString(core.source, core.impl);

		// parse the built-in libraries
		parseString(lib_math.source, lib_math.impl);
		parseString(lib_turtle.source, lib_turtle.impl);
		parseString(lib_canvas.source, lib_canvas.impl);
		parseString(lib_audio.source, lib_audio.impl);

		// parse the user's source code
		program.where = state.get();
		const afterParse = () => {
			program.lines = state.line;

			// append an "end" breakpoint
			state.skip();
			if (
				!program.breakpoints[mainInput.filename].hasOwnProperty(
					state.line
				)
			) {
				// create and register a new breakpoint
				let b = create_breakpoint(program, state);
				program.breakpoints[mainInput.filename][state.line] = b;
				program.commands.push(b);
			}

			// pass 2: resolve all names
			compilerPass(state, "Resolve");

			// further passes may follow in the future, e.g., for optimizations
			// compilerPass("Optimize");
		};

		// both branches are equivalent up to the first awaiting
		if (allowAwait) {
			return parseFileAsync(mainInput)
				.then(afterParse)
				.catch(handleError)
				.then(constructResult);
		} else {
			parseFile(mainInput);
			afterParse();
		}
	} catch (ex: any) {
		handleError(ex);
	}
	return constructResult();

	function constructResult() {
		return errors.length > 0
			? { program: null, errors }
			: { program, errors: [] };
	}

	function handleError(ex: any) {
		// ignore the actual exception and rely on state.errors instead
		if (ex.name !== "Parse Error") {
			// report an internal parser error
			errors.push({
				type: "error",
				href: "#/errors/internal/ie-1",
				message: ErrorHelper.composeError("/internal/ie-1", [
					ErrorHelper.ex2string(ex),
				]),
			});
		}
	}
}

/** recursive compiler pass through the syntax tree */
function compilerPass(state: ParserState, passname: string) {
	let forward = "pass" + passname;
	let backward = "pass" + passname + "Back";
	let all = new Set();
	function rec(pe) {
		if (all.has(pe)) return;
		all.add(pe);
		if (pe.hasOwnProperty("petype") && pe.hasOwnProperty(forward)) {
			let w = state.get();
			if (pe.hasOwnProperty("where")) state.set(pe.where);
			pe[forward](state);
			delete pe[forward];
			state.set(w);
		}
		if (pe.hasOwnProperty("children")) {
			for (let sub of pe.children) rec(sub);
		}
		if (pe.hasOwnProperty("petype") && pe.hasOwnProperty(backward)) {
			let w = state.get();
			if (pe.hasOwnProperty("where")) state.set(pe.where);
			pe[backward](state);
			delete pe[backward];
			state.set(w);
		}
	}
	rec(state.program);
}

/** creates the initial program structure */
export const createEmptyProgram = (): ProgramRoot => ({
	petype: "global scope",
	children: [],
	parent: null, // top of the hierarchy
	commands: [],
	types: [],
	names: {},
	variables: [],
	breakpoints: {},
	lines: 0,
	step: scopestep, // execute all commands within the scope
	sim: simfalse, // simulate commands
});

const createParserState = (
	program: ProgramRoot,
	errors: ParseErrorOrWarning[]
): ParserState => ({
	program,
	source: "",
	pos: 0,
	line: 1,
	filename: null,
	ch: 0,
	totalpos: 0,
	indent: [0],
	impl: null,
	builtin() {
		return this.impl !== null;
	},
	setSource(
		source: string,
		impl: any = null,
		filename: StandardizedFilename | null = null
	) {
		this.source = source;
		this.impl = impl;
		this.filename = filename;
		if (filename != undefined) this.program.breakpoints[filename] = {};
		this.pos = 0;
		this.line = 1;
		this.ch = 0;
		this.skip();
	},
	good() {
		return this.pos < this.source.length && errors.length === 0;
	},
	bad() {
		return !this.good();
	},
	eof() {
		return this.pos >= this.source.length;
	},
	error(path, args) {
		if (typeof args === "undefined") args = [];
		let msg = ErrorHelper.composeError(path, args);
		let err: ParseError = {
			type: "error",
			filename: this.filename,
			line: this.line,
			ch: this.ch,
			message: msg,
			href: "#/errors" + path,
			name: "Parse Error",
		};
		errors.push(err);

		//let pe:any = ErrorHelper.getError(path, args, undefined, this.line, this.ch);
		//let pe:any = new ParseError("err");
		//pe.href = "#/errors" + path;
		throw err;
	},
	warning(msg) {
		errors.push({
			type: "warning",
			filename: this.filename,
			line: this.line,
			message: msg,
		});
	},
	current() {
		return this.pos >= this.source.length ? "" : this.source[this.pos];
	},
	lookahead(num) {
		return this.pos + num >= this.source.length
			? ""
			: this.source[this.pos + num];
	},
	next() {
		return this.lookahead(1);
	},
	get() {
		return {
			pos: this.pos,
			line: this.line,
			ch: this.ch,
			totalpos: this.totalpos,
			filename: this.filename,
		};
	},
	set(where) {
		this.pos = where.pos;
		this.line = where.line;
		this.ch = where.ch;
		this.totalpos = where.totalpos;
		this.filename = where.filename;
	},
	indentation() {
		let w = 0;
		for (let i = this.pos - this.ch; i < this.pos; i++) {
			let c = this.source[i];
			if (c === " ") w++;
			else if (c === "\t") {
				w += 4;
				w -= w % 4;
			} else break;
		}
		return w;
	},
	advance(n) {
		if (typeof n === "undefined") n = 1;

		if (this.pos + n > this.source.length)
			n = this.source.length - this.pos;
		for (let i = 0; i < n; i++) {
			let c = this.current();
			if (c === "\n") {
				this.line++;
				this.ch = 0;
			}
			this.pos++;
			this.ch++;
			this.totalpos++;
		}
	},
	skip() {
		while (this.good()) {
			let c = this.current();
			if (c === "#") {
				this.pos++;
				this.ch++;
				this.totalpos++;
				if (this.current() === "*") {
					this.pos++;
					this.ch++;
					this.totalpos++;
					let star = false;
					while (this.good()) {
						if (this.current() === "\n") {
							this.pos++;
							this.line++;
							this.ch = 0;
							this.totalpos++;
							star = false;
							continue;
						}
						if (star && this.current() === "#") {
							this.pos++;
							this.ch++;
							this.totalpos++;
							break;
						}
						star = this.current() === "*";
						this.pos++;
						this.ch++;
					}
				} else {
					while (this.good() && this.current() !== "\n") {
						this.pos++;
						this.ch++;
						this.totalpos++;
					}
				}
				continue;
			}
			if (
				c !== " " &&
				c !== "\u00a0" &&
				c !== "\t" &&
				c !== "\r" &&
				c !== "\n"
			)
				break;
			if (c === "\n") {
				this.line++;
				this.ch = 0;
			} else this.ch++;
			this.pos++;
			this.totalpos++;
		}
	},
});
