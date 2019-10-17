<template>
    <div class="billing-wrapper md-layout-item">
        <md-tabs ref="mdTabs" md-sync-route class="t-md-tabs billng">
            <md-tab
                id="tab-unbilled_procedures"
                :to="`/${$i18n.locale}/patient/${patient.ID}/billing/unbilled_procedures`"
                :md-label="$t(`${$options.name}.unbilledProcedures`)"
            >
                <router-view @onCreateInvoice="onCreateInvoice" />
            </md-tab>
            <md-tab
                id="tab-invoices"
                class="diagnosis"
                :to="`/${$i18n.locale}/patient/${patient.ID}/billing/invoices`"
                :md-label="$t(`${$options.name}.invoices`)"
            >
                <router-view />
            </md-tab>
            <md-tab
                id="tab-payments"
                class="diagnosis"
                :to="`/${$i18n.locale}/patient/${patient.ID}/billing/payments`"
                :md-label="$t(`${$options.name}.payments`)"
            >
                <router-view />
            </md-tab>
        </md-tabs>

        <t-wizard-add-billing
            v-if="showInvoiceForm"
            :is-dialog-visible.sync="showInvoiceForm"
            :selected-procedures="selectedItems"
            @onProcedureAdd="onProcedureAdd"
        />
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import { STORE_KEY_PATIENT } from '@/constants';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';
// import { constants } from 'crypto';

export default {
    name: 'PatientBilling',
    components: {
        ...components,
        ...patientComponents
    },
    data() {
        return {
            computedAvailableBillingTableColumns: [],
            itemsTableColumns: [],
            selectedItemsL: [],
            showTableEditor: false,
            showForm: false,
            showSnackbar: false,
            showInvoiceForm: false,
            isInfinity: false,
            currentSort: 'date',
            currentSortOrder: 'desc',
            randomMC: '',
            pagination: {
                perPage: 10,
                currentPage: 1,
                perPageOptions: [10, 25, 50],
                total: 0
            }
        };
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`
        }),
        selectedItems() {
            return this.selectedItemsL || [];
        }
    },
    mounted() {
        this.deleteTabStyle();
    },

    methods: {
        deleteTabStyle() {
            if (this.$refs.mdTabs) {
                this.$refs.mdTabs.$children[0].$el.removeAttribute('style');
            }
        },
        onCreateInvoice(items) {
            this.selectedItemsL = items || [];
            this.showInvoiceForm = true;
        },
        onProcedureAdd(p) {
            this.selectedItems.push(p);
        }
    }
};
</script>

<style lang="scss">
.billing-wrapper {
    margin-top: 10px;
}
</style>
