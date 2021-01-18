import { Documentation, documentationData } from "./doc-combined";

export class TreeControl{
    private doc: Documentation;

    public constructor(doc:Documentation = documentationData) {
        this.doc = doc;
    }

    public createDomObject():HTMLElement
    {
        let treeDiv = document.createElement('div');
        let styleDiv = document.createElement('div');
        styleDiv.classList.add("tgui", "tgui-control", "tgui-tree");
        treeDiv.append(styleDiv);

        let tr = new TreeRow(this.doc, treeDiv);

        return treeDiv;
    }
    
    private addTreeRows(doc:Documentation, elm:HTMLElement){
        let tr = new TreeRow(doc, elm);
    }
}

//"▸" "▾" "▫"
class TreeRow
{
    private children: Array<TreeRow>;

    constructor(doc:Documentation, elm:HTMLElement){

        let table = TreeRow.createTable();
        let mainTr = TreeRow.createTr();
        let tdCol = TreeRow.createCollapsTd();
        tdCol.innerText = doc.children.length > 0 ? "▫" : "▾";
        mainTr.append(tdCol);
        let tdName = TreeRow.createTdContent();
        tdName.innerText = (doc as any).name;
        mainTr.append(tdName);

        table.append(mainTr);

        let ar:Array<TreeRow> = [];
        doc.children.forEach((child)=>{
            let tr = TreeRow.createTr();
            ar.push(new TreeRow(child, tr));
            table.append(tr);
        });
        this.children = ar;

        elm.append(table);
    }

    public collaps(){
        
        //collaps self

        //collaps children
        this.children.forEach((c)=>{c.collaps();});
    }

    private static createTr():HTMLElement{
        let tr = document.createElement('tr');
        tr.classList.add("tgui");

        return tr;
    }

    private static createTable():HTMLElement{
        let table = document.createElement('table');
        table.classList.add("tgui", "tgui-tree-main");

        return table;
    }

    private static createCollapsTd(collapsed:boolean = false):HTMLElement{
        let td = document.createElement('td');
        td.classList.add("tgui", "tgui-tree-cell-toggle")
        td.style.cursor = "pointer";

        return td;
    }

    private static createTdContent(){
        let td = document.createElement('td');
        td.classList.add("tgui", "tgui-tree-cell-content")
        td.style.cursor = "pointer";

        return td;
        
    }
}