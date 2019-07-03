<template>
    <md-dialog :md-active.sync="isDialogVisibleL" class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard
                    :finishButtonText="`Save ${singleItemName}`"
                    @tab-change="onTabChange"
                    :tabColor="tabColor">
                    <template slot="header">
                        <h5 class="title">
                            Adding a {{singleItemName}}:
                            <b>{{selectedItem.code}}</b>
                            {{selectedItem.title}}
                            <span
                                v-if="currentPlan.title"
                                class="category"
                            >– {{currentPlan.title | capitilize}}</span>
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
                            :itemType="itemType"
                        />
                    </wizard-tab>

                    <wizard-tab
                        :before-change="() => validateStep('step2')"
                        v-if="showTab('manipulations')"
                    >
                        <template slot="label">Manipulations</template>
                        <t-item-manipulations
                            ref="step2"
                            :manipulationsToEdit="selectedItem.manipulations"
                            :selectedTeeth="selectedTeethLocalJaw"
                            :size="jawListSize"
                            @addManipulations="manipulationsCreated"
                            :currencyCode="clinic.currencyCode"
                        />
                    </wizard-tab>
                    <wizard-tab
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
    import TItemToothLocations from './TWizardItems/TItemToothLocations.vue';
    import TItemDescription from './TWizardItems/TItemDescription.vue';
    import TItemManipulations from './TWizardItems/TItemManipulations.vue';
    import TItemFiles from './TWizardItems/TItemFiles.vue';
    import TItemAppointment from './TWizardItems/TItemAppointment.vue';
    import { SimpleWizard, WizardTab } from '@/components';
    import { mapGetters } from 'vuex';
    import { NOTIFY } from '@/constants';
    import { tObjProp } from '@/mixins';

    export default {
        name: 'refistration-wizard',
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
            itemType: {
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
                jawListSize: {},
                description: '',
                selectedTeethL: [],
                selectedTeethLocalJaw: [],
                itemToCreate: {
                    teeth: {},
                    description: '',
                    manipulations: [],
                    description: '',
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
            onTabChange(oldTab, newTab) {
                if (this.itemType === 'procedures' && newTab.tabId === '4') {
                    this.showAppointment = true;
                }
            },
            onToothSelected(selectedTeethLocalJaw) {
                this.selectedTeethLocalJaw = [];
                this.selectedTeethLocalJaw = selectedTeethLocalJaw;
            },
            // инициируем локальный диагноз
            initiateLocalDiagnose() {
                Object.keys(this.selectedItem).forEach((key) => {
                    this.itemToCreate[key] = this.selectedItem[key];
                });
                this.itemToCreate.date = new Date();
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
                                    message: 'Please choose diseas locations',
                                    type: 'warning',
                                },
                            });
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
                                    message: 'Please add manipulation',
                                    type: 'warning',
                                },
                            });
                            return false;
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
                        } if (this.itemType !== 'procedures') {
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
                    return this.hasLocationKeyOrSelectedTeeth();
                }
                if (tab === 'manipulations') {
                    return (
                        this.hasManipulations() || this.itemType === 'procedures'
                    );
                }
                if (tab === 'files') {
                    return true;
                }
                if (tab === 'description') {
                    return true;
                }
                if (tab === 'appointment') {
                    return this.itemType === 'procedures';
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
            }),
            originalDescriptions() {
                if (this.itemType === 'diagnosis') {
                    return this.diagnoseDescriptions;
                }
                if (this.itemType === 'anamnesis') {
                    return this.anamnesDescriptions;
                }
                return this.procedureDescriptions;
            },
            tabColor() {
                if (this.itemType === 'diagnosis') {
                    return 'purple';
                }
                if (this.itemType === 'anamnesis') {
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
            this.initiateLocalDiagnose();
            this.description = this.selectedItem.description || this.selectedItem.description;
        },
    };
</script>
