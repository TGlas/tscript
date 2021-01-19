const path = require('path');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  { //compile .ts and tsc
    entry: './src/index.ts',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          //exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../dist'),
    },
  },
  {
    entry: ['./css/ide.css', './css/tgui.css', './css/codemirror.css', './css/documentation.css' ],
    mode: "production",
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'bundle.css',
      }),
    ],
    output:{
      path: path.resolve(__dirname, '../dist'),
    }
  }
];