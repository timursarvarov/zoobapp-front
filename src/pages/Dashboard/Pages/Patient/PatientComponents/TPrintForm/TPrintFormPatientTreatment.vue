<template>
    <div class="print_patient_plan">
        <div class="print_patient_plan__header">
            <h3 :class="[{ hidable__header: !showProcedures }]" class="print_patient_plan__header_text">
                <div>
                    <b>
                        {{ $t(`${$options.name}.title`) }}
                    </b>
                </div>
            </h3>
            <md-subheader class="hide-on-print-actions">
                {{ $t(`${$options.name}.print`) }}: &nbsp;
                <md-checkbox v-model="showProcedures">{{ $t(`${$options.name}.treatment`) }}</md-checkbox>
            </md-subheader>
        </div>
        <template v-if="showProcedures">
            <t-print-form-patient-plan v-for="(planID, i) in selectedPlans" :planID="planID" :num="i" :key="i"
                >-->
                <template slot="procedures" slot-scope="{ procedureId, index, showManipulations }">
                    <t-print-form-patient-nosology
                        :showManipulations="showManipulationsGlobal && showManipulations"
                        :num="index + 1"
                        :procedure-id="procedureId"
                    />
                </template>
            </t-print-form-patient-plan>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'TPrintFormPatientTreatment',
    components: {
        't-print-form-patient-plan': () => import('./TPrintFormPatientPlan'),
        't-print-form-patient-nosology': () => import('./TPrintFormPatientNosology')
    },
    props: {
        // planID: {
        //     type: String,
        //     default: () => 0
        // },
        num: {
            type: Number,
            default: () => 0
        }
    },
    data() {
        return {
            showProcedures: true,
            showManipulationsGlobal: true,
            selectedPlans: []
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            getPatientProcedureByID: `${STORE_KEY_PATIENT}/getPatientProcedureByID`,
            getManipulationsByProcedureID: `${STORE_KEY_PATIENT}/getManipulationsByProcedureID`,
            manipulationsByPlanID: `${STORE_KEY_PATIENT}/getManipulationsByPlanID`,
            getApprovedPlansIDs: `${STORE_KEY_PATIENT}/getApprovedPlansIDs`
        })
    },
    created() {
        if (this.patient.plans) {
            this.selectedPlans = this.lodash.clone(Object.keys(this.patient.plans));
            // this.selectedPlans = this.getApprovedPlansIDs;
        }
    }
};
</script>
