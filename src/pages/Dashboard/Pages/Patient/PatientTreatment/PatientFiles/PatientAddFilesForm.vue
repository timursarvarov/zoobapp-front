<template>
  <div>
    <t-dropzone
      ref="myDropzone"
      id="dropzone"
      :options="dropzoneOptions"
      v-on:vdropzone-sending="addHeader"
      v-on:vdropzone-file-added="checkForExpiredToken"
      v-on:vdropzone-files-added="checkForExpiredToken"
      v-on:vdropzone-file-added-manually="checkForExpiredToken"
      v-on:vdropzone-success="onSuccess"
      :useCustomSlot="true"
    >
      <md-empty-state
        md-icon="cloud_upload"
        md-label="Add new file"
        md-description="Click here or drope some files"
      ></md-empty-state>
    </t-dropzone>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import {
    AUTH_REFRESH_TOKEN,
    PATIENT_ADD_SUB_PROP,
  // eslint-disable-next-line import/no-unresolved
  } from '@/constants';
  // eslint-disable-next-line import/no-unresolved
  import { TDropzone } from '@/components';

  export default {
    name: 'patient-add-files-form',
    processRefreshToken: false,
    components: {
      TDropzone,
    },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        access_token: 'fetchAccessToken',
        patient: 'getPatient',
        expiresAt: 'expiresAt',
      }),
      dropzoneOptions() {
        const options = {
          url: `https://dental-api.owl.team/v1/patients/${
            this.patient ? this.patient.ID : ''
          }/files/`,
          thumbnailWidth: 150,
          maxFilesize: 5,
          paramName: 'file',
          forcefallback: true,
          duplicateCheck: true,
          autoProcessQueue: false,
          headers: {
            'Cache-Control': null,
            'X-Requested-With': null,
          },
        };
        return options;
      },
    },
    methods: {
      onSuccess(file, response) {
        this.$store.dispatch(PATIENT_ADD_SUB_PROP, {
          params: {
            propName: 'files',
            value: response[0],
          },
        });
      },
      addHeader(file, xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.access_token}`);
      },
      checkForExpiredToken() {
        const currentTime = Math.floor(Date.now() / 1000);
        if (this.expiresAt < currentTime) {
          if (!this.processRefreshToken) {
            this.processRefreshToken = true;
            // eslint-disable-next-line no-new
            new Promise((resolve, reject) => {
              this.$store.dispatch(AUTH_REFRESH_TOKEN).then(
                (response) => {
                  this.$refs.myDropzone.processQueue();
                  this.processRefreshToken = false;
                  resolve(response);
                },
                (error) => {
                  this.processRefreshToken = false;
                  reject(error);
                },
              );
            });
          }
        } else {
          this.$refs.myDropzone.processQueue();
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
