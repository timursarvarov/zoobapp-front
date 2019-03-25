<template>
  <div>
    <md-dialog
      class="patient-add-form"
      :md-active.sync="showForml"
      :md-click-outside-to-close="!isLoadingRegistration"
    >
      <div>
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon" >
              <md-icon>person_add</md-icon>
            </div>
            <h4 class="title">Invite New Collaborator</h4>
          </md-card-header>

          <md-card-content  class="md-layout">

            <div  autocomplete="off" class="md-layout-item md-size-100 ">
              <md-field
               autocomplete="off"
               :class="[
                {'md-valid': !errors.has('email') && touched.email},
                {'md-error': errors.has('email')}]">
                <label>Email</label>
                <md-input
                   autocomplete="off"
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

          </md-card-content>
          <md-card-actions md-alignment="right">
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
    COLLABORATOR_CREATE, NOTIFY,
  } from '@/constants';
  import { SlideYDownTransition } from 'vue2-transitions';


  const randomMC = require('random-material-color');


  export default {
    components: {
      SlideYDownTransition,
    },
    props: {
      showForm: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        email: null,
        isLoadingRegistration: false,
        touched: {
          email: false,
        },
        modelValidations: {
          email: {
            email: true,
          },
        },
      };
    },
    methods: {
      validate() {
        this.$validator.validateAll().then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.email = true;
      },
      clearForm() {
        this.email = null;
        this.$nextTick(() => this.$validator.reset());
      },
      addPatient() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store
              .dispatch(COLLABORATOR_CREATE, {
                params: {
                  email: this.email,
                },
              })
              .then((response) => {
                if (response) {
                  this.showForml = false;
                  this.clearForm();
                  this.$store.dispatch(NOTIFY, {
                    settings: {
                      message: 'Inventation was sent',
                      type: 'success',
                    },
                  });
                }
            });
          }
        });
      },
    },
    computed: {
      showForml: {
        get() {
          return this.showForm;
        },
        set(e) {
          this.$emit('update:showForm', e);
        },
      },
    },
    watch: {
      email() {
        this.touched.email = true;
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
