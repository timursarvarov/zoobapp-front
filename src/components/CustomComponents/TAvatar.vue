<template>
    <div class="avatar-wrapper" :style="[{ 'margin-top': notification ? '6px' : '' }, { 'margin-right': notification ? '8px' : 0 }]">
        <md-avatar :class="[{ 'md-small': small }, { 'md-avatar-icon': !loaded }]" class="t-avatar">
            <div class="wrapper" :style="{ background: !loaded ? gradient : '' }">
                <transition name="fade">
                    <img v-show="loaded && src" class="avatar-img" :src="src" :alt="title | acronim" @load="onLoaded" />
                </transition>
                <transition name="fade">
                    <div
                        v-show="!loaded || !src"
                        :style="{ background: gradient }"
                        :class="[{ 'tripple-acr': !small && acronim.length > 2 }, { 'tripple-acr-small': small && acronim.length > 2 }]"
                        class="md-layout md-alignment-center-center avatar-acronim-wrapper"
                    >
                        {{ acronim }}
                    </div>
                </transition>
            </div>
        </md-avatar>
        <span v-if="notification" class="notification" :class="`${notificationClass}`"
            >{{ notification }}
            <md-tooltip>Attention allergy!</md-tooltip>
        </span>
    </div>
</template>
<script>
const randomMC = require('random-material-color');

export default {
    name: 'TAvatar',
    props: {
        textToColor: {
            type: [String, Number],
            default: null
        },
        notification: {
            type: String,
            default: ''
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
            default: ''
        },
        notificationClass: {
            type: String,
            default: ''
        },
        small: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loaded: false,
            randomMC: ''
        };
    },
    computed: {
        computedColor() {
            const color = this.randomMC.getColor({
                text: `${this.textToColor}`
            });
            return color;
        },
        src() {
            return this.imageSrc || '';
        },
        gradient() {
            let colors = 'linear-gradient(45deg';
            const colorStart = this.colorLuminance(this.computedColor, -0.6);
            const colorEnd = this.colorLuminance(this.computedColor, 0.6);
            colors += `,${colorStart},${colorEnd}`;
            colors += ')';
            return colors;
        },
        acronim() {
            if (!this.title || this.title === 'null null') {
                return '';
            }
            const words = this.title.split(' ');
            const secondtLetter = x => {
                if (x && x[1]) {
                    return x[1].toLowerCase();
                }
                return '';
            };
            const firsttLetter = x => {
                if (x && x[0]) {
                    return x[0].toUpperCase();
                }
                return '';
            };
            if (words[0] && !words[1]) {
                const acr = firsttLetter(words[0]) + secondtLetter(words[0]);
                return acr;
            }
            let acr = '';
            acr = this.title
                .split(' ')
                .map(firsttLetter)
                .join('');
            return acr.slice(0, 3);
        }
    },
    created() {
        this.randomMC = randomMC;
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
                c = Math.round(Math.min(Math.max(0, c + c * lumL), 255)).toString(16);
                rgb += `00${c}`.substr(c.length);
            }

            return rgb;
        }
    }
};
</script>
