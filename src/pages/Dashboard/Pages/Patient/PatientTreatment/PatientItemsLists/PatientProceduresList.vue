<template lang="html">
    <div>
        <t-toolbar-row :headers="headers" />
        <md-toolbar class="md-transparent md-elevation-0">
            <div class="md-toolbar-row">
                <div class="md-toolbar-section-start">
                    {{ currentPlan.state }}
                </div>

                <div class="md-toolbar-section-end">
                    <md-button class="md-just-icon md-simple" @click="handlePrint(currentPlan)">
                        <md-icon>
                            print
                        </md-icon>
                        <md-tooltip>
                            {{ $t(`${$options.name}.printPlan`) }}
                        </md-tooltip>
                    </md-button>
                    <md-button class="md-just-icon md-simple">
                        <md-icon>
                            edit
                        </md-icon>
                        <md-tooltip>
                            {{ $t(`${$options.name}.changePlanTitle`) }}
                        </md-tooltip>
                    </md-button>
                    <md-button class="md-just-icon md-simple" @click="$emit('onDeletePlan', currentPlanID)">
                        <md-icon>
                            delete
                        </md-icon>
                        <md-tooltip>
                            {{ $t(`${$options.name}.deletePlan`) }}
                        </md-tooltip>
                    </md-button>
                    <md-button v-if="currentPlan.state === 1" class="md-simple" @click="unApprovePlan(currentPlanID)">
                        <md-icon>
                            cancel
                        </md-icon>
                        {{ $t(`${$options.name}.unApprove`) }}
                    </md-button>
                    <md-button v-else class="md-info" @click="approvePlan(currentPlanID)">
                        <md-icon>
                            check
                        </md-icon>
                        {{ $t(`${$options.name}.approve`) }}
                    </md-button>
                </div>
            </div>
        </md-toolbar>
        <router-view></router-view>
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
                    {{ currentClinic.currencyCode }}
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
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import {
    // NOTIFY,
    PATIENT_PLAN_EDIT,
    STORE_KEY_PATIENT,
    // PATIENT_PLAN_DELETE,
    EB_SHOW_PATIENT_PRINT_FORM
} from '@/constants';
import components from '@/components';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';
import EventBus from '@/plugins/event-bus';

export default {
    components: {
        ...components,
        ...patientComponents
    },
    name: 'PatientProceduresList',
    props: {
        currentPlan: {
            type: Object,
            default: () => {}
        }
    },
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
            manipulationsByPlanID: `${STORE_KEY_PATIENT}/getManipulationsByPlanID`,
            getManipulationsByProcedureIDs: `${STORE_KEY_PATIENT}/getManipulationsByProcedureIDs`,
            currentPlanID: `${STORE_KEY_PATIENT}/getCurrentPlanID`,
            getManipulationsByProcedureID: `${STORE_KEY_PATIENT}/getManipulationsByProcedureID`
        }),
        getPlanTotalPrice() {
            return this.manipulationsByPlanID(this.currentPlan.ID).reduce((a, b) => a + (b.totalPrice || 0), 0);
        },
        selectedItemsPrice() {
            let sum = this.getManipulationsByProcedureIDs(this.selectedItems.map(p => p.ID)).reduce((a, b) => a + b.totalPrice, 0);
            return sum || 0;
        },
        headers() {
            const headers = [
                {
                    title: this.$t(`${this.$options.name}.planName`),
                    subTitlePrefix: this.$t(`${this.$options.name}.created`),
                    subTitlePostfix: moment(this.currentPlan.created).format('MMM Do YYYY'),
                    valuePrefix: this.currentPlan.name,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.unbilledProcedures`),
                    subTitlePrefix: this.unbilledProceduresPrice,
                    subTitlePostfix: this.currentClinic.currencyCode,
                    subTitleToFix: 2,
                    valuePrefix: parseInt(this.currentPlanProcedures.length, 10),
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.totalProcedures`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.currentPlanProcedures.length, 10),
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.totalManipulations`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.manipulationsByPlanID(this.currentPlan.ID).length, 10),
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: this.$t(`${this.$options.name}.totalPrice`),
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.getPlanTotalPrice, 10),
                    valueToFix: 2,
                    valuePostfix: this.currentClinic.currencyCode
                }
            ];
            return headers;
        },
        unbilledProcedures() {
            return this.currentPlanProcedures.filter(p => !p.invoice);
        },
        unbilledProceduresPrice() {
            return this.totalPrice(this.unbilledProcedures.map(p => p.ID));
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
                    const aTeethPrice = this.getManipulationsByProcedureID(a.ID).reduce((a, b) => a + b.totalPrice, 0) || 0;
                    const bTeethPrice = this.getManipulationsByProcedureID(b.ID).reduce((a, b) => a + b.totalPrice, 0) || 0;
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aTeethPrice === null ? dflt : aTeethPrice;
                    const bVal = bTeethPrice === null ? dflt : bTeethPrice;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                });
            }
            this.sortedData = this.sortBytypes(currentSort, currentSortOrder);
        },
        handlePrint(item) {
            if (item) {
                const params = {
                    item,
                    type: 'plan'
                };
                EventBus.$emit(EB_SHOW_PATIENT_PRINT_FORM, params);
            }
        },
        totalPrice(IDs) {
            const sum = this.getManipulationsByProcedureIDs(IDs).reduce((a, b) => a + b.totalPrice, 0);
            return sum || 0;
        },
        unApprovePlan(planID) {
            this.$store.dispatch(`$_patient/${PATIENT_PLAN_EDIT}`, {
                planID,
                key: 'state',
                value: null
            });
        },
        scrollToTop() {
            window.scrollTo(0, 0);
        },
        unselectAll() {
            this.selectedItems = [];
            this.showDeleteItemSnackbar = false;
        },
        approvePlan(planID) {
            this.$store.dispatch(`$_patient/${PATIENT_PLAN_EDIT}`, {
                planID,
                key: 'state',
                value: 1
            });
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
