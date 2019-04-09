<template>
  <div>
    <md-dialog
    @md-opened="focusOn('planTitle')"
      class="plan-add-form"
      :md-active.sync="showFormL"
    >
      <div>
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>playlist_add</md-icon>
            </div>
            <h4 class="title">Add New Plan</h4>
          </md-card-header>
          <md-card-content class="md-layout">
            <div class="md-layout-item">
              <md-field :class="[
                {'md-valid': !errors.has('planTitle') && touched.planTitle},
                {'md-error': errors.has('planTitle')}]"
                >
                <label>Plane title</label>
                <md-input
                  ref="planTitle"
                  v-model="planTitle"
                  type="text"
                  data-vv-name="planTitle"
                  required
                  v-validate="{'verify_plan':this.plansTitles, required: true, min: 2}"
                ></md-input>
                <span class="md-error">{{errors.first('planTitle')}}</span>
                <slide-y-down-transition>
                    <md-button v-show="errors.has('planTitle')"
                    @click="planTitle='',focusOn('planTitle')"
                    class="md-just-icon md-round  md-input-action clear-button  md-simple">
                      <md-icon
                        class="error"
                      >close</md-icon>
                    </md-button>
                </slide-y-down-transition>
                <slide-y-down-transition>
                  <md-icon
                    class="success"
                    v-show="!errors.has('planTitle') && touched.planTitle"
                  >done</md-icon>
                </slide-y-down-transition>
              </md-field>
            </div>

          </md-card-content>
          <md-card-actions md-alignment="right">
            <md-button
              @click="addPlan()"
              class="md-success"
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
    } from '@/constants';
    import { SlideYDownTransition } from 'vue2-transitions';

    export default {
      props: {
        showForm: {
          type: Boolean,
          default: () => false,
        },
        plans: {
          type: Array,
          default: () => [],
        },
      },
      components: {
        SlideYDownTransition,
      },
      data() {
        return {
          planTitle: null,
          touched: {
            planTitle: false,
          },
        };
      },
      methods: {
        focusOn(ref) {
          if (!this.$refs[ref]) {
            return;
          }
          this.$nextTick(() => {
            this.$refs[ref].$el.focus();
          });
        },
        validate() {
          this.$validator.validateAll().then((isValid) => {
            this.$emit('on-submit', this.registerForm, isValid);
          });
          this.touched.planTitle = true;
        },
        clearForm() {
          this.planTitle = null;
          this.showFormL = false;
        },
        setInitialName() {
          this.planTitle = `Plan № ${this.plans.length + 1}`;
        },
        addPlan() {
          this.$validator.validateAll().then((result) => {
            if (result) {
              const plan = {
                title: this.planTitle,
                id: Math.random(),
              };
              this.$store.dispatch(NOTIFY, {
                settings: {
                  message: `${this.planTitle} plan added`,
                  type: 'success',
                },
              });
              this.$emit('onPlanCreated', plan);
              this.clearForm();
            }
          });
        },
      },
      computed: {
        plansTitles() {
          const titles = [];
          this.plans.forEach((plan, index) => {
            titles[index] = plan.title;
          });
          return titles;
        },
        showFormL: {
          get() {
            return this.showForm;
          },
          set(value) {
            this.$emit('update:showForm', value);
          },
        },
      },
      watch: {
        showFormL(value) {
          if (value) {
            this.setInitialName();
          }
        },
        planTitle() {
          this.touched.planTitle = true;
        },
      },
    };
</script>
<style lang="scss" >
.md-dialog.plan-add-form {
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
  .card-icon {
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
