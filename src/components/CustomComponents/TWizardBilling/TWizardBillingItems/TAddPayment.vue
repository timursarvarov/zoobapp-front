<template>
    <div class="wizard-tab-content add-payment-form">
        <div class="absolute-header-block">
            <md-toolbar class="toolbar-jaw  md-layout md-alignment-center-space-between md-transparent">
                 <div class="md-layout-item md-size-25 md-mediumыдф-size-50 ">
                    <p
                        class="category"
                    >
                        <b>To Pay</b>
                    </p>
                    <h3  v-if="invoice.total"
                        class="title"
                    >
                        <animated-number :toFix="2" :value="invoice.total" />
                        <small>&nbsp;{{currencyCode}}</small>
                    </h3>
                </div>
                 <div class="md-layout-item md-size-25 md-mediumыдф-size-50 text-right">
                    <p
                        class="category"
                    >
                        <b>Payments</b>
                    </p>
                    <h3  v-if="invoice.payments"
                        class="title"
                    >
                        <animated-number :value="invoice.payments.length" />
                    </h3>
                </div>
                 <div class="md-layout-item md-size-25 md-mediumыдф-size-50 text-right">
                    <p
                        class="category"
                    >
                        <b>Payments Sum</b>
                    </p>
                    <h3  v-if="invoice.payments"
                        class="title"
                    >
                        <animated-number :value="invoice.payments.length" />
                    </h3>
                </div>
                 <div class="md-layout-item md-size-25 md-mediumыдф-size-50 text-right">
                    <p
                        class="category"
                    >
                        <b>Customer debt</b>
                    </p>
                    <h3  v-if="invoice.total"
                        class="title"
                    >
                        <animated-number :toFix="2" :value="invoice.total" />
                        <small>&nbsp;{{currencyCode}}</small>
                    </h3>
                </div>
                <div class="md-layout md-layout-item md-size-100 md-alignment-center-space-beetwen">
                    <div class="md-layout-item">
                        <md-field
                                :class="[
                                        {'with-subline': true},
                                        {'md-valid': !errors.has('paymentAmmount') && touched.paymentAmmount},
                                        {'md-error': errors.has('paymentAmmount')}]"
                            >
                            <label>Pay {{currencyCode}}</label>
                            <md-input
                                min="0"
                                v-model="payment.ammount"
                                ref="paymentAmmount"
                                type="number"
                                data-vv-name="paymentAmmount"
                                v-validate="modelValidations.paymentAmmount"
                            ></md-input>
                            <span class="md-error">{{errors.first('paymentAmmount')}}</span>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="errors.has('paymentAmmount')"
                                    @click="payment.ammount='',focusOn('paymentAmmount')"
                                    class="md-button md-icon-button md-dense md-input-action"
                                >
                                    <md-icon class="error">close</md-icon>
                                </md-button>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="!errors.has('paymentAmmount')  && touched.paymentAmmount"
                                    class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                >
                                    <md-icon class="success">done</md-icon>
                                </md-button>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <div class=" md-inline-checkboxes">
                        <md-checkbox value="cash" v-model="payment.type" >
                            Cash
                        </md-checkbox>
                        <md-checkbox value="card" v-model="payment.type" >
                            Card
                        </md-checkbox>
                        <md-checkbox value="deposit" v-model="payment.type" >
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
        </div>
        <div v-if="invoice.payments" class="content-wrapper md-card-plain">
            <md-table
                        v-model="invoice.payments"
                        class="no-header"
                        table-header-color="green"
                    >
                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                            <md-table-cell md-label="Code">
                                <small>{{ item.manipulation.code }}</small>
                            </md-table-cell>
                            <md-table-cell class="manipulation-title" md-label="Title">
                                <small>{{ item.manipulation.title }}</small>
                            </md-table-cell>
                            <md-table-cell md-label="Qty" class="manipulations-input">
                                <small>{{item.num}}</small>
                            </md-table-cell>
                            <md-table-cell>*</md-table-cell>
                            <md-table-cell md-label="Price">
                                <small>{{ (item.price? item.price: 0).toFixed(2) }}</small>
                            </md-table-cell>
                            <md-table-cell md-label="Total">
                                <small>{{ (item.price * item.num).toFixed(2) }} &nbsp;{{currencyCode}}</small>
                            </md-table-cell>
                        </md-table-row>
                    </md-table>
        </div>
        <hr/>
        <div class="md-layout" >
            <hr class="md-layout-item md-size-100"/>
            <div style="padding-bottom:22px;" class="md-layout-item md-layout text-right  md-size-100">
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
                        <small>&nbsp;{{currencyCode}}</small>
                    </h2>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable func-names */
    import { SlideYDownTransition } from 'vue2-transitions';


    export default {
        name: 't-add-billing-item',
        components: {
            'animated-number': () => import('@/components/AnimatedNumber'),
            // TAutoComplite,
            SlideYDownTransition,
        },
        props: {
            invoice: {
                type: Object,
                default: () => {},
            },
            currencyCode: {
                type: String,
                default: () => '',
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
        computed: {

        },
        created() {
            this.payment.ammount = this.invoice.total;
        },
        watch: {
            'invoice.total': function (val) {
                this.payment.ammount = val;
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
