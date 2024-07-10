const defaultsDeep = require('lodash.defaultsdeep');
var path = require('path');
var webpack = require('webpack');

// Plugins
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // Minification is disabled to address linter error

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    node: {},
    devtool: 'cheap-module-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'build')
        },
        host: '0.0.0.0',
        port: process.env.PORT || 8601
    },
    output: {
        library: 'GUI',
        filename: '[name].js'
    },
    externals: {
        React: 'react',
        ReactDOM: 'react-dom'
    },
    resolve: {
        symlinks: false,
        fallback: {
            stream: require.resolve('stream-browserify'),
            url: require.resolve('url/')
        }
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, 'src'),
                /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                /node_modules[\\/]cognimates-l10n[\\/]src/
            ],
            options: {
                // Explicitly disable babelrc so we don't catch various config
                // in much lower dependencies.
                babelrc: false,
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-transform-async-to-generator',
                    '@babel/plugin-proposal-object-rest-spread',
                    ['react-intl', {
                        messagesDir: './translations/messages/'
                    }]],
                presets: [
                    ['@babel/preset-env', {targets: {browsers: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']}}],
                    '@babel/preset-react'
                ]
            }
        },
        // CSS loader configuration for non-node_modules CSS files
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            exportLocalsConvention: 'camelCase'
                        },
                        importLoaders: 1 // Ensure that only postcss-loader is applied before css-loader
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                'postcss-import',
                                'autoprefixer'
                            ]
                        }
                    }
                }
            ]
        },
        // SCSS loader configuration for non-node_modules SCSS files
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            exportLocalsConvention: 'camelCase'
                        },
                        importLoaders: 2 // Ensure that both postcss-loader and sass-loader are applied before css-loader
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                'postcss-import',
                                'autoprefixer'
                            ]
                        }
                    }
                },
                'sass-loader' // Add sass-loader to handle SCSS files
            ]
        },
        // CSS loader configuration for node_modules CSS files
        {
            test: /\.css$/,
            include: /node_modules/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1 // Ensure that only postcss-loader is applied before css-loader
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                'postcss-import',
                                'autoprefixer'
                            ]
                        }
                    }
                }
            ]
        }]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: false
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: []
};

module.exports = [
    // to run editor examples
    defaultsDeep({}, base, {
        entry: {
            gui: './src/playground/index.jsx',
            blocksonly: './src/playground/blocks-only.jsx',
            compatibilitytesting: './src/playground/compatibility-testing.jsx',
            player: './src/playground/player.jsx'
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js'
        },
        externals: {
            React: 'react',
            ReactDOM: 'react-dom'
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: /\.(svg|png|wav|gif|jpg)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'static/assets/'
                    }
                }
            ])
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: false
            },
            runtimeChunk: {
                name: 'runtime'
            }
        },
        plugins: base.plugins.concat([
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(
                    process.env.NODE_ENV === 'production' ? 'production' : 'development'
                ),
                'process.env.DEBUG': JSON.stringify(Boolean(process.env.DEBUG)),
                'process.env.GA_ID': JSON.stringify(process.env.GA_ID || 'UA-000000-01')
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'gui'],
                template: 'src/playground/index.ejs',
                title: 'Cognimates GUI',
                sentryConfig: process.env.SENTRY_CONFIG ? '"' + process.env.SENTRY_CONFIG + '"' : null
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'blocksonly'],
                template: 'src/playground/index.ejs',
                filename: 'blocks-only.html',
                title: 'Scratch 3.0 GUI: Blocks Only Example'
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'compatibilitytesting'],
                template: 'src/playground/index.ejs',
                filename: 'compatibility-testing.html',
                title: 'Scratch 3.0 GUI: Compatibility Testing'
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'player'],
                template: 'src/playground/index.ejs',
                filename: 'player.html',
                title: 'Scratch 3.0 GUI: Player Example'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from: 'static', to: 'static'},
                    {from: 'node_modules/scratch-blocks/media', to: 'static/blocks-media'}
                ]
            })
        ])
    })
].concat(
    process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist' ? (
        // export as library
        defaultsDeep({}, base, {
            target: 'web',
            entry: {
                'scratch-gui': './src/index.js'
            },
            output: {
                libraryTarget: 'umd',
                path: path.resolve('dist')
            },
            externals: {
                'React': 'react',
                'ReactDOM': 'react-dom',
                'cognimates-l10n': true
            },
            module: {
                rules: base.module.rules.concat([
                    {
                        test: /\.(svg|png|wav|gif|jpg)$/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/assets/',
                            publicPath: '/static/assets/'
                        }
                    }
                ])
            },
            plugins: base.plugins.concat([
                new CopyWebpackPlugin({
                    patterns: [
                        {from: 'node_modules/scratch-blocks/media', to: 'static/blocks-media'}
                    ]
                })
            ])
        })) : []
);
