<template>
    <md-dialog :md-click-outside-to-close="!isLoading" :md-active.sync="isDialogVisibleL" class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <t-wizard
                    :finish-button-text="`Done`"
                    :tab-color="tabColor"
                    :is-loading="isLoading"
                    :validate-mode="!needToSaveItem() && !needToSaveEdited()"
                    @tab-change="onTabChange"
                    @onCancel="isDialogVisibleL = false"
                >
                    <template slot="header">
                        <h5 class="title">
                            <span v-if="itemToCreate.ID">
                                <span v-if="currentType === 'anamnesis'">{{ $t(`${$options.name}.editAnamnesis`) }}:</span>
                                <span v-if="currentType === 'procedures'">{{ $t(`${$options.name}.editProcedures`) }}:</span>
                                <span v-if="currentType === 'diagnosis'">{{ $t(`${$options.name}.editDiagnosis`) }}:</span>
                                <!-- <small>ID {{ itemToCreate.ID }}</small> -->
                            </span>
                            <span v-else>
                                <span v-if="currentType === 'anamnesis'">{{ $t(`${$options.name}.addingAnamnesis`) }}:</span>
                                <span v-if="currentType === 'procedures'">{{ $t(`${$options.name}.addingProcedures`) }}:</span>
                                <span v-if="currentType === 'diagnosis'">{{ $t(`${$options.name}.addingDiagnosis`) }}:</span>
                            </span>
                            &nbsp;
                            <b>{{ selectedItem.code }}</b>
                            {{ selectedItem.title }}
                            <span v-if="currentPlan.name && currentType === 'procedure'" class="category">– {{ currentPlan.name | capitilize }}</span>
                        </h5>
                        <span>
                            <span v-if="hasLocationKeyOrSelectedTeeth()" class="category">
                                <span v-if="_.isEmpty(itemToCreate.teeth)">{{ $t(`${$options.name}.selectTooth`) }}</span>
                                <span v-else>
                                    <slide-y-down-transition>
                                        <span v-show="!_.isEmpty(originalItem.locations)">For:</span>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <span v-show="_.isEmpty(originalItem.locations)">{{ $t(`${$options.name}.teethWithLocations`) }}</span>
                                    </slide-y-down-transition>
                                </span>
                                <transition-group name="list">
                                    <span v-for="(item, key) in itemToCreate.teeth" :key="key + 0" class="list-item">
                                        {{ key | toCurrentTeethSystem }}
                                    </span>
                                </transition-group>
                            </span>
                        </span>
                    </template>
                    <t-wizard-tab v-if="showTab('locations')" name="locations" :before-change="() => validateStep('locations')">
                        <template slot="label">
                            {{ $t(`${$options.name}.locations`) }}
                        </template>
                        <t-item-tooth-locations
                            ref="locations"
                            v-model="selectedItemLocal"
                            :original-item="originalItem"
                            :jaw="jaw"
                            :error.sync="errorLocations"
                            :selected-item="selectedItem"
                            :original-locations="originalItem.locations"
                            :teeth-system="currentClinic.teethSystem"
                            :current-type="currentType"
                            @mounted-size="setSize"
                        />
                    </t-wizard-tab>

                    <t-wizard-tab v-if="showTab('manipulations')" name="manipulations" :before-change="() => validateStep('manipulations')">
                        <template slot="label">
                            {{ $t(`${$options.name}.manipulations`) }}
                        </template>
                        <t-item-manipulations
                            ref="manipulations"
                            :original-item="originalItem"
                            :item-i-d="itemToCreate.ID || null"
                            :size="jawListSize"
                            :currency-code="currentClinic.currencyCode"
                            :manipulations="currentClinic.manipulationsComputed"
                            @addManipulations="manipulationsCreated"
                        />
                    </t-wizard-tab>
                    <t-wizard-tab v-if="showTab('files')" name="files" :before-change="() => validateStep('files')">
                        <template slot="label">
                            {{ $t(`${$options.name}.files`) }}
                        </template>
                        <t-item-files ref="files" :size="jawListSize" />
                    </t-wizard-tab>
                    <t-wizard-tab v-if="showTab('description')" name="description" :before-change="() => validateStep('description')">
                        <template slot="label">
                            {{ $t(`${$options.name}.description`) }}
                        </template>
                        <t-item-description ref="description" v-model="descriptionLocal" :size="jawListSize" :descriptions="originalDescriptions" />
                    </t-wizard-tab>
                    <t-wizard-tab v-if="showTab('appointment')" name="appointment" :before-change="() => validateStep('appointment')">
                        <template slot="label">
                            {{ $t(`${$options.name}.appointment`) }}
                        </template>
                        <t-item-appointment ref="appointment" :show-appointment="showAppointment" :size="jawListSize" />
                    </t-wizard-tab>
                </t-wizard>
            </div>
        </div>
    </md-dialog>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';
import { mapGetters } from 'vuex';
// import TItemToothLocations from './TWizardItems/TItemToothLocations';
// import TItemDescription from './TWizardItems/TItemDescription';
// import TItemManipulations from './TWizardItems/TItemManipulations';
// import TItemFiles from './TWizardItems/TItemFiles';
// import TItemAppointment from './TWizardItems/TItemAppointment';
import components from '@/components';
// import SimpleWizard from '../TWizard/Wizard';
// import WizardTab from '../TWizard/WizardTab';

import { tObjProp } from '@/mixins';
import { NOTIFY, PATIENT_PROCEDURE_SET, STORE_KEY_PATIENT, PATIENT_DIAGNOSE_SET, PATIENT_ANAMNES_SET, PATIENT_PROCEDURE_UPDATE } from '@/constants';

export default {
    name: 'TWizardAddItem',
    components: {
        SlideYDownTransition,
        't-item-tooth-locations': () => import('./TWizardItems/TItemToothLocations'),
        't-item-description': () => import('./TWizardItems/TItemDescription'),
        't-item-manipulations': () => import('./TWizardItems/TItemManipulations'),
        't-item-files': () => import('./TWizardItems/TItemFiles'),
        't-item-appointment': () => import('./TWizardItems/TItemAppointment'),
        // SimpleWizard,
        // WizardTab,
        ...components
    },
    mixins: [tObjProp],
    props: {
        isDialogVisible: {
            type: Boolean,
            default: false
        },
        jaw: {
            type: Object,
            default: () => {}
        },
        steps: {
            type: Array,
            default: () => []
        },
        currentType: {
            type: String,
            default: () => 'diagnosis'
        },
        singleItemName: {
            type: String,
            default: () => 'diagnose'
        },
        selectedItem: {
            type: Object,
            default: () => ({
                ID: '',
                code: '',
                title: '',
                manipulations: []
            })
        }
    },
    data() {
        return {
            errorLocations: {
                message: 'Choose tooth or disease location',
                type: 'locations',
                show: 'false'
            },
            showAppointment: false,
            isLoading: false,
            currentTab: '',
            jawListSize: {},
            // description: '',
            // needToSaveEdited: false,
            selectedTeethL: [],
            // selectedTeethLocalJaw: [],
            itemToCreate: {
                ID: null,
                teeth: {},
                description: '',
                manipulations: [],
                code: '',
                title: ''
            },
            itemToCompare: {
                ID: null,
                teeth: {},
                description: '',
                manipulations: [],
                code: '',
                title: ''
            }
        };
    },
    computed: {
        ...mapGetters({
            procedureDescriptions: 'procedureDescriptions',
            anamnesDescriptions: 'anamnesDescriptions',
            diagnoseDescriptions: 'diagnoseDescriptions',
            currentClinic: 'getCurrentClinic',
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            currentPlan: `${STORE_KEY_PATIENT}/getCurrentPlan`,
            getCurrentClinicOriginalItem: 'getCurrentClinicOriginalItem'
        }),
        teethToWatch() {
            return this.itemToCreate.teeth;
        },

        originalDescriptions() {
            if (this.currentType === 'diagnosis') {
                return this.diagnoseDescriptions;
            }
            if (this.currentType === 'anamnesis') {
                return this.anamnesDescriptions;
            }
            return this.procedureDescriptions;
        },
        tabColor() {
            if (this.currentType === 'diagnosis') {
                return 'purple';
            }
            if (this.currentType === 'anamnesis') {
                return 'blue';
            }
            return 'green';
        },

        originalItem() {
            const catalogID = this.selectedItem[this.getItemCatalogFieldName()];
            return this.getCurrentClinicOriginalItem(this.currentType, catalogID);
        },
        selectedItemLocal: {
            get() {
                return this.selectedItem;
            },
            set(newValue) {
                this.$set(this.itemToCreate, 'teeth', newValue.teeth);
            }
        },
        descriptionLocal: {
            get() {
                return this.selectedItem.description;
            },
            set(newValue) {
                this.$set(this.itemToCreate, 'description', newValue);
            }
        },
        isDialogVisibleL: {
            get() {
                return this.isDialogVisible;
            },
            set(value) {
                this.$emit('update:isDialogVisible', value);
            }
        }
    },
    created() {
        this.hasLoctionsKey(this.selectedItem.code);
        this.initiateLocalItem();
        // this.description = this.selectedItem.description;
    },
    methods: {
        needToSaveItem() {
            return !this.itemToCreate.ID;
        },
        needToSaveEdited() {
            return !this._.isEqual(this.itemToCreate.teeth, this.itemToCompare.teeth);
            // if (!this.currentTab || this.currentTab === 'locations') {
            // }
            // return false;
        },
        needToSaveDescription() {
            return !this._.isEqual(this.itemToCreate.description, this.itemToCompare.description);
        },

        getItemCatalogFieldName() {
            if (this.currentType === 'diagnosis') {
                return 'catalogDiagnoseID';
            }
            if (this.currentType === 'procedures') {
                return 'catalogProcedureID';
            }
            if (this.currentType === 'anamnesis') {
                return 'catalogProcedureID';
            }
            return null;
        },
        setAnamnes() {
            const anamnes = {
                catalogProcedureID: this.itemToCreate.catalogAnamnesID,
                teeth: this.itemToCreate.teeth
            };
            console.log(anamnes);
            this.isLoading = true;
            return new Promise((resolve, reject) => {
                this.$store
                    .dispatch(`$_patient/${PATIENT_ANAMNES_SET}`, {
                        anamnes
                    })
                    .then(
                        response => {
                            this.itemToCreate.ID = response.ID;
                            this.itemToCreate.teeth = response.teeth;
                            this.itemToCompare = this._.cloneDeep(response);
                            this.isLoading = false;
                            resolve(true);
                        },
                        error => {
                            console.log(error);
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: error.response.data.error,
                                    type: 'warning'
                                }
                            });
                            this.isLoading = false;
                            reject(error);
                        }
                    )
                    .catch(err => {
                        this.isLoading = false;
                        throw new Error(err);
                    });
            });
        },
        setProcedure() {
            const procedure = {
                catalogProcedureID: this.itemToCreate.catalogProcedureID,
                teeth: this.itemToCreate.teeth
            };
            this.isLoading = true;
            return new Promise((resolve, reject) => {
                this.$store
                    .dispatch(`$_patient/${PATIENT_PROCEDURE_SET}`, {
                        procedure
                    })
                    .then(
                        response => {
                            this.itemToCreate.ID = response.ID;
                            this.itemToCreate.teeth = response.teeth;
                            this.itemToCompare = this._.cloneDeep(response);
                            this.isLoading = false;
                            resolve(true);
                        },
                        error => {
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: error.response.data.error,
                                    type: 'warning'
                                }
                            });
                            this.isLoading = false;
                            reject(error);
                        }
                    )
                    .catch(err => {
                        this.isLoading = false;
                        throw new Error(err);
                    });
            });
        },
        setDiagnose() {
            const diagnose = {
                catalogDiagnoseID: this.itemToCreate.catalogDiagnoseID,
                teeth: this.itemToCreate.teeth
            };
            this.isLoading = true;
            return new Promise((resolve, reject) => {
                this.$store
                    .dispatch(`$_patient/${PATIENT_DIAGNOSE_SET}`, {
                        diagnose
                    })
                    .then(
                        response => {
                            this.itemToCreate.ID = response.ID;
                            this.itemToCreate.teeth = response.teeth;
                            this.itemToCompare = this._.cloneDeep(response);
                            this.isLoading = false;
                            resolve(true);
                        },
                        error => {
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: error.response.data.error,
                                    type: 'warning'
                                }
                            });
                            this.isLoading = false;
                            reject(error);
                        }
                    )
                    .catch(err => {
                        console.log(err);
                        this.isLoading = false;
                        throw new Error(err);
                    });
            });
        },
        saveProcedureTeeth() {
            const params = {
                procedureID: this.itemToCreate.ID,
                teeth: this.itemToCreate.teeth,
                description: `${this.itemToCreate.description}`
            };
            this.isLoading = true;
            return new Promise((resolve, reject) => {
                this.$store
                    .dispatch(`$_patient/${PATIENT_PROCEDURE_UPDATE}`, {
                        params
                    })
                    .then(
                        response => {
                            this.itemToCreate.teeth = response.teeth;
                            this.itemToCreate.description = response.description;
                            this.itemToCompare = this.lodash.cloneDeep(response);
                            this.isLoading = false;
                            resolve(true);
                        },
                        error => {
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: error.response.data.error,
                                    type: 'warning'
                                }
                            });
                            this.isLoading = false;
                            reject(error);
                        }
                    )
                    .catch(err => {
                        this.isLoading = false;
                        throw new Error(err);
                    });
            });
        },
        saveItem() {
            if (this.currentType === 'diagnosis') {
                if (this.needToSaveItem()) {
                    return Promise.resolve(this.setDiagnose());
                }
                if (this.needToSaveEdited()) {
                    return Promise.resolve(this.saveProcedureTeeth());
                }
                return true;
            }
            if (this.currentType === 'anamnesis') {
                if (this.needToSaveItem()) {
                    return Promise.resolve(this.setAnamnes());
                }
                if (this.needToSaveEdited()) {
                    return Promise.resolve(this.saveProcedureTeeth());
                }
                return true;
            }
            if (this.currentType === 'procedures') {
                if (this.needToSaveItem()) {
                    return Promise.resolve(this.setProcedure());
                }
                if (this.needToSaveEdited()) {
                    return Promise.resolve(this.saveProcedureTeeth());
                }
                return true;
            }
            return false;
        },
        saveDescription() {
            if (this.currentType === 'diagnosis') {
                // this.$store.dispatch(`$_patient/${PATIENT_DIAGNOSE_SET, {
                //     // diagnose
                //     diagnose: 'diagnose'
                // });
                this.isDialogVisibleL = false;
                return true;
            }
            if (this.currentType === 'anamnesis') {
                // this.$store.dispatch(`$_patient/${PATIENT_ANAMNES_SET, {
                //     // anamnesis
                //     anamnes: 'anamnesis'
                // });
                this.isDialogVisibleL = false;
                return true;
            }
            if (this.currentType === 'procedures') {
                console.log('save edited description', this.needToSaveDescription());
                if (this.needToSaveDescription()) {
                    return Promise.resolve(this.saveProcedureTeeth());
                }
                return true;
            }
            return false;
        },
        onTabChange(oldTab, newTab) {
            this.currentTab = newTab.name;
            if (this.currentTab === 'appointment') {
                this.$nextTick(() => {
                    this.showAppointment = true;
                });
            }
        },
        // инициируем локальный диагноз
        initiateLocalItem() {
            this.itemToCreate = this.lodash.cloneDeep(this.selectedItem);
            this.itemToCompare = this.lodash.cloneDeep(this.selectedItem);
            this.selectedTeethL = this.lodash.cloneDeep(this.selectedItem.teeth);
        },
        manipulationsCreated(manipulations) {
            this.itemToCreate.manipulations = manipulations;
        },
        hasLoctionsKey() {
            if (this.originalItem) {
                return 'locations' in this.originalItem;
            }
            return false;
        },
        hasManipulations() {
            if (this.originalItem) {
                return 'manipulations' in this.originalItem;
            }
            return false;
        },
        hasLocationKeyOrSelectedTeeth() {
            if (this.isDialogVisibleL) {
                if (!this.hasLoctionsKey()) {
                    return false;
                }
                return this.selectedItem.teeth && this.selectedItem.teeth.length > 0;
            }
            return true;
        },

        setSize(value) {
            this.jawListSize = value;
        },
        validateStep(ref) {
            if (ref === 'locations') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then(res => {
                    if (res) {
                        return Promise.resolve(this.saveItem());
                    }
                    return res;
                });
            }
            if (ref === 'manipulations') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then(res => {
                    return res;
                });
            }
            if (ref === 'files') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then(res => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'File issue',
                                type: 'warning'
                            }
                        });
                        return false;
                    }
                    return res;
                });
            }
            if (ref === 'description') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then(res => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please add a description',
                                type: 'warning'
                            }
                        });
                        return false;
                    }
                    console.log('this.isDialogVisibleL');
                    if (res) {
                        return Promise.resolve(this.saveDescription());
                    }
                    if (this.currentType !== 'procedures') {
                        this.isDialogVisibleL = false;
                    }
                    // ! работает не правильно надо переделать
                    return res;
                });
            }
            if (ref === 'appointment') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then(res => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please add dignose description',
                                type: 'warning'
                            }
                        });
                        return false;
                    }
                    this.isDialogVisibleL = false;

                    return res;
                });
            }
            return false;
        },
        showTab(tab) {
            if (tab === 'locations') {
                return true;
                // return this.hasLocationKeyOrSelectedTeeth();
            }
            if (tab === 'manipulations') {
                return this.hasManipulations() || this.currentType === 'procedures';
            }
            if (tab === 'files') {
                return true;
            }
            if (tab === 'description') {
                return true;
            }
            if (tab === 'appointment') {
                return this.currentType === 'procedures';
            }
            return false;
        }
    }
};
</script>
