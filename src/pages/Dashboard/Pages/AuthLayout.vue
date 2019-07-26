<template>
    <div class="full-page" :class="{'nav-open': $sidebar.showSidebar}">
        <md-toolbar md-elevation="0" class="md-transparent md-toolbar-absolute">
            <div class="wrapper-progress-bar">
                <md-progress-bar v-if="loading" class="md-white" md-mode="indeterminate"></md-progress-bar>
            </div>
            <div class="md-toolbar-row md-offset">
                <div class="md-toolbar-section-start">
                    <h3 class="md-title">{{$route.name}}</h3>
                </div>
                <div class="md-toolbar-section-end">
                    <md-button
                        class="md-just-icon md-simple md-round md-toolbar-toggle"
                        :class="{toggled: $sidebar.showSidebar}"
                        @click="toggleSidebar"
                    >
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </md-button>

                    <div class="md-collapse" :class="{'off-canvas-sidebar': responsive}">
                        <md-list>
                            <md-list-item  to="/dashboard" v-if="isStateAuthenticated">
                                <!-- <router-link to="/dashboard" > -->
                                    <md-icon>dashboard</md-icon>Dashboard
                                <!-- </router-link> -->
                            </md-list-item>
                            <md-list-item @click="linkClick">
                                <router-link to="/pricing" >
                                    <md-icon>attach_money</md-icon>Pricing
                                </router-link>
                            </md-list-item>
                            <md-list-item  @click="linkClick">
                                <router-link to="/register" >
                                    <md-icon>person_add</md-icon>Register
                                </router-link>
                            </md-list-item>
                            <md-list-item @click="linkClick">
                                    <router-link to="/login" >
                                        <md-icon>fingerprint</md-icon>login
                                    </router-link>
                            </md-list-item>
                            <md-list-item v-if="isProfileLoaded"  @click="linkClick">
                                <router-link to="/lock" >
                                    <md-icon>lock_open</md-icon>lock
                                </router-link>
                            </md-list-item>
                            <li class="md-list-item">
                                  <a
                                        class="md-list-item-router md-list-item-container md-button-clean dropdown"
                                    >
                            <div class="md-list-item-content">
                                <drop-down direction="down">
                                    <md-button
                                        slot="title"
                                        class="md-simple  md-list-item-content "
                                        data-toggle="dropdown"
                                    >

                                        <md-icon>language</md-icon>
                                        <span>{{$i18n.locale}}</span>
                                        <p class="hidden-lg hidden-md">Language</p>
                                    </md-button>
                                    <ul class="dropdown-menu dropdown-menu-right">
                                        <li v-for="(loc, index) in $i18n.availableLocales" :key="index"
                                            @click="$i18n.locale = loc"
                                            :class="[{'selected-menu-top-navbar': $i18n.locale === loc }]"
                                        >
                                            <a
                                                :style="{color:  $i18n.locale === loc ? '#fff!important': ''}"
                                                href="#"
                                            >{{loc}}</a>
                                        </li>
                                    </ul>
                                </drop-down>
                            </div>
                            </a>
                    </li>
                        </md-list>
                    </div>
                </div>
            </div>
        </md-toolbar>
        <div class="wrapper wrapper-full-page" @click="toggleSidebarPage">
            <div
                class="page-header header-filter"
                :class="setPageClass"
                filter-color="black"
                :style="setBgImage"
            >
                <div class="container md-offset">
                    <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
                        <router-view></router-view>
                    </zoom-center-transition>
                </div>
                <footer class="footer">
                    <div class="container md-offset">
                        <nav>
                            <ul>
                                <li>
                                    <router-link :to="{path:'/dashboard'}">Home</router-link>
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
                            &copy; {{ new Date().getFullYear() }}
                            <a
                                href="https://www.creative-tim.com/?ref=mdf-vuejs"
                                target="_blank"
                            >Creative Tim</a>, made with
                            <i class="fa fa-heart heart"></i> for a better web
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
    import { LOGIN_BACKGROUND_URL } from '@/constants';

    export default {
        components: {
            ZoomCenterTransition,
        },
        props: {
            backgroundColor: {
                type: String,
                default: 'black',
            },
        },
        inject: {
            autoClose: {
                default: true,
            },
        },
        data() {
            return {
                responsive: false,
                showMenu: false,
                menuTransitionDuration: 250,
                pageTransitionDuration: 300,
                year: new Date().getFullYear(),
            };
        },
        computed: {
            ...mapGetters({
                isProfileLoaded: 'isProfileLoaded',
                isStateAuthenticated: 'isStateAuthenticated',
                loading: 'loading',
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
                    // backgroundImage: `url(${images[this.$route.name]})`,
                    backgroundImage: `url(${LOGIN_BACKGROUND_URL})`,
                };
            },
            setPageClass() {
                console.log(this.$route);
                return `${this.$route.name}-page`.toLowerCase();
            },
        },
        methods: {
            setLang() {
                const systemLang = navigator.language.split('-')[0];
                if (this.$i18n.availableLocales.includes(systemLang)) {
                    this.$i18n.locale = systemLang;
                }
            },
            toggleSidebarPage() {
                if (this.$sidebar.showSidebar) {
                    this.$sidebar.displaySidebar(false);
                }
            },
            linkClick() {
                if (
                    this.autoClose
                    && this.$sidebar
                    && this.$sidebar.showSidebar === true
                ) {
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
            },
        },
        mounted() {
            this.onResponsiveInverted();
            window.addEventListener('resize', this.onResponsiveInverted);
        },
        beforeDestroy() {
            this.closeMenu();
            window.removeEventListener('resize', this.onResponsiveInverted);
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
        },
    };
</script>
<style lang="scss" >
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
            .md-progress-bar.md-theme-default.md-indeterminate
                .md-progress-bar-track:after,
            .md-progress-bar.md-theme-default.md-indeterminate
                .md-progress-bar-fill:after,
            .md-progress-bar.md-theme-default.md-query
                .md-progress-bar-track:after,
            .md-progress-bar.md-theme-default.md-query
                .md-progress-bar-fill:after {
                background-color: white !important;
                background-color: var(
                    --md-theme-default-primary,
                    white!important
                );
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
