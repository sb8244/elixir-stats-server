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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./static", to: path.join(__dirname, "../priv/static") }])
  ]
};
