import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import store from '@/store';
import { LOADER_START, LOADER_STOP } from '@/constants';
import { Trans } from '@/plugins/translation';

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
    store.dispatch(LOADER_START);
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters.isStateAuthenticated && to.name !== 'login') {
            next({
                name: 'login',
                params: {
                    lang: Trans.getUserSupportedLang()
                }
            });
        } else {
            next();
        }
    } else {
        next(); // make sure to always call next()!
    }
});
router.afterEach((to, from) => {
    store.dispatch(LOADER_STOP);
});

export default router;
