<template>
        <div class="md-layout">
          <div class="md-layout-item md-layout md-small-size-100 md-size-100">
           <div class="md-layout-item md-layout text-center">
            <md-button class="md-simple  anamnes">
              <div>
              <md-icon md-src= "/img/teeth_icons/health_tooth.svg" ></md-icon>
              <small>Helthy</small>
              </div>
            </md-button>
            <md-button class="md-simple  anamnes">
              <div>
              <md-icon md-src= "/img/teeth_icons/root_canal.svg" ></md-icon>
              <small>Pulpit</small>
              </div>
            </md-button>
            <md-button class="md-simple  anamnes">
              <div>
              <md-icon md-src= "/img/teeth_icons/paradontit.svg" ></md-icon>
              <small>Paradontit</small>
              </div>
            </md-button>
            <md-button class="md-simple  anamnes">
              <div>
              <md-icon md-src= "/img/teeth_icons/carries.svg" ></md-icon>
              <small>Carries</small>
              </div>
            </md-button>
            <md-button class="md-simple  anamnes">
              <div>
              <md-icon md-src= "/img/teeth_icons/tooth_extraction.svg" ></md-icon>
              <small>Missed</small>
              </div>
            </md-button>
            <md-button class="md-simple  anamnes">
              <div>
              <md-icon md-src= "/img/teeth_icons/cracked.svg" ></md-icon>
              <small>Cracked</small>
              </div>
            </md-button>
            <md-button class="md-simple md-elevation-5 anamnes">
              <div>
              <md-icon md-src= "/img/teeth_icons/Implant.svg" ></md-icon>
              <small>Other Diseas</small>
              </div>
            </md-button>
          </div>
          </div>
          <div class="md-layout-item md-size-100">
              <h4 class="card-title">Selected Teeth</h4>
              <md-chips v-model="fruits" class="md-primary"></md-chips>
            </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>Diagnose Particularities</label>
              <md-textarea v-model="aboutme"></md-textarea>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success mt-4">Add Diagnose</md-button>
          </div>
    </div>

</template>
<script>
export default {
  name: "jaw-anamnes",
  props: {
    headerColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fruits: [],
      username: null,
      disabled: null,
      emailadress: null,
      lastname: null,
      firstname: null,
      address: null,
      city: null,
      country: null,
      code: null,
      aboutme:
        "Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
    };
  },
  methods: {
    getClass: function(headerColor) {
      return "md-card-header-" + headerColor + "";
    }
  }
};
</script>
<style  lang="scss">
.anamnes {
  min-width: 80px;
  border-radius: 6px;
  .md-ripple {
    padding: 16px 6px !important;
  }
  i {
    height: 30px !important;
  }
}
</style>
