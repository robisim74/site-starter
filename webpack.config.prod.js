const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entries = require('./entries');
const { getModernEntry, getLegacyEntry, MultipleModernHtmlWebpackPlugin, MultipleLegacyHtmlWebpackPlugin } = require('./scripts/utils');

// Naming
const MODERN_SUFFIX = 'es2015';
const LEGACY_SUFFIX = 'es5';

const FILENAME = `[name].[hash]`;
const MODERN_FILENAME = `[name]-${MODERN_SUFFIX}.[hash]`;
const LEGACY_FILENAME = `[name]-${LEGACY_SUFFIX}.[hash]`;

// Configs
const modernConfig = {
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    entry: getModernEntry(entries),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `js/${MODERN_FILENAME}.js`,
        chunkFilename: `js/${MODERN_FILENAME}.js`
    },
    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'assets'),
                    globOptions: {
                        dot: false
                    },
                    to: 'assets'
                }
            ]
        }),
        ...MultipleModernHtmlWebpackPlugin(entries),
        new ScriptExtHtmlWebpackPlugin({
            module: MODERN_SUFFIX
        }),
        new MiniCssExtractPlugin({
            filename: `css/${FILENAME}.css`
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        envName: 'modern' // Points to env.modern in babel.config.js
                    }
                }
            },
            {
                test: /\.s?css/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    stats: {
        colors: true,
        modules: false,
        entrypoints: false
    }
};

const legacyConfig = {
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    entry: getLegacyEntry(entries),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `js/${LEGACY_FILENAME}.js`,
        chunkFilename: `js/${LEGACY_FILENAME}.js`
    },
    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        ...MultipleLegacyHtmlWebpackPlugin(entries),
        new ScriptExtHtmlWebpackPlugin({
            custom: [
                {
                    test: LEGACY_SUFFIX,
                    attribute: 'nomodule',
                }
            ],
            defaultAttribute: 'defer'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        envName: 'legacy' // Points to env.legacy in babel.config.js
                    }
                }
            }
        ]
    },
    stats: {
        colors: true,
        modules: false,
        entrypoints: false
    }
};

module.exports = {
    modernConfig,
    legacyConfig
};
