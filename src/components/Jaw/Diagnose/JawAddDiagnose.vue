<template>
  <div class="jaw-list-wrapper">
    <md-toolbar class="md-transparent">
      <!-- <div class="md-toolbar-section-start"> -->
      <slide-y-down-transition>
        <slot name="title"></slot>
      </slide-y-down-transition>
      <!-- </div> -->
      <div class="md-toolbar-section-end">
        <md-button
          :disabled="!lastAction.location"
          @click="setLastLocationForAllTeeth()"
          class="md-primary md-round md-simple md-just-icon"
        >
          <md-icon>done_all</md-icon>
          <md-tooltip md-delay="1000">
            Set last created
            <br>change for all teeth
          </md-tooltip>
        </md-button>

        <md-button @click="dropAllLocations()" class="md-primary md-round md-simple md-just-icon">
          <md-icon>clear_all</md-icon>
          <md-tooltip md-delay="1000">Drop all locations</md-tooltip>
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
            <li>
              <md-switch v-model="preferj" value="anamnes">Anamnes</md-switch>
            </li>
            <li>
              <md-switch v-model="preferj" value="diagnose">Diagnose</md-switch>
            </li>
            <li>
              <md-switch v-model="preferj" value="treatment">Treatment</md-switch>
            </li>
          </ul>
        </drop-down>
      </div>
    </md-toolbar>

    <div
      :style="[{'max-width': `${jawListWidth}px`}]"
      class="md-layout md-layout-item md-gutter jaw-list-container"
    >
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
                  @click="chooseLocation(toothId, location), setLastAction(toothId, location) "
                  v-for="(locationValue, location) in defaultLocations"
                  :key="`${toothId}${location}`"
                  :class="[
                        // получаем объект классов диагноза
                        getToothClasses(toothId, location),
                          // Название класса локации из высчитанной формуллы для отображеня в диагнозов анамнеза и лечения
                          jawComputed[toothId][location].class,

                        // Название класса локации из svg для отображеня в норме
                          jawSVG[toothId][location]['class']
                          ] "
                  :d="jawSVG[toothId][location]['d']"
                ></path>
              </g>
              <!-- <use
                      id="use"
                      xlink:href=".diagnose"
              />-->
            </svg>
            <span class="tooth-number">{{toothId | toCurrentTeethSystem(teethSystem)}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { SlideYDownTransition } from 'vue2-transitions';
  import jawSVGjs from '../jawSVG';
  import { isEmpty, tObjProp } from '@/mixins';

  export default {
    mixins: [isEmpty, tObjProp],
    components: {
      SlideYDownTransition,
    },
    model: {
      prop: 'newDiagnoseParams',
      event: 'updateDiagonoseParams',
    },
    props: {
      defaultLocations: {
        type: Object,
        default: () => {},
      },
      jaw: {
        type: Object,
        default: () => {},
      },
      prefer: {
        type: String,
        default: () => 'diagnose',
      },
      // Пропс выбранношо диагноза
      selectedDiagnose: {
        type: Object,
        default: () => ({
          code: '',
          title: '',
          explain: '',
          type: '',
          view: {},
          locations: {},
          addlocation: {},
        }),
      },
      selectedTeeth: {
        type: Array,
        default: () => [],
      },
      // Глобальная V-model для
      // отображения/скрытия формы
      newDiagnoseParams: {
        type: Object,
        default: () => {},
      },
      // Объект с ключами (toothID)  и шаблонами для отображения названия зубов в различных сиситемах
      teethSchema: {
        type: Object,
        default: () => {},
      },

      teethSystem: {
        type: Number,
        default: () => 1,
      // 1 = FDI World Dental Federation notation
      // 2 = Universal numbering system
      // 3 = Palmer notation method
      },
    },
    name: 'JawAddDiagnseForm',
    data() {
      return {
        disabled: false,
        jawComputed: {},
        windowWidth: 1,
        preferj: 'diagnose',
        SvgTeeth: [],
        lastAction: {
          location: null,
          toothId: null,
        },
        teethSettngs: [],
        diagnose: {
          code: '',
          title: '',
          description: '',
          teeth: {},
          date: new Date(),
        },
      };
    },
    methods: {
      getToothClasses(toothId, location) {
        const toothClasses = {
          // класс 'has-in-locations' применяется для не выбранных парадонтитов
          'has-in-locations':
            this.getNestedProperty(
              this.selectedDiagnose,
              'locations',
              location,
            ) !== undefined,

          // класс 'rejectable' применяется для локаций которые возможнор отметить для удаления
          rejectable:
            this.getNestedProperty(
              this.selectedDiagnose,
              'locations',
              location,
            ) === false,

          // класс 'seleced' применяется для выбранной локации
          selected:
            this.getNestedProperty(this.diagnose, 'teeth', toothId, location)
            !== undefined,

          // класс hide применяется если во view выбранного диагноза нет текущей локации
          hide: !this.getNestedProperty(this.selectedDiagnose, 'view', location),
        };
        return toothClasses;
      },
      dropAllLocations() {
        this.diagnose.teeth = {};
        this.getDiagnose();
      },
      // функция для проверки пустого объекта
      isEmpty(obj) {
        return Object.entries(obj).length === 0 && obj.constructor === Object;
      },
      //  Устанавливаем последнюю указанную локацию для всех выбранных зубов
      setLastLocationForAllTeeth() {
        if (this.lastAction.location) {
          const teethWithSameLocation = this.getTeethWithSameLocation(
            this.lastAction.location,
          );
          const teethWithOutL = this.selectedTeeth.filter(
            el => !teethWithSameLocation.includes(`${el}`),
          );
          let teethToSet = [];
          if (
            teethWithSameLocation.length === this.selectedTeeth.length
            || teethWithSameLocation.length === 0
          ) {
            teethToSet = this.selectedTeeth;
          } else if (teethWithOutL.includes(this.lastAction.toothId)) {
            teethToSet = teethWithSameLocation;
          } else {
            teethToSet = teethWithOutL;
          }

          console.log(teethWithSameLocation, this.selectedTeeth);
          console.log(teethWithOutL);
          teethToSet.forEach((toothId) => {
            this.chooseLocation(toothId, this.lastAction.location);
          });
          this.calculateJaw();
        }
      },
      getTeethWithSameLocation(location) {
        return Object.keys(this.diagnose.teeth).filter(
          toothId => location in this.diagnose.teeth[toothId],
        );
      },
      // выбираем область зуба и записываем ее в массив с зубами в дигнозе

      setLastAction(toothId, location) {
        this.lastAction.toothId = toothId;
        this.lastAction.location = location;
      },
      chooseLocation(toothId, location) {
        // если выбранная область относиться к текущему диагнозу
        if (this.hasProp(this.selectedDiagnose.locations, location)) {
          // если выбранный зуб не находиться в списке зубов дигноза
          if (!this.hasProp(this.diagnose.teeth, toothId)) {
            this.diagnose.teeth[toothId] = {};
          }
          // false = локация для удаления, true = для выбора области к лечению

          // устанавливаем локацию диагноза в при помощи предустановленной функции
          const { addLocation } = this.selectedDiagnose;
          this.diagnose = addLocation(location, this.diagnose, toothId);

          // удаляем зуб из диагноза если у него нет локациий
          if (this.isEmpty(this.diagnose.teeth[toothId])) {
            delete this.diagnose.teeth[toothId];
          }
        }
        this.calculateJaw();
      },

      // Высчитывваем в какую очередь нужно прятать локацию в зависимости от выбронного приоретета показа(анамнез дигноз или лечение)
      isHidingLocation(i, location) {
        const toothId = this.selectedTeeth[i];
        const anamnes = this.getNestedProperty(
          this.jaw,
          'jawAnamnes',
          toothId,
          location,
        );
        const treatment = this.getNestedProperty(
          this.jaw,
          'jawTreatment',
          toothId,
          location,
        );
        const diagnose = this.getNestedProperty(
          this.jaw,
          'jawDiagnose',
          toothId,
          location,
        );
        const defaultLocation = !this.defaultLocations[location];

        let hide = defaultLocation;
        if (this.preferj === 'anamnes') {
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
        if (this.preferj === 'treatment') {
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
        if (this.preferj === 'diagnose') {
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
        const toothClass = {};
        const toothId = this.selectedTeeth[i];

        if (this.preferj === 'anamnes') {
          if (this.jaw.jawAnamnes[toothId][location]) {
            toothClass.anamnes = true;
            return toothClass;
          }
          if (this.jaw.jawTreatment[toothId][location]) {
            toothClass.treatment = true;
            return toothClass;
          }
          if (this.jaw.jawDiagnose[toothId][location]) {
            toothClass.diagnose = true;
            return toothClass;
          }
          return toothClass;
        }
        if (this.preferj === 'diagnose') {
          if (this.jaw.jawDiagnose[toothId][location]) {
            toothClass.diagnose = true;
            return toothClass;
          }
          if (this.jaw.jawTreatment[toothId][location]) {
            toothClass.treatment = true;
            return toothClass;
          }
          if (this.jaw.jawAnamnes[toothId][location]) {
            toothClass.anamnes = true;
            return toothClass;
          }
          return toothClass;
        }
        if (this.preferj === 'treatment') {
          if (this.jaw.jawTreatment[toothId][location]) {
            toothClass.treatment = true;
            return toothClass;
          }
          if (this.jaw.jawAnamnes[toothId][location]) {
            toothClass.anamnes = true;
            return toothClass;
          }
          if (this.jaw.jawDiagnose[toothId][location]) {
            toothClass.diagnose = true;
            return toothClass;
          }
          return toothClass;
        }
        return toothClass;
      },
      handleResize() {
        this.windowWidth = window.innerWidth;
      },
      getDiagnose() {
        this.$emit('updateDiagonoseParams', this.diagnose);
      },
      setLocationOnLoad(location, toothId, value) {
        if (value !== undefined) {
          console.log(this.hasProp(!this.diagnose.teeth, toothId));
          if (!this.hasProp(this.diagnose.teeth, toothId)) {
            this.diagnose.teeth[toothId] = {};
          }
          this.diagnose.teeth[toothId][location] = value;
        }
      },
      setInitiallyLocations() {
        if (this.selectedTeeth.length > 0) {
          // устанавливаем локации setOnLoad локации
          const { setOnLoad } = this.selectedDiagnose;
          Object.keys(setOnLoad).forEach((location) => {
            this.selectedTeeth.forEach((toothId) => {
              if (this.hasProp(setOnLoad, location)) {
                console.log('works');
                this.setLocationOnLoad(location, toothId, setOnLoad[location]);
              }
            });
          });
          this.calculateJaw();
        }
      },
      calculateJaw() {
        const jaw = {};
        for (let i = 0; i < this.selectedTeeth.length; i += 1) {
          jaw[this.selectedTeeth[i]] = {};
          Object.keys(this.defaultLocations).forEach((key) => {
            jaw[this.selectedTeeth[i]][key] = {
              hide: this.isHidingLocation(i, key),
              class: this.preferableJawClasses(i, key),
            };
          });
        }
        // console.log(jaw);
        this.getDiagnose();
        this.jawComputed = jaw;
      },
    },

    computed: {
      jawListWidth() {
        if (this.windowWidth < 600) {
          return (this.windowWidth / 100) * 80 - 40;
        }
        return Math.round((this.windowWidth / 100) * 80 - 70);
      },
      jawSVG() {
        const jawVG = JSON.parse(jawSVGjs);
        return jawVG;
      },
      preferLocal: {
        // геттер:
        get() {
          return this.prefer;
        },
        // сеттер:
        set(newValue) {
          this.preferj = newValue;
        },
      },
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      this.diagnose.id = this.selectedDiagnose.id;
      this.diagnose.author = this.selectedDiagnose.author;
      this.diagnose.view = this.selectedDiagnose.view;
      this.diagnose.locations = this.selectedDiagnose.locations;
      this.diagnose.explain = this.selectedDiagnose.explain;
      this.diagnose.type = this.selectedDiagnose.type;
      this.diagnose.code = this.selectedDiagnose.code;
      this.diagnose.title = this.selectedDiagnose.title;
      this.setInitiallyLocations();
    },
  };
</script>

<style lang="scss"  >
.jaw-list-wrapper {
  .md-toolbar {
    .error {
      color: red;
    }
    .dropdown-menu li {
      padding: 0px 0px 0px 16px;
    }
    .jaw-settings {
      max-width: 300px;
    }
  }

  .jaw-list-container {
    overflow-y: auto;
    overflow-x: auto;
    margin: 0;
    padding: 20px 0 20px 0;

    // overflow: -webkit-paged-x;
    &::-webkit-scrollbar {
      height: 7px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 20px;
    }
    .jaw {
      margin: 0 !important;
      padding-top: 10px !important;
      padding-bottom: 10px !important;

      display: flex;
      flex-direction: column;
      // padding: 15px;
      border-radius: 5px;

      .jaw-list {
        max-height: 42vh;
        min-height: 200px;
        display: flex;
        .tooth {
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
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

            // .rootCanal {
            //   fill: #3535ed;
            // }
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
              cursor: pointer;
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
              cursor: pointer;
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

            // .periodontit {
            //   fill: #3535ed;
            // }

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
      // }
    }
  }
}
</style>
