<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item  md-size-100">
                <patient-card button-color="success" />
            </div>
        </div>
    <!-- <jaw-generator /> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { PATIENT_GET } from '@/constants';
import components from '@/components';
import PatientCard from './PatientCard';

export default {
    name: 'PatientBio',
    components: {
        PatientCard,
    // 'patient-card': () => import('./PatientCard'),
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient',
        }),
    },
    created() {
        if (
            this.$route.params.patientID
                && (this.patient.ID === null
                || this.patient.ID !== parseInt(this.$route.params.patientID, 10))
        ) {
            this.$store.dispatch(PATIENT_GET, {
                patientID: this.$route.params.patientID,
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
