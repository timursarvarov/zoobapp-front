<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item  md-size-100">
                <patient-card button-color="success" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PatientCard from './PatientCard';

export default {
    name: 'PatientBio',
    components: {
        PatientCard
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient'
        })
    }
};
</script>
<style lang="scss">
.text-right {
    display: flex;
}
</style>
