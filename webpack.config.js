const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(path.resolve(__dirname, 'dist'));

module.exports = function (env, arg) {
    return {
        mode: env.production ? 'production' : 'development',
        entry: {
            app: path.join(__dirname, 'src/main.js'),
        },
        optimization: {
            minimizer: [
                new OptimizeCSSAssetsPlugin({}),
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'ZoobApp',
                template: 'index.html',
                favicon: 'src/assets/images/favicon.png',
                inject: true,
                chunksSortMode: 'none',
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new VueLoaderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            require('autoprefixer'),
            new CopyWebpackPlugin([{
                context: 'src/vendor',
                from: '**/*',
                to: 'vendor',
            }]),
        ],
        module: {
            rules: [{
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: [
                                'vue-style-loader',
                                'css-loader',
                                'sass-loader',
                            ],
                        },
                    },
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: file => (
                        /node_modules/.test(file)
                        && !/\.vue\.js/.test(file)
                    ),
                },
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        env.production ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({
                                        // browsers: ['last 16 version']
                                    }),
                                ],
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'images/[name].[ext]',
                    },
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]',
                    },
                },
            ],
        },
        devServer: {
            clientLogLevel: 'warning',
            open: true,
            hot: true,
            compress: true,
            contentBase: path.join(__dirname, 'src'),
            port: 8080,
        },
        devtool: env.production ? '#source-map' : 'cheap-module-eval-source-map',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                assets: path.resolve(__dirname, 'src/assets'),
            },
            extensions: ['.js', '.vue'],
        },
        output: {
            filename: '[name].[hash:7].js',
            path: path.resolve(__dirname, 'dist'),
        },
    };
};
