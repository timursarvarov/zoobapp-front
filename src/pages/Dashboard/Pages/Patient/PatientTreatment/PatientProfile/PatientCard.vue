<template>
    <div class="patient-card-wrapper">
        <!-- <t-avatar-input
            :color="patientColor"
            :imageSrc="patient.avatar"
            :title="patient.firstName + ' ' + patient.lastName"
            :formTitle="'Add patient foto'"
            :buttonColor="'green'"
            @on-created="updatepatientAvatar"
        />-->
        <md-card-content>
            <div class="md-layout md-gutter">
                <div
                    class="md-layout md-layout-item  md-small-size-100 md-size-50"
                >
                    <div class="md-layout-item md-size-100 avatart-wrapper">
                        <t-avatar-input
                            :color="patientColor"
                            :imageSrc="patient.avatar"
                            :title="patient.firstName + ' ' + patient.lastName"
                            :formTitle="'Add patient foto'"
                            :buttonColor="'green'"
                            @on-created="updatepatientAvatar"
                        />
                    </div>
                    <div class="md-layout-item md-size-100">
                        <md-field
                            :class="[
                            {'md-valid': !errors.has('firstName') && touched.firstName},
                            {'md-error': errors.has('firstName')}]"
                        >
                            <label>First Name</label>
                            <md-input
                                v-model="patient.firstName"
                                type="text"
                                data-vv-name="firstName"
                                required
                                v-validate="modelValidations.firstName"
                            ></md-input>
                            <span class="md-error">{{errors.first('firstName')}}</span>
                            <slide-y-down-transition>
                                <md-icon class="error" v-show="errors.has('firstName')">close</md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon
                                    class="success"
                                    v-show="!errors.has('firstName') && touched.firstName"
                                >done</md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-100">
                        <md-field
                            :class="[
                                {'md-valid': !errors.has('lastName') && touched.lastName},
                                {'md-error': errors.has('lastName')}]"
                        >
                            <label>Last Name</label>
                            <md-input
                                v-model="patient.lastName"
                                type="text"
                                data-vv-name="lastName"
                                required
                                v-validate="modelValidations.lastName"
                            ></md-input>
                            <span class="md-error">{{errors.first('lastName')}}</span>
                            <slide-y-down-transition>
                                <md-icon class="error" v-show="errors.has('lastName')">close</md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon
                                    class="success"
                                    v-show="!errors.has('lastName') && touched.lastName"
                                >done</md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-100">
                        <md-field
                            :class="[
                                {'md-valid': !errors.has('phone') && touched.phone},
                                {'md-error': errors.has('phone')}]"
                        >
                            <label>Phone</label>
                            <span class="md-prefix">+</span>
                            <md-input
                                v-model="patient.phone"
                                type="number"
                                data-vv-name="phone"
                                required
                                v-validate="modelValidations.phone"
                            ></md-input>
                            <span class="md-error">{{errors.first('phone')}}</span>
                            <slide-y-down-transition>
                                <md-icon class="error" v-show="errors.has('phone')">close</md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon
                                    class="success"
                                    v-show="!errors.has('phone') && touched.phone"
                                >done</md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                </div>

                <div
                    class="md-layout md-layout-item md-small-size-100 md-size-50"
                >
                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label>Source</label>
                            <md-input v-model="patient.source"></md-input>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label>Address</label>
                            <md-input v-model="patient.address"></md-input>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-100">
                        <md-datepicker md-immediately v-model="patient.birthday">
                            <label>Birthday date</label>
                        </md-datepicker>
                    </div>


                    <div class="md-layout-item md-size-100">
                        <md-field
                            :class="[
                        {'md-valid': !errors.has('email') && touched.email},
                        {'md-error': errors.has('email')}]"
                        >
                            <label>Email Address</label>
                            <md-input
                                v-model="patient.email"
                                type="email"
                                data-vv-name="email"
                                required
                                v-validate="modelValidations.email"
                            ></md-input>
                            <span class="md-error">{{errors.first('email')}}</span>
                            <slide-y-down-transition>
                                <md-icon class="error" v-show="errors.has('email')">close</md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon
                                    class="success"
                                    v-show="!errors.has('email') && touched.email"
                                >done</md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                     <div class="md-layout-item md-size-100">
                        <md-chips
                            v-model="patient.allergy"
                            class="md-danger"
                            md-placeholder="Add allergy..."
                        ></md-chips>
                        <span class="small helper">Enter allergent name and click "Enter"</span>
                    </div>
                </div>
            </div>
        </md-card-content>
        <md-card-actions>
            <div class="md-layout-item md-layout switch md-alignment-center-space-between">
                <div class="md-layout-item">
                    <md-switch v-model="showRating">Show Rating</md-switch>
                </div>
                <div class="md-layout-item">
                    <star-rating
                        v-show="showRating"
                        :glow="5"
                        :show-rating="false"
                        :star-size="18"
                        v-model="patient.rating"
                    ></star-rating>
                </div>
            </div>

            <md-button @click="updateProfile" class="md-raised md-success mt-4">Update Profile</md-button>
        </md-card-actions>
        <!-- <generator/> -->
    </div>
</template>
<script>
import { PATIENT_AVATAR_UPLOAD, PATIENT_UPDATE, NOTIFY } from "@/constants";
import { mapGetters } from "vuex";
import { SlideYDownTransition } from "vue2-transitions";
import StarRating from "vue-star-rating";
import { TAvatarInput } from "@/components";
// import generator from '@/svgImporter/jawSVGgenerator';

const randomMC = require("random-material-color");

export default {
    components: {
        SlideYDownTransition,
        StarRating,
        TAvatarInput
        // generator,
    },
    name: "patient-card",
    props: {
        cardpatientImage: {
            type: String,
            default: "./img/faces/marc.jpg"
        },
        buttonColor: {
            type: String,
            default: ""
        },
        avatar: {
            type: String,
            default: "./img/default-avatar.png"
        }
    },
    data() {
        return {
            showRating: false,
            showForm: false,
            image: "",
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
    methods: {
        getColorButton(buttonColor) {
            return `md-${buttonColor}`;
        },
        validate() {
            this.$validator.validateAll().then(isValid => {
                this.$emit("on-submit", this.registerForm, isValid);
            });
            this.touched.lastName = true;
            this.touched.firstName = true;
            this.touched.email = true;
            this.touched.phone = true;
        },
        updateProfile() {
            this.patient.color = this.patientColor;
            this.$validator
                .validateAll("firstName", "email", "phone", "lastName")
                .then(result => {
                    if (result) {
                        this.$store
                            .dispatch(PATIENT_UPDATE, {
                                patient: this.patient
                            })
                            .then(response => {
                                if (response) {
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message:
                                                "Settings updated successfully",
                                            type: "success"
                                        }
                                    });
                                }
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
                                message: "Image uploaded",
                                type: "success"
                            }
                        });
                    },
                    err => {
                        this.selectedFileUrl = null;
                        console.log(err);
                    }
                );
        }
    },

    computed: {
        ...mapGetters({
            patient: "getPatient"
        }),
        patientColor() {
            const color = randomMC.getColor({
                text: this.firstName + this.lastName + this.phone + this.email
            });
            return color;
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
    }
};
</script>
<style lang="scss" >
.patient-card-wrapper {
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
