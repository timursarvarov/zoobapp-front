<template>
    <div class="md-card-avatar">
        <div class="picture-container">
            <div class="picture" :style="{ background: !loaded ? gradient : '' }">
                <div class="picture-hint md-layout">
                    <md-icon class="md-layout-item md-size-2x">add_a_photo</md-icon>
                </div>
                <transition name="fade">
                    <img class="avatar" :src="imageSrc" @load="onLoaded" v-show="loaded && imageSrc" :alt="title | acronim" />
                </transition>
                <transition name="fade">
                    <div
                        v-show="!loaded || !imageSrc"
                        class="md-layout md-alignment-center-center picture-wrapper-acronim"
                        :style="{ background: gradient }"
                    >
                        <div :class="[{ 'tripple-acr': title.split(' ').length > 2 }]" class="md-layout-item mx-auto acronim">
                            {{ title | acronim }}
                        </div>
                    </div>
                </transition>
                <input type="file" @change="onFileChange" ref="imageInserter" accept="image/*" />
            </div>
        </div>

        <t-image-cropper-form
            v-model="fd"
            :maxFilesize="maxFilesize"
            :buttonColor="buttonColor"
            :title="formTitle"
            :icon="'add_a_photo'"
            :imageName="title + Date.now()"
            :imageToCorp="image"
            :showForm.sync="showForm"
        />
    </div>
</template>
<script>
const randomMC = require('random-material-color');

export default {
    components: {
        't-image-cropper-form': () => import('./TImageCropperForm')
    },
    name: 't-avatar-inptut',
    props: {
        textToColor: {
            type: [String, Number],
            default: null
        },
        imageSrc: {
            type: String,
            default: ''
        },
        noImgTag: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'pic'
        },
        formTitle: {
            type: String,
            default: 'Add a picture'
        },
        buttonColor: {
            type: String,
            default: 'green'
        },
        maxFilesize: {
            type: Number,
            default: 2000
        }
    },
    data() {
        return {
            loaded: false,
            fd: null,
            showForm: false,
            image: '',
            randomMC: null
        };
    },
    methods: {
        onLoaded() {
            this.loaded = true;
        },
        onFileChange(e) {
            const files = e.target.files || e.dataTransfer.files;
            if (files.length > 0) {
                this.createImage(files[0]);
                this.showForm = true;
                this.clearImage();
            } else {
                this.$store.dispatch({
                    settings: {
                        message: 'No files selected!',
                        type: 'warning'
                    }
                });
            }
        },
        colorLuminance(hex, lum) {
            // eslint-disable-next-line no-unused-vars
            let lumL = lum;
            // eslint-disable-next-line no-unused-vars
            let hexL = hex;
            // validate hex string
            hexL = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hexL = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lumL = lum || 0;

            // convert to decimal and change luminosity
            let rgb = '#';
            let c;
            let i;
            for (i = 0; i < 3; i += 1) {
                c = parseInt(hexL.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + c * lumL), 255)).toString(16);
                rgb += `00${c}`.substr(c.length);
            }

            return rgb;
        },
        createImage(file) {
            const reader = new FileReader();
            const vm = this;
            reader.onload = e => {
                vm.image = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        clearImage() {
            const input = this.$refs.imageInserter;
            input.type = 'text';
            input.type = 'file';
        }
    },
    computed: {
        computedColor() {
            const color = this.randomMC.getColor({ text: `${this.textToColor}` });
            return color;
        },
        gradient() {
            let colors = 'linear-gradient(45deg';
            const colorStart = this.colorLuminance(this.computedColor, -0.4);
            const colorEnd = this.colorLuminance(this.computedColor, 0.4);
            colors += `,${colorStart},${colorEnd}`;
            colors += ')';
            return colors;
        }
    },
    watch: {
        fd(file) {
            // emit
            this.$emit('on-created', file);
        }
    },
    created() {
        this.randomMC = randomMC;
    }
};
</script>
<style lang="scss">
.md-card-profile .md-card-avatar {
    max-width: 132px;
    max-height: 132px;
    // background-color: #999999;
}
.picture-container {
    position: relative;
    cursor: pointer;
    text-align: center;
    .picture {
        .fade-enter-active {
            transition: opacity 0.2s ease-in-out;
        }

        .fade-enter-to {
            opacity: 1;
        }

        .fade-enter {
            opacity: 0;
        }
        transition-property: all;
        transition-duration: 0.4s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-delay: 0s;
        width: 132px;
        height: 132px;
        border-radius: 50%;
        overflow: hidden;
        transition: all 0.2s;
        -webkit-transition: all 0.2s;
        .picture-wrapper-acronim {
            .tripple-acr {
                font-size: 3.4rem;
            }
            .fade-enter-active {
                transition: opacity 0.6s ease-out-in;
            }
            .fade-enter-to {
                opacity: 1;
            }

            .fade-enter {
                opacity: 0;
            }
            height: -webkit-fill-available;
            font-size: 3.9rem;
            .acronim {
                text-align: center;
                color: white;
            }
        }
        .picture-hint {
            position: absolute;
            transition-property: all;
            transition-duration: 0.4s;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-delay: 0s;
            position: absolute;
            opacity: 0;
            width: 132px;
            height: 132px;
            background-color: black;
            border-radius: 50%;
            .md-icon {
                color: white;
            }
        }
        .avatar {
            transition: all 0.4s ease;
            background-position: 50%;
            background-repeat: no-repeat;
            background-size: cover;
            background-color: transparent;
            margin: 0 auto;
            min-height: 132px;
            min-width: 132px;
        }
        &:hover {
            .picture-wrapper-acronim,
            .avatar {
                opacity: 0.1;
            }
            .picture-hint {
                opacity: 0.9;
            }
        }
        input[type='file'] {
            cursor: pointer;
            display: block;
            height: 100%;
            left: 0;
            opacity: 0 !important;
            position: absolute;
            bottom: 0;
            width: 100%;
            max-width: 132px;
            margin-top: -132px;
        }
    }
}
</style>
