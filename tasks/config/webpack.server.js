/**
 * Created by xx on 16/3/28.
 */
'use strict';

let config = require('./index').server;
let webpack = require('webpack');
let path = require('path');
let fs = require('fs');
let nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    name: 'server',
    target: 'node',
    node: {
        __dirname: true
    },
    entry: './server/server.js',
    output: {
        path: path.resolve(__dirname, '../../', config.destination),
        filename: 'server.js'
    },
    externals: nodeModules,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015-node5'],
                    plugins: [
                        'transform-async-to-generator',
                    ]
                }
            },
            {
                test: /\.json?$/,
                loader: 'json'
            }
        ]
    },

    resolve: {
        root: path.resolve(__dirname, '../../dist'),
        extensions: ['','.js','.json']
    },
    plugins: [
        new webpack.DefinePlugin({
            ENVIRONMENT: JSON.stringify('production')
        })
    ],
};