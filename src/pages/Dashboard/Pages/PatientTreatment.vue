<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-60 md-xsmall-size-100 md-size-40" >
        <jaw-card
          header-animation="true">
          <img class="img" slot="imageHeader" src= "/img/card-2.jpg">
          <md-icon slot="fixed-button">build</md-icon>
          <template slot="first-button">
            <md-icon>art_track</md-icon>
            <md-tooltip md-direction="bottom">View</md-tooltip>
          </template>
          <template slot="second-button">
            <md-icon >edit</md-icon>
            <md-tooltip md-direction="bottom">Edit</md-tooltip>
          </template>
          <template slot="third-button">
            <md-icon >close</md-icon>
            <md-tooltip md-direction="bottom">Remove</md-tooltip>
          </template>
          <h4 slot="title" class="title">
            <a href="#pablo">Cozy 5 Stars Apartment</a>
          </h4>
          <div slot="description" class="card-description">
            The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.
          </div>
          <template slot="footer">
            <div class="price">
              <h4>$899/night</h4>
            </div>
            <div class="stats">
              <p class="category">
                <md-icon>place</md-icon>
                Barcelona, Spain
              </p>
            </div>
          </template>
        </jaw-card>
      </div>
      <div class="md-layout-item md-medium-size-40 md-xsmall-size-100 md-size-60">
          <nav-tabs-card>
            <template slot="content">
              <span class="md-nav-tabs-title">Set new:</span>
              <md-tabs md-sync-route :class="['md-' + currentTabColor()]" md-alignment="left">

                <md-tab id="tab-anamnes" to="/patient/treatment/anamnes" md-label="Anamnes" md-icon="history">
                <jaw-anamnes></jaw-anamnes>
                </md-tab>

                <md-tab id="tab-diagnose" to="/patient/treatment/diagnose" md-label="Diagnose" md-icon="create">
                <diagnose></diagnose>
                </md-tab>

                <md-tab id="tab-treatment" to="/patient/treatment/treatment" md-label="Treatment" md-icon="local_hospital">
                
                </md-tab>
                 <md-tab id="tab-history" to="/patient/treatment/history" md-label="History" md-icon="access_time">
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
              <!-- <span class="md-nav-tabs-title">Set new:</span> -->
              <md-tabs md-sync-route :class="['md-' + currentTabColor()]" md-alignment="left">

                <md-tab id="tab-anamnes" to="/patient/treatment/anamnes" md-label="Anamnes" md-icon="history">
                <anamnes-list></anamnes-list>
                </md-tab>

                <md-tab id="tab-diagnose" to="/patient/treatment/diagnose" md-label="Diagnose" md-icon="create">
                <diagnose-list></diagnose-list>
                </md-tab>

                <md-tab id="tab-treatment" to="/patient/treatment/treatment" md-label="Treatment" md-icon="local_hospital">
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
import { JawCard, NavTabsCard } from "@/components";
import {
  JawAnamnes,
  Diagnose,
  DiagnoseList,
  HistoryList,
  TreatmentList,
  AnamnesList
} from "@/pages";
export default {
  components: {
    JawCard,
    NavTabsCard,
    JawAnamnes,
    Diagnose,
    DiagnoseList,
    HistoryList,
    TreatmentList,
    AnamnesList
  },
  methods: {
    currentTabColor: function() {
      let color = "";
      if (this.$route.name == "patient/treatment/anamnes") {
        color = "warning";
      } else if (this.$route.name == "patient/treatment/diagnose") {
        color = "primary";
      } else if (this.$route.name == "patient/treatment/treatment") {
        color = "success";
      } else if (this.$route.name == "patient/treatment/history") {
        color = "info";
      }
      return color;
    }
  }
};
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
