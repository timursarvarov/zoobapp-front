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
        :class="[{1: imgHovered}, {hinge: headerDown}, {fadeInDown: fixedHeader},
        'md-card-header-' + currentJawColor(), {'display-all':displayAll}]"
        class="md-card-header-image jaw-wrapper s "
        :style="newHeigthStyleObj()"
      >
        <jaw background-color="success"></jaw>
      </md-card-header>

      <md-card-content>
        <div
          ref="actions"
          class="md-card-action-buttons text-center"
          v-if="headerAnimation === 'true'"
          :style="mdCardActionsStyleObj()"
        >
          <md-button
            class="md-danger md-simple fix-broken-card"
            @click="fixHeader"
            v-if="headerDown"
          >
            <slot name="fixed-button"></slot> Fix Header!
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Tooth Healhy"
                class="icon-wrapper--item"
              >
                <icon-tooth-health />
              </icon-base>
              <small class="icon-wrapper--item">Helthy</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state  ">
            <div class="icon-wrapper">
              <icon-base
                class="icon-wrapper--item"
                width="30"
                height="30"
                icon-name="Tooth Healhy"
              >
                <icon-root-canal />
              </icon-base>
              <small class="icon-wrapper--item">Pulpit</small>
            </div>
          </md-button>

          <md-button class="md-simple md-primary  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Paradontit"
                class="icon-wrapper--item"
              >
                <icon-paradontit />
              </icon-base>
              <small class="icon-wrapper--item">Paradontit</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-carries />
              </icon-base>
              <small class="icon-wrapper--item">Carries</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Missed"
                class="icon-wrapper--item"
              >
                <icon-tooth-extraction />
              </icon-base>
              <small class="icon-wrapper--item">Missed</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-cracked />
              </icon-base>
              <small class="icon-wrapper--item">Cracked</small>
            </div>
          </md-button>

          <md-button class="md-simple jaw-state ">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Other Diseas"
                class="icon-wrapper--item"
              >
                <icon-tooth-treated />
              </icon-base>
              <small>Other Diseas</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-carries />
              </icon-base>
              <small class="icon-wrapper--item">Carries</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Missed"
                class="icon-wrapper--item"
              >
                <icon-tooth-extraction />
              </icon-base>
              <small class="icon-wrapper--item">Missed</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-cracked />
              </icon-base>
              <small class="icon-wrapper--item">Cracked</small>
            </div>
          </md-button>

          <md-button class="md-simple jaw-state ">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Other Diseas"
                class="icon-wrapper--item"
              >
                <icon-tooth-treated />
              </icon-base>
              <small>Other Diseas</small>
            </div>
          </md-button>
          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-carries />
              </icon-base>
              <small class="icon-wrapper--item">Carries</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Missed"
                class="icon-wrapper--item"
              >
                <icon-tooth-extraction />
              </icon-base>
              <small class="icon-wrapper--item">Missed</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-cracked />
              </icon-base>
              <small class="icon-wrapper--item">Cracked</small>
            </div>
          </md-button>

          <md-button class="md-simple jaw-state ">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Other Diseas"
                class="icon-wrapper--item"
              >
                <icon-tooth-treated />
              </icon-base>
              <small>Other Diseas</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-carries />
              </icon-base>
              <small class="icon-wrapper--item">Carries</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Missed"
                class="icon-wrapper--item"
              >
                <icon-tooth-extraction />
              </icon-base>
              <small class="icon-wrapper--item">Missed</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-cracked />
              </icon-base>
              <small class="icon-wrapper--item">Cracked</small>
            </div>
          </md-button>

          <md-button class="md-simple jaw-state ">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Other Diseas"
                class="icon-wrapper--item"
              >
                <icon-tooth-treated />
              </icon-base>
              <small>Other Diseas</small>
            </div>
          </md-button>
          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-carries />
              </icon-base>
              <small class="icon-wrapper--item">Carries</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Missed"
                class="icon-wrapper--item"
              >
                <icon-tooth-extraction />
              </icon-base>
              <small class="icon-wrapper--item">Missed</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-cracked />
              </icon-base>
              <small class="icon-wrapper--item">Cracked</small>
            </div>
          </md-button>

          <md-button class="md-simple jaw-state ">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Other Diseas"
                class="icon-wrapper--item"
              >
                <icon-tooth-treated />
              </icon-base>
              <small>Other Diseas</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-carries />
              </icon-base>
              <small class="icon-wrapper--item">Carries</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Missed"
                class="icon-wrapper--item"
              >
                <icon-tooth-extraction />
              </icon-base>
              <small class="icon-wrapper--item">Missed</small>
            </div>
          </md-button>

          <md-button class="md-simple  jaw-state">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Carries"
                class="icon-wrapper--item"
              >
                <icon-tooth-cracked />
              </icon-base>
              <small class="icon-wrapper--item">Cracked</small>
            </div>
          </md-button>

          <md-button class="md-simple jaw-state ">
            <div class="icon-wrapper">
              <icon-base
                width="30"
                height="30"
                icon-name="Other Diseas"
                class="icon-wrapper--item"
              >
                <icon-tooth-treated />
              </icon-base>
              <small>Other Diseas</small>
            </div>
          </md-button>

        </div>
        <slot name="title"></slot>
        <slot name="description"></slot>
      </md-card-content>

      <md-card-actions md-alignment="space-between">
        <slot name="footer"></slot>
      </md-card-actions>
    </md-card>

  </div>
</template>

<script>
  import Jaw from './Jaw.vue';
  import {
    // IconAdult,
    IconBase,
    // IconAnalgesic,
    // IconBaby,
    // IconBrekets,
    // IconCard,
    // IconForceps,
    // IconImplant,
    // IconInjection,
    // IconInsetJaw,
    // IconObservation,
    // IconOpenMouth,
    // IconPalmFace,
    IconParadontit,
    // IconPoint,
    IconRootCanal,
    // IconSurvey,
    // IconTablets,
    // IconToggleBottom,
    // IconToggleTop,
    // IconToothBacteria,
    // IconToothBill,
    // IconToothBottle,
    // IconToothBottom,
    // IconToothCalendar,
    // IconToothCard,
    IconToothCarries,
    // IconToothClean,
    // IconToothCorons,
    IconToothCracked,
    // IconToothDrop,
    IconToothExtraction,
    // IconToothHandCare,
    IconToothHealth,
    // IconToothIce,
    // IconToothInfo,
    // IconToothInspected,
    // IconToothLocked,
    // IconToothPain,
    // IconToothPoint,
    // IconToothProtected,
    // IconToothRenew,
    // IconToothSettings,
    // IconToothSmall,
    // IconToothStar,
    // IconToothSun,
    // IconToothTablet,
    IconToothTreated,
  // IconToothTree,
  // IconToothWash,
  // IconToothWings,
  // IconToothWorld,
  } from '@/components';

  export default {
    components: {
      // IconAdult,
      IconBase,
      // IconAnalgesic,
      // IconBaby,
      // IconBrekets,
      // IconCard,
      // IconForceps,
      // IconImplant,
      // IconInjection,
      // IconInsetJaw,
      // IconObservation,
      // IconOpenMouth,
      // IconPalmFace,
      IconParadontit,
      // IconPoint,
      IconRootCanal,
      // IconSurvey,
      // IconTablets,
      // IconToggleBottom,
      // IconToggleTop,
      // IconToothBacteria,
      // IconToothBill,
      // IconToothBottle,
      // IconToothBottom,
      // IconToothCalendar,
      // IconToothCard,
      IconToothCarries,
      // IconToothClean,
      // IconToothCorons,
      IconToothCracked,
      // IconToothDrop,
      IconToothExtraction,
      // IconToothHandCare,
      IconToothHealth,
      // IconToothIce,
      // IconToothInfo,
      // IconToothInspected,
      // IconToothLocked,
      // IconToothPain,
      // IconToothPoint,
      // IconToothProtected,
      // IconToothRenew,
      // IconToothSettings,
      // IconToothSmall,
      // IconToothStar,
      // IconToothSun,
      // IconToothTablet,
      IconToothTreated,
      // IconToothTree,
      // IconToothWash,
      // IconToothWings,
      // IconToothWorld,
      Jaw,
    },
    name: 'jaw-card',
    props: {
      headerAnimation: {
        type: String,
        default: 'true',
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
        сardActionsHeigth: 0,
      };
    },
    computed: {
      headerDown() {
        return this.hoverCount > 15;
      },
    },
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
      headerBack() {
        this.fixedHeader = false;
      },
      fixHeader() {
        this.hoverCount = 0;
        this.fixedHeader = true;

        setTimeout(this.headerBack, 480);
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
        this.transformHeight = this.$refs.actions.clientHeight;
      },
      newHeigthStyleObj() {
        const height = this.transformHeight;
        const heigthStyleObj = {
          transform: `translate3d(0, -${height || 0}px, 0)`,
        };
        console.log(heigthStyleObj);

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
    },
    mounted() {
      this.сardActionsHeigth = this.$refs.actions
        ? this.$refs.actions.clientHeight
        : 0;
    },
  };
</script>

<style lang="scss">
.md-tabs-navigation .md-icon-label:first-child {
  margin-left: 15px;
}
.jaw-card {
  .md-card {
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
