import { ErrorHelper } from "../errors/ErrorHelper";
import { RuntimeError } from "../errors/RuntimeError";
import { Options } from "../helpers/options";
import { TScript } from "../tscript";
import { Typeid } from "../helpers/typeIds";
import { defaultService } from "./defaultService";

export class Interpreter{

    public thread = false;      // state of the thread
    public stop = false;        // request to stop the thread
    public background = false;  // is the thread responsible for running the program?
    public halt:any = null;         // function testing whether the thread should be halted
    public status = "";         // program status: "running", "waiting", "error", "finished"
    public stack:Array<any> = [];          // full state of the program
    public breakpoints = {};    // breakpoints for debugging, keys are lines
    public stepcounter = 0;     // number of program steps already executed
    public waittime = 0;        // time to wait before execution can continue
    public eventqueue:any = [];     // queue of events, with entries of the form {type, event}.
    public eventhandler = {};   // event handler by event type
    public eventnames = { };    // registry of event types
    public eventmode = false;   // is the program in event handling mode?
    public hook:any = null;         // function to be called before each step with the interpreter as this argument
    public program:any = null;  // the program to execute
    public service:any = null;  // external services, mostly for communication with the IDE
	public timerEventEnqueued:boolean = false;
	public options: Options;

    public constructor(program, service = defaultService){
        // create attributes
        this.program = program;   
		this.service = service;  
		this.options = program.options;

        	// start the background thread
		this.thread = true;
        setTimeout(this.chunk.bind(this), 1);
    }

    // background "thread": run a chunk of code for about
	// 15 milliseconds, then trigger the next chunk
	public chunk()
	{
		if (this.stop)
		{
			this.thread = false;
			this.stop = false;
			return;
		}

		if (this.status === "waiting")
		{
			let t = (new Date()).getTime();
			if (t >= this.waittime)
			{
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status === "running")
		{
			let start = (new Date()).getTime();
			while (this.background && (new Date()).getTime() - start < 14 && this.status === "running")
			{
				this.exec_step();

				if (this.halt)
				{
					if (this.halt.call(this))
					{
						this.halt = null;
						this.background = false;
						if (this.service.statechanged) this.service.statechanged(true);
					}
				}
			}
			if (this.background && !this.timerEventEnqueued)
			{
				this.timerEventEnqueued = this.enqueueEvent("timer", {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}});
			}
		}

		if(this.status !== "finished"){
        	setTimeout(this.chunk.bind(this), 100);
		}
	}
    
    // reset the program state, set the instruction pointer to its start
	public reset()
	{
		this.halt = null;
		this.background = false;
		this.stack = [{
				"pe": [this.program],       // array(n), program elements
				"ip": [0],                  // array(n), indices used by step functions
				"temporaries": [],          // stack of intermediate "return values"
				"variables": []             // array, global variables
			}];
		this.status = "running";
		if (this.service.statechanged) this.service.statechanged(false);
    }
    
    // start or continue running the program in the background
	public run()
	{
		if (this.status === "running" || this.status === "waiting")
		{
			this.background = true;
			if (this.service.statechanged) this.service.statechanged(false);
		}
    }
    
    public interrupt()
	{
		this.halt = null;
		this.background = false;
		if (this.service.statechanged) this.service.statechanged(true);
    }
    
    public wait(milliseconds)
	{
		if (this.status !== "running") return false;
		this.waittime = (new Date()).getTime() + milliseconds;
		this.status = "waiting";
		if (this.service.statechanged) this.service.statechanged(false);
		return true;
    }
    
    // Progress the instruction pointer to the next executable function.
	// This must happen after every call to pe.step(). The process
	// advances the instruction pointer. Furthermore, it may involve
	// returning from one or more functions. The number of functions
	// left in this way is returned.
	public progress()
	{
		let start = this.stack.length;

		// progress the instruction pointer
		while (this.stack.length > 0)
		{
			let frame = this.stack[this.stack.length - 1];
			if (frame.ip.length === 0)
			{
				// implicit return from a function
				ErrorHelper.assert(frame.temporaries.length === 0, "[Interpreter.progress] temporaries stack is not empty at the end of the function scope");
				this.stack.pop();
				if (this.stack.length === 0)
				{
					// end of the program
					break;
				}
				else
				{
					// implicit return null
					let frame = this.stack[this.stack.length - 1];
					frame.temporaries.push({"type": this.program.types[Typeid.typeid_null], "value": {"b": null}});
				}
			}
			else
			{
				frame.ip[frame.ip.length - 1]++;
				break;
			}
		}

		return start - this.stack.length;
    }
    
    // Run the next command. Steps are considered atomic from the
	// perspective of the debugger, although under the hood they are of
	// course not.
	// The first step moves the instruction pointer to the first
	// non-trivial command. All further steps execute one command and
	// then move the instruction pointer to the next non-trivial
    // command.
    public exec_step()
	{
		if (this.status === "waiting")
		{
			let t = (new Date()).getTime();
			if (t >= this.waittime)
			{
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status !== "running") return;

		if (this.stack.length === 0)
		{
			this.status = "finished";
			if (this.service.statechanged) this.service.statechanged(true);
			return;
		}

		if (this.hook)
		{
			try
			{
				this.hook.call(this);
			}
			catch (ex)
			{
				console.log("[Interpreter] ignoring exception thrown by the hook");
			}
		}

		try
		{
			// execute a step that returns true
			let frame = this.stack[this.stack.length - 1];
			let pe = frame.pe[frame.pe.length - 1];
			if (frame.ip.length !== 1 || frame.ip[0] !== 0)
			{
				// execute the current program element, and demand that it "did something"
				let done = pe.step.call(this, this.options);
				ErrorHelper.assert(done, "[Interpreter.exec_step] 'done' expected");

				// progress the instruction pointer
				this.stepcounter++;
				this.progress.call(this);
			}

			// execute trivial steps
			while (this.stack.length > 0 && (this.status === "running" || this.status === "waiting"))
			{
				let frame = this.stack[this.stack.length - 1];
				let pe = frame.pe[frame.pe.length - 1];

				// check whether we are done
				let done = pe.sim.call(this);
				if (done) break;

				// execute the current program element
				done = pe.step.call(this, this.options);
				ErrorHelper.assert(! done, "[Interpreter.exec_step] 'not done' expected");

				// progress the instruction pointer
				this.progress.call(this);
			}
		}
		catch (ex)
		{
			if (ex.name ===  "Runtime Error")
			{
				this.halt = null;
				this.background = false;
				if (this.service.message)
				{
					this.service.message("runtime error in line " + ex.line + ": " + ex.message, ex.line, ex.ch, ex.href);
				}
				this.status = "error";
				if (this.service.statechanged) this.service.statechanged(true);
			}
			else
			{
				// report an internal interpreter error
				console.log("internal runtime error!");
				console.log(ex);
				let msg = ErrorHelper.composeError("/internal/ie-2", [ErrorHelper.ex2string(ex)]);
				if (this.service.message) this.service.message(msg, null, null, "#/errors/internal/ie-2");

				this.halt = null;
				this.background = false;
				this.status = "error";
				if (this.service.statechanged) this.service.statechanged(true);
			}
		}
    }

    public step_into()
	{
		if (this.background || this.status !== "running") return;
		this.halt = function() { return true; };
		this.background = true;
	}

	// move to a different line in the same function
	public step_over()
	{
		if (this.background || this.status !== "running") return;
		let len = this.stack.length;
		if (len === 0)
		{
			this.halt = function() { return true; };
			this.background = true;
			return;
		}
		let frame = this.stack[len - 1];
		let pe = frame.pe[frame.pe.length - 1];
		let line = pe.where ? pe.where.line : -1;
		this.halt = (function(len, line) { return function()
				{
					if (this.stack.length < len) return true;
					else if (this.stack.length === len)
					{
						let pe = frame.pe[frame.pe.length - 1];
						let ln = pe.where ? pe.where.line : -1;
						if (ln !== line) return true;
					}
					return false;
				}; })(len, line);
		this.background = true;
	}

	// move out of the current function
	public step_out()
	{
		if (this.background || this.status !== "running") return;
		let len = this.stack.length;
		if (len === 0) this.halt = function() { return true; };
		else this.halt = (function(len) { return function()
				{
					return (this.stack.length < len);
				}; })(len);
		this.background = true;
    }
    
    // request to stop the background thread
	public stopthread()
	{
		this.stop = true;
	}
	

	// queue an event
	// returns true when event got enqueued, false otherwise
	public enqueueEvent(type, event)
	{
		if (this.eventmode) this.eventqueue.push({"type": type, "event": event});
		return this.eventmode;
    }
    
    	// define an event handler - there can only be one :)
	public setEventHandler(type, handler)
	{
		if (handler.type.id === Typeid.typeid_null) delete this.eventhandler[type];
		else if (TScript.isDerivedFrom(handler.type, Typeid.typeid_function))
		{
			if (handler.value.b.func.params.length !== 1) throw new RuntimeError("[Interpreter.setEventHandler] handler must be a function with exactly one parameter");
			this.eventhandler[type] = handler.value.b;
		}
		else throw new RuntimeError("[Interpreter.setEventHandler] invalid argument");
    };
    
    // Request to define a number of breakpoints. This function should
	// be called right after construction of the interpreter. It returns
	// the line numbers where actual breakpoints are set as the keys of
	// a dictionary. Some breakpoints may get merged this way. If all
	// provided breakpoints are in legal positions then the function
	// returns null.
	public defineBreakpoints(lines)
	{
		let pos = {};
		let changed = false;

		// loop over all positions
		for (let i=0; i<lines.length; i++)
		{
			let line = lines[i];
			if (this.program.breakpoints.hasOwnProperty(line))
			{
				// position is valid
				pos[line] = true;
			}
			else
			{
				// find a valid position if possible
				changed = true;
				while (line <= this.program.lines)
				{
					if (this.program.breakpoints.hasOwnProperty(line))
					{
						pos[line] = true;
						break;
					}
					else line++;
				}
			}
		}

		// enable/disable break points
		for (let key in this.program.breakpoints)
		{
			if (pos.hasOwnProperty(key)) this.program.breakpoints[key].set();
			else this.program.breakpoints[key].clear();
		}

		// return the result
		if (changed) return pos;
		else return null;
	}

	// Request to toggle a breakpoint. Not every line is a valid break
	// point position, therefore the function returns the following:
	// {
	//   line: number,       // position of the toggle
	//   active: boolean,    // is the breakpoint active after the action?
	// }
	// It no valid position can be found then the function returns null.
	public toggleBreakpoint(line)
	{
		while (line <= this.program.lines)
		{
			if (this.program.breakpoints.hasOwnProperty(line))
			{
				this.program.breakpoints[line].toggle();
				return { "line": line, "active": this.program.breakpoints[line].active() };
			}
			else line++;
		}
		return null;
	}

	public error(path: string, args: Array<any> | undefined){
		ErrorHelper.error(path, args, this.stack);
	}
}