const path = require('path');

module.exports = {
    resolve: {
        alias: {
            'scratch-paint': path.resolve(__dirname, 'node_modules/scratch-paint/src'),
            'css': path.resolve(__dirname, 'src/css')
        }
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
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
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, 'src/css')]
                            },
                            additionalData: `@import "${path.resolve(__dirname, 'src/css/colors.scss')}"; @import "${path.resolve(__dirname, 'src/css/units.scss')}"; @import "${path.resolve(__dirname, 'src/css/typography.scss')}"; @import "${path.resolve(__dirname, 'src/css/z-index.scss')}";`
                        }
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
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 8601,
        allowedHosts: 'all',
        hot: true,
        liveReload: true
    }
};
