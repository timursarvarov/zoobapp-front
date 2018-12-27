/* eslint-disable */
<template>
  <div>
    <div class="jaw">
      <div class="jaw-top">
        <div v-ripple class="tooth" v-for="(tooth ) in topAdultTeeth" :key="tooth"
          :style="{ 'width': jawSVG[tooth].width_perc + '%', 'height': '100%' }">
          <svg xmlns="http://www.w3.org/2000/svg" :viewBox="jawSVG[tooth].viewBox"
            :style="{ 'width': jawSVG[tooth].width_perc + '%'}">
            <g data-name="11">
              <!-- <path data-name="background" class="cls-1" :d="jawSVG[tooth].background" /> -->
              <path v-if="jaw[tooth].bridge" data-name="bridge" class="cls-2" :d="jawSVG[tooth].bridge" />
              <path v-if="jaw[tooth].root" data-name="root" class="cls-3" :d="jawSVG[tooth].root" />
              <path v-if="jaw[tooth].rootcanal" data-name="rootcanal" class="cls-4" :d="jawSVG[tooth].rootcanal" />
              <path v-if="jaw[tooth].coronalingual" data-name="coronalingual" class="cls-5" :d="jawSVG[tooth].coronalingual" />
              <path v-if="jaw[tooth].coronalabial" data-name="coronalingualincisaldistal" class="cls-5" :d="jawSVG[tooth].coronalingualincisaldistal" />
              <path v-if="jaw[tooth].coronalingualincisalmiddle" data-name="coronalingualincisalmiddle" class="cls-2" :d="jawSVG[tooth].coronalingualincisalmiddle" />
              <path v-if="jaw[tooth].coronalingualincisionmesial" data-name="coronalingualincisionmesial" class="cls-2" :d="jawSVG[tooth].coronalingualincisionmesial" />
              <path v-if="jaw[tooth].coronalingualmiddledistal" data-name="coronalingualmiddledistal" class="cls-2" :d="jawSVG[tooth].coronalingualmiddledistal" />
              <path v-if="jaw[tooth].coronalingualmiddlemiddle" data-name="coronalingualmiddlemiddle" class="cls-2" :d="jawSVG[tooth].coronalingualmiddlemiddle" />
              <path v-if="jaw[tooth].coronalingualmiddlemesial" data-name="coronalingualmiddlemesial" class="cls-2" :d="jawSVG[tooth].coronalingualmiddlemesial" />
              <path v-if="jaw[tooth].coronalingualcervicaldistal" data-name="coronalingualcervicaldistal" class="cls-2" :d="jawSVG[tooth].coronalingualcervicaldistal" />
              <path v-if="jaw[tooth].coronalingualcervicalmiddle" data-name="coronalingualcervicalmiddle" class="cls-2" :d="jawSVG[tooth].coronalingualcervicalmiddle" />
              <path v-if="jaw[tooth].coronalingualcervicalmesial" data-name="coronalingualcervicalmesial" class="cls-2" :d="jawSVG[tooth].coronalingualcervicalmesial" />
              <path v-if="jaw[tooth].coronalingualincisaldistal" data-name="coronalabial" class="cls-2" :d="jawSVG[tooth].coronalabial" />
              <path v-if="jaw[tooth].coronalabialincisaldistal" data-name="coronalabialincisaldistal" class="cls-2" :d="jawSVG[tooth].coronalabialincisaldistal" />
              <path v-if="jaw[tooth].coronalabialincisalmiddle" data-name="coronalabialincisalmiddle" class="cls-2" :d="jawSVG[tooth].coronalabialincisalmiddle" />
              <path v-if="jaw[tooth].coronalabialincisionmesial" data-name="coronalabialincisionmesial" class="cls-2" :d="jawSVG[tooth].coronalabialincisionmesial" />
              <path v-if="jaw[tooth].coronalabialmiddledistal" data-name="coronalabialmiddledistal" class="cls-2" :d="jawSVG[tooth].coronalabialmiddledistal" />
              <path v-if="jaw[tooth].coronalabialmiddlemiddle" data-name="coronalabialmiddlemiddle" class="cls-2" :d="jawSVG[tooth].coronalabialmiddlemiddle" />
              <path v-if="jaw[tooth].coronalabialmiddlemesial" data-name="coronalabialmiddlemesial" class="cls-2" :d="jawSVG[tooth].coronalabialmiddlemesial" />
              <path v-if="jaw[tooth].coronalabialcervicaldistal" data-name="coronalabialcervicaldistal" class="cls-2" :d="jawSVG[tooth].coronalabialcervicaldistal" />
              <path v-if="jaw[tooth].coronalabialcervicalmiddle" data-name="coronalabialcervicalmiddle" class="cls-2" :d="jawSVG[tooth].coronalabialcervicalmiddle" />
              <path v-if="jaw[tooth].coronalabialcervicalmesial" data-name="coronalabialcervicalmesial" class="cls-2" :d="jawSVG[tooth].coronalabialcervicalmesial" />
              <path v-if="jaw[tooth].implant" data-name="implant" class="cls-2" :d="jawSVG[tooth].implant" />
              <path v-if="jaw[tooth].veneer" data-name="veneer" class="cls-2" :d="jawSVG[tooth].veneer" />
              <path v-if="jaw[tooth].coronatop" data-name="coronatop" class="cls-6" :d="jawSVG[tooth].coronatop" />
              <path v-if="jaw[tooth].coronatopbuccal" data-name="coronatopbuccal" class="cls-2" :d="jawSVG[tooth].coronatopbuccal" />
              <path v-if="jaw[tooth].coronatopmedial" data-name="coronatopmedial" class="cls-2" :d="jawSVG[tooth].coronatopmedial" />
              <path v-if="jaw[tooth].coronatoplingual" data-name="coronatoplingual" class="cls-2" :d="jawSVG[tooth].coronatoplingual" />
              <path v-if="jaw[tooth].coronatopdistal" data-name="coronatopdistal" class="cls-2" :d="jawSVG[tooth].coronatopdistal" />
              <path v-if="jaw[tooth].coronatopoclusial" data-name="coronatopoclusial" class="cls-2" :d="jawSVG[tooth].coronatopoclusial" />
              <path v-if="jaw[tooth].silant" data-name="silant" class="cls-2" :d="jawSVG[tooth].silant" />
              <path v-if="jaw[tooth].gum" data-name="gum" class="cls-7" :d="jawSVG[tooth].gum" />
              <path v-if="jaw[tooth].paradontit1" data-name="paradontit1" class="cls-8" :d="jawSVG[tooth].paradontit1" />
              <path v-if="jaw[tooth].paradontit2" data-name="paradontit2" class="cls-9" :d="jawSVG[tooth].paradontit2" />
              <path v-if="jaw[tooth].paradontit3" data-name="paradontit3" class="cls-9" :d="jawSVG[tooth].paradontit3" />
              <path v-if="jaw[tooth].paradontit4" data-name="paradontit4" class="cls-10" :d="jawSVG[tooth].paradontit4" />
              <path v-if="jaw[tooth].periodontit" data-name="periodontit" class="cls-2" :d="jawSVG[tooth].periodontit" />
              <path v-if="jaw[tooth].universal" data-name="universal" class="cls-11" :d="jawSVG[tooth].universal" />
              <path v-if="jaw[tooth].fdi" data-name="fdi" class="cls-11" :d="jawSVG[tooth].fdi" />
              <path v-if="jaw[tooth].palmer" class="cls-11" :d="jawSVG[tooth].palmer" />
            </g>
          </svg>
        </div>
      </div>
      <div class="jaw-bottom">
        <div v-ripple class="tooth" v-for="(tooth) in bottomAdultTeeth" :key="tooth"
          :style="{ 'width': jawSVG[tooth].width_perc + '%', 'height': '100%' }">
          <svg xmlns="http://www.w3.org/2000/svg" :viewBox="jawSVG[tooth].viewBox"
            :style="{ 'width': jawSVG[tooth].width_perc + '%'}">
            <g data-name="11">
              <!-- <path data-name="background" class="cls-1" :d="jawSVG[tooth].background" /> -->
              <path v-if="jaw[tooth].bridge" data-name="bridge" class="cls-2" :d="jawSVG[tooth].bridge" />
              <path v-if="jaw[tooth].root" data-name="root" class="cls-3" :d="jawSVG[tooth].root" />
              <path v-if="jaw[tooth].rootcanal" data-name="rootcanal" class="cls-4" :d="jawSVG[tooth].rootcanal" />
              <path v-if="jaw[tooth].coronalingual" data-name="coronalingual" class="cls-5" :d="jawSVG[tooth].coronalingual" />
              <path v-if="jaw[tooth].coronalabial" data-name="coronalingualincisaldistal" class="cls-5" :d="jawSVG[tooth].coronalingualincisaldistal" />
              <path v-if="jaw[tooth].coronalingualincisalmiddle" data-name="coronalingualincisalmiddle" class="cls-2" :d="jawSVG[tooth].coronalingualincisalmiddle" />
              <path v-if="jaw[tooth].coronalingualincisionmesial" data-name="coronalingualincisionmesial" class="cls-2" :d="jawSVG[tooth].coronalingualincisionmesial" />
              <path v-if="jaw[tooth].coronalingualmiddledistal" data-name="coronalingualmiddledistal" class="cls-2" :d="jawSVG[tooth].coronalingualmiddledistal" />
              <path v-if="jaw[tooth].coronalingualmiddlemiddle" data-name="coronalingualmiddlemiddle" class="cls-2" :d="jawSVG[tooth].coronalingualmiddlemiddle" />
              <path v-if="jaw[tooth].coronalingualmiddlemesial" data-name="coronalingualmiddlemesial" class="cls-2" :d="jawSVG[tooth].coronalingualmiddlemesial" />
              <path v-if="jaw[tooth].coronalingualcervicaldistal" data-name="coronalingualcervicaldistal" class="cls-2" :d="jawSVG[tooth].coronalingualcervicaldistal" />
              <path v-if="jaw[tooth].coronalingualcervicalmiddle" data-name="coronalingualcervicalmiddle" class="cls-2" :d="jawSVG[tooth].coronalingualcervicalmiddle" />
              <path v-if="jaw[tooth].coronalingualcervicalmesial" data-name="coronalingualcervicalmesial" class="cls-2" :d="jawSVG[tooth].coronalingualcervicalmesial" />
              <path v-if="jaw[tooth].coronalingualincisaldistal" data-name="coronalabial" class="cls-2" :d="jawSVG[tooth].coronalabial" />
              <path v-if="jaw[tooth].coronalabialincisaldistal" data-name="coronalabialincisaldistal" class="cls-2" :d="jawSVG[tooth].coronalabialincisaldistal" />
              <path v-if="jaw[tooth].coronalabialincisalmiddle" data-name="coronalabialincisalmiddle" class="cls-2" :d="jawSVG[tooth].coronalabialincisalmiddle" />
              <path v-if="jaw[tooth].coronalabialincisionmesial" data-name="coronalabialincisionmesial" class="cls-2" :d="jawSVG[tooth].coronalabialincisionmesial" />
              <path v-if="jaw[tooth].coronalabialmiddledistal" data-name="coronalabialmiddledistal" class="cls-2" :d="jawSVG[tooth].coronalabialmiddledistal" />
              <path v-if="jaw[tooth].coronalabialmiddlemiddle" data-name="coronalabialmiddlemiddle" class="cls-2" :d="jawSVG[tooth].coronalabialmiddlemiddle" />
              <path v-if="jaw[tooth].coronalabialmiddlemesial" data-name="coronalabialmiddlemesial" class="cls-2" :d="jawSVG[tooth].coronalabialmiddlemesial" />
              <path v-if="jaw[tooth].coronalabialcervicaldistal" data-name="coronalabialcervicaldistal" class="cls-2" :d="jawSVG[tooth].coronalabialcervicaldistal" />
              <path v-if="jaw[tooth].coronalabialcervicalmiddle" data-name="coronalabialcervicalmiddle" class="cls-2" :d="jawSVG[tooth].coronalabialcervicalmiddle" />
              <path v-if="jaw[tooth].coronalabialcervicalmesial" data-name="coronalabialcervicalmesial" class="cls-2" :d="jawSVG[tooth].coronalabialcervicalmesial" />
              <path v-if="jaw[tooth].implant" data-name="implant" class="cls-2" :d="jawSVG[tooth].implant" />
              <path v-if="jaw[tooth].veneer" data-name="veneer" class="cls-2" :d="jawSVG[tooth].veneer" />
              <path v-if="jaw[tooth].coronatop" data-name="coronatop" class="cls-6" :d="jawSVG[tooth].coronatop" />
              <path v-if="jaw[tooth].coronatopbuccal" data-name="coronatopbuccal" class="cls-2" :d="jawSVG[tooth].coronatopbuccal" />
              <path v-if="jaw[tooth].coronatopmedial" data-name="coronatopmedial" class="cls-2" :d="jawSVG[tooth].coronatopmedial" />
              <path v-if="jaw[tooth].coronatoplingual" data-name="coronatoplingual" class="cls-2" :d="jawSVG[tooth].coronatoplingual" />
              <path v-if="jaw[tooth].coronatopdistal" data-name="coronatopdistal" class="cls-2" :d="jawSVG[tooth].coronatopdistal" />
              <path v-if="jaw[tooth].coronatopoclusial" data-name="coronatopoclusial" class="cls-2" :d="jawSVG[tooth].coronatopoclusial" />
              <path v-if="jaw[tooth].silant" data-name="silant" class="cls-2" :d="jawSVG[tooth].silant" />
              <path v-if="jaw[tooth].gum" data-name="gum" class="cls-7" :d="jawSVG[tooth].gum" />
              <path v-if="jaw[tooth].paradontit1" data-name="paradontit1" class="cls-8" :d="jawSVG[tooth].paradontit1" />
              <path v-if="jaw[tooth].paradontit2" data-name="paradontit2" class="cls-9" :d="jawSVG[tooth].paradontit2" />
              <path v-if="jaw[tooth].paradontit3" data-name="paradontit3" class="cls-9" :d="jawSVG[tooth].paradontit3" />
              <path v-if="jaw[tooth].paradontit4" data-name="paradontit4" class="cls-10" :d="jawSVG[tooth].paradontit4" />
              <path v-if="jaw[tooth].periodontit" data-name="periodontit" class="cls-2" :d="jawSVG[tooth].periodontit" />
              <path v-if="jaw[tooth].universal" data-name="universal" class="cls-11" :d="jawSVG[tooth].universal" />
              <path v-if="jaw[tooth].fdi" data-name="fdi" class="cls-11" :d="jawSVG[tooth].fdi" />
              <path v-if="jaw[tooth].palmer" class="cls-11" :d="jawSVG[tooth].palmer" />
            </g>
          </svg>
        </div>
      </div>
      <div class="md-layout md-alignment-center-center md-gutter">
        <md-button class="md-layout-item md-simple md-just-icon">
          <icon-base width="30" height="30" icon-name="icon-baby " iconColor="white">
            <icon-baby />
          </icon-base>
          <md-tooltip>Baby teeth</md-tooltip>
        </md-button>
        <md-button class="md-layout-item md-simple md-just-icon">
          <icon-base width="30" height="30" icon-name="icon-adult " iconColor="white">
            <icon-adult />
          </icon-base>
          <md-tooltip>Adult teeth</md-tooltip>
        </md-button>
        <md-button class="md-layout-item md-simple md-just-icon">
          <icon-base width="30" height="30" icon-name="icon-baby " iconColor="white">
            <icon-toggle-top />
          </icon-base>
          <md-tooltip>Toggle bottom</md-tooltip>
        </md-button>
        <md-button class="md-layout-item md-simple md-just-icon">
          <icon-base width="30" height="30" icon-name="icon-baby " iconColor="white">
            <icon-toggle-bottom />
          </icon-base>
          <md-tooltip>Toggle top</md-tooltip>
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
 /* eslint-disable */
  import jawSVGjs from './jawSVG';
  import {
    IconAdult,
    IconBase,
    IconBaby,
    IconToggleBottom,
    IconToggleTop,
  } from '@/components';

  export default {
    components: {
      IconAdult,
      IconBase,
      IconBaby,
      IconToggleBottom,
      IconToggleTop,
    },
    props: {
      jaw: {
        type: Object,
        default: {},
      },
    },
    name: 'AppMain',
    data() {
      return {
        SvgTeeth: [],
        teethSettngs: [],
        teeth: [
          55, 54, 53, 52, 51, 18, 17, 16, 15, 14, 13, 12,11,
          21, 22, 23, 24, 25, 26, 27, 28, 61, 62, 63, 64, 65,
          85, 84, 83, 82, 81, 48, 47, 46, 45, 44, 43, 42, 41,
          31, 32, 33, 34, 35, 36, 37, 38, 71, 72, 73, 74, 75
          ],
        babyTeeth: [
          55, 54, 53, 52, 51,61, 62, 63,64, 65,
          85, 84, 83, 82, 81, 71, 72, 73, 74, 75
          ],
        adultTeeth: [
          18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23,
          24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43,
          42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
          ],
        topAdultTeeth: [
          18, 17, 16, 15, 14, 13, 12, 11,
          21, 22, 23, 24, 25, 26, 27, 28
          ],
        bottomAdultTeeth: [
          48, 47, 46, 45, 44, 43, 42, 41,
          31, 32, 33, 34, 35, 36, 37, 38
          ],
      };
    },

    computed: {
      jawSVG() {
        const jawVG = JSON.parse(jawSVGjs)
        return jawVG[0];
      },
      jawSVGtop() {
        return this.jawSVG.slice(0, 16);
      },
      jawSVGbottom() {
        return this.jawSVG.slice(16, 32);
      },

      sum() {
        let i = 0;
        this.jawSVG.forEach((element) => {
          i += element.width_perc;
        });
        return i;
      },
    },

    created() {
      this.setTeeth();
    },

    methods: {
      setTeeth() {
        for (let i = 0; i < this.teeth.length; i += 1) {
          this.teethSettngs.push({
            toothID: this.teeth[i],
            background: false,
            bridge: false,
            root: false,
            rootcanal: false,
            coronalingual: false,
            coronalingualincisaldistal: false,
            coronalingualincisalmiddle: false,
            coronalingualincisionmesial: false,
            coronalingualmiddledistal: false,
            coronalingualmiddlemiddle: false,
            coronalingualmiddlemesial: false,
            coronalingualcervicaldistal: false,
            coronalingualcervicalmiddle: false,
            coronalingualcervicalmesial: false,
            coronalabial: false,
            coronalabialincisaldistal: false,
            coronalabialincisalmiddle: false,
            coronalabialincisionmesial: false,
            coronalabialmiddledistal: false,
            coronalabialmiddlemiddle: false,
            coronalabialmiddlemesial: false,
            coronalabialcervicaldistal: false,
            coronalabialcervicalmiddle: false,
            coronalabialcervicalmesial: false,
            implant: false,
            veneer: false,
            coronatop: false,
            coronatopbuccal: false,
            coronatopmedial: false,
            coronatoplingual: false,
            coronatopdistal: false,
            coronatopoclusial: false,
            silant: false,
            gum: false,
            paradontit1: false,
            paradontit2: false,
            paradontit3: false,
            paradontit4: false,
            periodontit: false,
            universal: false,
            fdi: false,
            palmer: false,
          });
        }
      },
      click(w) {
        console.log(w);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .jaw {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 15px;
    background: rgba(white, 0.4);
    border-radius: 5px;

    .jaw-top,
    .jaw-bottom {
      display: flex;

      .tooth {
        display: flex;
        border-radius: 12px;

        svg {
          flex-grow: 1;
          flex-basis: 100%;
          height: 100%;
        }
      }
    }

    .cls-1 {
      fill: #9fdaff;
    }

    .cls-2 {
      fill: #3535ed;
    }

    .cls-3 {
      fill: #f8edc8;
      stroke: #292320;
      stroke-width: 0.25px;
    }

    .cls-5 {
      fill: #f8edc8;
      stroke: #292320;
      stroke-width: 0.25px;
    }

    .cls-3,
    .cls-6 {
      // stroke-miterlimit: 10;
      stroke-width: 0.25px;
    }

    .cls-4 {
      fill: #4d68aa;
    }

    .cls-10,
    .cls-7,
    .cls-8,
    .cls-9 {
      fill: none;
    }

    .cls-6 {
      fill: #fff;
      stroke: #000;
    }

    .cls-7 {
      stroke: #ffb900;
    }

    .cls-10,
    .cls-7,
    .cls-8,
    .cls-9 {
      stroke-linejoin: round;
      stroke-width: 3px;
    }

    .cls-8 {
      stroke: #ff822e;
    }

    .cls-9 {
      stroke: #f9610d;
    }

    .cls-10 {
      stroke: #f75403;
    }

    .cls-11 {
      isolation: isolate;
      // stroke: #fff;
      fill: #fff;
    }
  }
</style>
