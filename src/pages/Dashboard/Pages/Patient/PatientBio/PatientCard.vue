<template>
    <div class="patient-card-wrapper">
        <md-card-content class="md-layout">
            <div class="md-layout md-small-size-100 md-size-50">
                <div class="md-layout-item md-layout md-size-100 avatart-wrapper">
                    <div class="md-layout-item md-small-size-100 md-size-50 md-layout switch md-alignment-center-space-between">
                        <t-avatar-input
                            :disabled="loading"
                            :text-to-color="patient.ID"
                            :image-src="patient.avatar"
                            :title="patient.firstName + ' ' + patient.lastName"
                            :form-title="$t(`${$options.name}.addPhoto`)"
                            :button-color="'green'"
                            @on-created="updatepatientAvatar"
                        />
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-50 md-layout switch md-alignment-center-space-between">
                        <div class="md-layout-item">
                            <md-switch v-model="showRating">{{ $t(`${$options.name}.showRating`) }}</md-switch>
                        </div>
                        <div class="md-layout-item">
                            <star-rating v-show="showRating" v-model="patient.rating" :glow="5" :show-rating="false" :star-size="18" />
                        </div>
                    </div>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field
                        :class="[
                            {
                                'md-valid': !errors.has('firstName') && touched.firstName
                            },
                            { 'md-error': errors.has('firstName') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.firstName`) }}</label>
                        <md-input
                            v-model="patient.firstName"
                            v-validate="modelValidations.firstName"
                            :disabled="loading"
                            type="text"
                            data-vv-name="firstName"
                            required
                        />
                        <span class="md-error">{{ errors.first('firstName') }}</span>
                        <slide-y-down-transition>
                            <md-icon v-show="errors.has('firstName')" class="error">close</md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon v-show="!errors.has('firstName') && touched.firstName" class="success">done</md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-field
                        :class="[
                            {
                                'md-valid': !errors.has('lastName') && touched.lastName
                            },
                            { 'md-error': errors.has('lastName') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.lastName`) }}</label>
                        <md-input
                            v-model="patient.lastName"
                            v-validate="modelValidations.lastName"
                            :disabled="loading"
                            type="text"
                            data-vv-name="lastName"
                            required
                        />
                        <span class="md-error">{{ errors.first('lastName') }}</span>
                        <slide-y-down-transition>
                            <md-icon v-show="errors.has('lastName')" class="error">close</md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon v-show="!errors.has('lastName') && touched.lastName" class="success">done</md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-field
                        :class="[
                            {
                                'md-valid': !errors.has('phone') && touched.phone
                            },
                            { 'md-error': errors.has('phone') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.phone`) }}</label>
                        <span class="md-prefix">+</span>
                        <md-input
                            v-model="patient.phone"
                            v-validate="modelValidations.phone"
                            :disabled="loading"
                            type="number"
                            data-vv-name="phone"
                            required
                        />
                        <span class="md-error">{{ errors.first('phone') }}</span>
                        <slide-y-down-transition>
                            <md-icon v-show="errors.has('phone')" class="error">close</md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon v-show="!errors.has('phone') && touched.phone" class="success">done</md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>
            </div>

            <div class="md-layout md-small-size-100 md-size-50">
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label>{{ $t(`${$options.name}.source`) }}</label>
                        <md-input v-model="patient.source" :disabled="loading" />
                    </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label>{{ $t(`${$options.name}.address`) }}</label>
                        <md-input v-model="patient.address" :disabled="loading" />
                    </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-datepicker v-model="preparedBirthDate" md-immediately :md-model-type="String" disabled="loading">
                        <label>
                            {{ $t(`${$options.name}.birthday`) }}
                            <span v-if="preparedBirthDate">({{ $tc(`${$options.name}.yearsOld`, $moment().diff(preparedBirthDate, 'years')) }})</span>
                        </label>
                    </md-datepicker>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-field
                        :class="[
                            {
                                'md-valid': !errors.has('email') && touched.email
                            },
                            { 'md-error': errors.has('email') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.email`) }}</label>
                        <md-input
                            v-model="patient.email"
                            v-validate="modelValidations.email"
                            :disabled="loading"
                            type="email"
                            data-vv-name="email"
                            required
                        />
                        <span class="md-error">{{ errors.first('email') }}</span>
                        <slide-y-down-transition>
                            <md-icon v-show="errors.has('email')" class="error">close</md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon v-show="!errors.has('email') && touched.email" class="success">done</md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-chips v-model="allergy" :disabled="loading" class="md-danger" :md-placeholder="$t(`${$options.name}.addAllergy`)" />
                    <span class="small helper">{{ $t(`${$options.name}.addAllergent`) }}</span>
                </div>
            </div>
        </md-card-content>
        <md-card-actions>
            <md-button :disabled="loading" class="md-raised md-success mt-4" @click="updateProfile">
                <div v-if="loading">
                    <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />&nbsp;
                    <span>{{ $t(`${$options.name}.saving`) }}...</span>
                </div>
                <span v-else>{{ $t(`${$options.name}.saveChanges`) }}</span>
            </md-button>
        </md-card-actions>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SlideYDownTransition } from 'vue2-transitions';
import StarRating from 'vue-star-rating';
import { PATIENT_AVATAR_UPLOAD, NOTIFY, PATIENT_EDIT } from '@/constants';
import components from '@/components';
import moment from 'moment';

export default {
    name: 'PatientCard',
    components: {
        ...components,
        SlideYDownTransition,
        StarRating
        // generator,
    },
    props: {
        cardpatientImage: {
            type: String,
            default: './img/faces/marc.jpg'
        },
        buttonColor: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: './img/default-avatar.png'
        }
    },
    created() {
        if (this.patient.birthday) {
            this.preparedBirthDate = moment(this.patient.birthday).format('YYYY-MM-D');
        }
    },
    data() {
        return {
            showRating: false,
            loading: false,
            preparedBirthDate: null,
            showForm: false,
            image: '',
            address: null,
            touched: {
                firstName: false,
                lastName: false,
                email: false,
                phone: false
            },
            modelValidations: {
                lastName: {
                    required: true,
                    min: 1
                },
                firstName: {
                    required: true,
                    min: 1
                },
                email: {
                    email: true
                },
                phone: {
                    required: true,
                    min: 12
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient'
        }),
        allergy: {
            // getter
            get() {
                return this.patient.allergy || [];
            },
            // setter
            set(newValue) {
                this.patient.allergy = newValue;
            }
        },
        email() {
            return this.patient.email;
        },
        firstName() {
            return this.patient.firstName;
        },
        lastName() {
            return this.patient.lastName;
        },
        phone() {
            return this.patient.phone;
        },
        birthDate() {
            return this.patient.birthDate;
        }
    },
    watch: {
        email() {
            this.touched.email = true;
        },
        firstName() {
            this.touched.firstName = true;
        },
        lastName() {
            this.touched.lastName = true;
        },
        phone() {
            this.touched.phone = true;
        },
        birthDate(value) {
            if (value) {
                this.preparedBirthDate = moment(value).format('YYYY-MM-D');
            }
        }
    },
    methods: {
        getColorButton(buttonColor) {
            return `md-${buttonColor}`;
        },
        validate() {
            this.$validator.validateAll().then(isValid => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
            this.touched.lastName = true;
            this.touched.firstName = true;
            this.touched.email = true;
            this.touched.phone = true;
        },
        updateProfile() {
            this.$validator
                .validateAll()
                .then(result => {
                    if (result) {
                        this.loading = true;
                        this.$store
                            .dispatch(PATIENT_EDIT, {
                                params: {
                                    firstName: this.patient.firstName,
                                    lastName: this.patient.lastName,
                                    email: this.patient.email,
                                    phone: parseInt(this.patient.phone, 10),
                                    address: this.patient.address,
                                    allergy: this.patient.allergy,
                                    source: this.patient.source,
                                    color: this.patient.color,
                                    birthday: moment(this.preparedBirthDate).format(),
                                    rating: parseFloat(this.patient.rating)
                                }
                            })
                            .then(response => {
                                if (response) {
                                    this.loading = false;
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message: 'Settings updated successfully',
                                            type: 'success'
                                        }
                                    });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                this.loading = false;
                                throw new Error(err);
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    throw new Error(err);
                });
        },

        updatepatientAvatar(fd) {
            const patient = {
                ID: this.patient.ID,
                fd
            };

            this.$store
                .dispatch(PATIENT_AVATAR_UPLOAD, {
                    patient
                })
                .then(
                    response => {
                        console.log(response);
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Image uploaded',
                                type: 'success'
                            }
                        });
                    },
                    err => {
                        this.selectedFileUrl = null;
                        throw new Error(err);
                    }
                );
        }
    }
};
</script>
<style lang="scss">
.patient-card-wrapper {
    .md-chips:after {
        display: block;
    }
    .avatart-wrapper {
        padding: 20px;
    }
    .helper {
        float: left;
    }
    .switch {
        margin-top: 20px;
    }
    .picture-wrapper-acronim {
        transition: all 2.5s ease;
    }
    .slider {
        // margin-top: 58px;
    }

    .md-datepicker-dialog {
        height: 286px;
    }
    .md-datepicker-body-content {
        height: 232px !important;
    }
}
</style>
