/* eslint-disable */
<template>
  <div>
    <div class="jaw">
      <slot name="top"></slot>
      <div class="jaw-top">
        <div
          v-ripple
          class="tooth"
          v-for="(tooth ) in topAdultTeeth"
          :key="tooth"
          :ref="tooth"
          :style="{ 'width': jawSVG[tooth].width_perc + '%', 'height': '100%' }"
          @click="showTooth(tooth)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="jawSVG[tooth].viewBox"
            :style="{ 'width': jawSVG[tooth].width_perc + '%'}"
          >
            <g>
              <path
                v-if="jaw[tooth].background"
                class="cls-1"
                :d="jawSVG[tooth].background"
              />
              <path
                v-if="jaw[tooth].bridge"
                class="cls-2"
                :d="jawSVG[tooth].bridge"
              />
              <path
                v-if="jaw[tooth].root"
                class="cls-3"
                :d="jawSVG[tooth].root"
              />
              <path
                v-if="jaw[tooth].rootcanal"
                class="cls-4"
                :d="jawSVG[tooth].rootcanal"
              />
              <path
                v-if="jaw[tooth].implant"
                class="cls-5"
                :d="jawSVG[tooth].implant"
              />
              <path
                v-if="jaw[tooth].coronalingual"
                class="cls-6"
                :d="jawSVG[tooth].coronalingual"
              />
              <path
                v-if="jaw[tooth].coronalingualincisaldistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualincisaldistal"
              />
              <path
                v-if="jaw[tooth].coronalingualincisalmiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualincisalmiddle"
              />
              <path
                v-if="jaw[tooth].coronalingualincisionmesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualincisionmesial"
              />
              <path
                v-if="jaw[tooth].coronalingualmiddledistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualmiddledistal"
              />
              <path
                v-if="jaw[tooth].coronalingualmiddlemiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualmiddlemiddle"
              />
              <path
                v-if="jaw[tooth].coronalingualmiddlemesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualmiddlemesial"
              />
              <path
                v-if="jaw[tooth].coronalingualcervicaldistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualcervicaldistal"
              />
              <path
                v-if="jaw[tooth].coronalingualcervicalmiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualcervicalmiddle"
              />
              <path
                v-if="jaw[tooth].coronalingualcervicalmesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualcervicalmesial"
              />
              <path
                v-if="jaw[tooth].coronalabial"
                class="cls-6"
                :d="jawSVG[tooth].coronalabial"
              />
              <path
                v-if="jaw[tooth].coronalabialincisaldistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialincisaldistal"
              />
              <path
                v-if="jaw[tooth].coronalabialincisalmiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialincisalmiddle"
              />
              <path
                v-if="jaw[tooth].coronalabialincisionmesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialincisionmesial"
              />
              <path
                v-if="jaw[tooth].coronalabialmiddledistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialmiddledistal"
              />
              <path
                v-if="jaw[tooth].coronalabialmiddlemiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialmiddlemiddle"
              />
              <path
                v-if="jaw[tooth].coronalabialmiddlemesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialmiddlemesial"
              />
              <path
                v-if="jaw[tooth].coronalabialcervicaldistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialcervicaldistal"
              />
              <path
                v-if="jaw[tooth].coronalabialcervicalmiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialcervicalmiddle"
              />
              <path
                v-if="jaw[tooth].coronalabialcervicalmesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialcervicalmesial"
              />
              <path
                v-if="jaw[tooth].veneer"
                class="cls-2"
                :d="jawSVG[tooth].veneer"
              />
              <path
                v-if="jaw[tooth].coronatop"
                class="cls-6"
                :d="jawSVG[tooth].coronatop"
              />
              <path
                v-if="jaw[tooth].coronatopbuccal"
                class="cls-2"
                :d="jawSVG[tooth].coronatopbuccal"
              />
              <path
                v-if="jaw[tooth].coronatopmedial"
                class="cls-2"
                :d="jawSVG[tooth].coronatopmedial"
              />
              <path
                v-if="jaw[tooth].coronatoplingual"
                class="cls-2"
                :d="jawSVG[tooth].coronatoplingual"
              />
              <path
                v-if="jaw[tooth].coronatopdistal"
                class="cls-2"
                :d="jawSVG[tooth].coronatopdistal"
              />
              <path
                v-if="jaw[tooth].coronatopoclusial"
                class="cls-2"
                :d="jawSVG[tooth].coronatopoclusial"
              />
              <path
                v-if="jaw[tooth].silant"
                class="cls-2"
                :d="jawSVG[tooth].silant"
              />
              <path
                v-if="jaw[tooth].gum"
                class="cls-7"
                :d="jawSVG[tooth].gum"
              />
              <path
                v-if="jaw[tooth].paradontit1"
                class="cls-8"
                :d="jawSVG[tooth].paradontit1"
              />
              <path
                v-if="jaw[tooth].paradontit2"
                class="cls-9"
                :d="jawSVG[tooth].paradontit2"
              />
              <path
                v-if="jaw[tooth].paradontit3"
                class="cls-9"
                :d="jawSVG[tooth].paradontit3"
              />
              <path
                v-if="jaw[tooth].paradontit4"
                class="cls-10"
                :d="jawSVG[tooth].paradontit4"
              />
              <path
                v-if="jaw[tooth].periodontit"
                class="cls-2"
                :d="jawSVG[tooth].periodontit"
              />
              <path
                v-if="jaw[tooth].universal"
                class="cls-11"
                :d="jawSVG[tooth].universal"
              />
              <path
                v-if="jaw[tooth].fdi"
                class="cls-11"
                :d="jawSVG[tooth].fdi"
              />
              <path
                v-if="jaw[tooth].palmer"
                class="cls-11"
                :d="jawSVG[tooth].palmer"
              />
            </g>
          </svg>
        </div>
      </div>
      <div class="jaw-bottom">
        <div
          v-ripple
          class="tooth"
          v-for="(tooth) in bottomAdultTeeth"
          :key="tooth"
          :style="{ 'width': jawSVG[tooth].width_perc + '%', 'height': '100%' }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="jawSVG[tooth].viewBox"
            :style="{ 'width': jawSVG[tooth].width_perc + '%'}"
          >
            <g>
              <path
                v-if="jaw[tooth].background"
                class="cls-1"
                :d="jawSVG[tooth].background"
              />
              <path
                v-if="jaw[tooth].bridge"
                class="cls-2"
                :d="jawSVG[tooth].bridge"
              />
              <path
                v-if="jaw[tooth].root"
                class="cls-3"
                :d="jawSVG[tooth].root"
              />
              <path
                v-if="jaw[tooth].rootcanal"
                class="cls-4"
                :d="jawSVG[tooth].rootcanal"
              />
              <path
                v-if="jaw[tooth].implant"
                class="cls-5"
                :d="jawSVG[tooth].implant"
              />
              <path
                v-if="jaw[tooth].coronalingual"
                class="cls-6"
                :d="jawSVG[tooth].coronalingual"
              />
              <path
                v-if="jaw[tooth].coronalingualincisaldistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualincisaldistal"
              />
              <path
                v-if="jaw[tooth].coronalingualincisalmiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualincisalmiddle"
              />
              <path
                v-if="jaw[tooth].coronalingualincisionmesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualincisionmesial"
              />
              <path
                v-if="jaw[tooth].coronalingualmiddledistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualmiddledistal"
              />
              <path
                v-if="jaw[tooth].coronalingualmiddlemiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualmiddlemiddle"
              />
              <path
                v-if="jaw[tooth].coronalingualmiddlemesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualmiddlemesial"
              />
              <path
                v-if="jaw[tooth].coronalingualcervicaldistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualcervicaldistal"
              />
              <path
                v-if="jaw[tooth].coronalingualcervicalmiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualcervicalmiddle"
              />
              <path
                v-if="jaw[tooth].coronalingualcervicalmesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalingualcervicalmesial"
              />
              <path
                v-if="jaw[tooth].coronalabial"
                class="cls-6"
                :d="jawSVG[tooth].coronalabial"
              />
              <path
                v-if="jaw[tooth].coronalabialincisaldistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialincisaldistal"
              />
              <path
                v-if="jaw[tooth].coronalabialincisalmiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialincisalmiddle"
              />
              <path
                v-if="jaw[tooth].coronalabialincisionmesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialincisionmesial"
              />
              <path
                v-if="jaw[tooth].coronalabialmiddledistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialmiddledistal"
              />
              <path
                v-if="jaw[tooth].coronalabialmiddlemiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialmiddlemiddle"
              />
              <path
                v-if="jaw[tooth].coronalabialmiddlemesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialmiddlemesial"
              />
              <path
                v-if="jaw[tooth].coronalabialcervicaldistal"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialcervicaldistal"
              />
              <path
                v-if="jaw[tooth].coronalabialcervicalmiddle"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialcervicalmiddle"
              />
              <path
                v-if="jaw[tooth].coronalabialcervicalmesial"
                class="cls-2"
                :d="jawSVG[tooth].coronalabialcervicalmesial"
              />
              <path
                v-if="jaw[tooth].veneer"
                class="cls-2"
                :d="jawSVG[tooth].veneer"
              />
              <path
                v-if="jaw[tooth].coronatop"
                class="cls-6"
                :d="jawSVG[tooth].coronatop"
              />
              <path
                v-if="jaw[tooth].coronatopbuccal"
                class="cls-2"
                :d="jawSVG[tooth].coronatopbuccal"
              />
              <path
                v-if="jaw[tooth].coronatopmedial"
                class="cls-2"
                :d="jawSVG[tooth].coronatopmedial"
              />
              <path
                v-if="jaw[tooth].coronatoplingual"
                class="cls-2"
                :d="jawSVG[tooth].coronatoplingual"
              />
              <path
                v-if="jaw[tooth].coronatopdistal"
                class="cls-2"
                :d="jawSVG[tooth].coronatopdistal"
              />
              <path
                v-if="jaw[tooth].coronatopoclusial"
                class="cls-2"
                :d="jawSVG[tooth].coronatopoclusial"
              />
              <path
                v-if="jaw[tooth].silant"
                class="cls-2"
                :d="jawSVG[tooth].silant"
              />
              <path
                v-if="jaw[tooth].gum"
                class="cls-7"
                :d="jawSVG[tooth].gum"
              />
              <path
                v-if="jaw[tooth].paradontit1"
                class="cls-8"
                :d="jawSVG[tooth].paradontit1"
              />
              <path
                v-if="jaw[tooth].paradontit2"
                class="cls-9"
                :d="jawSVG[tooth].paradontit2"
              />
              <path
                v-if="jaw[tooth].paradontit3"
                class="cls-9"
                :d="jawSVG[tooth].paradontit3"
              />
              <path
                v-if="jaw[tooth].paradontit4"
                class="cls-10"
                :d="jawSVG[tooth].paradontit4"
              />
              <path
                v-if="jaw[tooth].periodontit"
                class="cls-2"
                :d="jawSVG[tooth].periodontit"
              />
              <path
                v-if="jaw[tooth].universal"
                class="cls-11"
                :d="jawSVG[tooth].universal"
              />
              <path
                v-if="jaw[tooth].fdi"
                class="cls-11"
                :d="jawSVG[tooth].fdi"
              />
              <path
                v-if="jaw[tooth].palmer"
                class="cls-11"
                :d="jawSVG[tooth].palmer"
              />
            </g>
          </svg>
        </div>
      </div>
      <slot name="bottom"></slot>
    </div>
    <md-dialog :md-active.sync="showSelectedToothDialog">
      <md-dialog-title>Preferences</md-dialog-title>

      <div
        v-if="selectedTooth"
        class="tooth"
        :style="{ 'width': '100%', 'height': '50vh' }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="jawSVG[selectedTooth].viewBox"
          :style="{ 'width': '50%', 'height': '50vh'}"
        >
          <g>
            <path
              v-if="jaw[selectedTooth].background"
              class="cls-1"
              :d="jawSVG[selectedTooth].background"
            />
            <path
              v-if="jaw[selectedTooth].bridge"
              class="cls-2"
              :d="jawSVG[selectedTooth].bridge"
            />
            <path
              v-if="jaw[selectedTooth].root"
              class="cls-3"
              :d="jawSVG[selectedTooth].root"
            />
            <path
              v-if="jaw[selectedTooth].rootcanal"
              class="cls-4"
              :d="jawSVG[selectedTooth].rootcanal"
            />
            <path
              v-if="jaw[selectedTooth].implant"
              class="cls-5"
              :d="jawSVG[selectedTooth].implant"
            />
            <path
              v-if="jaw[selectedTooth].coronalingual"
              class="cls-6"
              :d="jawSVG[selectedTooth].coronalingual"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualincisaldistal"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualincisaldistal"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualincisalmiddle"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualincisalmiddle"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualincisionmesial"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualincisionmesial"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualmiddledistal"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualmiddledistal"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualmiddlemiddle"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualmiddlemiddle"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualmiddlemesial"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualmiddlemesial"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualcervicaldistal"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualcervicaldistal"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualcervicalmiddle"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualcervicalmiddle"
            />
            <path
              v-if="jaw[selectedTooth].coronalingualcervicalmesial"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalingualcervicalmesial"
            />
            <path
              v-if="jaw[selectedTooth].coronalabial"
              class="cls-6"
              :d="jawSVG[selectedTooth].coronalabial"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialincisaldistal"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialincisaldistal"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialincisalmiddle"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialincisalmiddle"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialincisionmesial"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialincisionmesial"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialmiddledistal"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialmiddledistal"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialmiddlemiddle"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialmiddlemiddle"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialmiddlemesial"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialmiddlemesial"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialcervicaldistal"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialcervicaldistal"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialcervicalmiddle"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialcervicalmiddle"
            />
            <path
              v-if="jaw[selectedTooth].coronalabialcervicalmesial"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronalabialcervicalmesial"
            />
            <path
              v-if="jaw[selectedTooth].veneer"
              class="cls-2"
              :d="jawSVG[selectedTooth].veneer"
            />
            <path
              v-if="jaw[selectedTooth].coronatop"
              class="cls-6"
              :d="jawSVG[selectedTooth].coronatop"
            />
            <path
              v-if="jaw[selectedTooth].coronatopbuccal"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronatopbuccal"
            />
            <path
              v-if="jaw[selectedTooth].coronatopmedial"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronatopmedial"
            />
            <path
              v-if="jaw[selectedTooth].coronatoplingual"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronatoplingual"
            />
            <path
              v-if="jaw[selectedTooth].coronatopdistal"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronatopdistal"
            />
            <path
              v-if="jaw[selectedTooth].coronatopoclusial"
              class="cls-2"
              :d="jawSVG[selectedTooth].coronatopoclusial"
            />
            <path
              v-if="jaw[selectedTooth].silant"
              class="cls-2"
              :d="jawSVG[selectedTooth].silant"
            />
            <path
              v-if="jaw[selectedTooth].gum"
              class="cls-7"
              :d="jawSVG[selectedTooth].gum"
            />
            <path
              v-if="jaw[selectedTooth].paradontit1"
              class="cls-8"
              :d="jawSVG[selectedTooth].paradontit1"
            />
            <path
              v-if="jaw[selectedTooth].paradontit2"
              class="cls-9"
              :d="jawSVG[selectedTooth].paradontit2"
            />
            <path
              v-if="jaw[selectedTooth].paradontit3"
              class="cls-9"
              :d="jawSVG[selectedTooth].paradontit3"
            />
            <path
              v-if="jaw[selectedTooth].paradontit4"
              class="cls-10"
              :d="jawSVG[selectedTooth].paradontit4"
            />
            <path
              v-if="jaw[selectedTooth].periodontit"
              class="cls-2"
              :d="jawSVG[selectedTooth].periodontit"
            />
            <path
              v-if="jaw[selectedTooth].universal"
              class="cls-11"
              :d="jawSVG[selectedTooth].universal"
            />
            <path
              v-if="jaw[selectedTooth].fdi"
              class="cls-11"
              :d="jawSVG[selectedTooth].fdi"
            />
            <path
              v-if="jaw[selectedTooth].palmer"
              class="cls-11"
              :d="jawSVG[selectedTooth].palmer"
            />
          </g>
        </svg>
      </div>
      <md-dialog-actions>
        <md-button
          class="md-primary"
          @click="showDialog = false"
        >Close</md-button>
        <md-button
          class="md-primary"
          @click="showDialog = false"
        >Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import jawSVGjs from "./jawSVG";
import {
  IconAdult,
  IconBase,
  IconBaby,
  IconToggleBottom,
  IconToggleTop
} from "@/components";

export default {
  components: {
    IconAdult,
    IconBase,
    IconBaby,
    IconToggleBottom,
    IconToggleTop
  },
  props: {
    jaw: {
      type: Object,
      default: {}
    }
  },
  name: "AppMain",
  data() {
    return {
      SvgTeeth: [],
      teethSettngs: [],
      selectedTooth: null,
      showSelectedToothDialog: false,
      teeth: [
        55,
        54,
        53,
        52,
        51,
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        61,
        62,
        63,
        64,
        65,
        85,
        84,
        83,
        82,
        81,
        48,
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        71,
        72,
        73,
        74,
        75
      ],
      babyTeeth: [
        55,
        54,
        53,
        52,
        51,
        61,
        62,
        63,
        64,
        65,
        85,
        84,
        83,
        82,
        81,
        71,
        72,
        73,
        74,
        75
      ],
      adultTeeth: [
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        48,
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38
      ],
      topAdultTeeth: [
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28
      ],
      bottomAdultTeeth: [
        48,
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38
      ]
    };
  },

  computed: {
    jawSVG() {
      const jawVG = JSON.parse(jawSVGjs);
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
      this.jawSVG.forEach(element => {
        i += element.width_perc;
      });
      return i;
    }
  },

  created() {
    this.setTeeth();
  },

  methods: {
    showTooth(tooth) {
      this.selectedTooth = tooth;
      this.showSelectedToothDialog = true;
      console.log(this.showSelectedToothDialog);
    },
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
          palmer: false
        });
      }
    },
    click(w) {
      console.log(w);
    }
  }
};
</script>
<style lang="scss" scoped>
.jaw,
.md-dialog-container {
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
    fill: #aaa;
  }
}
</style>