<template lang="html">
  <div class="md-layout md-gutter">
      <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="md-layout-item" ref="wrjaw">
          <jaw
            :selectedTeeth="selectedTeeth"
            @onSelectedTeeth='onSelectedTeeth'
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
        {{jawHeight}}
        <t-collapse-search
          :style="[{'max-height': jawHeight + 'px'}]" class=" md-layout-item md-size-100 set-treatment-form md-small-size-100 md-xsmall-size-100 md-size-50"
          :items = "diagnosis"
          :selectedTeeth = "selectedTeeth"
          :favoriteItems = "favoriteDiagnosis"
          itemType = "Diagnosis"
          :jawHeight = "jawHeight"
          @onSetFavoritem = "setFavoriteDiagnose"
          @onSelected = "selectDiagnose"
          />
      </div>

      <div class="md-layout-item md-layout md-size-100" >
        <diagnose-list
        @onJawChanged="recalculateJawDiagnose()"
        :teethSystem="currentClinic.teethSystem"
        class="md-layout-item  md-size-100"
        ></diagnose-list>
        </div>
      <div class="md-layout-item md-layout md-size-100" >

        <jaw-add-diagnose-wizard
          v-if="showForm"
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
      DIAGNOSIS,
    } from '@/constants';
    import { mapGetters } from 'vuex';
    import { TCollapseSearch, Jaw } from '@/components';
    import DiagnoseList from './DiagnoseList.vue';
    import JawAddDiagnoseWizard from './JawAddDiagnoseWizard.vue';
    import { tObjProp } from '@/mixins';

    export default {
      mixins: [tObjProp],
      components: {
        TCollapseSearch,
        Jaw,
        DiagnoseList,
        JawAddDiagnoseWizard,
      },
      beforeRouteUpdate(to, from, next) {
        this.matchHeight();
      },
      data() {
        return {
          isFormVisible: false,
          showForm: false,
          jawHeight: 0,
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
        },
        onSelectedTeeth(teeth) {
          this.selectedTeeth = teeth;
        },
        saveDiagnose(d) {
          const diagnoseL = this.copyObj(d);
          diagnoseL.date = new Date();
          diagnoseL.author = {
            ID: this.user.ID,
            avatar: this.user.avatar,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
          };
          diagnoseL.showInJaw = true;
          diagnoseL.id = Math.random();
          this.$store.dispatch(PATIENT_DIAGNOSE_SET, {
            diagnose: diagnoseL,
          });
          this.selectedTeeth = [];
          this.recalculateJawDiagnose();
        },
        selectDiagnose(diagnose) {
          if (diagnose) {
            if (!this.isEmpty(diagnose.locations) && this.selectedTeeth.length === 0) {
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
        matchHeight() {
          if (this.$refs.wrjaw) {
            console.log('calculated');
            this.jawHeight = this.$refs.wrjaw.clientHeight;
          }
        },
        recalculateJawDiagnose() {
          this.jaw.jawDiagnose = JSON.parse(
            JSON.stringify(this.jawEthalon.jawDiagnose),
          );
          this.patient.diagnosis.forEach((diagnose) => {
            if (diagnose.showInJaw) {
              Object.keys(diagnose.teeth).forEach((toothId) => {
                Object.keys(diagnose.teeth[toothId]).forEach((kLocation) => {
                  this.jaw.jawDiagnose[toothId][kLocation] = diagnose.teeth[toothId][kLocation];
                });
              });
            }
          });
        },
      },
      updated() {
        this.$nextTick(() => {
          this.matchHeight();
        });
      },
      destroyed() {
        window.removeEventListener('resize', this.matchHeight);
      },
      computed: {
        ...mapGetters({

          jaw: 'jaw',
          jawEthalon: 'jawEthalon',
          patient: 'getPatient',
          favoriteDiagnosis: 'favoriteDiagnosis',
          teethSchema: 'teethSchema',
          currentClinic: 'getCurrentClinic',
          user: 'getProfile',
        }),
        diagnosis() {
          return DIAGNOSIS;
        },


      },
      mounted() {
        window.addEventListener('resize', this.matchHeight);
        this.matchHeight();
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
    .md-list {
      .md-list-item {
        margin: 0;
      }
      background-color: #f7f7f7d5;
      border-style: solid;
      border-color: #eeecec9c;
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
