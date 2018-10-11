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
        loader: require.resolve('babel-loader')
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader')
        ]
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/, /\.png$/, /\.svg$/],
        loader: require.resolve('file-loader'),
        options: {
          name: '../static/media/[name].[hash:8].[ext]',
        },
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./static", to: path.join(__dirname, "../priv/static") }])
  ]
};
