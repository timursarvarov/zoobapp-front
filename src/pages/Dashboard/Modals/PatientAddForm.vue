`<template>
    <div>
        <md-dialog
            class="patient-add-form"
            :md-active.sync="showForm"
            :md-click-outside-to-close="!loading"
        >
            <div>
                <md-card>
                    <md-card-header class="md-card-header-icon">
                        <div
                            class="card-icon card-icon md-card-header-green"
                        >
                            <md-icon>person_add</md-icon>
                        </div>
                        <h4 class="title">Add New Patient</h4>
                    </md-card-header>

                    <md-card-content class="md-layout">
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                            class="with-subline"
                                :class="[
                {'md-valid': !errors.has('firstName') && touched.firstName},
                {'md-error': errors.has('firstName')}]"
                            >
                                <label for="the_firstName23">First Name</label>
                                <md-input
                                    @focus="unsetAutofill('firstName')"
                                    ref="firstName"
                                    :disabled="loading"
                                    v-model="firstName"
                                    type="text"
                                    data-vv-name="firstName"
                                    required
                                    v-validate="modelValidations.firstName"
                                ></md-input>
                                <span class="md-error">{{errors.first('firstName')}}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="errors.has('firstName')"
                                        @click="firstName='',focusOn('firstName')"
                                        class="md-button md-icon-button md-dense md-input-action"
                                    >
                                        <md-icon class="error">close</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="!errors.has('firstName')  && touched.firstName"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">done</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                            class="with-subline"
                                :class="[
                {'md-valid': !errors.has('lastName') && touched.lastName},
                {'md-error': errors.has('lastName')}]"
                            >
                                <label>Last Name</label>
                                <md-input
                                    @focus="unsetAutofill('lastName')"
                                    :disabled="loading"
                                    ref="lastName"
                                    v-model="lastName"
                                    type="text"
                                    data-vv-name="lastName"
                                    required
                                    v-validate="modelValidations.lastName"
                                ></md-input>
                                <span class="md-error">{{errors.first('lastName')}}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="errors.has('lastName')"
                                        @click="lastName='',focusOn('lastName')"
                                        class="md-button md-icon-button md-dense md-input-action"
                                    >
                                        <md-icon class="error">close</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="!errors.has('lastName')  && touched.lastName"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">done</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                            class="with-subline"
                                :class="[
                {'md-valid': !errors.has('email') && touched.email},
                {'md-error': errors.has('email')}]"
                            >
                                <label>Email</label>
                                <md-input
                                    @focus="unsetAutofill('email')"
                                    ref="email"
                                    :disabled="loading"
                                    v-model="email"
                                    type="email"
                                    data-vv-name="email"
                                    v-validate="modelValidations.email"
                                ></md-input>
                                <span class="md-error">{{errors.first('email')}}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="errors.has('email')"
                                        @click="email='',focusOn('email')"
                                        class="md-button md-icon-button md-dense md-input-action"
                                    >
                                        <md-icon class="error">close</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="!errors.has('email')  && touched.email"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">done</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-50 md-small-size-100">
                            <md-field
                                class="with-subline"
                                :class="[
                {'md-valid': !errors.has('phone') && touched.phone},
                {'md-error': errors.has('phone')}]"
                            >
                                <label>Phone</label>
                                <span class="md-prefix">+</span>
                                <md-input
                                    @focus="unsetAutofill('phone')"
                                    :disabled="loading"
                                    ref="phone"
                                    v-model="phone"
                                    type="number"
                                    data-vv-name="phone"
                                    required
                                    v-validate="modelValidations.phone"
                                ></md-input>
                                <span class="md-error">{{errors.first('phone')}}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="errors.has('phone')"
                                        @click="phone='',focusOn('phone')"
                                        class="md-button md-icon-button md-dense md-input-action"
                                    >
                                        <md-icon class="error">close</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="!errors.has('phone')  && touched.phone"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">done</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                            <div class="md-layout-item">
                                <md-field class="with-subline" >
                                    <label for="movies">Doctors</label>
                                    <md-select
                                        :disabled="loading"
                                        v-model="selectedDoctors"
                                        name="movies"
                                        id="movies"
                                        multiple
                                    >
                                        <md-option value="fight-club">Fight Club</md-option>
                                        <md-option value="godfather">Godfather</md-option>
                                        <md-option value="godfather-ii">Godfather II</md-option>
                                        <md-option value="godfather-iii">Godfather III</md-option>
                                        <md-option value="godfellas">Godfellas</md-option>
                                        <md-option value="pulp-fiction">Pulp Fiction</md-option>
                                        <md-option value="scarface">Scarface</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-field
                                    :class="[
                    {'md-valid': !errors.has('source') && touched.source},
                    {'md-error': errors.has('source')}]"
                                >
                                    <label>Source</label>
                                    <md-input
                                        @focus="unsetAutofill('source')"
                                        ref="source"
                                        :disabled="loading"
                                        source="source"
                                        v-model="source"
                                        type="text"
                                        data-vv-name="source"
                                        required
                                        v-validate="modelValidations.source"
                                    ></md-input>
                                    <span class="md-error">{{errors.first('source')}}</span>
                                     <slide-y-down-transition>
                                        <md-button
                                            tabindex="-1"
                                            v-show="errors.has('source')"
                                            @click="source='',focusOn('source')"
                                            class="md-button md-icon-button md-dense md-input-action"
                                        >
                                            <md-icon class="error">close</md-icon>
                                        </md-button>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <md-button
                                            tabindex="-1"
                                            v-show="!errors.has('source')  && touched.source"
                                            class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                        >
                                            <md-icon class="success">done</md-icon>
                                        </md-button>
                                    </slide-y-down-transition>
                                </md-field>
                            </div>

                        <div class="md-layout-item md-size-100 md-small-size-100">
                            <md-checkbox
                                :disabled="loading"
                                class="md-primary"
                                v-model="noAllergy">
                                No Allergy
                            </md-checkbox>
                        </div>

                        <div class="md-layout-item  wrapper-chips md-size-100 md-small-size-100">
                            <md-chips
                                  :class="[
                {'md-valid': !errors.has('allergy') && touched.allergy},
                {'md-error': errors.has('allergy')}]"
                                :disabled="loading"
                                ref="allergy"
                                v-model="allergy"
                                v-validate="{ required: !noAllergy}"
                                class="md-danger"
                                data-vv-name="allergy"
                            >
                            <label>Add allergy and press 'ENTER'</label>
                            <slide-y-down-transition>
                                        <md-button
                                            tabindex="-1"
                                            v-show="errors.has('allergy')"
                                            @click="allergy=[],focusOn('allergy')"
                                            class="md-button md-icon-button md-dense md-round md-chips-input-action"
                                        >
                                            <md-icon class="error">close</md-icon>
                                        </md-button>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <md-button
                                            tabindex="-1"
                                            v-show="!errors.has('allergy')  && touched.allergy"
                                            class="md-button md-icon-button md-dense  md-round md-chips-input-action noselect md-simple"
                                        >
                                            <md-icon class="success">done</md-icon>
                                        </md-button>
                                    </slide-y-down-transition>
                            </md-chips>
                            <span class="md-error">{{errors.first('allergy')}}</span>
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <div>
                            <md-checkbox
                                class="md-primary"
                                @change="setCloseFormAfter()"
                                v-model="closeAddForm"
                            >Close form after</md-checkbox>
                        </div>
                        <div>
                            <md-checkbox
                                class="md-primary"
                                @change="setOpenProfileAfterCreation()"
                                v-model="openProfile"
                            >Open patient profile</md-checkbox>
                        </div>
                        <md-button
                            :disabled="loading"
                            @click="addPatient()" class="md-success">
                             <span v-if="loading">
                             <md-progress-spinner
                                class="t-white"
                                :md-diameter="12"
                                :md-stroke="2"
                                md-mode="indeterminate"
                            ></md-progress-spinner>
                            &nbsp;
                            Loading...
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
    import { PATIENT_CREATE, NOTIFY, PATIENT_PARAMS_SET } from '@/constants';

    export default {
        name: 'patient-add-form',
        components: {
            SlideYDownTransition,
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
                    allergy: false,
                },
                modelValidations: {
                    firstName: {
                        required: true,
                        min: 2,
                    },
                    lastName: {
                        required: true,
                        min: 1,
                    },
                    source: {
                        required: true,
                        min: 3,
                    },
                    email: {
                        email: true,
                    },
                    phone: {
                        required: true,
                        min: 12,
                        max: 20,
                    },
                    allergy: {
                        required: true,
                    },
                },
            };
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
                localStorage.setItem(
                    'USER_SETTINGS_OPEN_PATIENT_PROFILE',
                    this.openProfile,
                );
            },
            setCloseFormAfter() {
                localStorage.setItem(
                    'USER_SETTINGS_CLOSE_PATIENT_ADD_FORM',
                    this.closeAddForm,
                );
            },
            validate() {
                this.$validator.validateAll().then((isValid) => {
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
                this.$validator.validateAll().then((result) => {
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
                                    color: 'fgh',
                                },
                            })
                            .then((patient) => {
                                if (patient) {
                                    if (this.openProfile) {
                                        this.$store.dispatch(PATIENT_PARAMS_SET, {
                                            patient,
                                        });
                                        this.$router.push({
                                            name: 'Treatment',
                                            params: {
                                                lang: this.$i18n.locale,
                                                patientId: patient.ID,
                                            },
                                        });
                                    }
                                    if (this.closeAddForm) {
                                        this.showForm = false;
                                    }
                                    this.clearForm();
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message:
                                                `${patient.firstName} ${patient.lastName} added`,
                                            type: 'success',
                                        },
                                    });
                                }
                            });
                    }
                }).catch((err) => {
                    console.log(err);
                }).then(() => {
                    this.loading = false;
                });
            },
        },
        computed: {
            showForm: {
                get() {
                    return this.$patientAddForm.patientAddFormShown;
                },
                set() {
                    this.$patientAddForm.patientAddFormShown = !this.$patientAddForm
                        .patientAddFormShown;
                },
            },
        },
        watch: {
            showForm() {
                this.openProfile = localStorage.getItem(
                    'USER_SETTINGS_OPEN_PATIENT_PROFILE',
                );
                if (this.openProfile === 'true') {
                    this.openProfile = true;
                } else if (this.openProfile === null) {
                    this.openProfile = true;
                    localStorage.setItem(
                        'USER_SETTINGS_OPEN_PATIENT_PROFILE',
                        true,
                    );
                    this.openProfile = true;
                } else {
                    this.openProfile = false;
                }
                this.closeAddForm = localStorage.getItem(
                    'USER_SETTINGS_CLOSE_PATIENT_ADD_FORM',
                );
                if (this.closeAddForm === 'true') {
                    this.closeAddForm = true;
                } else if (this.closeAddForm === null) {
                    this.closeAddForm = true;
                    localStorage.setItem(
                        'USER_SETTINGS_CLOSE_PATIENT_ADD_FORM',
                        true,
                    );
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
            },
        },
    };

// The first param is called 'min', and the second is called 'max'.
</script>
<style lang="scss" >
.patient-add-form{
}
</style>
