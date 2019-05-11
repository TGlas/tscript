
all: singlefile

JSFILES := ../js/codemirror.js \
	../js/codemirror-activeline.js \
	../js/codemirror-dialog.js \
	../js/codemirror-search.js \
	../js/codemirror-searchcursor.js \
	../js/codemirror-jumptoline.js \
	../js/codemirror-comment.js \
	../js/codemirror-scroll.js \
	../js/codemirror-unindent.js \
	../js/codemirror-tscriptmode.js \
	../js/tscript.js \
	../js/tgui.js \
	../js/interact.min.js \
	../js/ide.js \
	../js/search.js \
	../js/doc.js \
	../js/def-concepts.js \
	../js/def-ide.js \
	../js/def-language.js \
	../js/def-stdlib.js \
	../js/def-errors.js \
	../js/def-legal.js \

CSSFILES := ../js/codemirror.css \
	../js/tgui.css \
	../js/ide.css \
	../js/documentation.css \

singlefile:
	rm -f index.html
	rm -f index.html.zip
	cat start ${JSFILES} middle ${CSSFILES} end > index.html
	zip index.html.zip index.html

minified:
#	uglifyjs ../js/codemirror.js -c -m -o codemirror.min.js
#	uglifyjs ../js/codemirror-dialog.js -c -m -o codemirror-dialog.min.js
#	uglifyjs ../js/codemirror-search.js -c -m -o codemirror-search.min.js
#	uglifyjs ../js/codemirror-searchcursor.js -c -m -o codemirror-searchcursor.min.js
#	uglifyjs ../js/codemirror-jumptoline.js -c -m -o codemirror-jumptoline.min.js
#	uglifyjs ../js/tscriptmode.js -c -m -o tscriptmode.min.js
#	uglifyjs ../js/active-line.js -c -m -o active-line.min.js
#	uglifyjs ../js/tscript.js -c -m -o tscript.min.js
#	uglifyjs ../js/tgui.js -c -m -o tgui.min.js
#	cp ../js/interact.min.js .
#	uglifyjs ../js/ide.js -c -m -o ide.min.js
#	uglifyjs ../js/search.js -c -m -o search.min.js
#	uglifyjs ../js/doc.js -c -m -o doc.min.js
	cat start *.js middle ../js/*.css end > index.html
#	rm -f *.min.js

clean:
	rm index.html
	rm index.html.zip
	rm -f *.min.js
