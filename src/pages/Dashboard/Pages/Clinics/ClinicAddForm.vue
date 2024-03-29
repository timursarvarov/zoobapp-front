<template>
    <div>
        <md-dialog class="patient-add-form" :md-active.sync="showForml" :md-click-outside-to-close="!isLoadingRegistration">
            <div>
                <md-card>
                    <md-card-header class="md-card-header-icon">
                        <div class="card-icon" :style="{ 'background-color': patientColor }">
                            <md-icon>business</md-icon>
                        </div>
                        <h4 class="title">
                            Add New Clinic
                        </h4>
                    </md-card-header>

                    <md-card-content class="md-layout">
                        <div class="md-layout-item md-size-100">
                            <md-field :class="[{ 'md-valid': !errors.has('name') && touched.name }, { 'md-error': errors.has('name') }]">
                                <label>Clinic name</label>
                                <md-input v-model="name" v-validate="modelValidations.name" type="text" data-vv-name="name" required />
                                <span class="md-error">{{ errors.first('name') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('name')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('name') && touched.name" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-100">
                            <md-field
                                :class="[
                                    { 'md-valid': !errors.has('description') && touched.description },
                                    { 'md-error': errors.has('description') }
                                ]"
                            >
                                <label>Description</label>
                                <md-textarea
                                    v-model="description"
                                    v-validate="modelValidations.description"
                                    type="text"
                                    data-vv-name="description"
                                    required
                                />
                                <span class="md-error">{{ errors.first('description') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('description')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('description') && touched.description" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <md-button class="md-success" @click="addClinic">
                            Create
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </md-dialog>
    </div>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';
import { CLINICS_CREATE, NOTIFY } from '@/constants';

const randomMC = require('random-material-color');

export default {
    name: 'ClinicAddForm',
    components: {
        SlideYDownTransition
    },
    props: {
        showForm: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            name: null,
            description: null,
            isLoadingRegistration: false,
            touched: {
                name: false
            },
            modelValidations: {
                name: {
                    required: true
                },
                description: {
                    required: true
                }
            }
        };
    },
    computed: {
        patientColor() {
            const color = this.randomMC.getColor({
                text: this.name + this.description + this.phone + this.name
            });
            return color;
        },
        showForml: {
            get() {
                return this.showForm;
            },
            set(e) {
                this.$emit('update:showForm', e);
            }
        }
    },
    watch: {
        name() {
            this.touched.name = true;
        },
        description() {
            this.touched.description = true;
        }
    },
    created() {
        this.randomMC = randomMC;
    },
    methods: {
        validate() {
            this.$validator.validateAll().then(isValid => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
            this.touched.name = true;
            this.touched.description = true;
        },
        clearForm() {
            this.name = null;
            this.description = null;
            this.$nextTick(() => this.$validator.reset());
        },
        addClinic() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$store
                        .dispatch(CLINICS_CREATE, {
                            clinic: {
                                name: this.name,
                                description: this.description
                            }
                        })
                        .then(response => {
                            if (response) {
                                this.showForml = false;
                                this.clearForm();
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'Clinic was created',
                                        type: 'success'
                                    }
                                });
                            }
                        });
                }
            });
        }
    }
};

// The first param is called 'min', and the second is called 'max'.
</script>
<style lang="scss"></style>
