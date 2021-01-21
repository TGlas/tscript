import * as _ from 'lodash';
import { ide } from "./gui/ide";
import { doc } from "./doc/doc";
import { runTests } from "./tests/runtests_gui";


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