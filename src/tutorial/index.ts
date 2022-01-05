import { tutorial_welcome } from "./welcome";
import { tutorial_helloworld } from "./helloworld";
import { tutorial_syntax } from "./syntax";
import { tutorial_graphics } from "./graphics";
import { tutorial_datatypes } from "./datatypes";
import { tutorial_ifelse } from "./ifelse";
import { tutorial_dowhile } from "./dowhile-loop";
import { tutorial_functions } from "./functions";
import { tutorial_containers } from "./containers";
import { tutorial_oop } from "./oop";
import { tutorial_functiontype } from "./functiontype";
import { tutorial_recursion } from "./recursion";
import { tutorial_anonymousfunc } from "./anonymousfunc";
import { tutorial_game } from "./game";
// 
// * turtle graphics X
// * canvas graphics X
// * variables X
// * simple data types integer, real, string X
import { tutorial_forloop } from "./forloop";
// TODO:
<<<<<<< HEAD
// * if-then-else, data type boolean X
// * do-while loops and while-do loops X                                
// * functions X
// * arrays X
// * dictionaries X
// * classes, interfaces/information hiding, inheritance X
// * data types "Function" and "Type" X
// * recursion X
// * anonymous functions, closures X
// * final (short) game project X
=======
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
>>>>>>> upstream/master

let tutorial = new Array();
tutorial.push(tutorial_welcome);
tutorial.push(tutorial_helloworld);
tutorial.push(tutorial_syntax);
tutorial.push(tutorial_graphics);
tutorial.push(tutorial_datatypes);
tutorial.push(tutorial_ifelse);
tutorial.push(tutorial_forloop);
<<<<<<< HEAD
tutorial.push(tutorial_dowhile);
tutorial.push(tutorial_functions);
tutorial.push(tutorial_containers);
tutorial.push(tutorial_oop);
tutorial.push(tutorial_functiontype);
tutorial.push(tutorial_recursion);
tutorial.push(tutorial_anonymousfunc);
tutorial.push(tutorial_game);
=======
//tutorial.push(tutorial_functions);

>>>>>>> upstream/master
export const tutorialData = tutorial;
