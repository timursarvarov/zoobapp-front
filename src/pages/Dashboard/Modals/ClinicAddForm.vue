<template>
  <div>
    <md-dialog
      class="patient-add-form"
      :md-active.sync="showForm"
      :md-click-outside-to-close="!isLoadingRegistration"
    >
      <div>
        <md-card>
          <md-card-header class="md-card-header-icon">
            <div class="card-icon" :style="{'background-color': patientColor}" >
              <md-icon>person_add</md-icon>
            </div>
            <h4 class="title">Add New Patient</h4>
          </md-card-header>

          <md-card-content class="md-layout">

            <div class="md-layout-item md-size-50 md-small-size-100">
              <md-field :class="[
                {'md-valid': !errors.has('firstName') && touched.firstName},
                {'md-error': errors.has('firstName')}]">
                <label>First Name</label>
                <md-input
                  v-model="firstName"
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
            <div class="md-layout-item md-size-50 md-small-size-100">
              <md-field :class="[
                {'md-valid': !errors.has('lastName') && touched.lastName},
                {'md-error': errors.has('lastName')}]">
                <label>Last Name</label>
                <md-input
                  v-model="lastName"
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
            <div class="md-layout-item md-size-50 md-small-size-100">
              <md-field :class="[
                {'md-valid': !errors.has('email') && touched.email},
                {'md-error': errors.has('email')}]">
                <label>Email</label>
                <md-input
                  v-model="email"
                  type="email"
                  data-vv-name="email"
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
            <div class="md-layout-item md-size-50 md-small-size-100">
              <md-field :class="[
                {'md-valid': !errors.has('phone') && touched.phone},
                {'md-error': errors.has('phone')}]">
                <label>Phone</label>
                <span class="md-prefix">+</span>
                <md-input
                  name="phone"
                  v-model="phone"
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

            <div class="md-layout-item md-size-100 md-small-size-100">
              <md-checkbox v-model="noAllergy">No Allergy</md-checkbox>
            </div>

            <div class="md-layout-item wrapper-chips md-size-100 md-small-size-100">
              <md-chips
                :class="[
                  {'md-valid': !errors.has('allergy') && touched.allergy},
                  {'md-error': errors.has('allergy')}]"
                v-model="allergy"
                v-validate="{ required: !noAllergy}"
                class="md-danger"
                data-vv-name="allergy"
                md-placeholder="Add allergy and press 'ENTER'"
              ></md-chips>
              <span class="md-error">{{errors.first('allergy')}}</span>
            </div>
            <div class="md-layout-item">
              <md-field>
                <label for="movies">Doctors</label>
                <md-select
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

              <md-field :class="[
                {'md-valid': !errors.has('source') && touched.source},
                {'md-error': errors.has('source')}]">
                <label>Source</label>
                <md-input
                  v-model="source"
                  type="text"
                  data-vv-name="source"
                  required
                  v-validate="modelValidations.source"
                ></md-input>
                <span class="md-error">{{errors.first('source')}}</span>
                <slide-y-down-transition>
                  <md-icon
                    class="error"
                    v-show="errors.has('source')"
                  >close</md-icon>
                </slide-y-down-transition>
                <slide-y-down-transition>
                  <md-icon
                    class="success"
                    v-show="!errors.has('source') && touched.source"
                  >done</md-icon>
                </slide-y-down-transition>
              </md-field>
            </div>
          </md-card-content>
          <md-card-actions md-alignment="right">
            <div>
              <md-checkbox
                @change="setCloseFormAfter()"
                v-model="closeAddForm"
              >Close form after</md-checkbox>
            </div>
            <div>
              <md-checkbox
                @change="setOpenProfileAfterCreation()"
                v-model="openProfile"
              >Open patient profile</md-checkbox>
            </div>
            <md-button
              @click="addPatient()"
              class=" md-success"
            >Create</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </md-dialog>
  </div>
</template>
<script>
  import {
    PATIENT_CREATE,
    NOTIFY,
    PATIENT_SET_PARAMS,
  } from '@/constants';
  import { SlideYDownTransition } from 'vue2-transitions';

  const randomMC = require('random-material-color');


  export default {
    components: {
      SlideYDownTransition,
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
            this.$store
              .dispatch(PATIENT_CREATE, {
                patient: {
                  firstName: this.firstName,
                  lastName: this.lastName,
                  source: this.source,
                  phone: parseInt(this.phone, 10),
                  email: this.email,
                  allergy: this.allergy,
                  color: this.patientColor,
                },
              })
              .then((response) => {
                if (response) {
                  if (this.openProfile) {
                    this.$store.dispatch(PATIENT_SET_PARAMS, {
                      patient: response.data,
                    });
                    this.$router.push({
                      name: 'PatientTreatment',
                      params: { patientId: response.data.ID },
                    });
                  }
                  if (this.closeAddForm) {
                    this.showForm = false;
                  }
                  this.clearForm();
                  this.$store.dispatch(NOTIFY, {
                    settings: {
                      message: 'Settings updated successfully',
                      type: 'primary',
                    },
                  });
                }
            });
          }
        });
      },
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
          this.$clinicAddForm.patientAddFormShown = !this.$clinicAddForm
            .patientAddFormShown;
        },
      },
    },
    created() {
      this.randomMC = randomMC;
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
          localStorage.setItem('USER_SETTINGS_OPEN_PATIENT_PROFILE', true);
          this.openProfile = true;
        } else {
          this.openProfile = false;
        }
        this.closeAddForm = localStorage.getItem(
          'USER_SETTINGS_CLOSE_PATIENT_ADD_FORM',
        );
        console.log(this.closeAddForm);
        if (this.closeAddForm === 'true') {
          this.closeAddForm = true;
        } else if (this.closeAddForm === null) {
          this.closeAddForm = true;
          localStorage.setItem('USER_SETTINGS_CLOSE_PATIENT_ADD_FORM', true);
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
.md-dialog.patient-add-form {
  background-color: transparent !important;
  box-shadow: none !important;
  .md-field {
    margin-top: 24px;
    .md-error {
      display: block !important;
      left: 0;
      opacity: 1;
      // transform: translate3d(0,-12px,0);
      color: #ff1744;
      font-size: 0.6875rem;
      bottom: -1.3rem;
      line-height: normal;
      text-align: left;
    }
  }
    .card-icon{
      transition: all 2.5s ease;
    }
  .wrapper-chips {
    margin-top: -30px;
    .md-error {
      display: block !important;
      left: 0;
      opacity: 1;
      // transform: translate3d(0,-12px,0);
      color: #ff1744;
      font-size: 0.6875rem;
      bottom: -0.3rem;
      line-height: normal;
      text-align: left;
    }
  }
}
</style>
