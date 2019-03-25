<template>
  <div class="md-layout lock-wrapper text-center">
    <div class="md-layout-item md-size-50 md-small-size-100">
      <form>
        <lock-card>
          <div
            class="avatar-container"
            slot="imageProfile"
          >

            <div class="avatarC">
              <div
                v-if="!user.avatar"
                class="md-layout md-alignment-center-center wrapper-acronim"
              >
                <div class="md-layout-item acronim">
                  <span>{{(user.firstName + ' ' + user.lastName) | acronim }}</span>
                </div>
              </div>
              <div
                v-else
                class="avatar"
                :style="{'background-image':  'url(' + user.avatar + ')'}"
              >
              </div>
            </div>
          </div>
          <h4
            slot="title"
            class="title"
          >{{user.firstName | capitilize}} {{user.lastName | capitilize}}</h4>
          <div slot="content">
          <md-field
            :class="[{'md-error': errors.has('password')},
            {'md-valid': !errors.has('password') && touched.password}]"
          >
            <md-icon>lock_outline</md-icon>
            <label>Enter Password</label>
            <md-input
              v-model="password"
              type="password"
              autocomplete="password"
              v-on:keyup.enter="login()"
              data-vv-name="password"
              required
              v-validate="modelValidations.password"
              ref="password"
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
          <div class="md-layout">
                  <small  class="md-simple ml-auto " @click="showForgot = !showForgot">Forgot password?</small>
          </div>
          </div>
          <md-button
            @click="login()"
            class="md-success md-round"
            slot="footer"
          >Unlock</md-button>
        </lock-card>
      </form>
      <forgot-password
      :showForm.sync="showForgot"
      />
    </div>
  </div>
</template>
<script>
  import { LockCard } from '@/components';
  import ForgotPassword from './ForgotPassword.vue';
  import { mapGetters } from 'vuex';
  import { AUTH_REQUEST, NOTIFY } from '@/constants';
  import { SlideYDownTransition } from 'vue2-transitions';

  export default {
    components: {
      LockCard,
      ForgotPassword,
      SlideYDownTransition,
    },
    data() {
      return {
        showForgot: false,
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
        user: 'getProfile',
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
          this.$store.dispatch(NOTIFY, {
            settings: { message: 'Введите валидный пароль' },
          });
          this.showErrorsValidate('password');
          return;
        }
        const { user, password } = this;
        this.$store
          .dispatch(AUTH_REQUEST, { username: user.userName, password })
          .then(
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
      this.$refs.password.$el.focus();
    },
  };
</script>
<style lang="scss" >
.lock-wrapper {
   small.md-simple{
    color: #3c4858;
    cursor: pointer
  }
  .md-field {
    margin-top: 24px;
    .md-error {
      position: absolute;
      text-align: left;
      display: block !important;
      left: 36px !important;
      opacity: 1;
      // transform: translate3d(0,-12px,0);
      color: #ff1744;
      font-size: 0.6875rem;
      bottom: -1.3rem;
      line-height: normal;
    }
  }
  .avatar-container {
    cursor:default!important;
    text-align: center;
    .wrapper-acronim {
      height: -webkit-fill-available;
      .acronim {
        font-size: 2.375rem;
      }
    }
    .avatarC {
      width: 90px;
      height: 90px;
      background-color: #999999;
      color: #ffffff;
      border-radius: 50%;
      overflow: hidden;
      transition: all 0.2s;
      -webkit-transition: all 0.2s;
      .avatar {
        cursor:default!important;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        margin: 0 auto;
        min-height: 90px;
        min-width: 90px;
      }
      &:hover {
        border-color: #4caf50;
      }
    }
  }
}
</style>
