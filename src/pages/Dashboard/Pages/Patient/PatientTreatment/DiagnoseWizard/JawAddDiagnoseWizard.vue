<template>
    <md-dialog :md-active.sync="isDialogVisibleL" class="jaw-dialog-wrapper noselect">
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard finishButtonText="Save Diagnose">
                    <template slot="header">
                        <h5 class="title">
                            <b>{{selectedItem.code}}</b>
                            {{selectedItem.title}}
                        </h5>
                        <span>
                            <span v-if="hasLocationKeyOrSelectedTeeth()" class="category">
                                <span v-if="isEmpty(diagnoseToCreate.teeth)">Please selesct tooth</span>
                                <span v-else>
                                    <slide-y-down-transition>
                                        <span v-show="!isEmpty(originalDiagnose.locations)">For:</span>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <span
                                            v-show="isEmpty(originalDiagnose.locations)"
                                        >Disease area:</span>
                                    </slide-y-down-transition>
                                </span>
                                <transition-group name="list">
                                    <span
                                        v-for="(item, key) in diagnoseToCreate.teeth"
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
                        <template slot="label">Location</template>
                        <t-item-tooth-locations
                            ref="step1"
                            :jaw="jaw"
                            :error.sync="errorLocations"
                            :selectedItem="selectedItem"
                            :originalLocations="originalDiagnose.locations"
                            :selectedTeeth="selectedTeeth"
                            v-model="selectedItemLocal"
                            :teethSchema="teethSchema"
                            :teethSystem="teethSystem"
                            @mounted-size="setSize"
                            :locationType="locationType"
                        />
                    </wizard-tab>

                    <wizard-tab :before-change="() => validateStep('step2')">
                        <template slot="label">Add files</template>
                        <t-item-files
                            ref="step2"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="diagnoseDescriptions"
                        />
                    </wizard-tab>
                    <wizard-tab :before-change="() => validateStep('step3')">
                        <template slot="label">Add description</template>
                        <t-item-description
                            ref="step3"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="diagnoseDescriptions"
                            @on-validated="diagnoseCreated"
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
    import DiagnoseDescription from './Wizard/DiagnoseDescription.vue';
    import DiagnoseFiles from './Wizard/DiagnoseFiles.vue';
    import {
        SimpleWizard,
        WizardTab,
        TItemDescription,
        TItemFiles,
        TItemManipulations,
        TItemToothLocations,
    } from '@/components';
    import { mapGetters } from 'vuex';
    import { NOTIFY } from '@/constants';
    import { tObjProp } from '@/mixins';

    export default {
        name: 'refistration-wizard',
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
                diagnoseToCreate: {
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
            DiagnoseDescription,
            SimpleWizard,
            WizardTab,
            ToothLocations,
            SlideYDownTransition,
            DiagnoseFiles,
            TItemDescription,
            TItemFiles,
            TItemManipulations,
            TItemToothLocations,
        },
        methods: {
            // инициируем локальный диагноз
            initiateLocalDiagnose() {
                Object.keys(this.selectedItem).forEach((key) => {
                    this.diagnoseToCreate[key] = this.selectedItem[key];
                });
                this.diagnoseToCreate.date = new Date();
            },
            diagnoseCreated() {
                this.diagnoseToCreate.description = this.description || '';
                this.$emit('on-created', this.diagnoseToCreate);
            },
            unsetLocalDiagnose() {
                this.diagnoseToCreate.teeth = {};
                this.diagnoseToCreate.description = '';
                this.diagnoseToCreate.explain = '';
                this.diagnoseToCreate.type = '';
                this.diagnoseToCreate.code = '';
                this.diagnoseToCreate.title = '';
            },
            hasLoctionsKey() {
                if (this.originalDiagnose) {
                    return 'locations' in this.originalDiagnose;
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
                    return this.$refs[ref].validate().then(res =>
                        // if (!res) {
                        //     this.$store.dispatch(NOTIFY, {
                        //         settings: {
                        //             message: 'Please add dignose description',
                        //             type: 'warning',
                        //         },
                        //     });
                        //     return false;
                        // }
                        // this.isDialogVisibleL = false;
                        // this.$store.dispatch(NOTIFY, {
                        //     settings: {
                        //         message: 'Diagnose added',
                        //         type: 'success',
                        //     },
                        // });
                        res,);
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
                diagnoseDescriptions: 'diagnoseDescriptions',
                diagnosis: 'getDiagnosis',
            }),
            originalDiagnose() {
                const originalCode = this.selectedItem.code;
                for (let index = 0; index < this.diagnosis.length; index += 1) {
                    const dGrooup = this.diagnosis[index];
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
            selectedItemLocal: {
                get() {
                    return this.selectedItem;
                },
                set(newValue) {
                    // необходимо для реактивности создоваемого диагногза внутри данного компонента
                    this.unsetLocalDiagnose();
                    this.diagnoseToCreate = this.copyObj(newValue);
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
