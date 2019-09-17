<template>
    <div v-if="plan" :class="[{ 'hide-on-print': !showPlan }]" class="print_patient_plan">
        <div class="print_patient_plan__header">
            <h4 :class="[{ 'hidable__header': !showPlan }]"
                class="print_patient_plan__header_text">
                <div>
                    <b>
                        {{ num + 1 }}&nbsp;
                        {{ plan.name }}
                    </b>
                </div>
                <div>
                    <b>{{ getPlanTotalPrice(plan.ID) }}</b>
                </div>
            </h4>
            <md-subheader class="hide-on-print-actions">
                Print: &nbsp;
                <md-checkbox v-model="showPlan">Plan</md-checkbox>
                <md-checkbox v-if="showPlan" v-model="showProcedures">Procedures</md-checkbox>
                <md-checkbox v-if="showProcedures && showPlan" v-model="showManipulations">Mainpulations</md-checkbox>
            </md-subheader>
        </div>
        <template v-if="canShowPlan">
            <div class="print_patient_plan__procedure" v-for="(procedureId, index) in plan.procedures" :key="index">
                <slot name="procedures" :procedureId="procedureId" :index="index" :showManipulations="showManipulations" />
            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'TPrintFormPatientPlan',
    props: {
        planID: {
            type: String,
            default: () => 0
        },
        num: {
            type: Number,
            default: () => 0
        }
    },
    data() {
        return {
            editor: null,
            showManipulations: true,
            showProcedures: true,
            showPlan: true
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patient: 'getPatient',
            getPatientProcedureByID: 'getPatientProcedureByID',
            getManipulationsByProcedureID: 'getManipulationsByProcedureID',
            manipulationsByPlanID: 'getManipulationsByPlanID'
        }),
        canShowPlan() {
            if (!this.showPlan) {
                return false;
            } else if (!this.showProcedures) {
                return false;
            }
            return this.plan.procedures && this.plan.procedures.length > 0;
        },
        procedure() {
            return this.getPatientProcedureByID(this.procedureId);
        },
        plan() {
            if (this.patient.plans && Object.keys(this.patient.plans).length > 0) {
                return this.patient.plans[this.planID];
            }
            return null;
        }
    },
    methods: {
        getPlanTotalPrice(planID) {
            const totalPrice = this.manipulationsByPlanID(planID).reduce((a, b) => a + (b.totalPrice || 0), 0);
            return totalPrice
                ? ` ${totalPrice.toFixed(2)} ${this.currentClinic.currencyCode}`
                : ` ${(0).toFixed(2)} ${this.currentClinic.currencyCode}`;
        }
    }
};
</script>
