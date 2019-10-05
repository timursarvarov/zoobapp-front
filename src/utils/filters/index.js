import capitilize from './capitilize';
import acronim from './acronim';
import toCurrentTeethSystem from './current-teeth-system';
import formatBytes from './format-bytes';
import numSeparator from './num-separator';

export default {
    install(Vue) {
        Vue.filter('formatBytes', formatBytes);
        Vue.filter('acronim', acronim);
        Vue.filter('toCurrentTeethSystem', toCurrentTeethSystem);
        Vue.filter('capitilize', capitilize);
        Vue.filter('numSeparator', numSeparator);
    }
};
