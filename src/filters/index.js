import capitilize from './capitilize';
import acronim from './acronim';


export default {
    install(Vue) {
        Vue.filter('capitilize', capitilize);
        Vue.filter('acronim', acronim);
    },
};
