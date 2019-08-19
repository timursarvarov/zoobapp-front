<template>
  <div>
    <div class="header text-center">
      <h3 class="title">World Map</h3>
      <p class="category">Looks great on any resolution.
        Made by our friends from
        <a
          href="https://jvectormap.com/"
          target="_blank"
        >jVector Map</a>.
      </p>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <md-card class="md-card-plain">
          <md-card-content>
            <async-world-map
              class="map map-big"
              :data="mapData"
            ></async-world-map>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
    import components from '@/components';

    export default {
      name: 'vector-maps',
        components: {
            ...components,
        },
        data() {
            return {
                mapData: {
                    AU: 760,
                    BR: 550,
                    CA: 120,
                    DE: 1300,
                    FR: 540,
                    GB: 690,
                    GE: 200,
                    IN: 200,
                    RO: 600,
                    RU: 300,
                    US: 2920,
                },
            };
        },
    };
</script>
<style scoped>
.text-center {
  text-align: center;
}
#worldMap {
  width: 100%;
}
</style>
