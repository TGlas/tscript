const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin")
	.default;

module.exports = (_, options) => {
	const isProd = options.mode === "production";

	const plugins = [
		// handle css
		new MiniCssExtractPlugin(),
		// create webpage
		new HtmlWebpackPlugin({
			inject: "head",
			template: "./src/ide/index.html",
		}),
	];

	if (isProd) {
		// inline
		plugins.push(
			isProd && new HtmlInlineScriptPlugin(),
			isProd && new HTMLInlineCSSWebpackPlugin()
		);
	}

	return {
		entry: ["./src/ide/index.ts"],
		devtool: isProd ? false : "eval-cheap-module-source-map",
		module: {
			rules: [
				// compile typescript
				{
					test: /\.tsx?$/i,
					use: "ts-loader",
				},
				// bundle css
				{
					test: /\.css$/i,
					use: [MiniCssExtractPlugin.loader, "css-loader"],
				},
			],
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js", ".css", ".html"],
		},
		plugins,
		output: {
			path: path.resolve(__dirname, "./distribution"),
			filename: "[name].js",
		},
	};
};
