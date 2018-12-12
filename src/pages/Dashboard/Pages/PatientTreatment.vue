<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-60">

        <jaw-card header-animation="true">
          <img
            class="img"
            slot="imageHeader"
            src="/img/card-2.jpg"
          >
          <md-icon slot="fixed-button">build</md-icon>
          <template slot="first-button">
            <md-icon>art_track</md-icon>
            <md-tooltip md-direction="bottom">View</md-tooltip>
          </template>
          <template slot="second-button">
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="bottom">Edit</md-tooltip>
          </template>
          <template slot="third-button">
            <md-icon>close</md-icon>
            <md-tooltip md-direction="bottom">Remove</md-tooltip>
          </template>
          <h4
            class="title"
            slot="title"
          >
            <a href="#pablo">Cozy 5 Stars Apartment</a>
          </h4>
          <div
            class="card-description"
            slot="description"
          >
            The place is close to Barceloneta
            Beach and bus stop just 2 min
            by walk and near to "Naviglio"
            where you can enjoy the main night life in Barcelona.
          </div>
          <template slot="footer">
            <div class="price">
              <h4>$899/night</h4>
            </div>
            <div class="stats">
              <p class="category">
                <md-icon>place</md-icon>Barcelona, Spain
              </p>
            </div>
          </template>
        </jaw-card>
      </div>
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-40">
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

                <jaw-anamnes></jaw-anamnes>
              </md-tab>

              <md-tab
                id="tab-diagnose"
                md-icon="create"
                md-label="Diagnose"
                to="/patient/treatment/diagnose"
              >
                <diagnose></diagnose>
              </md-tab>

              <md-tab
                id="tab-treatment"
                md-icon="local_hospital"
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
  import { NavTabsCard, JawCard } from '@/components';
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
      JawCard,
      NavTabsCard,
      JawAnamnes,
      Diagnose,
      DiagnoseList,
      HistoryList,
      TreatmentList,
      AnamnesList,
    },
    data() {
      return {
        showDialog: false,
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
    },
  };
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
