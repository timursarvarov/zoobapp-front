`<template>
    <div>
        <md-dialog class="patient-add-form" :md-active.sync="showFormL" :md-click-outside-to-close="!loading">
            <div>
                <md-card>
                    <md-card-header class="md-card-header-icon">
                        <div class="card-icon card-icon md-card-header-green">
                            <md-icon>person_add</md-icon>
                        </div>
                        <h4 class="title">
                            Add New Patient
                        </h4>
                    </md-card-header>

                    <md-card-content class="md-layout">
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                                class="with-subline"
                                :class="[
                                    {
                                        'md-valid': !errors.has('firstName') && touched.firstName
                                    },
                                    { 'md-error': errors.has('firstName') }
                                ]"
                            >
                                <label>First Name</label>
                                <md-input
                                    ref="firstName"
                                    v-model="firstName"
                                    :disabled="loading"
                                    v-validate="modelValidations.firstName"
                                    type="text"
                                    data-vv-name="firstName"
                                    required
                                    @focus="unsetAutofill('firstName')"
                                />
                                <span class="md-error">{{ errors.first('firstName') }}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="errors.has('firstName')"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action"
                                        @click="(firstName = ''), focusOn('firstName')"
                                    >
                                        <md-icon class="error">
                                            close
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="!errors.has('firstName') && touched.firstName"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">
                                            done
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                                class="with-subline"
                                :class="[
                                    {
                                        'md-valid': !errors.has('lastName') && touched.lastName
                                    },
                                    { 'md-error': errors.has('lastName') }
                                ]"
                            >
                                <label>Last Name</label>
                                <md-input
                                    ref="lastName"
                                    v-model="lastName"
                                    :disabled="loading"
                                    v-validate="modelValidations.lastName"
                                    type="text"
                                    data-vv-name="lastName"
                                    required
                                    @focus="unsetAutofill('lastName')"
                                />
                                <span class="md-error">{{ errors.first('lastName') }}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="errors.has('lastName')"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action"
                                        @click="(lastName = ''), focusOn('lastName')"
                                    >
                                        <md-icon class="error">
                                            close
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="!errors.has('lastName') && touched.lastName"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">
                                            done
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                                class="with-subline"
                                :class="[
                                    {
                                        'md-valid': !errors.has('email') && touched.email
                                    },
                                    { 'md-error': errors.has('email') }
                                ]"
                            >
                                <label>Email</label>
                                <md-input
                                    ref="email"
                                    v-model="email"
                                    v-validate="modelValidations.email"
                                    :disabled="loading"
                                    type="email"
                                    data-vv-name="email"
                                    @focus="unsetAutofill('email')"
                                />
                                <span class="md-error">{{ errors.first('email') }}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="errors.has('email')"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action"
                                        @click="(email = ''), focusOn('email')"
                                    >
                                        <md-icon class="error">
                                            close
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="!errors.has('email') && touched.email"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">
                                            done
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                                class="with-subline"
                                :class="[
                                    {
                                        'md-valid': !errors.has('phone') && touched.phone
                                    },
                                    { 'md-error': errors.has('phone') }
                                ]"
                            >
                                <label>Phone</label>
                                <span class="md-prefix">+</span>
                                <md-input
                                    ref="phone"
                                    v-model="phone"
                                    :disabled="loading"
                                    v-validate="modelValidations.phone"
                                    type="number"
                                    data-vv-name="phone"
                                    required
                                    @focus="unsetAutofill('phone')"
                                />
                                <span class="md-error">{{ errors.first('phone') }}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="errors.has('phone')"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action"
                                        @click="(phone = ''), focusOn('phone')"
                                    >
                                        <md-icon class="error">
                                            close
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="!errors.has('phone') && touched.phone"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">
                                            done
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item">
                            <md-field class="with-subline">
                                <label>Doctors</label>
                                <md-select id="movies" v-model="selectedDoctors" :disabled="loading" name="movies" multiple>
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
                            <md-field
                                :class="[
                                    {
                                        'md-valid': !errors.has('source') && touched.source
                                    },
                                    { 'md-error': errors.has('source') }
                                ]"
                            >
                                <label>Source</label>
                                <md-input
                                    ref="source"
                                    v-model="source"
                                    :disabled="loading"
                                    source="source"
                                    type="text"
                                    data-vv-name="source"
                                    v-validate="modelValidations.source"
                                    required
                                    @focus="unsetAutofill('source')"
                                />
                                <span class="md-error">{{ errors.first('source') }}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="errors.has('source')"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action"
                                        @click="(source = ''), focusOn('source')"
                                    >
                                        <md-icon class="error">
                                            close
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="!errors.has('source') && touched.source"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">
                                            done
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>

                        <div class="md-layout-item md-size-100 md-small-size-100">
                            <md-checkbox v-model="noAllergy" :disabled="loading" class="md-primary">
                                No Allergy
                            </md-checkbox>
                        </div>

                        <div class="md-layout-item  wrapper-chips md-size-100 md-small-size-100">
                            <md-chips
                                ref="allergy"
                                v-model="allergy"
                                v-validate="{ required: !noAllergy }"
                                :class="[
                                    {
                                        'md-valid': !errors.has('allergy') && touched.allergy
                                    },
                                    { 'md-error': errors.has('allergy') }
                                ]"
                                :disabled="loading"
                                class="md-danger"
                                data-vv-name="allergy"
                            >
                                <label>Add allergy and press 'ENTER'</label>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="errors.has('allergy')"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-round md-chips-input-action"
                                        @click="(allergy = []), focusOn('allergy')"
                                    >
                                        <md-icon class="error">
                                            close
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="!errors.has('allergy') && touched.allergy"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense  md-round md-chips-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">
                                            done
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-chips>
                            <span class="md-error">{{ errors.first('allergy') }}</span>
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <div>
                            <md-checkbox v-model="closeAddForm" class="md-primary" @change="setCloseFormAfter()">
                                Close form after
                            </md-checkbox>
                        </div>
                        <div>
                            <md-checkbox v-model="openProfile" class="md-primary" @change="setOpenProfileAfterCreation()">
                                Open patient profile
                            </md-checkbox>
                        </div>
                        <md-button :disabled="loading" class="md-success" @click="addPatient()">
                            <span v-if="loading">
                                <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />
                                &nbsp; Loading...
                            </span>
                            <span v-else>Add patient</span>
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </md-dialog>
    </div>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';
import {
    PATIENT_CREATE,
    NOTIFY,
    // PATIENT_PARAMS_SET,
    LOCAL_STORAGE
} from '@/constants';

export default {
    name: 'ClinicAddNosologyForm',
    components: {
        SlideYDownTransition
    },
    props: {
        showForm: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            loading: false,
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
        showFormL: {
            get() {
                return this.showForm;
            },
            set(newValue) {
                this.$emit('update:showForm', newValue);
            }
        }
    },
    watch: {
        showFormL() {
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
            this.closeAddForm = localStorage.getItem(LOCAL_STORAGE.user.onCreationNosologyCloseAddForm);
            if (this.closeAddForm === 'true') {
                this.closeAddForm = true;
            } else if (this.closeAddForm === null) {
                this.closeAddForm = true;
                localStorage.setItem(LOCAL_STORAGE.user.onCreationNosologyCloseAddForm, true);
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
    methods: {
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$refs[ref].$el.focus();
        },
        unsetAutofill(ref) {
            this.$refs[ref].$el.setAttribute('autocomplete', Math.random());
        },
        setOpenProfileAfterCreation() {
            localStorage.setItem(LOCAL_STORAGE.user.onCreationPatientOpenProfile, this.openProfile);
        },
        setCloseFormAfter() {
            localStorage.setItem(LOCAL_STORAGE.user.onCreationNosologyCloseAddForm, this.closeAddForm);
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
            this.$validator
                .validateAll()
                .then(result => {
                    if (result) {
                        this.loading = true;
                        this.$store
                            .dispatch(PATIENT_CREATE, {
                                patient: {
                                    firstName: this.firstName,
                                    lastName: this.lastName,
                                    source: this.source,
                                    phone: parseInt(this.phone, 10),
                                    email: this.email,
                                    allergy: this.allergy,
                                    color: 'fgh'
                                }
                            })
                            .then(patient => {
                                if (patient) {
                                    if (this.openProfile) {
                                        // this.$store.dispatch(PATIENT_PARAMS_SET, {
                                        //     patient
                                        // });
                                        this.$router.push({
                                            name: 'Treatment',
                                            params: {
                                                lang: this.$i18n.locale,
                                                patientID: patient.ID
                                            }
                                        });
                                    }
                                    if (this.closeAddForm) {
                                        this.showFormL = false;
                                    }
                                    this.clearForm();
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message: `${patient.firstName} ${patient.lastName} added`,
                                            type: 'success'
                                        }
                                    });
                                }
                            });
                    }
                })
                .catch(err => {
                    throw new Error(err);
                })
                .then(() => {
                    this.loading = false;
                });
        }
    }
};

// The first param is called 'min', and the second is called 'max'.
</script>
<style lang="scss">
.patient-add-form {
}
</style>
