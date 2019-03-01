<template>
  <md-card class="md-card-profile patient-card-wrapper">

    <div class="md-card-avatar">
      <div class="picture-container">
        <div class="picture">
          <div class="picture-hint md-layout">
            <md-icon class="md-layout-item md-size-2x">add_a_photo</md-icon>
          </div>
          <img
            v-if="patient.avatar"
            class="avatar"
            :style="{'background-color': patientColor }"
            :alt="patient.firstName[0]+patient.lastName[0]"
            :src="patient.avatar"
          />
          <div
            class="md-layout md-alignment-center-center picture-wrapper-acronim"
            :style="{'background-color': patientColor }"
          >
            <div class="md-layout-item acronim">
              <span v-if="patient.firstName">{{patient.firstName[0]}}{{patient.lastName[0]}}</span>
            </div>
            <input
              type="file"
              @change="onFileChange"
              ref="imageInserter"
              accept="image/*"
            >
          </div>
        </div>
      </div>
    </div>
    <md-card-content>
      <div class="md-layout md-gutter">

        <div class="md-layout-item md-small-size-50   md-xsmall-size-100  md-size-33  ">
          <md-field :class="[
              {'md-valid': !errors.has('firstName') && touched.firstName},
              {'md-error': errors.has('firstName')}]">
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
              <md-icon
                class="error"
                v-show="errors.has('firstName')"
              >close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('firstName') && touched.firstName"
              >done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-50   md-xsmall-size-100  md-size-33  ">
          <md-field :class="[
              {'md-valid': !errors.has('lastName') && touched.lastName},
              {'md-error': errors.has('lastName')}]">
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
              <md-icon
                class="error"
                v-show="errors.has('lastName')"
              >close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('lastName') && touched.lastName"
              >done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-50   md-xsmall-size-100  md-size-33  ">
          <md-field>
            <label>Source</label>
            <md-input v-model="patient.source"></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-50   md-xsmall-size-100  md-size-33  ">
          <md-field>
            <label>Address</label>
            <md-input v-model="patient.address"></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-50   md-xsmall-size-100  md-size-33  ">

          <md-datepicker
            md-immediately
            v-model="patient.birthday"
          >
            <label>Birthday date</label>
          </md-datepicker>

        </div>

        <div class="md-layout-item md-small-size-50   md-xsmall-size-100  md-size-33  ">
          <md-field :class="[
              {'md-valid': !errors.has('phone') && touched.phone},
              {'md-error': errors.has('phone')}]">
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
              <md-icon
                class="error"
                v-show="errors.has('phone')"
              >close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('phone') && touched.phone"
              >done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-50   md-xsmall-size-100  md-size-33  ">
          <md-field :class="[
            {'md-valid': !errors.has('email') && touched.email},
            {'md-error': errors.has('email')}]">
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
              <md-icon
                class="error"
                v-show="errors.has('email')"
              >close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('email') && touched.email"
              >done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>
        <div class="md-layout-item md-layout switch md-gutter md-small-size-50 md-alignment-center-center md-xsmall-size-100  md-size-66 ">
          <div class="md-layout-item md-size-50">
            <md-switch v-model="showRating">Show Rating</md-switch>
          </div>
          <div class="md-layout-item md-size-50">
            <star-rating
              v-show="showRating"
              :glow="5"
              :show-rating="false"
              :star-size="18"
              v-model="patient.rating"
            ></star-rating>
          </div>
        </div>
        <div class="md-layout-item md-size-100">
          <md-chips
            v-model="patient.allergy"
            class="md-danger"
            md-placeholder="Add allergy..."
          ></md-chips>
        </div>
        <div class="md-layout-item md-size-100 text-right">
          <md-button
            @click="updateProfile"
            class="md-raised md-success mt-4"
          >Update Profile</md-button>
        </div>
      </div>
      <image-cropper-form
        v-model="fd"
        :maxFilesize="2000"
        buttonColor='green'
        title="Add patient avatar"
        :icon="'add_a_photo'"
        :imageName="patient.ID != null ? patient.ID.toString() + '_' + Date.now(): ''"
        :imageToCorp="image"
        :showForm.sync="showForm"
      ></image-cropper-form>

    </md-card-content>

  </md-card>
</template>
<script>
  import {
    PATIENT_AVATAR_UPLOAD,
    PATIENT_UPDATE,
    NOTIFY,
  } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';
  import { SlideYDownTransition } from 'vue2-transitions';
  import StarRating from 'vue-star-rating';
  import { ImageCropperForm } from '@/pages';

  const randomMC = require('random-material-color');

  export default {
    components: {
      SlideYDownTransition,
      ImageCropperForm,
      StarRating,
    },
    name: 'patient-card',
    props: {
      cardpatientImage: {
        type: String,
        default: './img/faces/marc.jpg',
      },
      buttonColor: {
        type: String,
        default: '',
      },
      avatar: {
        type: String,
        default: './img/default-avatar.png',
      },
    },
    data() {
      return {
        fd: null,
        showRating: false,
        showForm: false,
        image: '',
        address: null,
        touched: {
          firstName: false,
          lastName: false,
          email: false,
          phone: false,
        },
        modelValidations: {
          lastName: {
            required: true,
          },
          firstName: {
            required: true,
            min: 2,
          },
          email: {
            email: true,
          },
          phone: {
            required: true,
            min: 12,
          },
        },
      };
    },
    methods: {
      clearImage() {
        const input = this.$refs.imageInserter;
        input.type = 'text';
        input.type = 'file';
      },
      getColorButton(buttonColor) {
        return `md-${buttonColor}`;
      },
      onFileChange(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
          this.createImage(files[0]);
          this.showForm = true;
          this.clearImage();
        } else {
          this.$store.dispatch(NOTIFY, {
            settings: {
              message: 'No files selected!',
              type: 'warning',
            },
          });
        }
      },
      validate() {
        this.$validator.validateAll().then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.lastName = true;
        this.touched.firstName = true;
        this.touched.email = true;
        this.touched.phone = true;
      },
      createImage(file) {
        const reader = new FileReader();
        const vm = this;
        reader.onload = (e) => {
          vm.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      updateProfile() {
        this.patient.color = this.patientColor;
        this.$validator
          .validateAll('firstName', 'email', 'phone', 'lastName')
          .then((result) => {
            if (result) {
              this.$store
                .dispatch(PATIENT_UPDATE, {
                  patient: this.patient,
                })
                .then((response) => {
                  if (response) {
                    this.$store.dispatch(NOTIFY, {
                      settings: {
                        message: 'Settings updated successfully',
                        type: 'success',
                      },
                    });
                  }
              });
            }
        });
      },

      updatepatientAvatar(fd) {
        const patient = {
          ID: this.patient.ID,
          fd,
        };

        this.$store
          .dispatch(PATIENT_AVATAR_UPLOAD, {
            patient,
          })
          .then(
            (response) => {
              console.log(response);
              this.$store.dispatch(NOTIFY, {
                settings: {
                  message: 'Image uploaded',
                  type: 'success',
                },
              });
            },
            (err) => {
              this.selectedFileUrl = null;
              console.log(err);
            },
        );
      },
    },

    computed: {
      ...mapGetters({
        patient: 'getPatient',
      }),
      patientColor() {
        const color = randomMC.getColor({
          text: this.firstName + this.lastName + this.phone + this.email,
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
      },
    },
    watch: {
      fd() {
        this.updatepatientAvatar(this.fd);
      },
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
    },
  };
</script>
<style lang="scss" >
.patient-card-wrapper {
  .switch {
    margin-top: 20px;
  }
  .picture-wrapper-acronim {
    transition: all 2.5s ease;
  }
  .slider {
    margin-top: 58px;
  }

  .md-datepicker-dialog {
    height: 286px;
  }
  .md-datepicker-body-content {
    height: 232px !important;
  }
}
</style>
