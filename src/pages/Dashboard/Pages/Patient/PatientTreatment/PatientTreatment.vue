<template lang="html">
    <div v-cloak class="md-layout set-diagnose-form">
        <div class="md-layout  md-medium-size-100 md-size-100">
            <div
                class=" md-layout md-layout-item md-xlarge-size-50 md-small-size-100 md-xsmall-size-100  md-large-size-50 md-medium-size-50  "
                :class="[this.$sidebar.isMinimized ? ' md-sized-100 md-alignment-top-center' : ' md-sidze-50']"
            >
                <keep-alive>
                    <jaw
                        :age-category="!!patient.ageCategory"
                        :jaw="patient.jaw || {}"
                        :selected-teeth="selectedTeeth"
                        :type="currentType"
                        @onSelectedTeeth="onSelectedTeeth"
                        @onSizeChanged="matchHeight"
                        @showToothInfo="showToothInfo"
                        v-cloak
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
             <keep-alive>
            <router-view
                :canRedirect="_.isEmpty(routeBeforeLeave)"
                :current-type="currentType"
                :plans="patient.plans"
                @addPlan="addPlan"
                @showItemInfo="selectItem"
                name="list"
            />
             </keep-alive>
        </div>

        <div v-if="showAddPlan">
            <plan-add-form :show-form.sync="showAddPlan" :plans="patient.plans" :patient-id="patient.ID"></plan-add-form>
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
            if (vm.routeBeforeLeave && to.name != 'plan') {
                vm.$router.push({
                    name: vm.routeBeforeLeave.name,
                    params: vm.routeBeforeLeave.params
                });
            } else if(vm.currentPlanID  && to.name !== 'procedures') {
                vm.$router.push({
                    name: 'procedures',
                    params: {
                        lang: vm.$i18n.locale,
                        patientID: vm.patient.ID,
                        planID: vm.currentPlanID
                    }
                });
            } else if(! vm.currentPlanID && to.name !== 'plan') {
                vm.$router.push({
                    name: 'plan',
                    params: {
                        lang: vm.$i18n.locale,
                        patientID: vm.patient.ID,
                    }
                });
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        this.routeBeforeLeave = from;
        next();
    },
    components: {
        ...components,
        ...patientComponents
    },
    name: 'PatientTreatment',
    data() {
        return {
            routeBeforeLeave: null,
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
    methods: {
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
            const procedureL = this._.cloneDeep(p);
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
