'use strict';

const pkg = require('./package.json');
const DEST_PATH = `../../public/dist/${pkg.version}`;

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const environment = (process.env.NODE_ENV || 'development').toLowerCase();
const extractCss = new ExtractTextPlugin({ filename: '[name].css', allChunks: true });

const plugins = [
    new webpack.optimize.CommonsChunkPlugin({ 
        name: 'vendor', 
        chunks: ['vendor']
    }),
    extractCss
];

if (process.env.NODE_ENV === 'production')
    plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = {
    plugins: plugins,

    entry: {
        'stash.app': './src/stash/app.js',
        'vendor': [ 'angular', 'angular-ui-router', 'ng-modal-dialog', './lib/polyfills/index.js' ]
    },

    output: {
        path: DEST_PATH,
        publicPath: `/dist/${pkg.version}`,
        filename: '[name].js'
    },

    resolve: {
        extensions: [ '.js' ], 
        alias: {
            lib: path.resolve('lib')
        },
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
            { 
                test: /\.css$/, 
                loader: extractCss.extract({ fallback: 'style-loader', use: 'css-loader' }) 
            },
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
                    presets: [['es2015', { modules: false }]]
                }
            }
        ]
    }
}