<template>
  <div>
    <md-dialog
      :md-active.sync="newDiagnoseParamsLocal.showForm"
      class="jaw-dialog-wrapper"
    >
      <tabs
        :tab-name="tabs"
        color-button="primary"
        ref="jaw"
      >

        <div slot="header-title">
          <h4> Set Diagnose:
            {{selectedDiagnose.code}} {{selectedDiagnose.title}}
          </h4>
          <span class="description">
            {{getTeethWithLocations() }} </span>
        </div>

        <template
          slot="tab-pane-1"
          v-if="selectedTeeth.length > 0 "
        >
          <div class="md-layout md-gutter md-layout-item">

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
                v-show="(selectedTeeth.length > 1 && ( selectedDiagnose.locations && lastLocation in selectedDiagnose.locations))"
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
                v-show=" !isEmpty(selectedDiagnose.locations)"
              >
                Clear all
                <md-tooltip md-delay="1000">
                  Drop all locations
                </md-tooltip>
              </md-button>
            </div>
          </div>
          <div class="md-layout md-layout-item md-gutter">
            <div class="jaw md-layout-item">
              <div class="jaw-list mx-auto">
                <div
                  :class="[
                  'tooth',
                  preferj]"
                  v-for="(toothId) in selectedTeeth"
                  :key="toothId"
                  :ref="toothId"
                  :style="{ 'width': jawSVG[toothId].width_perc * 8 + 'px' }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :viewBox="jawSVG[toothId].viewBox"
                    :style="{ 'width':  jawSVG[toothId].width_perc * 8 + 'px'}"
                  >
                    <g>
                      <path
                        @click="chooseLocation(toothId, key)"
                        v-for="(location, key) in defaultLocations"
                        :key="`${toothId}${key}`"
                        :class="[{
                  transparent:  selectedDiagnose.locations
                   && selectedDiagnose.locations.hasOwnProperty(key) ? 
                   selectedDiagnose.locations[key] : false,  //класс transparent применяется для не выбранных парадонтитов  

                  hide: selectedDiagnose.view && 
                  selectedDiagnose.view.hasOwnProperty(key) && 
                  selectedDiagnose.view[key] ?
                    false : true // класс hide применяется если во view выбранного диагноза нет текущей локации  
                  },
                  jawComputed[toothId][key].class, // Название класса локации из высчитанной формуллы для отображеня в диагнозов анамнеза и лечения 
                 
                  jawSVG[toothId][key]['class'] // Название класса локации из svg для отображеня в норме 
                  ] "
                        :d="jawSVG[toothId][key]['d']"
                      />
                    </g>
                    <use
                      id="use"
                      xlink:href=".diagnose"
                    />
                  </svg>
                  <span class="tooth-number">{{toCurrentTeethSystem(toothId)}}</span>
                  <div
                    @click="chooseLocation(toothId, 'rejected')"
                    v-if="selectedDiagnose.locations.hasOwnProperty('rejected')"
                    class="tooth-rejected"
                    :class="[{
                  transparent:  selectedDiagnose.locations
                   && selectedDiagnose.locations.hasOwnProperty('rejected') ? 
                   selectedDiagnose.locations['rejected'] : false,
                  hide: selectedDiagnose.view && selectedDiagnose.view.hasOwnProperty('rejected') ?
                    !selectedDiagnose.view['rejected'] : true
                  },
                  jawComputed[toothId]['rejected'].class,
                  jawSVG[toothId]['rejected']['class']
                  ] "
                  ></div>

                </div>
              </div>
            </div>

          </div>
        </template>
        <template :slot=" selectedTeeth.length > 0 && selectedDiagnose.type == 'dental' ? 'tab-pane-2' : 'tab-pane-1'">
          <div class="md-layout">
            <md-field>
              <label>Textarea with Autogrow</label>
              <md-textarea
                md-autogrow
                v-model="diagnose.description"
              ></md-textarea>
            </md-field>
          </div>
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
    // Пропс выбранношо диагноза
    selectedDiagnose: {
      type: Object,
      default: () => {}
    },
    selectedTeeth: {
      type: Array,
      default: () => []
    },
    // Глобальная V-model для
    // отображения/скрытия формы
    newDiagnoseParams: {
      type: Object,
      default: () => {}
    },
    // Объект с ключами (toothID)  и шаблонами для отображения названия зубов в различных сиситемах
    teethSchema: {
      type: Object,
      default: () => {}
    },

    teethSystem: {
      type: Number,
      default: () => 1
      // 1 = FDI World Dental Federation notation
      // 2 = Universal numbering system
      // 3 = Palmer notation method
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
        fdi: false,
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
    // Отображаем в заголовке список зубов с указанными локациями или,
    // (скрыт если диагноз оральный)
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
    //Очищаем список зубов в выбранном диагнозе
    dropAllLocations() {
      this.diagnose.teeth = {};
    },
    // функция для проверки пустого объекта
    isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    },
    // Функция для подсчета количества элементов в объекте
    countProperties(obj) {
      var count = 0;

      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) ++count;
      }

      return count;
    },
    getPropertiesWithTrue(obj) {
      let props = [];

      for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] === true) {
          props.push(prop);
        }
      }
      return props;
    },
    //  Устанавливаем последнюю указанную локацию для всех выбранных зубов
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
            const locationsToHide = Object.keys(
              this.selectedDiagnose.locations
            ).filter(key => this.selectedDiagnose.locations[key] === false);
            for (let locationToHide of locationsToHide) {
              console.log(locationToHide);
              this.diagnose.teeth[toothIdP][locationToHide] = false;
            }
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
    // выбираем область зуба и записываем ее в массив с зубами в дигнозе
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
            const locationsToHide = Object.keys(
              this.selectedDiagnose.locations
            ).filter(key => this.selectedDiagnose.locations[key] === false);
            for (let locationToHide of locationsToHide) {
              console.log(locationToHide);
              this.diagnose.teeth[toothId][locationToHide] = false;
            }
          }
        } else {
          this.islastActionDelete = false;
          this.diagnose.teeth[toothId] = {};
          this.diagnose.teeth[toothId][location] = true;
          const locationsToHide = Object.keys(
            this.selectedDiagnose.locations
          ).filter(key => this.selectedDiagnose.locations[key] === false);
          for (let locationToHide of locationsToHide) {
            console.log(locationToHide);
            this.diagnose.teeth[toothId][locationToHide] = false;
          }
        }
      }
      this.triger = !this.triger;
    },
    // Высчитывваем в какую очередь нужно прятать локацию в зависимости от выбронного приоретета показа(анамнез дигноз или лечение)
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
    // Высчитывваем в какую очередь нужно присвоить класс для показа локации в зависимости от выбронного приоретета показа(анамнез дигноз или лечение)

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
    },
    toCurrentTeethSystem(toothID) {
      let tooth = toothID;
      if (
        this.teethSchema &&
        this.teethSchema[toothID] &&
        this.teethSchema[toothID][this.teethSystemL]
      ) {
        tooth = this.teethSchema[toothID][this.teethSystemL];
      }
      return tooth;
    }
  },

  computed: {
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
    console.log(this.getPropertiesWithTrue(this.selectedDiagnose.locations));
    if (
      (this.selectedTeeth.length > 0 &&
        this.countProperties(this.selectedDiagnose.locations) <= 1) ||
      this.getPropertiesWithTrue(this.selectedDiagnose.locations).length == 1
    ) {
      if (
        this.countProperties(this.selectedDiagnose.locations) == 1 ||
        this.getPropertiesWithTrue(this.selectedDiagnose.locations).length == 1
      ) {
        for (let index = 0; index < this.selectedTeeth.length; index++) {
          this.diagnose.teeth[this.selectedTeeth[index]] = {};
          this.diagnose.teeth[this.selectedTeeth[index]][
            Object.keys(this.selectedDiagnose.locations)[0]
              ? Object.keys(this.selectedDiagnose.locations)[0]
              : this.getPropertiesWithTrue(this.selectedDiagnose.locations)[0]
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
  min-width: 80%;
  max-height: 100% !important;
  background-color: transparent !important;
  box-shadow: none;
  margin: 0 !important;
  padding: 0 !important;
  -webkit-font-smoothing: antialiased !important;

  .md-card {
    overflow-y: auto;
    overflow-x: auto;
    margin: 0;

    // overflow: -webkit-paged-x;
    &::-webkit-scrollbar {
      width: 7px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 20px;
    }
  }

  .jaw,
  .md-dialog-container {
    margin: 0 !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;

    display: flex;
    flex-direction: column;
    padding: 15px;
    border-radius: 5px;
    .jaw-settings {
      max-width: 300px;
    }
    .tab-pane-1,
    .tab-pane-2,
    .tab-pane-3 {
      width: 100%;
      min-height: 40vh;
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
      .tooth {
        display: flex;
        // transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transition-property: all;
        transition-duration: 0.4s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-delay: 0s;
        position: relative;
        padding-bottom: 15px;
        .tooth-number {
          font-size: 1.3em;
          overflow: show;
          margin: auto;
          position: absolute;
          left: 50%;
          bottom: -5px;
          transform: translate(-50%, 0);
        }

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
          .hide {
            display: none;
          }
        }
      }
    }
    .tooth-rejected {
      top: 0;
      width: 100%;
      position: absolute;
      height: 90%;
      opacity: 0.4;
      margin-bottom: 60px;
    }

    .anamnes {
      .tooth-rejected {
        background-color: #fb8c00;
      }
      fill: #fb8c00 !important;
      .tooth-number {
        color: #fb8c00;
      }
    }
    .diagnose:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1) {
      .tooth-rejected {
        background-color: #8e24aa;
      }
      fill: #8e24aa !important;
      .tooth-number {
        color: #8e24aa;
      }
    }
    .diagnose.gum {
      stroke-width: 4px !important;
      stroke: #8e24aa !important;
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
      .tooth-number {
        color: #43a047;
      }
      .tooth-rejected {
        background-color: #43a047;
      }
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
      opacity: 0.1;

      &:hover {
        opacity: 1;
        z-index: 50;
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