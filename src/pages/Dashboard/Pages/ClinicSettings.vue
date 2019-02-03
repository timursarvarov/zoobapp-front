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
            v-validate="'image|size:2000'"
            name="size_field"
            data-vv-as="file"
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
            <label>Clinic web site address</label>
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
        <div class="md-layout md-layout-item md-small-size-100 md-size-33">

          <md-field>
            <label for="teethSystem">Disabled Select</label>
            <md-select
              v-model="clinic.teethSystem"
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
            <md-textarea v-model="clinic.description"></md-textarea>
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
    <md-dialog
      class="cropper-form"
      :md-active.sync="showForm"
      :md-click-outside-to-close="!isLoadingRegistration"
    >
      <div>
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>add_a_photo</md-icon>
            </div>
            <h4 class="title">Add a clinic logo</h4>
          </md-card-header>

          <md-card-content class="md-layout md-gutter">
            <div class="md-layout-item md-size-66 md-xsmall-size-100">
              <clipper-fixed
                class="clipper-setter"
                :src="image"
                ref="clipper"
                bg-color="white"
                :ratio="1"
                :round="false"
                preview="preview"
                :rotate="parseInt(rotate, 10)"
              >
                <div slot="placeholder">No image</div>
              </clipper-fixed>

            </div>

            <div class="md-layout-item md-layout md-gutter md-size-33 md-xsmall-size-100">
              <div class="md-layout-item">
                <clipper-preview
                  name="preview"
                  class="clipper-preview"
                ></clipper-preview>
              </div>
              <div class="md-layout-item">
                <clipper-preview
                  name="preview"
                  class="clipper-preview-round"
                ></clipper-preview>

              </div>
            </div>
            <div class="md-layout-item md-list md-layout md-gutter  md-size-100">
              <div class="md-layout-item md-layout md-list-item ">
                <div class="">
                  Rotate:
                  {{rotate}}°
                </div>
                <div class="md-layout-item ">
                  <slider
                    :range="{
              min:0,
              max:180,
            }"
                    v-model="rotate"
                  />
                </div>
              </div>
            </div>

          </md-card-content>
          <md-card-actions md-alignment="right">
            <md-button
              @click="creatClipingImage()"
              class="md-success"
            >Create</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </md-dialog>
  </md-card>
</template>
    <script>
  import {
    CLINIC_LOGO_UPLOAD,
    CLINIC_UPDATE,
    NOTIFY,
  } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';
  import { IconBase, Slider } from '@/components';
  import { SlideYDownTransition } from 'vue2-transitions';
  import commonCurrency from './Common-Currency.json';
  import timezones from './timezones.json';

  export default {
    components: {
      SlideYDownTransition,
      IconBase,
      Slider,
    },
    name: 'clinic-settings',
    props: {
      buttonColor: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        rotate: 0,
        showForm: false,
        resultURL: null,
        isLoadingRegistration: true,
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
          size_field: false,
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
              this.clinic.timezoneOffset = element.offset;
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
              this.clinic.currencyCode = element.code;
            }
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
      },

      creatClipingImage() {
        const canvas = this.$refs.clipper.clip();
        const dataURL = canvas.toDataURL('image/jpeg', 0.5);
        const blob = this.dataURItoBlob(dataURL);
        const fd = new FormData(document.forms[0]);
        fd.append('file', blob, `${this.clinic.ID}.jpeg`);
        this.updateClinicLogo(fd);
      },
      validate() {
        this.$validator
          .validate('url', 'email', 'phone', 'size_field')
          .then((isValid) => {
            this.$emit('on-submit', this.registerForm, isValid);
          });
        this.touched.url = true;
        this.touched.email = true;
        this.touched.phone = true;
      },
      dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
          byteString = atob(dataURI.split(',')[1]);
        } else byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        const mimeString = dataURI
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];

        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i += 1) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
      },
      createImage(file) {
        const reader = new FileReader();
        const vm = this;
        this.showForm = true;
        reader.onload = (e) => {
          vm.image = e.target.result;
        };
        if (reader.readAsDataURL) {
          reader.readAsDataURL(file);
        } else if (reader.readAsDataurl) {
          reader.readAsDataurl(file);
        }
      },
      updateClinicLogo(fd) {
        // const fd = new FormData();
        // fd.append('file', file, file.name);

        this.$store
          .dispatch(CLINIC_LOGO_UPLOAD, {
            fd,
          })
          .then(
            (response) => {
              console.log(response);
              this.$store.dispatch(NOTIFY, {
                settings: {
                  message: 'Image uploaded',
                  type: 'success',
                },
              });
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
                clinic: this.clinic,
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
          if (element.offset === this.clinic.timezoneOffset) {
            this.selectedTimezone = `${element.UTC} ${element.cities}`;
          }
        });
      },
      setLocalCurrency() {
        Object.values(this.currency).forEach((element) => {
          if (element.code === this.clinic.currencyCode) {
            this.selectedCurrency = `${element.symbol} ${element.name} ${
              element.code
            }`;
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
    created() {
      // const canvas = this.$refs.clipper.clip();

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
<style lang="scss">
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
    width: 130px;
    height: 130px;
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
    .md-error.picture {
      border-color: #f44336 !important;
      border: 3px solid;
    }
    .md-valid.picture {
      border-color: #4caf50 !important;
      border: 3px solid;
    }
    .picture {
      transition-property: all;
      transition-duration: 0.4s;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-delay: 0s;
      width: 130px;
      height: 130px;
      background-color: #999999;
      border: 3px solid #cccccc;
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
