import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView } from "codemirror";

export const baseTheme = EditorView.baseTheme({
	"&": {
		width: "100%",
		height: "100%",
		backgroundColor: "#fff",
	},

	"& .cm-activeLine": {
		backgroundColor: "#aac6ff33",
	},

	"&.cm-focused .cm-activeLine": {
		backgroundColor: "#aac6ff99",
	},

	"& .cm-gutters": {
		backgroundColor: "#f7f7f7",
	},

	"& .cm-breakpoint-gutter": {
		backgroundColor: "#f0f0f0",
	},

	"& .cm-breakpoint-gutter .cm-gutterElement": {
		paddingLeft: "4px",
		paddingRight: "4px",
		userSelect: "none",
	},

	"& .cm-lineNumbers .cm-gutterElement": {
		color: "#999",
		userSelect: "none",
	},

	".cm-tag-comment": { color: "#888" },
	".cm-tag-keyword": { color: "#00c" },
	".cm-tag-variable": { color: "#000" },
	".cm-tag-builtin": { color: "#808" },
	".cm-tag-operator": { color: "#000" },
	".cm-tag-number": { color: "#480" },
	".cm-tag-atom": { color: "#088" },
	".cm-tag-string": { color: "#800" },
	".cm-tag-bracket": { color: "#080" },
	".cm-tag-punctuation": { color: "#000" },
	".cm-tag-error": { color: "red", textDecoration: "underline" },

	// Dark theme

	".dark-theme &": {
		backgroundColor: "#222",
	},

	".dark-theme & .cm-cursor": {
		borderLeft: "1.2px solid #fff",
	},

	".dark-theme & .cm-activeLine": {
		backgroundColor: "#3e3e4533",
	},

	".dark-theme &.cm-focused .cm-activeLine": {
		backgroundColor: "#3e3e4599",
	},

	".dark-theme &.cm-focused .cm-selectionBackground, ::selection": {
		backgroundColor: "#444499 !important",
	},

	".dark-theme & .cm-selectionBackground, ::selection": {
		backgroundColor: "#444455",
	},

	".dark-theme & .cm-gutters": {
		backgroundColor: "#242424",
		borderRight: "1px solid #333",
	},

	".dark-theme & .cm-activeLineGutter": {
		backgroundColor: "#404045",
	},

	".dark-theme & .cm-breakpoint-gutter": {
		backgroundColor: "#272727",
	},

	".dark-theme & .cm-lineNumbers .cm-gutterElement": {
		color: "#777",
	},

	// For pop-up panels, like ctr-f
	".dark-theme & .cm-panels": {
		backgroundColor: "#333333",
		color: "#fff",
	},

	".dark-theme & .cm-panels .cm-button": {
		backgroundImage: "linear-gradient(#272727, #272727)",
	},

	".dark-theme & .cm-panels .cm-button:active": {
		backgroundImage: "linear-gradient(#222222, #222222)",
	},

	".dark-theme & .cm-panels .cm-textfield": {
		backgroundColor: "#272727",
	},

	".dark-theme & .cm-tag-comment": { color: "#888" },
	".dark-theme & .cm-tag-keyword": { color: "#4af" },
	".dark-theme & .cm-tag-variable": { color: "#fff" },
	".dark-theme & .cm-tag-builtin": { color: "#c4f" },
	".dark-theme & .cm-tag-operator": { color: "#fff" },
	".dark-theme & .cm-tag-number": { color: "#4f4" },
	".dark-theme & .cm-tag-atom": { color: "#4fe" },
	".dark-theme & .cm-tag-string": { color: "#f44" },
	".dark-theme & .cm-tag-bracket": { color: "#4f4" },
	".dark-theme & .cm-tag-punctuation": { color: "#fff" },
	".dark-theme & .cm-tag-error": {
		color: "red",
		textDecoration: "underline",
	},
});

export const highlighting = syntaxHighlighting(
	HighlightStyle.define([
		{ tag: tags.comment, class: "cm-tag-comment" },
		{ tag: tags.keyword, class: "cm-tag-keyword" },
		{ tag: tags.variableName, class: "cm-tag-variable" },
		{ tag: tags.typeName, class: "cm-tag-builtin" },
		{ tag: tags.operator, class: "cm-tag-operator" },
		{ tag: tags.number, class: "cm-tag-number" },
		{ tag: tags.atom, class: "cm-tag-atom" },
		{ tag: tags.string, class: "cm-tag-string" },
		{ tag: tags.bracket, class: "cm-tag-bracket" },
		{ tag: tags.punctuation, class: "cm-tag-punctuation" },
		{ tag: tags.invalid, class: "cm-tag-error" },
	])
);
