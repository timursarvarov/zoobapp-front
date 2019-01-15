<template>
  <md-card class="md-card-profile clinic-wrapper">
    <div class="md-card-avatar">
      <div class="picture-container">
        <div class="picture">
          <div
            v-if="!clinic.logo"
            class="md-layout md-alignment-center-center wrapper-acronim"
          >
            <div class="md-layout-item acronim">
              <icon-base
                class="icon-wrapper--item"
                width="90"
                height="90"
                icon-name="icon-tooth-wings"
              />
            </div>
          </div>
          <div
            v-else
            class="logo"
            :style="{'background-image':  'url(' + clinic.logo + ')'}"
          >
          </div>
          <input
            type="file"
            @change="onFileChange"
          >
        </div>
      </div>
    </div>
    <md-card-content>
      <div class="md-layout">

        <div class="md-layout md-layout-item md-small-size-100 md-size-33">
          <md-field>
            <label>Clinic Name</label>
            <md-input
              v-model="clinic.name"
              type="text"
            ></md-input>
            <span class="md-helper-text">
              Enter a cool clinic name
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
              v-model="clinic.phone"
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
              v-model="clinic.address"
              type="text"
            ></md-input>
          </md-field>
        </div>

        <div class="md-layout md-layout-item md-small-size-100 md-size-33">

          <md-field :class="[
                        {'md-valid': !errors.has('url') && touched.url},
                        {'md-error': errors.has('url')}]">
            <label>url</label>
            <md-input
              v-model="clinic.url"
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
              v-model="clinic.email"
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
              v-model="clinic.tax"
              type="number"
            ></md-input>
            <span class="md-helper-text">
              Enter % that will be added to the total treatment price
            </span>
          </md-field>
        </div>

        <div class="md-layout md-layout-item md-small-size-100 md-size-50">

          <!-- <md-field>
            <label>Currency</label>
            <md-input
              v-model="clinic.currency"
              type="text"
            ></md-input>
            <span class="md-helper-text">
              Enter % that will be added to the total treatment price
            </span>
          </md-field> -->
          <!-- <md-autocomplete
            v-model="searchTimezoneParams"
            :md-options="timeZones"
            @md-changed="getCountries"
            @md-opened="getCountries"
          >
            <label>Timezone</label>

            <template
              slot="md-autocomplete-item"
              slot-scope="{ item }"
            >
              <div @click="setTimezone(item)">{{ item.text }}<br>
                <small>{{ item.utc.join(', ') }}</small>
              </div>

            </template>
          </md-autocomplete> -->
          {{selectedTimezone}}
        </div>

        <div class="md-layout md-layout-item md-small-size-100 md-size-50">

          <md-field>
            <label for="movie">Disabled Select</label>
            <md-select v-model="searchTimezoneParams">
              <md-option
                v-for="(timezone, key) in timeZones"
                :key="key"
                :value="timezone.text"
              >
                {{ timezone.text }}
                <!-- <small>{{ timezone.utc.join(', ') }}</small> -->

              </md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout md-layout-item md-small-size-100 md-size-50">

          <md-field>
            <label>Timezone</label>
            <md-input
              v-model="clinic.timezone"
              type="text"
            ></md-input>
            <span class="md-helper-text">
              Please enter your timezone,
              this timezone will be used
              to send sms in your timezone.
            </span>
          </md-field>
        </div>
        <div class="md-layout md-layout-item md-size-100">

          <md-field maxlength="5">
            <label>Description</label>
            <md-textarea v-model="clinic.description"></md-textarea>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100 text-right">
          <md-button
            native-type="submit"
            @click="updateClinicSettings"
            class="md-raised md-success mt-4"
          >Update Settings</md-button>
        </div>
      </div>
    </md-card-content>
    <!-- <md-card-actions class="text-right">
      <md-button
        native-type="submit"
        @click.native.prevent="validate"
        class="md-success"
      >Update</md-button>
    </md-card-actions> -->
  </md-card>
</template>
    <script>
  import {
    CLINIC_LOGO_UPLOAD,
    CLINIC_UPDATE,
    NOTIFY,
    USER_UPDATE,
  } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';
  import { IconBase } from '@/components';
  import { SlideYDownTransition } from 'vue2-transitions';
  import commonCurrency from './Common-Currency.json';
  import timezones from './timezones.json';

  export default {
    components: {
      SlideYDownTransition,
      IconBase,
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
        searchTimezoneParams: {},
        searcchedTimezones: [],
        selectedTimezone: '',
        image: '',
        selectedAvatar: '',
        currency: commonCurrency,
        timeZones: timezones,
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
          },
        },
      };
    },
    methods: {
      setTimezone(timezone) {
        console.log(timezone.text);
        this.searchTimezoneParams = timezone.text;
      },
      getCountries(searchTerm) {
        if (typeof searchTerm === 'object') {
          console.log(typeof searchTerm);
          this.searchTimezoneParams = searchTerm.text;
        // this.selectedTimezone = searchTerm.offset;
        } else if (typeof searchTerm === 'string') {
          this.searcchedTimezones = new Promise((resolve) => {
            window.setTimeout(() => {
              if (!searchTerm) {
                resolve(this.timeZones);
              } else if (searchTerm) {
                const term = searchTerm.toLowerCase();

                resolve(
                  this.timeZones.filter(({ value }) => value.toLowerCase().includes(term),),
                );
              }
            }, 500);
          });
        }
      },
      getColorButton(buttonColor) {
        return `md-${buttonColor}`;
      },
      onFileChange(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files[0]);
        this.updateClinicLogo(files[0]);
      },
      validate() {
        this.$validator.validateAll().then((isValid) => {
          this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.url = true;
        this.touched.email = true;
        this.touched.phone = true;
      },
      createImage(file) {
        const reader = new FileReader();
        const vm = this;
        reader.onload = (e) => {
          vm.image = e.target.result;
        };
        reader.readAsDataurl(file);
      },
      updateProfile() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store
              .dispatch(USER_UPDATE, {
                clinic: {
                  url: this.clinic.url,
                  email: this.clinic.email,
                  phone: this.clinic.phone,
                },
              })
              .then((response) => {
                if (response) {
                  this.$store.dispatch(NOTIFY, {
                    settings: {
                      message: 'Settings updated successfully',
                      type: 'primary',
                    },
                  });
                }
            });
          }
        });
      },
      updateClinicLogo(file) {
        const fd = new FormData();
        fd.append('file', file, file.name);

        this.$store
          .dispatch(CLINIC_LOGO_UPLOAD, {
            fd,
          })
          .then(
            (response) => {
              console.log(response);
            },
            (error) => {
              this.selectedFileUrl = null;
              console.error(
                error,
                'Got nothing from server. Prompt clinic to check internet connection and try again',
              );
            },
        );
      },
      updateClinicSettings() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store
              .dispatch(CLINIC_UPDATE, {
                clinic: {
                  name: this.clinic.name,
                  description: this.clinic.description,
                },
              })
              .then((response) => {
                if (response) {
                  this.$store.dispatch(NOTIFY, {
                    settings: {
                      message: 'Settings updated successfully',
                      type: 'primary',
                    },
                  });
                }
            });
          }
        });
      },
    },
    computed: {
      ...mapGetters({
        clinic: 'getClinicSettings',
      }),
      email() {
        return this.clinic.email;
      },
      url() {
        return this.clinic.url;
      },
      phone() {
        return this.clinic.phone;
      },
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
<style lang="scss">
.clinic-wrapper {
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
  .picture-container {
    position: relative;
    cursor: pointer;
    text-align: center;
    .wrapper-acronim {
      height: -webkit-fill-available;
      .acronim {
        font-size: 4.875rem;
      }
    }
    .picture {
      width: 130px;
      height: 130px;
      background-color: #999999;
      border: 4px solid #cccccc;
      color: #ffffff;
      border-radius: 50%;
      overflow: hidden;
      transition: all 0.2s;
      -webkit-transition: all 0.2s;
      .logo {
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        margin: 0 auto;
        min-height: 130px;
        min-width: 130px;
      }
      &:hover {
        border-color: #4caf50;
      }
      input[type="file"] {
        cursor: pointer;
        display: block;
        height: 100%;
        left: 0;
        opacity: 0 !important;
        position: absolute;
        top: 0;
        width: 100%;
      }
    }
  }
}
</style>
