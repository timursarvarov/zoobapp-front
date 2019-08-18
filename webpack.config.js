/* eslint-disable global-require */
const environment = (process.env.NODE_ENV || 'development').trim();

if (environment === 'development') {
    module.exports = require('./config/webpack.config.dev');
} else {
    module.exports = require('./config/webpack.config.prod');
}

// /* eslint-disable func-names */
// /* eslint-disable no-unused-vars */
// /* eslint-disable global-require */
// const path = require('path');
// const webpack = require('webpack');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const autoprefixer = require('autoprefixer');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');

// const isProd = process.env.NODE_ENV === 'production';
// const isDev = process.env.NODE_ENV === 'development';
// const helpers = require('./node.helpers.js');

// console.log(path.resolve(__dirname, 'dist'));

// module.exports = () => ({
//     mode: JSON.stringify(process.env.NODE_ENV),
//     entry: {
//         // app: path.join(__dirname, 'src/main.js'),
//         polyfill: '@babel/polyfill',
//         main: helpers.root('src', 'main'),
//     },
//     optimization: {
//         minimizer: [
//             new OptimizeCSSAssetsPlugin({
//                 cssProcessorPluginOptions: {
//                     preset: [
//                         'default',
//                         { discardComments: { removeAll: true } },
//                     ],
//                 },
//             }),
//             new UglifyJsPlugin({
//                 cache: true,
//                 parallel: true,
//                 sourceMap: !isProd,
//             }),
//         ],
//         runtimeChunk: 'single',
//         splitChunks: {
//             chunks: 'all',
//             maxInitialRequests: Infinity,
//             minSize: 0,
//             cacheGroups: {
//                 vendor: {
//                     test: /[\\/]node_modules[\\/]/,
//                     name(module) {
//                         const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
//                         return `npm.${packageName.replace('@', '')}`;
//                     },
//                 },
//                 styles: {
//                     test: /\.css$/,
//                     name: 'styles',
//                     chunks: 'all',
//                     enforce: true,
//                 },
//             },
//         },
//     },
//     plugins: [
//         new VueLoaderPlugin(),
//         new webpack.EnvironmentPlugin(['NODE_ENV']),
//         new CompressionPlugin({
//             filename: '[path].gz[query]',
//             algorithm: 'gzip',
//             test: new RegExp('\\.(js|css)$'),
//             threshold: 10240,
//             minRatio: 0.8,
//         }),
//         new webpack.HashedModuleIdsPlugin(),
//         new FriendlyErrorsWebpackPlugin(),
//         new CleanWebpackPlugin(),
//         new HtmlWebpackPlugin({
//             title: 'ZoobApp',
//             template: 'index.html',
//             favicon: 'src/assets/images/favicon.png',
//             inject: true,
//             chunksSortMode: 'dependency',
//         }),
//         new MiniCSSExtractPlugin({
//             filename: 'css/[name].[hash].css',
//             chunkFilename: 'css/[id].[hash].css',
//         }),
//         new webpack.HotModuleReplacementPlugin(),
//         require('autoprefixer'),
//         new CopyWebpackPlugin([{
//             context: 'src/vendor',
//             from: '**/*',
//             to: 'vendor',
//         }]),
//     ],
//     module: {
//         rules: [{
//                 test: /\.vue$/,
//                 loader: 'vue-loader',
//                 include: [helpers.root('src')],
//             },
//             {
//                 test: /\.js$/,
//                 loader: 'babel-loader',
//                 include: [helpers.root('src')],
//             },
//             {
//                 test: /\.css$/,
//                 use: [
//                     isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
//                     { loader: 'css-loader', options: { sourceMap: isDev } },
//                 ],
//             },
//             {
//                 test: /\.scss$/,
//                 use: [
//                     isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
//                     { loader: 'css-loader', options: { sourceMap: isDev } },
//                     { loader: 'sass-loader', options: { sourceMap: isDev } },
//                 ],
//             },
//             {
//                 test: /\.sass$/,
//                 use: [
//                     isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
//                     { loader: 'css-loader', options: { sourceMap: isDev } },
//                     { loader: 'sass-loader', options: { sourceMap: isDev } },
//                 ],
//             },
//         ],
        // rules: [{
        //         test: /\.vue$/,
        //         loader: 'vue-loader',
        //         options: {
        //             loaders: {
        //                 scss: [
        //                     'vue-style-loader',
        //                     'css-loader',
        //                     'sass-loader',
        //                 ],
        //             },
        //         },
        //     },
        //     {
        //         test: /\.js$/,
        //         loader: 'babel-loader',
        //         exclude: file => (
        //             /node_modules/.test(file)
        //             && !/\.vue\.js/.test(file)
        //         ),
        //     },
        //     {
        //         test: /\.css$/,
        //         use: [
        //             'vue-style-loader',
        //             'css-loader',
        //         ],
        //     },
        //     {
        //         test: /\.scss$/,
        //         use: [
        //             isDev ? MiniCSSExtractPlugin.loader : 'vue-style-loader',
        //             'css-loader',
        //             {
        //                 loader: 'postcss-loader',
        //                 options: {
        //                     plugins: [
        //                         autoprefixer({
        //                             // browsers: ['last 16 version']
        //                         }),
        //                     ],
        //                 },
        //             },
        //             'sass-loader',
        //         ],
        //     },
        //     {
        //         test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        //         loader: 'url-loader',
        //         options: {
        //             limit: 10000,
        //             name: 'images/[name].[ext]',
        //         },
        //     },
        //     {
        //         test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        //         loader: 'url-loader',
        //         options: {
        //             limit: 10000,
        //             name: 'fonts/[name].[hash:7].[ext]',
        //         },
        //     },
        // ],
//     },
//     devServer: {
//         compress: true,
//         historyApiFallback: true,
//         hot: true,
//         open: true,
//         overlay: true,
//         port: 8000,
//         stats: {
//             normal: true,
//         },
//         // clientLogLevel: 'warning',
//         // quiet: true,
//         // open: true,
//         // hot: true,
//         // compress: true,
//         // contentBase: path.join(__dirname, 'src'),
//         // port: 8080,
//     },
//     devtool: isDev ? '#source-map' : 'cheap-module-eval-source-map',
//     resolve: {
//         alias: {
//             vue$: isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
//             '@': helpers.root('src'),
//         },
//     },
//     output: {
//         path: helpers.root('dist'),
//         publicPath: '/',
//         filename: 'js/[name].bundle.js',
//         chunkFilename: 'js/[id].chunk.js',
//     },
// });