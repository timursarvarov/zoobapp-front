import capitilize from './capitilize';
import acronim from './acronim';
import toCurrentTeethSystem from './current-teeth-system';
import formatBytes from './format-bytes';

export default {
  install(Vue) {
    Vue.filter('formatBytes', formatBytes);
    Vue.filter('capitilize', capitilize);
    Vue.filter('acronim', acronim);
    Vue.filter('toCurrentTeethSystem', toCurrentTeethSystem);
  },
};
