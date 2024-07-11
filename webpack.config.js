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
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
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
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8601,
        allowedHosts: 'all',
        hot: true,
        liveReload: true
    }
};
