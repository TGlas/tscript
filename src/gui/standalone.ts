import { ide } from "./ide";
import { tgui } from "./tgui";

export function handleTurtle(){
    tgui.releaseAllHotkeys();
    ide.turtle.parentNode.removeChild(ide.turtle);
    document.body.innerHTML = "";
    document.body.appendChild(ide.turtle);
    ide.turtle.style.width = "100vh";
    ide.turtle.style.height = "100vh";
}


export function handleCanvas(){
    tgui.releaseAllHotkeys();
    let cv = ide.canvas.parentNode;
    cv.parentNode.removeChild(cv);
    document.body.innerHTML = "";
    document.body.appendChild(cv);
    cv.style.width = "100vw";
    cv.style.height = "100vh";
    cv.style.top = "0px";
    setTimeout( ()=>{
        cv.width = 250;
        cv.height = 250;
    }, 100);
}