<template>
    <md-dialog :md-active.sync="isDialogVisibleL" class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard finishButtonText="Save Anamnes">
                    <template slot="header">
                        <h5 class="title">
                            <b>{{selectedItem.code}}</b>
                            {{selectedItem.title}}
                        </h5>
                        <span>
                            <span v-if="hasLocationKeyOrSelectedTeeth()" class="category">
                                <span v-if="isEmpty(itemToCreate.teeth)">Please selesct tooth</span>
                                <span v-else>
                                    <slide-y-down-transition>
                                        <span v-show="!isEmpty(originalAnamnes.locations)">For:</span>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <span
                                            v-show="isEmpty(originalAnamnes.locations)"
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
                            :locationType="locationType"
                            :error.sync="errorLocations"
                            :selectedItem="selectedItem"
                            :originalLocations="originalAnamnes.locations"
                            :selectedTeeth="selectedTeeth"
                            v-model="selectedAnamnesLocal"
                            :teethSchema="teethSchema"
                            :teethSystem="teethSystem"
                            @mounted-size="setSize"
                            @onToothSelected="onToothSelected"
                        />
                    </wizard-tab>
                    <!-- <wizard-tab :before-change="() => validateStep('step2')">
                        <template slot="label">Description</template>
                        <t-item-description
                            ref="step2"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="itemDescriptions"
                            @on-validated="anamnesCreated"
                        />
                    </wizard-tab> -->
                      <wizard-tab v-if="selectedItem.manipulations && selectedItem.manipulations.length <= 0"  :before-change="() => validateStep('step2')">
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
                            :descriptions="itemDescriptions"
                        />
                    </wizard-tab>
                    <wizard-tab :before-change="() => validateStep('step4')">
                        <template slot="label">Description</template>
                        <t-item-description
                            ref="step4"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="itemDescriptions"
                            @on-validated="itemCreated"
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
    import {
 SimpleWizard, WizardTab, TItemDescription,
             TItemFiles,
             TItemManipulations,
             TItemToothLocations 
} from '@/components';
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
                    manipulations: [],
                    description: '',
                    explain: '',
                    code: '',
                    title: '',
                },
            };
        },
        components: {
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
                this.itemToCreate.manipulations = manipulations;
            },
            itemCreated() {
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
                if (this.originalAnamnes) {
                    return 'locations' in this.originalAnamnes;
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
                // if (ref === 'step2') {
                //     return this.$refs[ref].validate().then((res) => {
                //         if (!res) {
                //             this.$store.dispatch(NOTIFY, {
                //                 settings: {
                //                     message: 'Please add dignose description',
                //                     type: 'warning',
                //                 },
                //             });
                //             return false;
                //         }
                //         this.isDialogVisibleL = false;
                //         this.$store.dispatch(NOTIFY, {
                //             settings: {
                //                 message: 'Diagnose added',
                //                 type: 'success',
                //             },
                //         });
                //         return res;
                //     });
                // }
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
                itemDescriptions: 'procedureDescriptions',
                clinic: 'getCurrentClinic',
                anamnesis: 'getProcedures',
            }),
            originalAnamnes() {
                const originalCode = this.selectedItem.code;
                for (let index = 0; index < this.anamnesis.length; index += 1) {
                    const dGrooup = this.anamnesis[index];
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
            selectedAnamnesLocal: {
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
            this.description = this.selectedItem.description;
        },
    };
</script>
