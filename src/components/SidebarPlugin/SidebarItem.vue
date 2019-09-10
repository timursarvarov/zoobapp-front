<template>
    <component :is="baseComponent" :to="link.path ? link.path : '/'" :class="{ active: isActive }" tag="li">
        <a v-if="isMenu" href="#" class="nav-link sidebar-menu-item" :aria-expanded="!collapsed" data-toggle="collapse" @click.prevent="collapseMenu">
            <md-icon>{{ link.icon }}</md-icon>
            <p>
                {{ link.name }}
                <b class="caret" />
            </p>
        </a>

        <collapse-transition>
            <div v-if="$slots.default || isMenu" v-show="!collapsed">
                <ul class="nav">
                    <slot />
                </ul>
            </div>
        </collapse-transition>

        <slot v-if="children.length === 0 && !$slots.default && link.path" name="title">
            <component
                :is="elementType(link, false)"
                :to="link.path"
                :class="{ active: link.active }"
                class="nav-link"
                :target="link.target"
                :href="link.path"
                @click.native="linkClick"
            >
                <template v-if="addLink">
                    <span class="sidebar-mini">{{ linkPrefix }}</span>
                    <span class="sidebar-normal">{{ link.name }}</span>
                </template>
                <template v-else>
                    <md-icon>{{ link.icon }}</md-icon>
                    <p>{{ link.name }}</p>
                </template>
            </component>
        </slot>
    </component>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';

export default {
    name: 'SidebarItem',
    components: {
        CollapseTransition
    },
    props: {
        menu: {
            type: Boolean,
            default: false
        },
        link: {
            type: Object,
            default: () => ({
                name: '',
                path: '',
                children: []
            })
        }
    },
    provide() {
        return {
            addLink: this.addChild,
            removeLink: this.removeChild
        };
    },
    inject: {
        addLink: { default: null },
        removeLink: { default: null },
        autoClose: {
            default: true
        }
    },
    data() {
        return {
            children: [],
            collapsed: true
        };
    },
    computed: {
        baseComponent() {
            return this.isMenu || this.link.isRoute ? 'li' : 'router-link';
        },
        linkPrefix() {
            if (this.link.name) {
                const words = this.link.name.split(' ');
                return words.map(word => word.substring(0, 1)).join('');
            }
            return false;
        },
        isMenu() {
            return this.children.length > 0 || this.menu === true;
        },
        isActive() {
            if (this.$route && this.$route.path) {
                const matchingRoute = this.children.find(c => this.$route.path.startsWith(c.link.path));
                if (matchingRoute !== undefined) {
                    return true;
                }
            }
            return false;
        }
    },
    mounted() {
        if (this.addLink) {
            this.addLink(this);
        }
        if (this.link.collapsed !== undefined) {
            this.collapsed = this.link.collapsed;
        }
        if (this.isActive && this.isMenu) {
            this.collapsed = false;
        }
    },
    destroyed() {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
        if (this.removeLink) {
            this.removeLink(this);
        }
    },
    methods: {
        addChild(item) {
            const index = this.$slots.default.indexOf(item.$vnode);
            this.children.splice(index, 0, item);
        },
        removeChild(item) {
            const tabs = this.children;
            const index = tabs.indexOf(item);
            tabs.splice(index, 1);
        },
        elementType(link, isParent = true) {
            if (link.isRoute === false) {
                return isParent ? 'li' : 'a';
            }
            return 'router-link';
        },
        linkAbbreviation(name) {
            const matches = name.match(/\b(\w)/g);
            return matches.join('');
        },
        linkClick() {
            if (this.autoClose && this.$sidebar && this.$sidebar.showSidebar === true) {
                this.$sidebar.displaySidebar(false);
            }
        },
        collapseMenu() {
            this.collapsed = !this.collapsed;
        },
        collapseSubMenu(link) {
            const nlink = link;
            nlink.collapsed = !link.collapsed;
        }
    }
};
</script>
<style>
.sidebar-menu-item {
    cursor: pointer;
}
</style>
