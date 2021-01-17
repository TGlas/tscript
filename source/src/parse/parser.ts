import { ErrorHelper } from "../errors/ErrorHelper";
import { ParseError } from "../errors/ParseError";
import { create_breakpoint, scopestep } from "../interpreter/runner_helper";
import { core } from "../tscript-lang/core";
import { lib_canvas } from "../tscript-lang/lib-canvas";
import { lib_math } from "../tscript-lang/lib-math";
import { lib_turtle } from "../tscript-lang/lib-turtle";
import { lib_audio } from "../tscript-lang/lib-audio";
import { simfalse } from "../helpers/sims";
import { parse_statement_or_declaration } from "./parse_statmentordeclaration";
import { defaultOptions, Options } from "../helpers/options";

export class Parser{
    public static parse(sourcecode, options:Options = defaultOptions)
    {
        // create the initial program structure
        let program:any = {
            "petype": "global scope",   // like a main function, but with more stuff
            "parent": null,             // top of the hierarchy
            "commands": [],             // sequence of commands
            "types": [],                // array of all types
            "names": {},                // names of all global things
            "variables": [],            // mapping of index to name
            "breakpoints": {},          // mapping of line numbers (preceded by '#') to breakpoints (some lines do not have breakpoints)
            "lines": 0,                 // total number of lines in the program = maximal line number
            "step": scopestep,          // execute all commands within the scope
            "sim": simfalse,            // simulate commands
            "options": options,         // make the options available to the interpreter
        };

        // create the parser state
        let state = {
                "program": program,     // program tree to be built during parsing
                "source": "",           // complete source code
                "pos": 0,               // zero-based position in the source code string
                "line": 1,              // one-based line number
                "ch": 0,                // zero-based character number within the line
                "indent": [0],          // stack of nested indentation widths
                "errors": [],           // list of errors, currently at most one
                "impl": {},             // implementations of built-in functions
                "builtin": function()
                        { return Object.keys(this.impl).length > 0; },
                "setSource": function(source, impl)
                        {
                            this.impl = (typeof impl === 'undefined') ? {} : impl;
                            this.source = source;
                            this.pos = 0;
                            this.line = 1;
                            this.ch = 0;
                            this.skip();
                        },
                "good": function()
                        { return (this.pos < this.source.length) && (this.errors.length === 0); },
                "bad": function()
                        { return (! this.good()); },
                "eof": function()
                        { return this.pos >= this.source.length; },
                "error": function(path, args)
                        {
                            if (typeof args === 'undefined') args = [];
                            let msg = ErrorHelper.composeError(path, args);
                            this.errors.push({"type": "error", "line": this.line, "ch": this.ch, "message": msg, "href": "#/errors" + path});
                            throw new ParseError("error");
                        },
                "warning": function(msg)
                        { this.errors.push({"type": "warning", "line": this.line, "message": msg}); },
                "current": function()
                        { return (this.pos >= this.source.length) ? "" : this.source[this.pos]; },
                "lookahead": function(num)
                        { return (this.pos + num >= this.source.length) ? "" : this.source[this.pos + num]; },
                "next": function()
                        { return this.lookahead(1); },
                "get": function()
                        { return { "pos": this.pos, "line": this.line, "ch": this.ch }; },
                "set": function(where)
                        { this.pos = where.pos; this.line = where.line, this.ch = where.ch },
                "indentation": function()
                        {
                            let w = 0;
                            for (let i=this.pos - this.ch; i<this.pos; i++)
                            {
                                let c = this.source[i];
                                if (c === ' ') w++;
                                else if (c === '\t') { w += 4; w -= (w % 4); }
                                else break;
                            }
                            return w;
                        },
                "advance": function(n)
                        {
                            if (typeof n === 'undefined') n = 1;

                            if (this.pos + n > this.source.length) n = this.source.length - this.pos;
                            for (let i=0; i<n; i++)
                            {
                                let c = this.current();
                                if (c === '\n') { this.line++; this.ch = 0; }
                                this.pos++; this.ch++;
                            }
                        },
                "skip": function()
                        {
                            let lines = new Array();
                            while (this.good())
                            {
                                let c = this.current();
                                if (c === '#')
                                {
                                    this.pos++; this.ch++;
                                    if (this.current() === '*')
                                    {
                                        this.pos++; this.ch++;
                                        let star = false;
                                        while (this.good())
                                        {
                                            if (this.current() === '\n')
                                            {
                                                this.pos++;
                                                this.line++; this.ch = 0;
                                                star = false;
                                                continue;
                                            }
                                            if (star && this.current() === '#')
                                            {
                                                this.pos++; this.ch++;
                                                break;
                                            }
                                            star = (this.current() === '*');
                                            this.pos++; this.ch++;
                                        }
                                    }
                                    else
                                    {
                                        while (this.good() && this.current() !== '\n') { this.pos++; this.ch++; }
                                    }
                                    continue;
                                }
                                if (c !== ' ' && c !== '\t' && c !== '\r' && c !== '\n') break;
                                if (c === '\n') { this.line++; this.ch = 0; lines.push(this.line); }
                                else this.ch++;
                                this.pos++;
                            }
                            return lines;
                        },
            };

        // parse one library or program
        let parse1 = function(source, impl:any = undefined)
                {
                    state.setSource(source, impl);
                    if (typeof impl === 'undefined') program.where = state.get();
                    while (state.good()) program.commands.push(parse_statement_or_declaration(state, program, options));
                    if (typeof impl === 'undefined') program.lines = state.line;
                };

        try
        {
            // parse the language core
            parse1(core.source, core.impl);

            // parse the built-in libraries
            parse1(lib_math.source, lib_math.impl);
            parse1(lib_turtle.source, lib_turtle.impl);
            parse1(lib_canvas.source, lib_canvas.impl);
            parse1(lib_audio.source, lib_audio.impl)

            // parse the user's source code
            parse1(sourcecode);

            // append an "end" breakpoint
            state.skip();
            if (! program.breakpoints.hasOwnProperty(state.line))
            {
                // create and register a new breakpoint
                let b = create_breakpoint(program, state);
                program.breakpoints[state.line] = b;
                program.commands.push(b);
            }
        }
        catch (ex)
        {
            console.log(ex);
            // ignore the actual exception and rely on state.errors instead
            if (ex instanceof ParseError)
            {
                if (state.errors.length > 0) return { "program": null, "errors": state.errors };
            }
            else
            {
                // report an internal parser error
                let err = {
                            type: "error",
                            href: "#/errors/internal/ie-1",
                            message: ErrorHelper.composeError("/internal/ie-1", [ErrorHelper.ex2string(ex)]),
                        };
                return { "program": null, "errors": [err] };
            }
        }

        if (state.errors.length > 0) return { "program": null, "errors": state.errors };
        else return { "program": program, "errors": [] };
    }
}