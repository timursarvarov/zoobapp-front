<template>
  <div class="md-layout login-wrapper text-center">
    <div class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100">
      <form>
        <login-card header-color="green">
          <h4
            slot="title"
            class="title"
          >Log in</h4>
          <md-button
            slot="buttons"
            to="#facebook"
            class="md-just-icon md-simple md-white"
          >
            <i class="fab fa-facebook-square"></i>
          </md-button>
          <md-button
            slot="buttons"
            to="#twitter"
            class="md-just-icon md-simple md-white"
          >
            <i class="fab fa-twitter"></i>
          </md-button>
          <md-button
            slot="buttons"
            to="#google"
            class="md-just-icon md-simple md-white"
          >
            <i class="fab fa-google-plus-g"></i>
          </md-button>
          <p
            slot="description"
            class="description"
          >Or Be Classical</p>

          <md-field
            class="md-form-group"
            slot="inputs"
            :class="[
            {'md-valid': !errors.has('username') && touched.username},
            {'md-error': errors.has('username')}]"
          >
            <md-icon>face</md-icon>
            <label>User Name...</label>
            <md-input
              ref="login"
              autocomplete="username"
              v-model="username"
              v-on:keyup.enter="passwordFocus()"
              data-vv-name="username"
              type="username"
              required
              v-validate="modelValidations.username"
            ></md-input>
            <span class="md-error">{{errors.first('username')}}</span>
            <slide-y-down-transition>
              <md-icon
                class="error"
                v-show="errors.has('username')"
              >close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('username') && touched.username"
              >done</md-icon>
            </slide-y-down-transition>
          </md-field>

          <md-field
            class="md-form-group"
            slot="inputs"
            :class="[{'md-error': errors.has('password')},
            {'md-valid': !errors.has('password') && touched.password}]"
          >
            <md-icon>lock_outline</md-icon>
            <label>Password...</label>
            <md-input
              ref="password"
              autocomplete="password"
              v-on:keyup.enter="login()"
              v-model="password"
              data-vv-name="password"
              type="password"
              required
              v-validate="modelValidations.password"
            ></md-input>
            <span class="md-error">{{errors.first('password')}}</span>
            <slide-y-down-transition>
              <md-icon
                class="error"
                v-show="errors.has('password')"
              >close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('password') && touched.password"
              >done</md-icon>
            </slide-y-down-transition>
          </md-field>
          <md-button
            slot="footer"
            @click="login"
            class="md-simple md-success md-lg"
          >
            Lets Go
          </md-button>

        </login-card>
      </form>
    </div>
  </div>
</template>
<script>
  import { LoginCard } from '@/components';
  import { AUTH_REQUEST, NOTIFY } from '@/store/modules/constants';
  import { SlideYDownTransition } from 'vue2-transitions';

  export default {
    components: {
      LoginCard,
      SlideYDownTransition,
    },
    data() {
      return {
        username: null,
        password: null,
        touched: {
          username: false,
          password: false,
        },
        modelValidations: {
          username: {
            required: true,
            min: 5,
          },
          password: {
            required: true,
            min: 5,
          },
        },
      };
    },
    methods: {
      validate() {
        this.$validator.validateAll().then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.username = true;
        this.touched.password = true;
      },
      passwordFocus() {
        this.$refs.password.$el.focus();
      },
      login() {
        const { username, password } = this;
        if (this.errors.has('username') || !this.username) {
          this.showErrorsValidate('username');
          this.$store.dispatch(NOTIFY, {
            settings: { message: 'Введите валидный логин' },
          });
          return;
        }
        if (this.errors.has('password') || !this.password) {
          this.showErrorsValidate('password');
          this.$store.dispatch(NOTIFY, {
            settings: { message: 'Введите валидный пароль' },
          });
          return;
        }
        this.$store.dispatch(AUTH_REQUEST, { username, password }).then(
          (response) => {
            this.$router.push('/');
          },
          (error) => {
            if (error.response.data.message === 'Wrong password') {
              this.showErrorsValidate('password');
            }
            if (error.response.data.message === 'Invalid login') {
              this.showErrorsValidate('username');
            }
          },
        );
      },
      showErrorsValidate(errField = 'username') {
        const field = this.$validator.fields.find({
          name: errField,
          scope: this.$options.scope,
        });
        if (!field) return;
        this.$validator.errors.add({
          id: errField,
          field: errField,
          msg: errField === 'username' ? 'Invalid login' : 'Wrong password',
          scope: this.$options.scope,
        });
        field.setFlags({
          invalid: true,
          valid: false,
          validated: true,
        });
      },
    },
    mounted() {
      this.$refs.login.$el.focus();
    },
    watch: {
      username() {
        this.touched.username = true;
      },
      password() {
        this.touched.password = true;
      },
    },
  };
</script>

<style lang="scss">
.login-wrapper {
  .md-field {
    margin-top: 24px;
    .md-error {
      position: absolute;
      left: 36px !important;
      display: block !important;
      opacity: 1;
      // transform: translate3d(0,-12px,0);
      color: #ff1744;
      font-size: 0.6875rem;
      bottom: -1.3rem;
      line-height: normal;
      text-align: left;
    }
  }
}
</style>
