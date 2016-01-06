'use strict';

var path = require('path');
var rootDir = path.join(__dirname, '../..');
var webpack = require('webpack');

module.exports = {
    entry: {
        main: "./Viewport.jsx",
        demo: "./Archive.jsx"
    },
    output: {
        path: rootDir + '/public/js',
        filename: "[name].bundle.js"
    },

    module: {
        loaders: [
//            { test: /.*\.css$/, loader: 'style-loader!css-loader' }
            {
                 test: /.*\.(jsx|js)$/,
                 loader: 'babel',
                 exclude: /node_modules/,
                 query: {
                     presets: ['es2015', 'react']
                }
            },
        ]
    },

    devtool: "#source-map",

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            }
        })
    ]

};
