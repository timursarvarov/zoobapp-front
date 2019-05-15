<template>
    <md-dialog :md-active.sync="isDialogVisibleL" class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard finishButtonText="Save Anamnes">
                    <template slot="header">
                        <h5 class="title">
                            <b>{{selectedAnamnes.code}}</b>
                            {{selectedAnamnes.title}}
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
                            <span v-else class="category">{{selectedAnamnes.explain}}</span>
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
                            :selectedAnamnes="selectedAnamnes"
                            :originalLocations="originalAnamnes.locations"
                            :selectedTeeth="selectedTeeth"
                            v-model="selectedAnamnesLocal"
                            :teethSchema="teethSchema"
                            :teethSystem="teethSystem"
                            @mounted-size="setSize"
                            @onToothSelected="onToothSelected"
                        />
                    </wizard-tab>
                    <wizard-tab :before-change="() => validateStep('step2')">
                        <template slot="label">Description</template>
                        <anamnes-description
                            ref="step2"
                            v-model="description"
                            :size="jawListSize"
                            :descriptions="anamnesDescriptions"
                            @on-validated="anamnesCreated"
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
    import AnamnesDescription from './Wizard/AnamnesDescription.vue';
    import { SimpleWizard, WizardTab } from '@/components';
    import { mapGetters } from 'vuex';
    import { NOTIFY, PROCEDURES } from '@/constants';
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
            selectedAnamnes: {
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
                    description: '',
                    explain: '',
                    code: '',
                    title: '',
                },
            };
        },
        components: {
            AnamnesDescription,
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
                Object.keys(this.selectedAnamnes).forEach((key) => {
                    this.itemToCreate[key] = this.selectedAnamnes[key];
                });
                this.itemToCreate.date = new Date();
            },
            manipulationsCreated(manipulations) {
                this.itemToCreate.manipulations = manipulations;
            },
            anamnesCreated() {
                this.itemToCreate.description = this.description;
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
                if (ref === 'step2') {
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
                anamnesDescriptions: 'procedureDescriptions',
                clinic: 'getCurrentClinic',
            }),
            originalAnamnes() {
                const originalCode = this.selectedAnamnes.code;
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
            anamnesis() {
                return PROCEDURES;
            },
            selectedAnamnesLocal: {
                get() {
                    return this.selectedAnamnes;
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
            this.hasLoctionsKey(this.selectedAnamnes.code);
            this.initiateLocalDiagnose();
            this.description = this.selectedAnamnes.description;
        },
    };
</script>
<style lang="scss">
.jaw-dialog-wrapper {
    // min-width: 550px;
    min-height: 80% !important;
    max-height: 100% !important;
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
