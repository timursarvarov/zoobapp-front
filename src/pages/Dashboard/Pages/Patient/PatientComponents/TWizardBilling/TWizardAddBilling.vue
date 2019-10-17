<template>
    <md-dialog :md-active.sync="isDialogVisibleL" :md-click-outside-to-close="true" class="jaw-dialog-wrapper">
        <div class="wizard-add-diagnose-form">
            <div>
                <wizard :finish-button-text="`Save`">
                    <template slot="header">
                        <div class="title md-alignment-center-space-between md-layout md-transparent">
                            <div v-if="invoiceToCreate.ID" class="md-layout-item">
                                Invoice №
                                {{ invoiceToCreate.ID }}
                            </div>
                            <div v-else class="md-layout-item">
                                New Invoice
                            </div>

                            <div class="md-layout-item">
                                Created Date
                                {{ invoiceToCreate.created || new Date() | moment('ll') }}
                            </div>
                            <div v-if="invoiceToCreate.dueDate" class="md-layout-item">
                                Due Date
                                {{ invoiceToCreate.dueDate | moment('ll') }}
                            </div>
                        </div>
                    </template>
                    <wizard-tab :before-change="() => validateStep('step1')">
                        <template slot="label">
                            Bill
                        </template>
                        <t-add-billing
                            ref="step1"
                            v-model="selectedProceduresL"
                            :all-procedures="allProcedures"
                            :currency-code="currencyCode"
                            :invoice-to-create="invoiceToCreate"
                            @onCreateInvoice="setInvoice"
                        />
                    </wizard-tab>

                    <wizard-tab :before-change="() => validateStep('step2')">
                        <template slot="label">
                            Payment
                        </template>
                        <t-add-payment
                            ref="step2"
                            :currency-code="currencyCode"
                            :invoice="invoiceToCreate"
                            @on-validated="isDialogVisibleL = false"
                        />
                    </wizard-tab>
                </wizard>
            </div>
        </div>
    </md-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
import TAddBilling from './TWizardBillingItems/TAddBilling';
import TAddPayment from './TWizardBillingItems/TAddPayment';
import components from '@/components';

import { NOTIFY, PATIENT_INVOICE_SET } from '@/constants';

export default {
    name: 'AddBillingWizard',
    components: {
        TAddBilling,
        TAddPayment,
        ...components
    },
    props: {
        isDialogVisible: {
            type: Boolean,
            default: false
        },
        selectedProcedures: {
            type: Array,
            default: () => []
        },
        allProcedures: {
            type: Array,
            default: () => []
        },
        invoiceToEdit: {
            type: Array,
            default: () => []
        },
        currencyCode: {
            type: String,
            default: () => ''
        }
    },
    data() {
        return {
            invoiceToCreate: {
                dueDate: null,
                createdDate: null,
                discount: null,
                tax: null,
                note: null,
                total: null,
                procedures: [],
                payments: []
            },
            selectedProceduresToCreate: []
        };
    },
    computed: {
        ...mapGetters({
            currentUser: 'getProfile'
        }),
        isDialogVisibleL: {
            get() {
                return this.isDialogVisible;
            },
            set(value) {
                this.$emit('update:isDialogVisible', value);
            }
        },
        selectedProceduresL: {
            get() {
                return this.selectedProceduresToCreate;
            },
            set(newValue) {
                const newProcedure = {
                    ...newValue,
                    justAdded: true
                };
                this.selectedProceduresToCreate.unshift(newProcedure);
                this.deleteJustAddedstyleInterval(newProcedure);
            }
        },
        newProceduresToAssociate() {
            if (!this.invoice.procedures) return [];
            return this.invoice.procedures.filter(pID => this.getUnbilledAndApprovedPlansProcedures.find(uP => uP.ID === pID));
        }
    },
    created() {
        this.selectedProceduresToCreate = this.lodash.cloneDeep(this.selectedProcedures);
    },
    methods: {
        deleteJustAddedstyleInterval(p) {
            setTimeout(() => {
                this.deleteStyle(p);
            }, 3000);
        },
        deleteStyle(p) {
            const index = this.selectedProceduresToCreate.findIndex(procedure => procedure.ID === p.ID);
            if (index > -1) {
                this.selectedProceduresToCreate[index].justAdded = false;
            }
        },
        setInvoice(i) {
            this.invoiceToCreate = {
                ...i
            };
        },
        saveInvoice() {
            if (this.invoiceToCreate.ID) return true;
            return new Promise((resolve, reject) => {
                this.$store
                    .dispatch(`$_patient/${PATIENT_INVOICE_SET}`, {
                        invoice: this.invoiceToCreate
                    })
                    .then(
                        response => {
                            this.setInvoice(response);
                            resolve(true);
                        },
                        error => {
                            const err = error.response.data.error;
                            if (err === 'user_name exist') {
                                this.errorAccount.message = 'Username already exist';
                                this.errorAccount.exceptions.push(this.account.username);
                            } else {
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: error.response.data.error,
                                        type: 'warning'
                                    }
                                });
                            }
                            // eslint-disable-next-line
                            reject(false);
                            // return false;
                        }
                    );
            });
        },
        validateStep(ref) {
            if (ref === 'step1') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then(res => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please choose diseas locations',
                                type: 'warning'
                            }
                        });
                    }
                    return Promise.resolve(this.saveInvoice());
                    // return res;
                });
            }
            if (ref === 'step2') {
                if (!this.$refs[ref]) return false;
                return this.$refs[ref].validate().then(res => {
                    if (!res) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please add manipulation',
                                type: 'warning'
                            }
                        });
                        return false;
                    }
                    this.isDialogVisibleL = false;
                    return res;
                });
            }
            return false;
        }
    }
};
</script>
