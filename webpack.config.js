var path = require('path');
var webpack = require('webpack');

var buildRoot = './build';
var isDev = process.argv.indexOf('-p') === -1;

var conf = {
    entry: {
        config: './src/config.js',
        app: './src/sidebar.js',
    },
    output: {
        filename: '[name].js',
        path: buildRoot,
        publicPath: '/scripts/spa/',
    },
    module: {
        loaders: [
            { exclude: /node_modules/, test: /\.jsx?$/, loader: 'babel?cacheDirectory' },
            { test: /\.json$/, loader: 'json' },
        ],
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
    ],
    resolve: {
        extensions: [
            '',
            '.js',
            '.jsx',
            '.json',
        ],
    }
};

if (!isDev) {
    conf.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    );
    conf.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        })
    );
}

module.exports = conf;
