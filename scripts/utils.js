const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../config');

const getModernEntry = (entries) => {
    const entry = {};
    for (const value of entries) {
        entry[value.name] = [value.module, value.style];
    }
    return entry;
};

const getLegacyEntry = (entries) => {
    const entry = {};
    for (const value of entries) {
        entry[value.name] = value.module;
    }
    return entry;
};

const MultipleModernHtmlWebpackPlugin = (entries, baseHref = '/') => {
    return entries.map(value =>
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, `../${config.buildDir}/${value.template}`),
            template: path.resolve(__dirname, `../src/${value.template}`),
            chunks: [value.name],
            favicon: path.resolve(__dirname, '../src/favicon.ico'),
            base: baseHref
        })
    );
};

const MultipleLegacyHtmlWebpackPlugin = (entries) => {
    return entries.map(value =>
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, `../${config.buildDir}/${value.template}`),
            template: path.resolve(__dirname, `../${config.buildDir}/${value.template}`), // Points to outDir
            chunks: [value.name]
        })
    );
};

const getHtmlSourceFiles = (entries) => {
    return entries.map(value =>
        value.template
    );
};

const getPaths = (entries) => {
    return entries.filter(value => value.path != undefined).map(value =>
        value.path
    );
};

const getAssets = (assets) => {
    return assets.map(asset => {
        return {
            from: path.resolve(__dirname, `../src/${asset}`),
            to: asset
        };
    });
};

module.exports = {
    getModernEntry,
    getLegacyEntry,
    MultipleModernHtmlWebpackPlugin,
    MultipleLegacyHtmlWebpackPlugin,
    getHtmlSourceFiles,
    getPaths,
    getAssets
};
