<template>
    <div v-if="patientAnamnesis" :class="[{ 'hide-on-print': !showAnamnes }]" class="print_patient_plan">
        <div class="print_patient_plan__header">
            <h3 :class="[{ hidable__header: !showAnamnes }]" class="print_patient_plan__header_text">
                <div>
                    <b>
                        {{ $t(`${$options.name}.title`) }}
                    </b>
                </div>
            </h3>
            <md-subheader class="hide-on-print-actions">
                {{ $t(`${$options.name}.print`) }} &nbsp;
                <md-checkbox v-model="showAnamnes">{{ $t(`${$options.name}.printAnamnes`) }}</md-checkbox>
                <md-checkbox v-if="showAnamnes" v-model="showProcedures">{{ $t(`${$options.name}.printAnamnesProcedures`) }}</md-checkbox>
                <md-checkbox v-if="showProcedures && showAnamnes" v-model="showManipulations">{{
                    $t(`${$options.name}.printAnamnesManipulations`)
                }}</md-checkbox>
            </md-subheader>
        </div>
        <template v-if="canShowPlan">
            <div class="print_patient_plan__procedure" v-for="(anamnes, index) in patientAnamnesis" :key="index">
                <t-print-form-patient-nosology :showManipulations="showManipulations" :num="index + 1" :procedure-id="anamnes.ID" />
            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'TPrintFormPatientAnamnes',
    props: {},
    data() {
        return {
            editor: null,
            showManipulations: true,
            showProcedures: true,
            showAnamnes: true
        };
    },
    created() {
        if (!this.patientAnamnesis || this.patientAnamnesis.length < 1) {
            this.showProcedures = false;
            this.showAnamnes = false;
        }
    },
    components: {
        't-print-form-patient-nosology': () => import('./TPrintFormPatientNosology')
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            getPatientProcedureByID: `${STORE_KEY_PATIENT}/getPatientProcedureByID`,
            getManipulationsByProcedureID: `${STORE_KEY_PATIENT}/getManipulationsByProcedureID`,
            manipulationsByPlanID: `${STORE_KEY_PATIENT}/getManipulationsByPlanID`,
            patientAnamnesis: `${STORE_KEY_PATIENT}/getPatientAnamnesis`
        }),
        canShowPlan() {
            if (!this.showAnamnes) {
                return false;
            } else if (!this.showProcedures) {
                return false;
            }
            return this.patientAnamnesis && this.patientAnamnesis.length > 0;
        }
    }
};
</script>
