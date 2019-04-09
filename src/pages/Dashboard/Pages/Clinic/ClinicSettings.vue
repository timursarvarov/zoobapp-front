<template>
  <md-card class="md-card-profile currentClinic-wrapper">
    <t-avatar-input
    :color="currentClinic.color"
    :maxFilesize="2000"
    :imageSrc="currentClinic.logo"
    :title="currentClinic.name"
    :formTitle="'Add clinic logo'"
    :buttonColor="'green'"
    @on-created="updateClinicLogo"
    />
    <md-card-content>
      <div class="md-layout">

        <div class="md-layout md-layout-item md-small-size-100 md-size-33">
          <md-field>
            <label>Clinic Name</label>
            <md-input
              v-model="currentClinic.name"
              type="text"
            ></md-input>
            <span class="md-helper-text">
              Enter a cool currentClinic name
            </span>
          </md-field>
        </div>

        <div class="md-layout md-layout-item md-small-size-100 md-size-33">
          <md-field :class="[
                        {'md-valid': !errors.has('phone') && touched.phone},
                        {'md-error': errors.has('phone')}]">
            <label>Phone</label>
            <span class="md-prefix">+</span>
            <md-input
              v-model="currentClinic.phone"
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

        <div class="md-layout md-layout-item md-small-size-100 md-size-33">

          <md-field>
            <label>Address</label>
            <md-input
              v-model="currentClinic.address"
              type="text"
            ></md-input>
          </md-field>
        </div>

        <div class="md-layout md-layout-item md-small-size-100 md-size-33">

          <md-field :class="[
                        {'md-valid': !errors.has('url') && touched.url},
                        {'md-error': errors.has('url')}]">
            <label>Clinic web site address</label>
            <md-input
              v-model="currentClinic.url"
              type="text"
              data-vv-name="url"
              required
              v-validate="modelValidations.url"
            ></md-input>
            <span class="md-error">{{errors.first('url')}}</span>
            <slide-y-down-transition>
              <md-icon
                class="error"
                v-show="errors.has('url')"
              >close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('url') && touched.url"
              >done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>

        <div class="md-layout md-layout-item md-small-size-100 md-size-33">

          <md-field :class="[
                        {'md-valid': !errors.has('email') && touched.email},
                        {'md-error': errors.has('email')}]">
            <label>Email</label>
            <md-input
              v-model="currentClinic.email"
              type="text"
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

        <div class="md-layout md-layout-item md-small-size-100 md-size-33">

          <md-field>
            <label>Tax</label>
            <md-input
              v-model="currentClinic.tax"
              type="number"
            ></md-input>
            <span class="md-helper-text">
              Enter % that will be added to the total treatment price
            </span>
          </md-field>
        </div>
        <div class="md-layout md-layout-item md-small-size-100 md-size-33">

          <md-field>
            <label for="teethSystem">Disabled Select</label>
            <md-select
              v-model="currentClinic.teethSystem"
              name="teethSystem"
              id="teethSystem"
            >
              <md-option :value="1">FDI World Dental Federation notation</md-option>
              <md-option :value="2">Universal numbering system</md-option>
              <md-option :value="3">Palmer notation method</md-option>
            </md-select>
          </md-field>
        </div>
        <div class="md-layout md-layout-item ">
          <md-autocomplete
            v-model="selectedCurrency"
            :md-open-on-focus="false"
            :md-options="currencyForOptions"
            @md-selected="currencySelected"
          >
            <label>Choose your Currency</label>
          </md-autocomplete>
        </div>
        <div class="md-layout md-layout-item   md-size-100">
          <md-autocomplete
            v-model="selectedTimezone"
            :md-open-on-focus="false"
            :md-options="timeZoneForOptions"
            @md-selected="timezoneSelected"
          >
            <label>Choose your timezone to specify sms sending time</label>
          </md-autocomplete>
        </div>

        <div class="md-layout md-layout-item md-size-100">

          <md-field maxlength="5">
            <label>Description</label>
            <md-textarea v-model="currentClinic.description"></md-textarea>
          </md-field>
        </div>

      </div>
    </md-card-content>
    <md-card-actions>
      <md-button
        native-type="submit"
        @click="updateClinicSettings"
        class="md-raised md-success  ml-auto"
      >Update Settings</md-button>
    </md-card-actions>
  </md-card>
</template>
    <script>
  import {
    CLINIC_LOGO_UPLOAD,
    CLINIC_UPDATE,
    NOTIFY,
  } from '@/constants';
  import { mapGetters } from 'vuex';
  import { TAvatarInput } from '@/components';
  import { SlideYDownTransition } from 'vue2-transitions';
  import commonCurrency from './Common-Currency.json';
  import timezones from './timezones.json';

  export default {
    components: {
      SlideYDownTransition,
      TAvatarInput,
    },
    name: 'currentClinic-settings',
    props: {
      buttonColor: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        selectedTimezone: null,
        selectedCurrency: null,
        timeZoneForOptions: [],
        currencyForOptions: [],
        image: '',
        currency: {},
        timezones: [],
        touched: {
          url: false,
          email: false,
          phone: false,
        },
        modelValidations: {
          url: {
            url: true,
          },
          email: {
            email: true,
          },
          phone: {
            required: true,
            min: 12,
            max: 20,
          },
        },
      };
    },
    methods: {
      copyObj(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      timezoneSelected(timezoneL) {
        if (timezoneL) {
          this.timezones.forEach((element) => {
            if (`${element.UTC} ${element.cities}` === timezoneL) {
              this.currentClinic.timezoneOffset = element.offset;
            }
          });
        }
      },
      currencySelected(currency) {
        if (currency) {
          Object.values(this.currency).forEach((element) => {
            if (
              `${element.symbol} ${element.name} ${element.code}` === currency
            ) {
              this.currentClinic.currencyCode = element.code;
            }
          });
        }
      },
      validate() {
        this.$validator.validate('url', 'email', 'phone').then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.url = true;
        this.touched.email = true;
        this.touched.phone = true;
      },
      updateClinicLogo(fd) {
        this.$store
          .dispatch(CLINIC_LOGO_UPLOAD, {
            fd,
          })
          .then((response) => {
            console.log(response);
            this.$store.dispatch(NOTIFY, {
              settings: {
                message: 'Image uploaded',
                type: 'success',
              },
            });
        });
      },
      updateClinicSettings() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store
              .dispatch(CLINIC_UPDATE, {
                clinic: this.currentClinic,
              })
              .then((response) => {
                if (response) {
                  this.$store.dispatch(NOTIFY, {
                    settings: {
                      message: 'Settings updated',
                      type: 'primary',
                    },
                  });
                }
            });
          }
        });
      },
      createArrayTimezones() {
        const Ntimezones = {};
        this.timezones.forEach((element) => {
          this.timeZoneForOptions.unshift(`${element.UTC} ${element.cities}`);
        });

        return Ntimezones;
      },
      createArrayCurrency() {
        const Ncurrency = {};
        Object.values(this.currency).forEach((element) => {
          this.currencyForOptions.unshift(
            `${element.symbol} ${element.name} ${element.code}`,
          );
        });

        return Ncurrency;
      },
      setLocalTimezone() {
        this.timezones.forEach((element) => {
          if (element.offset === this.currentClinic.timezoneOffset) {
            this.selectedTimezone = `${element.UTC} ${element.cities}`;
          }
        });
      },
      setLocalCurrency() {
        Object.values(this.currency).forEach((element) => {
          if (element.code === this.currentClinic.currencyCode) {
            this.selectedCurrency = `${element.symbol} ${element.name} ${
              element.code
            }`;
          }
        });
      },
    },
    computed: {
      ...mapGetters({
        currentClinic: 'getCurrentClinic',
      }),
      email() {
        return this.currentClinic.email;
      },
      url() {
        return this.currentClinic.url;
      },
      phone() {
        return this.currentClinic.phone;
      },
    },
    created() {
      this.currency = this.copyObj(commonCurrency);
      this.timezones = this.copyObj(timezones);
      this.createArrayTimezones();
      this.createArrayCurrency();
      this.setLocalTimezone();
      this.setLocalCurrency();
    },
    watch: {
      url() {
        this.touched.url = true;
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
<style lang="scss" scoped>
.md-dialog.cropper-form {
  background-color: transparent !important;
  box-shadow: none !important;
  .clipper-setter {
    overflow: hidden;
    max-width: 70vh;
    max-height: 70vh;
  }
  .clipper-preview {
    overflow: hidden;
    width: 132px;
    height: 132px;
    margin: auto;
  }
  .clipper-preview-round {
    overflow: hidden;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin: 20px;
  }
}
.currentClinic-wrapper {
  .md-field {
    // margin-top: 24px;
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
}
</style>
