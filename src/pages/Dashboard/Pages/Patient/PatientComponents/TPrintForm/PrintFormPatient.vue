<template>
    <div>
        <div class="print-form__page__block">
            <t-print-form-patient-jaw :patient-props="patientProps" />
        </div>
        <t-print-form-patient-procedures

            />
<!--        <t-print-form-patient-plan v-for="(planID, i) in selectedPlans" :planID="planID" :num="i" :key="i">-->
<!--            <template slot="procedures" slot-scope="{ procedureId, index, showManipulations }">-->
<!--                <t-print-form-patient-procedure-->
<!--                    :showManipulations="showManipulationsGlobal && showManipulations"-->
<!--                    :num="index + 1"-->
<!--                    :procedure-id="procedureId"-->
<!--                />-->
<!--            </template>-->
<!--        </t-print-form-patient-plan>-->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TPrintFormPatientJaw from './TPrintFormPatientJaw';
import TPrintFormPatientPlan from './TPrintFormPatientPlan';
import TPrintFormPatientProcedure from './TPrintFormPatientProcedure';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'PrintFormPatient',
    components: {
        TPrintFormPatientJaw,
        TPrintFormPatientPlan,
        TPrintFormPatientProcedure,
        't-print-form-patient-procedures': () => import('./TPrintFormPatientProcedures')
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
