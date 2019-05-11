(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.commands.scrollUp = function(cm) {
    cm.scrollUp();
  };

  CodeMirror.commands.scrollDown = function(cm) {
    cm.scrollDown();
  };

  CodeMirror.defineExtension("scrollUp", function(options) {
	let y = this.getScrollInfo().top;
	y -= this.defaultTextHeight();
	this.scrollTo(null, y);
  });

  CodeMirror.defineExtension("scrollDown", function(options) {
	let y = this.getScrollInfo().top;
	y += this.defaultTextHeight();
	this.scrollTo(null, y);
  });
});
