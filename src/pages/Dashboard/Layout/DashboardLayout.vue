<template>
    <div class="wrapper" :class="[{ 'nav-open': $sidebar.showSidebar }, { rtl: $route.meta.rtlActive }]">
        <side-bar-jaw
            :logo="currentClinic.logo"
            :title="currentClinic.name"
            :logo-color="currentClinic.color"
            :link="currentClinic.link"
            :background-image="backgroundImage"
            @onToggleSidebar="saveSidebarPosition"
        >
            <!-- <user-menu></user-menu> -->
            <mobile-menu />
            <template slot="links">
                <sidebar-item v-if="$route.meta.rtlActive" :link="{ name: 'لوحة القيادةة', icon: 'dashboard', path: `/${$i18n.locale}/dashboard` }" />
                <sidebar-item v-else :link="{ name: $t(`${$options.name}.dashbord`), icon: 'dashboard', path: `/${$i18n.locale}/dashboard` }" />
                <sidebar-item v-if="$route.meta.rtlActive" :link="{ name: 'التقويم', icon: 'date_range', path: `/${$i18n.locale}/calendar` }" />
                <sidebar-item v-else :link="{ name: $t(`${$options.name}.calendar`), icon: 'date_range', path: `/${$i18n.locale}/calendar` }" />

                <sidebar-item :link="{ name: $t(`${$options.name}.patients`), icon: 'supervised_user_circle', path: `/${$i18n.locale}/patients` }" />
                <sidebar-item
                    v-if="lastPatient.ID"
                    :link="{
                        name: `${capitalize(lastPatient.firstName)} ${capitalize(lastPatient.lastName)}`,
                        icon: 'account_circle',
                        img: lastPatient.avatar ? lastPatient.avatar : '',
                        textTocolor: lastPatient.ID,
                        acronim: lastPatient.firstName + ' ' + lastPatient.lastName,
                        notification: lastPatient.allergy && lastPatient.allergy.length > 0 ? 'A' : '',
                        path: `/${$i18n.locale}/patient/${lastPatient.ID}/bio`
                    }"
                    class="separated-down"
                />
                <sidebar-item :link="{ name: $t(`${$options.name}.settings`), icon: 'settings' }" class="separated-down">
                    <sidebar-item
                        :link="{
                            name: $t(`${$options.name}.clinicSettings`),
                            icon: 'image',
                            path: `/${$i18n.locale}/clinic/${selectedClinic.ID || 2}/settings`
                        }"
                    />
                    <sidebar-item
                        :link="{ name: $t(`${$options.name}.myProfile`), icon: 'account_circle', path: `/${$i18n.locale}/settings/user/` }"
                    />
                    <sidebar-item
                        :link="{ name: $t(`${$options.name}.procedures`), path: `/${$i18n.locale}/clinic/${selectedClinic.ID || 2}/procedures` }"
                    />
                    <sidebar-item
                        :link="{ name: $t(`${$options.name}.manipulations`), path: `/${$i18n.locale}/clinic/${selectedClinic.ID}/manipulations` }"
                    />
                    <sidebar-item
                        :link="{ name: $t(`${$options.name}.consumables`), path: `/${$i18n.locale}/clinic/${selectedClinic.ID}/consumables` }"
                    />
                    <sidebar-item :link="{ name: $t(`${$options.name}.payment`), path: 'payment' }" />
                    <sidebar-item :link="{ name: $t(`${$options.name}.notifications`), path: 'notifications' }" />
                </sidebar-item>
                <template v-if="process === 'development'">
                    <sidebar-item v-if="$route.meta.rtlActive" :link="{ name: 'صفحات', icon: 'image' }">
                        <sidebar-item :link="{ name: 'التسعير', path: `/${$i18n.locale}/pricing` }" />
                        <sidebar-item :link="{ name: 'دعم رتل', path: `/${$i18n.locale}/pages-rtl` }" />
                        <sidebar-item :link="{ name: 'الجدول الزمني', path: `/${$i18n.locale}/pages-timeline` }" />
                        <sidebar-item :link="{ name: 'صفحة تسجيل الدخول', path: `/${$i18n.locale}/login` }" />
                        <sidebar-item :link="{ name: 'سجل الصفحة', path: `/${$i18n.locale}/register` }" />
                        <sidebar-item :link="{ name: 'قفل صفحة الشاشة', path: `/${$i18n.locale}/lock` }" />
                        <sidebar-item :link="{ name: 'ملف تعريفي للمستخدم', path: `/${$i18n.locale}/pages-user` }" />
                    </sidebar-item>
                    <sidebar-item v-else :link="{ name: 'Pages', icon: 'image' }">
                        <sidebar-item :link="{ name: 'Pricing', path: `/${$i18n.locale}/pricing` }" />
                        <sidebar-item :link="{ name: 'RTL Support', path: `/${$i18n.locale}/page-rtl` }" />
                        <sidebar-item :link="{ name: 'Timeline', path: `/${$i18n.locale}/pages-timeline` }" />
                        <sidebar-item :link="{ name: 'login', path: `/${$i18n.locale}/login` }" />
                        <sidebar-item :link="{ name: 'Register', path: `/${$i18n.locale}/register` }" />
                        <sidebar-item :link="{ name: 'Lock Screen', path: `/${$i18n.locale}/lock` }" />
                        <sidebar-item :link="{ name: 'User Profile', path: `/${$i18n.locale}/pages-user` }" />
                    </sidebar-item>
                    <sidebar-item v-if="$route.meta.rtlActive" :link="{ name: 'المكونات', icon: 'apps' }">
                        <sidebar-item :link="{ name: 'وصفتت', path: `/${$i18n.locale}/components/buttons` }" />
                        <sidebar-item :link="{ name: 'نظام الشبكةو', path: `/${$i18n.locale}/components/grid-system` }" />
                        <sidebar-item :link="{ name: 'لوحات', path: `/${$i18n.locale}/components/panels` }" />
                        <sidebar-item :link="{ name: 'التنبيه الحلو', path: `/${$i18n.locale}/components/sweet-alert` }" />
                        <sidebar-item :link="{ name: 'إخطارات', path: `/${$i18n.locale}/components/notifications` }" />
                        <sidebar-item :link="{ name: 'الرموز', path: `/${$i18n.locale}/components/icons` }" />
                        <sidebar-item :link="{ name: 'طباعة', path: `/${$i18n.locale}/components/typography` }" />
                    </sidebar-item>
                    <sidebar-item v-else :link="{ name: 'Components', icon: 'apps' }">
                        <sidebar-item :link="{ name: 'Buttons', path: `/${$i18n.locale}/components/buttons` }" />
                        <sidebar-item :link="{ name: 'Grid System', path: `/${$i18n.locale}/components/grid-system` }" />
                        <sidebar-item :link="{ name: 'Panels', path: `/${$i18n.locale}/components/panels` }" />
                        <sidebar-item :link="{ name: 'Sweet Alert', path: `/${$i18n.locale}/components/sweet-alert` }" />
                        <sidebar-item :link="{ name: 'Notifications', path: `/${$i18n.locale}/components/notifications` }" />
                        <sidebar-item :link="{ name: 'Icons', path: `/${$i18n.locale}/components/icons` }" />
                        <sidebar-item :link="{ name: 'Typography', path: `/${$i18n.locale}/components/typography` }" />
                    </sidebar-item>
                    <sidebar-item v-if="$route.meta.rtlActive" :link="{ name: 'إستمارات', icon: 'content_paste' }">
                        <sidebar-item :link="{ name: 'أشكال منتظمة', path: `/${$i18n.locale}/forms/regular` }" />
                        <sidebar-item :link="{ name: 'أشكال موسعة', path: `/${$i18n.locale}/forms/extended` }" />
                        <sidebar-item :link="{ name: 'نماذج التحقق', path: `/${$i18n.locale}/forms/validation` }" />
                        <sidebar-item :link="{ name: 'ساحر', path: `/${$i18n.locale}/forms/wizard` }" />
                    </sidebar-item>
                    <sidebar-item v-else :link="{ name: 'Forms', icon: 'content_paste' }">
                        <sidebar-item :link="{ name: 'Regular Forms', path: `/${$i18n.locale}/forms/regular` }" />
                        <sidebar-item :link="{ name: 'Extended Forms', path: `/${$i18n.locale}/forms/extended` }" />
                        <sidebar-item :link="{ name: 'Validation Forms', path: `/${$i18n.locale}/forms/validation` }" />
                        <sidebar-item :link="{ name: 'Wizard', path: `/${$i18n.locale}/forms/wizard` }" />
                    </sidebar-item>
                    <sidebar-item v-if="$route.meta.rtlActive" :link="{ name: 'الجداول', icon: 'grid_on' }">
                        <sidebar-item :link="{ name: 'الجداول العادية', path: `/${$i18n.locale}/table-list/regular` }" />
                        <sidebar-item :link="{ name: 'الجداول الموسعة', path: `/${$i18n.locale}/table-list/extended` }" />
                        <sidebar-item :link="{ name: 'جداول البيانات صافي', path: `/${$i18n.locale}/table-list/paginated` }" />
                    </sidebar-item>
                    <sidebar-item v-else :link="{ name: 'Tables', icon: 'grid_on' }">
                        <sidebar-item :link="{ name: 'Regular Tables', path: `/${$i18n.locale}/table-list/regular` }" />
                        <sidebar-item :link="{ name: 'Extended Tables', path: `/${$i18n.locale}/table-list/extended` }" />
                        <sidebar-item :link="{ name: 'Paginated Tables', path: `/${$i18n.locale}/table-list/paginated` }" />
                    </sidebar-item>
                    <sidebar-item v-if="$route.meta.rtlActive" :link="{ name: 'خرائط', icon: 'place' }">
                        <sidebar-item :link="{ name: 'خرائط جوجل', path: `/${$i18n.locale}/maps/google` }" />
                        <sidebar-item :link="{ name: 'خريطة كاملة الشاشة', path: `/${$i18n.locale}/maps/full-screen` }" />
                        <sidebar-item :link="{ name: 'سهم التوجيه، الخريطة', path: `/${$i18n.locale}/maps/vector-map` }" />
                    </sidebar-item>
                    <sidebar-item v-else :link="{ name: 'Maps', icon: 'place' }">
                        <sidebar-item :link="{ name: 'Google Maps', path: `/${$i18n.locale}/maps/google` }" />
                        <sidebar-item :link="{ name: 'Full Screen Maps', path: `/${$i18n.locale}/maps/full-screen` }" />
                        <sidebar-item :link="{ name: 'Vector Maps', path: `/${$i18n.locale}/maps/vector-map` }" />
                    </sidebar-item>
                    <sidebar-item v-if="$route.meta.rtlActive" :link="{ name: 'الحاجيات', icon: 'widgets', path: `/${$i18n.locale}/widgets` }" />
                    <sidebar-item v-else :link="{ name: 'Widgets', icon: 'widgets', path: `/${$i18n.locale}/widgets` }" />
                    <sidebar-item
                        v-if="$route.meta.rtlActive"
                        :link="{ name: 'الرسوم البيانية', icon: 'timeline', path: `/${$i18n.locale}/charts` }"
                    />
                    <sidebar-item v-else :link="{ name: 'Charts', icon: 'timeline', path: `/${$i18n.locale}/charts` }" />
                </template>
            </template>
        </side-bar-jaw>
        <div class="main-panel">
            <top-navbar />

            <div :class="{ content: !$route.meta.hideContent }" @click="toggleSidebar">
                <zoom-center-transition :duration="200" mode="out-in">
                    <!-- your content here -->
                    <router-view />
                </zoom-center-transition>
            </div>
            <content-footer v-if="!$route.meta.hideFooter" />
        </div>
        <patient-add-form />
        <clinic-add-form />
    </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import { ZoomCenterTransition } from 'vue2-transitions';
import { mapGetters } from 'vuex';
import TopNavbar from './TopNavbar.vue';
import ContentFooter from './ContentFooter.vue';
import MobileMenu from './Extra/MobileMenu.vue';
import { LOCAL_STORAGE } from '@/constants';
// import UserMenu from './Extra/UserMenu.vue';

function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
    if (hasElement(className)) {
        new PerfectScrollbar(`.${className}`);
    } else {
        // try to init it later in case this component is loaded async
        setTimeout(() => {
            initScrollbar(className);
        }, 100);
    }
}

export default {
    name: 'DashbordLayout',
    components: {
        TopNavbar,
        ContentFooter,
        MobileMenu,
        // UserMenu,
        ZoomCenterTransition
    },
    computed: {
        ...mapGetters({
            lastPatient: 'getLastPatient',
            currentClinic: 'getCurrentClinic',
            selectedClinic: 'getCurrentClinic'
        }),
        backgroundImage() {
            let backgroundImage = `url(${require('@/assets/images/bg/sidebar-6.jpg')})`;
            return backgroundImage;
        },
        process() {
            return process.env.NODE_ENV;
        }
    },
    mounted() {
        const docClasses = document.body.classList;
        const isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            initScrollbar('sidebar');
            initScrollbar('sidebar-wrapper');
            initScrollbar('main-panel');
            docClasses.add('perfect-scrollbar-on');
        } else {
            docClasses.add('perfect-scrollbar-off');
        }
        this.initiateSidebarPosition();
    },
    methods: {
        capitalize(s) {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        saveSidebarPosition(val) {
            localStorage.setItem(LOCAL_STORAGE.user.sideBarPosition, val === true ? '1' : '0');
        },
        initiateSidebarPosition() {
            this.$nextTick(() => {
                const isMinimized = localStorage.getItem(LOCAL_STORAGE.user.sideBarPosition) === '1';
                if (isMinimized !== this.$sidebar.isMinimized) {
                    this.$sidebar.toggleMinimize();
                }
            });
        },
        toggleSidebar() {
            if (this.$sidebar.showSidebar) {
                this.$sidebar.displaySidebar(false);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
$scaleSize: 0.95;
@keyframes zoomIn95 {
    from {
        opacity: 0;
        transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
        opacity: 1;
    }
}
.main-panel .zoomIn {
    animation-name: zoomIn95;
}
@keyframes zoomOut95 {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
        transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
}
.main-panel .zoomOut {
    animation-name: zoomOut95;
}
.wrapper {
    .separated-down:after {
        content: '';
        position: absolute;
        margin: 15px 0 15px 0;
        right: 15px;
        height: 1px;
        width: calc(100% - 30px);
        background: rgba(180, 180, 180, 0.3) !important;
    }
    .separated-top:before {
        content: '';
        position: absolute;
        margin: -8px 0 15px 0;
        right: 15px;
        height: 1px;
        width: calc(100% - 30px);
        background: rgba(180, 180, 180, 0.3) !important;
    }
    .separated-top {
        padding-top: 20px;
    }
    .separated-down {
        padding-bottom: 20px;
    }
}
</style>
