const path = require("path");

module.exports = {
	entry: "./src/interop.ts",
	module: {
		rules: [
			// compile typescript
			{
				test: /\.tsx?$/i,
				use: "ts-loader",
			},
		],
	},
	resolve: {
		extensions: [".ts"],
	},
	output: {
		path: path.resolve(__dirname, "./distribution"),
		library: "TScript",
		libraryTarget: "var",
		filename: "tscript.js",
	},
};
