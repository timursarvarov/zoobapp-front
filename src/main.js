import Vue from 'vue';

import VueRouter from 'vue-router';
import Chartist from 'chartist';
import store from './store';
import DashboardPlugin from './material-dashboard';
import i18n from './i18n';


// Plugins
import App from './App.vue';

// Filters
import filters from '@/utils/filters';

// router setup
import routes from './routes/routes';

// plugin setup
Vue.use(filters);
Vue.use(VueRouter);
Vue.use(DashboardPlugin);

Vue.use(require('vue-moment'));

// configure router
const router = new VueRouter({
    routes, // short for routes: routes
    linkExactActiveClass: 'nav-item active',
});

// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
    get() {
        return this.$root.Chartist;
    },
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App),
    i18n,
    router,
    store,
    data: {
        Chartist,
    },
});
