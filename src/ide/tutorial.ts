"use strict";

import { ErrorHelper } from "../lang/errors/ErrorHelper";
import { tgui } from "./tgui";
import { defaultOptions } from "../lang/helpers/options";
import { Interpreter } from "../lang/interpreter/interpreter";
import { Lexer } from "../lang/parser/lexer";
import { Parser } from "../lang/parser";
import { TScript } from "../lang";
import { tutorialData } from "../tutorial";
import { createDefaultServices } from "../lang/interpreter/defaultService";

///////////////////////////////////////////////////////////
// TScript documentation
//

export const tutorial = (function () {
	// define all services related to the tutorial

	let module: any = {};
	module.unit = 0;
	module.section = 0;
	module.data = tutorialData;
console.log(tutorialData);

	// check whether the code fulfills the specification
	module.checkCode = function(code)
	{
		// TODO
	}

	// display a tutorial unit
	module.activate = function(parent, unit, section)
	{
		module.unit = unit;
		module.section = section;
		// TODO: store the state to local storage

		parent.innerHTML = "";
		tgui.createElement({type: "h1", parent: parent, text: module.data[unit].title});

		for (let i=0; i<=section; i++)
		{
			let content = module.data[unit].sections[i].content;
			// TODO: process content the same as for the documentation
			tgui.createElement({type: "div", parent: parent, html: content});
		}

		// TODO:
		// If a reference solution of unit tests are present then display "solve task" and "skip task" buttons.
		// Otherwise display a "continue" button; unless this is the last unit.
		if (unit+1 < module.data.length || section+1 < module.data[unit].sections.length)
		{
			// TODO: nice button
			tgui.createElement({
				type: "button",
				parent: parent,
				text: "continue",
				click: function(event)
				{
					if (section+1 < tutorialData[unit].sections.length) module.activate(parent, unit, section+1);
					else module.activate(parent, unit+1, 0);
				},
			});
		}
	}

	return module;
})();
