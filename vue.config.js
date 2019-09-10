module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/public'
};

// module.exports = {
//     chainWebpack: config => {
//         config.module
//         .rule('css')
//           .test(require.resolve('zepto'))
//           .use('exports')
//             .loader('exports-loader?window.Zepto')
//             .end()
//           .use('script')
//             .loader('script-loader')
//             .end()
//     }
// };
// module.exports = {
//     chainWebpack: config => {
//       config.module
//         .rule('css-to-string-loader')
//         .test(/\.css$/)
//         .use('css-to-string-loader')
//           .loader('css-to-string-loader!css-loader')
//           .end()
//     }
//   }
