<template>
    <div class="print_patient_jaw" :class="[{ 'hide-on-print': !showJaw }]">
        <md-subheader class="hide-on-print-actions">
            {{ $t(`${$options.name}.print`) }}: &nbsp;
            <md-checkbox v-model="showJaw">{{ $t(`${$options.name}.jaw`) }}</md-checkbox>
        </md-subheader>

        <jaw
            v-if="showJaw"
            printMode
            :age-category="!!patientProps.ageCategory"
            :jaw="patientProps.jaw || {}"
            :patient-items="patientProps.patientItems"
            type="procedures"
        />
    </div>
</template>
<script>
import Jaw from '../Jaw/Jaw';

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
