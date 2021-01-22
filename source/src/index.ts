import * as _ from 'lodash';
import { ide } from "./gui/ide";
import { doc } from "./doc/doc";
import { runTests } from "./tests/runtests_gui";
import { handleCanvas, handleTurtle } from "./gui/standalone";


window.addEventListener("load", function(event)
{
	let container:any = document.getElementById("ide-container");
	container.innerHTML = "";
	let w:any = window;
	if(typeof w.TScript !== "undefined"){
		let TS = w.TScript;
		ide.standalone = true;
		ide.create(container);
		ide.sourcecode.setValue(TS.code);
		ide.prepare_run();
		switch(TS.mode){
			case 'canvas':
				handleCanvas();
				break;
			case 'turtle':
				handleTurtle();
				break;
		}
		ide.interpreter.run();
	}else{
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
	}
}, false);

