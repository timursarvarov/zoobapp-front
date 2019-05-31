<template>
    <md-dialog :md-active.sync="isDialogVisibleL" class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard finishButtonText="Save Procedure">
                    <template slot="header">
                        <h5 class="title">
                            <b>{{selectedProcedure.code}}</b>
                            {{selectedProcedure.title}}
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
                            <span v-else class="category">{{selectedProcedure.explain}}</span>
                        </span>
                    </template>
                    <wizard-tab
                        v-if="hasLocationKeyOrSelectedTeeth()"
                        :before-change="() => validateStep('step1')"
                    >
                        <template slot="label">Locations</template>
                        <tooth-locations
                            ref="step1"
                            :jaw="jaw"
                            :prefer="prefer"
                            :error.sync="errorLocations"
                            :selectedProcedure="selectedProcedure"
                            :originalLocations="originalProcedure.locations"
                            :selectedTeeth="selectedTeeth"
                            v-model="selectedProcedureLocal"
                            :teethSchema="teethSchema"
                            :teethSystem="teethSystem"
                            @mounted-size="setSize"
                            @onToothSelected="onToothSelected"
                        />
                    </wizard-tab>

                    <wizard-tab :before-change="() => validateStep('step2')">
                        <template slot="label">Manipulations</template>
                        <manipulations
                            ref="step2"
                            v-model="description"
                            :manipulationsToEdit="selectedProcedure.manipulations"
                            :selectedTeeth="selectedTeethLocalJaw"
                            :size="jawListSize"
                            @addManipulations="manipulationsCreated"
                            :currencyCode="clinic.currencyCode"
                        />
                    </wizard-tab>
                    <wizard-tab :before-change="() => validateStep('step3')">
                        <template slot="label">Description</template>
                        <procedure-description
                            ref="step3"
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
            prefer: {
                type: String,
                default: () => 'diagnose',
            },
            selectedProcedure: {
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
        },
        methods: {
            onToothSelected(selectedTeethLocalJaw) {
                this.selectedTeethLocalJaw = [];
                this.selectedTeethLocalJaw = selectedTeethLocalJaw;
            },
            // инициируем локальный диагноз
            initiateLocalDiagnose() {
                Object.keys(this.selectedProcedure).forEach((key) => {
                    this.itemToCreate[key] = this.selectedProcedure[key];
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
                const originalCode = this.selectedProcedure.code;
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
                    return this.selectedProcedure;
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
            this.hasLoctionsKey(this.selectedProcedure.code);
            this.initiateLocalDiagnose();
            this.description = this.selectedProcedure.description;
        },
    };
</script>
<style lang="scss">
.jaw-dialog-wrapper {
    overflow-y: scroll;
      &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgb(255, 255, 255);
            border-radius: 7px;
        }
    min-height: 80vh !important;
    max-height: 100vh !important;
    background-color: transparent !important;
    box-shadow: none;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-font-smoothing: antialiased !important;
    .md-dialog-container {
        padding: 0 9px;
    }
    .tab-content {
        padding: 0;
        min-height: 65vh;
    }
    .wizard-add-diagnose-form {
        .md-card-header {
            text-align: left;
            .list-item {
                display: inline-block;
                margin-right: 10px;
            }
            .list-enter-active,
            .list-leave-active {
                transition: all 1s;
            }
            .list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
                opacity: 0;
                transform: translateY(30px);
            }
        }
    }
}
</style>
