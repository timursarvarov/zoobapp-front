<template>
    <md-dialog :md-active.sync="isDialogVisibleL" class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard finishButtonText="Save Procedure">
                    <template slot="header">
                        <h5 class="title">
                            <b>{{selectedItem.code}}</b>
                            {{selectedItem.title}}
                            <span
                                class="category"
                            >– {{currentPlan.title | capitilize}}</span>
                        </h5>
                        <span>
                            <span v-if="hasLocationKeyOrSelectedTeeth()" class="category">
                                <span v-if="isEmpty(itemToCreate.teeth)">Please selesct tooth</span>
                                <span v-else>
                                    <slide-y-down-transition>
                                        <span v-show="!isEmpty(originalProcedure.locations)">For:</span>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <span
                                            v-show="isEmpty(originalProcedure.locations)"
                                        >Disease area:</span>
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
                            <span v-else class="category">{{selectedItem.explain}}</span>
                        </span>
                    </template>
                    <wizard-tab
                        v-if="hasLocationKeyOrSelectedTeeth()"
                        :before-change="() => validateStep('step1')"
                    >
                        <template slot="label">Locations</template>
                        <t-item-tooth-locations
                            ref="step1"
                            :jaw="jaw"
                            :error.sync="errorLocations"
                            :selectedItem="selectedItem"
                            :originalLocations="originalProcedure.locations"
                            :selectedTeeth="selectedTeeth"
                            v-model="selectedProcedureLocal"
                            :teethSchema="teethSchema"
                            :teethSystem="teethSystem"
                            @mounted-size="setSize"
                            @onToothSelected="onToothSelected"
                            :locationType="locationType"
                        />
                    </wizard-tab>

                    <wizard-tab :before-change="() => validateStep('step2')">
                        <template slot="label">Manipulations</template>
                        <t-item-manipulations
                            ref="step2"
                            v-model="description"
                            :manipulationsToEdit="selectedItem.manipulations"
                            :selectedTeeth="selectedTeethLocalJaw"
                            :size="jawListSize"
                            @addManipulations="manipulationsCreated"
                            :currencyCode="clinic.currencyCode"
                        />
                    </wizard-tab>
                     <wizard-tab :before-change="() => validateStep('step3')">
                        <template slot="label">Add files</template>
                        <t-item-files
                            ref="step3"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="procedureDescriptions"
                        />
                    </wizard-tab>
                    <wizard-tab :before-change="() => validateStep('step4')">
                        <template slot="label">Description</template>
                        <t-item-description
                            ref="step4"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="procedureDescriptions"
                            @on-validated="procedureCreated"
                        />
                    </wizard-tab>
                </simple-wizard>
            </div>
        </div>
    </md-dialog>
</template>
<script>
    import { SlideYDownTransition } from 'vue2-transitions';
    import ToothLocations from './Wizard/ToothLocations.vue';
    import ProcedureDescription from './Wizard/ProcedureDescription.vue';
    import Manipulations from './Wizard/Manipulations.vue';
    import { SimpleWizard, WizardTab,  TItemDescription,
        TItemFiles,
        TItemManipulations,
        TItemToothLocations, } from '@/components';
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
            locationType: {
                type: String,
                default: () => 'diagnosis',
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
                jawListSize: {},
                description: '',
                selectedTeethL: [],
                selectedTeethLocalJaw: [],
                itemToCreate: {
                    teeth: {},
                    description: '',
                    manipulations: [],
                    explain: '',
                    code: '',
                    title: '',
                },
            };
        },
        components: {
            ProcedureDescription,
            Manipulations,
            SimpleWizard,
            WizardTab,
            ToothLocations,
            SlideYDownTransition,
             TItemDescription,
        TItemFiles,
        TItemManipulations,
        TItemToothLocations,
        },
        methods: {
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
                console.log(manipulations);
                this.itemToCreate.manipulations = manipulations;
            },
            procedureCreated() {
                this.itemToCreate.description = this.description || '';
                this.$emit('on-created', this.itemToCreate);
            },
            unsetLocalDiagnose() {
                this.itemToCreate.teeth = {};
                this.itemToCreate.description = '';
                this.itemToCreate.explain = '';
                this.itemToCreate.type = '';
                this.itemToCreate.code = '';
                this.itemToCreate.title = '';
            },
            hasLoctionsKey() {
                if (this.originalProcedure) {
                    return 'locations' in this.originalProcedure;
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
                        this.isDialogVisibleL = false;
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Diagnose added',
                                type: 'success',
                            },
                        });
                        return res;
                    });
                }
                return false;
            },
        },
        computed: {
            ...mapGetters({
                procedureDescriptions: 'procedureDescriptions',
                clinic: 'getCurrentClinic',
                procedures: 'getProcedures',
            }),
            originalProcedure() {
                const originalCode = this.selectedItem.code;
                for (let index = 0; index < this.procedures.length; index += 1) {
                    const dGrooup = this.procedures[index];
                    if (dGrooup.codes) {
                        const dIndex = dGrooup.codes
                            .map(d => d.code)
                            .indexOf(originalCode);
                        if (dIndex > -1) {
                            return dGrooup.codes[dIndex];
                        }
                    }
                }
                return false;
            },
            selectedProcedureLocal: {
                get() {
                    console.log(this.selectedItem);
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
            this.description = this.selectedItem.description;
        },
    };
</script>
