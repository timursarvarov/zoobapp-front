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
                  'has-in-locations': getNestedProperty(selectedDiagnose, 'locations', key )  !== undefined,  //класс 'has-in-locations' применяется для не выбранных парадонтитов  
                 
                  rejectable: getNestedProperty(selectedDiagnose, 'locations', key ) === false,  //класс 'rejectable' применяется для локаций которые возможнор отметить для удаления  
                  
                  selected: getNestedProperty(diagnose, 'teeth', toothId,  key ) !== undefined,  //класс 'seleced' применяется для выбранной локации  

                  hide: !getNestedProperty(selectedDiagnose, 'view', key )  // класс hide применяется если во view выбранного диагноза нет текущей локации  
                  },
                  jawComputed[toothId][key].class, // Название класса локации из высчитанной формуллы для отображеня в диагнозов анамнеза и лечения 
                 
                  jawSVG[toothId][key]['class'] // Название класса локации из svg для отображеня в норме 
                  ] "
                        :d="jawSVG[toothId][key]['d']"
                      />
                    </g>
                    <!-- <use
                      id="use"
                      xlink:href=".diagnose"
                    /> -->
                  </svg>
                  <span class="tooth-number">{{toCurrentTeethSystem(toothId)}}</span>
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
    getNestedProperty(object = {}, key1 = null, key2 = null, key3 = null) {
      if (this.isEmpty(object)) return undefined;
      if (object.hasOwnProperty(key1)) {
        if (!key2) {
          return object[key1];
        } else if (object[key1].hasOwnProperty(key2)) {
          if (!key3) {
            return object[key1][key2];
          } else if (object[key1][key2].hasOwnProperty(key3)) {
            return object[key1][key2][key3];
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      }
    },
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
      console.log(this.islastActionDelete);
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
              this.getNestedProperty(
                this.diagnose,
                "teeth",
                toothIdP,
                "paradontit4"
              )
            ) {
              delete this.diagnose.teeth[toothIdP]["paradontit4"];
            }
            if (
              this.getNestedProperty(
                this.diagnose,
                "teeth",
                toothIdP,
                "paradontit3"
              )
            ) {
              delete this.diagnose.teeth[toothIdP]["paradontit3"];
            }
            if (
              this.getNestedProperty(
                this.diagnose,
                "teeth",
                toothIdP,
                "paradontit2"
              )
            ) {
              delete this.diagnose.teeth[toothIdP]["paradontit2"];
            }
            if (
              this.getNestedProperty(
                this.diagnose,
                "teeth",
                toothIdP,
                "paradontit1"
              )
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
        } else if (
          this.selectedDiagnose["locations"][location] === false &&
          (location === "coronaLingual" ||
            location === "coronaLabial" ||
            location === "coronaTop")
        ) {
          for (let index = 0; index < this.selectedTeeth.length; index++) {
            const toothIdP = this.selectedTeeth[index];
            if (!this.islastActionDelete) {
              this.diagnose.teeth[toothIdP]["coronaTop"] = false;
              this.diagnose.teeth[toothIdP]["coronaLabial"] = false;
              this.diagnose.teeth[toothIdP]["coronaLingual"] = false;
            } else {
              delete this.diagnose.teeth[toothIdP]["coronaLingual"];
              delete this.diagnose.teeth[toothIdP]["coronaLabial"];
              delete this.diagnose.teeth[toothIdP]["coronaTop"];
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
      if (this.selectedDiagnose.locations.hasOwnProperty(location)) {
        this.lastLocation = location;
        if (this.diagnose.teeth.hasOwnProperty(toothId)) {
          if (this.diagnose.teeth[toothId].hasOwnProperty(location)) {
            if (
              this.selectedDiagnose["locations"][location] === false &&
              (location === "coronaLingual" ||
                location === "coronaLabial" ||
                location === "coronaTop")
            ) {
              delete this.diagnose.teeth[toothId]["coronaLingual"];
              delete this.diagnose.teeth[toothId]["coronaLabial"];
              delete this.diagnose.teeth[toothId]["coronaTop"];
              this.islastActionDelete = true;
            } else {
              this.islastActionDelete = true;
              delete this.diagnose.teeth[toothId][location];
            }
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
            } else if (
              this.selectedDiagnose["locations"][location] === false &&
              (location === "coronaLingual" ||
                location === "coronaLabial" ||
                location === "coronaTop")
            ) {
              this.diagnose.teeth[toothId]["coronaLingual"] = false;
              this.diagnose.teeth[toothId]["coronaLabial"] = false;
              this.diagnose.teeth[toothId]["coronaTop"] = false;
              this.islastActionDelete = false;
            } else {
              this.islastActionDelete = false;
              this.diagnose.teeth[toothId][
                location
              ] = this.selectedDiagnose.locations[location];
            }
            // const locationsToHide = Object.keys(
            //   this.selectedDiagnose.locations
            // ).filter(key => this.selectedDiagnose.locations[key] === false);
            // for (let locationToHide of locationsToHide) {
            //   console.log(locationToHide);
            //   this.diagnose.teeth[toothId][locationToHide] = false;
            // }
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
      console.log(this.diagnose.teeth);
      this.triger = !this.triger;
    },
    // Высчитывваем в какую очередь нужно прятать локацию в зависимости от выбронного приоретета показа(анамнез дигноз или лечение)
    isHidingLocation(i, location) {
      const toothId = this.selectedTeeth[i];
      const anamnes = this.getNestedProperty(
        this.jaw,
        "jawAnamnes",
        toothId,
        location
      );
      const treatment = this.getNestedProperty(
        this.jaw,
        "jawTreatment",
        toothId,
        location
      );
      const diagnose = this.getNestedProperty(
        this.jaw,
        "jawDiagnose",
        toothId,
        location
      );
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
      const toothId = this.selectedTeeth[i];

      if (this.preferj === "anamnes") {
        if (this.jaw.jawAnamnes[toothId][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        } else if (this.jaw.jawTreatment[toothId][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawDiagnose[toothId][location]) {
          toothClass["diagnose"] = true;
          return toothClass;
        }
        return toothClass;
      }
      if (this.preferj === "diagnose") {
        if (this.jaw.jawDiagnose[toothId][location]) {
          toothClass["diagnose"] = true;
          return toothClass;
        } else if (this.jaw.jawTreatment[toothId][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawAnamnes[toothId][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        }
        return toothClass;
      }
      if (this.preferj === "treatment") {
        if (this.jaw.jawTreatment[toothId][location]) {
          toothClass["treatment"] = true;
          return toothClass;
        } else if (this.jaw.jawAnamnes[toothId][location]) {
          toothClass["anamnes"] = true;
          return toothClass;
        } else if (this.jaw.jawDiagnose[toothId][location]) {
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
        this.getNestedProperty(this.teethSchema, toothID, this.teethSystemL)
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
    if (this.selectedTeeth.length > 0) {
      if (
        this.getPropertiesWithTrue(this.selectedDiagnose.locations).length ===
        this.selectedDiagnose.locations.length // или все локации к удалению (равные false))
      ) {
        //тогда присвой все локации из выбранного дигноза вновь создаваемому
        for (let index = 0; index < this.selectedTeeth.length; index++) {
          this.diagnose.teeth[this.selectedTeeth[index]] = {};
          const locations = Object.keys(this.selectedDiagnose.locations);
          for (const key in this.selectedDiagnose.locations) {
            if (this.selectedDiagnose.locations.hasOwnProperty(key)) {
              this.diagnose.teeth[this.selectedTeeth[index]][
                key
              ] = this.selectedDiagnose.locations[key];
            }
          }
        }
      } else {
        // в противном случае вносим во вновь создаваемое лечение только первые положительные локации
        for (let index = 0; index < this.selectedTeeth.length; index++) {
          this.diagnose.teeth[this.selectedTeeth[index]] = {}; //создаем массив с зубами в диагнозе
          this.diagnose.teeth[this.selectedTeeth[index]][
            Object.keys(this.selectedDiagnose.locations)[0]
              ? Object.keys(this.selectedDiagnose.locations)[0]
              : this.getPropertiesWithTrue(this.selectedDiagnose.locations)[0]
          ] = true;
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

          .root:not(.has-in-locations) {
            fill: #f8edc8;
            stroke: #292320;
            stroke-width: 0.25px;
          }

          .rootCanal {
            // fill: #3535ed;
          }
          .selected:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1):not(.gum) {
            fill: #8e24aa !important;
          }

          .coronaLingual:not(.has-in-locations),
          .coronaTop:not(.has-in-locations),
          .coronaLabial:not(.has-in-locations) {
            fill: #fff;
            stroke: #000;
            stroke-width: 0.25px;
          }
          .has-in-locations:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1):not(.gum) {
            stroke: #8e24aa;
            stroke-width: 1.5px !important;
          }
          .has-in-locations,
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
            stroke-width: 0.45px;
            &:active {
              opacity: 0.8;
              transition-property: all;
              transition-duration: 0.4s;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              transition-delay: 0s;
            }
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

          .paradontit1.has-in-locations,
          .paradontit2.has-in-locations,
          .paradontit3.has-in-locations,
          .paradontit4.has-in-locations,
          .periodnotit.has-in-locations {
            opacity: 0.3;
            stroke-linejoin: round;
            stroke-width: 3px;
            &:hover {
              opacity: 1;
              stroke-width: 4px !important;
              stroke: #8e24aa !important;
            }
          }
          .paradontit1.selected,
          .paradontit2.selected,
          .paradontit3.selected,
          .paradontit4.selected,
          .periodnotit.selected {
            opacity: 1;
            stroke-linejoin: round;
            stroke-width: 3px;
            stroke: #8e24aa;
          }

          .paradontit1,
          .paradontit2,
          .paradontit3,
          .paradontit4,
          .periodnotit {
            stroke-linejoin: round;
            stroke-width: 3px;
            transition-property: all;
            transition-duration: 0.4s;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-delay: 0s;
          }
          .hide {
            display: none;
          }
        }
      }
    }
    // .has-in-locations:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1) {
    //   stroke: #8e24aa !important;
    // }

    .anamnes {
      fill: #fb8c00 !important;
      .tooth-number {
        color: #fb8c00;
      }
    }
    .diagnose:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1) {
      // fill: #8e24aa !important;
      .tooth-number {
        color: #8e24aa;
      }
    }
    .diagnose.gum {
      stroke-width: 4px !important;
    }

    .treatment {
      fill: #43a047 !important;
      .tooth-number {
        color: #43a047;
      }
    }
    .selected {
      stroke: #8e24aa;
      opacity: 1 !important;
    }

    // .has-in-locations {
    //   stroke: #8e24aa;
    //   // opacity: 0.3;
    //   &:hover:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1) {
    //     fill: #8e24aa !important;
    //     opacity: 0.7;
    //     transition-property: all;
    //     transition-duration: 0.4s;
    //     transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    //     transition-delay: 0s;
    //   }
    // }

    // .has-in-locations.paradontit4,
    // .has-in-locations.paradontit3,
    // .has-in-locations.paradontit2,
    // .has-in-locations.paradontit1 {
    //   stroke: #8e24aa;
    //   opacity: 0.1;

    //   &:hover {
    //     opacity: 1;
    //     z-index: 50;
    //     stroke-width: 4px !important;
    //     stroke: #8e24aa !important;
    //     transition-property: all;
    //     transition-duration: 0.4s;
    //     transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    //     transition-delay: 0s;
    //   }
    // }
  }
}
</style>