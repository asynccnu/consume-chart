var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    path.resolve(__dirname, './index.js')
  ],
  output: {
    path:'/',
    path: path.join(__dirname,'./build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js'],
  }
};