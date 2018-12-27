<template>
  <md-card class="md-card-profile">
    <div class="md-card-avatar">
      <div class="picture-container" >
        <div class="picture"  >
            <div v-if="!user.avatar" class="md-layout md-alignment-center-center wrapper-acronim" >
              <div class="md-layout-item acronim" >
                  <span>{{user.firstName[0]}}{{user.lastName[0]}}</span>
                </div>
            </div>
            <div v-else>
              <img :src="user.avatar" />
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

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field :class="[
              {'md-valid': !errors.has('firstName') && touched.firstName},
              {'md-error': errors.has('firstName')}]" >
              <label>First Name</label>
              <md-input
              v-model="user.firstName"
              type="text"
              data-vv-name="firstName"
              required
              v-validate="modelValidations.firstName"></md-input>
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
              {'md-error': errors.has('lastName')}]" >
              <label>Last Name</label>
              <md-input
              v-model="user.lastName"
              type="text"
              data-vv-name="lastName"
              required
              v-validate="modelValidations.lastName"></md-input>
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
              <md-input v-model="user.userName" disabled type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Company (disabled)</label>
              <md-input v-model="disabled" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field :class="[
              {'md-valid': !errors.has('phone') && touched.phone},
              {'md-error': errors.has('phone')}]" >
              <label>Phone</label>
              <span class="md-prefix">+</span>
              <md-input
              v-model="user.phone"
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

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field
             :class="[
            {'md-valid': !errors.has('email') && touched.email},
            {'md-error': errors.has('email')}]" >
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
              <label>City</label>
              <md-input v-model="city" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Country</label>
              <md-input v-model="country" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Postal Code</label>
              <md-input v-model="code" type="number"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>About Me</label>
              <md-textarea v-model="aboutme"></md-textarea>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button @click="updateProfile"
            class="md-raised md-success mt-4">Update Profile</md-button>
          </div>
        </div>
    </md-card-content>
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
      avatar: {
        type: String,
        default: './img/default-avatar.png',
      },
    },
    data() {
      return {
        image: '',
        selectedAvatar: '',
        username: null,
        disabled: null,
        address: null,
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
        this.touched.lastName = true;
        this.touched.firstName = true;
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
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.user.phone,
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
<style lang="scss">
.picture-container{
    position: relative;
    cursor: pointer;
    text-align: center;
    .wrapper-acronim {
      height: -webkit-fill-available;
      .acronim {
      font-size: 4.875rem;
      }
    }
    .picture{
        width: 130px;
        height: 130px;
        background-color: #999999;
        border: 4px solid #CCCCCC;
        color: #FFFFFF;
        border-radius: 50%;
        overflow: hidden;
        transition: all 0.2s;
        -webkit-transition: all 0.2s;
        &:hover{
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
</style>
