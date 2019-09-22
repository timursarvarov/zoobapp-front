<template>
    <div>
        <md-dialog class="patient-add-form" :md-active.sync="showForm" :md-click-outside-to-close="!isLoadingRegistration">
            <div>
                <md-card>
                    <md-card-header class="md-card-header-icon">
                        <div class="card-icon" :style="{ 'background-color': patientColor }">
                            <md-icon>person_add</md-icon>
                        </div>
                        <h4 class="title">
                            Add New Patient
                        </h4>
                    </md-card-header>

                    <md-card-content class="md-layout">
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                                :class="[{ 'md-valid': !errors.has('firstName') && touched.firstName }, { 'md-error': errors.has('firstName') }]"
                            >
                                <label>First Name</label>
                                <md-input v-model="firstName" v-validate="modelValidations.firstName" type="text" data-vv-name="firstName" required />
                                <span class="md-error">{{ errors.first('firstName') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('firstName')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('firstName') && touched.firstName" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field :class="[{ 'md-valid': !errors.has('lastName') && touched.lastName }, { 'md-error': errors.has('lastName') }]">
                                <label>Last Name</label>
                                <md-input v-model="lastName" v-validate="modelValidations.lastName" type="text" data-vv-name="lastName" required />
                                <span class="md-error">{{ errors.first('lastName') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('lastName')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('lastName') && touched.lastName" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field :class="[{ 'md-valid': !errors.has('email') && touched.email }, { 'md-error': errors.has('email') }]">
                                <label>Email</label>
                                <md-input v-model="email" v-validate="modelValidations.email" type="email" data-vv-name="email" />
                                <span class="md-error">{{ errors.first('email') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('email')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('email') && touched.email" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field :class="[{ 'md-valid': !errors.has('phone') && touched.phone }, { 'md-error': errors.has('phone') }]">
                                <label>Phone</label>
                                <span class="md-prefix">+</span>
                                <md-input
                                    v-model="phone"
                                    v-validate="modelValidations.phone"
                                    name="phone"
                                    type="number"
                                    data-vv-name="phone"
                                    required
                                />
                                <span class="md-error">{{ errors.first('phone') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('phone')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('phone') && touched.phone" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                        </div>

                        <div class="md-layout-item md-size-100 md-small-size-100">
                            <md-checkbox v-model="noAllergy">
                                No Allergy
                            </md-checkbox>
                        </div>

                        <div class="md-layout-item wrapper-chips md-size-100 md-small-size-100">
                            <md-chips
                                v-model="allergy"
                                v-validate="{ required: !noAllergy }"
                                :class="[{ 'md-valid': !errors.has('allergy') && touched.allergy }, { 'md-error': errors.has('allergy') }]"
                                class="md-danger"
                                data-vv-name="allergy"
                                md-placeholder="Add allergy and press 'ENTER'"
                            />
                            <span class="md-error">{{ errors.first('allergy') }}</span>
                        </div>
                        <div class="md-layout-item">
                            <md-field>
                                <label for="movies">Doctors</label>
                                <md-select id="movies" v-model="selectedDoctors" name="movies" multiple>
                                    <md-option value="fight-club">
                                        Fight Club
                                    </md-option>
                                    <md-option value="godfather">
                                        Godfather
                                    </md-option>
                                    <md-option value="godfather-ii">
                                        Godfather II
                                    </md-option>
                                    <md-option value="godfather-iii">
                                        Godfather III
                                    </md-option>
                                    <md-option value="godfellas">
                                        Godfellas
                                    </md-option>
                                    <md-option value="pulp-fiction">
                                        Pulp Fiction
                                    </md-option>
                                    <md-option value="scarface">
                                        Scarface
                                    </md-option>
                                </md-select>
                            </md-field>
                        </div>
                        <div class="md-layout-item">
                            <md-field :class="[{ 'md-valid': !errors.has('source') && touched.source }, { 'md-error': errors.has('source') }]">
                                <label>Source</label>
                                <md-input v-model="source" v-validate="modelValidations.source" type="text" data-vv-name="source" required />
                                <span class="md-error">{{ errors.first('source') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('source')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('source') && touched.source" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <div>
                            <md-checkbox v-model="closeAddForm" @change="setCloseFormAfter()">
                                Close form after
                            </md-checkbox>
                        </div>
                        <div>
                            <md-checkbox v-model="openProfile" @change="setOpenProfileAfterCreation()">
                                Open patient profile
                            </md-checkbox>
                        </div>
                        <md-button class=" md-success" @click="addPatient()">
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
import { PATIENT_CREATE, NOTIFY, PATIENT_PARAMS_SET } from '@/constants';

const randomMC = require('random-material-color');

export default {
    name: 'ClinicAddForm',
    components: {
        SlideYDownTransition
    },
    data() {
        return {
            randomMC: '',
            openProfile: true,
            closeAddForm: true,
            firstName: null,
            lastName: null,
            source: null,
            email: null,
            phone: null,
            noAllergy: false,
            selectedDoctors: [],
            allergy: [],
            isLoadingRegistration: false,
            touched: {
                firstName: false,
                lastName: false,
                source: false,
                email: false,
                phone: false,
                allergy: false
            },
            modelValidations: {
                firstName: {
                    required: true,
                    min: 2
                },
                lastName: {
                    required: true,
                    min: 1
                },
                source: {
                    required: true,
                    min: 3
                },
                email: {
                    email: true
                },
                phone: {
                    required: true,
                    min: 12,
                    max: 20
                },
                allergy: {
                    required: true
                }
            }
        };
    },
    computed: {
        patientColor() {
            const color = this.randomMC.getColor({ text: this.firstName + this.lastName + this.phone + this.email });
            return color;
        },
        showForm: {
            get() {
                return this.$clinicAddForm.patientAddFormShown;
            },
            set() {
                this.$clinicAddForm.patientAddFormShown = !this.$clinicAddForm.patientAddFormShown;
            }
        }
    },
    watch: {
        showForm() {
            this.openProfile = localStorage.getItem(LOCAL_STORAGE.user.onCreationPatientOpenProfile);
            if (this.openProfile === 'true') {
                this.openProfile = true;
            } else if (this.openProfile === null) {
                this.openProfile = true;
                localStorage.setItem(LOCAL_STORAGE.user.onCreationPatientOpenProfile, true);
                this.openProfile = true;
            } else {
                this.openProfile = false;
            }
            this.closeAddForm = localStorage.getItem(LOCAL_STORAGE.user.onCreationPatientCloseAddForm);
            console.log(this.closeAddForm);
            if (this.closeAddForm === 'true') {
                this.closeAddForm = true;
            } else if (this.closeAddForm === null) {
                this.closeAddForm = true;
                localStorage.setItem(LOCAL_STORAGE.user.onCreationPatientCloseAddForm, true);
                this.closeAddForm = true;
            } else {
                this.closeAddForm = false;
            }
        },
        firstName() {
            this.touched.firstName = true;
        },
        lastName() {
            this.touched.lastName = true;
        },
        source() {
            this.touched.source = true;
        },
        email() {
            this.touched.email = true;
        },
        phone() {
            this.touched.phone = true;
        },
        allergy() {
            this.touched.allergy = true;
            if (this.allergy.length > 0 && this.noAllergy) {
                this.noAllergy = false;
            }
        },
        noAllergy() {
            if (this.allergy.length > 0 && this.noAllergy) {
                this.allergy = [];
            }
        }
    },
    created() {
        this.randomMC = randomMC;
    },
    methods: {
        setOpenProfileAfterCreation() {
            localStorage.setItem(LOCAL_STORAGE.user.onCreationPatientOpenProfile, this.openProfile);
        },
        setCloseFormAfter() {
            localStorage.setItem(LOCAL_STORAGE.user.onCreationPatientCloseAddForm, this.closeAddForm);
        },
        validate() {
            this.$validator.validateAll().then(isValid => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
            this.touched.firstName = true;
            this.touched.lastName = true;
            this.touched.email = true;
            this.touched.phone = true;
            this.touched.allergy = true;
            this.touched.source = true;
        },
        clearForm() {
            this.firstName = null;
            this.source = null;
            this.lastName = null;
            this.email = null;
            this.phone = null;
            this.noAllergy = false;
            this.allergy = [];
            this.$nextTick(() => this.$validator.reset());
        },
        addPatient() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$store
                        .dispatch(PATIENT_CREATE, {
                            patient: {
                                firstName: this.firstName,
                                lastName: this.lastName,
                                source: this.source,
                                phone: parseInt(this.phone, 10),
                                email: this.email,
                                allergy: this.allergy,
                                color: this.patientColor
                            }
                        })
                        .then(response => {
                            if (response) {
                                if (this.openProfile) {
                                    this.$store.dispatch(PATIENT_PARAMS_SET, {
                                        patient: response.data
                                    });
                                    this.$router.push({
                                        name: 'PatientProcedure',
                                        params: { patientID: response.data.ID }
                                    });
                                }
                                if (this.closeAddForm) {
                                    this.showForm = false;
                                }
                                this.clearForm();
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'Settings updated successfully',
                                        type: 'primary'
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
