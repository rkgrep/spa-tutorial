// Define this constant for easier usage
const isProd = process.env.NODE_ENV === 'production'

const { resolve } = require('path')
const { DllPlugin } = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const AssetsPlugin = require('./AssetsPlugin')

const config = {
    name: 'templating',

    // Include source maps in development files
    devtool: isProd ? false : '#cheap-module-source-map',

    node: {
        fs: 'empty'
    },

    entry: {
        templating: [
            'handlebars',
            'remarkable',
            'highlight.js',
        ],
    },

    output: {
		path: resolve(__dirname, '..', 'dist'),
        filename: '[name].[hash].dll.js',
        library: '[name]_[hash]',
    },

    resolve: {
        extensions: ['*', '.js'],
        modules: [
            resolve(__dirname, '..', 'node_modules'),
        ],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js',
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
        ],
    },

    plugins: [
		new DllPlugin({
			path: resolve(__dirname, '..', 'dist', '[name]-manifest.json'),
			name: '[name]_[hash]',
        }),
        AssetsPlugin,
        new BundleAnalyzerPlugin({
            analyzerMode: isProd ? 'static' : 'disabled',
            generateStatsFile: isProd,
            openAnalyzer: false,
            reportFilename: 'templating.report.html',
            statsFilename: 'templating.stats.json',
        }),
    ],

    profile: isProd,

    performance: {
        hints: 'warning',
        maxEntrypointSize: 400000,
        maxAssetSize: 300000,
    },
}

module.exports = config
