<template>
    <div>
        <div class="jaw" >
             <div class="jaw-top">
               <div v-ripple class="tooth"  v-for="(tooth ) in jawSVGtop" :key="tooth.toothId" :style="{ 'width': tooth.width_perc + '%', 'height': '100%' }"  >
                    <svg  xmlns="http://www.w3.org/2000/svg" :viewBox="tooth.viewBox"  :style="{ 'width': tooth.width_perc + '%'}" >
                    <g  data-name="11">
                            <!-- <path data-name="background" class="cls-1" :d="tooth.background" /> -->
                            <path data-name="bridge" class="cls-2" :d="tooth.bridge" />
                            <path data-name="root" class="cls-3" :d="tooth.root" />
                            <!-- <path data-name="rootcanal" class="cls-4" :d="tooth.rootcanal" /> -->
                            <path data-name="coronalingual" class="cls-5" :d="tooth.coronalingual" />
                            <!-- <path data-name="coronalingualincisaldistal" class="cls-2" :d="tooth.coronalingualincisaldistal" />
                            <path data-name="coronalingualincisalmiddle" class="cls-2" :d="tooth.coronalingualincisalmiddle" />
                            <path data-name="coronalingualincisionmesial" class="cls-2" :d="tooth.coronalingualincisionmesial" />
                            <path data-name="coronalingualmiddledistal" class="cls-2" :d="tooth.coronalingualmiddledistal" />
                            <path data-name="coronalingualmiddlemiddle" class="cls-2" :d="tooth.coronalingualmiddlemiddle" />
                            <path data-name="coronalingualmiddlemesial" class="cls-2" :d="tooth.coronalingualmiddlemesial" />
                            <path data-name="coronalingualcervicaldistal" class="cls-2" :d="tooth.coronalingualcervicaldistal" />
                            <path data-name="coronalingualcervicalmiddle" class="cls-2" :d="tooth.coronalingualcervicalmiddle" />
                            <path data-name="coronalingualcervicalmesial" class="cls-2" :d="tooth.coronalingualcervicalmesial" /> -->
                            <path data-name="coronalabial" class="cls-5" :d="tooth.coronalabial" />
                            <path data-name="coronalabialincisaldistal" class="cls-2" :d="tooth.coronalabialincisaldistal" />
                            <path data-name="coronalabialincisalmiddle" class="cls-2" :d="tooth.coronalabialincisalmiddle" />
                            <path data-name="coronalabialincisionmesial" class="cls-2" :d="tooth.coronalabialincisionmesial" />
                            <path data-name="coronalabialmiddledistal" class="cls-2" :d="tooth.coronalabialmiddledistal" />
                            <path data-name="coronalabialmiddlemiddle" class="cls-2" :d="tooth.coronalabialmiddlemiddle" />
                            <path data-name="coronalabialmiddlemesial" class="cls-2" :d="tooth.coronalabialmiddlemesial" />
                            <!-- <path data-name="coronalabialcervicaldistal" class="cls-2" :d="tooth.coronalabialcervicaldistal" />
                            <path data-name="coronalabialcervicalmiddle" class="cls-2" :d="tooth.coronalabialcervicalmiddle" />
                            <path data-name="coronalabialcervicalmesial" class="cls-2" :d="tooth.coronalabialcervicalmesial" /> -->
                            <path data-name="implant" class="cls-2" :d="tooth.implant" />
                            <path data-name="veneer" class="cls-2" :d="tooth.veneer" />
                            <path data-name="coronatop" class="cls-6" :d="tooth.coronatop" />
                            <!-- <path data-name="coronatopbuccal" class="cls-2" :d="tooth.coronatopbuccal" /> -->
                            <!-- <path data-name="coronatopmedial" class="cls-2" :d="tooth.coronatopmedial" /> -->
                            <!-- <path data-name="coronatoplingual" class="cls-2" :d="tooth.coronatoplingual" /> -->
                            <path data-name="coronatopdistal" class="cls-2" :d="tooth.coronatopdistal" />
                            <!-- <path data-name="coronatopoclusial" class="cls-2" :d="tooth.coronatopoclusial" /> -->
                            <path data-name="silant" class="cls-2" :d="tooth.silant" />
                            <path data-name="gum" class="cls-7" :d="tooth.gum" />
                            <!-- <path data-name="paradontit1" class="cls-8" :d="tooth.paradontit1" />
                            <path data-name="paradontit2" class="cls-9" :d="tooth.paradontit2" />
                            <path data-name="paradontit3" class="cls-9" :d="tooth.paradontit3" />
                            <path data-name="paradontit4" class="cls-10" :d="tooth.paradontit4" />
                            <path data-name="periodontit" class="cls-2" :d="tooth.periodontit" /> -->
                            <!-- <path data-name="universal" class="cls-11" :d="tooth.universal" />
                            <path data-name="fdi" class="cls-11" :d="tooth.fdi" />
                            <path v-show="teethSettngs[key].palmer" :id="'palmer' + key " class="cls-11" :d="tooth.palmer" /> -->
                        </g>

                </svg>
            </div>
        </div>
            <div class="jaw-bottom">
                  <div v-ripple class="tooth"  v-for="(tooth ) in jawSVGbottom" :key="tooth.toothId"  :style="{ 'width': tooth.width_perc + '%', 'height': '100%' }">
                    <svg  xmlns="http://www.w3.org/2000/svg" :viewBox="tooth.viewBox"  :style="{ 'width': tooth.width_perc + '%'}" >
                        <g  data-name="11">
                            <!-- <path data-name="background" class="cls-1" :d="tooth.background" /> -->
                            <path data-name="bridge" class="cls-2" :d="tooth.bridge" />
                            <path data-name="root" class="cls-3" :d="tooth.root" />
                            <path data-name="rootcanal" class="cls-4" :d="tooth.rootcanal" />
                            <path data-name="coronalingual" class="cls-5" :d="tooth.coronalingual" />
                            <path data-name="coronalingualincisaldistal" class="cls-2" :d="tooth.coronalingualincisaldistal" />
                            <path data-name="coronalingualincisalmiddle" class="cls-2" :d="tooth.coronalingualincisalmiddle" />
                            <path data-name="coronalingualincisionmesial" class="cls-2" :d="tooth.coronalingualincisionmesial" />
                            <path data-name="coronalingualmiddledistal" class="cls-2" :d="tooth.coronalingualmiddledistal" />
                            <path data-name="coronalingualmiddlemiddle" class="cls-2" :d="tooth.coronalingualmiddlemiddle" />
                            <path data-name="coronalingualmiddlemesial" class="cls-2" :d="tooth.coronalingualmiddlemesial" />
                            <path data-name="coronalingualcervicaldistal" class="cls-2" :d="tooth.coronalingualcervicaldistal" />
                            <path data-name="coronalingualcervicalmiddle" class="cls-2" :d="tooth.coronalingualcervicalmiddle" />
                            <path data-name="coronalingualcervicalmesial" class="cls-2" :d="tooth.coronalingualcervicalmesial" />
                            <path data-name="coronalabial" class="cls-5" :d="tooth.coronalabial" />
                            <path data-name="coronalabialincisaldistal" class="cls-2" :d="tooth.coronalabialincisaldistal" />
                            <path data-name="coronalabialincisalmiddle" class="cls-2" :d="tooth.coronalabialincisalmiddle" />
                            <path data-name="coronalabialincisionmesial" class="cls-2" :d="tooth.coronalabialincisionmesial" />
                            <path data-name="coronalabialmiddledistal" class="cls-2" :d="tooth.coronalabialmiddledistal" />
                            <path data-name="coronalabialmiddlemiddle" class="cls-2" :d="tooth.coronalabialmiddlemiddle" />
                            <path data-name="coronalabialmiddlemesial" class="cls-2" :d="tooth.coronalabialmiddlemesial" />
                            <path data-name="coronalabialcervicaldistal" class="cls-2" :d="tooth.coronalabialcervicaldistal" />
                            <path data-name="coronalabialcervicalmiddle" class="cls-2" :d="tooth.coronalabialcervicalmiddle" />
                            <path data-name="coronalabialcervicalmesial" class="cls-2" :d="tooth.coronalabialcervicalmesial" />
                            <path data-name="implant" class="cls-2" :d="tooth.implant" />
                            <path data-name="veneer" class="cls-2" :d="tooth.veneer" />
                            <path data-name="coronatop" class="cls-6" :d="tooth.coronatop" />
                            <path data-name="coronatopbuccal" class="cls-2" :d="tooth.coronatopbuccal" />
                            <path data-name="coronatopmedial" class="cls-2" :d="tooth.coronatopmedial" />
                            <path data-name="coronatoplingual" class="cls-2" :d="tooth.coronatoplingual" />
                            <path data-name="coronatopdistal" class="cls-2" :d="tooth.coronatopdistal" />
                            <path data-name="coronatopoclusial" class="cls-2" :d="tooth.coronatopoclusial" />
                            <path data-name="silant" class="cls-2" :d="tooth.silant" />
                            <path data-name="gum" class="cls-7" :d="tooth.gum" />
                            <path data-name="paradontit1" class="cls-8" :d="tooth.paradontit1" />
                            <path data-name="paradontit2" class="cls-9" :d="tooth.paradontit2" />
                            <path data-name="paradontit3" class="cls-9" :d="tooth.paradontit3" />
                            <path data-name="paradontit4" class="cls-10" :d="tooth.paradontit4" />
                            <path data-name="periodontit" class="cls-2" :d="tooth.periodontit" />
                            <!-- <path data-name="universal" class="cls-11" :d="tooth.universal" /> -->
                            <path data-name="fdi" class="cls-11" :d="tooth.fdi" />
                            <!-- <path v-show="teethSettngs[key].palmer" :id="'palmer' + key " class="cls-11" :d="tooth.palmer" /> -->
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import jawSVGjs from "./jawSVG.js";
export default {
  name: "AppMain",
  data() {
    return {
      SvgTeeth: [],
      teethSettngs: [],
      teeth: [
        "18",
        "17",
        "16",
        "15",
        "14",
        "13",
        "12",
        "11",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "48",
        "47",
        "46",
        "45",
        "44",
        "43",
        "42",
        "41",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38"
      ]
    };
  },

  computed: {
    jawSVG: function() {
      return JSON.parse(jawSVGjs);
    },
    jawSVGtop: function() {
      return this.jawSVG.slice(0, 16);
    },
    jawSVGbottom: function() {
      return this.jawSVG.slice(16, 32);
    },

    sum: function() {
      let i = 0;
      this.jawSVG.forEach(element => {
        i = i + element.width_perc;
      });
      return i;
    }
  },

  created() {
    this.setTeeth();
  },

  methods: {
    setTeeth() {
      for (let i = 0; i < this.teeth.length; i++) {
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
    },

    print() {
      var i = 0;
      for (i = 0; i < this.teeth.length; i++) {
        let _tooth = "_" + this.teeth[i];
        let svg = this.$refs[_tooth].cloneNode(true);
        let el =
          svg.childNodes[0].childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0];
        if (svg)
          this.SvgTeeth.push({
            toothID: this.teeth[i],
            viewBox: svg.getAttribute("viewBox"),
            background: el.childNodes[0].getAttribute("d"),
            bridge: el.children[1].getAttribute("d"),
            root: el.children[2].getAttribute("d"),
            rootcanal: el.children[3].getAttribute("d"),
            coronalingual: el.children[4].getAttribute("d"),
            coronalingualincisaldistal: el.children[5].getAttribute("d"),
            coronalingualincisalmiddle: el.children[6].getAttribute("d"),
            coronalingualincisionmesial: el.children[7].getAttribute("d"),
            coronalingualmiddledistal: el.children[8].getAttribute("d"),
            coronalingualmiddlemiddle: el.children[9].getAttribute("d"),
            coronalingualmiddlemesial: el.children[10].getAttribute("d"),
            coronalingualcervicaldistal: el.children[11].getAttribute("d"),
            coronalingualcervicalmiddle: el.children[12].getAttribute("d"),
            coronalingualcervicalmesial: el.children[13].getAttribute("d"),
            coronalabial: el.children[14].getAttribute("d"),
            coronalabialincisaldistal: el.children[15].getAttribute("d"),
            coronalabialincisalmiddle: el.children[16].getAttribute("d"),
            coronalabialincisionmesial: el.children[17].getAttribute("d"),
            coronalabialmiddledistal: el.children[18].getAttribute("d"),
            coronalabialmiddlemiddle: el.children[19].getAttribute("d"),
            coronalabialmiddlemesial: el.children[20].getAttribute("d"),
            coronalabialcervicaldistal: el.children[21].getAttribute("d"),
            coronalabialcervicalmiddle: el.children[22].getAttribute("d"),
            coronalabialcervicalmesial: el.children[23].getAttribute("d"),
            implant: el.children[24].getAttribute("d"),
            veneer: el.children[25].getAttribute("d"),
            coronatop: el.children[26].getAttribute("d"),
            coronatopbuccal: el.children[27].getAttribute("d"),
            coronatopmedial: el.children[28].getAttribute("d"),
            coronatoplingual: el.children[29].getAttribute("d"),
            coronatopdistal: el.children[30].getAttribute("d"),
            coronatopoclusial: el.children[31].getAttribute("d"),
            silant: el.children[32].getAttribute("d"),
            gum: el.children[33].getAttribute("d"),
            paradontit1: el.children[34].getAttribute("d"),
            paradontit2: el.children[35].getAttribute("d"),
            paradontit3: el.children[36].getAttribute("d"),
            paradontit4: el.children[37].getAttribute("d"),
            periodontit: el.children[38].getAttribute("d"),
            universal: el.children[39].getAttribute("d"),
            fdi: el.children[40].getAttribute("d"),
            palmer: el.children[41].getAttribute("d")
          });
      }

      console.log(JSON.stringify(this.SvgTeeth));
    }
  }
};
</script>

<style lang="scss" scoped >
.jaw {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: rgba(white, 0.8);
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
  }
}
</style>
