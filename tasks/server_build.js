/**
 * Created by xx on 16/3/28.
 */


'use strict';
let gulp = require('gulp');
let webpack = require('webpack');
let util = require('gulp-util');

module.exports = function(singleRun, callback) {
    return function(cb) {
        let webpackConfig = require('./config/webpack.server.js');
        let webpackBuild = webpack(webpackConfig);


        let callbackOnBuild = function (err, stats) {
            if (err) {
                throw new util.PluginError("webpack:error", err);
            }

        };
        webpackBuild.run(callbackOnBuild);

    };

};





