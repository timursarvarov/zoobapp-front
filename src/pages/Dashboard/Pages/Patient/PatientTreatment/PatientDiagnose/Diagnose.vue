<template lang="html">
  <div class="md-layout md-gutter">
      <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="md-layout-item" ref="wrjaw">
          <jaw
            :selectedTeeth="selectedTeeth"
            @onSelectedTeeth='onSelectedTeeth'
            @showToothInfo='showToothInfo'
            :jaw="jaw"
            :patientItems="patient.diagnosis"
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            type="diagnosis"
            >
            <div slot="bottom">
            </div>
          </jaw>
        </div>
      </div>
      <div class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50">
        <t-collapse-search
          :style="[{'max-height': jawHeight + 'px'}]" class=" md-layout-item md-size-100 set-procedure-form md-small-size-100 md-xsmall-size-100 md-size-50"
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
          v-if="showAddDiagnoseWizard"
          @on-created='saveDiagnose'
          :selectedTeeth="selectedTeeth"
          :selectedDiagnose="selectedDiagnoseLocal"
          :jaw='jaw'
          :teethSchema="teethSchema"
          :teethSystem="currentClinic.teethSystem"
          :isDialogVisible.sync="showAddDiagnoseWizard"
          />

          <t-tooth-Items
          v-if="showToothDiagnosis"
          :showForm.sync="showToothDiagnosis"
          :toothId = "toothIdforDiagnosis"
          :patientItems = "this.patient.diagnosis"
          :originalItems = "diagnosis"
          :teethSchema="teethSchema"
          :teethSystem="currentClinic.teethSystem"
          :jaw='jaw'
          classType="diagnose"
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
    import { TCollapseSearch, TToothItems, Jaw } from '@/components';
    import DiagnoseList from './DiagnoseList.vue';
    import JawAddDiagnoseWizard from './JawAddDiagnoseWizard.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TCollapseSearch,
            Jaw,
            TToothItems,
            DiagnoseList,
            JawAddDiagnoseWizard,
        },
        data() {
            return {
                showToothDiagnosis: false,
                showAddDiagnoseWizard: false,
                jawHeight: 0,
                toothIdforDiagnosis: 0,
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
            showToothInfo(toothId) {
                this.toothIdforDiagnosis = toothId;
                this.showToothDiagnosis = true;
            },
            setFavoriteDiagnose(diagnose) {
                const index = this.favoriteDiagnosis.findIndex(
                    d => d === diagnose.code,
                );
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
                    if (
                        !this.isEmpty(diagnose.locations)
                        && this.selectedTeeth.length === 0
                    ) {
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
                        this.showAddDiagnoseWizard = true;
                    }
                }
            },
            matchHeight() {
                if (this.$refs.wrjaw) {
                    this.jawHeight = this.$refs.wrjaw.clientHeight;
                }
            },
            recalculateJawDiagnose() {
                console.log(this.jawEthalon.diagnosis, this.jaw.diagnosis);
                if (this.jawEthalon.diagnosis) {
                    this.jaw.diagnosis = JSON.parse(
                        JSON.stringify(this.jawEthalon.diagnosis),
                    );
                    this.patient.diagnosis.forEach((diagnose) => {
                        if (diagnose.showInJaw) {
                            Object.keys(diagnose.teeth).forEach((toothId) => {
                                Object.keys(diagnose.teeth[toothId]).forEach(
                                    (kLocation) => {
                                        this.jaw.diagnosis[toothId][kLocation] = diagnose.teeth[toothId][kLocation];
                                    },
                                );
                            });
                        }
                    });
                }
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
            this.$nextTick(() => {
                this.matchHeight();
            });
        },
    };
</script>
<style lang="scss">
.set-diagnose-form {
    .diagnose-code {
        margin-right: 24px;
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
