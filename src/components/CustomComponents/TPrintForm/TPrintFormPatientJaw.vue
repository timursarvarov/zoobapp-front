<template>
    <div class="print_patient_jaw">
        <jaw
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
            editor: null
        };
    }
};
</script>
