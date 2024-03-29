<template>
    <div class="sidebar" :data-color="activeColor" :data-image="backgroundImage" :data-background-color="backgroundColor" :style="sidebarStyle">
        <div class="logo">
            <a :href="link" class="simple-text logo-mini" target="_blank">
                <div class="logo-box">
                    <t-avatar :textToColor="title" :title="title" :imageSrc="logo" :notification="notification" />
                </div>
            </a>
            <a :href="link" class="simple-text t-clinic-title logo-normal" target="_blank">
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
        <div class="sidebar-wrapper" ref="sidebarScrollArea">
            <slot></slot>
            <md-list class="nav">
                <slot name="links">
                    <sidebar-item v-for="(link, index) in sidebarLinks" :key="link.name + index" :link="link">
                        <sidebar-item v-for="(subLink, index) in link.children" :key="subLink.name + index" :link="subLink"></sidebar-item>
                    </sidebar-item>
                </slot>
            </md-list>
        </div>
    </div>
</template>
<script>
export default {
    components: {
        't-avatar': () => import('@/components/CustomComponents/TAvatar'),
        'sidebar-item': () => import('./SidebarItem')
    },
    name: 'sidebar',
    props: {
        logoColor: {
            type: String,
            default: '#790e8b'
        },
        title: {
            type: String,
            default: 'Vue MD PRO'
        },
        link: {
            type: String,
            default: '#'
        },
        notification: {
            type: String,
            default: ''
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
            default: ''
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
    methods: {
        minimizeSidebar() {
            if (this.$sidebar) {
                this.$sidebar.toggleMinimize();
            }
            this.$emit('onToggleSidebar', this.$sidebar.isMinimized);
        }
    },
    computed: {
        sidebarStyle() {
            return {
                backgroundImage: this.backgroundImage
            };
        }
    },
    beforeDestroy() {
        if (this.$sidebar.showSidebar) {
            this.$sidebar.showSidebar = false;
        }
    }
};
</script>
<style lang="scss">
@media (min-width: 992px) {
    .navbar-search-form-mobile,
    .nav-mobile-menu {
        display: none;
    }
}
</style>
