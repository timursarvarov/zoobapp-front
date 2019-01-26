/* eslint-disable */
<template>
  <div>

    <div class="jaw md-layout   mx-auto md-gutter ">
      <md-toolbar class="md-transparent md-layout md-gutter">
        <div class="md-layout md-layout-item  md-gutter">
          <div class="md-layout-item md-small-size-33 md-xsmall-size-50 md-size-33 ">
            <md-switch
              v-model="toggleAdultTop"
              @change="toggleTeeth(topAdultTeeth)"
            >Toggle Top</md-switch>
          </div>
          <div class="md-layout-item md-small-size-33 md-xsmall-size-50 md-size-33">
            <md-switch
              v-model="toggleAdultBottom"
              @change="toggleTeeth(bottomAdultTeeth)"
            >Toggle Bottom</md-switch>
          </div>

          <div class="md-layout-item md-small-size-33 md-xsmall-size-100 md-size-33">
            <md-field>
              <label for="prefer">Show first</label>
              <md-select
                md-dense
                v-model="preferLocal"
                name="prefer"
                id="prefer"
              >
                <md-option value="treatment">Treatment</md-option>
                <md-option value="diagnose">Diagnose</md-option>
                <md-option value="anamnes">Anamnes</md-option>
              </md-select>
            </md-field>
          </div>
        </div>

        <md-button
          @click="selectedTeethLocal = []"
          :class="[{'md-primary': selectedTeethLocal.length > 0 }, 'md-just-icon', 'md-just-icon', 'md-round', 'md-simple']"
        >
          <md-icon> clear</md-icon>
          <md-tooltip md-delay="1000">
            Unselect all teeth
          </md-tooltip>
        </md-button>

      </md-toolbar>
      <div class="md-layout md-layout-item  md-size-100  mx-auto md-gutter">
        <slot name="top"></slot>
      </div>

      <div class="jaw-scroll  md-layout-item md-size-100 md-layout md-gutter  mx-auto">
        <div class="jaw-top  md-alignment-top-center  mx-auto md-layout-item md-size-100">
          <div
            v-ripple.click.100
            :class="[
          'tooth',
          isSelected(toothId),
          preferj]"
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
                />
              </g>
            </svg>
            <span class="tooth-number">{{toCurrentTeethSystem(toothId)}}</span>
            <div
              v-if="separatedDiagnosis[toothId]"
              class="tooth-diagnosis"
            >
              <div
                v-for="(d, k) in separatedDiagnosis[toothId]"
                :key="k"
              >
                {{d}}
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
          preferj]"
            v-for="(toothId ) in bottomAdultTeeth"
            :key="toothId"
            :ref="toothId"
            :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) + 'px' }"
            @click="selectTooth(toothId)"
          >
            <svg
              xmlns="
          http://www.w3.org/2000/svg"
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
                />
              </g>
            </svg>
            <span class="tooth-number">{{toCurrentTeethSystem(toothId)}}</span>
            <div
              v-if="separatedDiagnosis[toothId]"
              class="tooth-diagnosis md-primary"
            >
              <div
                v-for="(d, k) in separatedDiagnosis[toothId]"
                :key="k"
              >
                {{d}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-layout-item  md-layout  md-gutter md-size-100">
        <slot
          class="md-layout-item  md-layout  md-gutter md-size-100"
          name="bottom"
        ></slot>
      </div>
    </div>
  </div>
</template>
<script>
import jawSVGjs from "./jawSVG";
import { IconBase } from "@/components";

export default {
  components: {
    IconBase
  },
  props: {
    jaw: {
      type: Object,
      default: () => {}
    },
    prefer: {
      type: String,
      default: () => "treatment"
    },
    teethSchema: {
      type: Object,
      default: () => {}
    },
    patientDiagnosis: {
      type: Array,
      default: () => []
    },

    teethSystem: {
      type: Number,
      default: () => 1
      // 1 = FDI World Dental Federation notation
      // 2 = Universal numbering system
      // 3 = Palmer notation method
    }
  },
  name: "AppMain",
  data() {
    return {
      separatedDiagnosis: {},
      windowWidth: 0,
      toggleAdultTop: false,
      toggleAdultBottom: false,
      preferj: "anamnes",
      SvgTeeth: [],
      teethSettngs: [],
      selectedTeeth: [],
      showSelectedToothDialog: false,
      teeth: [
        55,
        54,
        53,
        52,
        51,
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        61,
        62,
        63,
        64,
        65,
        85,
        84,
        83,
        82,
        81,
        48,
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        71,
        72,
        73,
        74,
        75
      ],
      babyTeeth: [
        55,
        54,
        53,
        52,
        51,
        61,
        62,
        63,
        64,
        65,
        85,
        84,
        83,
        82,
        81,
        71,
        72,
        73,
        74,
        75
      ],
      adultTeeth: [
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        48,
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38
      ],
      topAdultTeeth: [
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28
      ],
      bottomAdultTeeth: [
        48,
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38
      ],
      selectedTeethLocal: [],
      defaultLocations: {
        background: false,
        bridge: false,
        root: true,
        rootCanal: false,
        coronaLingual: true,
        coronaLingualIncisalDistal: false,
        coronaLingualIncisalMiddle: false,
        coronaLingualIncisionMesial: false,
        coronaLingualMiddleDistal: false,
        coronaLingualMiddleMiddle: false,
        coronaLingualMiddleMesial: false,
        coronaLingualCervicalDistal: false,
        coronaLingualCervicalMiddle: false,
        coronaLingualCervicalMesial: false,
        coronaLabial: true,
        coronaLabialIncisalDistal: false,
        coronaLabialIncisalMiddle: false,
        coronaLabialIncisionMesial: false,
        coronaLabialMiddleDistal: false,
        coronaLabialMiddleMiddle: false,
        coronaLabialMiddleMesial: false,
        coronaLabialCervicalDistal: false,
        coronaLabialCervicalMiddle: false,
        coronaLabialCervicalMesial: false,
        implant: false,
        veneer: false,
        coronaTop: true,
        coronaTopBuccal: false,
        coronaTopMedial: false,
        coronaTopLingual: false,
        coronaTopDistal: false,
        coronaTopOclusial: false,
        silant: false,
        gum: true,
        paradontit1: false,
        paradontit2: false,
        paradontit3: false,
        paradontit4: false,
        periodontit: false,
        fdi: false,
        universal: false,
        palmer: false
      },
      jawComputed: {}
    };
  },

  computed: {
    jawSVG() {
      const jawVG = JSON.parse(jawSVGjs);
      return jawVG;
    },
    teethSystemL() {
      let system = "fdi";
      if (this.teethSystem === 1) {
        system = "fdi";
      } else if (this.teethSystem === 2) {
        system = "universal";
      } else if (this.teethSystem === 3) {
        system = "palmer";
      }
      return system;
    },
    patientDiagnosisL() {
      return this.patientDiagnosis;
    },
    teethSchemaL() {
      return this.teethSchema;
    },
    preferLocal: {
      // геттер:
      get: function() {
        return this.prefer;
      },
      // сеттер:
      set: function(newValue) {
        this.preferj = newValue;
        this.calculateJaw();
      }
    },
    selectedTeethJ() {
      return this.selectedTeeth;
    }
  },

  created() {
    this.calculateJaw();
    this.getDiagnoseForEachTooth();
    this.preferj = this.prefer;
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  mounted() {
    this.selectedTeeth = this.selectedTeethJ;
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    getDiagnoseForEachTooth() {
      if (this.patientDiagnosisL.length > 0) {
        this.separatedDiagnosis = {};
        this.patientDiagnosisL.forEach(diagnose => {
          if (!this.isEmpty(diagnose.teeth)) {
            Object.keys(diagnose.teeth).forEach(toothId => {
              if (this.separatedDiagnosis[toothId]) {
                this.separatedDiagnosis[toothId].push(diagnose.code);
              } else {
                this.separatedDiagnosis[toothId] = [];
                this.separatedDiagnosis[toothId].push(diagnose.code);
              }
            });
          }
        });
      }
    },
    isEmpty(obj) {
      // eslint-disable-next-line
      for (const key in obj) {
        // eslint-disable-next-line
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    },
    getCustomWidth(toothWidth) {
      if (this.windowWidth < 600) {
        return 5 * toothWidth;
      }
      if (this.windowWidth >= 600 && this.windowWidth < 960) {
        return ((this.windowWidth - 80) / 100) * toothWidth;
      }
      if (this.windowWidth < 1280 && this.windowWidth > 960) {
        return ((this.windowWidth - 240) / 2 / 100) * toothWidth;
      }
      if (this.windowWidth < 1920 && this.windowWidth > 1280) {
        return ((this.windowWidth - 280) / 2 / 100) * toothWidth;
      }
      if (this.windowWidth > 1920) {
        return ((this.windowWidth - 380) / 2 / 100) * toothWidth;
      } else {
        // return (this.windowWidth / 2 / 100) * toothWidth;
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    isHidingLocation(i, location) {
      const anamnes =
        this.jaw.jawAnamnes &&
        this.jaw.jawAnamnes[this.teeth[i]] &&
        this.jaw.jawAnamnes[this.teeth[i]][location];
      const treatment =
        this.jaw.jawTreatment &&
        this.jaw.jawTreatment[this.teeth[i]] &&
        this.jaw.jawTreatment[this.teeth[i]][location];
      const diagnose =
        this.jaw.jawDiagnose &&
        this.jaw.jawDiagnose[this.teeth[i]] &&
        this.jaw.jawDiagnose[this.teeth[i]][location];
      const defaultLocation = !this.defaultLocations[location];

      let hide = defaultLocation;
      if (this.preferj === "anamnes") {
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
      if (this.preferj === "treatment") {
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
      if (this.preferj === "diagnose") {
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
      let toothClass = {};

      if (this.preferj === "anamnes") {
        if (this.jaw.jawAnamnes[this.teeth[i]][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        } else if (this.jaw.jawTreatment[this.teeth[i]][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawDiagnose[this.teeth[i]][location]) {
          toothClass["diagnose"] = true;
          return toothClass;
        }
        return toothClass;
      }
      if (this.preferj === "diagnose") {
        if (this.jaw.jawDiagnose[this.teeth[i]][location]) {
          toothClass["diagnose"] = true;
          return toothClass;
        } else if (this.jaw.jawTreatment[this.teeth[i]][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawAnamnes[this.teeth[i]][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        }
        return toothClass;
      }
      if (this.preferj === "treatment") {
        if (this.jaw.jawTreatment[this.teeth[i]][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawAnamnes[this.teeth[i]][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        } else if (this.jaw.jawDiagnose[this.teeth[i]][location]) {
          toothClass["diagnose"] = true;
          return toothClass;
        }
        return toothClass;
      }
      return toothClass;
    },
    toggleTeeth(teethToTogle) {
      let existingTeeth = [];
      for (let index = 0; index < teethToTogle.length; index += 1) {
        if (this.selectedTeethLocal.indexOf(teethToTogle[index]) > -1) {
          existingTeeth.push(teethToTogle[index]);
        }
      }
      if (existingTeeth.length == 0) {
        this.selectedTeethLocal = this.selectedTeethLocal.concat(teethToTogle);
      } else if (existingTeeth.length < teethToTogle.length) {
        let teethToAdd = teethToTogle.filter(function(el) {
          return existingTeeth.indexOf(el) < 0;
        });
        this.selectedTeethLocal = this.selectedTeethLocal.concat(teethToAdd);
      } else {
        let teethToDelete = this.selectedTeethLocal.filter(function(el) {
          return existingTeeth.indexOf(el) >= 0;
        });
        this.selectedTeethLocal = this.selectedTeethLocal.filter(function(
          value
        ) {
          return !teethToDelete.includes(value);
        });
      }
      this.$emit("input", this.selectedTeethLocal);
    },
    calculateJaw() {
      let jaw = {};
      for (let i = 0; i < this.teeth.length; i += 1) {
        jaw[this.teeth[i]] = {};
        Object.keys(this.defaultLocations).forEach(key => {
          jaw[this.teeth[i]][key] = {
            hide: this.isHidingLocation(i, key),
            class: this.preferableJawClasses(i, key)
          };
        });
      }
      this.jawComputed = jaw;
    },

    setTeeth() {
      for (let i = 0; i < this.teeth.length; i += 1) {
        this.teethSettngs[i] = {
          toothID: this.teeth[i]
        };
        for (const key in this.defaultLocations) {
          this.teethSettngs[i][key] = this.defaultLocations[key];
        }
      }
    },
    selectTooth(tooth) {
      const index = this.selectedTeethLocal.indexOf(tooth);
      if (index === -1) {
        this.selectedTeethLocal.push(tooth);
      } else {
        this.selectedTeethLocal.splice(index, 1);
      }
      this.$emit("input", this.selectedTeethLocal);

      let bottomTeethCount = 0;
      let topTeethCount = 0;

      for (let index = 0; index < this.bottomAdultTeeth.length; index += 1) {
        if (
          this.selectedTeethLocal.indexOf(this.bottomAdultTeeth[index]) > -1
        ) {
          bottomTeethCount += 1;
        }
      }
      if (bottomTeethCount < this.bottomAdultTeeth.length) {
        this.toggleAdultBottom = false;
      } else {
        this.toggleAdultBottom = true;
      }
      for (let index = 0; index < this.topAdultTeeth.length; index += 1) {
        if (this.selectedTeethLocal.indexOf(this.topAdultTeeth[index]) > -1) {
          topTeethCount += 1;
        }
      }
      if (topTeethCount < this.topAdultTeeth.length) {
        this.toggleAdultTop = false;
      } else {
        this.toggleAdultTop = true;
      }
    },
    isSelected(tooth) {
      if (this.selectedTeethLocal.indexOf(tooth) !== -1) {
        return "selected";
      }
    },
    toCurrentTeethSystem(toothID) {
      let tooth = toothID;
      if (
        this.teethSchemaL &&
        this.teethSchemaL[toothID] &&
        this.teethSchemaL[toothID][this.teethSystemL]
      ) {
        tooth = this.teethSchemaL[toothID][this.teethSystemL];
      }
      return tooth;
    }
  },
  watch: {
    jaw: {
      handler: function(newValue) {
        // console.log(newValue);
        const startTime = performance.now();

        this.calculateJaw();
        const duration = performance.now() - startTime;
        // console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);
      },
      deep: true
    },
    windowHeight(newHeight, oldHeight) {
      this.handleResize();
      // this.txt = `it changed to ${newHeight} from ${oldHeight}`;
    },
    patientDiagnosis() {
      this.getDiagnoseForEachTooth();
    }
  }
};
</script>

<style lang="scss" scoped>
.jaw,
.md-dialog-container {
  user-select: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(white, 0.4);
  border-radius: 5px;
  min-height: 30vh;
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
  }
  .jaw-bottom {
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
      z-index: 50;
      font-size: 0.9em;
      position: absolute;
      border-radius: 50%;
      box-shadow: 0 4px 5px -2px rgba(0, 0, 0, 0.2),
        0 7px 10px 1px rgba(0, 0, 0, 0.14), 0 2px 16px 1px rgba(0, 0, 0, 0.12);
      div {
        transition: all 0.2s ease-in-out;
        display: none;
        padding: 0 3px 0 3px;
      }
      &:hover {
        opacity: 1;
        height: auto !important;
        width: auto !important;
        min-height: 3px;
        // max-height: 100%;
        min-width: 3px;
        max-width: auto;
        border-radius: 3px;
        transform: scale(1.1);
        position: absolute;
        div {
          transition: all 0.2s ease-in-out;
          width: 100%;
          height: auto;
          display: table;
          white-space: normal;
          padding: 0 3px 0 3px;
        }
      }
    }

    .selected {
      background-color: rgba(116, 116, 116, 0.58);

      .tooth-number {
        color: rgb(255, 255, 255);
      }
    }

    .tooth {
      display: flex;
      // transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition-property: all;
      transition-duration: 0.4s;
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
          stroke-width: 2px;
          fill: none;
        }

        .paradontit1,
        .paradontit2,
        .paradontit3,
        .paradontit4,
        .periodontit {
          stroke-linejoin: round;
          stroke-width: 2px;
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