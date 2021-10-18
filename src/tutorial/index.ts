import { tutorial_welcome } from "./welcome";
import { tutorial_helloworld } from "./helloworld";
import { tutorial_syntax } from "./syntax";
import { tutorial_graphics } from "./graphics";
import { tutorial_datatypes } from "./datatypes";
import { tutorial_ifelse } from "./ifelse";
import { tutorial_dowhile } from "./dowhile-loop";
import { tutorial_functions } from "./functions";
import { tutorial_containers } from "./containers";
// TODO:                                                                   GÜLTIGKEITSBEREICHE
// * turtle graphics X
// * canvas graphics X
// * variables X
// * simple data types integer, real, string X
import { tutorial_forloop } from "./forloop";
// TODO:
// * if-then-else, data type boolean X
// * do-while loops and while-do loops X                                
// * functions X
// * arrays X
// * dictionaries X
// * classes, interfaces/information hiding, inheritance
// * data types "Function" and "Type"
// * recursion
// * anonymous functions, closures
// * final (short) game project

let tutorial = new Array();
tutorial.push(tutorial_welcome);
tutorial.push(tutorial_helloworld);
tutorial.push(tutorial_syntax);
tutorial.push(tutorial_graphics);
tutorial.push(tutorial_datatypes);
tutorial.push(tutorial_ifelse);
tutorial.push(tutorial_forloop);
tutorial.push(tutorial_dowhile);
tutorial.push(tutorial_functions);
tutorial.push(tutorial_containers);

export const tutorialData = tutorial;
