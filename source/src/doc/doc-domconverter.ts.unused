import { Documentation, documentationData } from "./doc-combined";

export class Domconverter{

    // This function returns an altered version of the pseudo-html #content
    // suitable for placing it as innerHTML into the DOM. It performs a
    // number of stylistic replacements:
    // * It scans for the ebnf tag and adds proper syntax highlighting.
    // * It scans for the tscript tag and adds proper syntax highlighting.
    //   As an additional sanity check, it parses and executes the code.
    // * For the above tags, it removes leading empty lines, removes leading
    //   indentation, and converts the remaining leading tabulators to four
    //   spaces each.
    // * It scans for keyword tags, which are styled appropriately.
    /*public static prepare(content)
    {
        let search = content.toLowerCase();
        let ret = "";
        let start = 0;
        while (start < content.length)
        {
            let pos = search.indexOf('<', start);
            if (pos < 0)
            {
                ret += content.substr(start);
                break;
            }
            ret += content.substr(start, pos - start);
            start = pos;
            if (search.substr(start, 6) == "<ebnf>")
            {
                start += 6;
                let end = search.indexOf("</ebnf>", start);
                if (end < 0) throw "[doc] <ebnf> tag not closed";
                let ebnf = content.substr(start, end - start);
                start = end + 7;
                ret += "";//processCode(ebnf, "ebnf", get_token_ebnf);
            }
            else if (search.substr(start, 9) == "<tscript>")
            {
                start += 9;
                let end = search.indexOf("</tscript>", start);
                if (end < 0) throw "[doc] <tscript> tag not closed";
                let code = content.substr(start, end - start);
                start = end + 10;
                //checkCode(code);
                ret += "";//processCode(code, "code", get_token_code);
            }
            else if (search.substr(start, 20) == "<tscript do-not-run>")
            {
                start += 20;
                let end = search.indexOf("</tscript>", start);
                if (end < 0) throw "[doc] <tscript> tag not closed";
                let code = content.substr(start, end - start);
                start = end + 10;
                ret += "";//processCode(code, "code", get_token_code);
            }
            else if (search.substr(start, 9) == "<keyword>")
            {
                start += 9;
                let end = search.indexOf("</keyword>", start);
                if (end < 0) throw "[doc] <keyword> tag not closed";
                let kw = content.substr(start, end - start);
                start = end + 10;
                ret += "<span class=\"keyword\">" + kw + "</span>";
            }
            else
            {
                ret += content[start];
                start++;
            }
        }
        return ret;
    }*/
    public static generateDomObject(path:string = "", data: Documentation = documentationData):HTMLElement{
        let result:NodeResult;
        try{
            result = this.getNode(path, data);     
        }catch(ex){
            let errorDiv = document.createElement('div');
            errorDiv.innerText = new String(ex) as string;
            return errorDiv;
        }

        let div = document.createElement('div');
        //add the 'main' node
        if(result.current.hasOwnProperty("title")){
            let e = document.createElement('h1');
            e.innerText = (result.current as any).title;
            div.append(e);
        }
        let c = document.createElement('div');
        c.innerHTML = result.current.content;
        div.append(c);
        //add next, previus and parent
        let related = document.createElement('div');
        related.classList.add("related");
        let rHeader = document.createElement('h1');
        rHeader.innerText = "Related Topics";
        related.append(rHeader);
        function addLink(target:HTMLElement, lable: string, url: string, text:string){
            let d = document.createElement('div');
            let l = document.createElement('p');
            l.innerText = lable;
            d.append(l);
            let a = document.createElement('a');
            a.href = url;
            a.innerText = text;
            d.append(a);
            d.append(document.createElement('br'));
            target.append(d);
        }
        function addNode(text:string, node: Documentation | undefined){
            if(node){
                addLink(related, text, "#doc/" + result.parentPath + "/" + node.id, (node as any).name);
            }
        }
        if(result.parent){
            addLink(related, "back to enclosing topic:", "#doc/" + result.parentPath, (result.parent as any).name);
        }
        addNode("previous topic:", result.previous)
        addNode("next topic:", result.next)
        //append children
        let ul = document.createElement('ul');
        for(let i = 0; i < result.current.children.length; i++){
            let li = document.createElement('li');
            addLink(li, "", "#doc/" + result.parentPath + (result.parentPath.length === 0 ? '' : '/') + result.current.children[i].id, (result.current.children[i] as any).name);
            ul.append(li);
        }
        let cHeader = document.createElement('h3');
        cHeader.innerText = "Subordinate Topics";
        related.append(cHeader);
        related.append(ul);
        div.append(related);
        return div;
    }

    public static getNode(path:string = "", data: Documentation = documentationData):NodeResult{
        let parts = path.split("/").filter((x)=>{return x !== ""});
        let currentObj: Documentation = data;
        for(let i = 0; i < parts.length; i++){
            //go through the children and find the one with the same id
            let index = currentObj.children.findIndex( (obj) =>{
                return obj.id === parts[i];
            });
            if(index === -1){
                throw new Error("Path not found failed at " + parts[i]);
            }
            if(i === parts.length - 1){
                return {
                    parentPath: parts.slice(0, parts.length - 1).join('/'),
                    parent: currentObj,
                    previous: currentObj.children[i-1],
                    next: currentObj.children[i+1],
                    current: currentObj.children[i],
                }
            }
            currentObj = currentObj.children[i]; 
        }
        return {
            parentPath: "",
            current: currentObj,
            parent: undefined,
            next: undefined,
            previous: undefined,
        }
        
    }
}

export interface NodeResult{
    parentPath: string,
    current: Documentation;
    parent: Documentation | undefined;
    previous: Documentation | undefined;
    next: Documentation | undefined;
}