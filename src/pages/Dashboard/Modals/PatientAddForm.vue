<template>
  <div >
    <md-dialog
      :md-active.sync="showForm"
      :md-click-outside-to-close="!isLoadingRegistration" >
      <div>
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>person_add</md-icon>
            </div>
            <h4 class="title">Add New Patient</h4>
          </md-card-header>

          <md-card-content class="md-layout">

            <div class="md-layout-item md-size-50 md-small-size-100" >
              <md-field
                :class="[
                {'md-valid': !errors.has('firstName') && touched.firstName},
                {'md-error': errors.has('firstName')}]">
                <label>First Name</label>
                <md-input
                  v-model="firstName"
                  type="text"
                  data-vv-name="firstName"
                  required
                  v-validate="modelValidations.firstName"></md-input>
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
            <div class="md-layout-item md-size-50 md-small-size-100" >
              <md-field
                :class="[
                {'md-valid': !errors.has('lastName') && touched.lastName},
                {'md-error': errors.has('lastName')}]">
                <label>Last Name</label>
                <md-input
                  v-model="lastName"
                  type="text"
                  data-vv-name="lastName"
                  required
                  v-validate="modelValidations.lastName"></md-input>
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
              <md-field
                :class="[
                {'md-valid': !errors.has('email') && touched.email},
                {'md-error': errors.has('email')}]">
                <label>Email</label>
                <md-input
                  v-model="email"
                  type="email"
                  data-vv-name="email"
                  v-validate="modelValidations.email"></md-input>
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
              <md-field
                :class="[
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
                  v-validate="modelValidations.phone"></md-input>
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

              <div v-if="!noAllergy"
                class="md-layout-item wrapper-chips md-size-100 md-small-size-100">
                  <md-chips
                  :class="[
                  {'md-valid': !errors.has('allergy') && touched.allergy},
                  {'md-error': errors.has('allergy')}]"
                    v-model="allergy"
                    v-validate="`allergy|required`"
                    class="md-primary"
                    data-vv-name="allergy"
                    md-placeholder="Add allergy..."
                  ></md-chips>
                  <span class="md-error">{{errors.first('allergy')}}</span>
            </div>
          </md-card-content>

          <md-card-actions md-alignment="left">
            <md-button  @click="addPatient()" class="md-success">Submit</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </md-dialog>
  </div>
</template>
<script>
  import { PATIENT_CREATE, NOTIFY } from '@/store/modules/constants';
  import { SlideYDownTransition } from 'vue2-transitions';

  export default {
    components: {
      SlideYDownTransition,
    },
    data() {
      return {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        noAllergy: false,
        allergy: [],
        isLoadingRegistration: false,
        touched: {
          firstName: false,
          lastName: false,
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
          email: {
            email: true,
          },
          phone: {
            required: true,
            min: 12,
          },
          allergy: {
            required: true,
          },
        },
      };
    },
    methods: {
      validate() {
        this.$validator.validateAll().then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.firstName = true;
        this.touched.lastName = true;
        this.touched.email = true;
        this.touched.phone = true;
        this.touched.allergy = true;
      },
      addPatient() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store.dispatch(PATIENT_CREATE, {
              patient: {
                firstName: this.firstName,
                lastName: this.lastName,
                phone: this.phone,
                email: this.email,
                allergy: this.allergy,
              },
            }).then(
              (response) => {
                if (response) {
                  this.$store.dispatch(NOTIFY, { settings: { message: 'Settings updated successfully', type: 'primary' } });
                }
              },
            );
          }
        });
      },

    },
    computed: {
      showForm: {
        get() {
          return this.$patientAddForm.patientAddFormShown;
        },
        set() {
          this.$patientAddForm.patientAddFormShown = !this.$patientAddForm.patientAddFormShown;
        },
      },
    },
    watch: {
      firstName() {
        this.touched.firstName = true;
      },
      lastName() {
        this.touched.lastName = true;
      },
      email() {
        this.touched.email = true;
      },
      phone() {
        this.touched.phone = true;
      },
      allergy() {
        this.touched.allergy = true;
      },
    },
    created() {
      const self = this;
      this.$validator.extend('allergy', {
        getMessage() {
          return 'Allergent required';
        },
        validate(value, field) {
          console.log(field);
          console.log(value);
          const hasValue = self.noAllergy ? self.noAllergy : !!value.length;
          return hasValue;
        },
      });
    },
  };
</script>
<style lang="scss" >
  .md-dialog {
      background-color: transparent!important;
      box-shadow: none !important;
      .md-field {
        margin-top: 24px;
        .md-error {
        display: block!important;
        left: 0;
        opacity: 1;
        // transform: translate3d(0,-12px,0);
        color: #ff1744;
        font-size: .6875rem;
        bottom: -1.3rem;
        line-height: normal;
        text-align:left;
        }
    }
    .wrapper-chips{
        margin-top: -30px;
        .md-error {
        display: block!important;
        left: 0;
        opacity: 1;
        // transform: translate3d(0,-12px,0);
        color: #ff1744;
        font-size: .6875rem;
        bottom: -1.3rem;
        line-height: normal;
        text-align:left;
        }
    }
  };
</style>
