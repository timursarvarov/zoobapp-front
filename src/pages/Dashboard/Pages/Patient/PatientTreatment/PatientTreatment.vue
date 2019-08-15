<template lang="html">
  <div class="md-layout md-gutter set-diagnose-form">
    <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="mx-auto" style="flex-grow:1;">
            <jaw
                :selectedTeeth="selectedTeeth"
                :ageCategory="!!patient.ageCategory"
                @onSelectedTeeth='onSelectedTeeth'
                @showToothInfo='showToothInfo'
                @onSizeChanged='matchHeight'
                :jaw="jaw"
                :patientItems="{
                        diagnosis: patient.diagnosis,
                        procedures: patient.currentPlan ? patient.currentPlan.procedures : [],
                        anamnesis: patient.anamnesis,
                        }"
                :teethSystem="currentClinic.teethSystem"
                :type="currentType"
                >
                <template slot="title-start">
                    <md-tabs md-sync-route  class="t-md-tabs"
                        :class="currentType">
                        <md-tab id="tab-home"
                            :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/procedures`"
                            md-label="Procedures"></md-tab>
                        <md-tab id="tab-pages" class="diagnosis"
                            :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/diagnosis`"
                            md-label="Diagnoses"></md-tab>
                        <md-tab
                            :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/anamnesis`"
                        id="tab-posts" md-label="Anamnes"></md-tab>
                    </md-tabs>
                </template>
            </jaw>
        </div>
    </div>
    <keep-alive>
        <router-view
            name='search'
            class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50"
            :customHeight="jawHeight"
            :selectedTeeth="selectedTeeth"
            :recalculateItems="recalculateCollapseItems"
            :currentPlan="patient.currentPlan || {}"
            :hideSlot="!patient.currentPlan"
            @addPlan="addPlan"
            @onSelectItem="selectItem"
        />
    </keep-alive>
    <keep-alive>
        <div class="md-layout-item  md-size-100" >
            <router-view
                name='list'
                ref='items-lists'
                :currentType="currentType"
                :plans="patient.plans"
                @showItemInfo='selectItem'
            />
        </div>
    </keep-alive>

    <div class="md-layout-item md-layout md-size-100" >

            <t-tooth-items
                @editItem="editItem"
                @onPrint="onShowPrint"
                :showForm.sync="showToothDiagnosis"
                :toothId="showParams.toothId"
                :item="itemToShow"
                :patientItems="patient[showParams.type]"
                :originalItems="originalItems[showParams.type]"
                :teethSchema="teethSchema"
                :teethSystem="currentClinic.teethSystem"
                :access_token="access_token"
                :files="files"
                :jaw='jaw'
                :type="currentType"
                :currencyCode="currentClinic.currencyCode"
            />
        <plan-add-form
            :showForm.sync="showAddPlan"
            :plans="patient.plans"
            :patientId="patient.ID"
        />
        <t-print-form
            :patient="patient"
            :showForm.sync="showPrint"/>

        <t-wizard-add-item
            v-if="showAddItemWizard && patient.currentPlan"
            @on-created='saveItem'
            :steps="stepsForWizard"
            :currentPlan="patient.currentPlan"
            :selectedTeeth="selectedTeeth"
            :selectedItem="selecteditemLocal"
            :jaw='jaw'
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :isDialogVisible.sync="showAddItemWizard"
            :currentType="currentType"
            :singleItemName="singleItemName"
        />
        </div>
    </div>

</template>

<script>
    import { mapGetters } from 'vuex';
    import {
        NOTIFY,
        PATIENT_DIAGNOSE_SET,
        PATIENT_DIAGNOSE_UPDATE,
        PATIENT_PROCEDURE_SET,
        PATIENT_ANAMNES_UPDATE,
        PATIENT_ANAMNES_SET,
        PATIENT_PROCEDURE_UPDATE,
    } from '@/constants';
    import PlanAddForm from './PlanAddForm.vue';
    import components from '@/components';
    // import PatientItemsLists from './PatientItemsLists/PatientItemsLists.vue';
    // import PatientItemsSearch from './PatientItemsSearch.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            // 'patient-items-search': () => import('./PatientItemsSearch.vue'),
            // PatientItemsLists,
            PlanAddForm,
            ...components,
        },
        data() {
            return {
                currentType: 'procedures',
                showToothDiagnosis: false,
                showAddItemWizard: false,
                jawHeight: 0,
                showParams: {},
                search: '',
                selectedTeeth: [],
                showAddPlan: false,
                recalculateCollapseItems: false,
                loadingAllPLans: false,
                showPrint: false,
                selecteditemLocal: {},
            };
        },
        methods: {
            onRecalculateCollapseItems() {
                this.recalculateCollapseItems = !this.recalculateCollapseItems;
            },
            addPlan() {
                if (this.patient.plans && this.patient.plans.length >= 10) {
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'PLans limite riched (only 10 plans allowed)',
                            type: 'warning',
                        },
                    });
                } else {
                    this.showAddPlan = true;
                }
            },
            onShowPrint() {
                this.showPrint = true;
            },
            editItem(item) {
                if (!this.isEmpty(item.teeth)) {
                    this.selectedTeeth = Object.keys(item.teeth);
                }
                this.selecteditemLocal = item;
                this.showAddItemWizard = true;
            },

            showItemInfo(params) {
                this.showParams = params;
                this.showToothDiagnosis = true;
            },
            showToothInfo(params) {
                this.showParams = params;
                this.showToothDiagnosis = true;
            },
            onSelectedTeeth(teeth) {
                this.selectedTeeth = teeth;
            },
            saveEditedAnamnes(a) {
                this.$store.dispatch(PATIENT_ANAMNES_UPDATE, {
                    anamnes: a,
                });
            },
            saveEditedProcedure(p) {
                this.$store.dispatch(PATIENT_PROCEDURE_UPDATE, {
                    params: {
                        procedure: p,
                        planId: this.patient.currentPlan.ID,
                    },
                });
            },
            saveEditedDiagnose(d) {
                this.$store.dispatch(PATIENT_DIAGNOSE_UPDATE, {
                    diagnose: d,
                });
            },
            saveItem(d) {
                if (d.id) {
                    if (this.currentType === 'diagnosis') {
                        this.saveEditedDiagnose(d);
                    }
                    if (this.currentType === 'anamnesis') {
                        this.saveEditedAnamnes(d);
                    }
                    if (this.currentType === 'procedures') {
                        this.saveEditedProcedure(d);
                    }
                } else {
                    const itemL = this.copyObj(d);
                    itemL.date = new Date();
                    itemL.author = {
                        ID: this.user.ID,
                        avatar: this.user.avatar,
                        firstName: this.user.firstName,
                        lastName: this.user.lastName,
                    };
                    itemL.showInJaw = true;
                    itemL.state = 'planned';
                    itemL.id = Math.random();
                    if (this.currentType === 'diagnosis') {
                        this.$store.dispatch(PATIENT_DIAGNOSE_SET, {
                            diagnose: itemL,
                        });
                    }
                    if (this.currentType === 'anamnesis') {
                        this.$store.dispatch(PATIENT_ANAMNES_SET, {
                            anamnes: itemL,
                        });
                    }
                    if (this.currentType === 'procedures') {
                        this.$store.dispatch(PATIENT_PROCEDURE_SET, {
                            planID: this.patient.currentPlan.ID,
                            procedure: itemL,
                        });
                    }
                }
                this.recalculateJaw();
            },
            saveProcedure(p) {
                if (p.id) {
                    this.saveEditedProcedure(p);
                    return;
                }
                const procedureL = this.copyObj(p);
                procedureL.date = new Date();
                procedureL.author = {
                    ID: this.user.ID,
                    avatar: this.user.avatar,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                };
                procedureL.showInJaw = true;
                procedureL.id = Math.random();
                this.$store.dispatch(PATIENT_PROCEDURE_SET, {
                    planID: this.patient.currentPlan.ID,
                    procedure: procedureL,
                    patientID: this.patient.ID,
                });
                this.recalculateJaw();
            },
            selectItem(item) {
                if (item) {
                    this.selecteditemLocal = item;
                    this.showAddItemWizard = true;
                }
            },
            matchHeight(jawHeight) {
                this.jawHeight = jawHeight;
            },
            recalculateJaw(type) {
                const localType = type || this.currentType;
                if (localType === 'procedures') {
                    this.recalculateJawProcedure();
                    return;
                }
                if (this.jawEthalon[localType]) {
                    this.jaw[localType] = JSON.parse(
                        JSON.stringify(this.jawEthalon[localType]),
                    );
                    this.patient[localType].forEach((diagnose) => {
                        if (diagnose.showInJaw) {
                            Object.keys(diagnose.teeth).forEach((toothId) => {
                                Object.keys(diagnose.teeth[toothId]).forEach(
                                    (kLocation) => {
                                        if (
                                            kLocation
                                            in this.jaw[localType][toothId]
                                        ) {
                                            if (
                                                !diagnose.teeth[toothId][kLocation]
                                            ) {
                                                this.jaw[localType][toothId][
                                                    kLocation
                                                ] = diagnose.teeth[toothId][
                                                    kLocation
                                                ];
                                            }
                                        } else {
                                            this.jaw[localType][toothId][
                                                kLocation
                                            ] = diagnose.teeth[toothId][kLocation];
                                        }
                                    },
                                );
                            });
                        }
                    });
                }
            },
            recalculateJawProcedure() {
                if (this.jawEthalon.procedures) {
                    this.jaw.procedures = JSON.parse(
                        JSON.stringify(this.jawEthalon.procedures),
                    );
                    if (this.patient.currentPlan.procedures) {
                        this.patient.currentPlan.procedures.forEach((procedure) => {
                            if (procedure.showInJaw) {
                                Object.keys(procedure.teeth).forEach((toothId) => {
                                    Object.keys(procedure.teeth[toothId]).forEach(
                                        (kLocation) => {
                                            if (
                                                kLocation
                                                in this.jaw.procedures[toothId]
                                            ) {
                                                if (
                                                    !procedure.teeth[toothId][
                                                        kLocation
                                                    ]
                                                ) {
                                                    this.jaw.procedures[toothId][
                                                        kLocation
                                                    ] = procedure.teeth[toothId][
                                                        kLocation
                                                    ];
                                                }
                                            } else {
                                                this.jaw.procedures[toothId][
                                                    kLocation
                                                ] = procedure.teeth[toothId][
                                                    kLocation
                                                ];
                                            }
                                        },
                                    );
                                });
                            }
                        });
                    }
                }
            },
            switchType(type) {
                this.currentType = type;
            },
        },
        computed: {
            ...mapGetters({
                jaw: 'jaw',
                jawEthalon: 'jawEthalon',
                patient: 'getPatient',
                teethSchema: 'teethSchema',
                currentClinic: 'getCurrentClinic',
                user: 'getProfile',
                access_token: 'fetchStateAccessToken',
            }),
            originalItems() {
                const originalItems = {
                    anamnesis: this.currentClinic.anamnesisComputed || [],
                    diagnosis: this.currentClinic.diagnosisComputed || [],
                    procedures: this.currentClinic.proceduresComputed || [],
                };
                return originalItems;
            },
            files() {
                return this.patient.files;
            },
            stepsForWizard() {
                if (this.currentType === 'anamnesis') {
                    return ['locations', 'files', 'description'];
                }
                if (this.currentType === 'diagnosis') {
                    return ['locations', 'files', 'description'];
                }
                return [
                    'locations',
                    'manipulations',
                    'files',
                    'description',
                    'appointments',
                ];
            },
            singleItemName() {
                if (this.currentType === 'anamnesis') {
                    return 'anamnes';
                }
                if (this.currentType === 'diagnosis') {
                    return 'diagnose';
                }
                return 'procedure';
            },
            itemToShow() {
                let itemToShow = {};
                if (this.showParams.type === 'procedures') {
                    itemToShow = this.patient.currentPlan.procedures.find(
                        item => item.id === this.showParams.itemId,
                    );
                    return itemToShow;
                }
                if (this.patient[this.showParams.type]) {
                    itemToShow = this.patient[this.showParams.type].find(
                        item => item.id === this.showParams.itemId,
                    );
                }
                return itemToShow;
            },
        },
        created() {
            if (this.currenttype !== this.$route.name) {
                this.switchType(this.$route.name);
            }
        },
        watch: {
            // eslint-disable-next-line func-names
            'patient.currentPlan': function (plan) {
                if (this.patient.currentPlan && this.patient.currentPlan.ID !== plan.ID) {
                    this.recalculateJawProcedure();
                }
            },
            $route(val) {
                this.switchType(val.name);
            },
        },
    };
</script>
<style lang="scss">
</style>
