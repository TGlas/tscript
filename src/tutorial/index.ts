import { tutorial_welcome } from "./welcome";
import { tutorial_helloworld } from "./helloworld";
// TODO:
// * turtle graphics
// * canvas graphics
// * variables
// * simple data types integer, real, string
import { tutorial_forloop } from "./forloop";
// TODO:
// * if-then-else, data type boolean
// * do-while loops and while-do loops
//import { tutorial_functions } from "./functions";
// * functions
// * arrays
// * dictionaries
// * classes, interfaces/information hiding, inheritance
// * data types "Function" and "Type"
// * recursion
// * anonymous functions, closures
// * final (short) game project

let tutorial = new Array();
tutorial.push(tutorial_welcome);
tutorial.push(tutorial_helloworld);
tutorial.push(tutorial_forloop);
//tutorial.push(tutorial_functions);

export const tutorialData = tutorial;
