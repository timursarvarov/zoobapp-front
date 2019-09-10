<template>
    <div class="sidebar" :data-color="activeColor" :data-image="backgroundImage" :data-background-color="backgroundColor" :style="sidebarStyle">
        <div class="logo">
            <a href="https://www.creative-tim.com" class="simple-text logo-mini" target="_blank">
                <div class="logo-img">
                    <img :src="logo" />
                </div>
            </a>
            <a href="https://www.creative-tim.com" class="simple-text logo-normal" target="_blank">
                <template v-if="$route.meta.rtlActive">{{ rtlTitle }}</template>
                <template v-else>{{ title }}</template>
            </a>
            <div class="navbar-minimize">
                <md-button id="minimizeSidebar" class="md-round md-just-icon md-transparent" @click="minimizeSidebar">
                    <i class="material-icons text_align-center visible-on-sidebar-regular">more_vert</i>
                    <i class="material-icons design_bullet-list-67 visible-on-sidebar-mini">view_list</i>
                </md-button>
            </div>
        </div>
        <div ref="sidebarScrollArea" class="sidebar-wrapper">
            <slot />
            <md-list class="nav">
                <slot name="links">
                    <sidebar-item v-for="(link, index) in sidebarLinks" :key="link.name + index" :link="link">
                        <sidebar-item v-for="(subLink, itemIndex) in link.children" :key="subLink.name + itemIndex" :link="subLink" />
                    </sidebar-item>
                </slot>
            </md-list>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Sidebar',
    props: {
        title: {
            type: String,
            default: 'Vue MD PRO'
        },
        rtlTitle: {
            type: String,
            default: 'توقيت الإبداعية'
        },
        activeColor: {
            type: String,
            default: 'green',
            validator: value => {
                const acceptedValues = ['', 'primary', 'azure', 'green', 'orange', 'danger', 'rose'];
                return acceptedValues.indexOf(value) !== -1;
            }
        },
        backgroundImage: {
            type: String,
            default: './img/sidebar-2.jpg'
        },
        backgroundColor: {
            type: String,
            default: 'black',
            validator: value => {
                const acceptedValues = ['', 'black', 'white', 'red'];
                return acceptedValues.indexOf(value) !== -1;
            }
        },
        logo: {
            type: String,
            default: './img/vue-logo.png'
        },
        sidebarLinks: {
            type: Array,
            default: () => []
        },
        autoClose: {
            type: Boolean,
            default: true
        }
    },
    provide() {
        return {
            autoClose: this.autoClose
        };
    },
    computed: {
        sidebarStyle() {
            return {
                backgroundImage: `url(${this.backgroundImage})`
            };
        }
    },
    beforeDestroy() {
        if (this.$sidebar.showSidebar) {
            this.$sidebar.showSidebar = false;
        }
    },
    methods: {
        minimizeSidebar() {
            if (this.$sidebar) {
                this.$sidebar.toggleMinimize();
            }
        }
    }
};
</script>
<style>
@media (min-width: 992px) {
    .navbar-search-form-mobile,
    .nav-mobile-menu {
        display: none;
    }
}
</style>
