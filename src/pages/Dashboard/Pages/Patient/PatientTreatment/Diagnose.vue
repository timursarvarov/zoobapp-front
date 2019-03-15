<template lang="html">


  <div class="md-layout md-gutter">
      <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="md-layout-item" ref="wrjaw">
          <jaw
            v-model="selectedTeeth"

            :jaw="jaw"
            :patientDiagnosis="patient.diagnosis"
            :prefer="'diagnose'"
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            >
            <div slot="bottom">
            </div>
          </jaw>
        </div>
      </div>
      <div class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50">
        <div :style="[{'max-height': jawHeight + 'px'}]" class=" md-layout-item md-size-100 set-diagnose-form md-small-size-100 md-xsmall-size-100 md-size-50">
            <md-toolbar class="md-transparent">

              <md-field class="md-layout-item ml-auto md-size-50">
                <label>Type to search diagnose</label>
                <md-input v-model="search"  > </md-input>
                <slide-y-down-transition>
                  <md-button @click="search = ''"  v-show="search.length > 0" class="md-simple md-icon-button md-dense md-input-action ">
                    <md-icon :style="{ color: getDiagnosis.length === 0 ? '#9c27b0 !important': '' }"
                    >close</md-icon>
                </md-button>
                </slide-y-down-transition>
              </md-field>
              <span>
                <md-checkbox v-model="toggleAll" :disabled='search.length > 0' ></md-checkbox>
                <md-tooltip>Open all groups</md-tooltip>
              </span>
            </md-toolbar>

            <div class="collapse-wrapper md-layout md-gutter"  :style="[{'max-height': jawHeight - 120 + 'px'}]" >
              <collapse
              class="md-layout-item md-size-100"
                    :collapse="diagnosisGroup"
                    icon="keyboard_arrow_down"
                    color-collapse="primary"
                    :toggleAll = "getToggleAll"
                  >

                <template  v-for="(diagnoseGroup, key) in getDiagnosis" :slot="'md-collapse-pane-'+(parseInt(key) + 1)" >
                  <div   :key="key">
                    <md-list class=" md-dense" >
                        <md-list-item  @click="diagnoseClick($event, diagnose)"
                        :class="[{dental: diagnose.type == 'dental' && selectedTeeth.length == 0 }]"
                        class="item"
                        v-ripple v-for="(diagnose, keyd) in diagnoseGroup.codes" :key="keyd" >


                          <div class="diagnose-code" >
                            <h6  v-html="diagnose.code"></h6>
                          </div>

                          <div class="md-list-item-text" >

                            <span  v-html="diagnose.title"></span>
                            <small class="description text-warning" v-if="diagnose.type == 'dental' && selectedTeeth.length == 0" > Please firstly choose a tooth  </small>
                            <small class="description" v-else  v-html="diagnose.explain">Horizontal Tabs</small>

                          </div>

                          <md-button  :class="[{'md-primary' : isFavorite(diagnose)}, 'md-simple', 'md-list-action', 'md-icon-button']"   :md-ripple="false" >
                            <md-icon >star</md-icon>
                            <md-tooltip  md-delay="700">Add to Favorite</md-tooltip>
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

      <div class="md-layout-item md-layout md-size-100" >
        <diagnose-list
        :teethSystem="currentClinic.teethSystem"
        class="md-layout-item  md-size-100"
        ></diagnose-list>
        </div>
      <div class="md-layout-item md-layout md-size-100" >

        <jaw-add-diagnose-wizard
          @on-created='saveDiagnose'
          :selectedTeeth="selectedTeeth"
          :selectedDiagnose="selectedDiagnoseLocal"
          :jaw='jaw'
          :teethSchema="teethSchema"
          :teethSystem="currentClinic.teethSystem"
          :isDialogVisible.sync="showForm"
          />

        </div>
  </div>

</template>

<script>
  import {
    NOTIFY,
    PATIENT_DIAGNOSE_SET,
    USER_SET_PARAM,
  } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';
  import { SlideYDownTransition } from 'vue2-transitions';
  import { Collapse, Jaw, JawAddDiagnose } from '@/components';
  import Fuse from 'fuse.js';
  import DiagnoseList from './DiagnoseList.vue';
  import JawAddDiagnoseWizard from './JawAddDiagnoseWizard.vue';

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
      JawAddDiagnoseWizard,
    },
    props: {
      selectedDiagnose: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        isFormVisible: false,
        showForm: false,
        jawHeight: 0,
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
      saveDiagnose(d){
        console.log(d)
        let diagnose = d;
        diagnose.author= {
          ID: this.user.ID,
          avatar: this.user.avatar,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
        }
        diagnose.id = Math.random();
       this.$store.dispatch(PATIENT_DIAGNOSE_SET, {
            diagnose: diagnose,
          });
      },
      toggleFormVisible(value) {
        this.isFormVisible = value;
      },
      isFavorite(diagnose) {
        if (this.favoriteDiagnosis.includes(diagnose.code)) {
          return true;
        }
        return false;
      },
      setFavoriteDiagnose(diagnose) {
        const index = this.favoriteDiagnosis.findIndex(d => d === diagnose.code);
        if (index === -1) {
          this.favoriteDiagnosis.unshift(diagnose.code);
        } else {
          this.favoriteDiagnosis.splice(index, 1);
        }
        this.$store.dispatch(USER_SET_PARAM, {
          type: 'favoriteDiagnosis',
          value: this.favoriteDiagnosis,
        });
        this.loadData();
      },
      Implant() {
        for (let index = 0; index < this.selectedTeeth.length; index += 1) {
          this.jaw.jawDiagnose[this.selectedTeeth[index]].implant = true;
          this.jaw.jawDiagnose[this.selectedTeeth[index]].root = false;
        }
      },
      diagnoseClick(event, diagnose) {
        if (event.target.classList.contains('md-icon')) {
          this.setFavoriteDiagnose(diagnose);
        } else {
          this.selectDiagnose(diagnose);
        }
      },
      selectDiagnose(diagnose) {
        if (diagnose) {
          if (diagnose.type === 'dental' && this.selectedTeeth.length === 0) {
            this.$store.dispatch(NOTIFY, {
              settings: {
                message: 'Please first select teeth',
                type: 'warning',
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
            this.showForm = true;
          }
        }
      },
      copyObj(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      matchHeight() {
        if (this.$refs.wrjaw) {
          this.jawHeight = this.$refs.wrjaw.clientHeight;
        }
      },
      loadData() {
        this.unshiftFavoriteDiagnosis();
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
      unshiftFavoriteDiagnosis() {
        const favoriteDiagnosis = {
          code: '★',
          codes: [],
          title: 'Favorite Diagnosis',
        };
        if (this.favoriteDiagnosis.length > 0) {
          this.favoriteDiagnosis.forEach((fDiagnose) => {
            Object.values(this.diagnosis).forEach((group) => {
              let favoriteD = null;
              if (group.codes && group.code != '★') {
                favoriteD = group.codes.find(
                  diagnose => diagnose.code === fDiagnose,
                );
              }
              if (favoriteD) {
                favoriteDiagnosis.codes.push(favoriteD);
              }
            });
          });
        }
        if (favoriteDiagnosis.codes.length > 0) {
          const favoriteIndex = this.diagnosis.findIndex(
            diagnose => diagnose.code === '★',
          );
          if (favoriteIndex === -1) {
            this.diagnosis.unshift(favoriteDiagnosis);
          } else {
            this.diagnosis.splice(favoriteIndex, 1, favoriteDiagnosis);
          }
        } else {
          const favoriteIndex = this.diagnosis.findIndex(
            diagnose => diagnose.code === '★',
          );
          this.diagnosis.splice(favoriteIndex, 1);
        }
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
    updated() {
      this.$nextTick(function () {
        this.matchHeight();
      });
    },
     destroyed() {
      window.removeEventListener('resize', this.matchHeight)
    },
    computed: {
      ...mapGetters({
        diagnosis: 'getDiagnosis',
        jaw: 'jaw',
        jawEthalon: 'jawEthalon',
        patient: 'getPatient',
        favoriteDiagnosis: 'favoriteDiagnosis',
        teethSchema: 'teethSchema',
        currentClinic: 'getCurrentClinic',
        user: 'getProfile',
      }),
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
       window.addEventListener('resize', this.matchHeight)
      this.matchHeight();
      this.searched = this.copyObj(this.diagnoseOriginal);
    },
    watch: {
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
    border-style: solid;
    border-color: rgba(128, 128, 128, 0.212);
    border-width: 1px;
    border-radius: 3px;
    margin: 20px 0 20px 0;
    overflow: hidden;
    overflow-y: scroll;
    // max-height: 40vh;
    // min-height: 30vh;
    padding: 20px 10px 20px 10px;
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
    .md-list{
      .md-list-item {
        margin: 0
      }
      background-color: #f7f7f7d5;
      border-style: solid;
      border-color:  #eeecec9c;
      border-width: 1px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    .md-list-item-content {
      max-height: 64px;
      min-height: 44px;
      height: 44px;
      padding: 8px;
      // background-color: rgba(238, 236, 236, 0.201);
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
    margin-left: 17px;
  }
}
</style>
