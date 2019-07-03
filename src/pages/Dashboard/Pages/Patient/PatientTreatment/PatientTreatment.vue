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
                        procedures: currentPlan.procedures,
                        anamnesis: patient.anamnesis,
                        }"
                :teethSystem="currentClinic.teethSystem"
                :type="currentType"
                >
                    <template slot="title-start">
                            <div class="md-layout">
                            <div class="md-layout-item">
                            <md-button
                                @click="currentType = 'anamnesis'"
                                class="md-sm"
                                :class="[
                                    {'md-info' : currentType === 'anamnesis' },
                                    {'md-simple' :  currentType !== 'anamnesis' }
                                    ]" >
                                    anamnes
                                    </md-button>
                            <md-button
                                @click="currentType = 'diagnosis'"
                                class="md-sm"
                                :class="[
                                    {'md-primary' : currentType === 'diagnosis' },
                                    {'md-simple' :  currentType !== 'diagnosis' }
                                    ]" >
                                    diagnos
                                    </md-button>
                            <md-button
                                @click="currentType = 'procedures'"
                                class="md-sm"
                                :class="[
                                    {'md-success' : currentType === 'procedures' },
                                    {'md-simple' :  currentType !== 'procedures' }
                                    ]">
                                    procedure
                            </md-button>
                            </div>
                        </div>
                    </template>
                </jaw>
        </div>
    </div>

    <div class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50">
        <t-collapse-search
            v-show="currentType === 'anamnesis'"
                :style="[{'max-height': `${jawHeight}px`}]" class="set-procedure-form"
                :items="originalItems.anamnesis"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteItems"
                itemType="anamnesis"
                :loading="itemsLoading.anamnesis "
                :recalculateItems="recalculateCollapseItems"
                :jawHeight="jawHeight"
                :hideSlot="currentPlan.id === undefined && currentType === 'procedures'"
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
            >
        </t-collapse-search>
        <t-collapse-search
            v-show="currentType === 'diagnosis'"
                :style="[{'max-height': `${jawHeight}px`}]" class="set-procedure-form"
                :items="originalItems.diagnosis"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteItems"
                itemType="diagnosis"
                :loading="itemsLoading.diagnosis"
                :recalculateItems="recalculateCollapseItems"
                :jawHeight="jawHeight"
                :hideSlot="currentPlan.id === undefined && currentType === 'procedures'"
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
            >
        </t-collapse-search>
        <t-collapse-search
            v-show="currentType === 'procedures'"
                :style="[{'max-height': `${jawHeight}px`}]" class="set-procedure-form"
                :items="originalItems.procedures"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteItems"
                itemType="procedures"
                :loading="itemsLoading.procedures"
                :recalculateItems="recalculateCollapseItems"
                :jawHeight="jawHeight"
                :hideSlot="currentPlan.id === undefined && currentType === 'procedures'"
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
            >
                    <template slot="title-start-2">

                            <md-button
                                v-show="currentType==='procedures'"
                                key="addplan"
                                class="md-success md-simple"
                                @click="showAddPlan = true"
                            >
                                <md-icon>add</md-icon>add plan
                            </md-button>

                    </template>
                        <div   slot="empty-space">
                            <md-empty-state
                                    md-label="No created plans"
                                    md-description="To implemet a procedure, you should firstly create a plan">
                                        <md-button class="md-success md-raised" @click="showAddPlan = true">Create New Plan</md-button>
                                </md-empty-state>
                        </div>
        </t-collapse-search>
    </div>

    <div class="md-layout-item  md-size-100" >
        <items-list
            v-show="currentType === 'anamnesis' && patient.anamnesis.length > 0"
            :items="patient.anamnesis||[]"
            @showItemInfo="showItemInfo"
            @onJawChanged="recalculateJaw()"
            @toggleItemVisibility="toggleItemVisibility"
            :teethSystem="currentClinic.teethSystem"
            type="anamnesis"
            >
        </items-list>
        <items-list
            v-show="currentType === 'diagnosis' && patient.diagnosis.length > 0"
            :items="patient.diagnosis||[]"
            @showItemInfo="showItemInfo"
            @onJawChanged="recalculateJaw()"
            @toggleItemVisibility="toggleItemVisibility"
            :teethSystem="currentClinic.teethSystem"
            type="diagnosis"
            >
        </items-list>
        <t-tabs
                v-show="patient.plans.length > 0 && currentType === 'procedures' "
                @onChangeTab="onChangeTab"
                ref="tabs"
                :tab-name="Object.values(patient.plans).map(e=>e.title)"
                color-button="success"
                class="procedures-tabs"
            >
                <template
                    v-for="(plan, index) in patient.plans"
                    :slot="`tab-pane-${index+1}`"
                    >
                    <div :key="index">
                        <items-list
                            @onJawChanged="recalculateJaw()"
                            @toggleItemVisibility="toggleItemVisibility"
                            @showItemInfo="showItemInfo"
                            :teethSystem="currentClinic.teethSystem"
                            type="procedures"
                            :items="plan.procedures||[]"
                        >
                        <template v-if="plan.state === 'approved'" slot="title-start" >
                                <h4 class="title text-success">
                                    <md-icon >done</md-icon>
                                    Plan approved - <small class="description">Horizontal Tabs</small>
                                </h4>

                        </template>
                        </items-list>
                        <div class=" md-layout ml-auto">
                            <div class="ml-auto">
                                <md-button class="md-simple" >
                                    Delete plan
                                </md-button>
                                <md-button
                                    :disabled="plan.state==='approved'"
                                    class="md-success"
                                    @click="editPLanField( plan.id, 'state', 'approved')" >
                                    Approve plan
                                </md-button>
                            </div>
                        </div>
                    </div>
                </template>
        </t-tabs>
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
            @onPlanCreated="CreatePlan"
        />
        <t-print-form
            :patient="patient"
            :showForm.sync="showPrint"/>

        <t-wizard-add-item
            v-if="showAddItemWizard"
            @on-created='saveItem'
            :steps="stepsForWizard"
            :currentPlan="currentPlan"
            :selectedTeeth="selectedTeeth"
            :selectedItem="selecteditemLocal"
            :jaw='jaw'
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :isDialogVisible.sync="showAddItemWizard"
            :itemType="currentType"
            :singleItemName="singleItemName"
        />

        </div>
    </div>

</template>

<script>
    import {
        NOTIFY,
        PATIENT_DIAGNOSE_SET,
        PATIENT_TOGGLE_ITEM_VISIBILITY,
        PATIENT_DIAGNOSE_UPDATE,
        PATIENT_PLAN_EDIT,
        PATIENT_PLAN_SET,
        PATIENT_PROCEDURES_SET,
        PATIENT_ANAMNES_UPDATE,
        USER_SET_PARAM,
        PATIENT_ANAMNES_SET,
        PATIENT_PROCEDURE_UPDATE,
        LOCATIONS,
        CLINIC_DIAGNOSIS_GET,
        CLINIC_PROCEDURES_GET,
        CLINIC_SET_PROP,
    } from '@/constants';
    import PlanAddForm from './PlanAddForm.vue';
    import { mapGetters } from 'vuex';
    import {
        TCollapseSearch,
        TToothItems,
        Jaw,
        TPrintForm,
        TWizardAddItem,
        TTabs,
    } from '@/components';
    import ItemsList from './ItemsList.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TCollapseSearch,
            TTabs,
            Jaw,
            TToothItems,
            ItemsList,
            PlanAddForm,
            TPrintForm,
            TWizardAddItem,
        },
        data() {
            return {
                currentType: 'anamnesis',
                showToothDiagnosis: false,
                showAddItemWizard: false,
                showAddProcedureWizard: false,
                showAddAnamnesWizard: false,
                jawHeight: 0,
                showParams: {},
                itemIdtoShow: 0,
                search: '',
                searched: [],
                selectedTeeth: [],
                firstTabs: [],
                toggleAll: false,
                showAddPlan: false,
                recalculateCollapseItems: false,
                fuse: false,
                showPrint: false,
                filter: {},
                users: [],
                selecteditemLocal: {},
                ageCategory: 'adultTeeth',
                itemsLoading: {
                    procedures: false,
                    diagnosis: false,
                    anamnesis: false,
                },
            };
        },
        methods: {
            getItems() {
                if (
                    this.currentDiagnosis.length <= 0
                    || this.originalItems.diagnosis.length <= 0
                ) {
                    this.itemsLoading[this.currentType] = true;
                    this.$store.dispatch(CLINIC_DIAGNOSIS_GET).then(() => {
                        this.setOriginalItems(['diagnosis']);
                        this.itemsLoading[this.currentType] = false;
                    });
                }
                if (
                    this.currentProcedures.length <= 0
                    || this.originalItems.anamnesis.length <= 0
                ) {
                    this.itemsLoading.anamnesis = true;
                    this.$store.dispatch(CLINIC_PROCEDURES_GET).then(() => {
                        this.setOriginalItems(['anamnesis']);
                        this.itemsLoading.anamnesis = false;
                    });
                }
                if (
                    this.currentProcedures.length <= 0
                    || this.originalItems.procedures.length <= 0
                ) {
                    this.itemsLoading.procedures = true;
                    this.$store.dispatch(CLINIC_PROCEDURES_GET).then(() => {
                        this.setOriginalItems(['procedures']);
                        this.itemsLoading.procedures = false;
                    });
                }
            },
            onShowPrint() {
                this.showPrint = true;
            },
            onChangeTab(index) {
                this.changeCurrentPLan(this.patient.plans[index].id);
            },
            onChangeAgeCategory(category) {
                this.selectedTeeth = [];
                if (category === 'babyTeeth') {
                    this.ageCategory = 'babyTeeth';
                } else {
                    this.ageCategory = 'adultTeeth';
                }
            },
            setOriginalItems(types) {
                if (types.includes('diagnosis') && this.originalItems.diagnosis) {
                    const diagnosis = this.filterItems(
                        this.currentDiagnosis,
                        true,
                        'diagnosis',
                    );
                    this.$store.dispatch(CLINIC_SET_PROP, {
                        props: {
                            type: 'diagnosisComputed',
                            value: diagnosis,
                        },
                    });
                }
                if (
                    (types.includes('anamnesis'))
                    && this.originalItems.procedures
                ) {
                    const anamnesis = this.filterItems(
                        this.currentProcedures,
                        false,
                        'anamnesis',
                    );
                    this.$store.dispatch(CLINIC_SET_PROP, {
                        props: {
                            type: 'anamnesisComputed',
                            value: anamnesis,
                        },
                    });
                }
                if (
                    (types.includes('procedures'))
                    && this.originalItems.procedures
                ) {
                    const procedures = this.filterItems(
                        this.currentProcedures,
                        true,
                        'procedures',
                    );
                    this.$store.dispatch(CLINIC_SET_PROP, {
                        props: {
                            type: 'proceduresComputed',
                            value: procedures,
                        },
                    });
                }
                this.recalculateCollapseItems = !this.recalculateCollapseItems;
            },

            filterItems(items = [], available, type) {
                let filteredItems = [];
                let localType = type;
                if (type === 'anamnesis') {
                    localType = 'procedures';
                }
                items.forEach((item) => {
                    let groupIndex = filteredItems.findIndex(
                        el => el.code === item.categoryCode,
                    );
                    if (groupIndex === -1) {
                        groupIndex = filteredItems.push({
                            code: item.categoryCode,
                            title: this.$t(
                                `${localType}.categories.${
                                    item.categoryCode
                                }.title`,
                            ),
                            codes: [],
                        }) - 1;
                    }
                    if (
                        (type === 'anamnesis' || (item.available || !available))
                        && LOCATIONS[item.templateID].ageCategory.includes(
                            this.ageCategory,
                        )
                    ) {
                        filteredItems[groupIndex].codes.push({
                            ...LOCATIONS[item.templateID],
                            code: item.code,
                            title: this.$t(`${localType}.${item.ID}.title`),
                            description: this.$t(
                                `${localType}.${item.ID}.description`,
                            ),
                        });
                    }
                });
                filteredItems = filteredItems.filter(el => el.codes.length !== 0);
                return filteredItems;
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
                    this.$store.dispatch(PATIENT_TOGGLE_ITEM_VISIBILITY, {
                        params: {
                            itemId,
                            type: itemType,
                            planId: this.currentPlan.id,
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
            setFavoriteItems(items) {
                const index = this.favoriteItems.findIndex(d => d === items.code);
                if (this.currentType === 'diagnosis') {
                    if (index === -1) {
                        this.favoriteDiagnosis.unshift(items.code);
                    } else {
                        this.favoriteDiagnosis.splice(index, 1);
                    }
                    this.$store.dispatch(USER_SET_PARAM, {
                        type: 'favoriteDiagnosis',
                        value: this.favoriteDiagnosis,
                    });
                }
                if (this.currentType === 'anamnesis') {
                    if (index === -1) {
                        this.favoriteAnamnesis.unshift(items.code);
                    } else {
                        this.favoriteAnamnesis.splice(index, 1);
                    }
                    this.$store.dispatch(USER_SET_PARAM, {
                        type: 'favoriteAnamnesis',
                        value: this.favoriteAnamnesis,
                    });
                }
                if (this.currentType === 'procedures') {
                    if (index === -1) {
                        this.favoriteProcedures.unshift(items.code);
                    } else {
                        this.favoriteProcedures.splice(index, 1);
                    }
                    this.$store.dispatch(USER_SET_PARAM, {
                        type: 'favoriteProcedures',
                        value: this.favoriteProcedures,
                    });
                }
            },
            onSelectedTeeth(teeth) {
                this.selectedTeeth = teeth;
            },
            CreatePlan(p) {
                const planL = this.copyObj(p);
                planL.date = new Date();
                planL.author = {
                    ID: this.user.ID,
                    avatar: this.user.avatar,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                };
                planL.procedures = [];
                planL.showInJaw = true;
                planL.color = p.color;
                planL.state = '';
                planL.id = Math.random();
                this.$store.dispatch(PATIENT_PLAN_SET, {
                    plan: planL,
                });
                this.changeCurrentPLan(planL.id);
                this.focusOnTab(planL.title);
            },
            focusOnTab(name) {
                if (this.$refs.tabs) {
                    this.$refs.tabs.switchPanel(name);
                }
            },
            // selectPlan(p) {
            //     if (this.patient.plans.findIndex(plan => plan.id === p.id) > -1) {
            //         this.currentPlanId = p.id;
            //     }
            // },
            setPlanApproved() {
                const index = this.patient.plans.findIndex(p => p.state === 'approved');
                if (index > -1) {
                    this.changeCurrentPLan(this.patient.plans[index].id);
                    this.focusOnTab(this.patient.plans[index].title);
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: `Plan ${this.currentPlan.title} Approved`,
                            type: 'success',
                        },
                    });
                }
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
                        planId: this.currentPlan.id,
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
                        this.$store.dispatch(PATIENT_PROCEDURES_SET, {
                            planId: this.currentPlan.id,
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
                this.$store.dispatch(PATIENT_PROCEDURES_SET, {
                    planId: this.currentPlan.id,
                    procedure: procedureL,
                });
                this.recalculateJaw();
            },
            selectItem(item) {
                if (item) {
                    if (
                        !this.isEmpty(item.locations)
                        && this.selectedTeeth.length === 0
                    ) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please first select teeth',
                                type: 'warning',
                            },
                        });
                    } else {
                        Object.values(this.originalItems[this.currentType]).forEach(
                            (group) => {
                                group.codes.forEach((itemOrigin) => {
                                    if (itemOrigin.code === item.constCode) {
                                        this.selecteditemLocal = itemOrigin;
                                        this.showAddItemWizard = true;
                                    }
                                });
                            },
                        );
                    }
                }
            },
            matchHeight(jawHeight) {
                this.jawHeight = jawHeight;
            },
            editPLanField(planId, key, value) {
                this.$store.dispatch(PATIENT_PLAN_EDIT, {
                    planId,
                    key,
                    value,
                });
            },
            changeCurrentPLan(planId) {
                if (planId) {
                    this.patient.plans.forEach((plan) => {
                        if (plan.id !== planId && plan.showInJaw) {
                            this.editPLanField(plan.id, 'showInJaw', false);
                        }
                    });
                    this.editPLanField(planId, 'showInJaw', true);
                    this.recalculateJaw();
                }
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
                    if (this.currentPlan.procedures) {
                        this.currentPlan.procedures.forEach((procedure) => {
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
        },
        computed: {
            ...mapGetters({
                jaw: 'jaw',
                jawEthalon: 'jawEthalon',
                patient: 'getPatient',
                favoriteDiagnosis: 'favoriteDiagnosis',
                favoriteProcedures: 'favoriteProcedures',
                favoriteAnamnesis: 'favoriteAnamnesis',
                teethSchema: 'teethSchema',
                currentClinic: 'getCurrentClinic',
                user: 'getProfile',
                access_token: 'fetchStateAccessToken',
                currentProcedures: 'getCurrentProcedures',
                currentDiagnosis: 'getCurrentDiagnosis',
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
            currentItems() {
                if (this.currentType === 'procedures') {
                    return this.currentPlan.procedures;
                }
                return this.patient[this.currentType] || [];
            },
            favoriteItems() {
                if (this.currentType === 'anamnesis') {
                    return this.favoriteAnamnesis;
                }
                if (this.currentType === 'procedures') {
                    return this.favoriteProcedures;
                }
                return this.favoriteDiagnosis;
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
            currentPlan() {
                const index = this.patient.plans.findIndex(p => p.showInJaw);
                if (index > -1) {
                    return this.patient.plans[index];
                }
                return {};
            },
            itemToShow() {
                let itemToShow = {};
                if (this.showParams.type === 'procedures') {
                    itemToShow = this.currentPlan.procedures.find(
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
            this.getItems();
        },
        mounted() {
            this.setPlanApproved();
        },
        watch: {
            ageCategory() {
                this.setOriginalItems(['anamnesis', 'diagnosis', 'procedures']);
            },
            // eslint-disable-next-line func-names
            '$i18n.locale': function () {
                this.setOriginalItems(['anamnesis', 'diagnosis', 'procedures']);
            },
        },
    };
</script>
<style lang="scss">
.set-diagnose-form {
    // .md-checkbox {
    //     padding-top: 7px;
    //     margin-left: 17px;
    // }
    .tab-content > div {
        flex-grow: 1;
    }
    .md-card {
        box-shadow: none;
    }
}
</style>
