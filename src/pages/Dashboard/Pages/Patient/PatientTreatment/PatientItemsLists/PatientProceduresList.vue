<template lang="html">
    <div  >
        <div  v-if="existPlan">
            <t-toolbar-row  :headers="headers"></t-toolbar-row>
            <patient-nosology-table
                selectable
                current-type="procedures"
                extraClass="no"
                :items="sortedData"
                :selected-items="selectedItems"
                @onSelected="onSelected"
                @customSort="customSort"
            >
                <template slot="emptyState">
                    <md-table-empty-state
                        :md-label="$t(`${$options.name}.noProceduresTitle`)"
                        :md-description="$t(`${$options.name}.noProceduresDescription`)"
                    >
                        <md-button class="md-primary md-raised" @click="scrollToTop()">
                            {{ $t(`${$options.name}.scrollTop`) }}
                        </md-button>
                    </md-table-empty-state>
                </template>
            </patient-nosology-table>
            <md-snackbar
                v-if="showDeleteItemSnackbar"
                :md-position="'center'"
                :md-duration="10000"
                :md-active.sync="showDeleteItemSnackbar"
                md-persistent
            >
                <div class="snackbar-wrapper md-layout md-alignment-center-space-between md-size-100">
                    <div class="snackbar-text-wrapper ">
                        {{ $t(`${$options.name}.selected`) }}
                        <animated-number :value="selectedItems.length" />
                        {{ $tc(`${$options.name}.proceduresFor`, selectedItems.length) }}
                        <animated-number :value="selectedItemsPrice" />
                        {{ currency }}
                    </div>
                    <div class="snackbar-action-wrapper  ml-auto md-alignment-center-right ">
                        <md-button v-if="selectedItems.length === currentPlanProcedures.length" class="md-simple" @click="unselectAll()">
                            {{ $t(`${$options.name}.unselect`) }}
                        </md-button>
                        <md-button v-else class="md-simple" @click="selectedItems = currentPlanProcedures">
                            {{ $t(`${$options.name}.selectAll`) }}
                        </md-button>
                        <md-button class="md-simple" @click="showDeleteItemSnackbar = false">
                            {{ $t(`${$options.name}.complete`) }}
                        </md-button>
                        <md-button class="md-success" @click="showCreateInvoice()">
                            {{ $t(`${$options.name}.createInvoice`) }}
                        </md-button>
                    </div>
                </div>
            </md-snackbar>
        </div>
        <div  v-else >
                <md-empty-state
                    :md-label="$t(`${$options.name}.noPlanTitle`, { id: this.$route.params.planID })"
                >
                </md-empty-state>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import {
    // NOTIFY,
    PATIENT_PLAN_EDIT,
    STORE_KEY_PATIENT,
    JAW_LOADER_START,
    // PATIENT_PLAN_DELETE,
    EB_SHOW_PATIENT_PRINT_FORM,
    PATIENT_EDIT,
    PATIENT_JAW_UPDATE,
    JAW_LOADER_STOP
} from '@/constants';
import components from '@/components';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';

export default {
    components: {
        ...components,
        ...patientComponents
    },
    name: 'PatientProceduresList',
    data() {
        return {
            showDeleteItemSnackbar: false,
            deleting: false,
            selectedItems: [],
            sortedData: []
        };
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            currentClinic: 'getCurrentClinic',
            currentPlanProcedures: `${STORE_KEY_PATIENT}/getPatientCurrentPlanProcedures`,
            currentPlanID: `${STORE_KEY_PATIENT}/getCurrentPlanID`,
            currentPlan: `${STORE_KEY_PATIENT}/getCurrentPlan`,
            currency: 'getCurrency'
        }),
        selectedItemsPrice() {
            //!TODO из бэка брать стоимость прайса
            return 33333;
        },
        planSummary() {
            return this.currentPlan.summary || {};
        },
        existPlan() {
            if (this.$route.params && `${this.$route.params.planID}` in this.patient.plans) {
                return true;
            }
            return false;
        },
        headers() {
            const headers = [
                {
                    title: this.$t(`${this.$options.name}.created`),
                    subTitlePrefix: this.$t(`${this.$options.name}.updated`),
                    subTitlePostfix: moment(this.currentPlan.updated).format('MMM Do YYYY'),
                    valuePrefix: moment(this.currentPlan.created).format('MMM Do YYYY'),
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.unbilledProcedures`),
                    subTitlePrefix: this.unbilledProceduresPrice,
                    subTitlePostfix: this.currency,
                    subTitleToFix: 2,
                    valuePrefix: this.planSummary.unpaidPrice || 0,
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.totalProcedures`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: this.planSummary.procedures || 0,
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.totalManipulations`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: this.planSummary.manipulations || 0,
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.totalPrice`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: this.planSummary.totalPrice || 0,
                    valueToFix: 2,
                    valuePostfix: this.currency
                }
            ];
            return headers;
        },
        unbilledProcedures() {
            return [];
            // this.currentPlanProcedures.filter(p => !p.invoice);
        },
        unbilledProceduresPrice() {
            //!TODO из бэка брать стоимость прайса
            return 3333;
        }
    },
    watch: {
        currentPlanProcedures() {
            this.customSort();
        }
    },
    methods: {
        sortBytypes(currentSort, currentSortOrder) {
            const vm = this;
            const val = vm.currentPlanProcedures.sort((a, b) => {
                const sortBy = currentSort;
                if (Array.isArray(a[currentSort])) {
                    const aArrayLength = a[currentSort] ? Object.keys(a[currentSort]).length : 0;
                    const bArrayLength = b[currentSort] ? Object.keys(b[currentSort]).length : 0;
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aArrayLength === null ? dflt : aArrayLength;
                    const bVal = bArrayLength === null ? dflt : bArrayLength;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                } else if (typeof a[currentSort] === 'string') {
                    if (currentSortOrder === 'desc') {
                        return a[sortBy].localeCompare(b[sortBy]);
                    }
                    return b[sortBy].localeCompare(a[sortBy]);
                } else if (typeof a[currentSort] === 'number') {
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = a[sortBy] === null ? dflt : a[sortBy];
                    const bVal = b[sortBy] === null ? dflt : b[sortBy];
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                } else if (typeof a[currentSort] === 'object') {
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = a[sortBy] === null ? dflt : a[sortBy];
                    const bVal = b[sortBy] === null ? dflt : b[sortBy];
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                }
            });
            return val;
        },
        customSort(currentSort = 'created', currentSortOrder = 'asc') {
            const vm = this;
            if (currentSort === 'teeth') {
                vm.sortedData = vm.currentPlanProcedures.sort((a, b) => {
                    const aTeethLength = a.teeth ? Object.keys(a.teeth).length : 0;
                    const bTeethLength = b.teeth ? Object.keys(b.teeth).length : 0;
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aTeethLength === null ? dflt : aTeethLength;
                    const bVal = bTeethLength === null ? dflt : bTeethLength;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                });
            }
            if (currentSort === 'price') {
                vm.sortedData = vm.currentPlanProcedures.sort((a, b) => {
                    const aTeethPrice = a.summary ? a.summary.totalPrice : 0;
                    const bTeethPrice = b.summary ? b.summary.totalPrice : 0;
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aTeethPrice === null ? dflt : aTeethPrice;
                    const bVal = bTeethPrice === null ? dflt : bTeethPrice;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                });
            }
            this.sortedData = this.sortBytypes(currentSort, currentSortOrder);
        },

        scrollToTop() {
            window.scrollTo(0, 0);
        },
        unselectAll() {
            this.selectedItems = [];
            this.showDeleteItemSnackbar = false;
        },
        onSelected(items) {
            this.selectedItems = items;
            this.showDeleteItemSnackbar = items.length > 0;
        }
    }
};
</script>
<style lang="scss">
.set-diagnose-form {
    .tab-content > div {
        flex-grow: 1;
    }
    .md-card {
        box-shadow: none;
    }
}
</style>
