import Vue from 'vue';

import VueRouter from 'vue-router';
import Chartist from 'chartist';
import Viewer from 'v-viewer';
import store from './store';
import DashboardPlugin from './material-dashboard';

// Plugins
import App from './App.vue';

// Filters
import filters from './filters';


// router setup
import routes from './routes/routes';


// plugin setup
Vue.use(filters);
Vue.use(VueRouter);
Vue.use(DashboardPlugin);
Vue.use(Viewer);

Vue.use(require('vue-moment'));

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: 'nav-item active',
});
// router.beforeEach((to, from, next) => {
//   setTimeout(() => {
//     window.scrollTo(0, 0);
//   }, 10000);
//   next();
// });

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
  router,
  store,
  data: {
    Chartist,
  },
});
