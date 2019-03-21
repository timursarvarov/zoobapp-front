<template>
  <div>
    <h5 class="info-text"> Please check your email for code we sent <br/>
    if your email is empty, please check spam too</h5>
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
         <md-field>
          <md-icon>email</md-icon>
          <label>Email</label>
          <md-input
            disabled
            v-model="email"
            data-vv-name="email"
            type="text"
            name="email"
            v-validate="modelValidations.email"
          >
          </md-input>
        </md-field>

        <md-field
            class="md-form-group"
            slot="inputs"
            :class="[{'md-error': errors.has('code')},
            {'md-valid': !errors.has('code') && touched.code}]"
          >
            <md-icon>lock_outline</md-icon>
            <label>code</label>
            <md-input
              ref="code"
              autocomplete="code"
              v-on:keyup.enter="focusOn('')"
              v-model="code"
              data-vv-name="code"
              type="code"
              required
              v-validate="modelValidations.code"
            ></md-input>
            <span class="md-error">{{errors.first('code')}}</span>
            <slide-y-down-transition>
              <md-button v-show="errors.has('code')"
              @click="code='',focusOn('code')"
              class="md-just-icon md-round  md-input-action clear-button  md-simple">
                <md-icon
                  class="error"
                >close</md-icon>
              </md-button>
          </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('code') && touched.code"
              >done</md-icon>
            </slide-y-down-transition>
          </md-field>
      </div>
    </div>
  </div>
</template>
<script>
  import { SlideYDownTransition } from 'vue2-transitions';

  export default {
    components: {
      SlideYDownTransition,
    },
    props: {
      email: {
        type: String,
        default: '',
      },
      error: {
        type: Object,
        default: {
          message: 'Wrong code',
          type: 'code',
        },
      },
    },
    data() {
      return {
        code: '',
        touched: {
          code: false,
        },
        modelValidations: {
          code: {
            required: true,
            min: 5,
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
      showErrorsValidate(error) {
        if (error.message === '') {
          return;
        }
        const field = this.$validator.fields.find({
          name: error.type,
          scope: this.$options.scope,
        });
        if (!field) return;
        this.$validator.errors.add({
          id: error.type,
          field: error.type,
          msg: error.message,
          scope: this.$options.scope,
        });
        field.setFlags({
          invalid: true,
          valid: false,
          validated: true,
        });
      },
      validate() {
        return this.$validator.validateAll().then((res) => {
          this.$emit('on-validated', res, 'step2');
          this.$emit('validated-code', this.code);
          return res;
        });
      },
    },
    watch: {
      error: {
        handler(val, oldVal) {
          if (val.message) {
            this.showErrorsValidate(val);
            this.error.message = '';
          }
        },
        deep: true,
      },
      code() {
        this.touched.code = true;
        this.$emit('on-validated', this.code);
      },
    },
    mounted() {
      this.$refs.code.$el.focus();
    },
  };
</script>
<style>
</style>
