import { ErrorHelper } from "../errors/ErrorHelper";
import { RuntimeError } from "../errors/RuntimeError";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { ProgramElementBase, ProgramRoot } from "./program-elements";
import { FileID } from "../parser/file_id";

export interface InterpreterOptions {
	/** @default 10000 */
	maxStackSize?: number;
}

export type InterpreterStatus =
	| "running"
	| "waiting"
	| "dialog"
	| "error"
	| "finished";

/**
 * Each frame holds stacks for pe (program element), ip (instruction pointer),
 * temporaries, and an array of variables.
 * The pe and ip stacks are always in sync, the ip index refers to a position within the corresponding pe.
 * The temporary stack stores all temporary values.
 * For calls to non-static methods, the frame contains a field for the object in addition.
 */
export interface StackFrame {
	pe: (ProgramElementBase<string> & Record<string, any>)[];
	ip: number[];
	temporaries: any[];
	variables: any[];
	object: any | null;
	enclosed: any[] | null;
}

export class Interpreter {
	public thread = false; // state of the thread
	public stop = false; // request to stop the thread
	public background = false; // is the thread responsible for running the program?
	/** function testing whether the thread should be halted */
	public halt: ((this: Interpreter) => boolean) | null = null;
	/** program status */
	public status: InterpreterStatus = "running";
	public dialogResult: any = null; // result (typed value) returned by a modal alert/confirm/prompt dialog
	public stack: StackFrame[] = []; // full state of the program
	public stepcounter = 0; // number of program steps already executed
	public waittime = 0; // time to wait before execution can continue
	/** queue of events, with entries of the form {type, event}. */
	public eventqueue: { type: string; event: any }[] = [];
	/** event handler by event type */
	public eventhandler: Record<string, any> = {};
	public eventnames = {}; // registry of event types
	public eventmode = false; // is the program in event handling mode?
	public eventmodeReturnValue: any;
	/** function to be called before each step with the interpreter as this argument */
	public hook: ((this: Interpreter) => void) | null = null;
	public timerEventEnqueued: boolean = false;

	readonly maxStackSize: number;

	/**
	 * @param program the program to execute
	 * @param service external services, mostly for communication with the IDE
	 */
	constructor(
		readonly program: ProgramRoot,
		readonly service: any,
		options: InterpreterOptions = {}
	) {
		this.maxStackSize = options.maxStackSize ?? 10_000;

		// start the background thread
		this.thread = true;
		setTimeout(this.chunk.bind(this), 1);
	}

	// background "thread": run a chunk of code for about
	// 15 milliseconds, then trigger the next chunk
	public chunk() {
		if (this.stop) {
			this.thread = false;
			this.stop = false;
			if (this.service.shutdown) this.service.shutdown();
			return;
		}

		if (this.status === "waiting") {
			let t = new Date().getTime();
			if (t >= this.waittime) {
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status === "dialog") {
			if (this.dialogResult) {
				let frame = this.stack[this.stack.length - 1];
				frame.temporaries[frame.temporaries.length - 1] =
					this.dialogResult;
				this.dialogResult = null;
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status === "running") {
			let start = new Date().getTime();
			while (
				this.background &&
				new Date().getTime() - start < 14 &&
				this.status === "running"
			) {
				this.exec_step.bind(this)();

				if (this.halt) {
					if (this.halt.call(this)) {
						this.halt = null;
						this.background = false;
						if (this.service.statechanged)
							this.service.statechanged(true);
					}
				}
			}
			if (this.background && !this.timerEventEnqueued) {
				this.timerEventEnqueued = this.enqueueEvent("timer", {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				});
			}
		}

		if (this.status !== "finished") {
			setTimeout(this.chunk.bind(this), 1);
		}
	}

	// Request to interrupt the current chunk of code.
	// This gives the browser the opportunity to render updates before the next command is executed.
	public flush() {
		if (this.status === "running") {
			this.status = "waiting";
			this.waittime = new Date().getTime();
		}
	}

	// reset the program state, set the instruction pointer to its start
	public reset() {
		this.halt = null;
		this.background = false;
		this.stack = [
			{
				pe: [this.program], // array(n), program elements
				ip: [0], // array(n), indices used by step functions
				temporaries: [], // stack of intermediate "return values"
				variables: [], // array, global variables
				object: null,
				enclosed: null,
			},
		];
		if (this.service.startup) this.service.startup();
		this.status = "running";
		if (this.service.statechanged) this.service.statechanged(false);
	}

	// start or continue running the program in the background
	public run() {
		if (this.status === "running" || this.status === "waiting") {
			this.background = true;
			if (this.service.statechanged) this.service.statechanged(false);
		}
	}

	public interrupt() {
		this.halt = null;
		this.background = false;
		if (this.service.statechanged) this.service.statechanged(true);
	}

	public wait(milliseconds) {
		if (this.status !== "running") return false;
		this.waittime = new Date().getTime() + milliseconds;
		this.status = "waiting";
		if (this.service.statechanged) this.service.statechanged(false);
		return true;
	}

	// Progress the instruction pointer to the next executable function.
	// This must happen after every call to pe.step(). The process
	// advances the instruction pointer. Furthermore, it may involve
	// returning from one or more functions. The number of functions
	// left in this way is returned.
	public progress() {
		let start = this.stack.length;

		// progress the instruction pointer
		while (this.stack.length > 0) {
			let frame = this.stack[this.stack.length - 1];
			if (frame.ip.length === 0) {
				// implicit return from a function
				ErrorHelper.assert(
					frame.temporaries.length === 0,
					"[Interpreter.progress] temporaries stack is not empty at the end of the function scope"
				);
				this.stack.pop();
				if (this.stack.length === 0) {
					// end of the program
					break;
				} else {
					// implicit return null
					let frame = this.stack[this.stack.length - 1];
					frame.temporaries.push({
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					});
				}
			} else {
				frame.ip[frame.ip.length - 1]++;
				break;
			}
		}

		return start - this.stack.length;
	}

	/**
	 * Run the next command. Steps are considered atomic from the
	 * perspective of the debugger, although under the hood they are of
	 * course not.
	 *
	 * The loop inside this function executes the current step and
	 * advances the instruction pointer. This is then repeated until
	 * a step reports that it would be done after the next iteration.
	 * The loop is ended _before_ a step completes so that it can be
	 * inspected in stepping mode. Otherwise, only the state _after_ its
	 * completion could be seen.
	 *
	 * Example:
	 * ```
	 * var x = 0;
	 * x = 1;
	 * ```
	 *
	 * When step-debugging this, the debugger can't halt after the declaration
	 * since the constant `0` is considered trivial. You can only see `x`
	 * changing from `0` to `1` because it stops _just before_ completing the
	 * assignment.
	 */
	public exec_step() {
		if (this.status === "waiting") {
			let t = new Date().getTime();
			if (t >= this.waittime) {
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status !== "running") return;

		if (this.stack.length === 0) {
			this.status = "finished";
			if (this.service.statechanged) this.service.statechanged(true);
			if (this.service.shutdown) this.service.shutdown();
			return;
		}

		if (this.hook) {
			try {
				this.hook.call(this);
			} catch (ex) {
				console.log(
					"[Interpreter] ignoring exception thrown by the hook"
				);
			}
		}

		try {
			let frame = this.stack[this.stack.length - 1];
			let pe = frame.pe[frame.pe.length - 1];
			while (
				this.stack.length > 0 &&
				(this.status === "running" || this.status === "waiting")
			) {
				// execute the current step and check whether it's done
				if (pe.step.call(this)) {
					// the step is done -> count it
					this.stepcounter++;
				}

				// update the instruction pointer
				this.progress.call(this);

				// has the program ended? -> end the loop
				if (this.stack.length === 0) break;

				// update the current frame and program element
				frame = this.stack[this.stack.length - 1];
				pe = frame.pe[frame.pe.length - 1];

				// end the loop before the step is done
				if (pe.sim.call(this)) break;
			}
		} catch (ex: any) {
			const frame = this.stack[this.stack.length - 1];
			const pe = frame.pe[frame.pe.length - 1];

			if (ex.name === "Runtime Error" || ex.name === "Parse Error") {
				this.halt = null;
				this.background = false;
				if (this.service.message) {
					const filename = pe?.where?.filename || ex.filename;
					const line = pe?.where?.line || ex.line;
					const ch = pe?.where?.ch || ex.ch;

					this.service.message(
						ErrorHelper.getLocatedErrorMsg(
							"runtime error",
							filename,
							line,
							ex.message
						),
						filename,
						line,
						ch,
						ex.href
					);
				}
				this.status = "error";
				if (this.service.statechanged) this.service.statechanged(true);
				if (this.service.shutdown) this.service.shutdown();
			} else {
				// report an internal interpreter error
				console.log("internal runtime error!", ex);
				let msg = ErrorHelper.composeError("/internal/ie-2", [
					ErrorHelper.ex2string(ex),
				]);
				if (this.service.message)
					this.service.message(
						msg,
						undefined,
						undefined,
						undefined,
						"#/errors/internal/ie-2"
					);

				this.halt = null;
				this.background = false;
				this.status = "error";
				if (this.service.statechanged) this.service.statechanged(true);
				if (this.service.shutdown) this.service.shutdown();
			}
		}
	}

	public step_into() {
		if (this.background || this.status !== "running") return;
		this.halt = function () {
			return true;
		};
		this.background = true;
	}

	// move to a different line in the same function
	public step_over() {
		if (this.background || this.status !== "running") return;
		let len = this.stack.length;
		if (len === 0) {
			this.halt = function () {
				return true;
			};
			this.background = true;
			return;
		}
		let frame = this.stack[len - 1];
		let pe = frame.pe[frame.pe.length - 1];
		let line = pe.where ? pe.where.line : -1;
		this.halt = (function (len, line) {
			return function () {
				if (this.stack.length < len) return true;
				else if (this.stack.length === len) {
					let pe = frame.pe[frame.pe.length - 1];
					let ln = pe.where ? pe.where.line : -1;
					if (ln !== line) return true;
				}
				return false;
			};
		})(len, line);
		this.background = true;
	}

	// move out of the current function
	public step_out() {
		if (this.background || this.status !== "running") return;
		let len = this.stack.length;
		if (len === 0)
			this.halt = function () {
				return true;
			};
		else
			this.halt = (function (len) {
				return function () {
					return this.stack.length < len;
				};
			})(len);
		this.background = true;
	}

	// request to stop the background thread
	public stopthread() {
		this.stop = true;
	}

	// queue an event
	// returns true when event got enqueued, false otherwise
	public enqueueEvent(type, event) {
		if (this.eventmode) this.eventqueue.push({ type: type, event: event });
		return this.eventmode;
	}

	// define an event handler - there can only be one :)
	public setEventHandler(type, handler) {
		if (handler.type.id === Typeid.typeid_null)
			delete this.eventhandler[type];
		else if (TScript.isDerivedFrom(handler.type, Typeid.typeid_function)) {
			if (handler.value.b.func.params.length !== 1)
				throw new RuntimeError(
					"[Interpreter.setEventHandler] handler must be a function with exactly one parameter"
				);
			this.eventhandler[type] = handler.value.b;
		} else
			throw new RuntimeError(
				"[Interpreter.setEventHandler] invalid argument"
			);
	}

	/**
	 * Request to define a number of breakpoints. This function should
	 * be called right after construction of the interpreter. It returns
	 * a Set of (one-based) line numbers where actual breakpoints are
	 * effective.
	 * Some breakpoints may get merged this way. If all provided
	 * breakpoints are in legal positions then the function returns null.
	 *
	 * @param lines one-based positions of breakpoints
	 */
	public defineBreakpoints(lines: Iterable<number>, fileID: FileID) {
		let pos = new Set<number>();
		let changed = false;
		const breakpoints = this.program.breakpoints[fileID];
		if (!breakpoints) return null;

		// loop over all positions
		for (let line of lines) {
			if (breakpoints.hasOwnProperty(line)) {
				// position is valid
				pos.add(line);
			} else {
				// find a valid position if possible
				changed = true;
				while (line <= this.program.lines) {
					if (breakpoints.hasOwnProperty(line)) {
						pos.add(line);
						break;
					} else line++;
				}
			}
		}

		// enable/disable break points
		for (const b of Object.values(breakpoints)) {
			if (pos.has(b.line)) b.set();
			else b.clear();
		}
		// return the result
		return changed ? pos : null;
	}

	/**
	 * Request to toggle a breakpoint. Not every line is a valid break
	 * point position, therefore the function returns the following:
	 * {
	 *   line: number,       // position of the toggle, one-based
	 *   active: boolean,    // is the breakpoint active after the action?
	 * }
	 *
	 * @param line one-based line
	 * @returns the new state of the breakpoint or null if no valid position could be found
	 */
	public toggleBreakpoint(
		line: number,
		filename: FileID
	): { line: number; active: boolean } | null {
		const breakpoints = this.program.breakpoints[filename];
		if (!breakpoints) return null;

		for (; line <= this.program.lines; line++) {
			const breakpoint = breakpoints[line];
			if (breakpoint) {
				breakpoint.toggle();
				return { line, active: breakpoint.active() };
			}
		}
		return null;
	}

	public error(path: string, args?: Array<any>) {
		ErrorHelper.error(path, args, this.stack);
	}

	public assert(condition: any, message: any) {
		ErrorHelper.assert(condition, message);
	}
}
