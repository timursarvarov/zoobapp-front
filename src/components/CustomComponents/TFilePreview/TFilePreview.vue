<template>
    <div class="file-preview-wrapper">
        <!-- <div class="file-preview mx-auto" :style="[{width: width +'px'},{height:height+'px'}]"> -->
        <div class="file-preview">
            <div
                class="file-picture"
                :style="[
                    {'object-fit': 'cover'},
                    {width: 100+'%'},
                    {height: height + 'px'},
                ]"
            >
                <transition name="fade">
                    <img
                        v-show="loaded && url"
                        :class="{'img-to-preview': mimeTypeClass(mimeType).some(v=> v === 'file-image')}"
                        :style="[
                            {'object-fit': 'cover'},
                            {width: 100+'%'},
                            {height: height + 'px'},
                        ]"
                        :src="url"
                        @click="$emit('show', '.img-to-preview')"
                        @load="onLoaded"
                    >
                </transition>
                <transition name="fade">
                    <!-- :style="[{width: width +'px'},{height:height+'px'}]" -->
                    <div
                        v-show="!loaded"
                        :style="[
                            {'object-fit': 'cover'},
                            {width: 100+'%'},
                            {height: height + 'px'},
                        ]"
                        class="md-layout mx-auto mimetype-wrapper"
                    >
                        <div class="md-layout-item md-layout mx-auto mimetype">
                            <md-icon
                                class="md-layout-item"
                                :style="{color: computedColor}"
                            >
                                <font-awesome-icon
                                    :size="`${iconSize}x`"
                                    :icon="mimeTypeClass(mimeType)"
                                />
                            </md-icon>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div class="file-title">
            <small>{{ title }}</small>
        </div>
    </div>
</template>
<script>
import mimetype2fa from './mime-type2fa';

const randomMC = require('random-material-color');

export default {
    name: 'TFilePreview',
    props: {
        color: {
            type: String,
            default: '',
        },
        url: {
            type: String,
            default: '',
        },
        mimeType: {
            type: String,
            default: '',
        },
        iconSize: {
            type: Number,
            default: 1,
        },
        width: {
            type: Number,
            default: 60,
        },
        height: {
            type: Number,
            default: 60,
        },
        title: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            loaded: false,
        };
    },
    computed: {
        computedColor() {
            if (this.color) {
                return this.color;
            }
            const color = randomMC.getColor({
                text: this.mimeType,
            });
            return color;
        },
    },
    methods: {
        mimeTypeClass(m) {
            return mimetype2fa(m, { prefix: 'far ' }).split(' ');
        },
        onLoaded() {
            this.loaded = true;
        },
    },
};
</script>
<style lang="scss">
.file-preview-wrapper {
    position: relative;
        margin: 5px;
    .file-preview {
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
            0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
        position: relative;
        text-align: center;
        overflow: hidden;
        border-radius: 3px;
        .file-picture {
            .fade-enter-active {
                transition: opacity 3s ease-in-out;
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
            overflow: hidden;
            transition: all 0.2s;
            -webkit-transition: all 0.2s;
            .mimetype-wrapper {
                .fade-enter-active {
                    transition: opacity 3s ease-out-in;
                }
                .fade-enter-to {
                    opacity: 1;
                }
                .fade-enter {
                    opacity: 0;
                }
                height: -webkit-fill-available;
                font-size: 3.9rem;
                .md-icon {
                    text-align: center;
                    color: white;
                }
            }
            .img-to-preview {
                border-radius: 5px;
                transition: all 0.4s ease;
                cursor: zoom-in;
            }
        }
    }
        .file-title{
             overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            small{
                padding: 0 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                overflow-wrap: break-word;
            }
        }
}
</style>
