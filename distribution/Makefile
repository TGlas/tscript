# all -- default recipe
all: singlefile multifile ;

# non-file recipies:
.PHONY: all singlefile zipfile multifile clean help ;




JSFILES := ../source/codemirror.js \
	../source/codemirror-activeline.js \
	../source/codemirror-dialog.js \
	../source/codemirror-search.js \
	../source/codemirror-searchcursor.js \
	../source/codemirror-jumptoline.js \
	../source/codemirror-comment.js \
	../source/codemirror-scroll.js \
	../source/codemirror-unindent.js \
	../source/codemirror-tscriptmode.js \
	../source/tscript.js \
	../source/tgui.js \
	../source/interact.min.js \
	../source/search.js \
	../source/doc.js \
	../source/def-concepts.js \
	../source/def-ide.js \
	../source/def-language.js \
	../source/def-stdlib.js \
	../source/def-examples.js \
	../source/def-errors.js \
	../source/def-cheatsheet.js \
	../source/def-legal.js \
	../source/ide.js \

CSSFILES := ../source/codemirror.css \
	../source/tgui.css \
	../source/ide.css \
	../source/documentation.css \




singlefile: index.html ;

index.html: start ${JSFILES} middle ${CSSFILES} end
	rm -f index.html
	cat start ${JSFILES} middle ${CSSFILES} end > index.html

zipfile: index.html
	rm -f index.html.zip
	zip index.html.zip index.html




multifile: tscript.css tscript.js ;

tscript.css: ${CSSFILES}
	rm -f tscript.css
	cat ${CSSFILES} > tscript.css

tscript.js: strict ${JSFILES}
	rm -f tscript.js
	cat strict ${JSFILES} > tscript.js




clean:
	rm -f index.html
	rm -f index.html.zip
	rm -f tscript.css
	rm -f tscript.js




help:
	@echo "make help       -- show this help"
	@echo "make all        -- build the recipies singlefile and multifile (default)"
	@echo "make singlefile -- build one single file containing TScript and the IDE"
	@echo "make zipfile    -- zip the single file into a zip"
	@echo "make multifile  -- build TScript files as separated JavaScript and CSS"
	@echo "make clean      -- clean generated files"
