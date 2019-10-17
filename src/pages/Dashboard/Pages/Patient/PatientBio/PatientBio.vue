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
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'PatientBio',
    components: {
        PatientCard
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`
        })
    }
};
</script>
<style lang="scss">
.text-right {
    display: flex;
}
</style>
