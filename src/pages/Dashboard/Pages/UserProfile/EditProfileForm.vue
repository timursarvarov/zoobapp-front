<template>
  <form>
    <md-card>
      <md-card-header class="md-card-header-icon" :class="getClass(headerColor)">
        <div class="card-icon">
          <md-icon>perm_identity</md-icon>
        </div>
        <h4 class="title">
          Edit Profile -
          <small>Complete your profile</small>
        </h4>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Company (disabled)</label>
              <md-input v-model="disabled" disabled></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>User Name</label>
              <md-input v-model="username" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Email Address</label>
              <md-input v-model="emailadress" type="email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>First Name</label>
              <md-input v-model="firstname" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Last Name</label>
              <md-input v-model="lastname" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Adress</label>
              <md-input v-model="address" type="text"></md-input>
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
          <div class="md-layout-item md-size-25">
            <h4 class="card-title">Avatar Image</h4>
            <div class="file-input img-circle">
              <template v-if="!imageCircle">
                <div class="image-container">
                  <img
                          :src="avatarImg"
                          title=""
                  >
                </div>
              </template>
              <div
                      class="image-container"
                      v-else
              >
                <img :src="imageCircle" />
              </div>
              <div class="button-container">
                <md-button
                        class="md-danger md-round"
                        @click="removeImage('circle')"
                        v-if="imageCircle"
                ><i class="fa fa-times"></i>Remove</md-button>
                <md-button class="md-success md-round md-fileinput">
                  <template v-if="!imageCircle">Add Photo</template>
                  <template v-else>Change</template>
                  <input ref="file"
                          type="file"
                          name="file"
                          @change="onFileChange"
                  >
                </md-button>
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-75">
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
  </form>
</template>
<script>
  import { USER_AVATAR_UPLOAD } from '@/store/modules/constants';

  export default {
    name: 'edit-profile-form',
    props: {
      headerColor: {
        type: String,
        default: '',
      },
      avatarImg: {
        type: String,
        default: './img/placeholder.jpg',
      },
    },
    data() {
      return {
        username: null,
        disabled: null,
        emailadress: null,
        lastname: null,
        firstname: null,
        address: null,
        city: null,
        country: null,
        code: null,
        imageCircle: '',
        selectedAvatar: '',
        aboutme:
          "Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo.",
      };
    },
    methods: {
      getClass(headerColor) {
        return `${'md-card-header' - +headerColor}`;
      },
      createImage(file, type) {
        const reader = new FileReader();
        const vm = this;

        reader.onload = (e) => {
          if (type === 'file') {
            vm.imageCircle = e.target.result;
          } else {
            vm.imageRegular = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      },
      onFileChange(e) {
        // this.selectedAvatar = e.target.files[0];

        const files = e.target.files || e.dataTransfer.files;
        const [file] = files;

        if (!files.length) return;
        if (e.target.name) {
          this.createImage(file, 'file');
          // this.selectedAvatar = this.$refs.file.files[0];
        } else {
          this.createImage(file);
        }
      },
      removeImage(type) {
        if (type === 'file') {
          this.imageCircle = '';
        } else {
          this.imageRegular = '';
        }
      },
      updateProfile() {
        this.updateUserAvatar();
      },
      updateUserAvatar() {
        const fd = new FormData();
        fd.append('file', this.selectedAvatar, this.selectedAvatar.name);

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
  };
</script>
<style>
</style>
