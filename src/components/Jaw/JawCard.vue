<template>
  <div class="jaw-card">
    <md-card
      class="md-card-product"
      @mouseleave.native="onMouseLeave"
      :data-count="hoverCount"
    >
      <md-card-header
        @mouseenter.native="onMouseOver"
        :data-header-animation="headerAnimation"
        :class="[{1: imgHovered}, {fadeInDown: fixedHeader},
        'md-card-header-' + currentJawColor(), {'display-all':displayAll}]"
        class="md-card-header-image jaw-wrapper s "
        :style="newHeigthStyleObj()"
      >
        <div ref="jaw">
          <!-- <jaw background-color="success" :jaw="jawp" ></jaw> -->
          <slot name="jaw"></slot>
        </div>
      </md-card-header>

      <md-card-content>
        <div
          ref="actions"
          class="md-card-action-buttons  text-center"
          v-if="headerAnimation === 'true'"
          :style="сardActionStyles"
        >
          <slot name="actions"></slot>

        </div>
        <slot name="title"></slot>
        <slot name="description"></slot>
      </md-card-content>

      <md-card-actions md-alignment="space-between">
        <slot name="footer"></slot>s
      </md-card-actions>
    </md-card>

  </div>
</template>

<script>
// import Jaw from './Jaw.vue';

  export default {
    components: {
      // Jaw,
    },
    name: 'jaw-card',
    props: {
      headerAnimation: {
        type: String,
        default: 'true',
      },
      actionSize: {
        type: Object,
      // default: {
      //   width: 30,
      //   height: 30,
      // }
      },
    },
    data() {
      return {
        showDialog: false,
        displayAll: false,
        switch1: false,
        hoverCount: 0,
        imgHovered: false,
        fixedHeader: false,
        transformHeigth: 0,
        сardActionStyles: {},
      };
    },
    computed: {},
    methods: {
      currentJawColor() {
        let color = '';
        if (this.$route.name === 'patient/treatment/anamnes') {
          color = 'warning';
        } else if (this.$route.name === 'patient/treatment/diagnose') {
          color = 'primary';
        } else if (this.$route.name === 'patient/treatment/treatment') {
          color = 'green';
        } else if (this.$route.name === 'patient/treatment/history') {
          color = 'blue';
        }
        return color;
      },
      onMouseOver() {
        if (this.headerAnimation === 'true') {
          this.matchHeight();
          this.imgHovered = true;
          this.hoverCount += 1;
        }
      },
      onMouseLeave() {
        if (this.headerAnimation === 'true') {
          this.imgHovered = false;
          this.transformHeight = 0;
        }
      },
      matchHeight() {
        if (this.$refs.actions) {
          this.transformHeight = this.$refs.actions.clientHeight + 20;
        }
      },
      newHeigthStyleObj() {
        const height = this.transformHeight;
        const heigthStyleObj = {
          transform: `translate3d(0, -${height || 0}px, 0)`,
        };
        return heigthStyleObj;
      },
      mdCardActionsStyleObj() {
        const height = this.сardActionsHeigth;
        const heigthStyleObj = {
          top: `-${height || 0}px`,
        };
        console.log(heigthStyleObj);

        return heigthStyleObj;
      },
      setActionsSize() {
        const actionsNum = document.querySelectorAll('.icon-wrapper').length;
        const currentActionsWidth = this.$refs.actions.clientWidth;
        const totalActionsWidth = actionsNum * this.actionSize.width;
        let newHeight = 0;
        if (totalActionsWidth < currentActionsWidth) {
          newHeight = this.actionSize.height * 1.5;
        } else {
          newHeight = this.actionSize.height * 3;
        }
        this.сardActionStyles = {
          'max-height': `${this.$refs.jaw.clientHeight || 0}px`,
          top: `-${newHeight || 0}px`,
          height: `${newHeight || 0}px`,
          overflow: 'hidden',
          'overflow-y': 'auto',
        };
      },
    },
    watch: {
      actionSize() {
        this.setActionsSize();
      },
    },
    mounted() {
      // eslint-disable-next-line
    this.$nextTick(function() {
        window.addEventListener('resize', this.setActionsSize);
      });
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.setActionsSize);
    },
  };
</script>

<style lang="scss">
.md-tabs-navigation .md-icon-label:first-child {
  margin-left: 15px;
}
.jaw-card {
  z-index: 5;
  .md-card {
    .md-card-action-buttons {
      width: calc(100% - 31px);
    }
    .md-card-action-buttons::-webkit-scrollbar {
      width: 6px;
      background-color: transparent;
    }
    .md-card-action-buttons::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 5px;
    }
    .jaw-state {
      min-width: 58px;
      .md-ripple {
        padding: 6px 6px !important;
        .md-button-content {
          .icon-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          svg {
            display: block;
            margin-bottom: 4px;
          }
        }
      }
    }
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
