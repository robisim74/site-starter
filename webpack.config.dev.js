const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require('./config');
const { getModernEntry, MultipleModernHtmlWebpackPlugin, getAssets } = require('./scripts/utils');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    context: path.resolve(__dirname, 'src'),
    entry: getModernEntry(config.entries),
    output: {
        path: path.resolve(__dirname, config.buildDir),
        filename: 'js/[name].js',
    },
    optimization: {
        noEmitOnErrors: true
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        hot: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                ...getAssets(config.assets)
            ]
        }),
        ...MultipleModernHtmlWebpackPlugin(config.entries)
    ],
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                include: path.resolve(__dirname, 'src'),
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    emitWarning: true,
                },
            },
            {
                test: /\.(js|ts)$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.(js|ts)$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        envName: 'modern' // Points to env.modern in babel.config.js
                    }
                }
            },
            {
                test: /\.s?css$/i,
                use: [
                    'style-loader',
                    'css-loader?sourceMap=true',
                    'sass-loader'
                ]
            }
        ]
    },
    stats: 'minimal'
};