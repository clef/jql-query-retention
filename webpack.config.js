var webpack = require('webpack')

var config = {
  debug: true,
  devtool: 'source-map',

  entry: {
    index: './src/query.jql'
  },

  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    library: 'jql-query-retention',
    libraryTarget: 'umd',
  },

  resolve: {
    root: __dirname + '/src/',
    extensions: ["", '.js', '.jql']
  },

  module: {
    loaders: [
      {
        test: /\.(js|jql)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.jql$/,
        loader: 'jql-loader'
      }
    ],
  },
}

module.exports = config
