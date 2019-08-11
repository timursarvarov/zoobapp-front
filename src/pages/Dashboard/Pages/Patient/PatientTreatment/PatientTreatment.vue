<template lang="html">
  <div class="md-layout md-gutter set-diagnose-form">
    <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="mx-auto" style="flex-grow:1;">
            <jaw
                :selectedTeeth="selectedTeeth"
                @onSelectedTeeth='onSelectedTeeth'
                @showToothInfo='showToothInfo'
                @toggleItemVisibility='toggleItemVisibility'
                @onChangeAgeCategory='onChangeAgeCategory'
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
                        <!-- <md-tabs md-sync-route  class="t-md-tabs">
                            <md-tab id="tab-home"
                                :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/procedures`"
                                md-label="Procedures"></md-tab>
                            <md-tab id="tab-pages"
                                :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/diagnoses`"
                            md-label="Diagnoses"></md-tab>
                            <md-tab :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/anamnes`"
                            id="tab-posts" md-label="Anamnes"></md-tab>
                        </md-tabs> -->
                            <div class="md-layout">
                                <div class="md-layout-item">
                                <md-button
                                    @click.stop="currentType = 'procedures'"
                                    class=" md-sm"
                                    :class="[
                                        {'md-success' : currentType === 'procedures' },
                                        {'md-simple' :  currentType !== 'procedures' }
                                        ]">
                                        procedure
                                </md-button>
                                <md-button
                                    @click.stop="currentType = 'diagnosis'"
                                    class=" md-sm"
                                    :class="[
                                        {'md-primary' : currentType === 'diagnosis' },
                                        {'md-simple' :  currentType !== 'diagnosis' }
                                        ]" >
                                        diagnose
                                </md-button>
                                <md-button
                                    @click.stop="currentType = 'anamnesis'"
                                    class=" md-sm"
                                    :class="[
                                        {'md-info' : currentType === 'anamnesis' },
                                        {'md-simple' :  currentType !== 'anamnesis' }
                                        ]" >
                                        anamnes
                                </md-button>
                            </div>
                        </div>
                    </template>
                </jaw>
        </div>
    </div>
    <patient-items-search
        class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50"
        :customHeight="jawHeight"
        :selectedTeeth="selectedTeeth"
        :currentType="currentType"
        :recalculateItems="recalculateCollapseItems"
        :currentPlan="patient.currentPlan || {}"
        :loadingAllPLans="loadingAllPLans"
        @addPlan="addPlan"
        @onSelectItem="selectItem"
    />
    <div class="md-layout-item  md-size-100" >
        <patient-items-lists
            ref='items-lists'
            :currentType="currentType"
            :ageCategory="ageCategory"
            :plans="patient.plans"
            @onChangeTab="onChangeTab"
            @toggleItemVisibility='toggleItemVisibility'
            @showItemInfo='selectItem'
            @onLoadingAllPlans="onLoadingAllPlans"
        />
    </div>

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
            @onLoadingAllPlans="onLoadingAllPlans"
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
        PATIENT_ITEM_VISIBILITY_TOGGLE,
        PATIENT_DIAGNOSE_UPDATE,
        PATIENT_PROCEDURE_SET,
        PATIENT_ANAMNES_UPDATE,
        PATIENT_ANAMNES_SET,
        PATIENT_PROCEDURE_UPDATE,
    } from '@/constants';
    import PlanAddForm from './PlanAddForm.vue';
    import components from '@/components';
    import PatientItemsLists from './PatientItemsLists/PatientItemsLists.vue';
    import PatientItemsSearch from './PatientItemsSearch.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            PatientItemsSearch,
            PatientItemsLists,
            PlanAddForm,
            ...components,
        },
        data() {
            return {
                currentType: 'procedures',
                focusedPlanID: null,
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
                ageCategory: 'adultTeeth',
            };
        },
        methods: {
            onChangeAgeCategory(c) {
                this.ageCategory = c || 'adultTeeth';
                this.onRecalculateCollapseItems();
            },
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
            onChangeTab(planID) {
                this.focusedPlanID = planID;
                this.recalculateJawProcedure();
            },
            editItem(item) {
                if (!this.isEmpty(item.teeth)) {
                    this.selectedTeeth = Object.keys(item.teeth);
                }
                this.selecteditemLocal = item;
                this.showAddItemWizard = true;
            },
            toggleItemVisibility(itemId, itemType) {
                if (itemId) {
                    this.$store.dispatch(PATIENT_ITEM_VISIBILITY_TOGGLE, {
                        params: {
                            itemId,
                            type: itemType,
                            planId: this.patient.currentPlan.ID,
                        },
                    });
                }
                this.recalculateJaw(itemType);
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
            onLoadingAllPlans(isLoading) {
                this.loadingAllPLans = isLoading;
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
                        jaw;
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
                                                ] =                                                diagnose.teeth[toothId][
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
                                                    ] =                                                    procedure.teeth[toothId][
                                                            kLocation
                                                        ];
                                                }
                                            } else {
                                                this.jaw.procedures[toothId][
                                                    kLocation
                                                ] =                                                procedure.teeth[toothId][
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
        watch: {
            'patient.currentPlan': function (plan) {
                console.log(plan);
                if (plan) {
                    const rec = new Promise((resolve) => {
                        this.recalculateJawProcedure();
                    });
                    rec;
                }
            },
        },
    };
</script>
