<template lang="html">


  <div class="md-layout">
      <div  ref="jawWrapper" class="md-layout-item  md-small-size-100 md-xsmall-size-100 md-size-50">
        <jaw
          v-model="selectedTeeth"
          :jaw="jaw"
          :prefer = "'diagnose'"
          >
          <div slot="bottom">
          </div>
        </jaw>
      </div>
      <div class="md-layout-item   md-small-size-100 md-xsmall-size-100  md-size-50">
        <div class="set-diagnose-form md-small-size-100 md-xsmall-size-100 md-size-50">
          <div class="md-layout">
              <md-checkbox class="md-layout-item" v-model="toggleAll" :disabled='search.length > 0' >Show all</md-checkbox>
            <md-field class="md-layout-item">
              <label>Type to search diagnose</label>
              <md-input v-model="search"  > </md-input>
               <slide-y-down-transition>
                 <md-button @click="search = ''"  v-show="search.length > 0" class="md-simple md-icon-button md-dense md-input-action ">
                  <md-icon :style="{ color: getDiagnosis.length === 0 ? '#9c27b0 !important': '' }"
                  >close</md-icon>
               </md-button>
               </slide-y-down-transition>

            </md-field>
          </div>

            <div class="collapse-wrapper" :style="{height: matchHeight()+'px'}" >
              <collapse
                    :collapse="diagnosisGroup"
                    icon="keyboard_arrow_down"
                    color-collapse="primary"
                    :toggleAll = "getToggleAll"
                  >

                <template  v-for="(diagnoseGroup, key) in getDiagnosis" :slot="'md-collapse-pane-'+(parseInt(key) + 1)" >
                  <div   :key="key">
                    <md-list class=" md-dense" >
                        <md-list-item  :class="[{dental:  diagnose.type == 'dental' && selectedTeeth.length == 0 }]" v-ripple v-for="(diagnose, keyd) in diagnoseGroup.codes" :key="keyd" >


                          <div class="diagnose-code" >
                            <h6  v-html="diagnose.code"></h6>
                          </div>

                          <div class="md-list-item-text" @click="selectDiagnose(diagnose)" >

                            <span  v-html="diagnose.title"></span>
                            <small class="description text-warning" v-if="diagnose.type == 'dental' && selectedTeeth.length == 0" > Please firstly choose a tooth  </small>
                            <small class="description" v-else  v-html="diagnose.explain">Horizontal Tabs</small>

                          </div>

                          <md-button  :md-ripple="false" class="md-simple md-list-action md-icon-button">
                            <md-icon class="md-primary">star</md-icon>
                          </md-button>

                        </md-list-item>
                      </md-list>
                      </div>
                </template>
              </collapse>
              <md-empty-state
              v-if="getDiagnosis.length == 0"
              class="md-primary"
              md-icon="sentiment_dissatisfied"
              md-label="No matching diagnosis"
              md-description="Try another search params">
            </md-empty-state>
            </div>
          </div>
      </div>
          <jaw-add-diagnose
          v-if="newDiagnoseParams.showForm"
           v-model="newDiagnoseParams"
           :selectedTeeth="selectedTeeth"
           :selectedDiagnose="selectedDiagnoseLocal"
           :jaw='jaw'
           ></jaw-add-diagnose>
            <diagnose-list
          :diagnosis="patient.diagnosis"
        ></diagnose-list>

  </div>

</template>

<script>
  import { NOTIFY, PATIENT_DIAGNOSE_SET } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';
  import { SlideYDownTransition } from 'vue2-transitions';
  import { Collapse, Jaw, JawAddDiagnose } from '@/components';
  import Fuse from 'fuse.js';
  import DiagnoseList from './DiagnoseList.vue';

  const fuseOptions = {
    findAllMatches: true,
    include: ['score', 'matches'],
    includeMatches: true,
    threshold: 0.5,
    location: 0,
    distance: 3,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      {
        name: 'title',
        weight: 0.1,
      },
      {
        name: 'explain',
        weight: 0.9,
      },
      {
        name: 'code',
        weight: 0.2,
      },
    ],
  };

  export default {
    components: {
      Collapse,
      Jaw,
      SlideYDownTransition,
      JawAddDiagnose,
      DiagnoseList,
    },
    props: {
      selectedDiagnose: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        newDiagnoseParams: {
          showForm: false,
          diagnose: {},
          saveDiagnose: false,
        },
        showSelectedToothDialog: false,
        search: '',
        searched: [],
        selectedTeeth: [],
        firstTabs: [],
        toggleAll: false,

        fuse: false,
        filter: {},
        diagnoseOriginal: [],
        users: [],
        selectedDiagnoseLocal: {},
      };
    },
    methods: {
      matchHeight() {
        let height = '';
        if (this.$refs.jawWrapper) {
          height = this.$refs.jawWrapper.clientHeight;
        }
        return height;
      },
      Implant() {
        for (let index = 0; index < this.selectedTeeth.length; index += 1) {
          this.jaw.jawDiagnose[this.selectedTeeth[index]].implant = true;
          this.jaw.jawDiagnose[this.selectedTeeth[index]].root = false;
        }
      },
      selectDiagnose(diagnose) {
        if (diagnose) {
          if (diagnose.type === 'dental' && this.selectedTeeth.length === 0) {
            this.$store.dispatch(NOTIFY, {
              settings: {
                message: 'Please first select teeth',
                cplor: 'warnning',
              },
            });
          } else {
            Object.values(this.diagnosis).forEach((group) => {
              group.codes.forEach((diagnoseOrigin) => {
                if (diagnoseOrigin.code === diagnose.constCode) {
                  this.selectedDiagnoseLocal = diagnoseOrigin;
                }
              });
            });
            this.newDiagnoseParams.showForm = true;
          }
        }
      },
      copyObj(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      loadData() {
        this.searched = this.copyObj(this.diagnosis);
        Object.values(this.searched).forEach((group) => {
          group.codes.forEach((diagnose) => {
            // eslint-disable-next-line
          diagnose.constCode = this.copyObj(diagnose.code).slice(0);
          });
        });
        this.diagnoseOriginal = this.copyObj(this.searched);
        this.fuse = new Fuse(this.diagnosis, fuseOptions);
      },
      namespace(object, path) {
        return path.split('.').reduce((value, index) => value[index], object);
      },
      setValue(object, path, newValue) {
        const paths = path.split('.');
        let count = 0;
        // eslint-disable-next-line
      paths.reduce((value, index) => {
          count += 1;
          if (count >= paths.length) {
            // eslint-disable-next-line
          value[index] = newValue;
          } else {
            const nValue = value[index];
            return nValue;
          }
        }, object);
      },
      highlightText(sourceString, startIndex, endIndex) {
        return `${sourceString.substring(
          0,
          startIndex,
        )}<span class="highlight">${sourceString.substring(
          startIndex,
          endIndex + 1,
        )}</span>${sourceString.substring(endIndex + 1)}`;
      },
      getFilteredDiagnosis() {
        this.searched = this.copyObj(this.diagnoseOriginal).slice(0);
        const grooup = [];
        this.searched.forEach((diagnosisGroupe) => {
          const fuseResults = new Fuse(diagnosisGroupe.codes, fuseOptions).search(
            this.search,
          );
          const results = [];
          if (fuseResults.length > 0) {
            Object.values(fuseResults).forEach((result) => {
              result.matches.forEach((match) => {
                let text = this.namespace(result.item, match.key);
                if (text) {
                  let offset = 0;

                  match.indices.forEach((index) => {
                    text = this.highlightText(
                      text,
                      index[0] + offset,
                      index[1] + offset,
                    );
                    offset += 31;
                  });
                  this.setValue(result.item, match.key, text);
                }
              });
              results.push(result.item);
            });

            if (results.length > 0) {
              grooup.push({
                code: diagnosisGroupe.code,
                title: diagnosisGroupe.title,
                codes: results,
              });
            }
          }
        });
        return grooup;
      },
      setDiagnosisToJaw() {
        // console.log(1);
        // Object.keys(this.jaw.jawDiagnose).forEach((toothId) => {
        //   console.log(toothId);
        //   Object.keys(this.jaw.jawDiagnose[toothId]).forEach((kLocation) => {
        //     console.log(kLocation);
        //     this.jaw.jawDiagnose[toothId][kLocation] = undefined;
        //   });
        // });
        console.log(this.jawEthalon.jawDiagnose);
        this.jaw.jawDiagnose = JSON.parse(
          JSON.stringify(this.jawEthalon.jawDiagnose),
        );
        for (let i = 0; i < this.patient.diagnosis.length; i += 1) {
          const diagnose = this.patient.diagnosis[i];
          Object.keys(diagnose.teeth).forEach((toothId) => {
            Object.keys(diagnose.teeth[toothId]).forEach((kLocation) => {
              // eslint-disable-next-line
            this.jaw.jawDiagnose[toothId][kLocation] =
                diagnose.teeth[toothId][kLocation];
            });
          });
        }
      },
    },
    computed: {
      ...mapGetters({
        diagnosis: 'getDiagnosis',
        jaw: 'jaw',
        jawEthalon: 'jawEthalon',
        patient: 'getPatient',
      }),
      saveDiagnose() {
        return this.newDiagnoseParams.saveDiagnose;
      },
      patientDiagnosis() {
        return this.patient.diagnosis;
      },
      filteredDiagnosis() {
        return this.getFilteredDiagnosis();
      },
      getToggleAll() {
        if (this.search || this.toggleAll) {
          return true;
        }
        return this.toggleAll;
      },
      getDiagnosis() {
        return this.search === '' ? this.searched : this.filteredDiagnosis;
      },

      diagnosisGroup() {
        const dGroup = [];
        this.getDiagnosis.forEach((element) => {
          dGroup.push(`${element.code}    ${element.title}`);
        });
        return dGroup;
      },
    },
    mounted() {
      this.loadData();
      this.searched = this.copyObj(this.diagnoseOriginal);
    },
    watch: {
      saveDiagnose() {
        if (this.saveDiagnose) {
          this.$store.dispatch(PATIENT_DIAGNOSE_SET, {
            diagnose: this.newDiagnoseParams.diagnose,
          });
          this.newDiagnoseParams.saveDiagnose = false;
        }
      },
      patientDiagnosis() {
        this.setDiagnosisToJaw();
      },
    },
  };
</script>
<style lang="scss">
.set-diagnose-form {
  .diagnose-code {
    margin-right: 24px;
  }
  .collapse-wrapper {
    margin: 20px 0 20px 0;
    overflow: hidden;
    overflow-y: scroll;
    max-height: 40vh;
    min-height: 30vh;
    padding-right: 10px;
    &::-webkit-scrollbar {
      width: 7px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 7px;
    }
    .md-collapse-label {
      padding: 0px 10px 25px 0;
      overflow: hidden;
      .md-collapse-title {
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 25px;
        .md-icon {
          top: 0;
        }
      }
    }
    md-error .md-collapse-label:after {
      bottom: 6px;
    }

    .highlight {
      background-color: rgba(255, 255, 21, 0.979);
    }
    .md-list-item-content {
      max-height: 64px;
      min-height: 44px;
      height: 44px;
      padding: 8px;
    }
    .dental {
      .md-list-item-text {
        cursor: not-allowed;
      }
    }
    .md-list-item-text {
      cursor: pointer;
    }
    .md-list-action {
      padding-right: 10px;
    }
  }
  .noresult {
    color: red !important;
  }
  .md-checkbox {
    padding-top: 7px;
  }
}
</style>
