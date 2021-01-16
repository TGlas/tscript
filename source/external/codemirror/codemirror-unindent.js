(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var Pos = CodeMirror.Pos;

  CodeMirror.commands.unindent = function(cm) {
    cm.unindent();
  };

  CodeMirror.defineExtension("unindent", function(options)
  {
    let tabsize = this.getOption("tabSize");
    let minLine = Infinity;
    let ranges = this.listSelections();
    let cm = this;
    this.operation(function() {
          let didSomething = false;
          for (let i=ranges.length-1; i>=0; i--)
          {
            let from = ranges[i].from();
            let to = ranges[i].to();
            if (from.line >= minLine) continue;
            if (to.line >= minLine) to = Pos(minLine, 0);
            let end = Math.min(to.ch != 0 || to.line == from.line ? to.line : to.line - 1, cm.lastLine());
            let start = Math.min(from.line, end);
            for (let l=start; l<=end; l++)
            {
              let line = cm.getLine(l);
              if (! line) continue;
              let empty = 0;
              for (let j=0; j<Math.min(tabsize, line.length); j++)
              {
                if (line[j] == ' ') empty++;
                else if (line[j] == '\t') { empty = tabsize; break; }
                else break;
              }
              if (empty == tabsize) cm.indentLine(l, "subtract");
            }
          }
        });
    return true;
  });
});
