<template>
    <md-card class="md-card-header-icon md-card-header-green clinic-wrapper" >
        <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
            <md-icon>store</md-icon>
            </div>
            <h4 class="title">Clinic settings</h4>
        </md-card-header>`
        <md-card-content>

        <div class="md-layout">
            <div class="md-layout md-layout-item md-size-100">
                <label class="md-layout-item md-size-15 md-form-label">
                Eneter clinic name
                </label>
                <div class="md-layout-item  md-size-85">
                    <md-field >
                        <label>Clinic Name</label>
                        <md-input
                        v-model="clinic.name"
                        type="text"
                        ></md-input>
                        <span class="md-helper-text">
                        A block of help text that breaks onto a new line.
                        </span>
                    </md-field>
                </div>
            </div>
            <div class="md-layout md-layout-item md-size-100">
                <label class="md-layout-item md-size-15 md-form-label">
                Eneter clinic phone
                </label>
                    <div class="md-layout-item  md-size-85">
                    <md-field :class="[
                        {'md-valid': !errors.has('phone') && touched.phone},
                        {'md-error': errors.has('phone')}]" >
                        <label>Phone</label>
                        <span class="md-prefix">+</span>
                        <md-input
                        v-model="clinic.phone"
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
            </div>
            <div class="md-layout md-layout-item md-size-100">
                <label class="md-layout-item md-size-15 md-form-label">
                Eneter clinic address
                </label>
                <div class="md-layout-item  md-size-85">
                    <md-field>
                        <label>Address</label>
                        <md-input
                        v-model="clinic.address"
                        type="text"
                        ></md-input>
                    </md-field>
                </div>
            </div>
            <div class="md-layout md-layout-item md-size-100">
                    <label class="md-layout-item md-size-15 md-form-label">
                    Eneter clinic URL
                    </label>
                        <div class="md-layout-item  md-size-85">
                    <md-field :class="[
                        {'md-valid': !errors.has('URL') && touched.URL},
                        {'md-error': errors.has('URL')}]" >
                        <label>URL</label>
                        <md-input
                        v-model="clinic.URL"
                        type="text"
                        data-vv-name="URL"
                        required
                        v-validate="modelValidations.URL"></md-input>
                        <span class="md-error">{{errors.first('URL')}}</span>
                        <slide-y-down-transition>
                            <md-icon
                            class="error"
                            v-show="errors.has('URL')"
                            >close</md-icon>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-icon
                            class="success"
                            v-show="!errors.has('URL') && touched.URL"
                            >done</md-icon>
                        </slide-y-down-transition>
                    </md-field>
                </div>
            </div>
            <div class="md-layout md-layout-item md-size-100">
                <label class="md-layout-item md-size-15 md-form-label">
                Eneter clinic email
                </label>
                <div class="md-layout-item  md-size-85">
                    <md-field :class="[
                        {'md-valid': !errors.has('email') && touched.email},
                        {'md-error': errors.has('email')}]" >
                        <label>Email</label>
                        <md-input
                        v-model="clinic.email"
                        type="text"
                        data-vv-name="email"
                        required
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
            </div>
            <div class="md-layout md-layout-item md-size-100">
                <label class="md-layout-item md-size-15 md-form-label">
                Eneter TAX
                </label>
                <div class="md-layout-item  md-size-85">
                    <md-field >
                        <label>Tax</label>
                        <md-input
                        v-model="clinic.tax"
                        type="number"
                        ></md-input>
                        <span class="md-helper-text">
                        Enter % that will be added to the total treatment price
                        </span>
                    </md-field>
                </div>
            </div>
            <div class="md-layout md-layout-item md-size-100">
                <label class="md-layout-item md-size-15 md-form-label">
                Eneter Currency
                </label>
                <div class="md-layout-item  md-size-85">
                    <md-field >
                        <label>Currency</label>
                        <md-input
                        v-model="clinic.currency"
                        type="text"></md-input>
                        <span class="md-helper-text">
                        Enter % that will be added to the total treatment price
                        </span>
                    </md-field>
                </div>
            </div>
            <div class="md-layout md-layout-item md-size-100">
                <label class="md-layout-item md-size-15 md-form-label">
                Eneter clinic Timezone
                </label>
                <div class="md-layout-item  md-size-85">
                    <md-field >
                        <label>Timezone</label>
                        <md-input
                        v-model="clinic.timezone"
                        type="text"></md-input>
                        <span class="md-helper-text">
                        Please enter your timezone,
                        this timezone will be used
                        to send sms in your timezone.
                        </span>
                    </md-field>
                </div>
            </div>
        </div>
        </md-card-content>
        <md-card-actions>
            <md-button
            native-type="submit"
            @click.native.prevent="validate"
            class="md-success"
            >Update</md-button>
        </md-card-actions>
    </md-card>
    </template>
    <script>
  import { USER_AVATAR_UPLOAD, USER_UPDATE, NOTIFY } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';
  import { SlideYDownTransition } from 'vue2-transitions';

  export default {
    components: {
      SlideYDownTransition,
    },
    name: 'clinic-settings',
    props: {
      cardUserImage: {
        type: String,
        default: './img/faces/marc.jpg',
      },
      buttonColor: {
        type: String,
        default: '',
      },
      avatar: {
        type: String,
        default: './img/default-avatar.png',
      },
    },
    data() {
      return {
        image: '',
        selectedAvatar: '',
        clinic: {
          name: null,
          URL: null,
          email: null,
          phone: null,
          address: null,
          tax: null,
          currency: null,
          timezone: null,
        },
        touched: {
          URL: false,
          email: false,
          phone: false,
        },
        modelValidations: {
          URL: {
            url: true,
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
      getColorButton(buttonColor) {
        return `md-${buttonColor}`;
      },
      onFileChange(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files[0]);
        this.updateUserAvatar(files[0]);
      },
      validate() {
        this.$validator.validateAll().then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.URL = true;
        this.touched.email = true;
        this.touched.phone = true;
      },
      createImage(file) {
        const reader = new FileReader();
        const vm = this;
        reader.onload = (e) => {
          vm.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      updateProfile() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store.dispatch(USER_UPDATE, {
              user: {
                URL: this.user.URL,
                email: this.user.email,
                phone: this.user.phone,
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
      updateUserAvatar(file) {
        const fd = new FormData();
        fd.append('file', file, file.name);

        this.$store.dispatch(USER_AVATAR_UPLOAD, {
          fd,
        }).then(
          (response) => {
            console.log(
              response,
            );
          },
          (error) => {
            this.selectedFileUrl = null;
            console.error(
              error,
              'Got nothing from server. Prompt user to check internet connection and try again',
            );
          },
        );
      },
    },
    computed: {
      ...mapGetters({
        user: 'getProfile',
      }),
      email() {
        return this.clinic.email;
      },
      URL() {
        return this.clinic.URL;
      },
      phone() {
        return this.clinic.phone;
      },
    },
    watch: {
      URL() {
        this.touched.URL = true;
      },
      email() {
        this.touched.email = true;
      },
      phone() {
        this.touched.phone = true;
      },
    },
  };
</script>
<style lang="scss">
.clinic-wrapper {
    .md-field {
        // margin-top: 24px;
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
}
</style>
