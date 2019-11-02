<template lang="html">
    <div v-if="currentPlanID" class="patient-plans-list">
        <md-tabs ref="mdTabs" md-sync-route class="t-md-tabs procedures">
            <template slot="md-tab" slot-scope="{ tab }">
                {{ tab.label }}
                <span v-if="tab.data.badge" class="notification" :class="tab.data.class">{{ tab.data.badge }}</span>
            </template>
            <md-tab
                :id="`${plan.ID}`"
                :key="key"
                :md-label="`${plan.name} ${getPlanTotalPrice(plan.ID)}`"
                :md-template-data="{
                    badge: plan.state === 1 ? 'aprooved' : '',
                    class: 'md-info'
                }"
                :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/plan/${plan.ID}`"
                md-dynamic-height
                v-for="(plan, key) in patient.plans"
            >
                <router-view
                    :current-plan="plan"
                    :id="key"
                    @onDeletePlan="showDeletePlanFunc"
                    v-if="$route && $route.params && $route.params.planID in patient.plans"
                ></router-view>
                <md-empty-state
                    v-else-if="lodash.isEmpty(patient.plans)"
                    :md-label="$t(`${$options.name}.noPlansTitle`)"
                    :md-description="$t(`${$options.name}.noPlansDescription`)"
                >
                </md-empty-state>
                <md-empty-state
                    v-else-if="$route && $route.params && $route.params.planID && !($route.params.planID in patient.plans)"
                    :md-label="$t(`${$options.name}.noPlansWithIdTitle`, { ID: $route.params.planID })"
                    :md-description="$t(`${$options.name}.noPlansWithIdDescription`, { ID: $route.params.planID })"
                >
                    <md-button class="md-success md-raised" @click="$emit('addPlan')">
                        {{ $t(`${$options.name}.addNewPlan`) }}
                    </md-button>
                </md-empty-state>
            </md-tab>
        </md-tabs>
        <md-snackbar
            v-if="showDeleteItemSnackbar"
            :md-position="'center'"
            :md-duration="10000"
            :md-active.sync="showDeleteItemSnackbar"
            md-persistent
        >
            <div class="snackbar-wrapper md-layout md-alignment-center-space-between md-size-100">
                <div class="snackbar-text-wrapper ">
                    {{ $t(`${$options.name}.deletePlanForm`) }}
                    {{ $t(`${$options.name}.planTotal`) }}
                    <animated-number :value="getPlanTotalPriceNum(planIdToDelete)" />
                    {{ currentClinic.currencyCode }}
                </div>
                <div class="snackbar-action-wrapper  ml-auto md-alignment-center-right ">
                    <md-button class="md-simple" @click="showDeleteItemSnackbar = false">
                        {{ $t(`${$options.name}.cancel`) }}
                    </md-button>
                    <md-button :disabled="deleting" class="md-warning" @click="deletePlan()">
                        <div v-if="deleting">
                            <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />
                            &nbsp;
                            <span>
                                {{ $t(`${$options.name}.deleting`) }}
                            </span>
                        </div>
                        <span v-else>
                            <md-icon>
                                delete
                            </md-icon>
                            {{ $t(`${$options.name}.deletePlan`) }}
                        </span>
                    </md-button>
                </div>
            </div>
        </md-snackbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { PATIENT_PLAN_DELETE, NOTIFY, PATIENT_JAW_UPDATE, JAW_LOADER_STOP, JAW_LOADER_START, PATIENT_EDIT, STORE_KEY_PATIENT } from '@/constants';
import components from '@/components';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.deleteTabStyle();
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.deleteTabStyle();
        if (to.params.planID && to.params.planID !== from.params.planID) {
            if (this.patient.currentPlanID === to.params.planID) {
                next();
            } else {
                this.$store.dispatch(JAW_LOADER_START);
                this.$store
                    .dispatch(`$_patient/${PATIENT_EDIT}`, {
                        params: {
                            currentPlanID: parseInt(to.params.planID, 10)
                        }
                    })
                    .then(response => {
                        if (response) {
                            this.$store.dispatch(`$_patient/${PATIENT_JAW_UPDATE}`).then(() => {
                                this.$store.dispatch(JAW_LOADER_STOP);
                                next();
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.$store.dispatch(JAW_LOADER_STOP);
                        throw new Error(err);
                    });
            }
        }
        next();
    },
    name: 'PatientPlansList',
    components: {
        ...components
        // DeleteForm,
    },
    data() {
        return {
            showDeleteItemSnackbar: false,
            planIdToDelete: null,
            deleting: false
        };
    },

    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            currentClinic: 'getCurrentClinic',
            currentPlanProcedures: `${STORE_KEY_PATIENT}/getPatientCurrentPlanProcedures`,
            currentPlanID: `${STORE_KEY_PATIENT}/getCurrentPlanID`,
            manipulationsByPlanID: `${STORE_KEY_PATIENT}/getManipulationsByPlanID`
        }),
        tabHeaders() {
            const tabHeaders = [];
            if (this.patient.plans) {
                Object.values(this.patient.plans).forEach((p, i) => {
                    tabHeaders[i] = {
                        ...p,
                        price: this.getPlanTotalPrice(p)
                    };
                });
            }
            return tabHeaders;
        }
    },
    mounted() {
        this.deleteTabStyle();
    },
    watch: {
        currentPlanID() {
            this.showDeleteItemSnackbar = false;
        }
    },
    methods: {
        deletePlan() {
            this.deleting = true;
            this.$store
                .dispatch(`$_patient/${PATIENT_PLAN_DELETE}`, {
                    planID: this.planIdToDelete
                })
                .then(() => {
                    this.showDeleteItemSnackbar = false;
                    this.redirectToPlan();
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: this.$t(`${this.$options.name}.planDeleted`),
                            type: 'success'
                        }
                    });
                })
                .catch(() => {
                    this.showDeleteItemSnackbar = false;
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: this.$t(`${this.$options.name}.somethingWrong`),
                            type: 'warrning'
                        }
                    });
                })
                .then(() => {
                    this.deleting = false;
                    this.showDeleteItemSnackbar = false;
                });
        },
        showDeletePlanFunc(planID) {
            this.planIdToDelete = planID;
            this.showDeleteItemSnackbar = true;
        },
        scrollToTop() {
            window.scrollTo(0, 0);
        },
        redirectToPlan() {
            if (this.currentPlanID) {
                this.$router.push({
                    name: 'procedures',
                    params: {
                        lang: this.$i18n.locale,
                        patientID: this.patient.ID,
                        planID: this.currentPlanID
                    }
                });
            } else {
                this.$router.push({
                    name: 'plan',
                    params: {
                        lang: this.$i18n.locale,
                        patientID: this.patient.ID
                    }
                });
            }
        },

        deleteTabStyle() {
            if (this.$refs.mdTabs) {
                this.$refs.mdTabs.$children[0].$el.removeAttribute('style');
            }
        },

        showItemInfo(params) {
            this.$emit('showItemInfo', params);
        },
        getPlanTotalPrice(planID) {
            const totalPrice = this.manipulationsByPlanID(planID).reduce((a, b) => a + (b.totalPrice || 0), 0);
            return totalPrice ? ` - ${totalPrice.toFixed(2)} ${this.currentClinic.currencyCode}` : '';
        },
        getPlanTotalPriceNum(planID) {
            const totalPrice = this.manipulationsByPlanID(planID).reduce((a, b) => a + (b.totalPrice || 0), 0);
            return totalPrice;
        }
    }
};
</script>
