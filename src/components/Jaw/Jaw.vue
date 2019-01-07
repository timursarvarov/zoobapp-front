/* eslint-disable */
<template>
  <div>
    {{selectedTeethLocal}}
    <div class="jaw">
      <slot name="top"></slot>
      <div class="jaw-top">
        <div
          :class="[
          'tooth',
          isSelected(toothId),
          prefer]"
          v-for="(toothId ) in topAdultTeeth"
          :key="toothId"
          :ref="toothId"
          :style="{ 'width': jawSVG[toothId].width_perc + '%', 'height': '100%' }"
          @click="selectTooth(toothId)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="jawSVG[toothId].viewBox"
            :style="{ 'width': jawSVG[toothId].width_perc + '%'}"
          >
            <g>
              <path
                v-for="(location, key) in defaultLocations"
                v-if="!jawComputed[toothId][key].class.hide"
                :key="`${toothId}${key}`"
                :class="[{ 
                  'treatment': jawComputed[toothId][key].class.treatment,
                  'anamnes':  jawComputed[toothId][key].class.anamnes,
                  'diagnose': jawComputed[toothId][key].class.diagnose,
                  'hide': jawComputed[toothId][key].class.hide,
                  },   jawSVG[toothId][key]['class'] ]"
                :d="jawSVG[toothId][key]['d']"
              />
            </g>
          </svg>
        </div>
      </div>
      <div class="jaw-bottom">
        <div
          v-ripple
          :class="[
          'tooth',
          isSelected(toothId)]"
          v-for="(toothId ) in bottomAdultTeeth"
          :key="toothId"
          :ref="toothId"
          :style="{ 'width': jawSVG[toothId].width_perc + '%', 'height': '100%' }"
          @click="selectTooth(toothId)"
        >
          <svg
            xmlns="
          http://www.w3.org/2000/svg"
            :viewBox="jawSVG[toothId].viewBox"
            :style="{ 'width': jawSVG[toothId].width_perc + '%'}"
          >
            <g>
              <path
                v-for="(location, key) in defaultLocations"
                :key="`${toothId}${key}`"
                :class="[{ 
                  'treatment': jawComputed[toothId][key].class.treatment,
                  'anamnes':  jawComputed[toothId][key].class.anamnes,
                  'diagnose': jawComputed[toothId][key].class.diagnose,
                  'hide': jawComputed[toothId][key].class.hide,
                  },   jawSVG[toothId][key]['class'] ]"
                :d="jawSVG[toothId][key]['d']"
              />
            </g>
          </svg>
        </div>
      </div>
      <slot name="bottom"></slot>
    </div>
    <md-dialog :md-active.sync="showSelectedToothDialog">
      <md-dialog-title>Preferences</md-dialog-title>
      <div
        v-if="selectedTooth"
        class="tooth"
        :style="{ 'width': '100%', 'height': '50vh' }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="jawSVG[tooth].viewBox"
          :style="{ 'width': jawSVG[tooth].width_perc + '%'}"
        >
          <g>
            <path
              v-for="(location, key) in defaultLocations"
              :key="`${tooth}${key}`"
              v-if="jaw[tooth][key] && jawSVG[tooth][key]"
              :class="jawSVG[tooth][key]['classList']"
              :d="jawSVG[tooth][key]['d']"
            />
          </g>
        </svg>
      </div>
      <md-dialog-actions>
        <md-button
          class="md-primary"
          @click="showDialog = false"
        >Close</md-button>
        <md-button
          class="md-primary"
          @click="showDialog = false"
        >Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>
<script>
import jawSVGjs from "./jawSVG";
import {
  IconAdult,
  IconBase,
  IconBaby,
  IconToggleBottom,
  IconToggleTop
} from "@/components";

export default {
  components: {
    IconAdult,
    IconBase,
    IconBaby,
    IconToggleBottom,
    IconToggleTop
  },
  props: {
    selectedTeeth: {
      type: Array,
      default: () => []
    },
    jaw: {
      type: Object,
      default: () => {}
    },
    prefer: {
      type: String,
      default: () => "treatment"
    }
  },
  name: "AppMain",
  data() {
    return {
      SvgTeeth: [],
      teethSettngs: [],
      selectedTooth: null,
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
        fdi: true,
        universal: false,
        palmer: false
      }
    };
  },

  computed: {
    jawSVG() {
      const jawVG = JSON.parse(jawSVGjs);
      return jawVG;
    },
    selectedTeethJ() {
      return this.selectedTeeth;
    },
    jawComputed() {
      let jaw = {};
      for (let i = 0; i < this.teeth.length; i += 1) {
        jaw[this.teeth[i]] = {};
        Object.keys(this.defaultLocations).forEach(key => {
          jaw[this.teeth[i]][key] = {
            class: {
              hide: this.isHidingLocation(i, key),
              treatment: this.jaw.jawTreatment[this.teeth[i]][key]
                ? true
                : false,
              anamnes: this.jaw.jawAnamnes[this.teeth[i]][key] ? true : false,
              diagnose: this.jaw.jawDiagnose[this.teeth[i]][key] ? true : false
            }
          };
        });
      }

      return jaw;
    }
  },

  mounted() {
    this.setTeeth();
    this.selectedTeeth = this.selectedTeethJ;
  },

  methods: {
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
      if (this.prefer === "anamnes") {
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
      if (this.prefer === "treatment") {
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
      if (this.prefer === "diagnose") {
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
    showTooth(tooth) {
      this.selectedTooth = tooth;
      this.showSelectedToothDialog = true;
      console.log(this.showSelectedToothDialog);
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
    },
    isSelected(tooth) {
      if (this.selectedTeethLocal.indexOf(tooth) !== -1) {
        return "selected";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.jaw,
.md-dialog-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: rgba(white, 0.4);
  border-radius: 5px;

  .jaw-top,
  .jaw-bottom {
    display: flex;

    .selected {
      background-color: rgba(116, 116, 116, 0.58);

      .fdi,
      .universal,
      .palmer {
        isolation: isolate;
        fill: rgb(255, 255, 255);
      }
    }

    .tooth {
      display: flex;
      // transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transition-property: all;
      transition-duration: 0.4s;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-delay: 0s;

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
          fill: rgba(56, 43, 37, 0.283);
        }

        .paradontit2 {
          stroke: #f9610d;
          fill: rgba(56, 43, 37, 0.383);
        }

        .paradontit3 {
          stroke: #f75403;
          fill: rgba(56, 43, 37, 0.483);
        }

        .paradontit4 {
          stroke: #f73403;
          fill: rgba(56, 43, 37, 0.583);
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
  }
  .tooth.anamnes {
    .anamnes {
      fill: #fb8c00 !important;
    }
    .diagnose {
      fill: #8e24aa;
    }
    .treatment {
      fill: #43a047;
    }
  }
  .tooth.diagnose {
    .anamnes {
      fill: #fb8c00;
    }
    .diagnose {
      fill: #8e24aa !important;
    }
    .treatment {
      fill: #43a047;
    }
  }
  .tooth.treatment {
    .anamnes {
      fill: #fb8c00;
    }
    .diagnose {
      fill: #8e24aa;
    }
    .treatment {
      fill: #43a047 !important;
    }
  }
}
</style>