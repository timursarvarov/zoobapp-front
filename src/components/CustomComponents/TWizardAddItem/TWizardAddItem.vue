<template>
    <md-dialog
        :md-click-outside-to-close="!isLoading"
        :md-active.sync="isDialogVisibleL"
        class="jaw-dialog-wrapper"
    >
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard
                    :finish-button-text="`Save ${singleItemName}`"
                    :tab-color="tabColor"
                    :is-loading="isLoading"
                    :validate-mode="!needToSaveItem() && !needToSaveEdited()"
                    @tab-change="onTabChange"
                >
                    <template slot="header">
                        {{ selectedItemLocal.ID }}
                        needToSaveItem() :{{ needToSaveItem() }}
                        needToSaveEdited() :{{ needToSaveEdited() }}
                        {{ itemToCreate.ID }}
                        <h5 class="title">
                            {{ singleItemName | capitilize }}
                            <span v-if="itemToCreate.ID">edit:</span>
                            <span v-else>adding:</span>
                            &nbsp;
                            <b>{{ selectedItem.code }}</b>
                            {{ selectedItem.title }}
                            <span
                                v-if="currentPlan.name"
                                class="category"
                            >– {{ currentPlan.name | capitilize }}</span>
                        </h5>
                        <span>
                            <span
                                v-if="hasLocationKeyOrSelectedTeeth()"
                                class="category"
                            >
                                <span v-if="isEmpty(itemToCreate.teeth)">Please selesct tooth</span>
                                <span v-else>
                                    <slide-y-down-transition>
                                        <span v-show="!isEmpty(originalItem.locations)">For:</span>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <span
                                            v-show="isEmpty(originalItem.locations)"
                                        >Teeth with disease area:</span>
                                    </slide-y-down-transition>
                                </span>
                                <transition-group name="list">
                                    <span
                                        v-for="(item, key) in itemToCreate.teeth"
                                        :key="key + 0"
                                        class="list-item"
                                    >{{ key | toCurrentTeethSystem(currentClinic.teethSystem) }}</span>
                                </transition-group>
                            </span>
                        </span>
                    </template>
                    <wizard-tab
                        v-if="showTab('locations')"
                        name="locations"
                        :before-change="() => validateStep('step1')"
                    >
                        <template slot="label">
                            Locations
                        </template>
                        <t-item-tooth-locations
                            ref="step1"
                            v-model="selectedItemLocal"
                            :original-item="originalItem"
                            :jaw="jaw"
                            :error.sync="errorLocations"
                            :selected-item="selectedItem"
                            :original-locations="originalItem.locations"
                            :teeth-schema="teethSchema"
                            :teeth-system="currentClinic.teethSystem"
                            :current-type="currentType"
                            @mounted-size="setSize"
                        />
                        <!-- @onToothSelected="onToothSelected" -->
                    </wizard-tab>

                    <wizard-tab
                        v-if="showTab('manipulations')"
                        name="manipulations"
                        :before-change="() => validateStep('step2')"
                    >
                        <template slot="label">
                            Manipulations
                        </template>
                        <t-item-manipulations
                            ref="step2"
                            :original-item="originalItem"
                            :item-i-d="itemToCreate.ID || null"
                            :size="jawListSize"
                            :currency-code="currentClinic.currencyCode"
                            :manipulations="currentClinic.manipulationsComputed"
                            @addManipulations="manipulationsCreated"
                        />
                    </wizard-tab>
                    <wizard-tab
                        v-if="showTab('files')"
                        name="files"
                        :before-change="() => validateStep('step3')"
                    >
                        <template slot="label">
                            Files
                        </template>
                        <t-item-files
                            ref="step3"
                            :size="jawListSize"
                            :descriptions="procedureDescriptions"
                        />
                    </wizard-tab>
                    <wizard-tab
                        v-if="showTab('description')"
                        name="description"
                        :before-change="() => validateStep('step4')"
                    >
                        <template slot="label">
                            Description
                        </template>
                        <t-item-description
                            ref="step4"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="originalDescriptions"
                            @updateDescription="updateDescription"
                        />
                    </wizard-tab>
                    <wizard-tab
                        v-if="showTab('appointment')"
                        name="appointment"
                        :before-change="() => validateStep('step5')"
                    >
                        <template slot="label">
                            Appointment
                        </template>
                        <t-item-appointment
                            ref="step5"
                            :show-appointment="showAppointment"
                            :size="jawListSize"
                        />
                    </wizard-tab>
                </simple-wizard>
            </div>
        </div>
    </md-dialog>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';
import { mapGetters } from 'vuex';
import TItemToothLocations from './TWizardItems/TItemToothLocations.vue';
import TItemDescription from './TWizardItems/TItemDescription.vue';
import TItemManipulations from './TWizardItems/TItemManipulations.vue';
import TItemFiles from './TWizardItems/TItemFiles.vue';
import TItemAppointment from './TWizardItems/TItemAppointment.vue';
import SimpleWizard from '../TWizard/Wizard';
import WizardTab from '../TWizard/WizardTab';

import { tObjProp } from '@/mixins';
import {
    NOTIFY,
    PATIENT_PROCEDURE_SET,
    // PATIENT_MANIPULATION_SET,
} from '@/constants';

export default {
    name: 'TWizardAddItem',
    components: {
        SlideYDownTransition,
        TItemToothLocations,
        TItemDescription,
        TItemManipulations,
        TItemFiles,
        TItemAppointment,
        SimpleWizard,
        WizardTab,
    },
    mixins: [tObjProp],
    props: {
        isDialogVisible: {
            type: Boolean,
            default: false,
        },
        jaw: {
            type: Object,
            default: () => {},
        },
        currentType: {
            type: String,
            default: () => 'diagnosis',
        },
        singleItemName: {
            type: String,
            default: () => 'diagnose',
        },
        selectedItem: {
            type: Object,
            default: () => ({
                ID: '',
                code: '',
                title: '',
                manipulations: [],
            }),
        },
    },
    data() {
        return {
            errorLocations: {
                message: 'Choose tooth or disease location',
                type: 'locations',
                show: 'false',
            },
            showAppointment: false,
            isLoading: false,
            currentTab: '',
            jawListSize: {},
            description: '',
            // needToSaveEdited: false,
            selectedTeethL: [],
            // selectedTeethLocalJaw: [],
            itemToCreate: {
                ID:null,
                teeth: {},
                description: '',
                manipulations: [],
                code: '',
                title: '',
            },
            itemToCompare: {
                ID:null,
                teeth: {},
                description: '',
                manipulations: [],
                code: '',
                title: '',
            },
        };
    },
    computed: {
        ...mapGetters({
            procedureDescriptions: 'procedureDescriptions',
            anamnesDescriptions: 'anamnesDescriptions',
            diagnoseDescriptions: 'diagnoseDescriptions',
            currentClinic: 'getCurrentClinic',
            patient: 'getPatient',
            currentPlan: 'getCurrentPlan',
            teethSchema: 'teethSchema',
            getCurrentClinicOriginalItem: 'getCurrentClinicOriginalItem',
        }),
        teethToWatch(){
            return this.itemToCreate.teeth
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
            let catalogID = this.selectedItem[this.getItemCatalogFieldName()]
            return this.getCurrentClinicOriginalItem(this.currentType, catalogID)
        },
        selectedItemLocal: {
            get() {
                return this.selectedItem;
            },
            set(newValue) {
                Object.keys(newValue).forEach(k=>{
                    this.itemToCreate.teeth = this.lodash.cloneDeep(newValue.teeth);
                })
            },
        },
        isDialogVisibleL: {
            get() {
                return this.isDialogVisible;
            },
            set(value) {
                this.$emit('update:isDialogVisible', value);
            },
        },
    },
    created() {
        this.hasLoctionsKey(this.selectedItem.code);
        this.initiateLocalItem();
        this.description = this.selectedItem.description;
    },
    methods: {
        needToSaveItem() {
            return !this.itemToCreate.ID;
        },
        needToSaveEdited() {
            return !this.lodash.isEqual(this.itemToCreate.teeth, this.itemToCompare.teeth )
            if (!this.currentTab || this.currentTab === 'locations') {
            }
            return false;
        },

        getItemCatalogFieldName(){
            if(this.currentType==='diagnosis'){
                return 'catalogDiagnoseID'
            }
            else if(this.currentType==='procedures'){
                return 'catalogProcedureID'
            }
            else if(this.currentType==='anamnesis'){
                return 'catalogAnamnesID'
            } else{
                return null
            }
        },
        setProcedure() {
            const procedure = {
                procedureID: this.itemToCreate.catalogProcedureID,
                teeth: this.itemToCreate.teeth,
            };
            this.isLoading = true;
            return new Promise((resolve, reject) => {
                this.$store
                    .dispatch(PATIENT_PROCEDURE_SET, {
                        procedure,
                    })
                    .then(
                        (response) => {
                            this.itemToCreate.ID = response.ID;
                            this.itemToCreate.teeth = response.teeth;
                            this.itemToCompare = this.lodash.cloneDeep(response);
                            this.isLoading = false;
                            resolve(true);
                        },
                        (error) => {
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: 'error.response.data.error',
                                    type: 'warning',
                                },
                            });
                            this.isLoading = false;
                            reject(error);
                        },
                    ).catch((err) => {
                        this.isLoading = false;
                        throw new Error(err);
                    });
            });
        },
        saveItem() {
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
                if (this.needToSaveItem()) {
                    return Promise.resolve(this.setProcedure());

                }
                else if(this.needToSaveEdited()) {
                    console.log('here we update item====================')
                    this.itemToCreate.teeth = this.lodash.cloneDeep(this.itemToCompare.teeth);
                    return true;
                }else {
                    return true;
                }
            }
            return false;
        },
        onTabChange(oldTab, newTab) {
            // странные значения newTab
            // 1 = первый таб
            // 3 = второй таб
            // 5 = третий таб
            // 7 = четвертый таб
            // 9 = пятый таб
            this.currentTab = newTab.$attrs.name;
            // console.log(newTab)
            if (this.currentType === 'procedures') {
                this.showAppointment = true;
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
        updateDescription(description) {
            this.itemToCreate.description = description || '';
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
            if (ref === 'step1') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then((res) => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please choose tooth locations',
                                type: 'warning',
                            },
                        });
                    }
                    if (res) {
                        return Promise.resolve(this.saveItem());
                    }
                    return res;
                });
            }
            if (ref === 'step2') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then((res) => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'You have unsaved manipulation',
                                type: 'warning',
                            },
                        });
                    }
                    return res;
                });
            }
            if (ref === 'step3') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then((res) => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please add dignose description',
                                type: 'warning',
                            },
                        });
                        return false;
                    }
                    return res;
                });
            }
            if (ref === 'step4') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then((res) => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please add dignose description',
                                type: 'warning',
                            },
                        });
                        return false;
                    }
                    if (this.currentType !== 'procedures') {
                        this.itemCreated();
                        this.isDialogVisibleL = false;
                    }
                    return res;
                });
            }
            if (ref === 'step5') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then((res) => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please add dignose description',
                                type: 'warning',
                            },
                        });
                        return false;
                    }
                    this.itemCreated();
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
                return (
                    this.hasManipulations() || this.currentType === 'procedures'
                );
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
        },
    },
};
</script>
