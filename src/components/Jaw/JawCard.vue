<template>
    <div class="jaw-card" >
      <md-card class="md-card-product"
        @mouseleave.native="onMouseLeave"
        :data-count="hoverCount">

        <md-card-header
          @mouseenter.native="onMouseOver"
          :data-header-animation="headerAnimation"
          :class="[{hovered: imgHovered}, {hinge: headerDown}, {fadeInDown: fixedHeader}, 'md-card-header-' + currentJawColor(), {'display-all':displayAll}]"
          class="md-card-header-image jaw-wrapper animated "
          >
          <jaw background-color="success" ></jaw>
        </md-card-header>

        <md-card-content>
          <div class="md-card-action-buttons text-center" v-if="headerAnimation === 'true'">
            <md-button class="md-danger md-simple fix-broken-card" @click="fixHeader" v-if="headerDown">
              <slot name="fixed-button"></slot> Fix Header!
            </md-button>
            <md-button @click="showDialog = !showDialog" class="md-simple md-just-icon">
               <md-icon>zoom_in</md-icon>
               <md-tooltip>Zoom</md-tooltip>
            </md-button>
            <md-button class="md-simple md-just-icon">
               <md-icon>child_care</md-icon>
               <md-tooltip>Baby teeth</md-tooltip>
            </md-button>
            <md-button class="md-simple md-just-icon">
               <md-icon>mood</md-icon>
               <md-tooltip>Adult teeth</md-tooltip>
            </md-button>
            <md-button class="md-simple md-just-icon">
               <md-icon md-src="/img/teeth_icons/tooth_toggle_bottom.svg"></md-icon>
               <md-tooltip>Toggle bottom</md-tooltip>
            </md-button>
            <md-button class="md-simple md-just-icon">
               <md-icon md-src="/img/teeth_icons/tooth_toggle_top.svg"></md-icon>
               <md-tooltip>Toggle top</md-tooltip>
            </md-button>
            <md-button class="md-simple md-just-icon">
                <slot name="first-button"></slot>
            </md-button>
            <md-button class="md-success md-simple md-just-icon">
                <slot name="second-button"></slot>
            </md-button>
            <md-button class="md-danger md-simple md-just-icon">
                <slot name="third-button"></slot>
            </md-button>
          </div>
          <slot name="title"></slot>
          <slot name="description"></slot>
        </md-card-content>
        

        <md-card-actions md-alignment="space-between">
          <slot name="footer"></slot>
        </md-card-actions>
      </md-card>
      <md-dialog   :md-active.sync="showDialog">
            <!-- <md-dialog-title>Preferences</md-dialog-title> -->
            <jaw class="display-all" background-color="success" ></jaw>
            <md-dialog-actions>
              <md-button class="md-primary" @click="showDialog = false">Close</md-button>
              <md-button class="md-primary" @click="showDialog = false">Save</md-button>
            </md-dialog-actions>
          </md-dialog>
      
      </div>
</template>

<script>
import Jaw from "./Jaw.vue";
export default {
  components: {
    Jaw
  },
  name: "jaw-card",
  props: {
    headerAnimation: {
      type: String,
      default: "true"
    }
  },
  data() {
    return {
      showDialog: false,
      displayAll: false,
      switch1: false,
      hoverCount: 0,
      imgHovered: false,
      fixedHeader: false
    };
  },
  computed: {
    headerDown() {
      return this.hoverCount > 15;
    }
  },
  methods: {
    currentJawColor: function() {
      let color = "";
      if (this.$route.name == "patient/treatment/anamnes") {
        color = "warning";
      } else if (this.$route.name == "patient/treatment/diagnose") {
        color = "primary";
      } else if (this.$route.name == "patient/treatment/treatment") {
        color = "green";
      } else if (this.$route.name == "patient/treatment/history") {
        color = "blue";
      }
      return color;
    },
    headerBack: function() {
      this.fixedHeader = false;
    },
    fixHeader: function() {
      this.hoverCount = 0;
      this.fixedHeader = true;

      setTimeout(this.headerBack, 480);
    },
    onMouseOver: function() {
      if (this.headerAnimation === "true") {
        this.imgHovered = true;
        this.hoverCount++;
      }
    },
    onMouseLeave: function() {
      if (this.headerAnimation === "true") {
        this.imgHovered = false;
      }
    }
  }
};
</script>

<style lang="scss">
.md-tabs-navigation .md-icon-label:first-child {
  margin-left: 15px;
}
.jaw-card {
  .md-card {
    .display-all {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 20;
    }
    .jaw-wrapper {
      border-radius: 6px;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    }
  }
}
.display-all {
  width: 100%;
  height: 100%;
}
</style>
