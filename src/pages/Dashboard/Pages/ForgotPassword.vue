<template>
  <div>
    <md-dialog
      class="patient-add-form"
      :md-active.sync="showFormL"
    >
      <div>
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon" >
              <md-icon>email</md-icon>
            </div>
            <h4 class="title">Enter email to recover a password</h4>
          </md-card-header>

          <md-card-content class="md-layout">

            <div class="md-layout-item md-size-100 ">
              <md-field :class="[
                {'md-valid': !errors.has('email') && touched.email},
                {'md-error': errors.has('email')}]">
                <label>Email</label>
                <md-input
                    ref="email"
                  v-model="email"
                  type="email"
                  data-vv-name="email"
                  v-validate="modelValidations.email"
                ></md-input>
                <span class="md-error">{{errors.first('email')}}</span>
                <slide-y-down-transition>
                    <md-button v-show="errors.has('email')"
                        @click="email='',focusOn('email')"
                        class="md-just-icon md-round  md-input-action clear-button  md-simple">
                        <md-icon
                            class="error"
                        >close</md-icon>
                    </md-button>
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
          <div class="actions md-layout md-gutter">
            <md-button
              @click="sendPassword()"
              class=" ml-auto  md-success"
            >Send</md-button>
          </div>
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
    computed: {
      showFormL: {
        get() { return this.showForm; },
        set(newValue) {
          this.$emit('update:showForm', newValue);
        },
      },
    },
    methods: {
      focusOn(ref) {
        if (!this.$refs[ref]) {
          return;
        }
        this.$refs[ref].$el.focus();
      },
    },
    validate() {
      this.$validator.validateAll().then((isValid) => {
        this.$emit('on-submit', this.registerForm, isValid);
      });
      this.touched.email = true;
    },
    clearForm() {
      this.email = null;
    },
    sendPassword() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch(NOTIFY, {
            settings: {
              message: 'Here we send an email',
              type: 'primary',
            },
          });
          // this.$store
          //   .dispatch(PATIENT_CREATE, {
          //     params: {
          //       email: this.email,
          //     },
          //   })
          //   .then((response) => {
          //     if (response) {
          //     this.$router.push('/');
          //     this.$store.dispatch(NOTIFY, {
          //         settings: {
          //           message: 'Settings updated successfully',
          //           type: 'primary',
          //         },
          //       });
          //     }
          // });
        }
      });
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
    .actions{
        padding: 20px 0 20px 0;
    }
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
