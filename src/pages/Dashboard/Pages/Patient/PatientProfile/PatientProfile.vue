<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item  md-size-100">
        <patient-card button-color="success">

        </patient-card>
      </div>
    </div>
    <!-- <jaw-generator /> -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { PatientCard } from '@/pages';
  import { PATIENT_GET } from '@/constants';
  // import { JawGenerator } from '@/components';

  export default {
    components: {
      PatientCard,
    // JawGenerator,
    },
    computed: {
      ...mapGetters({
        patient: 'getPatient',
      }),
    },
    created() {
      if (
        this.$route.params.patientId
        && (this.patient.ID === null
        || this.patient.ID !== parseInt(this.$route.params.patientId, 10))
      ) {
        this.$store.dispatch(PATIENT_GET, {
          patientId: this.$route.params.patientId,
        });
      }
    },
  };
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
