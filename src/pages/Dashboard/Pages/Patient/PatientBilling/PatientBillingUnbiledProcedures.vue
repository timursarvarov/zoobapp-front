<template>
    <div class="items-list-wrapper">
        <md-toolbar class="md-transparent">
            <t-toolbar-row :headers="headers" />
        </md-toolbar>
        <patient-nosology-table :items="filteredItems" :selected-items="selectedItems" current-type="billing" @onSelected="onSelected">
            <template v-if="plansListOptions.length > 0" slot="toolbar">
                <md-toolbar class="md-transparent">
                    <md-checkbox v-for="planID in plansListOptions" :key="planID" v-model="selectedPlans" :value="planID">
                        {{ patient.plans[planID].name }}{{ getPlanTotalPrice(planID) }}
                    </md-checkbox>
                </md-toolbar>
            </template>
            <template slot="emptyState">
                <md-table-empty-state
                    :md-label="$t(`${$options.name}.noUnbilledProceduresTitle`)"
                    :md-description="$t(`${$options.name}.noUnbilledProceduresDescription`)"
                >
                    <md-button class="md-simple md-primary" :to="`/${$i18n.locale}/patient/${patient.ID}/treatment`">
                        {{ $t(`${$options.name}.goToPlans`) }}
                    </md-button>
                    <md-button v-if="patient.invoices" class="md-primary" :to="`/${$i18n.locale}/patient/${patient.ID}/billing/invoices`">
                        {{ $t(`${$options.name}.goToInvoices`) }}
                    </md-button>
                </md-table-empty-state>
            </template>
        </patient-nosology-table>
        <md-snackbar :md-position="'center'" :md-duration="10000" :md-active.sync="showSnackbar" md-persistent>
            <div class="snackbar-text-wrapper">
                {{ $t(`${$options.name}.selected`) }}
                <animated-number :value="selectedItems.length" />
                {{ $tc(`${$options.name}.proceduresFor`, selectedItems.length) }}
                <animated-number :value="totalPrice" />
                {{ currentClinic.currencyCode }}
            </div>
            <div>
                <md-button
                    v-if="selectedItems.length === filteredItems.length"
                    class="md-simple"
                    @click="(selectedItems = []), (showSnackbar = false)"
                >
                    {{ $t(`${$options.name}.unselect`) }}
                </md-button>
                <md-button v-else class="md-simple" @click="selectedItems = filteredItems">
                    {{ $t(`${$options.name}.selectAll`) }}
                </md-button>
                <md-button class="md-simple" @click="showSnackbar = false">
                    {{ $t(`${$options.name}.complete`) }}
                </md-button>
                <md-button class="md-success" @click="showCreateInvoice()">
                    {{ $t(`${$options.name}.createInvoice`) }}
                </md-button>
            </div>
        </md-snackbar>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import { STORE_KEY_PATIENT } from '@/constants';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';

export default {
    components: {
        ...components,
        ...patientComponents
    },
    name: 'PatientBillingUnbiledProcedures',
    props: {},
    data() {
        return {
            selectedPlans: [],
            selectedItems: [],
            showForm: false,
            showSnackbar: false
        };
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            currentClinic: 'getCurrentClinic',
            availableBillingTableColumns: 'getAvailableBillingTableColumns',
            aproovedPlansProcedures: `${STORE_KEY_PATIENT}/getUnbilledAndApprovedPlansProcedures`,
            getManipulationsByProcedureID: `${STORE_KEY_PATIENT}/getManipulationsByProcedureID`,
            getManipulationsByProcedureIDs: `${STORE_KEY_PATIENT}/getManipulationsByProcedureIDs`,
            manipulationsByPlanID: `${STORE_KEY_PATIENT}/getManipulationsByPlanID`
        }),
        filteredItems() {
            const procedures = this._.cloneDeep(this.aproovedPlansProcedures);
            return procedures.filter(p => {
                return this.selectedPlans.includes(p.planID);
            });
        },
        items() {
            return this.aproovedPlansProcedures || [];
        },
        plansListOptions() {
            let plans = [];
            this.items.forEach(procedure => {
                if (!plans.includes(procedure.planID)) {
                    plans.push(procedure.planID);
                }
            });
            return plans;
        },
        totalPrice() {
            let sum = this.getManipulationsByProcedureIDs(this.selectedItems.map(p => p.ID)).reduce((a, b) => a + b.totalPrice, 0);
            return sum || 0;
        },
        headers() {
            const headers = [
                {
                    title: this.$t(`${this.$options.name}.balance`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    valuePrefix: 2,
                    valuePostfix: this.currentClinic.currencyCode
                },
                {
                    title: this.$t(`${this.$options.name}.unbilledProcedures`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.items.length, 10),
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.allInvoices`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: 0,
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.discounts`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: 0,
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.tax`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: 0,
                    valueToFix: 2,
                    valuePostfix: this.currentClinic.currencyCode
                }
            ];
            return headers;
        }
    },
    watch: {
        showSnackbar(val) {
            if (!val) {
                this.selectedItems = [];
            }
        }
    },
    created() {
        this.selectedPlans = this._.cloneDeep(this.plansListOptions);
    },
    methods: {
        showCreateInvoice() {
            (this.showSnackbar = false), this.$emit('onCreateInvoice', this.selectedItems);
        },
        onSelected(items) {
            this.selectedItems = items;
            this.showSnackbar = items.length > 0;
        },
        getPlanTotalPrice(planID) {
            const totalPrice = this.manipulationsByPlanID(planID).reduce((a, b) => a + (b.totalPrice || 0), 0);
            return totalPrice ? ` - ${totalPrice.toFixed(2)} ${this.currentClinic.currencyCode}` : '';
        }
    }
};
</script>
