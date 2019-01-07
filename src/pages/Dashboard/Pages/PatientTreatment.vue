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
                      :prefer="'anamnes'"
                      :jaw="jawA"
                      v-model="selectedTeeth"
                    >
                      <div slot="bottom">
                        {{selectedTeeth}}

                        <md-button class="md-simple  jaw-state">
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
                    <md-button @click="Implant(selectedTeeth[0])">Implant</md-button>
                    <!-- <ol
                      v-for="(tooth, toothID) in jaw"
                      :key="toothID"
                      style="max-height:1300px;"
                    >
                      <li
                        v-for="(location, ID) in tooth"
                        :key="ID"
                      >
                        <md-checkbox v-model="jaw[toothID][ID]">{{toothID}} {{ID}}</md-checkbox>
                      </li>
                    </ol> -->

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
                  <div class="md-layout-item   md-small-size-100 md-xsmall-size-100 ">
                    <diagnose
                      :selectedTeeth="selectedTeeth"
                      v-model="selectedDiagnose"
                    ></diagnose>
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
  import { TEETH_INITIATION } from '@/store/modules/constants';

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
        showDialog: false,
        actionSize: {},
        selectedTeeth: [],
        selectedDiagnose: [],
      };
    },
    methods: {
      Implant() {
        console.log(this.selectedTeeth);
        for (let index = 0; index < this.selectedTeeth.length; index += 1) {
          this.jaw.jawAnamnes[this.selectedTeeth[index]].implant = true;
          this.jaw.jawAnamnes[this.selectedTeeth[index]].root = false;
        }
      },
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
    },
    computed: {
      ...mapGetters({
        clinicSettings: 'getClinicSettings',
        toothLocations: 'toothLocations',
        teethBabyBottom: 'teethBabyBottom',
        teethBabyTop: 'teethBabyTop',
        teethBabyAll: 'teethBabyAll',
        teethAll: 'teethAll',
        teethAdultAll: 'teethAdultAll',
        teethAdultTop: 'teethAdultTop',
        teethAdultBottom: 'teethAdultBottom',
        jaw: 'jaw',
      }),
      jawA() {
        return this.jaw;
      },
    },
    created() {
      this.$store.dispatch(TEETH_INITIATION);
    },
  };
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
