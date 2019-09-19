<template>
    <div class="print-patient-procedure">
        <div class="print-patient-procedure_header">
            <div class="print-patient-procedure_header__num">
                <b>{{ num }}</b>
            </div>
            <div class="print-patient-procedure_header__title">
                <div>
                    <div class="title-text">
                        <span v-if="procedure.code">{{ procedure.code }} - </span>
                        {{ procedure.title }}
                    </div>
                </div>
                &nbsp;
                <div class="title-date">
                    <small>{{ procedure.created | moment('YYYY/MMMM/D') }}</small>
                </div>
            </div>
            <div class="print-patient-procedure_header__price">
                <div class="price-sum">
                    {{ procedurePrice }}
                    &nbsp;{{ currencyCode }}
                </div>
            </div>
        </div>
        <div v-if="procedure.teeth && Object.keys(procedure.teeth).length > 0" class="teeth-block">
            <div class="teeth-block__title">
                Teeth:&nbsp;
                <span>
                    <b> {{ Object.keys(procedure.teeth).length }} </b>
                </span>
            </div>
            <div class="teeth-block__teeth">
                <span v-for="(toothID, toothKey) in procedure.teeth" :key="toothKey" class="tooth procedures">
                    <small>{{ toothKey | toCurrentTeethSystem }}</small>
                </span>
            </div>
        </div>
        <div v-if="showManipulations" class="print-patient-procedure_manipulations">
            <div class="print-patient-procedure_manipulations__row" v-for="(manip, mInd) in getManipulationsByProcedureID(procedure.ID)" :key="mInd">
                <div class="manipulation manipulation_num">
                    <small>{{ mInd + 1 }}</small>
                </div>
                <div v-if="manip.code" class="manipulation manipulation_code">
                    <small>{{ manip.code }} - </small>
                </div>
                <div class="manipulation manipulation_title">
                    <small>{{ manip.title }}</small>
                </div>
                <div class="manipulation manipulation_qty">
                    <small>{{ manip.qty }}</small>
                </div>
                <div class="manipulation manipulation_ac">*</div>
                <div class="manipulation manipulation_price">
                    <small>{{ (manip.price ? manip.price : 0).toFixed(2) }}</small>
                </div>
                <div class="manipulation manipulation_total">
                    <small>{{ manip.totalPrice.toFixed(2) }} &nbsp;{{ currencyCode }}</small>
                </div>
            </div>
        </div>
        <div v-html="procedure.description" class="print-patient-procedure_description" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'TPrintFormPatientProcedure',
    props: {
        procedureId: {
            type: Number,
            default: () => 0
        },
        num: {
            type: Number,
            default: () => 0
        },
        showManipulations: {
            type: Boolean,
            default: () => true
        }
    },
    data() {
        return {
            editor: null
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patient: 'getPatient',
            getPatientProcedureByID: 'getPatientProcedureByID',
            getManipulationsByProcedureID: 'getManipulationsByProcedureID'
        }),
        procedure() {
            return this.getPatientProcedureByID(this.procedureId) || {};
        },
        currencyCode() {
            return this.currentClinic.currencyCode;
        },
        procedurePrice() {
            let price = this.getManipulationsByProcedureID(this.procedureId).reduce((a, b) => a + b.totalPrice, 0);
            return price;
        }
    },
    methods: {}
};
</script>
