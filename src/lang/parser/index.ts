import { ErrorHelper } from "../errors/ErrorHelper";
import { create_breakpoint } from "../interpreter/interpreter_helper";
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
	filename: string | null;

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
	program: any;

	documents: Record<string, string>;

	/** current source code */
	source: string;

	/** stack of nested indentation widths */
	indent: number[];

	/** list of errors, currently at most one */
	errors: ParseErrorOrWarning[];

	/** implementation of built-in functions */
	impl: object | null;

	/** set of filenames */
	includes: Set<string>;

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
		filename?: string | null
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

export type ParseInput =
	| { documents: Record<string, string>; main: string }
	| string;

export interface ParseResult {
	program: any;
	errors: ParseErrorOrWarning[];
}

export class Parser {
	public static parse(
		toParse: ParseInput,
		options: ParseOptions = defaultParseOptions
	): ParseResult {
		// create the initial program structure
		let program: any = {
			petype: "global scope", // like a main function, but with more stuff
			children: new Array(), // children in the abstract syntax tree
			parent: null, // top of the hierarchy
			commands: [], // sequence of commands
			types: [], // array of all types
			names: {}, // names of all global things
			variables: [], // mapping of index to name
			breakpoints: {}, // mapping of line numbers (preceded by '#') to breakpoints (some lines do not have breakpoints)
			lines: 0, // total number of lines in the program = maximal line number
			step: scopestep, // execute all commands within the scope
			sim: simfalse, // simulate commands
		};

		const documents =
			typeof toParse == "string" ? { main: toParse } : toParse.documents;

		const mainDoc = typeof toParse == "string" ? "main" : toParse.main;

		// create the parser state
		let state: ParserState = {
			program,
			documents,
			source: "",
			pos: 0,
			line: 1,
			filename: null,
			ch: 0,
			totalpos: 0,
			indent: [0],
			errors: [],
			impl: null,
			includes: new Set(),
			builtin() {
				return this.impl !== null;
			},
			setSource(
				source: string,
				impl: any = null,
				filename: string | null = null
			) {
				this.source = source;
				this.impl = impl;
				this.filename = filename;
				if (filename != undefined) program.breakpoints[filename] = {};
				this.pos = 0;
				this.line = 1;
				this.ch = 0;
				this.skip();
			},
			good() {
				return (
					this.pos < this.source.length && this.errors.length === 0
				);
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
				this.errors.push(err);

				//let pe:any = ErrorHelper.getError(path, args, undefined, this.line, this.ch);
				//let pe:any = new ParseError("err");
				//pe.href = "#/errors" + path;
				throw err;
			},
			warning(msg) {
				this.errors.push({
					type: "warning",
					filename: this.filename,
					line: this.line,
					message: msg,
				});
			},
			current() {
				return this.pos >= this.source.length
					? ""
					: this.source[this.pos];
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
		};

		// parse one library or program
		let parse1 = function (
			source,
			impl: any = null,
			filename: string | null = null
		) {
			state.setSource(source, impl, filename);
			while (state.good()) {
				let inc = parse_include(state, program, options);
				if (inc !== null) {
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
					parse1(inc.source, null, inc.filename);

					// restore the state
					state.source = backup.source;
					state.pos = backup.pos;
					state.line = backup.line;
					state.filename = backup.filename;
					state.ch = backup.ch;
					state.indent = backup.indent;
				} else {
					let p = parse_statement_or_declaration(
						state,
						program,
						options
					);
					program.commands.push(p);
					program.children.push(p);
				}
			}
		};

		// recursive compiler pass through the syntax tree
		function compilerPass(passname) {
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
				if (
					pe.hasOwnProperty("petype") &&
					pe.hasOwnProperty(backward)
				) {
					let w = state.get();
					if (pe.hasOwnProperty("where")) state.set(pe.where);
					pe[backward](state);
					delete pe[backward];
					state.set(w);
				}
			}
			rec(program);
		}

		try {
			// pass 1: build an abstract syntax tree

			// parse the language core
			parse1(core.source, core.impl);

			// parse the built-in libraries
			parse1(lib_math.source, lib_math.impl);
			parse1(lib_turtle.source, lib_turtle.impl);
			parse1(lib_canvas.source, lib_canvas.impl);
			parse1(lib_audio.source, lib_audio.impl);

			// parse the user's source code
			program.where = state.get();
			parse1(documents[mainDoc], null, mainDoc);
			program.lines = state.line;

			// append an "end" breakpoint
			state.skip();
			if (!program.breakpoints[mainDoc].hasOwnProperty(state.line)) {
				// create and register a new breakpoint
				let b = create_breakpoint(program, state);
				program.breakpoints[mainDoc][state.line] = b;
				program.commands.push(b);
			}

			// pass 2: resolve all names
			compilerPass("Resolve");

			// further passes may follow in the future, e.g., for optimizations
			// compilerPass("Optimize");
		} catch (ex: any) {
			// ignore the actual exception and rely on state.errors instead
			if (ex.name === "Parse Error") {
				if (state.errors.length > 0)
					return { program: null, errors: state.errors };
			} else {
				// report an internal parser error
				let err: ParseError = {
					type: "error",
					href: "#/errors/internal/ie-1",
					message: ErrorHelper.composeError("/internal/ie-1", [
						ErrorHelper.ex2string(ex),
					]),
				};
				return { program: null, errors: [err] };
			}
		}

		if (state.errors.length > 0)
			return { program: null, errors: state.errors };
		else return { program: program, errors: [] };
	}
}
