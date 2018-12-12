<template>
  <div class="md-layout">
    <div class="md-layout-item md-layout md-small-size-100 md-size-100">
      <div class="md-layout-item md-layout text-center">

      </div>
    </div>
    <div class="md-layout-item md-size-100">
      <h4 class="card-title">Selected Teeth</h4>
      <md-chips
        v-model="fruits"
        class="md-primary"
      ></md-chips>
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
    name: 'jaw-anamnes',
    props: {
      headerColor: {
        type: String,
        default: '',
      },
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
          "Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo.",
      };
    },
    methods: {
      getClass(headerColor) {
        return `md-card-header-${headerColor}`;
      },
    },
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
