<template lang="html">
    <div class="md-layout set-diagnose-form">
        <div class="md-layout  md-medium-size-100 md-size-100">
            <div
                class=" md-layout md-layout-item md-xlarge-size-50 md-small-size-100 md-xsmall-size-100  md-large-size-50 md-medium-size-50  "
                :class="[this.$sidebar.isMinimized ? ' md-sized-100 md-alignment-top-center' : ' md-sidze-50']"
            >
                <!-- <div class="mx-auto" style="flex-grow:1;"> -->
                 <keep-alive>
                <jaw
                    :selected-teeth="selectedTeeth"
                    :age-category="!!patient.ageCategory"
                    :jaw="patient.jaw || {}"
                    :type="currentType"
                    @onSelectedTeeth="onSelectedTeeth"
                    @showToothInfo="showToothInfo"
                    @onSizeChanged="matchHeight"
                >
                    <template v-if="patient.ID" slot="title-start">
                        <md-tabs md-sync-route class="t-md-tabs" :class="currentType">
                            <md-tab
                                id="tab-home"
                                :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/plan`"
                                :md-label="$t(`${$options.name}.procedures`)"
                            />
                            <md-tab
                                id="tab-pages"
                                class="diagnosis"
                                :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/diagnosis`"
                                :md-label="$t(`${$options.name}.diagnoses`)"
                            />
                            <md-tab
                                id="tab-posts"
                                :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/anamnesis`"
                                :md-label="$t(`${$options.name}.anamnesis`)"
                            />
                        </md-tabs>
                    </template>
                </jaw>
                 </keep-alive>
                <!-- </div> -->
            </div>
            <keep-alive>
                <router-view
                    name="search"
                    class="md-layout-item md-layout  md-large-size-50 md-xlarge-size-50 md-small-size-100 md-xsmall-size-100"
                    :custom-height="jawHeight"
                    :selected-teeth="selectedTeeth"
                    @addPlan="addPlan"
                    @onSelectItem="selectItem"
                />
            </keep-alive>
        </div>
        <div style="margin-top:30px;" class="md-layout-item  md-size-100">
            <!-- <keep-alive> -->
            <router-view name="list" :current-type="currentType" :plans="patient.plans" @showItemInfo="selectItem" />
            <!-- </keep-alive> -->
        </div>

        <div v-if="showAddPlan">
            <plan-add-form :show-form.sync="showAddPlan" :plans="patient.plans" :patient-id="patient.ID" @onPlanCreated="redirectToProcdures" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    NOTIFY,
    PATIENT_DIAGNOSE_UPDATE,
    PATIENT_PROCEDURE_SET,
    PATIENT_ANAMNES_UPDATE,
    PATIENT_PROCEDURE_UPDATE,
    EB_SHOW_ITEM_WIZARD,
    STORE_KEY_PATIENT
} from '@/constants';
import components from '@/components';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';
import EventBus from '@/plugins/event-bus';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.name !== 'procedures') {
                vm.$router.push({
                    name: 'procedures',
                    params: {
                        lang: vm.$i18n.locale,
                        patientID: vm.patient.ID,
                        planID: to.params.planID || vm.currentPlanID
                    }
                })
                console.log(vm.currentPlanID, 'beforeRouteEnter')
            }
        })
    },
    components: {
        ...components,
        ...patientComponents
    },
    name: 'PatientTreatment',
    data() {
        return {
            showToothDiagnosis: false,
            showAddItemWizard: false,
            jawHeight: 0,
            showParams: {},
            search: '',
            selectedTeeth: [],
            showAddPlan: false,
            loadingAllPLans: false,
            showPrint: false,
            selecteditemLocal: {}
        };
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            currentClinic: 'getCurrentClinic',
            user: 'getProfile',
            access_token: 'fetchStateAccessToken',
            getProceduresByIds: `${STORE_KEY_PATIENT}/getProceduresByIds`,
            getPatientCurrentPlanProcedures: `${STORE_KEY_PATIENT}/getPatientCurrentPlanProcedures`,
            currentPlanID: `${STORE_KEY_PATIENT}/getCurrentPlanID`,
            currentPlanProcedures: `${STORE_KEY_PATIENT}/getPatientCurrentPlanProcedures`
        }),
        currentType() {
            if (this.$route.meta && this.$route.meta.type) {
                return this.$route.meta.type;
            }
            return 'procedures';
        },
        originalItems() {
            const originalItems = {
                anamnesis: this.currentClinic.anamnesisComputed || [],
                diagnosis: this.currentClinic.diagnosisComputed || [],
                procedures: this.currentClinic.proceduresComputed || []
            };
            return originalItems;
        },
        files() {
            return this.patient.files;
        },
        ageCategory() {
            return this.patient.ageCategory;
        },
        stepsForWizard() {
            if (this.currentType === 'anamnesis') {
                return ['locations', 'files', 'description'];
            }
            if (this.currentType === 'diagnosis') {
                return ['locations', 'files', 'description'];
            }
            return ['locations', 'manipulations', 'files', 'description', 'appointments'];
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
                itemToShow = this.patient.currentPlanProcedures.find(item => item.id === this.showParams.itemId);
                return itemToShow;
            }
            if (this.patient[this.showParams.type]) {
                itemToShow = this.patient[this.showParams.type].find(item => item.id === this.showParams.itemId);
            }
            return itemToShow;
        }
    },
    watch: {
        $route(val) {
            console.log(this.currentPlanID, val)
            if (val.name === 'plan' && this.currentPlanID) {
                console.log(this.currentPlanID, 'redirected')
                this.$nextTick(() => {
                    this.redirectToProcdures(this.currentPlanID);
                });
            }
        },
        currentPlanID(val, old) {
            if (!(old in this.patient.plans)) {
                if (val) {
                    console.log('redirectToProcdures',val, old)
                    this.redirectToProcdures(val);
                } else {
                    console.log('redirectToPlan', val, old)
                    this.redirectToPlan();
                }
            }
        }
    },
    mounted() {
        if ((this.$route.params && this.$route.params.planID && this.currentPlanID !== this.$route.params.planID ) || !this.$route.params.planID) {
            console.log(this.currentPlanID , this.$route.params.planID)
            this.redirectToProcdures(this.currentPlanID);
        }
    },
    methods: {
        redirectToProcdures(planID) {
            console.log(planID)
            if (this.$route.name !== 'procedures') {
                this.$router.push({
                    name: 'procedures',
                    params: {
                        lang: this.$i18n.locale,
                        patientID: this.patient.ID,
                        planID: planID,
                    }
                });
                console.log(this.currentPlanID,  this.$route,  'redirected procedures')
            }
        },
        redirectToPlan() {
            console.log(this.currentPlanID,  this.$route,  'redirected plan')
            if (this.$route.name !== 'plan') {
                this.$router.push({
                    name: 'plan',
                    params: {
                        lang: this.$i18n.locale,
                        patientID: this.patient.ID
                    }
                });
            }
        },
        addPlan() {
            if (this.patient.plans && this.patient.plans.length >= 10) {
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: 'PLans limit riched (only 10 plans allowed)',
                        type: 'warning'
                    }
                });
            } else {
                this.showAddPlan = true;
            }
        },
        onShowPrint() {
            this.showPrint = true;
        },
        getItemCatalogFieldName() {
            if (this.currentType === 'diagnosis') {
                return 'catalogDiagnoseID';
            } else if (this.currentType === 'procedures') {
                return 'catalogProcedureID';
            } else if (this.currentType === 'anamnesis') {
                return 'catalogAnamnesID';
            } else {
                return null;
            }
        },
        editItem(item) {
            this.selecteditemLocal = {
                ID: null,
                [this.getItemCatalogFieldName()]: item.ID,
                code: item.code,
                description: item.description,
                title: item.title
            };
            Object.keys(this.selectedTeeth).forEach(toothID => {
                if (!this.selecteditemLocal.teeth) {
                    this.selecteditemLocal.teeth = {};
                }
                this.selecteditemLocal.teeth[toothID] = {};
            });
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
            this.$store.dispatch(`$_patient/${PATIENT_ANAMNES_UPDATE}`, {
                anamnes: a
            });
        },
        saveEditedProcedure(p) {
            this.$store.dispatch(`$_patient/${PATIENT_PROCEDURE_UPDATE}`, {
                params: {
                    procedure: p,
                    planID: this.currentPlanID
                }
            });
        },
        saveEditedDiagnose(d) {
            this.$store.dispatch(`$_patient/${PATIENT_DIAGNOSE_UPDATE}`, {
                diagnose: d
            });
        },
        saveProcedure(p) {
            if (p.id) {
                this.saveEditedProcedure(p);
                return;
            }
            const procedureL = this.lodash.cloneDeep(p);
            procedureL.date = new Date();
            procedureL.author = {
                ID: this.user.ID,
                avatar: this.user.avatar,
                firstName: this.user.firstName,
                lastName: this.user.lastName
            };
            procedureL.showInJaw = true;
            procedureL.id = Math.random();
            this.$store.dispatch(`$_patient/${PATIENT_PROCEDURE_SET}`, {
                planID: this.currentPlanID,
                procedure: procedureL,
                patientID: this.patient.ID
            });
        },
        selectItem(item) {
            if (item) {
                // const catalogName = this.getItemCatalogFieldName();
                this.selecteditemLocal = {
                    ID: null,
                    [this.getItemCatalogFieldName()]: item.ID,
                    code: item.code,
                    description: item.description,
                    title: item.title
                };
                this.selectedTeeth.forEach(toothID => {
                    if (!this.selecteditemLocal.teeth) {
                        this.selecteditemLocal.teeth = {};
                    }
                    this.selecteditemLocal.teeth[toothID] = {};
                });
                const params = {
                    type: this.currentType,
                    item: this.selecteditemLocal
                };
                EventBus.$emit(EB_SHOW_ITEM_WIZARD, params);
            }
        },
        matchHeight(jawHeight) {
            this.jawHeight = jawHeight;
        }
    }
};
</script>
<style lang="scss"></style>
