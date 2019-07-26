<template>
    <md-dialog
        :md-click-outside-to-close="!isLoading"
        :md-active.sync="isDialogVisibleL"
        class="jaw-dialog-wrapper"
    >
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard
                    :finishButtonText="`Save ${singleItemName}`"
                    @tab-change="onTabChange"
                    :tabColor="tabColor"
                    :isLoading="isLoading"
                    :validateMode="!needToSaveItem()"
                >
                    <template slot="header">
                        {{needToSaveItem()}}{{itemToCreate.ID}}
                        <h5 class="title">
                            {{singleItemName | capitilize}} adding:
                            <b>{{selectedItem.code}}</b>
                            {{selectedItem.title}}
                            <span
                                v-if="currentPlan.name"
                                class="category"
                            >– {{currentPlan.name | capitilize}}</span>
                        </h5>
                        <span>
                            <span v-if="hasLocationKeyOrSelectedTeeth()" class="category">
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
                                    >{{ key | toCurrentTeethSystem(teethSystem) }}</span>
                                </transition-group>
                            </span>
                        </span>
                    </template>
                    <wizard-tab
                        name="locations"
                        v-if="showTab('locations')"
                        :before-change="() => validateStep('step1')"
                    >
                        <template slot="label">Locations</template>
                        <t-item-tooth-locations
                            ref="step1"
                            @mounted-size="setSize"
                            @onToothSelected="onToothSelected"
                            :originalItem="originalItem"
                            :jaw="jaw"
                            :error.sync="errorLocations"
                            :selectedItem="selectedItem"
                            :originalLocations="originalItem.locations"
                            :selectedTeeth="selectedTeeth"
                            v-model="selectedProcedureLocal"
                            :teethSchema="teethSchema"
                            :teethSystem="teethSystem"
                            :currentType="currentType"
                        />
                    </wizard-tab>

                    <wizard-tab
                        name="manipulations"
                        :before-change="() => validateStep('step2')"
                        v-if="showTab('manipulations')"
                    >
                        <template slot="label">Manipulations</template>
                        <t-item-manipulations
                            ref="step2"
                            :originalItem="originalItem"
                            :itemID="itemToCreate.ID || null"
                            :selectedTeeth="selectedTeethLocalJaw"
                            :size="jawListSize"
                            @addManipulations="manipulationsCreated"
                            :currencyCode="clinic.currencyCode"
                            :manipulations="clinic.manipulationsComputed"
                        />
                    </wizard-tab>
                    <wizard-tab
                        name="files"
                        :before-change="() => validateStep('step3')"
                        v-if="showTab('files')"
                    >
                        <template slot="label">Files</template>
                        <t-item-files
                            ref="step3"
                            :size="jawListSize"
                            :descriptions="procedureDescriptions"
                        />
                    </wizard-tab>
                    <wizard-tab
                        name="description"
                        :before-change="() => validateStep('step4')"
                        v-if="showTab('description')"
                    >
                        <template slot="label">Description</template>
                        <t-item-description
                            ref="step4"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="originalDescriptions"
                            @updateDescription="updateDescription"
                        />
                    </wizard-tab>
                    <wizard-tab
                        name="appointment"
                        :before-change="() => validateStep('step5')"
                        v-if="showTab('appointment')"
                    >
                        <template slot="label">Appointment</template>
                        <t-item-appointment
                            :showAppointment="showAppointment"
                            ref="step5"
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
    import { SimpleWizard, WizardTab } from '@/components';
    import { tObjProp } from '@/mixins';
    import {
        NOTIFY,
        PATIENT_PROCEDURE_SET,
        PATIENT_MANIPULATION_SET,
    } from '@/constants';

    export default {
        name: 't-wizard-add-item',
        mixins: [tObjProp],
        props: {
            currentPlan: {
                type: Object,
                default: () => {},
            },
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
            selectedTeeth: {
                type: Array,
                default: () => [],
            },
            teethSchema: {
                type: Object,
                default: () => {},
            },
            teethSystem: {
                type: Number,
                default: () => 1,
            // 1 = FDI World Dental Federation notation
            // 2 = Universal numbering system
            // 3 = Palmer notation method
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
                selectedTeethL: [],
                selectedTeethLocalJaw: [],
                itemToCreate: {
                    teeth: {},
                    description: '',
                    manipulations: [],
                    code: '',
                    title: '',
                },
                itemToCompare: {
                    teeth: {},
                    description: '',
                    manipulations: [],
                    code: '',
                    title: '',
                },
            };
        },
        components: {
            SimpleWizard,
            WizardTab,
            SlideYDownTransition,
            TItemDescription,
            TItemFiles,
            TItemManipulations,
            TItemToothLocations,
            TItemAppointment,
        },
        methods: {
            setProcedure() {
                const procedure = {
                    procedureID: this.itemToCreate.procedureID,
                    teeth: this.itemToCreate.teeth,
                };
                this.isLoading = true;
                // return true;
                return new Promise((resolve, reject) => {
                    this.$store
                        .dispatch(PATIENT_PROCEDURE_SET, {
                            planID: this.currentPlan.ID,
                            patientID: this.patient.ID,
                            procedure,
                        })
                        .then(
                            (response) => {
                                this.itemToCreate.ID = response.ID;
                                this.itemToCreate.teeth = response.teeth;
                                this.itemToCompare.ID = response.ID;
                                this.itemToCompare.teeth = response.teeth;
                                resolve(true);
                                this.isLoading = false;
                            },
                            (error) => {
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'error.response.data.error',
                                        type: 'warning',
                                    },
                                });
                                reject(error);
                                this.isLoading = false;
                            },
                        ).catch((err) => {
                            console.log(err);
                            this.isLoading = false;
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
                    return true;
                }
                return false;
            },
            needToSaveItem() {
                if (!this.currentTab || this.currentTab === 'locations') {
                    if (!this.itemToCreate.ID) {
                        return true;
                    }
                    // console.log(this.itemToCreate.teeth, this.itemToCompare.teeth);
                    return !this.lodash.isEqual(this.itemToCreate.teeth, this.itemToCompare.teeth);
                }
                if (this.currentTab === 'manipulations') {
                    // console.log(this.itemToCreate.teeth, this.itemToCompare.teeth);
                    return !this.lodash.isEqual(this.itemToCreate.manipulations, this.itemToCompare.manipulations);
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
                if (this.currentType === 'procedures') {
                    this.showAppointment = true;
                }
            },
            onToothSelected(selectedTeethLocalJaw) {
                this.selectedTeethLocalJaw = [];
                this.selectedTeethLocalJaw = selectedTeethLocalJaw;
            },
            // инициируем локальный диагноз
            initiateLocalItem() {
                Object.keys(this.selectedItem).forEach((key) => {
                    this.$set(this.itemToCompare, key, this.selectedItem[key]);
                });
            },
            manipulationsCreated(manipulations) {
                this.itemToCreate.manipulations = manipulations;
            },
            updateDescription(description) {
                this.itemToCreate.description = description || '';
            },
            itemCreated() {
                this.$emit('on-created', this.itemToCreate);
            },
            unsetLocalDiagnose() {
                this.itemToCreate.teeth = {};
                this.itemToCreate.description = '';
                this.itemToCreate.description = '';
                this.itemToCreate.type = '';
                this.itemToCreate.code = '';
                this.itemToCreate.title = '';
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
                    return this.selectedTeethL.length > 0;
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
                        if (res) {
                            return Promise.resolve(this.setManipulations());
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
        computed: {
            ...mapGetters({
                procedureDescriptions: 'procedureDescriptions',
                anamnesDescriptions: 'anamnesDescriptions',
                diagnoseDescriptions: 'diagnoseDescriptions',
                clinic: 'getCurrentClinic',
                anamnesis: 'getProcedures',
                procedures: 'getProcedures',
                diagnosis: 'getDiagnosis',
                patient: 'getPatient',
            }),
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
            //! переделать
            originalItem() {
                return this.selectedItem;
            },
            selectedProcedureLocal: {
                get() {
                    return this.selectedItem;
                },
                set(newValue) {
                    // необходимо для реактивности создоваемого диагногза внутри данного компонента
                    this.unsetLocalDiagnose();
                    this.itemToCreate = this.copyObj(newValue);
                    // console.log(this.itemToCreate);
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
            this.selectedTeethL = this.copyObj(this.selectedTeeth);
            this.hasLoctionsKey(this.selectedItem.code);
            this.initiateLocalItem();
            this.description = this.selectedItem.description;
        },
    };
</script>
