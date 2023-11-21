import { EditorView } from "@codemirror/view"
import { basicSetup } from "codemirror"
import { Text } from "@codemirror/state"

export class Dummy {
    private ev: EditorView

    public constructor(textarea: any) {
        this.ev = this.editorFromTextArea(textarea)
    }

    public refresh() { }

    public on(stage: string, func: any) { }

    public focus() {
        this.ev.focus();
    }

    public getValue(): string {
        return this.ev.state.doc.toString();
    }
    
    public setValue(content: string) {
        const text = Text.of(content.split("\n"));
        this.ev.state.doc.replace(0, this.lineCount(), text);
    }

    public getDoc(): any { }

    public getOption(opt: string): any { }

    public setOption(opt: string, val: any) { }

    public setCursor(i: number, ch: number) { }

    public getScrollInfo(): any { }

    public charCoords(a: any, b: any): any { }

    public getScrollerElement(): any { }

    public scrollTo(a: any, b: any) { }

    public lineCount(): number {
        return this.ev.state.doc.lines;
    }
    public lineInfo(a: number): any { }

    public setGutterMarker(a: any, b: any, c: any) { }

    public getSelection(): any { }

    public getCursor(): any { }

    public findWordAt(a: any): any { }

    public getRange(a: any, b: any) { }

    public scrollIntoView(a: any, b: any) { }

    public lastLine() { }

    private editorFromTextArea(textarea, extensions = [basicSetup]) {
        let view = new EditorView({doc: textarea.value, extensions})
        textarea.parentNode.insertBefore(view.dom, textarea)
        textarea.style.display = "none"
        if (textarea.form) textarea.form.addEventListener("submit", () => {
          textarea.value = view.state.doc.toString()
        })
        return view
      }
}