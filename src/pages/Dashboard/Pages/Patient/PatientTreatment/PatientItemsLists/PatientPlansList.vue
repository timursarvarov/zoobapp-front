<template lang="html">
    <div v-if="currentPlanID" class="patient-plans-list">
        <md-toolbar class="md-transparent  md-elevation-0">
            <div class="md-toolbar-section-start" v-if="hasPlans">
<!--                <div class="md-title">{{ $t(`${$options.name}.currentPlan`) }} &nbsp;</div>-->
                <div>
                    <md-field>
                        <label>{{ $t(`${$options.name}.selectPlan`) }}</label>
                        <md-select name="pages" @md-selected="openPlan" v-model="selectedPlanId">
                            <md-option v-for="(plan, key) in patient.plans" :key="key" :label="plan.name" :value="plan.ID">
                                {{ plan.name }}
                                {{ plan.summary.totalPrice | currency }}
                            </md-option>
                        </md-select>
                    </md-field>
                </div>
            </div>

            <div class="md-toolbar-section-end">
                <md-button class="md-simple " @click="$emit('addPlan')">
                    <md-icon>add</md-icon>
                    {{ $t(`${$options.name}.addNewPlan`) }}
                </md-button>
                <template v-if="existPlan">
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
                    <drop-down multi-level direction="down">
                        <md-button slot="title" class="md-button md-round md-just-icon md-simple" data-toggle="dropdown">
                            <md-icon>more_vert</md-icon>
                        </md-button>
                        <ul class="dropdown-menu dropdown-menu-right">
                            <li class="md-layout" @click="showDeletePlanFunc(currentPlanID)">
                                <a class="md-layout">
                                    <md-icon>
                                        delete
                                    </md-icon>
                                    {{ $t(`${$options.name}.deletePlan`) }}
                                </a>
                            </li>
                            <li class="md-layout" @click="$emit('addPlan')">
                                <a class="md-layout">
                                    <md-icon>
                                        edit
                                    </md-icon>
                                    {{ $t(`${$options.name}.changePlanTitle`) }}
                                </a>
                            </li>
                            <li class="md-layout" @click="handlePrint(currentPlan)">
                                <a class="md-layout">
                                    <md-icon>
                                        print
                                    </md-icon>
                                    {{ $t(`${$options.name}.printPlan`) }}
                                </a>
                            </li>
                        </ul>
                    </drop-down>
                </template>
            </div>
        </md-toolbar>
        <keep-alive>
            <router-view ></router-view>
        </keep-alive>
        <md-snackbar
            v-if="showDeleteItemSnackbar"
            :md-position="'center'"
            :md-duration="10000"
            :md-active.sync="showDeleteItemSnackbar"
            md-persistent
        >
            <div class="snackbar-wrapper md-layout md-alignment-center-space-between md-size-100">
                <div class="snackbar-text-wrapper ">
                    {{ $t(`${$options.name}.deletePlanForm`, {planName: this.currentPlan.name}) }}
                    {{ $t(`${$options.name}.planTotal`) }}
                    <animated-number :value="this.planSummary.totalPrice" />
                    {{ currency }}
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
import {
    PATIENT_PLAN_DELETE,
    NOTIFY,
    PATIENT_PLAN_EDIT,
    PATIENT_JAW_UPDATE,
    JAW_LOADER_STOP,
    JAW_LOADER_START,
    PATIENT_EDIT,
    STORE_KEY_PATIENT,
    EB_SHOW_PATIENT_PRINT_FORM
} from '@/constants';
import components from '@/components';
import EventBus from '@/plugins/event-bus';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.name != 'procedures' && !!vm.currentPlanID) {
                vm.$router.push({
                    name: 'procedures',
                    params: {
                        lang: vm.$i18n.locale,
                        patientID: vm.patient.ID,
                        planID: vm.currentPlanID
                    }
                });
                vm.selectedPlanId = vm.currentPlanID;
            } else if (to.params.planID && `${to.params.planID}` !== `${vm.currentPlanID}` && to.params.planID in vm.patient.plans) {
                vm.$nextTick(() => {
                    vm.changeRoute(to.params.planID, 2);
                });
            } else {
                // vm.$router.push({
                //     name: 'plan',
                //     params: {
                //         lang: vm.$i18n.locale,
                //         patientID: vm.patient.ID
                //     }
                // });
            }
        });
    },
    beforeRouteUpdate(to, from, next) {
        if (to.params.planID && to.params.planID !== from.params.planID) {
            if (this.patient.currentPlanID === to.params.planID) {
                this.selectedPlanId = to.params.planID;
                next();
            } else {
                this.$nextTick(() => {
                    this.changeRoute(to.params.planID, 1).then(() => {
                        next();
                    });
                });
            }
        }
        next();
    },
    name: 'PatientPlansList',
    components: {
        ...components
    },
    props: {
        canRedirect: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showDeleteItemSnackbar: false,
            planIdToDelete: null,
            deleting: false,
            selectedPlanId: null
        };
    },
    created(){
        if(this.existPlan){
            this.selectedPlanId = this.currentPlanID;
        }
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            currency: 'getCurrency',
            currentPlanID: `${STORE_KEY_PATIENT}/getCurrentPlanID`,
            manipulationsByPlanID: `${STORE_KEY_PATIENT}/getManipulationsByPlanID`,
            currentPlan: `${STORE_KEY_PATIENT}/getCurrentPlan`
        }),
        planSummary() {
            return this.currentPlan.summary | {};
        },
        hasPlans() {
            if (this.patient.plans && Object.keys(this.patient.plans).length > 0) {
                return true;
            }
            return false;
        },
        existPlan() {
            if (this.$route.params && `${this.$route.params.planID}` in this.patient.plans) {
                return true;
            }
            return false;
        }
    },
    watch: {
        currentPlanID() {
            this.showDeleteItemSnackbar = false;
        }
    },
    methods: {
        handlePrint(item) {
            if (item) {
                const params = {
                    item,
                    type: 'plan'
                };
                EventBus.$emit(EB_SHOW_PATIENT_PRINT_FORM, params);
            }
        },
        changeRoute(planID, e) {
            return new Promise(resolve => {
                this.$store.dispatch(JAW_LOADER_START);
                this.$store
                    .dispatch(`$_patient/${PATIENT_EDIT}`, {
                        params: {
                            currentPlanID: parseInt(planID, 10)
                        }
                    })
                    .then(response => {
                        if (response) {
                            this.$store.dispatch(`$_patient/${PATIENT_JAW_UPDATE}`).then(() => {
                                this.$store.dispatch(JAW_LOADER_STOP);
                                this.selectedPlanId = planID;
                                resolve(true);
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.$store.dispatch(JAW_LOADER_STOP);
                        throw new Error(err);
                    });
            });
        },
        openPlan(planID) {
            if (this.$route.params.planID != planID) {
                this.$router.push({
                    name: 'procedures',
                    params: {
                        lang: this.$i18n.locale,
                        patientID: this.patient.ID,
                        planID
                    }
                });
            }
        },
        unApprovePlan(planID) {
            this.$store.dispatch(`$_patient/${PATIENT_PLAN_EDIT}`, {
                planID,
                key: 'state',
                value: null
            });
        },
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

        showItemInfo(params) {
            this.$emit('showItemInfo', params);
        },
        getPlanTotalPrice(planID) {
          return this.patients[planID].summary.totalPrice
        },
    }
};
</script>
