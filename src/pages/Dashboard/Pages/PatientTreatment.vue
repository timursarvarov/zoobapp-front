<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <span class="md-nav-tabs-title">
              Set new:
            </span>
            <md-tabs
              :class="['md-' + currentTabColor()]"
              md-alignment="left"
              md-sync-route
            >
              <md-tab
                id="tab-anamnes"
                md-icon="history"
                md-label="Anamnes"
                to="/patient/treatment/anamnes"
              >
                <div class="md-layout">
                  <div class="md-layout-item  md-small-size-100 md-xsmall-size-100">
                    <jaw
                      background-color="success"
                      slot="jaw"
                      :jaw="jaw"
                    >
                      <div slot="bottom">

                        <md-button class="md-simple  jaw-state  ">
                          <div class="icon-wrapper">
                            <icon-base
                              class="icon-wrapper--item"
                              width="30"
                              height="30"
                              icon-name="icon-root-canal"
                            />
                            <small class="icon-wrapper--item">Pulpit</small>
                          </div>
                        </md-button>

                      </div>
                    </jaw>

                  </div>
                  <div
                    class="md-layout-item  md-small-size-100 md-xsmall-size-100"
                    style="overflow:scroll; height:400px;"
                  >
                    <ol style="max-height:1300px;">
                      <md-checkbox v-model="background">background</md-checkbox>
                      <md-checkbox v-model="bridge">bridge</md-checkbox>
                      <md-checkbox v-model="root">root</md-checkbox>
                      <md-checkbox v-model="rootcanal">rootcanal</md-checkbox>
                      <md-checkbox v-model="implant">implant</md-checkbox>
                      <md-checkbox v-model="coronalingual">coronalingual</md-checkbox>
                      <md-checkbox v-model="coronalingualincisaldistal">coronalingualincisaldistal</md-checkbox>
                      <md-checkbox v-model="coronalingualincisalmiddle">coronalingualincisalmiddle</md-checkbox>
                      <md-checkbox v-model="coronalingualincisionmesial">coronalingualincisionmesial</md-checkbox>
                      <md-checkbox v-model="coronalingualmiddledistal">coronalingualmiddledistal</md-checkbox>
                      <md-checkbox v-model="coronalingualmiddlemiddle">coronalingualmiddlemiddle</md-checkbox>
                      <md-checkbox v-model="coronalingualmiddlemesial">coronalingualmiddlemesial</md-checkbox>
                      <md-checkbox v-model="coronalingualcervicaldistal">coronalingualcervicaldistal</md-checkbox>
                      <md-checkbox v-model="coronalingualcervicalmiddle">coronalingualcervicalmiddle</md-checkbox>
                      <md-checkbox v-model="coronalingualcervicalmesial">coronalingualcervicalmesial</md-checkbox>
                      <md-checkbox v-model="coronalabial">coronalabial</md-checkbox>
                      <md-checkbox v-model="coronalabialincisaldistal">coronalabialincisaldistal</md-checkbox>
                      <md-checkbox v-model="coronalabialincisalmiddle">coronalabialincisalmiddle</md-checkbox>
                      <md-checkbox v-model="coronalabialincisionmesial">coronalabialincisionmesial</md-checkbox>
                      <md-checkbox v-model="coronalabialmiddledistal">coronalabialmiddledistal</md-checkbox>
                      <md-checkbox v-model="coronalabialmiddlemiddle">coronalabialmiddlemiddle</md-checkbox>
                      <md-checkbox v-model="coronalabialmiddlemesial">coronalabialmiddlemesial</md-checkbox>
                      <md-checkbox v-model="coronalabialcervicaldistal">coronalabialcervicaldistal</md-checkbox>
                      <md-checkbox v-model="coronalabialcervicalmiddle">coronalabialcervicalmiddle</md-checkbox>
                      <md-checkbox v-model="coronalabialcervicalmesial">coronalabialcervicalmesial</md-checkbox>
                      <md-checkbox v-model="veneer">veneer</md-checkbox>
                      <md-checkbox v-model="coronatop">coronatop</md-checkbox>
                      <md-checkbox v-model="coronatopbuccal">coronatopbuccal</md-checkbox>
                      <md-checkbox v-model="coronatopmedial">coronatopmedial</md-checkbox>
                      <md-checkbox v-model="coronatoplingual">coronatoplingual</md-checkbox>
                      <md-checkbox v-model="coronatopdistal">coronatopdistal</md-checkbox>
                      <md-checkbox v-model="coronatopoclusial">coronatopoclusial</md-checkbox>
                      <md-checkbox v-model="silant">silant</md-checkbox>
                      <md-checkbox v-model="gum">gum</md-checkbox>
                      <md-checkbox v-model="paradontit1">paradontit1</md-checkbox>
                      <md-checkbox v-model="paradontit2">paradontit2</md-checkbox>
                      <md-checkbox v-model="paradontit3">paradontit3</md-checkbox>
                      <md-checkbox v-model="paradontit4">paradontit4</md-checkbox>
                      <md-checkbox v-model="periodontit">periodontit</md-checkbox>
                      <md-checkbox v-model="universal">universal</md-checkbox>
                      <md-checkbox v-model="fdi">fdi</md-checkbox>
                      <md-checkbox v-model="palmer">palmer</md-checkbox>
                    </ol>

                  </div>

                </div>

                <jaw-anamnes></jaw-anamnes>
              </md-tab>

              <md-tab
                id="tab-diagnose"
                md-icon="create"
                md-label="Diagnose"
                to="/patient/treatment/diagnose"
              >
                <div class="md-layout">
                  <div class="md-layout-item  md-small-size-100 md-xsmall-size-100 md-size-50">

                    <jaw
                      background-color="success"
                      slot="jaw"
                      :jaw="jaw"
                    >
                      <div slot="bottom">

                        <md-button class="md-simple  jaw-state  ">
                          <div class="icon-wrapper">
                            <icon-base
                              class="icon-wrapper--item"
                              width="30"
                              height="30"
                              icon-name="icon-root-canal"
                            />
                            <small class="icon-wrapper--item">Pulpit</small>
                          </div>
                        </md-button>

                      </div>
                    </jaw>
                  </div>
                  <div class="md-layout-item   md-small-size-100 md-xsmall-size-100 ">
                    <diagnose></diagnose>
                  </div>
                </div>

              </md-tab>

              <md-tab
                id="tab-treatment"
                md-label="Treatment"
                to="/patient/treatment/treatment"
              ></md-tab>
              <md-tab
                id="tab-history"
                md-icon="access_time"
                md-label="History"
                to="/patient/treatment/history"
              >
                <history-list></history-list>
              </md-tab>
            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-small-size-100 md-size-50">
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <span class="md-nav-tabs-title">Set new:</span>
            <md-tabs
              :class="['md-' + currentTabColor()]"
              md-alignment="left"
              md-sync-route
            >
              <md-tab
                id="tab-anamnes"
                md-icon="history"
                md-label="Anamnes"
                to="/patient/treatment/anamnes"
              >
                <anamnes-list></anamnes-list>
              </md-tab>

              <md-tab
                id="tab-diagnose"
                md-icon="create"
                md-label="Diagnose"
                to="/patient/treatment/diagnose"
              >
                <diagnose-list></diagnose-list>
              </md-tab>

              <md-tab
                id="tab-treatment"
                md-icon="local_hospital"
                md-label="Treatment"
                to="/patient/treatment/treatment"
              >
                <treatment-list></treatment-list>
              </md-tab>
            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { NavTabsCard, Jaw, IconBase } from '@/components';

  import {
    AnamnesList,
    Diagnose,
    DiagnoseList,
    HistoryList,
    JawAnamnes,
    TreatmentList,
  } from '@/pages';

  export default {
    components: {
      // JawCard,
      Jaw,
      NavTabsCard,
      JawAnamnes,
      Diagnose,
      DiagnoseList,
      HistoryList,
      TreatmentList,
      AnamnesList,
      IconBase,
    },
    data() {
      return {
        background: false,
        bridge: false,
        root: true,
        rootcanal: false,
        coronalingual: true,
        coronalingualincisaldistal: false,
        coronalingualincisalmiddle: false,
        coronalingualincisionmesial: false,
        coronalingualmiddledistal: false,
        coronalingualmiddlemiddle: false,
        coronalingualmiddlemesial: false,
        coronalingualcervicaldistal: false,
        coronalingualcervicalmiddle: false,
        coronalingualcervicalmesial: false,
        coronalabial: true,
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
        coronatop: true,
        coronatopbuccal: false,
        coronatopmedial: false,
        coronatoplingual: false,
        coronatopdistal: false,
        coronatopoclusial: false,
        silant: false,
        gum: true,
        paradontit1: false,
        paradontit2: false,
        paradontit3: false,
        paradontit4: false,
        periodontit: false,
        fdi: true,
        universal: false,
        palmer: false,

        showDialog: false,
        actionSize: {},
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
          75,
        ],
      };
    },
    methods: {
      currentTabColor() {
        let color = '';
        if (this.$route.name === 'patient/treatment/anamnes') {
          color = 'warning';
        } else if (this.$route.name === 'patient/treatment/diagnose') {
          color = 'primary';
        } else if (this.$route.name === 'patient/treatment/treatment') {
          color = 'success';
        } else if (this.$route.name === 'patient/treatment/history') {
          color = 'info';
        }
        return color;
      },
      getJaw() {
        const jaw = {};
        this.teeth.forEach((element) => {
          jaw[element] = {
            bridge: this.bridge,
            root: this.root,
            background: this.background,
            rootcanal: this.rootcanal,
            coronalingual: this.coronalingual,
            coronalingualincisaldistal: this.coronalingualincisaldistal,
            coronalingualincisalmiddle: this.coronalingualincisalmiddle,
            coronalingualincisionmesial: this.coronalingualincisionmesial,
            coronalingualmiddledistal: this.coronalingualmiddledistal,
            coronalingualmiddlemiddle: this.coronalingualmiddlemiddle,
            coronalingualmiddlemesial: this.coronalingualmiddlemesial,
            coronalingualcervicaldistal: this.coronalingualcervicaldistal,
            coronalingualcervicalmiddle: this.coronalingualcervicalmiddle,
            coronalingualcervicalmesial: this.coronalingualcervicalmesial,
            coronalabial: this.coronalabial,
            coronalabialincisaldistal: this.coronalabialincisaldistal,
            coronalabialincisalmiddle: this.coronalabialincisalmiddle,
            coronalabialincisionmesial: this.coronalabialincisionmesial,
            coronalabialmiddledistal: this.coronalabialmiddledistal,
            coronalabialmiddlemiddle: this.coronalabialmiddlemiddle,
            coronalabialmiddlemesial: this.coronalabialmiddlemesial,
            coronalabialcervicaldistal: this.coronalabialcervicaldistal,
            coronalabialcervicalmiddle: this.coronalabialcervicalmiddle,
            coronalabialcervicalmesial: this.coronalabialcervicalmesial,
            implant: this.implant,
            veneer: this.veneer,
            coronatop: this.coronatop,
            coronatopbuccal: this.coronatopbuccal,
            coronatopmedial: this.coronatopmedial,
            coronatoplingual: this.coronatoplingual,
            coronatopdistal: this.coronatopdistal,
            coronatopoclusial: this.coronatopoclusial,
            silant: this.silant,
            gum: this.gum,
            paradontit1: this.paradontit1,
            paradontit2: this.paradontit2,
            paradontit3: this.paradontit3,
            paradontit4: this.paradontit4,
            periodontit: this.periodontit,
            fdi: this.fdi,
            universal: this.universal,
            palmer: this.palmer,
          };
        });
        return jaw;
      },
    },
    computed: {
      ...mapGetters({
        clinicSettings: 'getClinicSettings',
      }),
      jaw() {
        return this.getJaw();
      },
    },
    mounted() {
      // eslint-disable-next-line
    // this.actionSize = {
      //     height: this.$refs.jawstate.clientHeight,
      //     width: this.$refs.jawstate.clientWidth,
      //   };
      // this.getJaw();
    },
  };
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
