/* eslint-disable operator-linebreak */

<template>
  <div>
    <div class="jaw">
      <md-toolbar class="md-transparent">
        <div class="md-toolbar-section-start">
        <h4 class="title">
          <animated-number :value="selectedTeethLocal.length"></animated-number>

          <span v-show="selectedTeethLocal.length <= 1"> tooth selected </span>

          <span v-show="selectedTeethLocal.length > 1"> teeth selected </span>
        </h4>
        </div>
        <div class="md-toolbar-section-end">
        <slot name="title-start"></slot>
          <slot name="title-end"></slot>
          <md-button
            @click="selectedTeethLocal = [], toggleAdultBottom = false, toggleAdultTop = false"
            :class="[{'md-primary': selectedTeethLocal.length > 0 }, 'md-just-icon', 'md-round', 'md-simple']"
          >
            <md-icon>clear_all</md-icon>
            <md-tooltip md-delay="1000">Unselect all teeth</md-tooltip>
          </md-button>
          <drop-down direction="down">
            <md-button
              slot="title"
              class="md-button md-just-icon md-round md-simple md-block"
              data-toggle="dropdown"
            >
              <md-icon>more_vert</md-icon>
            </md-button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li v-ripple >
                <md-subheader>Preffer view</md-subheader>
              </li>
                <hr>
              <li v-ripple >
                <md-radio
                  v-model="preferL"
                  value="anamnes"
                >Anamnes</md-radio >
              </li>
              <li v-ripple >
                <md-radio
                  v-model="preferL"
                  value="diagnose"
                >Diagnose</md-radio >
              </li>
              <li v-ripple >
                <md-radio
                  v-model="preferL"
                  value="treatment"
                >Treatment</md-radio >
              </li>
              <hr>
              <li>
                <md-switch
                  v-model="toggleAdultTop"
                  @change="toggleTeeth(topAdultTeeth)"
                >Toggle Top</md-switch>
              </li>
              <li>
                <md-switch
                  v-model="toggleAdultBottom"
                  @change="toggleTeeth(bottomAdultTeeth)"
                >Toggle Bottom</md-switch>
              </li>
            </ul>
          </drop-down>
        </div>
      </md-toolbar>
      <div>
        <slot name="top"></slot>
      </div>

      <div class="jaw-scroll md-layout mx-auto">
        <div class="jaw-top md-alignment-top-center mx-auto md-layout-item md-size-100">
          <div
            v-ripple.click.100
            :class="[
                'tooth',
                isSelected(toothId),
                preferL]"
            v-for="(toothId ) in topAdultTeeth"
            :key="toothId"
            :ref="toothId"
            :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) + 'px' }"
            @click="selectTooth(toothId)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              :viewBox="jawSVG[toothId].viewBox"
              :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) + 'px' }"
            >
              <g>
                <path
                  v-for="(location, key) in defaultLocations"
                  v-show="!jawComputed[toothId][key].hide"
                  :key="`${toothId}${key}`"
                  :class="[
                    jawComputed[toothId][key].class,
                    jawSVG[toothId][key]['class'] ]"
                  :d="jawSVG[toothId][key]['d']"
                ></path>
              </g>
            </svg>
            <span class="tooth-number">{{toothId | toCurrentTeethSystem(teethSystem)}}</span>
            <div
              v-if="separatedDiagnosis[toothId]"
              class="tooth-diagnosis"
                @mouseenter="mouseOverToothId = toothId"
                @mouseleave="mouseOverToothId = ''"
              :style="{ 'width': mouseOverToothId == toothId ? getCustomWidth(jawSVG[toothId].width_perc) * 4 + 'px' : '' }"
            >
              <div class="tooth-diagnosis-content"
                @mouseenter="diagnoseOnHoverToggle(toothId, k)"
                @mouseleave="diagnoseOnHoverToggle(toothId, k)"
                v-for="(d, k) in separatedDiagnosis[toothId]"
                :key="k"
                :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) * 4 + 'px' }"
              >
              <div class="tooth-diagnosis-code"><b>{{d.code}}</b></div>
              <div class="tooth-diagnosis-text">
                <marquee-text
                :repeat="3"
                :duration="4"
                :paused="separatedDiagnosis[toothId][k].hover"
                :key="`${toothId}${k}`">
                  <span class="tooth-diagnosis-text-item">
                    <span >{{d.title}}</span>
                  </span>
                </marquee-text>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div class="jaw-bottom md-layout-item md-size-100">
          <div
            v-ripple
            :class="[
              'tooth',
              isSelected(toothId),
              preferL]"
            v-for="(toothId ) in bottomAdultTeeth"
            :key="toothId"
            :ref="toothId"
            :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) + 'px' }"
            @click="selectTooth(toothId)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              :viewBox="jawSVG[toothId].viewBox"
              :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) + 'px' }"
            >
              <g>
                <path
                  v-for="(location, key) in defaultLocations"
                  :key="`${toothId}${key}`"
                  v-show="!jawComputed[toothId][key].hide"
                  :class="[
                  jawComputed[toothId][key].class,
                  jawSVG[toothId][key]['class'] ]"
                  :d="jawSVG[toothId][key]['d']"
                ></path>
              </g>
            </svg>
            <span class="tooth-number">{{toothId | toCurrentTeethSystem(teethSystem)}}</span>
             <div
              v-if="separatedDiagnosis[toothId]"
              class="tooth-diagnosis"
                @mouseenter="mouseOverToothId = toothId"
                @mouseleave="mouseOverToothId = ''"
              :style="{ 'width': mouseOverToothId == toothId ? getCustomWidth(jawSVG[toothId].width_perc) * 4 + 'px' : '' }"
            >
              <div class="tooth-diagnosis-content"
                @mouseenter="diagnoseOnHoverToggle(toothId, k)"
                @mouseleave="diagnoseOnHoverToggle(toothId, k)"
                v-for="(d, k) in separatedDiagnosis[toothId]"
                :key="k"
                :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) * 4 + 'px' }"
              >
              <div class="tooth-diagnosis-code"><b>{{d.code}}</b></div>
              <div class="tooth-diagnosis-text">
                <marquee-text
                :repeat="3"
                :duration="4"
                :paused="separatedDiagnosis[toothId][k].hover"
                :key="`${toothId}${k}`">
                  <span class="tooth-diagnosis-text-item">
                    <span >{{d.title}}</span>
                  </span>
                </marquee-text>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>
<script>
    import MarqueeText from 'vue-marquee-text-component';
    import jawSVGjs from './jawSVG';
    import { AnimatedNumber } from '@/components';
    import { tObjProp } from '@/mixins';
    import {
      TEETH_ADDULT_ALL,
      TEETH_DEFAULT_LOCATIONS,
      TEETH_ADDULT_BOTTOM,
      TEETH_ADDULT_TOP,
      TEETH_BABY_ALL,
      TEETH_ALL,
    } from '@/constants';

    export default {
      mixins: [tObjProp],
      components: { AnimatedNumber, MarqueeText },
      props: {
        jaw: {
          type: Object,
          default: () => { },
        },
        prefer: {
          type: String,
          default: () => 'treatment',
        },
        patientDiagnosis: {
          type: Array,
          default: () => [],
        },
        patientTreatments: {
          type: Array,
          default: () => [],
        },
        selectedTeeth: {
          type: Array,
          default: () => [],
        },

        teethSystem: {
          type: Number,
          default: () => 1,
          // 1 = FDI World Dental Federation notation
          // 2 = Universal numbering system
          // 3 = Palmer notation method
        },
      },
      name: 'AppMain',
      data() {
        return {
          mouseOverToothId: '',
          separatedDiagnosis: {},
          separatedTreatments: {},
          windowWidth: 0,
          toggleAdultTop: false,
          toggleAdultBottom: false,
          preferL: 'anamnes',
          SvgTeeth: [],
          teethSettngs: [],
          showSelectedToothDialog: false,
          teeth: TEETH_ALL,
          babyTeeth: TEETH_BABY_ALL,
          adultTeeth: TEETH_ADDULT_ALL,
          topAdultTeeth: TEETH_ADDULT_TOP,
          bottomAdultTeeth: TEETH_ADDULT_BOTTOM,
          defaultLocations: TEETH_DEFAULT_LOCATIONS,
          jawComputed: {},
          selectedTeethLocal: [],
        };
      },

      computed: {
        separatedDiagnosisComp() {
          return this.separatedDiagnosis;
        },
        jawSVG() {
          const jawVG = JSON.parse(jawSVGjs);
          return jawVG;
        },
        teethSystemL() {
          let system = 'fdi';
          if (this.teethSystem === 1) {
            system = 'fdi';
          } else if (this.teethSystem === 2) {
            system = 'universal';
          } else if (this.teethSystem === 3) {
            system = 'palmer';
          }
          return system;
        },
      },

      created() {
        this.calculateJaw();
        this.getDiagnoseForEachTooth();
        this.getTreatmentForEachTooth();
        // this.selectedTeethLocal = this.selectedTeeth;
        this.preferL = this.prefer;
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
      },
      destroyed() {
        window.removeEventListener('resize', this.handleResize);
      },

      methods: {
        diagnoseOnHoverToggle(toothId, index) {
          const diagnose = this.separatedDiagnosis[toothId][index];
          diagnose.hover = !diagnose.hover;
          const d = this.copyObj(this.separatedDiagnosis);
          this.separatedDiagnosis = {};
          d.toothId = d[toothId].splice(index, 1, diagnose);
          this.separatedDiagnosis = d;
        },
        getDiagnoseForEachTooth() {
          if (this.patientDiagnosis.length > 0) {
            this.separatedDiagnosis = {};
            this.patientDiagnosis.forEach((diagnose) => {
              if (!this.isEmpty(diagnose.teeth)) {
                Object.keys(diagnose.teeth).forEach((toothId) => {
                  if (this.separatedDiagnosis[toothId]) {
                    this.separatedDiagnosis[toothId].push({
                      title: diagnose.title,
                      code: diagnose.code,
                      hover: true,
                    });
                  } else {
                    this.separatedDiagnosis[toothId] = [];
                    this.separatedDiagnosis[toothId].push({
                      title: diagnose.title,
                      code: diagnose.code,
                      hover: true,
                    });
                  }
                });
              }
            });
          }
        },
        getTreatmentForEachTooth() {
          if (this.patientTreatments.length > 0) {
            this.separatedTreatments = {};
            this.patientTreatments.forEach((treatment) => {
              if (!this.isEmpty(treatment.teeth)) {
                Object.keys(treatment.teeth).forEach((toothId) => {
                  if (this.separatedTreatments[toothId]) {
                    this.separatedTreatments[toothId].push({
                      title: treatment.title,
                      code: treatment.code,
                      hover: true,
                    });
                  } else {
                    this.separatedTreatments[toothId] = [];
                    this.separatedTreatments[toothId].push({
                      title: treatment.title,
                      code: treatment.code,
                      hover: true,
                    });
                  }
                });
              }
            });
          }
        },
        getCustomWidth(toothWidth) {
          if (this.windowWidth < 600) {
            return 5 * toothWidth;
          }
          if (this.windowWidth >= 600 && this.windowWidth < 960) {
            return ((this.windowWidth - 80) / 100) * toothWidth;
          }
          if (this.windowWidth <= 1280 && this.windowWidth > 960) {
            return ((this.windowWidth - 240) / 2 / 100) * toothWidth;
          }
          if (this.windowWidth < 1920 && this.windowWidth > 1280) {
            return ((this.windowWidth - 280) / 2 / 100) * toothWidth;
          }
          if (this.windowWidth >= 1920) {
            return ((this.windowWidth - 380) / 2 / 100) * toothWidth;
          }
          return (this.windowWidth / 2 / 100) * toothWidth;
        },
        handleResize() {
          this.windowWidth = window.innerWidth;
        },
        isHidingLocation(i, location) {
          const anamnes = this.getNestedProperty(
            this.jaw.jawAnamnes,
            this.teeth[i],
            location,
          );
          const treatment = this.getNestedProperty(
            this.jaw.jawTreatment,
            this.teeth[i],
            location,
          );
          const diagnose = this.getNestedProperty(
            this.jaw.jawDiagnose,
            this.teeth[i],
            location,
          );
          //  this.jaw.jawAnamnes
          // && this.jaw.jawAnamnes[this.teeth[i]]
          // && this.jaw.jawAnamnes[this.teeth[i]][location];
          // const treatment =        this.jaw.jawTreatment
          // && this.jaw.jawTreatment[this.teeth[i]]
          // && this.jaw.jawTreatment[this.teeth[i]][location];
          // const diagnose =        this.jaw.jawDiagnose
          // && this.jaw.jawDiagnose[this.teeth[i]]
          // && this.jaw.jawDiagnose[this.teeth[i]][location];

          const defaultLocation = !this.defaultLocations[location];
          let hide = defaultLocation;
          if (this.preferL === 'anamnes') {
            if (diagnose === true || diagnose === false) {
              hide = !diagnose;
            }
            if (treatment === true || treatment === false) {
              hide = !treatment;
            }
            if (anamnes === true || anamnes === false) {
              hide = !anamnes;
            }
          }
          if (this.preferL === 'treatment') {
            if (diagnose === true || diagnose === false) {
              hide = !diagnose;
            }
            if (anamnes === true || anamnes === false) {
              hide = !anamnes;
            }
            if (treatment === true || treatment === false) {
              hide = !treatment;
            }
          }
          if (this.preferL === 'diagnose') {
            if (anamnes === true || anamnes === false) {
              hide = !anamnes;
            }
            if (treatment === true || treatment === false) {
              hide = !treatment;
            }
            if (diagnose === true || diagnose === false) {
              hide = !diagnose;
            }
          }

          return hide;
        },
        preferableJawClasses(i, location) {
          const toothClass = {};

          if (this.preferL === 'anamnes') {
            if (this.jaw.jawAnamnes[this.teeth[i]][location]) {
              toothClass.anamnes = true;
              return toothClass;
            }
            if (this.jaw.jawTreatment[this.teeth[i]][location]) {
              toothClass.treatment = true;
              return toothClass;
            }
            if (this.jaw.jawDiagnose[this.teeth[i]][location]) {
              toothClass.diagnose = true;
              return toothClass;
            }
            return toothClass;
          }
          if (this.preferL === 'diagnose') {
            if (this.jaw.jawDiagnose[this.teeth[i]][location]) {
              toothClass.diagnose = true;
              return toothClass;
            }
            if (this.jaw.jawTreatment[this.teeth[i]][location]) {
              toothClass.treatment = true;
              return toothClass;
            }
            if (this.jaw.jawAnamnes[this.teeth[i]][location]) {
              toothClass.anamnes = true;
              return toothClass;
            }
            return toothClass;
          }
          if (this.preferL === 'treatment') {
            if (this.jaw.jawTreatment[this.teeth[i]][location]) {
              toothClass.treatment = true;
              return toothClass;
            }
            if (this.jaw.jawAnamnes[this.teeth[i]][location]) {
              toothClass.anamnes = true;
              return toothClass;
            }
            if (this.jaw.jawDiagnose[this.teeth[i]][location]) {
              toothClass.diagnose = true;
              return toothClass;
            }
            return toothClass;
          }
          return toothClass;
        },
        toggleTeeth(teethToTogle) {
          const existingTeeth = [];
          const selTeeth = this.copyObj(this.selectedTeethLocal);
          this.selectedTeethLocal = [];

          for (let index = 0; index < teethToTogle.length; index += 1) {
            if (selTeeth.indexOf(teethToTogle[index]) > -1) {
              existingTeeth.push(teethToTogle[index]);
            }
          }
          if (existingTeeth.length === 0) {
            this.selectedTeethLocal = selTeeth.concat(teethToTogle);
          } else if (existingTeeth.length < teethToTogle.length) {
            const teethToAdd = teethToTogle.filter(
              el => existingTeeth.indexOf(el) < 0,
            );
            this.selectedTeethLocal = selTeeth.concat(teethToAdd);
          } else {
            const teethToDelete = selTeeth.filter(
              el => existingTeeth.indexOf(el) >= 0,
            );
            this.selectedTeethLocal = selTeeth.filter(
              value => !teethToDelete.includes(value),
            );
          }
          this.$emit('onSelectedTeeth', this.selectedTeethLocal);
        },
        calculateJaw() {
          const jaw = {};
          for (let i = 0; i < this.teeth.length; i += 1) {
            jaw[this.teeth[i]] = {};
            Object.keys(this.defaultLocations).forEach((key) => {
              jaw[this.teeth[i]][key] = {
                hide: this.isHidingLocation(i, key),
                class: this.preferableJawClasses(i, key),
              };
            });
          }
          this.jawComputed = jaw;
        },

        setTeeth() {
          for (let i = 0; i < this.teeth.length; i += 1) {
            this.teethSettngs[i] = {
              toothID: this.teeth[i],
            };

            Object.keys(this.defaultLocations).forEach((key) => {
              this.teethSettngs[i][key] = this.defaultLocations[key];
            });
          }
        },
        selectTooth(tooth) {
          const index = this.selectedTeethLocal.indexOf(tooth);
          if (index === -1) {
            this.selectedTeethLocal.push(tooth);
          } else {
            this.selectedTeethLocal.splice(index, 1);
          }

          let bottomTeethCount = 0;
          let topTeethCount = 0;

          for (let index1 = 0; index1 < this.bottomAdultTeeth.length; index1 += 1) {
            if (
              this.selectedTeethLocal.indexOf(this.bottomAdultTeeth[index1]) > -1
            ) {
              bottomTeethCount += 1;
            }
          }
          if (bottomTeethCount < this.bottomAdultTeeth.length) {
            this.toggleAdultBottom = false;
          } else {
            this.toggleAdultBottom = true;
          }
          for (let index2 = 0; index2 < this.topAdultTeeth.length; index2 += 1) {
            if (this.selectedTeethLocal.indexOf(this.topAdultTeeth[index2]) > -1) {
              topTeethCount += 1;
            }
          }
          if (topTeethCount < this.topAdultTeeth.length) {
            this.toggleAdultTop = false;
          } else {
            this.toggleAdultTop = true;
          }
          this.$emit('onSelectedTeeth', this.selectedTeethLocal);
        },
        isSelected(tooth) {
          if (this.selectedTeethLocal.indexOf(tooth) !== -1) {
            return 'selected';
          }
          return false;
        },
      },
      watch: {
        selectedTeeth: {
          handler(val) {
            this.selectedTeethLocal = val;
          },
          deep: true,
        },
        // selectedTeethLocal: {
        //   handler(val) {
        //     console.log(val);
        //   },
        //   deep: true,
        // },
        jaw: {
          handler() {
            // console.log(newValue);
            // const startTime = performance.now();

            this.calculateJaw();
            // const duration = performance.now() - startTime;
            // console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);
          },
          deep: true,
        },
        windowHeight() {
          this.handleResize();
        },
        // computedDiagnosis() {
        //   this.getDiagnoseForEachTooth();
        // },
      },
    };
</script>

<style lang="scss" scoped>
.jaw {
  .title {
    .list-item {
      display: inline-block;
      margin-right: 10px;
    }
    .list-enter-active,
    .list-leave-active {
      transition: all 1s;
    }
    .list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
      opacity: 0;
      transform: translateY(30px);
    }
  }
}
.jaw,
.md-dialog-container {
  user-select: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(white, 0.4);
  border-radius: 5px;
  min-height: 30vh;
  .dropdown-menu li {
    padding: 0px 0px 0px 16px;
    .md-radio {
      margin: 8px 0 8px 0;
    }
  }
  .jaw-scroll {
    padding-bottom: 35px;
    padding-top: 35px;
    overflow-x: auto;
    overflow-y: auto;
    &::-webkit-scrollbar {
      height: 7px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 7px;
    }
  }

  .jaw-top {
    .selected {
       background-image: linear-gradient( rgba(190, 184, 184, 0.63),  rgba(116, 116, 116, 0.58));
    }
    .tooth-number {
      bottom: 0;
    }
    .tooth-diagnosis {
      top: 0;
      transform: translate(-50%, -20px);
      &:hover {
        transform: translate(-50%, -20px) !important;
      }
    }
    .tooth:nth-last-child(1) {
     .tooth-diagnosis:hover {
       left: 30%;
        transform: translate(-90%, -20px) !important;
      }
    }
    .tooth:nth-last-child(2) {
     .tooth-diagnosis:hover {
        transform: translate(-70%, -20px) !important;
      }
    }
    .tooth:nth-child(1) {
     .tooth-diagnosis:hover {
        transform: translate(-10%, -20px) !important;
      }
    }
    .tooth:nth-child(2) {
     .tooth-diagnosis:hover {
        transform: translate(-30%, -20px) !important;
      }
    }
  }
  .jaw-bottom {
    .selected {
       background-image: linear-gradient( rgba(116, 116, 116, 0.58), rgba(161, 161, 161, 0.63));
    }
    .tooth-number {
      top: 0;
    }
    .tooth-diagnosis {
      transform: translate(-50%, 20px);
      bottom: 0;
      &:hover {
        transform: translate(-50%, 20px) !important;

      }
    }
    .tooth:nth-last-child(1) {
     .tooth-diagnosis:hover {
       left: 30%;
        transform: translate(-90%, 20px) !important;
      }
    }
    .tooth:nth-last-child(2) {
     .tooth-diagnosis:hover {
        transform: translate(-70%, 20px) !important;
      }
    }
    .tooth:nth-child(1) {
     .tooth-diagnosis:hover {
        transform: translate(-10%, 20px) !important;
      }
    }
    .tooth:nth-child(2) {
     .tooth-diagnosis:hover {
        transform: translate(-30%, 20px) !important;
      }
    }
  }
  .jaw-top,
  .jaw-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    .tooth-number {
      font-size: 0.9em;
      overflow: show;
      margin: auto;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
    }

    .tooth-diagnosis:not(:hover) {
      min-height: 3px;
      max-height: 30px;
      min-width: 3px;
      max-width: 30px;
    }
    .tooth-diagnosis {
      transition: all 0.2s ease-in-out;
      overflow: hidden;
      left: 50%;
      opacity: 0.8;
      background: #8e24aa;
      color: white;
      width: 1.6vh;
      height: 1.6vh;
      font-size: 0.9em;
      font-weight: 400;
      position: absolute;
      border-radius: 50%;
      box-shadow: 0 4px 5px -2px rgba(0, 0, 0, 0.2),
        0 7px 10px 1px rgba(0, 0, 0, 0.14), 0 2px 16px 1px rgba(0, 0, 0, 0.12);
      .tooth-diagnosis-content {
        flex-direction: row;
        position: relative;
        transition: all 0.2s ease-in-out;
        display: none;
        padding: 0 3px 0 3px;
        .tooth-diagnosis-code{
          padding: 0 3px 0 3px;

        }
        .tooth-diagnosis-text{
          padding: 0 3px 0 3px;

        .tooth-diagnosis-text-item{
          padding-right: 30px;
          white-space: nowrap;
        }
        }
      }
      &:hover {
        z-index:50;
        opacity: 1;
        height: auto !important;
        width: 100px;
        min-height: 3px;
        max-height: 100%;
        min-width: 3px;
        border-radius: 3px;
        transform: scale(1.1);
        position: absolute;
        .tooth-diagnosis-content {
          display: flex;
        }
      }
    }

    .selected {
      .tooth-number {
        color: rgb(255, 255, 255);
      }
    }

    .tooth {
      display: flex;
      transition: 0.9s cubic-bezier(0.4, 0, 0.2, 1);
      transition-property: all;
      transition-duration: 0.9s;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-delay: 0s;
      position: relative;

      svg {
        flex-grow: 1;
        flex-basis: 100%;
        height: 100%;

        .background {
          fill: #9fdaff;
        }

        .bridge {
          fill: #3535ed;
        }

        .root {
          fill: #f8edc8;
          stroke: #292320;
          stroke-width: 0.25px;
        }

        .rootCanal {
          fill: #3535ed;
        }

        .coronaLingual,
        .coronaTop,
        .coronaLabial {
          fill: #fff;
          stroke: #000;
          stroke-width: 0.25px;
        }

        .coronaLingualIncisalDistal,
        .coronaLingualIncisalMiddle,
        .coronaLingualIncisionMesial,
        .coronaLingualMiddleDistal,
        .coronaLingualMiddleMiddle,
        .coronaLingualMiddleMesial,
        .coronaLingualCervicalDistal,
        .coronaLingualCervicalMiddle,
        .coronaLingualCervicalMesial,
        .coronaLabialIncisalDistal,
        .coronaLabialIncisalMiddle,
        .coronaLabialIncisionMesial,
        .coronaLabialMiddleDistal,
        .coronaLabialMiddleMiddle,
        .coronaLabialMiddleMesial,
        .coronaLabialCervicalDistal,
        .coronaLabialCervicalMiddle,
        .coronaLabialCervicalMesial,
        .coronaTopBuccal,
        .coronaTopMedial,
        .coronaTopLingual,
        .coronaTopDistal,
        .coronaTopOclusial {
          fill: #3535ed;
        }

        .implant {
          fill: #3535ed;
        }

        .veneer {
          fill: #3535ed;
        }

        .silant {
          fill: #3535ed;
        }

        .gum {
          stroke: #ffb900;
        }

        .paradontit1 {
          stroke: #ff822e;
          fill: none !important;
        }

        .paradontit2 {
          stroke: #f9610d;
          fill: none !important;
        }

        .paradontit3 {
          stroke: #f75403;
          fill: none !important;
        }

        .paradontit4 {
          stroke: #f73403;
          fill: none !important;
        }

        .periodontit {
          fill: #3535ed;
        }

        .gum {
          stroke: #ffb900;
          stroke-linejoin: round;
          stroke-width: 4px;
          fill: none;
        }

        .paradontit1,
        .paradontit2,
        .paradontit3,
        .paradontit4,
        .periodontit {
          stroke-linejoin: round;
          stroke-width: 4px;
        }

        .fdi,
        .universal,
        .palmer {
          isolation: isolate;
        }
        .hide {
          display: none;
        }
      }
    }

    .diagnose.gum {
      stroke-width: 6px !important;
      stroke: #8e24aa !important;
      stroke-linejoin: round;
    }
  }

  .anamnes {
    fill: #fb8c00 !important;
    .tooth-number {
      color: #fb8c00;
    }
  }
  .diagnose {
    fill: #8e24aa !important;
    .tooth-number {
      color: #8e24aa;
    }
  }
  .treatment {
    fill: #43a047 !important;
    .tooth-number {
      color: #43a047;
    }
  }
}
</style>
