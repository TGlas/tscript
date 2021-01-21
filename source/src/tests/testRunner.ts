import { ErrorHelper } from "../errors/ErrorHelper";
import { Typeid } from "../helpers/typeIds";
import { Interpreter } from "../interpreter/interpreter";
import { Parser } from "../parse/parser";
import { TScript } from "../tscript";
import { TscriptEventTest, TscriptInputTest, TscriptTest } from "./tests";

interface Callback{
    suc:()=>any,
    fail:(ex:any)=>any,
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

export class TestRunner{

    public static async runTest(test:TscriptTest, cb:Callback, isBrowser = true):Promise<void>{

        let timeout = test.hasOwnProperty("timeout") ? (test as any).timeout : 10.0;
		let input:any = test.hasOwnProperty("input") ? (test as TscriptInputTest).input : [];
        let events:any = test.hasOwnProperty("events") ? (test as TscriptEventTest).events : [];
        
        if(!isBrowser || typeof document === "undefined" && (test.expectation as any).type === "turtle" || (test.expectation as any).type === "canvas"){
            cb.suc();
            return;
        }

        // record of events
        let result = new Array();
        
        // parse the program
        let parsed;
        try{
            parsed = Parser.parse(test.code);
        }catch(ex){
            cb.fail(ex);
            return;
        }

        if(TestRunner.checkParseErrorsMatch(test, parsed, cb)){
            return;
        }

        // create the service to run against
        let service = 
        {
            documentation_mode: false,
            print: (function(msg) { result.push({type: "print", message: msg}); }),
            alert: (function(msg) { result.push({type: "alert", message: msg}); }),
            confirm: (function(msg)
                    {
                        result.push({type: "confirm", message: msg});
                        let b = input.shift();
                        ErrorHelper.assert(b === true || b === false, "simulated user input is not a boolean");
                        return b;
                    }),
            prompt: (function(msg)
                    {
                        result.push({type: "prompt", message: msg});
                        let s = input.shift();
                        ErrorHelper.assert(typeof s == "string", "simulated user input is not a string");
                        return s;
                    }),
            message: (function(msg, line, ch, href) { result.push({type: "error", href: href}); }),
            turtle: {
                dom: typeof document !== "undefined" ? document.createElement("canvas") : {},
            },
            canvas: {
                dom: typeof document !== "undefined" ? document.createElement("canvas") : {},
            }
        }
        if(typeof document !== "undefined"){
            let s:any = service;
            s.canvas.dom.width = 600;
            s.canvas.dom.height = 600;
            s.turtle.dom.height = 600;
            s.turtle.dom.width = 600;
        }
        
        let interpreter = new Interpreter(parsed.program, service);
        interpreter.reset();

        let timeLimit = Date.now() + 1000 * timeout;
        interpreter.run();

        while(Date.now() < timeLimit){
            if (interpreter.status == "finished" || interpreter.status == "error")
			{
                // the program has finished
                result.push(interpreter.status);
                interpreter.stopthread();
				TestRunner.check(result, test.expectation, cb);
				return;
            }else if (interpreter.status == "running" || interpreter.status == "waiting")
			{
				if (interpreter.eventmode && events.length > 0)
				{
					// construct an event object from a json description
					let desc:any = events.shift();
					let eventname = desc["name"];
					let typename = desc["type"];
					let type:any = null;
					for (let i=0; i<interpreter.program.types.length; i++)
					{
						if (TScript.displayname(interpreter.program.types[i]) == typename)
						{
							type = interpreter.program.types[i];
							break;
						}
					}
					if (type === null) {interpreter.stopthread(); cb.fail("unknown event type " + typename); return; }
					let attr = new Array();
					let n = type.members.length;
					for (let i=0; i<n; i++) attr.push({"type": interpreter.program.types[Typeid.typeid_null], "value": {"b": null}});
					for (let key in desc.attr)
					{
						if (! desc.attr.hasOwnProperty(key)) continue;
						if (! type.members.hasOwnProperty(key)) {interpreter.stopthread(); cb.fail("unknown event attribute"+ typename + "." + key); return; }
						let m = type.members[key];
						if (m.petype != "attribute") {interpreter.stopthread(); cb.fail("unknown event attribute" + typename + "." + key); return; }
						attr[m.id] = TScript.json2typed.call(interpreter, desc.attr[key]);
					}
					let event = { type: type, value: {a: attr, b: null} };

					// enqueue an event
					interpreter.enqueueEvent(eventname, event);
                }
            }
            await sleep(100);
        }

        // timeout!
        interpreter.stopthread();
        cb.fail("timeout");
    }

    // returns true if the program had parse errors
    private static checkParseErrorsMatch(test:TscriptTest, parsed:any, cb:Callback):boolean{
        if(parsed.errors !== null && parsed.errors.length > 0){
            let errors = new Array();
            for (let i=0; i<parsed.errors.length; i++)
			{
				let err = parsed.errors[i];
				errors.push({type: "error", href: err.href});
			}
            errors.push("parsing failed");
            TestRunner.check(test.expectation, errors, cb);
            return true;
        }else{
            return false;
        }
    }

    private static check(result, expectation, cb:Callback, interpreter:any = undefined) {
        switch(result.type){
            case "turtle":
                TestRunner.checkTurtle(result, expectation, interpreter, cb);
                break;
            case "canvas":
                TestRunner.checkCanvas(result, expectation, interpreter, cb);
                break;
            default:
                TestRunner.checkNormal(result, expectation, cb);
                break;
        }
    }
    static checkTurtle(result: any, expectation: any, interpreter:any, cb: Callback) {
        if (!interpreter) { cb.fail("No interpreter supplied"); return; }

		// test turtle graphics output
		let canvas = document.createElement("canvas");
		canvas.width = 600;
		canvas.height = 600;
		let context:any = canvas.getContext("2d");
		{
			let run = function run(code)
			{ eval(code); }
			run(expectation.js);
		}
		let pix1 = context.getImageData(0, 0, 600, 600).data;
		let pix2 = interpreter.service.turtle.dom.getContext("2d").getImageData(0, 0, 600, 600).data;
		if (pix1.length != pix2.length) cb.fail("incompatible canvas size");
		for (let i=0; i<pix1.length; i++)
		{
			if (Math.abs(pix1[i] - pix2[i]) > 10) { cb.fail(["canvas", interpreter.service.turtle.dom, canvas]); return; }
		}
		cb.suc();
    }

    static checkCanvas(result: any, expectation: any, interpreter:any, cb: Callback) {
        if (! interpreter) { cb.fail("No interpreter supplied"); return; }

		// test canvas graphics output
		let canvas = document.createElement("canvas");
		canvas.width = 600;
		canvas.height = 600;
		let context:any = canvas.getContext("2d");
		{
			let run = function run(code)
			{ eval(code); }
			run(expectation.js);
		}
		let pix1 = context.getImageData(0, 0, 600, 600).data;
		let pix2 = interpreter.service.canvas.dom.getContext("2d").getImageData(0, 0, 600, 600).data;
		if (pix1.length != pix2.length) cb.fail("incompatible canvas size");
		for (let i=0; i<pix1.length; i++)
		{
			if (Math.abs(pix1[i] - pix2[i]) > 10) { cb.fail( ["camvas",interpreter.service.canvas.dom, canvas]); return; }
		}
        cb.suc();
    }

    static checkNormal(result: any, expectation: any, cb: Callback) {
        // test for a sequence of events
		let sr = JSON.stringify(result, null, 2);
		let se = JSON.stringify(expectation, null, 2);
		if (sr === se)
		{
			cb.suc();
		}
		else
		{
			cb.fail([sr, se]);
		}
    }
}
