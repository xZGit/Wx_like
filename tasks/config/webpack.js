'use strict';
let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let config = require('./index').client;

module.exports = {
  entry: {
    boot: './client/boot.js',
    vendor: './client/vendor.js'
  },
  output: {
    path: path.resolve(__dirname, '../../', config.destination),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015-node5'],
          plugins: [
            'angular2-annotations',
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-flow-strip-types'
          ]
        }
      },
      {
        test: /\.html$/,
        loader: "html?minimize=false"
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      }
    ]
  },

  resolve: {
    root: path.resolve(__dirname, '../../'),
    extensions: ['','.js','.json']
  },

  plugins: [
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('development')
    }),
    new webpack.optimize.CommonsChunkPlugin(
      'vendor', 'vendor.js'
    ),
    new ExtractTextPlugin("[name].css")
  ],

  devtool: 'source-map'
};
