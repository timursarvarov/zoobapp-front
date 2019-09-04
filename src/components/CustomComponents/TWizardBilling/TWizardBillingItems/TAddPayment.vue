<template>
    <div class="wizard-tab-content add-payment-form">
        <md-toolbar class="md-transparent">
            <t-toolbar-row
                :headers="headers"
            />
            <div class="md-layout md-layout-item md-size-100 md-alignment-center-space-beetwen">
                <div class="md-layout-item">
                    <md-field
                        :class="[
                            {'with-subline': true},
                            {'md-valid': !errors.has('paymentAmmount') && touched.paymentAmmount},
                            {'md-error': errors.has('paymentAmmount')}]"
                    >
                        <label>Pay {{ currencyCode }}</label>
                        <md-input
                            ref="paymentAmmount"
                            v-model="payment.ammount"
                            v-validate="modelValidations.paymentAmmount"
                            min="0"
                            type="number"
                            data-vv-name="paymentAmmount"
                        />
                        <span class="md-error">{{ errors.first('paymentAmmount') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('paymentAmmount')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="payment.ammount='',focusOn('paymentAmmount')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('paymentAmmount') && touched.paymentAmmount"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">
                                    done
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>
                <div class=" md-inline-checkboxes">
                    <md-checkbox
                        v-model="payment.type"
                        value="cash"
                    >
                        Cash
                    </md-checkbox>
                    <md-checkbox
                        v-model="payment.type"
                        value="card"
                    >
                        Card
                    </md-checkbox>
                    <md-checkbox
                        v-model="payment.type"
                        value="deposit"
                    >
                        Deposit
                    </md-checkbox>
                </div>
                <div
                    class="manipulations-input__action md-alignment-center-right md-layout md-layout-item"
                >
                    <md-button
                        :disabled="!payment.ammount"
                        :class="[{'md-primary': payment.ammount}]"
                        class="md-button md-just-icon md-round"
                        @click="addPayment()"
                    >
                        <md-icon>add</md-icon>
                    </md-button>
                </div>
            </div>
        </md-toolbar>

        <div
            v-if="invoice.payments && invoice.payments.length"
        >
            <div
                class="content-wrapper md-card-plain"
            >
                <md-table
                    v-model="invoice.payments"
                    class="no-header"
                    table-header-color="green"
                >
                    <md-table-row
                        slot="md-table-row"
                        slot-scope="{ item }"
                    >
                        <md-table-cell md-label="Code">
                            <small>{{ item.manipulation.code }}</small>
                        </md-table-cell>
                        <md-table-cell
                            class="manipulation-title"
                            md-label="Title"
                        >
                            <small>{{ item.manipulation.title }}</small>
                        </md-table-cell>
                        <md-table-cell
                            md-label="Qty"
                            class="manipulations-input"
                        >
                            <small>{{ item.num }}</small>
                        </md-table-cell>
                        <md-table-cell>*</md-table-cell>
                        <md-table-cell md-label="Price">
                            <small>{{ (item.price? item.price: 0).toFixed(2) }}</small>
                        </md-table-cell>
                        <md-table-cell md-label="Total">
                            <small>{{ (item.price * item.num).toFixed(2) }} &nbsp;{{ currencyCode }}</small>
                        </md-table-cell>
                    </md-table-row>
                </md-table>
            </div>
            <hr>
            <div class="md-layout">
                <hr class="md-layout-item md-size-100">
                <div
                    style="padding-bottom:22px;"
                    class="md-layout-item md-layout text-right  md-size-100"
                >
                    <div class="md-layout-item ">
                        <p
                            class="category"
                        >
                            <b>Total Sum</b>
                        </p>
                        <h2
                            class="title"
                        >
                            <!-- <animated-number :toFix="2" :value="afterTax" /> -->
                            <small>&nbsp;{{ currencyCode }}</small>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div>
                <md-empty-state
                    md-icon="money_off"
                    md-label="No payments found"
                    md-description=""
                />
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable func-names */
import { SlideYDownTransition } from 'vue2-transitions';
import TToolbarRow from '@/components/CustomComponents/TToolbarRow';
import AnimatedNumber from '@/components/AnimatedNumber';
import { mapGetters } from 'vuex';


export default {
    name: 'TAddPaymentItem',
    components: {
        AnimatedNumber,
        TToolbarRow,
        SlideYDownTransition,
    },
    props: {
        invoice: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            disabledDates: date => date < this.currentDate,
            modelValidations: {
                paymentAmmount: {
                    min: 0,
                },
            },
            payment: {
                ammount: null,
                type: null,
                created: null,
            },
            paymentAmmount: null,
            touched: {
                paymentAmmount: false,
            },
        };
    },
    computed: {
        ...mapGetters({
            patient:'getPatient',
            getManipulationsByProcedureID: 'getManipulationsByProcedureID',
            getManipulationsByProcedureIDs: 'getManipulationsByProcedureIDs',
            getAproovedPlansProcedures: 'getAproovedPlansProcedures',
            clinic: 'getCurrentClinic',
        }),
        currencyCode(){
            return this.clinic.currencyCode
        },
        headers(){
            const headers = [
                {
                    title: 'To Pay',
                    subTitlePrefix: 0,
                    subTitlePostfix: 'procedures',
                    subTitleToFix: 0,
                    valuePrefix: 0,
                    valuePostfix: this.currencyCode,
                    valueToFix: 2,
                },
                {
                    title: 'Discount',
                    subTitlePrefix: 0,
                    subTitlePostfix: '%',
                    subTitleToFix: 0,
                    valuePrefix:  0,
                    valueToFix: 2,
                    valuePostfix: this.currencyCode,
                },
                {
                    title: 'Payments',
                    subTitlePrefix:  0,
                    subTitlePostfix:  '%',
                    subTitleToFix: 0,
                    valuePrefix: 0,
                    valueToFix: 2,
                    valuePostfix:this.currencyCode,
                },
                {
                    title: 'Patient debt',
                    subTitlePrefix: 0,
                    subTitlePostfix: 'manipulations',
                    subTitleToFix: 0,
                    valuePrefix: 0,
                    valueToFix: 2,
                    valuePostfix: this.currencyCode,
                },
            ];
            return headers;
        },
    },
    watch: {
        'invoice.total': function (val) {
            this.payment.ammount = val;
        },
    },
    created() {
        this.payment.ammount = this.invoice.total;
    },
    methods: {
        calculateManipulations(m = []) {
            let sum = 0;
            m.forEach((manip) => {
                sum += manip.price * manip.num;
            });
            return sum;
        },
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$refs[ref].$el.focus();
        },
        validate() {
            this.touched.paymentAmmount = true;
            return this.$validator.validateAll().then((res) => {
                this.$emit('on-validated', res, 'step2');
                this.$emit('validated-code', this.code);
                this.$emit('onCreatePayment', this.invoice);
                return res;
            });
        },
        setProcedureToAdd(procedure) {
            this.procedureToAdd = procedure;
        },
        addPayment() {
            this.$emit('onProcedureAdd', this.procedureToAdd);
        },
    },
};
</script>

<style lang="scss">
.add-payment-form {
    .manipulations-input__action {
        max-width: 70px;
    }
    .total{
        margin-bottom: 20px!important;
    }
}
    .md-datepicker-dialog{
        transform: translate(0, 0);
    }
</style>
