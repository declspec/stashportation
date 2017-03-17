'use strict';

const DEST_PATH = '../../public/dist';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const environment = (process.env.NODE_ENV || 'development').toLowerCase();
const extractCss = new ExtractTextPlugin({ filename: '[name].css', allChunks: true });

const plugins = [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity }),
    extractCss
];

module.exports = {
    plugins: plugins,

    entry: {
        'stash.app': './src/stash/app.js',
        'vendor': [ 'angular', 'angular-ui-router', './src/polyfills/index.js' ]
    },

    output: {
        path: DEST_PATH,
        publicPath: '/dist/',
        filename: '[name].js'
    },

    resolve: {
        extensions: [ '.js' ], 
        modules: [ 
            path.resolve('src'),
            'node_modules'
        ]
    },

    module: {
        rules: [
            { 
                test: /\.html?$/, 
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: './src' 
                }
            },
            { test: /\.css$/, loader: extractCss.extract({ fallback: 'style-loader', use: 'css-loader' }) },
            { 
                test: /\.scss$/, 
                loader: extractCss.extract({
                    fallback: 'style-loader',
                    use: [ 'css-loader', 'sass-loader' ]
                })
            },
            { 
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    plugins: ['babel-plugin-transform-decorators-legacy'],
                    presets: ['es2015']
                }
            }
        ]
    }
}