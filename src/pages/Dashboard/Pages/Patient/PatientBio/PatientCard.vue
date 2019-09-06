<template>
    <div class="patient-card-wrapper">
        <md-card-content class="md-layout">
            <div class="md-layout  md-small-size-100 md-size-50">
                <div
                    class="md-layout-item md-layout md-size-100 avatart-wrapper"
                >
                    <div
                        class="md-layout-item  md-small-size-100 md-size-50  md-layout switch md-alignment-center-space-between"
                    >
                        <t-avatar-input
                            :disabled="loading"
                            :text-to-color="patient.ID"
                            :image-src="patient.avatar"
                            :title="patient.firstName + ' ' + patient.lastName"
                            :form-title="'Add patient foto'"
                            :button-color="'green'"
                            @on-created="updatepatientAvatar"
                        />
                    </div>
                    <div
                        class="md-layout-item  md-small-size-100 md-size-50 md-layout switch md-alignment-center-space-between"
                    >
                        <div class="md-layout-item">
                            <md-switch v-model="showRating">
                                Show Rating
                            </md-switch>
                        </div>
                        <div class="md-layout-item">
                            <star-rating
                                v-show="showRating"
                                v-model="patient.rating"
                                :glow="5"
                                :show-rating="false"
                                :star-size="18"
                            />
                        </div>
                    </div>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field
                        :class="[
                            {
                                'md-valid':
                                    !errors.has('firstName') &&
                                    touched.firstName
                            },
                            { 'md-error': errors.has('firstName') }
                        ]"
                    >
                        <label>First Name</label>
                        <md-input
                            v-model="patient.firstName"
                            v-validate="modelValidations.firstName"
                            :disabled="loading"
                            type="text"
                            data-vv-name="firstName"
                            required
                        />
                        <span class="md-error">{{
                            errors.first('firstName')
                        }}</span>
                        <slide-y-down-transition>
                            <md-icon
                                v-show="errors.has('firstName')"
                                class="error"
                            >
                                close
                            </md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon
                                v-show="
                                    !errors.has('firstName') &&
                                        touched.firstName
                                "
                                class="success"
                            >
                                done
                            </md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-field
                        :class="[
                            {
                                'md-valid':
                                    !errors.has('lastName') && touched.lastName
                            },
                            { 'md-error': errors.has('lastName') }
                        ]"
                    >
                        <label>Last Name</label>
                        <md-input
                            v-model="patient.lastName"
                            v-validate="modelValidations.lastName"
                            :disabled="loading"
                            type="text"
                            data-vv-name="lastName"
                            required
                        />
                        <span class="md-error">{{
                            errors.first('lastName')
                        }}</span>
                        <slide-y-down-transition>
                            <md-icon
                                v-show="errors.has('lastName')"
                                class="error"
                            >
                                close
                            </md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon
                                v-show="
                                    !errors.has('lastName') && touched.lastName
                                "
                                class="success"
                            >
                                done
                            </md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-field
                        :class="[
                            {
                                'md-valid':
                                    !errors.has('phone') && touched.phone
                            },
                            { 'md-error': errors.has('phone') }
                        ]"
                    >
                        <label>Phone</label>
                        <span class="md-prefix">+</span>
                        <md-input
                            v-model="patient.phone"
                            v-validate="modelValidations.phone"
                            :disabled="loading"
                            type="number"
                            data-vv-name="phone"
                            required
                        />
                        <span class="md-error">{{
                            errors.first('phone')
                        }}</span>
                        <slide-y-down-transition>
                            <md-icon v-show="errors.has('phone')" class="error">
                                close
                            </md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon
                                v-show="!errors.has('phone') && touched.phone"
                                class="success"
                            >
                                done
                            </md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>
            </div>

            <div class="md-layout  md-small-size-100 md-size-50">
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label>Source</label>
                        <md-input
                            v-model="patient.source"
                            :disabled="loading"
                        />
                    </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label>Address</label>
                        <md-input
                            v-model="patient.address"
                            :disabled="loading"
                        />
                    </md-field>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-datepicker
                        v-model="patient.birthday"
                        md-immediately
                        :disabled="loading"
                    >
                        <label>Birthday date</label>
                    </md-datepicker>
                </div>

                <div class="md-layout-item md-size-100">
                    <md-field
                        :class="[
                            {
                                'md-valid':
                                    !errors.has('email') && touched.email
                            },
                            { 'md-error': errors.has('email') }
                        ]"
                    >
                        <label>Email Address</label>
                        <md-input
                            v-model="patient.email"
                            v-validate="modelValidations.email"
                            :disabled="loading"
                            type="email"
                            data-vv-name="email"
                            required
                        />
                        <span class="md-error">{{
                            errors.first('email')
                        }}</span>
                        <slide-y-down-transition>
                            <md-icon v-show="errors.has('email')" class="error">
                                close
                            </md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon
                                v-show="!errors.has('email') && touched.email"
                                class="success"
                            >
                                done
                            </md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-chips
                        v-model="allergy"
                        :disabled="loading"
                        class="md-danger"
                        md-placeholder="Add allergy..."
                    />
                    <span class="small helper"
                        >Enter allergent name and click "Enter"</span
                    >
                </div>
            </div>
        </md-card-content>
        <md-card-actions>
            <md-button
                :disabled="loading"
                class="md-raised md-success mt-4"
                @click="updateProfile"
            >
                <div v-if="loading">
                    <md-progress-spinner
                        class="t-white"
                        :md-diameter="12"
                        :md-stroke="2"
                        md-mode="indeterminate"
                    />
                    &nbsp;
                    <span>
                        Saving...
                    </span>
                </div>
                <span v-else>
                    Update Profile
                </span>
            </md-button>
        </md-card-actions>
        <!-- <generator/> -->
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SlideYDownTransition } from 'vue2-transitions';
import StarRating from 'vue-star-rating';
import { PATIENT_AVATAR_UPLOAD, PATIENT_UPDATE, NOTIFY } from '@/constants';
import components from '@/components';

const randomMC = require('random-material-color');

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
    data() {
        return {
            showRating: false,
            loading: false,
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
                    required: true
                },
                firstName: {
                    required: true,
                    min: 2
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
        patientColor() {
            const color = randomMC.getColor({
                text: this.firstName + this.lastName + this.phone + this.email
            });
            return color;
        },
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
            this.patient.color = this.patientColor;
            this.$validator
                .validateAll('firstName', 'email', 'phone', 'lastName')
                .then(result => {
                    if (result) {
                        this.loading = true;
                        this.$store
                            .dispatch(PATIENT_UPDATE, {
                                patient: this.patient
                            })
                            .then(response => {
                                if (response) {
                                    this.loading = false;
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message:
                                                'Settings updated successfully',
                                            type: 'success'
                                        }
                                    });
                                }
                            })
                            .catch(err => {
                                this.loading = false;
                                throw new Error(err);
                            });
                    }
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
