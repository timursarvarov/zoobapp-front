<template>
  <component
    :is="baseComponent"
    :to="link.path ? link.path : '/'"
    :class=" {active : isActive(link.path)}"
    tag="li"
  >
    <a
      v-if="isMenu"
      href="#"
      class="nav-link sidebar-menu-item"
      :aria-expanded="!collapsed"
      data-toggle="collapse"
      @click.prevent="collapseMenu"
    >
    <div
      v-if="link.acronim"
        class="avatar-box"
        >
        <t-avatar
          v-if="link.acronim"
          :textToColor="link.textToColor"
          :imageSrc="link.img"
          :title="link.acronim"
          :notification= "link.notification"
        />
      </div>
      <md-icon v-else>{{link.icon}}</md-icon>
      <p>
        <span class="nav-link-title">{{link.name | capitilize}}</span>
        <b class="caret"></b>
      </p>
    </a>

    <collapse-transition>
      <div v-if="$slots.default || this.isMenu" v-show="!collapsed">
        <ul class="nav">
          <slot></slot>
        </ul>
      </div>
    </collapse-transition>

    <slot name="title" v-if="children.length === 0 && !$slots.default && link.path">
      <component
        :to="link.path"
        @click.native="linkClick"
        :is="elementType(link, false)"
        :class="{active: link.active}"
        class="nav-link"
        :target="link.target"
        :href="link.path.active"
      >
        <template v-if="addLink">
          <span class="sidebar-mini">{{linkPrefix}}</span>
          <span class="sidebar-normal">{{link.name}}</span>
        </template>
        <template v-else>
          <md-icon>{{link.icon}}</md-icon>
          <p>{{link.name}}</p>
        </template>
      </component>
    </slot>
  </component>
</template>
<script>
    import { CollapseTransition } from 'vue2-transitions';
    import { TAvatar } from '@/components';

    export default {
        name: 'sidebar-item',
        components: {
            CollapseTransition,
            TAvatar,
        },
        props: {
            menu: {
                type: Boolean,
                default: false,
            },
            link: {
                type: Object,
                default: () => ({
                    name: '',
                    path: '',
                    textToColor: '#43a047',
                    acronim: '',
                    children: [],
                    notification: '',
                }),
            },
        },
        provide() {
            return {
                addLink: this.addChild,
                removeLink: this.removeChild,
            };
        },
        inject: {
            addLink: { default: null },
            removeLink: { default: null },
            autoClose: {
                default: true,
            },
        },
        data() {
            return {
                children: [],
                collapsed: true,
            };
        },
        computed: {
            acronimL() {
                return this.link.acronim;
            },
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
        },
        methods: {
            colorLuminance(hex, lum) {
                // eslint-disable-next-line no-unused-vars
                let lumL = lum;
                // eslint-disable-next-line no-unused-vars
                let hexL = hex;
                // validate hex string
                hexL = String(hex).replace(/[^0-9a-f]/gi, '');
                if (hex.length < 6) {
                    hexL = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
                }
                lumL = lum || 0;

                // convert to decimal and change luminosity
                // eslint-disable-next-line no-unused-vars
                let rgb = '#';
                let c;
                let i;
                for (i = 0; i < 3; i += 1) {
                    c = parseInt(hexL.substr(i * 2, 2), 16);
                    c = Math.round(Math.min(Math.max(0, c + c * lumL), 255)).toString(16);
                    rgb += `00${c}`.substr(c.length);
                }
            },
            addChild(item) {
                const index = this.$slots.default.indexOf(item.$vnode);
                this.children.splice(index, 0, item);
            },
            isActive(re) {
                if (this.$route && this.$route.path) {
                    let matchingRoute = '';
                    if (this.children.length > 0) {
                        matchingRoute = this.children.find(c => this.$route.path.startsWith(c.link.path));
                    } else if (
                        re
                        && this.$route.path.split('/').length !== re.split('/').length
                    ) {
                        matchingRoute = this.$route.path.startsWith(re);
                    }
                    if (matchingRoute === true) {
                        return true;
                    }
                }
                return false;
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
                if (
                    this.autoClose
                    && this.$sidebar
                    && this.$sidebar.showSidebar === true
                ) {
                    this.$sidebar.displaySidebar(false);
                }
            },
            collapseMenu() {
                this.collapsed = !this.collapsed;
            },
            collapseSubMenu(link) {
                const nlink = link;
                nlink.collapsed = !link.collapsed;
            },
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
    };
</script>
<style lang="scss">
.sidebar-menu-item {
  cursor: pointer;
  p {
    nav-link-title {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .avatar-box {
    margin-right: 5px ;
    margin-bottom: -7px;
    margin-left: -10px;
    margin-top: -11px;
    float: left;
  }
  .acronim {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    // font-size: 0.9rem;
  }
}
</style>
