<template>
    <div class="tooth-locations-wrapper wizard-tab-content" ref="parent">
        <jaw-add-locations
            ref="jawadddiagnose"
            :jaw="jaw"
            :prefer="prefer"
            :selectedItem="selectedProcedure"
            :selectedTeeth="selectedTeeth"
            v-model="newProcedureParamsLocal"
            :teethSchema="teethSchema"
            :teethSystem="teethSystem"
            :defaultLocations="defaultLocations"
            locationType="procedures"
            :originalItemsGrouped="procedures"
            @onToothSelected="onToothSelected"
        >
            <div slot="title">
                <slide-y-down-transition>
                    <span
                        v-show="errors.has('locations')"
                        :class="[{'error': errors.has('locations')},
            {'md-valid': !errors.has('locations') && touched.locations}]"
                    >{{errors.first('locations')}}</span>
                </slide-y-down-transition>
            </div>
        </jaw-add-locations>
        <div v-show="false">
            <md-field class="md-form-group" slot="inputs">
                <md-icon>lock_outline</md-icon>
                <label>code</label>
                <md-input
                    v-model="locations"
                    data-vv-name="locations"
                    type="locations"
                    v-validate="modelValidations.locations"
                ></md-input>
                <span class="md-error">{{errors.first('locations')}}</span>
                <slide-y-down-transition>
                    <md-button
                        v-show="errors.has('locations')"
                        class="md-just-icon md-round md-input-action clear-button md-simple"
                    >
                        <md-icon class="error">close</md-icon>
                    </md-button>
                </slide-y-down-transition>
                <slide-y-down-transition>
                    <md-icon
                        class="success"
                        v-show="!errors.has('locations') && touched.locations"
                    >done</md-icon>
                </slide-y-down-transition>
            </md-field>
        </div>
    </div>
</template>
<script>
    import { JawAddLocations } from '@/components';
    import { SlideYDownTransition } from 'vue2-transitions';
    import { tObjProp } from '@/mixins';
    import { mapGetters } from 'vuex';

    export default {
        mixins: [tObjProp],
        components: {
            SlideYDownTransition,
            JawAddLocations,
        },
        model: {
            prop: 'newDiagnoseParams',
            event: 'updateDiagonoseParams',
        },
        props: {
            error: {
                type: Object,
                default: () => ({
                    message: 'Choose tooth or procedure location',
                    type: 'locations',
                    show: 'false',
                }),
            },
            jaw: {
                type: Object,
                default: () => {},
            },
            defaultLocations: {
                type: Object,
                default: () => {},
            },
            // локации оригинального диагноза для проверки валидации
            originalLocations: {
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
                    title: '',
                    code: '',
                }),
            },
            selectedTeeth: {
                type: Array,
                default: () => [],
            },
            newDiagnoseParams: {
                type: Object,
                default: () => {},
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
                procedureLocal: {},
                modelValidations: {
                    locations: {
                        required: true,
                    },
                },
                dialogWidth: '',
                locations: '',
                touched: {
                    locations: false,
                },
            };
        },
        methods: {
            onToothSelected(selectedTeeth) {
                this.$emit('onToothSelected', selectedTeeth);
            },
            matchWidth() {
                if (this.$refs.parent) {
                    this.dialogWidth = this.$refs.parent.clientWidth;
                    const size = {
                        width: this.$refs.parent.clientWidth,
                        height: this.$refs.parent.clientHeight,
                    };
                    this.$emit('mounted-size', size);
                }
            },
            validate() {
                return this.$validator.validateAll().then((res) => {
                    this.$emit('on-validated', res);
                    this.matchWidth();
                    return res;
                });
            },
            isValidLoctions() {
                if (this.originalLocations === undefined) {
                    return true;
                }
                if (this.isEmpty(this.originalLocations)) {
                    return true;
                }
                return !this.isEmpty(this.procedureLocal.teeth);
            },
        },
        computed: {
            ...mapGetters({
                procedures: 'getProcedures',

            }),
            newProcedureParamsLocal: {
                get() {
                    return this.newDiagnoseParams;
                },
                set(newValue) {
                    this.$emit('updateDiagonoseParams', newValue);
                    this.procedureLocal = {};
                    this.procedureLocal = newValue;
                    this.locations = this.isValidLoctions() ? 1 : '';
                },
            },
        },
        created() {
            this.locations = this.isValidLoctions() ? 1 : '';
            window.addEventListener('resize', this.matchWidth);
            this.matchWidth();
        },
        destroyed() {
            window.removeEventListener('resize', this.matchWidth);
        },
        watch: {
            locations() {
                this.touched.locations = true;
            },
        },
    };
</script>
