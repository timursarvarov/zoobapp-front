/* eslint-disable no-param-reassign */
//! настройка модуля необходисмая для svg генерации
// module.exports = {
//     devServer: {
//         watchOptions: {
//             poll: true,
//         },
//     },
//     chainWebpack: (config) => {
//         const svgRule = config.module.rule('svg');

//         svgRule.uses.clear();

//         svgRule
//             .use('vue-svg-loader')
//             .loader('vue-svg-loader');
//     },
// };
module.exports = {
    devServer: {
        // clientLogLevel: 'info',
        watchOptions: {
            poll: true,
            aggregateTimeout: 300,
        },
    },
    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();

        svgRule
            .use('vue-svg-loader')
            .loader('vue-svg-loader');
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap((options) => {
                options.prettify = false;
                return options;
            });
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true,
        },
    },
};
