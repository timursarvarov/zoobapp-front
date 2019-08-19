<template>
    <md-dialog
        :md-active.sync="isDialogVisibleL"
        :md-click-outside-to-close="true"
        class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <simple-wizard :finishButtonText="`Save`">
                    <template slot="header">
                        <div class="title md-alignment-center-space-between md-layout md-transparent" >
                            <div v-if="invoiceToCreate.id" class="md-layout-item">
                                Invoice №
                                {{invoiceToCreate.id}}
                            </div>
                            <div v-else class="md-layout-item">
                                New Invoice
                            </div>

                            <div class="md-layout-item">
                                Created Date
                                {{invoiceToCreate.created || new Date()  | moment('ll')}}
                            </div>
                            <div v-if="invoiceToCreate.dueDate" class="md-layout-item">
                                Due Date
                                 {{invoiceToCreate.dueDate | moment('ll')}}
                            </div>
                        </div>
                    </template>
                    <wizard-tab :before-change="() => validateStep('step1')">
                        <template slot="label">Bill</template>
                        <t-add-billing ref="step1"
                            :selectedProcedures="selectedProcedures"
                            :allProcedures="allProcedures"
                            :currencyCode="currencyCode"
                            :invoiceToCreate="invoiceToCreate"
                            @onCreateInvoice="setInvoice"
                        />
                    </wizard-tab>

                    <wizard-tab :before-change="() => validateStep('step2')">
                        <template slot="label">Payment</template>
                        <t-add-payment ref="step2"
                            :currencyCode="currencyCode"
                            :invoice="invoiceToCreate"
                            @on-validated="isDialogVisibleL=false"
                        />
                    </wizard-tab>
                </simple-wizard>
            </div>
        </div>
    </md-dialog>
</template>
<script>
    import { mapGetters } from 'vuex';
    import TAddBilling from './TWizardBillingItems/TAddBilling.vue';
    import TAddPayment from './TWizardBillingItems/TAddPayment.vue';
    
    import { NOTIFY, PATIENT_INVOICE_SET } from '@/constants';
    import { tObjProp } from '@/mixins';

    export default {
        name: 'refistration-wizard',
        mixins: [tObjProp],
        props: {
            isDialogVisible: {
                type: Boolean,
                default: false,
            },
            selectedProcedures: {
                type: Array,
                default: () => [],
            },
            allProcedures: {
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
                    dueDate: null,
                    createdDate: null,
                    discount: null,
                    round: null,
                    tax: null,
                    note: null,
                    total: null,
                    procedures: [],
                    payments: [],
                },
            };
        },
        components: {
            TAddBilling,
            TAddPayment,
            'simple-wizard': () => import('@/components/CustomComponents/TWizard/Wizard'),
        },
        methods: {

            onProcedureAdd(p) {
                this.$emit('onProcedureAdd', p);
            },
            setInvoice(i) {
                this.invoiceToCreate = {
                    ...i,
                    author: {
                        color: this.currentUser.color,
                        avatar: this.currentUser.avatar,
                        firstName: this.currentUser.firstName,
                        lastName: this.currentUser.lastName,
                    },
                };
            },
            saveInvoice() {
                if (this.invoiceToCreate.id) return true;
                // return true;
                return new Promise((resolve, reject) => {
                    this.$store
                        .dispatch(PATIENT_INVOICE_SET, {
                            invoice: this.invoiceToCreate,
                        })
                        .then(
                            (response) => {
                                // this.$router.push('/');
                                this.setInvoice(response);
                                // return true;
                                resolve(true);
                            },
                            (error) => {
                                const err = error.response.data.error;
                                if (err === 'user_name exist') {
                                    this.errorAccount.message = 'Username already exist';
                                    this.errorAccount.exceptions.push(
                                        this.account.username,
                                    );
                                } else {
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message: 'error.response.data.error',
                                            type: 'warning',
                                        },
                                    });
                                }
                                // eslint-disable-next-line
                            reject(false);
                            // return false;
                            },
                        );
                });
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
                        return Promise.resolve(this.saveInvoice());
                        // return res;
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
                        this.isDialogVisibleL = false;
                        return res;
                    });
                }
                return false;
            },
        },
        computed: {
            ...mapGetters({
                currentUser: 'getProfile',
            }),
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
            this.proceduresLocal = this.selectedProcedures;
        },
    };
</script>
