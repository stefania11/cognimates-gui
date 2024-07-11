const path = require('path');

module.exports = {
    mode: 'development', // Set mode to development
    resolve: {
        alias: {
            'scratch-paint': path.resolve(__dirname, 'node_modules/scratch-paint/src'),
            'css': path.resolve(__dirname, 'src/css')
        },
        extensions: ['.js', '.jsx', '.scss'] // Add .scss to extensions
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                oneOf: [
                    {
                        test: /\.css$/,
                        include: path.resolve(__dirname, 'node_modules/scratch-paint'),
                        use: [
                            'style-loader',
                            'css-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    implementation: require('sass'),
                                    sassOptions: {
                                        includePaths: [path.resolve(__dirname, 'src/css')]
                                    },
                                    additionalData: '@import "css/colors.scss"; @import "css/units.scss"; @import "css/z-index.scss";'
                                }
                            }
                        ]
                    },
                    {
                        test: /\.scss$/,
                        include: path.resolve(__dirname, 'node_modules/scratch-paint'),
                        use: [
                            'style-loader',
                            'css-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    implementation: require('sass'),
                                    sassOptions: {
                                        includePaths: [path.resolve(__dirname, 'src/css')]
                                    },
                                    additionalData: '@import "css/colors.scss"; @import "css/units.scss"; @import "css/z-index.scss";'
                                }
                            }
                        ]
                    },
                    {
                        test: /\.css$/,
                        exclude: path.resolve(__dirname, 'node_modules/scratch-paint'),
                        use: [
                            'style-loader',
                            'css-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    implementation: require('sass'),
                                    sassOptions: {
                                        includePaths: [path.resolve(__dirname, 'src/css')]
                                    },
                                    additionalData: '@import "css/colors.scss"; @import "css/units.scss"; @import "css/z-index.scss";'
                                }
                            },
                            'postcss-loader' // Move postcss-loader after sass-loader
                        ]
                    },
                    {
                        test: /\.scss$/,
                        exclude: path.resolve(__dirname, 'node_modules/scratch-paint'),
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        namedExport: false
                                    }
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    implementation: require('sass'),
                                    sassOptions: {
                                        includePaths: [path.resolve(__dirname, 'src/css')]
                                    },
                                    additionalData: '@import "css/colors.scss"; @import "css/units.scss"; @import "css/z-index.scss";'
                                }
                            },
                            'postcss-loader' // Move postcss-loader after sass-loader
                        ]
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules\/(?!scratch-paint)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 8601,
        allowedHosts: 'all',
        hot: true,
        liveReload: true
    },
    stats: {
        errorDetails: true
    }
};
