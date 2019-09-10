<template lang="html">
    <div class="md-layout-item  md-size-100">
        <md-toolbar class="md-transparent">
            <t-toolbar-row :headers="headers" />
            <div class="md-toolbar-row">
                <div class="md-toolbar-section-start">
                    {{ currentPlan.state }}
                </div>

                <div class="md-toolbar-section-end">
                    <md-button class="md-simple">
                        <md-icon>
                            edit
                        </md-icon>
                        Change plan title
                    </md-button>
                    <md-button class="md-simple" @click="showDeleteItemSnackbar = true">
                        <md-icon>
                            delete
                        </md-icon>
                        Delete plan
                    </md-button>
                    <md-button v-if="currentPlan.state === 1" class="md-simple" @click="unApprovePlan(currentPlanID)">
                        <md-icon>
                            cancel
                        </md-icon>
                        not approve
                    </md-button>
                    <md-button v-else class="md-primary" @click="approvePlan(currentPlanID)">
                        <md-icon>
                            check
                        </md-icon>
                        Approve plan
                    </md-button>
                </div>
            </div>
        </md-toolbar>
        <router-view></router-view>
        <patient-nosology-table
            current-type="procedures"
            extraClass="no"
            :items="currentPlanProcedures"
            :selected-items="selectedItems"
            @onSelected="onSelected"
        >
            <template slot="emptyState">
                <md-table-empty-state :md-label="`No procedures found`" md-description="Scroll top, and create a new one">
                    <md-button class="md-primary md-raised" @click="scrollToTop()">
                        Scroll Top
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
                    Selected:
                    <animated-number :value="selectedItems.length" />
                    procedures for
                    <animated-number :value="selectedItemsPrice" />
                    {{ currentClinic.currencyCode }}
                </div>
                <div class="snackbar-action-wrapper  ml-auto md-alignment-center-right ">
                    <md-button v-if="selectedItems.length === currentPlanProcedures.length" class="md-simple" @click="unselectAll()">
                        Unselect
                    </md-button>
                    <md-button v-else class="md-simple" @click="selectedItems = currentPlanProcedures">
                        Select all
                    </md-button>
                    <md-button class="md-simple" @click="showDeleteItemSnackbar = false">
                        Complete
                    </md-button>
                    <md-button class="md-success" @click="showCreateInvoice()">
                        Create invoice
                    </md-button>
                </div>
            </div>
        </md-snackbar>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import { NOTIFY, PATIENT_PLAN_EDIT, PATIENT_PLAN_DELETE } from '@/constants';
import components from '@/components';
import PatientNosologyTable from '@/pages/Dashboard/Pages/Patient/PatientNosologyTable';

export default {
    components: {
        ...components,
        PatientNosologyTable
    },
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
            selectedItems: []
        };
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic',
            currentPlanProcedures: 'getPatientCurrentPlanProcedures',
            manipulationsByPlanID: 'getManipulationsByPlanID',
            getManipulationsByProcedureIDs: 'getManipulationsByProcedureIDs',
            currentPlanID: 'getCurrentPlanID'
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
                    title: 'Plan Name',
                    subTitlePrefix: 'created',
                    subTitlePostfix: moment(this.currentPlan.created).format('MMM Do YYYY'),
                    valuePrefix: this.currentPlan.name,
                    valuePostfix: null
                },
                {
                    title: 'Unbilled Procedures',
                    subTitlePrefix: this.unbilledProceduresPrice,
                    subTitlePostfix: this.currentClinic.currencyCode,
                    subTitleToFix: 2,
                    valuePrefix: parseInt(this.currentPlanProcedures.length, 10),
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: 'Total Procedures',
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.currentPlanProcedures.length, 10),
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: 'Total Manipulations',
                    subTitlePrefix: null,
                    subTitlePostfix: null,
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.manipulationsByPlanID(this.currentPlan.ID).length, 10),
                    valueToFix: 0,
                    valuePostfix: null
                },
                {
                    title: 'Total Price',
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
    methods: {
        totalPrice(IDs) {
            const sum = this.getManipulationsByProcedureIDs(IDs).reduce((a, b) => a + b.totalPrice, 0);
            return sum || 0;
        },
        unApprovePlan(planID) {
            this.$store.dispatch(PATIENT_PLAN_EDIT, {
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
            this.$store.dispatch(PATIENT_PLAN_EDIT, {
                planID,
                key: 'state',
                value: 1
            });
        },
        onSelected(items) {
            this.selectedItems = items;
            this.showDeleteItemSnackbar = items.length > 0;
        },
        showItemInfo(params) {
            this.$emit('showItemInfo', params);
        },
        redirectToPlan() {
            console.log('redirested');
            this.$router.push({
                name: 'procedures',
                params: {
                    lang: this.$i18n.locale,
                    patientID: this.patient.ID
                }
            });
        },
        deletePlan() {
            this.deleting = true;
            this.$store
                .dispatch(PATIENT_PLAN_DELETE, {
                    planID: this.currentPlan.ID
                })
                .then()
                .catch(() => {
                    this.showDeleteItemSnackbar = false;
                    if (this.lodash.isEmpty(this.patient.plans)) {
                        this.redirectToPlan();
                    }
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Plan deleted',
                            type: 'success'
                        }
                    });
                })
                .then(() => {
                    this.deleting = false;
                    this.showDeleteItemSnackbar = false;
                });
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
