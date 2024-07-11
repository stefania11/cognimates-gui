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
                            additionalData: `@import "colors.css"; @import "units.css"; @import "typography.css"; @import "z-index.css";`
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
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
