const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    "app.js": "./js/app.js"
  },
  output: {
    path: path.join(__dirname, "../priv/static/js"),
    filename: '[name]'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./static", to: path.join(__dirname, "../priv/static") }])
  ]
};
