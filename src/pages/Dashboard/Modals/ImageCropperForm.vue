/* eslint-disable import/no-unresolved */
<template>
    <md-dialog class="cropper-form" :md-active.sync="showFormLocal">
        <div>
            <md-card>
                <md-card-header class="md-card-header-icon md-card-header-green">
                    <div class="card-icon">
                        <md-icon>{{ icon }}</md-icon>
                    </div>
                    <h4 class="title">
                        {{ title }}
                    </h4>
                </md-card-header>

                <md-card-content>
                    <div
                        class="md-layout-item md-size-100"
                        @mouseup="mouseActions = !mouseActions"
                        @mousewheel="mouseActions = !mouseActions"
                        @mouseleave="mouseActions = !mouseActions"
                    >
                        <clipper-fixed
                            ref="clipper"
                            class="clipper-setter"
                            :src="imageToCorp"
                            bg-color="white"
                            :ratio="1"
                            :round="false"
                            preview="preview"
                            :rotate="parseInt(rotate, 10)"
                            @error="onError"
                        >
                            <div slot="placeholder">
                                No image
                            </div>
                        </clipper-fixed>
                    </div>

                    <div>
                        <div
                            v-if="message !== 'Calculating...'"
                            :class="[{ error: !correctSize(), success: correctSize() }]"
                            class="md-size-100 md-layout-item"
                        >
                            {{ message }}:
                            <animated-number :value="size.num" :to-fix="2" :duration="300" />
                            {{ size.type }}
                            <br />
                        </div>

                        <div v-if="message === 'Calculating...'" class="md-layout-item md-size-100">
                            {{ message }}
                            <br />
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions md-alignment="right">
                    <md-button :disabled="!correctSize()" class="md-success" @click="creatClipingImage()">
                        Create
                    </md-button>
                </md-card-actions>
            </md-card>
        </div>
    </md-dialog>
</template>
<script>
import components from '@/components';
import { NOTIFY } from '@/constants';

export default {
    name: 'ImageCropperForm',
    prop: 'fd',
    components: {
        ...components
    },
    props: {
        maxFileSize: {
            type: Number,
            default: 2097152
        },
        buttonColor: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'add_a_photo'
        },
        imageToCorp: {
            type: String,
            default: () => ''
        },
        imageName: {
            type: String,
            default: () => 'imageName'
        },
        fd: {
            type: Object,
            default: () => {}
        },
        title: {
            type: String,
            default: () => 'Cropp an image'
        },
        showForm: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            size: {
                num: 0,
                type: ''
            },
            mouseActions: false,
            size2: 2,
            rotate: 0,
            blobLength: 0,
            resultURL: null,
            message: 'Calculating...',
            isLoadingRegistration: true,
            callbackLauncher: null
        };
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
            }
        }
    },
    watch: {
        mouseActions() {
            this.calculateSize();
        },
        rotate() {
            this.calculateSize();
        },
        imageToCorp() {
            this.calculateSize();
        }
    },
    mounted() {
        this.calculateSizeAfterTimeout();
    },
    methods: {
        onError(e) {
            console.log(e);
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
                type: e[f]
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
                        message: `Too large file, must be less then ${size.nuum} ${size.type}`,
                        type: 'warning'
                    }
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
        calculateSize() {
            if (this.$refs.clipper) {
                const DELAY = 700;
                this.message = 'Calculating...';

                const vm = this;
                if (this.callbackLauncher) {
                    clearTimeout(vm.callbackLauncher);
                }

                this.callbackLauncher = setTimeout(() => {
                    Promise.resolve(vm.calculateSizeAfterTimeout());
                    Promise.resolve((vm.message = 'Current size'));
                }, DELAY);
            }
        },
        calculateSizeAfterTimeout() {
            if (this.$refs.clipper) {
                const canvas = this.$refs.clipper.clip();
                const dataURL = canvas.toDataURL('imageToCorp/jpeg', 0.5);
                const blob = this.dataURItoBlob(dataURL);
                this.blobLength = blob.size;
                this.size = this.formatBytes(blob.size, 0);
            }
        },
        correctSize() {
            return this.blobLength < this.maxFileSize;
        }
    }
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
        width: 300px;
        height: 300px;
        min-width: 100px;
        min-height: 100px;
    }
}
</style>
