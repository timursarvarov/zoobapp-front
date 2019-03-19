<template>
  <md-card class="md-card-profile">
      <t-avatar-input
    :color="userColor"
    :maxFilesize="2000"
    :imageSrc="user.avatar"
    :title="user.firstName+ ' ' + user.lastName"
    :formTitle="'Add your photo'"
    :buttonColor="'green'"
    @on-created="updateUserAvatar"
    />

    <md-card-content>
      <div class="md-layout">

        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field :class="[
              {'md-valid': !errors.has('firstName') && touched.firstName},
              {'md-error': errors.has('firstName')}]">
            <label>First Name</label>
            <md-input
              v-model="user.firstName"
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

        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field :class="[
              {'md-valid': !errors.has('lastName') && touched.lastName},
              {'md-error': errors.has('lastName')}]">
            <label>Last Name</label>
            <md-input
              v-model="user.lastName"
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

        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field>
            <label>User Name</label>
            <md-input
              v-model="user.userName"
              disabled
              type="text"
            ></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field :class="[
              {'md-valid': !errors.has('phone') && touched.phone},
              {'md-error': errors.has('phone')}]">
            <label>Phone</label>
            <span class="md-prefix">+</span>
            <md-input
              v-model="user.phone"
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

        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field :class="[
            {'md-valid': !errors.has('email') && touched.email},
            {'md-error': errors.has('email')}]">
            <label>Email Address</label>
            <md-input
              v-model="user.email"
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

        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field>
            <label>Address</label>
            <md-input
              v-model="user.address"
              type="text"
            ></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field>
            <label for="movies">Language</label>
            <md-select
              v-model="user.lang"
              name="language"
              id="language"
            >
              <md-option :value="1">English</md-option>
              <md-option :value="2">Русский</md-option>
            </md-select>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field maxlength="5">
            <label>About Me</label>
            <md-textarea v-model="aboutme"></md-textarea>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100 text-right">
          <md-button
            @click="updateProfile"
            class="md-raised md-success mt-4"
          >Update Profile</md-button>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>
<script>
  import {
    USER_AVATAR_UPLOAD,
    USER_UPDATE,
    NOTIFY,
  } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';
  import { SlideYDownTransition } from 'vue2-transitions';
  import { TAvatarInput } from '@/components';

  const randomMC = require('random-material-color');

  export default {
    components: {
      SlideYDownTransition,
      TAvatarInput,
    },
    name: 'user-card',
    props: {
      cardUserImage: {
        type: String,
        default: './img/faces/marc.jpg',
      },
      buttonColor: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        city: null,
        country: null,
        code: null,
        aboutme: null,
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
      validate() {
        this.$validator.validateAll().then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.lastName = true;
        this.touched.firstName = true;
        this.touched.email = true;
        this.touched.phone = true;
      },
      updateProfile() {
        this.$validator
          .validate('firstName', 'lastName', 'email', 'phone')
          .then((result) => {
            // TODO подключить после настройки api
            // this.user['color'] = this.userColor
            if (result) {
              this.$store
                .dispatch(USER_UPDATE, {
                  user: this.user,
                })
                .then((response) => {
                  if (response) {
                    this.$store.dispatch(NOTIFY, {
                      settings: {
                        message: 'Updated',
                        type: 'primary',
                      },
                    });
                  }
              });
            }
        });
      },
      updateUserAvatar(fd) {
        this.$store
          .dispatch(USER_AVATAR_UPLOAD, {
            fd,
          })
          .then(
            (response) => {
              console.log(response);
              if (response) {
                this.$store.dispatch(NOTIFY, {
                  settings: {
                    message: 'Profile image updated',
                    type: 'primary',
                  },
                });
              }
            },
        );
      },
    },
    computed: {
      ...mapGetters({
        user: 'getProfile',
      }),
      email() {
        return this.user.email;
      },
      firstName() {
        return this.user.firstName;
      },
      lastName() {
        return this.user.lastName;
      },
      phone() {
        return this.user.phone;
      },
      userColor() {
        const color = randomMC.getColor({ text: this.firstName + this.lastName + this.phone + this.email });
        return color;
      },
    },
    watch: {
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
<style lang="scss" scoped>
</style>
