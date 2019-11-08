<template>
    <div v-if="patientDiagnosis" :class="[{ 'hide-on-print': !showDiagnose }]" class="print_patient_plan">
        <div class="print_patient_plan__header">
            <h3 :class="[{ hidable__header: !showDiagnose }]" class="print_patient_plan__header_text">
                <div>
                    <b>
                        {{ $t(`${$options.name}.title`) }}
                    </b>
                </div>
            </h3>
            <md-subheader class="hide-on-print-actions">
                {{ $t(`${$options.name}.print`) }} &nbsp;
                <md-checkbox v-model="showDiagnose">{{ $t(`${$options.name}.printDiagnose`) }}</md-checkbox>
                <md-checkbox v-if="showDiagnose" v-model="showProcedures">{{ $t(`${$options.name}.printDiagnoseProcedures`) }}</md-checkbox>
                <!--                <md-checkbox v-if="showProcedures && showDiagnose" v-model="showManipulations">{{-->
                <!--                    $t(`${$options.name}.printDiagnoseManipulations`)-->
                <!--                }}</md-checkbox>-->
            </md-subheader>
        </div>
        <template v-if="canShowPlan">
            <div class="print_patient_plan__procedure" v-for="(diagnose, index) in patientDiagnosis" :key="index">
                <t-print-form-patient-nosology
                    :showManipulations="showManipulations"
                    :num="index + 1"
                    :procedure-id="diagnose.ID"
                    currentType="diagnose"
                />
            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'TPrintFormPatientDiagnosis',
    props: {},
    data() {
        return {
            editor: null,
            showManipulations: true,
            showProcedures: true,
            showDiagnose: true
        };
    },
    created() {
        if (!this.patientDiagnosis || this.patientDiagnosis.length < 1) {
            this.showProcedures = false;
            this.showDiagnose = false;
        }
    },
    components: {
        't-print-form-patient-nosology': () => import('./TPrintFormPatientNosology')
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patientDiagnosis: `${STORE_KEY_PATIENT}/getPatientDiagnosis`
        }),
        canShowPlan() {
            if (!this.showDiagnose) {
                return false;
            } else if (!this.showProcedures) {
                return false;
            }
            return this.patientDiagnosis && this.patientDiagnosis.length > 0;
        }
    }
};
</script>
