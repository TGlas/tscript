import { ide } from "./ide";
import { doc } from "./doc";
import { handleCanvas, handleTurtle } from "./standalone";

import "./css/ide.css";
import "./css/tgui.css";
import "./css/codemirror.css";
import "./css/documentation.css";

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
			case 'run':
				fetch(decodeURI(window.location.hash.slice(1))).then(rsp =>rsp.text().then((data)=>{
					ide.create(container);
					ide.sourcecode.setValue(data);
				})).catch((err)=>{
					ide.create(container);
					ide.sourcecode.setValue(err);
				});
				break;
			default:
				ide.create(container);
				break;
		}
	}
}, false);

