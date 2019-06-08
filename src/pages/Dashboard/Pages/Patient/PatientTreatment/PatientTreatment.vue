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
                        <div slot="title-start">

                            <md-button @click="currentType = 'anamnesis'" :class="[{'md-info' : currentType === 'anamnesis' }, {'md-simple' :  currentType !== 'anamnesis' } ]" > anamnes</md-button>
                            <md-button @click="currentType = 'diagnosis'"  :class="[{'md-primary' : currentType === 'diagnosis' }, {'md-simple' :  currentType !== 'diagnosis' } ]" > diagnos</md-button>
                            <md-button @click="currentType = 'procedures'"  :class="[{'md-success' : currentType === 'procedures' }, {'md-simple' :  currentType !== 'procedures' } ]"> procedure</md-button>

                        </div>
                    </jaw>
            </div>
    </div>
    <div class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50">
        <t-collapse-search
            :style="[{'max-height': jawHeight + 'px'}]" class="set-procedure-form"
            :items="originalItems[currentType]"
            :selectedTeeth="selectedTeeth"
            :favoriteItems="favoriteItems"
            :itemType="currentType"
            :recalculateItems="recalculateCollapseItems"
            :jawHeight="jawHeight"
            :hideSlot="currentPlan.id === undefined && currentType === 'procedures'"
            @onSetFavoritem="setFavoriteItems"
            @onSelected="selectItem"
        >

                    <md-field
                    slot="title-start-1"
                        v-if="currentType==='procedures'"
                        class="no-margin">
                            <label for="plans">Plans</label>
                            <md-select
                                @md-selected="changePLan"
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
                        <div slot="title-start-2">
                            <md-button
                                v-if="currentType==='procedures'"
                                key="addplan"
                                class="md-primary md-just-icon md-simple md-round "
                                @click="showAddPlan = true"
                                >
                                <md-tooltip md-delay="1000">Add new plan</md-tooltip>
                                <md-icon>add</md-icon>
                            </md-button>
                        </div>
                        <div   slot="empty-space">
                            <md-empty-state
                                    md-label="No created plans"
                                    md-description="To implemet a procedure, you should firstly create a plan">
                                    <md-button class="md-primary md-raised" @click="showAddPlan = true">Create New Plan</md-button>
                                </md-empty-state>
                        </div>
            </t-collapse-search>
    </div>

        <div    class="md-layout-item  md-size-100" >
                    <items-list
                        v-show="currentType === 'anamnesis' || currentType === 'diagnosis'"
                        :items="currentItems"
                        @showItemInfo="showItemInfo"
                        @onJawChanged="recalculateJaw()"
                        @toggleItemVisibility="toggleItemVisibility"
                        :teethSystem="currentClinic.teethSystem"
                        :type="currentType"
                        >
                    </items-list>
                    <tabs
                            v-show="currentType === 'procedures' "
                            v-if="patient.plans.length > 0"
                            @onChangeTab="onChangeTab"
                            ref="tabs"
                            :tab-name="Object.values(patient.plans).map(e=>e.title)"
                            color-button="warning"
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
                                        >
                                    </items-list>
                                </div>
                            </template>
                            <div slot="footer-actions">
                                        <md-button>
                                            delete plan
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
            :type="showParams.type"
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

        <jaw-add-anamnes-wizard
            v-if="showAddAnamnesWizard"
            @on-created='saveItem'
            :selectedTeeth="selectedTeeth"
            :selectedItem="selecteditemLocal"
            :jaw='jaw'
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :isDialogVisible.sync="showAddAnamnesWizard"
            :locationType="currentType"
        />

        <jaw-add-diagnose-wizard
            v-if="showAddDiagnoseWizard"
            @on-created='saveItem'
            :selectedTeeth="selectedTeeth"
            :selectedItem="selecteditemLocal"
            :jaw='jaw'
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :isDialogVisible.sync="showAddDiagnoseWizard"
            :locationType="currentType"
        />
        <jaw-add-procedure-wizard
            v-if="showAddProcedureWizard"
            @on-created='saveItem'
            :currentPlan="currentPlan"
            :selectedTeeth="selectedTeeth"
            :selectedItem="selecteditemLocal"
            :jaw='jaw'
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :isDialogVisible.sync="showAddProcedureWizard"
            :locationType="currentType"
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
    } from '@/constants';
    import PlanAddForm from './PlanAddForm.vue';
    import { mapGetters } from 'vuex';
    import {
        TCollapseSearch, TToothItems, Jaw, Tabs, TPrintForm,
    } from '@/components';
    import ItemsList from './ItemsList.vue';
    import JawAddDiagnoseWizard from './DiagnoseWizard/JawAddDiagnoseWizard.vue';
    import JawAddProcedureWizard from './ProcedureWizard/JawAddProcedureWizard.vue';
    import JawAddAnamnesWizard from './AnamnesWizard/JawAddAnamnesWizard.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TCollapseSearch,
            Jaw,
            TToothItems,
            ItemsList,
            JawAddDiagnoseWizard,
            PlanAddForm,
            Tabs,
            JawAddProcedureWizard,
            JawAddAnamnesWizard,
            TPrintForm,
        },
        data() {
            return {
                currentPlanId: null,
                currentType: 'anamnesis',
                showToothDiagnosis: false,
                showAddDiagnoseWizard: false,
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
                diagnoseOriginal: [],
                users: [],
                selecteditemLocal: {},
                ageCategory: 'adultTeeth',
                originalItems: {
                    procedures: [],
                    anamnesis: [],
                    diagnosis: [],
                },
            };
        },
        methods: {
            onShowPrint() {
                this.showPrint = true;
            },
            onChangeTab(index) {
                this.changePLan(this.patient.plans[index].id);
            },
            onChangeAgeCategory(category) {
                this.selectedTeeth = [];
                if (category === 'babyTeeth') {
                    this.ageCategory = 'babyTeeth';
                } else {
                    this.ageCategory = 'adultTeeth';
                }
            },
            setOriginalItems() {
                this.originalItems.anamnesis = this.filterItems(this.procedures, false);
                this.originalItems.diagnosis = this.filterItems(this.diagnosis, true);
                this.originalItems.procedures = this.filterItems(this.procedures, true);
                this.recalculateCollapseItems = !this.recalculateCollapseItems;
            },
            filterItems(items, available) {
                const filteredItems = [];
                items.forEach((itemsGroup) => {
                    const group = {};
                    group.code = itemsGroup.code;
                    group.title = itemsGroup.title;
                    group.codes = [];
                    itemsGroup.codes.forEach((item) => {
                        if ((item.ageCategory.includes(this.ageCategory)) && (item.available || !available)) {
                            group.codes.push({
                                ...item,
                            });
                        }
                    });
                    if (group.codes.length > 0) {
                        filteredItems.push(group);
                    }
                });
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
                const index = this.favoriteItems.findIndex(
                    d => d === items.code,
                );
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
                        Object.values(this[this.currentType]).forEach((group) => {
                            group.codes.forEach((itemOrigin) => {
                                if (itemOrigin.code === item.constCode) {
                                    this.selecteditemLocal = itemOrigin;
                                }
                            });
                        });
                        if (this.currentType === 'diagnosis') {
                            this.showAddDiagnoseWizard = true;
                        }
                        if (this.currentType === 'anamnesis') {
                            this.showAddAnamnesWizard = true;
                        }
                        if (this.currentType === 'procedures') {
                            this.showAddProcedureWizard = true;
                        }
                    }
                }
            },
            matchHeight() {
                if (this.$refs.wrjaw) {
                    this.jawHeight = this.$refs.wrjaw.clientHeight;
                }
            },
            changePLan(planId) {
                if (planId) {
                    this.patient.plans.forEach((plan) => {
                        if (plan.id !== planId && plan.showInJaw) {
                            this.$store.dispatch(PATIENT_PLAN_EDIT, {
                                planId: plan.id,
                                key: 'showInJaw',
                                value: false,
                            });
                        }
                    });
                    this.$store.dispatch(PATIENT_PLAN_EDIT, {
                        planId,
                        key: 'showInJaw',
                        value: true,
                    });
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
            this.setOriginalItems();
            this.selectPlan(this.currentPlan);
        },
        watch: {
            ageCategory() {
                this.setOriginalItems();
            },
        },
    };
</script>
<style lang="scss">
.set-diagnose-form {
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
    .tab-content>div{
        flex-grow: 1;
    }
    .md-card{
        box-shadow: none;
    }
}
</style>
