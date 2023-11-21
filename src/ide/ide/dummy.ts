import { EditorView } from "@codemirror/view"
import { basicSetup } from "codemirror"
import { Text } from "@codemirror/state"
import { javascript } from '@codemirror/lang-javascript'
import { autocompletion } from "@codemirror/autocomplete"

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

    private editorFromTextArea(textarea, extensions = [basicSetup, javascript()]) {
        const completions = [
            // Added TScript keywords and constructs
            {label: "and", type: "operators"},
            {label: "break", type: "loop"},
            {label: "catch", type: "try-catch"},
            {label: "class", type: "class"},
            {label: "constructor", type: "class"},
            {label: "continue", type: "loop"},
            {label: "else", type: "keyword"},
            {label: "false", type: "boolean"},
            {label: "from", type: "import"},
            {label: "function", type: "function"},
            {label: "namespace", type: "keyword"},
            {label: "not", type: "operators"},
            {label: "null", type: "null"},
            {label: "or", type: "operators"},
            {label: "private", type: "visibility"},
            {label: "protected", type: "visibility"},
            {label: "public", type: "visibility"},
            {label: "return", type: "keyword"},
            {label: "super", type: "parent"},
            {label: "then", type: "condition"},
            {label: "this", type: "keyword"},
            {label: "throw", type: "exception"},
            {label: "true", type: "boolean"},
            {label: "try", type: "try-catch"},
            {label: "use", type: "keyword"},
            {label: "var", type: "keyword"},
            {label: "xor", type: "operators"},
            {label: "constructor", type: "constructor"},
            {label: "static", type: "visibility"},
            {label: "return", type: "keyword"},
            {label: "try", type: "try-catch"},
            {label: "class", type: "class-decl"},
            {label: "if", type: "condition"},
            {label: "for", type: "for-loop"},
            {label: "while", type: "while-do-loop"},
            {label: "do", type: "do-while-loop"},
        ]

        function myCompletions(context) {
            let before = context.matchBefore(/\w+/)
            // If completion wasn't explicitly started and there
            // is no word before the cursor, don't open completions.
            if (!context.explicit && !before) return null

            const customStyle = {
                '.cm-tooltip-autocomplete': {
                    backgroundColor: 'lightblue', // Change the background color
                },
                '.cm-completionLabel': {
                    color: 'blue', // Change the text color
                    fontWeight: 'bold', // Make the text bold
                },
                '.cm-completionIcon': {
                    fontSize: '1.2em', // Change the icon size
                },
            };

            return {
              from: before ? before.from : context.pos,
              options: completions,
              validFor: /^\w*$/,
              style: customStyle,
            }
          }

        let view = new EditorView({doc: textarea.value, 
            extensions: [
                ...extensions,
                autocompletion({ override: [myCompletions]}),
            ],
            parent: document.body,
        })
        textarea.parentNode.insertBefore(view.dom, textarea)
        textarea.style.display = "none"
        if (textarea.form) textarea.form.addEventListener("submit", () => {
          textarea.value = view.state.doc.toString()
        })
        return view
      }
}