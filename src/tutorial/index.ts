//import { tutorial_syntax } from "./syntax";
import { tutorial_welcome } from "./welcome";
import { tutorial_helloworld } from "./helloworld";
import { tutorial_calculations } from "./calculations";
import { tutorial_graphics } from "./graphics";
import { tutorial_variables } from "./variables";
import { tutorial_datatypes } from "./datatypes";
import { tutorial_ifelse } from "./ifelse";
import { tutorial_forloop } from "./forloop";
import { tutorial_dowhile } from "./dowhile-loop";
import { tutorial_functions } from "./functions";
import { tutorial_arrays } from "./arrays";
import { tutorial_dictionaries } from "./dictionaries";
import { tutorial_mutable } from "./mutable";
import { tutorial_events } from "./events";
import { tutorial_oop } from "./oop";
import { tutorial_inheritance } from "./inheritance";
import { tutorial_functiontype } from "./functiontype";
//import { tutorial_namespaces } from "./namespaces";
import { tutorial_recursion } from "./recursion";
import { tutorial_anonymousfunc } from "./anonymousfunc";
import { tutorial_game } from "./game";

let tutorial = new Array();
//tutorial.push(tutorial_syntax);
tutorial.push(tutorial_welcome);
tutorial.push(tutorial_helloworld);
tutorial.push(tutorial_graphics);
tutorial.push(tutorial_variables);
tutorial.push(tutorial_calculations);
tutorial.push(tutorial_datatypes);
tutorial.push(tutorial_forloop);
tutorial.push(tutorial_ifelse);
tutorial.push(tutorial_dowhile);
tutorial.push(tutorial_functions);
tutorial.push(tutorial_arrays);
tutorial.push(tutorial_dictionaries);
tutorial.push(tutorial_mutable);
tutorial.push(tutorial_oop);
tutorial.push(tutorial_inheritance);
tutorial.push(tutorial_events);
tutorial.push(tutorial_functiontype);
//tutorial.push(tutorial_namespaces);
tutorial.push(tutorial_recursion);
tutorial.push(tutorial_anonymousfunc);
tutorial.push(tutorial_game);
export const tutorialData = tutorial;
