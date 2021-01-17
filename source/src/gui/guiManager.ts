import { Domconverter } from "../doc/doc-domconverter";
import { run_code } from "../index";

export class GuiManager{
    private body:HTMLElement;

    public constructor(body:HTMLElement){
        this.body = body;

        this.manage();
    }

    private manage(){
        window.addEventListener('hashchange', this.onHashChange.bind(this));
        this.onHashChange(); // call the function once to render for the current url
    }

    private onHashChange(){
        let hash = window.location.hash.slice(1); //remove the #
        //remove leading slash
        if(hash.startsWith('/')){
            hash = hash.slice(1);
        }

        this.clearUi();
        //render corresponding environment
        if(hash.startsWith('doc')){
            this.renderDoc(hash.slice(3));
        }else if(hash.startsWith('ide')){
            this.renderIde();
        }
    }

    private renderIde(){
        let ta = document.createElement('textarea');
        this.body.append(ta);
        let b = document.createElement('button');
        b.innerText = "Run";
        b.onclick = function()
        {
            run_code(ta.value);
        }

        this.body.append(b);
    }

    private renderDoc(path:string){
        console.log(path);
        this.body.append(Domconverter.generateDomObject(path));
    }

    private clearUi(){
        this.body.innerHTML = "";
    }

    private addListeners(){

    }
}