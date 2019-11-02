<template>
    <div>
        <md-dialog class="patient-add-form" :md-active.sync="showForm" :md-click-outside-to-close="!isLoadingRegistration">
            <div>
                <md-card>
                    <md-card-header class="md-card-header-icon">
                        <div class="card-icon md-card-header-green">
                            <md-icon>business</md-icon>
                        </div>
                        <h4 class="title">
                            Add New Clinic
                        </h4>
                    </md-card-header>

                    <md-card-content class="md-layout">
                        <div class="md-layout-item  md-small-size-100">
                            <md-field
                                :class="[{ 'md-valid': !errors.has('clinicName') && touched.clinicName }, { 'md-error': errors.has('clinicName') }]"
                            >
                                <label>Clinic Title</label>
                                <md-input
                                    v-focus
                                    v-model="clinicName"
                                    v-validate="{ verify_clinic_name: names, required: true, min: 2 }"
                                    type="text"
                                    data-vv-name="clinicName"
                                    required
                                />
                                <span class="md-error">{{ errors.first('clinicName') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('clinicName')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('clinicName') && touched.clinicName" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                            <md-field>
                                <label>Description</label>
                                <md-textarea v-model="clinicDescription" />
                            </md-field>
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <md-button class=" md-success" @click="addClinic()">
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
import { CLINICS_PROP_SET, NOTIFY } from '@/constants';
import { mapGetters } from 'vuex';

export default {
    name: 'clinic-add-form',
    components: {
        SlideYDownTransition
    },
    props: {
        showAddClinic: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            isLoadingRegistration: false,
            clinicName: null,
            clinicDescription: null,
            touched: {
                clinicName: false
            },
            modelValidations: {
                clinicName: {
                    required: true,
                    min: 3
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            clinics: 'getClinics'
        }),
        names() {
            return this.clinics.map(c => c.name);
        },
        showForm: {
            get() {
                return this.showAddClinic;
            },
            set(value) {
                this.$emit('update:showAddClinic', value);
            }
        }
    },
    watch: {
        clinicName() {
            this.touched.clinicName = true;
        }
    },
    methods: {
        showPatientAddForm() {
            this.$patientAddForm.showPatientAddForm(true);
        },
        validate() {
            this.$validator.validateAll().then(isValid => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
            this.touched.clinicName = true;
        },
        clearForm() {
            this.clinicName = null;
            this.$nextTick(() => this.$validator.reset());
        },
        addClinic: function() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.isLoadingRegistration = true;
                    this.$store
                        .dispatch(CLINICS_PROP_SET, {
                            clinic: {
                                name: this.clinicName,
                                description: this.clinicDescription
                            }
                        })
                        .then(response => {
                            if (response) {
                                this.showForm = false;
                                this.clearForm();
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'Clinic added successfully',
                                        type: 'success'
                                    }
                                });
                                this.isLoadingRegistration = false;
                            }
                        })
                        .catch(() => {
                            this.isLoadingRegistration = false;
                        });
                }
            });
        }
    }
};

// The first param is called 'min', and the second is called 'max'.
</script>
<style lang="scss"></style>
