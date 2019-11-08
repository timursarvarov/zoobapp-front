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
                <div class="price-sum" v-if="procedure.summary">
                    {{  procedure.summary.totalPrice | currency }}
                </div>
            </div>
        </div>
        <div v-if="procedure.teeth && Object.keys(procedure.teeth).length > 0" class="teeth-block">
            <div class="teeth-block__title">{{ $tc(`${$options.name}.teeth`, Object.keys(procedure.teeth).length) }}:</div>
            <div class="teeth-block__teeth">
                <span v-for="(toothID, toothKey) in procedure.teeth" :key="toothKey" class="tooth procedures">
                    <small>{{ toothKey | toCurrentTeethSystem }}</small>
                </span>
            </div>
        </div>
        <div v-if="showManipulations" class="print-patient-procedure_manipulations">
            <div class="print-patient-procedure_manipulations__row" v-for="(manipulationID, mInd) in procedure.manipulations" :key="manipulationID">
                <template v-if="allManipulations[manipulationID]">
                    <div class="manipulation manipulation_num">
                        <small>{{ mInd + 1 }}</small>
                    </div>
                    <div class="manipulation manipulation_title">
                        <small>
                            <span>{{ allManipulations[manipulationID].code }} - &nbsp;</span>
                            {{ allManipulations[manipulationID].title }}
                        </small>
                    </div>
                    <div class="manipulation manipulation_qty">
                        <small>{{ allManipulations[manipulationID].qty }}</small>
                    </div>
                    <div class="manipulation manipulation_ac">*</div>
                    <div class="manipulation manipulation_price">
                        <small>{{ allManipulations[manipulationID].price | currency('') }}</small>
                    </div>
                    <div class="manipulation manipulation_total">
                        <small>{{ allManipulations[manipulationID].totalPrice | currency }} </small>
                    </div>
                </template>
            </div>
        </div>
        <div v-if="procedure.description" class="description-wrapper">
            <small>
                <div v-html="procedure.description" class="print-patient-procedure_description"></div>
            </small>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'TPrintFormPatientNosology',
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
        },
        currentType: {
            type: String,
            default: () => 'procedures'
        }
    },
    data() {
        return {
            editor: null
        };
    },
    computed: {
        ...mapGetters({
            getPatientProcedureByID: `${STORE_KEY_PATIENT}/getPatientProcedureByID`,
            getPatientDiagnosisByID: `${STORE_KEY_PATIENT}/getPatientDiagnosisByID`,
            allManipulations: `${STORE_KEY_PATIENT}/getAllManipulations`,
        }),
        procedure() {
            if (this.currentType === 'diagnose') {
                return this.getPatientDiagnosisByID(this.procedureId) || {};
            }
            return this.getPatientProcedureByID(this.procedureId) || {};
        },
    },
    methods: {}
};
</script>
