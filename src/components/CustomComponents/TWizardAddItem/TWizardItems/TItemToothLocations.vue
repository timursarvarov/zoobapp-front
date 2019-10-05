<template>
    <div ref="parent" class="tooth-locations-wrapper wizard-tab-content">
        <jaw-add-locations
            v-model="newProcedureParamsLocal"
            :jaw="jaw"
            :original-item="originalItem"
            :selected-item="selectedItem"
            :selected-teeth="selectedTeeth"
            :teeth-schema="teethSchema"
            :teeth-system="teethSystem"
            :default-locations="defaultLocations"
            :current-type="currentType"
            @onToothSelected="onToothSelected"
        >
            <div slot="title">
                <slide-y-down-transition>
                    <span
                        v-show="errors.has('locations')"
                        :class="[{ error: errors.has('locations') }, { 'md-valid': !errors.has('locations') && touched.locations }]"
                        >{{ errors.first('locations') }}</span
                    >
                </slide-y-down-transition>
            </div>
        </jaw-add-locations>
        <div v-show="false">
            <md-field slot="inputs" class="md-form-group">
                <md-icon>lock_outline</md-icon>
                <label>code</label>
                <md-input v-model="locations" v-validate="modelValidations.locations" data-vv-name="locations" type="locations" />
                <span class="md-error">{{ errors.first('locations') }}</span>
                <slide-y-down-transition>
                    <md-button v-show="errors.has('locations')" class="md-just-icon md-round md-input-action clear-button md-simple">
                        <md-icon class="error">
                            close
                        </md-icon>
                    </md-button>
                </slide-y-down-transition>
                <slide-y-down-transition>
                    <md-icon v-show="!errors.has('locations') && touched.locations" class="success">
                        done
                    </md-icon>
                </slide-y-down-transition>
            </md-field>
        </div>
    </div>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';
import { NOTIFY } from '@/constants';
import JawAddLocations from '@/components/CustomComponents/Jaw/JawAddLocations';

import { tObjProp } from '@/mixins';

export default {
    name: 'TLocationsWizardItems',
    components: {
        SlideYDownTransition,
        JawAddLocations
    },
    mixins: [tObjProp],
    model: {
        prop: 'newItemParams',
        event: 'updateItemParams'
    },
    props: {
        error: {
            type: Object,
            default: () => ({
                message: 'Choose tooth or procedure location',
                type: 'locations',
                show: 'false'
            })
        },
        jaw: {
            type: Object,
            default: () => {}
        },
        defaultLocations: {
            type: Object,
            default: () => {}
        },
        // локации оригинального диагноза для проверки валидации
        originalLocations: {
            type: Object,
            default: () => {}
        },
        selectedItem: {
            type: Object,
            default: () => ({
                title: '',
                code: ''
            })
        },
        selectedTeeth: {
            type: Array,
            default: () => []
        },
        newItemParams: {
            type: Object,
            default: () => {}
        },
        currentType: {
            type: String,
            default: () => 'diagnosis'
        },
        teethSchema: {
            type: Object,
            default: () => {}
        },
        originalItem: {
            type: Object,
            default: () => {}
        },
        teethSystem: {
            type: Number,
            default: () => 1
            // 1 = FDI World Dental Federation notation
            // 2 = Universal numbering system
            // 3 = Palmer notation method
        }
    },
    data() {
        return {
            procedureLocal: {},
            modelValidations: {
                locations: {
                    required: true
                }
            },
            dialogWidth: '',
            locations: '',
            touched: {
                locations: false
            }
        };
    },
    computed: {
        newProcedureParamsLocal: {
            get() {
                return this.newItemParams;
            },
            set(newValue) {
                this.$emit('updateItemParams', newValue);
                this.procedureLocal = {};
                this.procedureLocal = newValue;
                this.locations = this.isValidLoctions() ? 1 : '';
            }
        }
    },
    watch: {
        locations() {
            this.touched.locations = true;
        }
    },
    created() {
        this.locations = this.isValidLoctions() ? 1 : '';
        window.addEventListener('resize', this.matchWidth);
        this.matchWidth();
    },
    destroyed() {
        window.removeEventListener('resize', this.matchWidth);
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
                    height: this.$refs.parent.clientHeight
                };
                this.$emit('mounted-size', size);
            }
        },
        validate() {
            return this.$validator.validateAll().then(res => {
                if (!res) {
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: this.errors.first('locations'),
                            type: 'warning'
                        }
                    });
                }
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
        }
    }
};
</script>
