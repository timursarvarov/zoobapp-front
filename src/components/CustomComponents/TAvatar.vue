<template>
    <div
        class="avatar-wrapper"
        :style="
            [{'margin-top': notification ? '6px': '' },
            {'margin-right': notification ? '8px': 0 }]"
    >
        <md-avatar :class="[{'md-small': small},{'md-avatar-icon':!loaded}]" class="t-avatar">
            <div class="wrapper" :style="{background: !loaded ? gradient: ''}">
                <transition name="fade">
                    <img
                        class="avatar-img"
                        v-show="loaded && imageSrc"
                        :src="imageSrc"
                        @load="onLoaded"
                        :alt="title | acronim"
                    >
                </transition>
                <transition name="fade">
                    <div
                        :style="{background: gradient}"
                        v-show="!loaded || !imageSrc"
                        :class="[{'tripple-acr':  title.split(' ').length > 2 }]"
                        class="md-layout md-alignment-center-center avatar-acronim-wrapper"
                    >{{ title | acronim }}</div>
                </transition>
            </div>
        </md-avatar>
        <span v-if="notification" class="notification">{{notification}}</span>
    </div>
</template>
<script>
    export default {
        name: 't-avatar',
        props: {
            color: {
                type: String,
                default: '#43a047',
            },
            notification: {
                type: String,
                default: '',
            },
            imageSrc: {
                type: String,
                default: '',
            },
            noImgTag: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: '',
            },
            small: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                loaded: false,
            };
        },
        methods: {
            onLoaded() {
                this.loaded = true;
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
                    c = Math.round(
                        Math.min(Math.max(0, c + c * lumL), 255),
                    ).toString(16);
                    rgb += `00${c}`.substr(c.length);
                }

                return rgb;
            },
        },
        computed: {
            colorC() {
                return this.color || '#43a047';
            },
            gradient() {
                let colors = 'linear-gradient(45deg';
                const colorStart = this.colorLuminance(this.colorC, -0.6);
                const colorEnd = this.colorLuminance(this.colorC, 0.6);
                colors += `,${colorStart},${colorEnd}`;
                colors += ')';
                return colors;
            },
        },
    };
</script>
<style lang="scss">
.avatar-wrapper {
    margin: 6px;
    position: relative;
    width: fit-content;
    .notification {
        z-index: 20;
        position: absolute;
        top: -6px !important;
        border: 1px solid #fff;
        right: -8px !important;
        font-size: 9px;
        background: #f44336;
        color: #ffffff;
        min-width: 20px;
        padding: 0px 5px;
        height: 20px;
        border-radius: 10px;
        text-align: center;
        line-height: 17px;
        display: block;
    }
    .t-avatar.md-avatar {
        .wrapper {
            width: 100%;
            height: 100%;
            .avatar-div {
                // width: 100%;
                // height: 100%;
                background-position: 50%;
                background-repeat: no-repeat;
                background-size: cover;
                background-color: transparent;
                margin: 0 auto;
                .fade-enter-active {
                    transition: opacity 0.4s ease-out !important;
                }
                .fade-enter-to {
                    opacity: 1 !important;
                }

                .fade-enter {
                    opacity: 0 !important;
                }
            }
            .avatar-img {
                .fade-enter-active {
                    transition: opacity 0.4s ease-in !important;
                }
                .fade-enter-to {
                    opacity: 1 !important;
                }

                .fade-enter {
                    opacity: 0 !important;
                }
            }
            .avatar-acronim-wrapper {
                height: 100%;
                text-align: center;
                &.tripple-acr {
                    font-size: 20px;
                }
                .avatar-acronim {
                    text-align: center;
                }
                .fade-enter-active {
                    transition: opacity 0.4s ease-in-out;
                }
                .fade-enter-to {
                    opacity: 1 !important;
                }

                .fade-enter {
                    opacity: 0 !important;
                }
            }
        }
    }
}
</style>
