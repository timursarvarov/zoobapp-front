<template lang="html">
  <div class="md-layout md-gutter set-diagnose-form">
        <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
            <div class="mx-auto" style="flex-grow:1;" ref="wrjaw">
                <jaw
                    :selectedTeeth="selectedTeeth"
                    @onSelectedTeeth='onSelectedTeeth'
                    @showToothInfo='showToothInfo'
                    @toggleItemVisibility='toggleItemVisibility'
                    @onChangeAgeCategory='onChangeAgeCategory'
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
                            <span>Create new:</span>
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
                        </template>
                    </jaw>
            </div>
    </div>
    <div class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50">
        <t-collapse-search
            :style="[{'max-height': `${jawHeight}px`}]" class="set-procedure-form"
            :items="originalItems[currentType]"
            :selectedTeeth="selectedTeeth"
            :favoriteItems="favoriteItems"
            :itemType="currentType"
            :loading="itemsLoading[currentType]"
            :recalculateItems="recalculateCollapseItems"
            :jawHeight="jawHeight"
            :hideSlot="currentPlan.id === undefined && currentType === 'procedures'"
            @onSetFavoritem="setFavoriteItems"
            @onSelected="selectItem"
        >
                    <template slot="title-start-1">
                            <md-field
                                v-show="currentType==='procedures'"
                                class="no-margin">
                                    <label for="plans">Plans</label>
                                    <md-select
                                        @md-selected="changeCurrentPLan"
                                        v-model="currentPlanId"
                                        name="plan" id="plan"
                                        :disabled="patient.plans.length<1"
                                    >
                                    <md-option
                                        v-for="(plan, index) in patient.plans"
                                        :key="index"
                                        :value="plan.id">{{plan.title}}</md-option>
                                    </md-select>
                            </md-field>
                    </template>
                    <template slot="title-start-2">
                            <md-button
                                v-show="currentType==='procedures'"
                                key="addplan"
                                class="md-success md-just-icon md-round md-sm md-simple"
                                @click="showAddPlan = true"
                                >
                                <md-icon>add</md-icon>
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

        <div    class="md-layout-item  md-size-100" >
                    <items-list
                        v-if="currentType === 'anamnesis' || currentType === 'diagnosis'"
                        :items="currentItems"
                        @showItemInfo="showItemInfo"
                        @onJawChanged="recalculateJaw()"
                        @toggleItemVisibility="toggleItemVisibility"
                        :teethSystem="currentClinic.teethSystem"
                        :type="currentType"
                        :fields="itemFields"
                        >
                    </items-list>
                    <tabs
                            v-if="patient.plans.length > 0 && currentType === 'procedures' "
                            @onChangeTab="onChangeTab"
                            ref="tabs"
                            :tab-name="Object.values(patient.plans).map(e=>e.title)"
                            color-button="success"
                            class="procedures-tabs"
                        >
                            <!-- <h4
                            class="title"
                            slot="header-title"
                            >Navigation Pills - <small class="description">Horizontal Tabs</small></h4> -->
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
                                        :type="currentType"
                                        :items="currentItems"
                                        :fields="itemFields"
                                        >
                                    </items-list>
                                </div>
                            </template>
                            <div slot="footer-actions">
                                        <md-button>
                                            Delete plan
                                        </md-button>
                                        <md-button>
                                            Make primary
                                        </md-button>
                                    </div>
                    </tabs>
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
            :currencyCode="clinic.currencyCode"
        />
        <plan-add-form
            :showForm.sync="showAddPlan"
            :plans="patient.plans"
            @onPlanCreated="setPlan"
        />
        <t-print-form
            :patient="patient"
            :showForm.sync="showPrint"/>

        <t-wizard-add-item
            v-if="showAddItemWizard"
            @on-created='saveItem'
            :steps="steps"
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
    } from '@/constants';
    import PlanAddForm from './PlanAddForm.vue';
    import { mapGetters } from 'vuex';
    import {
        TCollapseSearch,
        TToothItems,
        Jaw,
        Tabs,
        TPrintForm,
        TWizardAddItem,
    } from '@/components';
    import ItemsList from './ItemsList.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TCollapseSearch,
            Jaw,
            TToothItems,
            ItemsList,
            PlanAddForm,
            Tabs,
            TPrintForm,
            TWizardAddItem,
        },
        data() {
            return {
                currentPlanId: null,
                currentType: 'anamnesis',
                showToothDiagnosis: false,
                showAddDiagnoseWizard: false,
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
                originalItems: {
                    procedures: [],
                    anamnesis: [],
                    diagnosis: [],
                },
                itemsLoading: {
                    procedures: false,
                    diagnosis: false,
                    anamnesis: false,
                },
            };
        },
        methods: {
            getItems() {
                if (!this.clinic.diagnosis || this.originalItems.diagnosis.length <= 0) {
                    this.itemsLoading[this.currentType] = true;
                    this.$store.dispatch(CLINIC_DIAGNOSIS_GET).then(() => {
                        this.setOriginalItems(['diagnosis']);
                        this.itemsLoading[this.currentType] = false;
                    });
                }
                if (!this.clinic.procedures || this.originalItems[this.currentType].length <= 0) {
                    this.itemsLoading.procedures = true;
                    this.itemsLoading.anamnesis = true;
                    this.$store.dispatch(CLINIC_PROCEDURES_GET).then(() => {
                        this.setOriginalItems(['anamnesis']);
                        this.itemsLoading.procedures = false;
                        this.itemsLoading.anamnesis = false;
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
                    this.originalItems.diagnosis = this.filterItems(
                        this.clinic.diagnosis,
                        true,
                        'diagnosis',
                    );
                }
                if ((types.includes('anamnesis') || types.includes('procedures')) && this.originalItems.procedures) {
                    this.originalItems.anamnesis = this.filterItems(
                        this.clinic.procedures,
                        false,
                        'anamnesis',
                    );

                    this.originalItems.procedures = this.filterItems(
                        this.clinic.procedures,
                        true,
                        'procedures',
                    );
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
                    let groupIndex = filteredItems.findIndex(el => el.code === item.categoryCode);
                    if (groupIndex === -1) {
                        groupIndex = (filteredItems.push({
                            code: item.categoryCode,
                            title: this.$t(`${localType}.categories.${item.categoryCode}.title`),
                            codes: [],
                        }) - 1);
                    }
                    if (
                        ((type === 'anamnesis' || (item.available || !available)) && LOCATIONS[item.templateID].ageCategory.includes(this.ageCategory))
                    ) {
                        filteredItems[groupIndex].codes.push({
                            ...LOCATIONS[item.code],
                            code: item.code,
                            title: this.$t(`${localType}.${item.ID}.title`),
                            description: this.$t(`${localType}.${item.ID}.description`),
                        });
                    }
                });
                filteredItems = filteredItems.filter(el => el.codes.length !== 0);
                return filteredItems;
            },
            editItem(item, type) {
                if (!this.isEmpty(item.teeth)) {
                    this.selectedTeeth = Object.keys(item.teeth);
                }
                this.selecteditemLocal = item;
                if (type === 'diagnosis') {
                    this.showAddDiagnoseWizard = true;
                }
                if (type === 'anamnesis') {
                    this.showAddAnamnesWizard = true;
                }
                if (type === 'procedures') {
                    this.showAddProcedureWizard = true;
                }
                this.showAddItemWizard = true;
            },
            toggleItemVisibility(itemId, itemType) {
                if (itemId) {
                    this.$store.dispatch(PATIENT_TOGGLE_ITEM_VISIBILITY, {
                        params: {
                            itemId,
                            type: itemType,
                            planId: this.currentPlanId,
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
            setPlan(p) {
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
                planL.id = Math.random();
                this.$store.dispatch(PATIENT_PLAN_SET, {
                    plan: planL,
                });
                this.selectPlan(planL);
                this.focusOnLastTab(planL.title);
            },
            focusOnLastTab(name) {
                if (this.$refs.tabs) {
                    this.$refs.tabs.switchPanel(name);
                }
            },
            selectPlan(p) {
                if (this.patient.plans.findIndex(plan => plan.id === p.id) > -1) {
                    this.currentPlanId = p.id;
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
                        planId: this.currentPlanId,
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
                            planId: this.currentPlanId,
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
                    planId: this.currentPlanId,
                    procedure: procedureL,
                });
                // this.selectedTeeth = [];
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
                        Object.values(this.originalItems[this.currentType]).forEach((group) => {
                            group.codes.forEach((itemOrigin) => {
                                if (itemOrigin.code === item.constCode) {
                                    this.selecteditemLocal = itemOrigin;
                                    this.showAddItemWizard = true;
                                }
                            });
                        });
                    }
                }
            },
            matchHeight() {
                if (this.$refs.wrjaw) {
                    this.jawHeight = this.$refs.wrjaw.clientHeight;
                }
            },
            changePLan(planId, key, value) {
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
                            this.changePLan(plan.id, 'showInJaw', false);
                        }
                    });
                    this.changePLan(planId, 'showInJaw', true);
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
                favoriteProcedures: 'favoriteProcedures',
                favoriteAnamnesis: 'favoriteAnamnesis',
                teethSchema: 'teethSchema',
                currentClinic: 'getCurrentClinic',
                user: 'getProfile',
                diagnosis: 'getDiagnosis',
                procedures: 'getProcedures',
                anamnesis: 'getProcedures',
                access_token: 'fetchStateAccessToken',
                clinic: 'getCurrentClinic',
            }),
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
            itemFields() {
                // возможные поля ['code', 'title', 'teeth', 'author', 'manipulations', 'date'];
                if (this.currentType === 'anamnesis') {
                    return ['code', 'title', 'teeth', 'author', 'manipulations', 'date'];
                }
                if (this.currentType === 'procedures') {
                    return ['code', 'title', 'teeth', 'author', 'manipulations', 'date'];
                }
                return ['code', 'title', 'teeth', 'author', 'manipulations', 'date'];
            },
            steps() {
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
        mounted() {
            window.addEventListener('resize', this.matchHeight);
            this.$nextTick(() => {
                this.matchHeight();
            });
            this.selectPlan(this.currentPlan);
            this.getItems();
        },
        watch: {
            ageCategory() {
                this.setOriginalItems(['anamnesis', 'diagnosis']);
            },
            // eslint-disable-next-line func-names
            '$i18n.locale': function () {
                this.setOriginalItems(['anamnesis', 'diagnosis']);
            },

        },
    };
</script>
<style lang="scss">
.set-diagnose-form {
    .md-sm{

    }
    .set-procedure-form {
        margin-right: 15px;
    }
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
    .tab-content > div {
        flex-grow: 1;
    }
    .md-card {
        box-shadow: none;
    }
}
</style>
