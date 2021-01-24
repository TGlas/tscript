const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;


module.exports = {
  entry: ['./src/index.ts', './src/css/ide.css', './src/css/tgui.css', './src/css/codemirror.css', './src/css/documentation.css'],
  module: {
    rules: [
      // compile typescript
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
      },
      // bundle css
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.css', '.html'],
  },
  plugins: [
    // handle css
    new MiniCssExtractPlugin(),
    // create webpage
    new HtmlWebpackPlugin({
      inject: 'head',
      template: './src/index.html'
    }),
    // inline
    new HtmlInlineScriptPlugin(),
    new HTMLInlineCSSWebpackPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, './distribution'),
    filename: '_.js'
  },
};