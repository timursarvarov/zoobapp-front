<template>
  <div class="md-layout lock-wrapper text-center">
    <div class="md-layout-item md-size-50 md-small-size-100">
      <lock-card>
        <img class="img" slot="imageProfile" :src="getProfile.avatar"/>
        <h4 slot="title" class="title">{{getProfile.firstName + ' ' + getProfile.lastName}}</h4>
        <md-field  :class="[{'md-error': errors.has('password')},
          {'md-valid': !errors.has('password') && touched.password}]"  slot="content">
          <md-icon>lock_outline</md-icon>
          <label>Enter Password</label>
          <md-input
          v-model="password"
          type="password"
          v-on:keyup.enter="login()"
          data-vv-name="password"
          required
          v-validate="modelValidations.password"
          ></md-input>
          <span class="md-error">{{errors.first('password')}}</span>
          <span class="md-error">{{errors.first('username')}}</span>
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
        <md-button @click="login()" class="md-success md-round" slot="footer">Unlock</md-button>
      </lock-card>
    </div>
  </div>
</template>
<script>
  import { LockCard } from '@/components';
  import { mapGetters } from 'vuex';
  import { AUTH_REQUEST, NOTIFY } from '@/store/modules/constants';
  import { SlideYDownTransition } from 'vue2-transitions';

  export default {
    components: {
      LockCard,
      SlideYDownTransition,
    },
    data() {
      return {
        password: null,
        image: './img/faces/avatar.jpg',
        touched: {
          password: false,
        },
        modelValidations: {
          password: {
            required: true,
            min: 5,
          },
        },
      };
    },
    computed: {
      ...mapGetters({
        getProfile: 'getProfile',
      }),
    },
    methods: {
      validate() {
        this.$validator.validateAll().then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.password = true;
      },
      login() {
        if (this.errors.has('password') || !this.password) {
          this.$store.dispatch(NOTIFY, { settings: { message: 'Введите валидный пароль' } });
          this.showErrorsValidate('password');
          return;
        }
        const { getProfile, password } = this;
        this.$store.dispatch(AUTH_REQUEST, { username: getProfile.userName, password }).then(
          (response) => {
            console.log(response);
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
        const field = this.$validator.fields.find({ name: errField, scope: this.$options.scope });
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
  };
</script>
<style lang="scss" >
.lock-wrapper{
.md-field {
  margin-top: 24px;
      .md-error {
      position: absolute;
      text-align:left;
      display: block!important;
      left: 36px!important;
      opacity: 1;
      // transform: translate3d(0,-12px,0);
      color: #ff1744;
      font-size: .6875rem;
      bottom: -1.3rem;
      line-height: normal;
    }
  }
}
</style>
