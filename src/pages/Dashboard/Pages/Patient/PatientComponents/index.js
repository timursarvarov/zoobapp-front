import Vue from 'vue';

const requireComponents = {};
const requireComponentContext = require.context('./', true, /\.vue$/i, 'lazy'); // lazy!
requireComponentContext.keys().forEach(fileName => {
    const componentName = Vue._.upperFirst(
        Vue._.camelCase(
            fileName
                .split('/')
                .pop()
                .replace(/\.\w+$/, '')
        )
    );
    const componentConfig = requireComponentContext(fileName);
    requireComponents[componentName] = () => componentConfig;
});

export default {
    ...requireComponents
};
