<template>
  <div class="user"  >
    <div class="photo"   >
      <img :src="avatar" alt="avatar"/>
    </div>
    <div class="user-info">
      <a data-toggle="collapse" :class="{navactive : isActive('/patients'),}" :aria-expanded="!isClosed" @click.stop="toggleMenu" @click.capture="clicked">
           <span v-if="$route.meta.rtlActive">
             {{rtlTitle}}
             <b class="caret"></b>
          </span>
           <span v-else>
             {{title}}
             <b class="caret"></b>
          </span>
      </a>

        <collapse-transition>
            <div v-show="!isClosed">
              <ul class="nav" >
                <slot>
                  <!-- <li >

                  <sidebar-item  :link="{name: 'Patients', path: '/patients'}">
                    <span class="sidebar-mini">MP</span>
                      <span class="sidebar-normal">My Profile</span>
                   </sidebar-item>
                  </li > -->

                  <li :class="{active : isActive('/patients')}" >
                    <router-link class="sidebar-normal" tag='a' to="/patients" >
                    <span class="sidebar-mini">MP</span>
                      <span class="sidebar-normal">My Profile</span>
                    </router-link>
                  </li>

                </slot>
              </ul>
          </div>
        </collapse-transition>
    </div>
  </div>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";

export default {
  components: {
    CollapseTransition
  },
  props: {
    title: {
      type: String,
      default: "Tania Andrew"
    },
    rtlTitle: {
      type: String,
      default: "تانيا أندرو"
    },
    avatar: {
      type: String,
      default: "./img/faces/avatar.jpg"
    }
  },
  data() {
    return {
      isClosed: true
    };
  },
  methods: {
    clicked: function(e) {
      e.preventDefault();
    },
    toggleMenu: function() {
      this.isClosed = !this.isClosed;
    },
    isActive(route) {
      if (this.$route && this.$route.path) {
        let matchingRoute = this.$route.path.startsWith(route);
        if (matchingRoute !== undefined) {
          return matchingRoute;
        }
      }
      return false;
    }
  }
};
</script>
<style>
.collapsed {
  transition: opacity 1s;
}
</style>
