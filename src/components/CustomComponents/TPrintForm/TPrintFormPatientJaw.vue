<template>
    <div class="print_patient_jaw" :class="[{ 'hide-on-print': !showJaw }]">
        <md-subheader class="hide-on-print-actions">
            Print: &nbsp;
            <md-checkbox v-model="showJaw">Jaw</md-checkbox>
        </md-subheader>

        <jaw
            v-if="showJaw"
            printmode
            :age-category="!!patientProps.ageCategory"
            :jaw="patientProps.jaw || {}"
            :patient-items="patientProps.patientItems"
            type="procedures"
        />
    </div>
</template>
<script>
import Jaw from '@/components/CustomComponents/Jaw/Jaw';

export default {
    name: 'TPrintFormPatientBio',
    components: {
        Jaw
    },
    props: {
        patientProps: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            showJaw: true,
            editor: null
        };
    }
};
</script>
