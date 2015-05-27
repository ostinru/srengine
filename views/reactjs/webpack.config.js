var path = require('path');
var rootDir = path.join(__dirname, '../..');

module.exports = {
    entry: "./Viewport.js",
    output: {
        path: rootDir + '/public/js',
        filename: "bundle.js"
    },

    module: {
        loaders: [
//            { test: /.*\.(jsx|js)$/, loader: 'babel-loader', exclude: /node_modules/ },
//            { test: /.*\.css$/, loader: 'style-loader!css-loader' }
            { test: /.*\.(jsx|js)$/, loader: 'jsx-loader', exclude: /node_modules/ },
        ]
    },

    devtool: "#source-map",
/*
    resolve: {
        root: rootDir,

        alias: {"actions/server.js": path.join(rootDir, '__test_page__', 'tree-store-mock.js')}
    }
    */
};
