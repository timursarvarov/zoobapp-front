import Vue from 'vue';
// import VueRouter from 'vue-router';
import Chartist from 'chartist';
import store from './store';
import DashboardPlugin from './material-dashboard';
import router from './routes';
import i18n from './plugins/vue-i18n';
import './plugins/vee-validate';

// Plugins
import App from './App.vue';

// Filters
import filters from '@/utils/filters';
import { Trans } from './plugins/translation';

Vue.prototype.$i18nRoute = Trans.i18nRoute.bind(Trans);

// plugin setup
Vue.use(filters);
// Vue.use(VueRouter);
Vue.use(DashboardPlugin);

Vue.use(require('vue-moment'));

Object.defineProperty(Vue.prototype, '$Chartist', {
    get() {
        return this.$root.Chartist;
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    data: {
        Chartist
    },
    render: h => h(App),
    mq: {
        xsmall: '(max-width: 599px)',
        small: '(max-width: 959px)',
        medium: '(max-width: 1279px)',
        large: '(max-width: 1919px)',
        xlarge: '(min-width: 1920px)'
    }
});
