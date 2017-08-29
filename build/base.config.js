// Define this constant for easier usage
const isProd = process.env.NODE_ENV === 'production'

const { resolve } = require('path')

const {
    ProvidePlugin,
    DllReferencePlugin,
    ContextReplacementPlugin,
    optimize: {
        CommonsChunkPlugin,
        UglifyJsPlugin,
    }
} = require('webpack')

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

const config = {
    name: 'base',
    dependencies: ['templating'],

    // Include source maps in development files
    devtool: isProd ? false : '#cheap-module-source-map',

    node: {
        fs: 'empty'
    },

    entry: {
        vendor: [
            'jquery',
            'bootstrap',
            'moment',
        ],
        app: resolve(__dirname, '..', 'src', 'index.js'),
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
            handlebars: 'handlebars/dist/handlebars.min.js',
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
        new BundleAnalyzerPlugin({
            analyzerMode: isProd ? 'static' : 'disabled',
            generateStatsFile: isProd,
            openAnalyzer: false,
        }),
        new CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
        }),
        new DllReferencePlugin({
            manifest: resolve(__dirname, '..', 'dist', 'templating-manifest.json'),
        }),
        new UglifyJsPlugin(),
        new ContextReplacementPlugin(/moment[\/\\]locale$/, /en|vi|ja/),
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

module.exports = config
