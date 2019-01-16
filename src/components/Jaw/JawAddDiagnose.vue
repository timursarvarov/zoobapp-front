<template>
  <div>
    <md-dialog
      :md-active.sync="newDiagnoseParamsLocal.showForm"
      class="jaw-dialog-wrapper"
    >
      <tabs
        :tab-name="tabs"
        color-button="primary"
      >
        <md-toolbar
          md-elevation="0"
          class="md-transparent"
          slot="header-title"
        >
          <div class="md-toolbar-row">
            <h3 class="md-title"> Set Diagnose:
              {{selectedDiagnose.code}} {{selectedDiagnose.title}}
            </h3>
          </div>
          <div class="md-toolbar-row">
            <span class="description">
              {{getTeethWithLocations() }} </span>
          </div>
        </md-toolbar>
        <template
          slot="tab-pane-1"
          v-if="selectedTeeth.length > 0 && selectedDiagnose.type == 'dental'"
        >

          <div class="">

            <div class="jaw">
              <div class="jaw-list  mx-auto">
                <div
                  :class="[
                  'tooth',
                  preferj]"
                  v-for="(toothId) in selectedTeeth"
                  :key="toothId"
                  :ref="toothId"
                  :style="{ 'width': jawSVG[toothId].width_perc * 10 + 'px' }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :viewBox="jawSVG[toothId].viewBox"
                    :style="{ 'width':  jawSVG[toothId].width_perc * 10 + 'px'}"
                  >
                    <g>
                      <path
                        @click="chooseLocation(toothId, key)"
                        v-for="(location, key) in defaultLocations"
                        :key="`${toothId}${key}`"
                        :class="[{
                  transparent:  selectedDiagnose.locations && selectedDiagnose.locations.hasOwnProperty(key) ? selectedDiagnose.locations[key] : false,
                  hide: selectedDiagnose.view && selectedDiagnose.view.hasOwnProperty(key) ?  !selectedDiagnose.view[key] : true
                  },
                  jawComputed[toothId][key].class,
                  jawSVG[toothId][key]['class']
                  ] "
                        :d="jawSVG[toothId][key]['d']"
                      />
                    </g>
                  </svg>

                </div>
              </div>
            </div>
            <div class="md-layout">

              <div class="md-layout-item md-size-33">
                <md-field class="md-layout-tem">
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

              <div class="md-layout-item md-size-33">

                <md-button
                  @click="setLastLocationForAllTeeth()"
                  class="md-primary md-simple"
                  :disabled="!(selectedTeeth.length > 1 && !isEmpty(selectedDiagnose.locations) && lastLocation)"
                >
                  Set for all teeth
                  <md-tooltip md-delay="1000">Set last created
                    <br /> change for all teeth</md-tooltip>
                </md-button>
              </div>
              <div class="md-layout-item md-size-33">

                <md-button
                  @click="dropAllLocations()"
                  class="md-primary md-simple"
                  :disabled="!isEmpty(diagnose.teeth) == 0 && !isEmpty(selectedDiagnose.locations)"
                >
                  Clear all
                  <md-tooltip md-delay="1000">
                    Drop all locations
                  </md-tooltip>
                </md-button>
              </div>
            </div>

          </div>
        </template>
        <template :slot=" selectedTeeth.length > 0 && selectedDiagnose.type == 'dental' ? 'tab-pane-2' : 'tab-pane-1'">

          <md-field>
            <label>Textarea with Autogrow</label>
            <md-textarea
              md-autogrow
              v-model="diagnose.description"
            ></md-textarea>
          </md-field>

        </template>
        <template :slot=" selectedTeeth.length > 0 && selectedDiagnose.type == 'dental' ? 'tab-pane-3' : 'tab-pane-2'">
          <div class="md-layout">

            <div class="md-layout-item">
              <md-field>
                <label>Textarea ASDFASDFASDFASDFASDFwith Autogrow</label>
                <md-textarea md-autogrow></md-textarea>
              </md-field>

            </div>
          </div>

        </template>

        <div slot='footer-actions'>
          <md-button @click="newDiagnoseParamsLocal.showForm = !newDiagnoseParamsLocal.showForm">Close</md-button>
          <md-button
            class="md-primary"
            :disabled="(selectedDiagnose.type == 'dental' && isEmpty(diagnose.teeth))"
            @click="setDiagnose()"
          >Save</md-button>
        </div>
      </tabs>
    </md-dialog>
  </div>
</template>
<script>
import jawSVGjs from "./jawSVG";
import { IconBase, Tabs } from "@/components";

export default {
  components: {
    IconBase,
    Tabs
  },
  model: {
    prop: "newDiagnoseParams",
    event: "hideSelectedToothDialog"
  },
  props: {
    jaw: {
      type: Object,
      default: () => {}
    },
    prefer: {
      type: String,
      default: () => "diagnose"
    },
    selectedDiagnose: {
      type: Object,
      default: () => {}
    },
    selectedTeeth: {
      type: Array,
      default: () => []
    },
    newDiagnoseParams: {
      type: Object,
      default: () => {}
    }
  },
  name: "JawAddDiagnseForm",
  data() {
    return {
      preferj: "diagnose",
      SvgTeeth: [],
      lastLocation: null,
      islastActionDelete: false,
      teethSettngs: [],
      triger: false,
      tabName: ["Set Locations", "Description", "Saved descriptions"],
      diagnose: {
        code: "",
        title: "",
        description: "",
        teeth: {},
        date: new Date(),
        author: "Some Cool"
      },
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
  methods: {
    setDiagnose() {
      this.newDiagnoseParamsLocal.diagnose = this.diagnose;
      this.newDiagnoseParamsLocal.showForm = false;
      this.newDiagnoseParamsLocal.saveDiagnose = true;
    },
    getTeethWithLocations() {
      if (this.selectedTeeth.length > 0) {
        let teeth = "for: ";
        if (!this.isEmpty(this.selectedDiagnose.locations)) {
          if (!this.isEmpty(this.diagnose.teeth)) {
            for (var key in this.diagnose.teeth) {
              if (this.diagnose.teeth.hasOwnProperty(key)) {
                teeth += key + ", ";
              }
            }
          } else {
            teeth = "Dieseas locations are not selected";
          }
        } else {
          for (let index = 0; index < this.selectedTeeth.length; index++) {
            teeth += this.selectedTeeth[index] + ", ";
          }
        }
        return teeth;
      }
    },
    dropAllLocations() {
      this.diagnose.teeth = {};
    },
    isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    },
    countProperties(obj) {
      var count = 0;

      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) ++count;
      }

      return count;
    },
    setLastLocationForAllTeeth() {
      const location = this.lastLocation;
      this.lastLocation = null;
      if (this.selectedDiagnose.locations.hasOwnProperty(location)) {
        if (
          location === "paradontit4" ||
          location === "paradontit3" ||
          location === "paradontit2" ||
          location === "paradontit1"
        ) {
          for (let index = 0; index < this.selectedTeeth.length; index++) {
            const toothIdP = this.selectedTeeth[index];
            if (
              this.hasOwnProperty(this.diagnose.teeth[toothIdP]) &&
              this.hasOwnProperty(this.diagnose.teeth[toothIdP]["paradontit4"])
            ) {
              delete this.diagnose.teeth[toothIdP]["paradontit4"];
            }
            if (
              this.hasOwnProperty(this.diagnose.teeth[toothIdP]) &&
              this.hasOwnProperty(this.diagnose.teeth[toothIdP]["paradontit3"])
            ) {
              delete this.diagnose.teeth[toothIdP]["paradontit3"];
            }
            if (
              this.hasOwnProperty(this.diagnose.teeth[toothIdP]) &&
              this.hasOwnProperty(this.diagnose.teeth[toothIdP]["paradontit2"])
            ) {
              delete this.diagnose.teeth[toothIdP]["paradontit2"];
            }
            if (
              this.hasOwnProperty(this.diagnose.teeth[toothIdP]) &&
              this.hasOwnProperty(this.diagnose.teeth[toothIdP]["paradontit1"])
            ) {
              delete this.diagnose.teeth[toothIdP]["paradontit1"];
            }
            if (!this.hasOwnProperty(this.diagnose.teeth[toothIdP])) {
              this.diagnose.teeth[toothIdP] = {};
            }

            this.diagnose.teeth[toothIdP][location] = true;
          }
        } else {
          for (let index = 0; index < this.selectedTeeth.length; index++) {
            const toothId = this.selectedTeeth[index];
            if (this.diagnose.teeth.hasOwnProperty(toothId)) {
              if (this.diagnose.teeth[toothId].hasOwnProperty(location)) {
                if (this.islastActionDelete) {
                  delete this.diagnose.teeth[toothId][location];
                  if (!this.countProperties(this.diagnose.teeth[toothId])) {
                    delete this.diagnose.teeth[toothId];
                  }
                }
              } else {
                if (!this.islastActionDelete) {
                  this.diagnose.teeth[toothId][location] = true;
                }
              }
            } else {
              if (!this.islastActionDelete) {
                this.diagnose.teeth[toothId] = {};
                this.diagnose.teeth[toothId][location] = true;
              }
            }
          }
        }
      }

      this.triger = !this.triger;
    },
    chooseLocation(toothId, location) {
      this.lastLocation = location;
      if (this.selectedDiagnose.locations.hasOwnProperty(location)) {
        if (this.diagnose.teeth.hasOwnProperty(toothId)) {
          if (this.diagnose.teeth[toothId].hasOwnProperty(location)) {
            this.islastActionDelete = true;
            delete this.diagnose.teeth[toothId][location];
            if (this.isEmpty(this.diagnose.teeth[toothId])) {
              delete this.diagnose.teeth[toothId];
            }
          } else {
            if (
              location === "paradontit4" ||
              location === "paradontit3" ||
              location === "paradontit2" ||
              location === "paradontit1"
            ) {
              delete this.diagnose.teeth[toothId]["paradontit4"];
              delete this.diagnose.teeth[toothId]["paradontit3"];
              delete this.diagnose.teeth[toothId]["paradontit2"];
              delete this.diagnose.teeth[toothId]["paradontit1"];
              this.diagnose.teeth[toothId][location] = true;
            } else {
              this.islastActionDelete = false;
              this.diagnose.teeth[toothId][location] = true;
            }
          }
        } else {
          this.islastActionDelete = false;
          this.diagnose.teeth[toothId] = {};
          this.diagnose.teeth[toothId][location] = true;
        }
      }
      this.triger = !this.triger;
    },
    isHidingLocation(i, location) {
      const anamnes =
        this.jaw.jawAnamnes &&
        this.jaw.jawAnamnes[this.selectedTeeth[i]] &&
        this.jaw.jawAnamnes[this.selectedTeeth[i]][location];
      const treatment =
        this.jaw.jawTreatment &&
        this.jaw.jawTreatment[this.selectedTeeth[i]] &&
        this.jaw.jawTreatment[this.selectedTeeth[i]][location];
      const diagnose =
        this.jaw.jawDiagnose &&
        this.jaw.jawDiagnose[this.selectedTeeth[i]] &&
        this.jaw.jawDiagnose[this.selectedTeeth[i]][location];
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
        if (this.jaw.jawAnamnes[this.selectedTeeth[i]][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        } else if (this.jaw.jawTreatment[this.selectedTeeth[i]][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawDiagnose[this.selectedTeeth[i]][location]) {
          toothClass["diagnose"] = true;
          return toothClass;
        }
        return toothClass;
      }
      if (this.preferj === "diagnose") {
        if (
          this.jaw.jawDiagnose[this.selectedTeeth[i]][location] ||
          (this.diagnose.teeth.hasOwnProperty([this.selectedTeeth[i]]) &&
            this.diagnose.teeth[this.selectedTeeth[i]][location] === true)
        ) {
          toothClass["diagnose"] = true;
          return toothClass;
        } else if (this.jaw.jawTreatment[this.selectedTeeth[i]][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawAnamnes[this.selectedTeeth[i]][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        }
        return toothClass;
      }
      if (this.preferj === "treatment") {
        if (this.jaw.jawTreatment[this.selectedTeeth[i]][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawAnamnes[this.selectedTeeth[i]][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        } else if (this.jaw.jawDiagnose[this.selectedTeeth[i]][location]) {
          toothClass["diagnose"] = true;
          return toothClass;
        }
        return toothClass;
      }
      return toothClass;
    }
  },

  computed: {
    jawSVG() {
      const jawVG = JSON.parse(jawSVGjs);
      return jawVG;
    },
    preferLocal: {
      // геттер:
      get: function() {
        return this.prefer;
      },
      // сеттер:
      set: function(newValue) {
        this.preferj = newValue;
      }
    },

    newDiagnoseParamsLocal: {
      get: function() {
        return this.newDiagnoseParams;
      },
      // сеттер:
      set: function(newValue) {
        this.$emit("hideSelectedToothDialog", this.newDiagnoseParamsLocal);
      }
    },

    jawComputed: function() {
      this.triger = !this.triger;
      let jaw = {};
      for (let i = 0; i < this.selectedTeeth.length; i += 1) {
        jaw[this.selectedTeeth[i]] = {};
        Object.keys(this.defaultLocations).forEach(key => {
          jaw[this.selectedTeeth[i]][key] = {
            hide: this.isHidingLocation(i, key),
            class: this.preferableJawClasses(i, key)
          };
        });
      }
      // console.log(jaw);
      return jaw;
    },
    tabs: function() {
      if (
        this.selectedTeeth.length === 0 ||
        this.selectedDiagnose.type != "dental"
      ) {
        return this.tabName.slice(1);
      }
      return this.tabName;
    }
  },
  created: function() {
    this.diagnose.code = this.selectedDiagnose.code;
    this.diagnose.title = this.selectedDiagnose.title;

    if (
      this.selectedTeeth.length > 0 &&
      this.countProperties(this.selectedDiagnose.locations) <= 1
    ) {
      if (this.countProperties(this.selectedDiagnose.locations) == 1) {
        for (let index = 0; index < this.selectedTeeth.length; index++) {
          this.diagnose.teeth[this.selectedTeeth[index]] = {};
          this.diagnose.teeth[this.selectedTeeth[index]][
            Object.keys(this.selectedDiagnose.locations)[0]
          ] = true;
        }
      } else {
        for (let index = 0; index < this.selectedTeeth.length; index++) {
          this.diagnose.teeth[this.selectedTeeth[index]] = {};
        }
      }
    }
    // this.triger = !this.triger;
  }
};
</script>

<style lang="scss"  >
.jaw-dialog-wrapper {
  max-height: 90% !important;
  background-color: transparent !important;
  box-shadow: none;
  margin: 0 !important;
  padding: 0 !important;
  -webkit-font-smoothing: antialiased !important;

  .md-card{
    overflow-y:auto;
    overflow-x: hidden;
  }

  .jaw,
  .md-dialog-container {
    margin: 0 !important;
    padding: 10px !important;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 15px;
    border-radius: 5px;
    .tab-pane-1,
    .tab-pane-2,
    .tab-pane-3 {
      width: 100%;
      .jaw {
        overflow: -webkit-paged-x;
        &::-webkit-scrollbar {
          height: 7px;
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background-color: grey;
          border-radius: 20px;
        }
      }
    }

    .jaw-list {
      max-height: 42vh;
      min-height: 200px;
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
            // fill: #3535ed;
          }

          .coronaLingual,
          .coronaTop,
          .coronaLabial {
            fill: #fff;
            stroke: #000;
            stroke-width: 0.25px;
          }
          .rootCanal,
          .periodontit,
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
            fill: white;
            stroke: #8d24aa70;
            stroke-width: 0.45px !important;
            &:active {
              opacity: 0.8;
              transition-property: all;
              transition-duration: 0.4s;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              transition-delay: 0s;
            }
          }
          // .coronaLingualIncisalDistal,
          // .coronaLingualIncisalMiddle,
          // .coronaLingualIncisionMesial,
          // .coronaLingualMiddleDistal,
          // .coronaLingualMiddleMiddle,
          // .coronaLingualMiddleMesial,
          // .coronaLingualCervicalDistal,
          // .coronaLingualCervicalMiddle,
          // .coronaLingualCervicalMesial,
          // .coronaLabialIncisalDistal,
          // .coronaLabialIncisalMiddle,
          // .coronaLabialIncisionMesial,
          // .coronaLabialMiddleDistal,
          // .coronaLabialMiddleMiddle,
          // .coronaLabialMiddleMesial,
          // .coronaLabialCervicalDistal,
          // .coronaLabialCervicalMiddle,
          // .coronaLabialCervicalMesial,
          // .coronaTopBuccal,
          // .coronaTopMedial,
          // .coronaTopLingual,
          // .coronaTopDistal,
          // .coronaTopOclusial {
          //   fill: #3535ed;
          // }

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
            fill: none;
            // fill: rgba(56, 43, 37, 0.283);
          }

          .paradontit2 {
            stroke: #f9610d;
            fill: none;
            // fill: rgba(56, 43, 37, 0.383);
          }

          .paradontit3 {
            stroke: #f75403;
            fill: none;
            // fill: rgba(56, 43, 37, 0.483);
          }

          .paradontit4 {
            stroke: #f73403;
            fill: none;
            // fill: rgba(56, 43, 37, 0.583);
          }

          .periodontit {
            // fill: #3535ed;
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
            stroke-width: 3px;
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

    .anamnes {
      fill: #fb8c00 !important;
    }
    .diagnose:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1) {
      fill: #8e24aa !important;
    }
    .diagnose.paradontit1,
    .diagnose.paradontit2,
    .diagnose.paradontit3,
    .diagnose.paradontit4 {
      stroke: #8e24aa !important;
      opacity: 1 !important;
    }
    .treatment {
      fill: #43a047 !important;
    }
    .transparent {
      stroke: #8e24aa;
      // opacity: 0.1;
      &:hover:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1) {
        fill: #8e24aa !important;
        opacity: 0.7;
        transition-property: all;
        transition-duration: 0.4s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-delay: 0s;
      }
    }
    .transparent.paradontit4,
    .transparent.paradontit3,
    .transparent.paradontit2,
    .transparent.paradontit1 {
      stroke: #8e24aa;
      opacity: 0.3;

      &:hover {
        opacity: 1;
        stroke-width: 4px !important;
        stroke: #8e24aa !important;
        transition-property: all;
        transition-duration: 0.4s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-delay: 0s;
      }
    }
  }
}
</style>