import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import store from '@/store';

Vue.use(Router);

// export default new Router({
const router = new Router({
    routes,
    mode: 'history',
    base: __dirname,
    linkExactActiveClass: 'nav-item active',
    scrollBehavior(to, from, savedPosition) {
        if (to.matched.some(m => m.meta.disableScroll)) return;
        const position = {
            x: 0,
            y: 0
        };

        if (savedPosition) {
            position.x = savedPosition.x;
            position.y = savedPosition.y;
        }

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(position);
            }, 400);
        });
    }
});

router.beforeEach((to, from, next) => {
    // store.dispatch(LOADER_START);
    // console.log('start')
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters.isStateAuthenticated) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next(); // make sure to always call next()!
    }
});
// router.afterEach((to, from) => {
//     console.log('stop')
//     store.dispatch(LOADER_STOP);
// });

export default router;
