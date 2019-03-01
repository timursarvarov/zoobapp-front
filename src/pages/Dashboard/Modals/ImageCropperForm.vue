<template>
  <md-dialog
    class="cropper-form"
    :md-active.sync="showFormLocal"
  >
    <div>
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>{{icon}}</md-icon>
          </div>
          <h4 class="title">{{title}}</h4>

        </md-card-header>

        <md-card-content class="md-layout ">
          <div
            class="md-layout-item md-size-100 "
          >
            <clipper-fixed
              class="clipper-setter"
              :src="imageToCorp"
              :round="true"
              @changed="changed"
              @error="onError"
              ref="clipper"
              :grid="false"
              bg-color="black"
              shadow="rgba(20,20,20, .7)"
              :ratio="1"
              :rotate="parseInt(rotate, 10)"
            >
              <div slot="placeholder">No image</div>
            </clipper-fixed>

          </div>

          <div class="md-layout-item md-size-100"><small>* max file size {{ formatBytes(maxFileSize).num}} {{ formatBytes(maxFileSize).type}}</small></div>
          <div class="md-layout-item">
          <div  class="filesize md-layout-item">
          <p
              :class="[{'error': !correctSize(),
              'success':correctSize()}]"
            >
              Cropped image size:
              <animated-number
                :value="size.num"
                :toFix="2"
                :duration="300"
              ></animated-number>
              {{size.type}}
            </p>
            </div>
            <div v-if="rotatable" class="md-layout-item md-layout ">
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
            @click="showFormLocal = false;"
          >Cancel</md-button>
          <md-button
            :disabled="!correctSize()"
            @click="creatClipingImage()"
            class="md-success"
          >Create</md-button>
        </md-card-actions>
      </md-card>
    </div>
  </md-dialog>
</template>
<script>
  import { Slider, AnimatedNumber } from '@/components';
  import { NOTIFY } from '@/store/modules/constants';

  export default {
    name: 'imageCropperForm',
    prop: 'fd',
    props: {
      maxFileSize: {
        type: Number,
        default: 2097152,
      },
      buttonColor: {
        type: String,
        default: '',
      },
      icon: {
        type: String,
        default: 'add_a_photo',
      },
      imageToCorp: {
        type: String,
        default: () => '',
      },
      imageName: {
        type: String,
        default: () => 'imageName',
      },
      fd: {
        type: Object,
        default: () => {},
      },
      title: {
        type: String,
        default: () => 'Cropp an image',
      },
      showForm: {
        type: Boolean,
        default: () => false,
      },
      rotatable: {
        type: Boolean,
        default: () => false,
      },
    },
    components: {
      Slider,
      AnimatedNumber,
    },
    data() {
      return {
        size: {
          num: 0,
          type: '',
          bytes: null,
        },
        mouseActions: false,
        size2: 2,
        rotate: 0,
        blobLength: 0,
        resultURL: null,
        message: 'Calculating...',
        isLoadingRegistration: true,
        callbackLauncher: null,
      };
    },
    methods: {
      changed(e) {
        this.size.num = e.num;
        this.size.type = e.type;
        this.size.bytes = e.bytes;
      },
      onError(e) {
        console.log(e);
        //  this.$store.dispatch(NOTIFY, {
        //     settings: {
        //       message: 'Error on image cropping, please choose another file',
        //       type: 'warning',
        //     },
        //   });
      },
      getColorButton(buttonColor) {
        return `md-${buttonColor}`;
      },
      formatBytes(a, b) {
        if (a === 0) return '0 Bytes';
        const c = 1024;
        const d = b || 2;

        const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const f = Math.floor(Math.log(a) / Math.log(c));
        const size = {
          // eslint-disable-next-line
        num: parseFloat((a / Math.pow(c, f)).toFixed(d)),
          type: e[f],
        };
        // return `${parseFloat((a / Math.pow(c, f)).toFixed(d))} ${e[f]}`;
        return size;
      },
      formatToPrice(value) {
        return `$ ${Number(value).toFixed(2)}`;
      },
      creatClipingImage() {
        const canvas = this.$refs.clipper.clip();
        const dataURL = canvas.toDataURL('imageToCorp/jpeg', 0.9);
        const blob = this.dataURItoBlob(dataURL);
        const fd = new FormData(document.forms[0]);
        if (blob.size < this.maxFileSize) {
          fd.append('file', blob, `${this.imageName}.jpeg`);
          this.$emit('input', fd);
          this.showFormLocal = false;
        } else {
          const size = this.formatBytes(this.maxFileSize, 0);
          this.$store.dispatch(NOTIFY, {
            settings: {
              message: `Too large file, must be less then ${size.nuum} ${
                size.type
              }`,
              type: 'warning',
            },
          });
        }
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
      correctSize() {
        return this.size.bytes < this.maxFileSize;
      },
    },
    computed: {
      showFormLocal: {
        // геттер:
        get() {
          return this.showForm;
        },
        // сеттер:
        set(newValue) {
          this.$emit('update:showForm', newValue);
        },
      },
    },
  };
</script>
<style lang="scss" scoped>
.md-dialog.cropper-form {
  .size-text {
    transition: visibility 0s linear 0.33s, opacity 0.33s linear;
  }
  .error {
    color: red;
  }
  .success {
    color: green;
  }
  background-color: transparent !important;
  box-shadow: none !important;
  .clipper-setter {
    overflow: hidden;
    max-width: 70vh;
    max-height: 70vh;
  }
  .filesize{
    text-align: center;
    min-width: 200px;
  }
}
</style>
