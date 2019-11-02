<template>
    <div>
        <div class="print-form__page__block">
            <t-print-form-patient-jaw :patient-props="patientProps" />
        </div>
        <t-print-form-patient-treatment />
        <t-print-form-patient-anamnesis />
        <t-print-form-patient-diagnosis />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'PrintFormPatient',
    components: {
        't-print-form-patient-jaw': () => import('./TPrintFormPatientJaw'),
        't-print-form-patient-diagnosis': () => import('./TPrintFormPatientDiagnosis.vue'),
        't-print-form-patient-anamnesis': () => import('./TPrintFormPatientAnamnesis.vue'),
        't-print-form-patient-treatment': () => import('./TPrintFormPatientTreatment')
    },
    data() {
        return {
            showManipulationsGlobal: true,
            selectedPlans: []
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            getApprovedPlansIDs: `${STORE_KEY_PATIENT}/getApprovedPlansIDs`
        }),
        patientProps() {
            const props = {
                patientItems: {
                    diagnosis: this.patient.diagnosis,
                    procedures: this.currentPlanProcedures,
                    anamnesis: this.patient.anamnesis
                },
                type: 'procedures',
                ageCategory: this.patient.ageCategory,
                jaw: this.patient.jaw
            };
            return props;
        }
    },
    created() {
        if (this.patient.plans) {
            this.selectedPlans = this.lodash.clone(Object.keys(this.patient.plans));
            // this.selectedPlans = this.getApprovedPlansIDs;
        }
    }
};
</script>
