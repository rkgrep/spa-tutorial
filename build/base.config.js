// Define this constant for easier usage
const isProd = process.env.NODE_ENV === 'production'

const { resolve } = require('path')

const {
    ProvidePlugin,
    DllReferencePlugin,
    ContextReplacementPlugin,
    DefinePlugin,
    BannerPlugin,
    optimize: {
        CommonsChunkPlugin,
        UglifyJsPlugin,
    }
} = require('webpack')

const banner = `
file: [file]
author: rkgrep
source: https://github.com/rkgrep/spa-tutorial
license: MIT
`

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const AssetsPlugin = require('./AssetsPlugin')

const cssLoader = {
    loader: 'css-loader',
    options: {
        minimize: true,
    },
}

const srcDir = resolve(__dirname, '..', 'src')

const vendor = [
    'jquery',
    'bootstrap',
    'moment',
]

const config = {
    name: 'base',
    dependencies: ['templating'],

    // Include source maps in development files
    devtool: isProd ? '#source-map' : '#cheap-module-eval-source-map',

    node: {
        fs: 'empty'
    },

    entry: {
        vendor,
        app: resolve(srcDir, 'index.js'),
    },

    output: {
        path: resolve(__dirname, '..', 'dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
    },

    resolve: {
        extensions: ['*', '.js'],
        modules: [
            resolve(__dirname, '..', 'node_modules'),
        ],
        alias: {
            'highlight.js$': resolve(srcDir, 'lib', 'highlight.js'),
            handlebars: 'handlebars/dist/handlebars.min.js',

            '~html': resolve(srcDir, 'html'),
            '~styles': resolve(srcDir, 'styles'),
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['env'],
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: cssLoader,
                }),
            },
            {
                test: /\.scss|\.sass$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [cssLoader, 'sass-loader'],
                }),
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'images/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(webm|mp4)$/,
                loader: 'file-loader',
                options: {
                    name: 'videos/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.handlebars$/,
                loader: 'raw-loader',
            },
            {
                test: /\.md$/,
                loader: 'raw-loader',
            }
        ],
    },

    plugins: [
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Popper: 'popper.js',
        }),
        new HtmlWebpackPlugin({
            title: 'SPA tutorial',
            template: resolve(__dirname, '..', 'src', 'html', 'index.ejs'),
            chunks: ['app', 'vendor', 'templating'],
        }),
        AssetsPlugin,
        new ExtractTextPlugin({
            filename: 'style.[hash].css',
            disable: !isProd,
        }),
        new CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
        }),
        new ContextReplacementPlugin(/moment[\/\\]locale$/, /en|vi|ja/),
        new DefinePlugin({
            PRODUCTION: JSON.stringify(isProd),
            EXPRESSION: '1 + 1',
            RESULT: JSON.stringify('1 + 1'),
            DEV: JSON.stringify(!isProd),
        }),
    ],

    profile: isProd,

    performance: {
        hints: 'warning',
        maxEntrypointSize: 400000,
        maxAssetSize: 300000,
    },
}

if (!isProd) {
    config.devServer = {
        contentBase: resolve(__dirname, '..', 'static'),
        hot: true,
        publicPath: '/',
        historyApiFallback: true,
    }
}

if (isProd) {
    config.plugins = [
        ...config.plugins,
        new DllReferencePlugin({
            manifest: resolve(__dirname, '..', 'dist', 'templating-manifest.json'),
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: isProd ? 'static' : 'disabled',
            generateStatsFile: isProd,
            openAnalyzer: false,
        }),
        new UglifyJsPlugin({
            sourceMap: true,
        }),
        new BannerPlugin({
            banner,
        }),
    ]
}

module.exports = config
