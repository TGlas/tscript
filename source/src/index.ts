import { Interpreter } from "./interpreter/interpreter";
import { Parser } from "./parse/parser";
import * as _ from 'lodash';
import { defaultService } from "./interpreter/defaultService";
import { ide } from "./gui/ide";
import { doc } from "./doc/doc";
import { runTests } from "./tests/runtests";


window.addEventListener("load", function(event)
{
	let container:any = document.getElementById("ide-container");
	container.innerHTML = "";
	switch(window.location.search.slice(1)){
		case 'doc':
			doc.create(container);
			break;
		case 'unittest':
			runTests(container);
			break;
		default:
			ide.create(container);
			break;
	}
}, false);


/*

export function run_code(code:string, service:any = defaultService):void{
    if(code[code.length - 1] !== '\n'){
        code += '\n';
    }

    let result = Parser.parse(code);
    let program = result.program;
    let errors = result.errors;
    
	if (errors && errors.length > 0)
	{   
		for (let i=0; i<errors.length; i++)
		{
			let err:any = errors[i];
			console.log(err.type, err.type + " in line " + err.line + ": " + err.message, err.line, err.ch, err.href);
		}
    }
    else if (program)
	{
		let interpreter = new Interpreter(program);
		interpreter.service = service;
		interpreter.service.documentation_mode = false;
		interpreter.service.print = console.log;
		interpreter.service.alert = (function(msg) { alert(msg); });
		interpreter.service.confirm = (function(msg) { return confirm(msg); });
		interpreter.service.prompt = (function(msg) { return prompt(msg); });
		interpreter.service.message = (function(msg, line, ch, href)
		{
			if (typeof line === 'undefined') line = null;
			if (typeof ch === 'undefined') ch = null;
			if (typeof href === 'undefined') href = "";
            console.log("error", msg, line, ch, href);
        });
                
		interpreter.service.turtle.dom = null;
		interpreter.service.canvas.dom = null;
		interpreter.eventnames["canvas.resize"] = true;
		interpreter.eventnames["canvas.mousedown"] = true;
		interpreter.eventnames["canvas.mouseup"] = true;
		interpreter.eventnames["canvas.mousemove"] = true;
		interpreter.eventnames["canvas.mouseout"] = true;
		interpreter.eventnames["canvas.keydown"] = true;
		interpreter.eventnames["canvas.keyup"] = true;
		interpreter.eventnames["timer"] = true;
        interpreter.reset();

        interpreter.run();
    }
}

/*
window.onload = function(){
	let gm = new GuiManager(document.body);
}

run_code("print(\"Hi, Ho\".split(\"i\"));");*/