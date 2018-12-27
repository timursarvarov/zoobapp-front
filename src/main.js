import Vue from 'vue';
import VueRouter from 'vue-router';
import Chartist from 'chartist';
import store from './store';
import DashboardPlugin from './material-dashboard';

// Plugins
import App from './App.vue';

// router setup
import routes from './routes/routes';

// plugin setup
Vue.use(VueRouter);
Vue.use(DashboardPlugin);

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
  router,
  store,
  data: {
    Chartist,
  },
});
