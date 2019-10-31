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
                <router-view v-if="$route && $route.params && $route.params.planID in patient.plans" :id="key" :current-plan="plan" />
                <md-empty-state
                    v-else-if="patient.plans && Object.keys(patient.plans).length > 0"
                    :md-label="$t(`${$options.name}.noPlansTitle`)"
                    :md-description="$t(`${$options.name}.noPlansDescription`)"
                >
                </md-empty-state>
                <md-empty-state
                    v-else-if="$route && $route.params"
                    :md-label="$t(`${$options.name}.noPlansWithIdTitle`, { ID: $route.params.planID })"
                    :md-description="$t(`${$options.name}.noPlansWithIdDescription`, { ID: $route.params.planID })"
                >
                    <md-button class="md-primary md-raised" @click="scrollToTop()">
                        {{ $t(`${$options.name}.scrollTop`) }}
                    </md-button>
                </md-empty-state>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { PATIENT_PLAN_SWITCH_CURRENT,PATIENT_JAW_UPDATE, JAW_LOADER_STOP, JAW_LOADER_START,  PATIENT_EDIT,  STORE_KEY_PATIENT } from '@/constants';
import components from '@/components';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // if (vm.currentPlanID !== to.params.planID) {
            //     vm.$router.push({
            //         name: 'procedures',
            //         params: {
            //             lang: vm.$i18n.locale,
            //             patientID: vm.patient.ID,
            //             planID: vm.currentPlanID,
            //         }
            //     });
            //     console.log( vm.currentPlanID, vm.$route,  'redirected procedures')
            // }
            //${$i18n.locale}/patient/${patient.ID}/treatment/plan/${plan.ID}
            // console.log(to.params.planID)
            // console.log(vm.currentPlanID)
            // vm.setCurrentPlan(to.params.planID);
            // if (to.params.planID && to.params.planID !== from.params.planID) {
            //     if (vm.patient.currentPlanID === to.params.planID) {
            //         return true;
            //     } else {
            //         vm.$store.dispatch(JAW_LOADER_START);
            //         vm.$store
            //             .dispatch(`$_patient/${PATIENT_EDIT}`, {
            //                 params: {
            //                     currentPlanID: parseInt(to.params.planID, 10)
            //                 }
            //             })
            //             .then(response => {
            //                 if (response) {
            //                     vm.$store.dispatch(`$_patient/${PATIENT_JAW_UPDATE}`).then(() => {
            //                         vm.$store.dispatch(JAW_LOADER_STOP);
            //                         next()
            //                     });
            //                 }
            //             })
            //             .catch(err => {
            //                 console.log(err);
            //                 vm.$store.dispatch(JAW_LOADER_STOP);
            //                 throw new Error(err);
            //             });
            //
            //     }
            // }
            vm.deleteTabStyle();
            console.log(vm.currentPlanID,  vm.$route,  'planslist')
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.deleteTabStyle();
        if (to.params.planID && to.params.planID !== from.params.planID) {
            if (this.patient.currentPlanID === to.params.planID) {
                next()
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
                                next()
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
        next()
    },
    name: 'PatientPlansList',
    components: {
        ...components
        // DeleteForm,
    },
    data() {
        return {
            showDeleteForm: false,
            loading: false,
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
        if (this.currentPlanID !== this.$route.params.planID) {
                this.$router.push({
                    name: 'procedures',
                    params: {
                        lang: this.$i18n.locale,
                        patientID: this.patient.ID,
                        planID: this.currentPlanID,
                    }
                });
                console.log( this.currentPlanID, this.$route,  'redirected procedures')
            }
    },
    methods: {
        scrollToTop() {
            window.scrollTo(0, 0);
        },
        // setCurrentPlan(planID) {
        //     const setPlan = function(planID, vm) {
        //         if (vm.patient.currentPlanID === planID) {
        //             return true;
        //         } else {
        //             vm.$store.dispatch(JAW_LOADER_START);
        //             vm.$store
        //                 .dispatch(`$_patient/${PATIENT_EDIT}`, {
        //                     params: {
        //                         currentPlanID: parseInt(planID, 10)
        //                     }
        //                 })
        //                 .then(response => {
        //                     if (response) {
        //                         vm.$store.dispatch(JAW_LOADER_STOP);
        //                     }
        //                 })
        //                 .catch(err => {
        //                     console.log(err);
        //                     vm.$store.dispatch(JAW_LOADER_STOP);
        //                     throw new Error(err);
        //                 });
        //         }
        //     }
        //     return setPlan
        // },
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
        }
    }
};
</script>
