const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
    const devtool = argv.mode === "production" ? "eval-source-map" : "inline-source-map"

    return {
        entry: {
            scripts: './src/index.js',
            styles: './src/styles/style.scss'
        },
        output: {
            path: path.join(__dirname, '/dist'),
            filename: '[name].[hash].js'
        },
        devtool: devtool,
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    enforce: 'pre',
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/i,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                favicon: "./src/static/favicon.png"
            }),
            new CleanWebpackPlugin(),
            new webpack.EnvironmentPlugin({
                API_HOST: process.env.API_HOST,
                API_PORT: process.env.API_PORT,
                WS_HOST: process.env.WS_HOST,
                WS_PORT: process.env.WS_PORT,
                SLEEP: process.env.SLEEP
            })
        ],
        devServer: {
            inline: true,
            port: 8000
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        }
    }
}