<template>
    <div class="items-list-wrapper">
        <md-toolbar class="md-transparent">
            <t-toolbar-row :headers="headers" />
        </md-toolbar>
        <patient-nosology-table
            :items="filteredItems"
            :selected-items="selectedItems"
            current-type="billing"
            @onSelected="onSelected"
        >
            <template v-if="plansListOptions.length > 0" slot="toolbar">
                <md-toolbar class="md-transparent">
                    <md-checkbox
                        v-for="planID in plansListOptions"
                        :key="planID"
                        v-model="selectedPlans"
                        :value="planID"
                    >
                        {{ patient.plans[planID].name
                        }}{{ getPlanTotalPrice(planID) }}
                    </md-checkbox>
                </md-toolbar>
            </template>
            <template slot="emptyState">
                <md-table-empty-state
                    :md-label="`No unbilled procedures found`"
                    md-description="To create invoice, firstly please aproove plan, and select unbilled procedures here"
                >
                    <md-button
                        class="md-simple md-primary"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/treatment`"
                    >Go to plans</md-button>
                    <md-button
                        v-if="patient.invoices"
                        class="md-primary"
                        :to="
                            `/${$i18n.locale}/patient/${patient.ID}/billing/invoices`
                        "
                    >Go to Invoices</md-button>
                </md-table-empty-state>
            </template>
        </patient-nosology-table>
        <md-snackbar
            :md-position="'center'"
            :md-duration="10000"
            :md-active.sync="showSnackbar"
            md-persistent
        >
            <div class="snackbar-text-wrapper">
                Selected:
                <animated-number :value="selectedItems.length" />procedures for
                <animated-number :value="totalPrice" />
                {{ currentClinic.currencyCode }}
            </div>
            <div>
                <md-button
                    v-if="selectedItems.length === filteredItems.length"
                    class="md-simple"
                    @click="(selectedItems = []), (showSnackbar = false)"
                >Unselect</md-button>
                <md-button
                    v-else
                    class="md-simple"
                    @click="selectedItems = filteredItems"
                >Select all</md-button>
                <md-button class="md-simple" @click="showSnackbar = false">Complete</md-button>
                <md-button class="md-success" @click="showCreateInvoice()">Create invoice</md-button>
            </div>
        </md-snackbar>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import PatientNosologyTable from '@/pages/Dashboard/Pages/Patient/PatientNosologyTable';

export default {
    components: {
        ...components,
        PatientNosologyTable
    },
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
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic',
            availableBillingTableColumns: 'availableBillingTableColumns',
            aproovedPlansProcedures: 'getUnbilledAndAproovedPlansProcedures',
            getManipulationsByProcedureID: 'getManipulationsByProcedureID',
            getManipulationsByProcedureIDs: 'getManipulationsByProcedureIDs',
            manipulationsByPlanID: 'getManipulationsByPlanID'
        }),
        filteredItems() {
            const procedures = this.lodash.cloneDeep(
                this.aproovedPlansProcedures
            );
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
            let sum = this.getManipulationsByProcedureIDs(
                this.selectedItems.map(p => p.ID)
            ).reduce((a, b) => a + b.totalPrice, 0);
            return sum || 0;
        },
        headers() {
            const headers = [
                {
                    title: 'Ballance',
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    valuePrefix: 2,
                    valuePostfix: this.currentClinic.currencyCode
                },
                {
                    title: 'Unbilled Procedures',
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.items.length, 10),
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: 'All invoices',
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: 0,
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: 'Discounts',
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: 0,
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: 'Tax',
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
        this.selectedPlans = this.lodash.cloneDeep(this.plansListOptions);
    },
    methods: {
        showCreateInvoice() {
            (this.showSnackbar = false),
                this.$emit('onCreateInvoice', this.selectedItems);
        },
        onSelected(items) {
            this.selectedItems = items;
            this.showSnackbar = items.length > 0;
        },
        getPlanTotalPrice(planID) {
            const totalPrice = this.manipulationsByPlanID(planID).reduce(
                (a, b) => a + (b.totalPrice || 0),
                0
            );
            return totalPrice
                ? ` - ${totalPrice.toFixed(2)} ${
                      this.currentClinic.currencyCode
                  }`
                : '';
        }
    }
};
</script>

<style lang="scss">
// .items-list-wrapper {
//     .md-table-cell-container {
//         overflow: hidden;
//         .teeth {
//             max-width: 150px;
//             width: 14vw;
//             min-width: 50px;
//             text-overflow: ellipsis;
//             // word-wrap: break-word;
//             overflow: hidden;
//         }
//         .code {
//             width: 20px;
//         }
//     }
//     .manipulations {
//         max-width: 30vw;
//         .items-manipulations_wrapper {
//             text-overflow: ellipsis;
//             overflow: hidden;
//             align-items: stretch;
//             display: flex;
//             .text-left {
//                 overflow: hidden;
//                 text-overflow: ellipsis;
//                 white-space: nowrap;
//                 text-align: left;
//                 // max-width: 70%;
//             }
//             .text-right {
//                 flex-grow: 1;
//                 // max-width: 30%;
//                 text-overflow: ellipsis;
//                 white-space: nowrap;
//                 text-align: right;
//             }
//         }
//     }
//     .md-card .md-card-actions {
//         border: 0;
//         margin-left: 20px;
//         margin-right: 20px;
//     }
//     .paginated-table table > tbody > tr > td {
//         width: fit-content;
//     }
// }
</style>
