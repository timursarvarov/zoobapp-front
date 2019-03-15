import capitilize from './capitilize';
import acronim from './acronim';
import toCurrentTeethSystem from './current-system';


export default {
    install(Vue) {
        Vue.filter('capitilize', capitilize);
        Vue.filter('acronim', acronim);
        Vue.filter('toCurrentTeethSystem', toCurrentTeethSystem);
    },
};
