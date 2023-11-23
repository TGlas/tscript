import { EditorView } from "codemirror";

export const baseTheme = EditorView.baseTheme({
	"&": {
		width: "100%",
		height: "100%",
		backgroundColor: "#fff",
	},

	"& .cm-activeLine": {
		backgroundColor: "#ccddff",
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

	// Dark theme

	".dark-theme &": {
		backgroundColor: "#222",
	},

	".dark-theme & .cm-cursor": {
		borderLeft: "1.2px solid #fff",
	},

	".dark-theme & .cm-activeLine": {
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
});
