<template>
    <div class="full-page" :class="{ 'nav-open': $sidebar.showSidebar }">
        <md-toolbar md-elevation="0" class="md-transparent md-toolbar-absolute">
            <div class="wrapper-progress-bar">
                <md-progress-bar v-if="loading" class="md-white" md-mode="indeterminate" />
            </div>
            <div class="md-toolbar-row md-offset">
                <div class="md-toolbar-section-start">
                    <h3 class="md-title">
                        {{ $t(`${$options.name}.${$route.name}`) }}
                    </h3>
                </div>
                <div class="md-toolbar-section-end">
                    <md-button
                        class="md-just-icon md-simple md-round md-toolbar-toggle"
                        :class="{ toggled: $sidebar.showSidebar }"
                        @click="toggleSidebar"
                    >
                        <span class="icon-bar" />
                        <span class="icon-bar" />
                        <span class="icon-bar" />
                    </md-button>

                    <div class="md-collapse" :class="{ 'off-canvas-sidebar': responsive }">
                        <md-list>
                            <md-list-item v-if="isStateAuthenticated" to="dashboard">
                                <!-- <router-link to="dashboard" > -->
                                <md-icon>dashboard</md-icon>
                                {{ $t(`${$options.name}.dashbord`) }}
                                <!-- </router-link> -->
                            </md-list-item>
                            <md-list-item @click="linkClick">
                                <router-link to="pricing">
                                    <md-icon>attach_money</md-icon>
                                    {{ $t(`${$options.name}.pricing`) }}
                                </router-link>
                            </md-list-item>
                            <md-list-item @click="linkClick">
                                <router-link to="register">
                                    <md-icon>person_add</md-icon>
                                    {{ $t(`${$options.name}.register`) }}
                                </router-link>
                            </md-list-item>
                            <md-list-item @click="linkClick">
                                <router-link to="login">
                                    <md-icon>fingerprint</md-icon>
                                    {{ $t(`${$options.name}.login`) }}
                                </router-link>
                            </md-list-item>
                            <md-list-item v-if="isProfileLoaded" @click="linkClick">
                                <router-link to="lock">
                                    <md-icon>lock_open</md-icon>
                                    {{ $t(`${$options.name}.lock`) }}
                                </router-link>
                            </md-list-item>
                            <t-language-switcher />
                        </md-list>
                    </div>
                </div>
            </div>
        </md-toolbar>
        <div class="wrapper wrapper-full-page" @click="toggleSidebarPage">
            <div class="page-header header-filter" :class="setPageClass" filter-color="black" :style="setBgImage">
                <div class="container md-offset">
                    <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
                        <router-view />
                    </zoom-center-transition>
                </div>
                <footer class="footer">
                    <div class="container md-offset">
                        <nav>
                            <ul>
                                <li>
                                    <router-link :to="{ path: '/dashboard' }">
                                        Home
                                    </router-link>
                                </li>
                                <li>
                                    <a href="#">Company</a>
                                </li>
                                <li>
                                    <a href="#">Portfolio</a>
                                </li>
                                <li>
                                    <a href="#">Blog</a>
                                </li>
                            </ul>
                        </nav>
                        <div class="copyright text-center">
                            &copy; {{ new Date().getFullYear() }} <a href="#" target="_blank">Owl Team</a>, made with
                            <i class="fa fa-heart heart" /> for a better web
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>
<script>
import { ZoomCenterTransition } from 'vue2-transitions';
import { mapGetters } from 'vuex';
import components from '@/components';
import { LOGIN_BACKGROUND_URL, AVAILABLE_LANGUAGES, LOCAL_STORAGE, USER_UPDATE } from '@/constants';

export default {
    name: 'AuthLayout',
    components: {
        ZoomCenterTransition,
        ...components
    },
    props: {
        backgroundColor: {
            type: String,
            default: 'black'
        }
    },
    inject: {
        autoClose: {
            default: true
        }
    },
    data() {
        return {
            responsive: false,
            showMenu: false,
            menuTransitionDuration: 250,
            pageTransitionDuration: 300,
            year: new Date().getFullYear()
        };
    },
    computed: {
        ...mapGetters({
            isProfileLoaded: 'isProfileLoaded',
            isStateAuthenticated: 'isStateAuthenticated',
            loading: 'loading'
        }),
        setBgImage() {
            // const images = {
            //     Pricing: './img/backround-register.jpg',
            //     Login: './img/backround-register.jpg',
            //     Clinics: './img/backround-register.jpg',
            //     Register: './img/backround-register.jpg',
            //     Lock: './img/backround-register.jpg',
            // };
            return {
                backgroundImage: `url(${require('@/assets/images/bg/backround-register.jpg')})`
            };
        },
        setPageClass() {
            return `${this.$route.name}-page`.toLowerCase();
        },
        languages() {
            return AVAILABLE_LANGUAGES;
        }
    },
    mounted() {
        this.onResponsiveInverted();
        window.addEventListener('resize', this.onResponsiveInverted);
    },
    beforeDestroy() {
        this.closeMenu();
        window.removeEventListener('resize', this.onResponsiveInverted);
    },
    methods: {
        changeLanguage(lang) {
            localStorage.setItem(LOCAL_STORAGE.undefinedUser.lang, lang.code);
            this.$i18n.locale = lang.code;
            const route = Object.assign({}, this.$route);
            route.params.lang = lang.code;
            this.$router.push(route);
            this.$i18n.lang = lang.code;
            if (this.isProfileLoaded) {
                this.$store.dispatch(USER_UPDATE, {
                    user: {
                        lang: lang.code
                    }
                });
            }
        },
        toggleSidebarPage() {
            if (this.$sidebar.showSidebar) {
                this.$sidebar.displaySidebar(false);
            }
        },
        linkClick() {
            if (this.autoClose && this.$sidebar && this.$sidebar.showSidebar === true) {
                this.$sidebar.displaySidebar(false);
            }
        },
        toggleSidebar() {
            this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
        },
        toggleNavbar() {
            document.body.classList.toggle('nav-open');
            this.showMenu = !this.showMenu;
        },
        closeMenu() {
            document.body.classList.remove('nav-open');
            this.showMenu = false;
        },
        onResponsiveInverted() {
            if (window.innerWidth < 991) {
                this.responsive = true;
            } else {
                this.responsive = false;
            }
        }
    },
    beforeRouteUpdate(to, from, next) {
        // Close the mobile menu first then transition to next page
        if (this.showMenu) {
            this.closeMenu();
            setTimeout(() => {
                next();
            }, this.menuTransitionDuration);
        } else {
            next();
        }
    }
};
</script>
<style lang="scss">
$scaleSize: 0.1;
$zoomOutStart: 0.7;
$zoomOutEnd: 0.46;
@keyframes zoomIn8 {
    from {
        opacity: 0;
        transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    100% {
        opacity: 1;
    }
}
.wrapper-full-page .zoomIn {
    animation-name: zoomIn8;
}
.full-page {
    .md-toolbar {
        .wrapper-progress-bar {
            position: fixed;
            top: 1px;
            left: 0;
            right: 0;
            width: 100%;
            height: 5px;
            .md-progress-bar.md-theme-default.md-indeterminate,
            .md-progress-bar.md-theme-default.md-query {
                background-color: rgba(250, 248, 250, 0.38) !important;
            }
            .md-progress-bar.md-theme-default.md-indeterminate .md-progress-bar-track:after,
            .md-progress-bar.md-theme-default.md-indeterminate .md-progress-bar-fill:after,
            .md-progress-bar.md-theme-default.md-query .md-progress-bar-track:after,
            .md-progress-bar.md-theme-default.md-query .md-progress-bar-fill:after {
                background-color: white !important;
                background-color: var(--md-theme-default-primary, white!important);
            }
        }
    }
}
@keyframes zoomOut8 {
    from {
        opacity: 1;
        transform: scale3d($zoomOutStart, $zoomOutStart, $zoomOutStart);
    }
    to {
        opacity: 0;
        transform: scale3d($zoomOutEnd, $zoomOutEnd, $zoomOutEnd);
    }
}
.wrapper-full-page .zoomOut {
    animation-name: zoomOut8;
}
</style>
