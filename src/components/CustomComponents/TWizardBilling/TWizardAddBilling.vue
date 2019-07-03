<template>
    <md-dialog :md-active.sync="isDialogVisibleL" class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard :finishButtonText="`Save`">
                    <template slot="header">
                        <div class="title md-alignment-center-space-between md-layout md-transparent" >

                            <div class="md-layout-item">
                                Invoice №
                            </div>

                            <div class="md-layout-item">
                                Created Date
                            </div>
                            <div class="md-layout-item">
                                Due Date
                            </div>
                        </div>
                    </template>
                    <wizard-tab :before-change="() => validateStep('step1')">
                        <template slot="label">Bill</template>
                        <t-add-billing ref="step1"
                            :procedures="procedures"
                            :currencyCode="currencyCode"
                        />
                    </wizard-tab>

                    <wizard-tab :before-change="() => validateStep('step2')">
                        <template slot="label">Payment</template>
                        <t-add-payment ref="step2"
                            :currencyCode="currencyCode"
                            @on-validated="isDialogVisibleL=false"
                        />
                    </wizard-tab>
                </simple-wizard>
            </div>
        </div>
    </md-dialog>
</template>
<script>
    import TAddBilling from './TWizardBillingItems/TAddBilling.vue';
    import TAddPayment from './TWizardBillingItems/TAddPayment.vue';
    import { SimpleWizard, WizardTab } from '@/components';
    import { mapGetters } from 'vuex';
    import { NOTIFY, PATIENT_SUB_PARAM_SET } from '@/constants';
    import { tObjProp } from '@/mixins';

    export default {
        name: 'refistration-wizard',
        mixins: [tObjProp],
        props: {
            isDialogVisible: {
                type: Boolean,
                default: false,
            },
            procedures: {
                type: Array,
                default: () => [],
            },
            invoiceToEdit: {
                type: Array,
                default: () => [],
            },
            currencyCode: {
                type: String,
                default: () => '',
            },
        },
        data() {
            return {
                invoiceToCreate: {
                    teeth: {},
                    description: '',
                    manipulations: [],
                    code: '',
                    title: '',
                    proceduresLocal: [],
                },
            };
        },
        components: {
            SimpleWizard,
            WizardTab,
            TAddBilling,
            TAddPayment,
        },
        methods: {
            saveInvoice(i) {
                this.$store.dispatch(PATIENT_SUB_PARAM_SET, {
                    params: {
                        field: 'invoces',
                        value: i,
                        action: 'unshift',
                    },
                }).then(resp => resp);
            },
            validateStep(ref) {
                if (ref === 'step1') {
                    if (!this.$refs[ref]) return false;
                    return this.$refs[ref].validate().then((res) => {
                        if (!res) {
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: 'Please choose diseas locations',
                                    type: 'warning',
                                },
                            });
                        }
                        const nInvoice = this.saveInvoice(res);
                        return nInvoice;
                    });
                }
                if (ref === 'step2') {
                    if (!this.$refs[ref]) return false;
                    return this.$refs[ref].validate().then((res) => {
                        if (!res) {
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: 'Please add manipulation',
                                    type: 'warning',
                                },
                            });
                            return false;
                        }
                        console.log('step2');
                        this.isDialogVisibleL = false;
                        return res;
                    });
                }
                return false;
            },
        },
        computed: {
            ...mapGetters({}),
            isDialogVisibleL: {
                get() {
                    return this.isDialogVisible;
                },
                set(value) {
                    this.$emit('update:isDialogVisible', value);
                },
            },
        },
        created() {
            this.proceduresLocal = this.procedures;
        },
    };
</script>
