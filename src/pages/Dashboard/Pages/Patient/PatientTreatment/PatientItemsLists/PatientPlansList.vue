<template lang="html">
    <div
        v-if="currentPlanID"
        class="md-layout-item patient-palns-list  md-size-100"
    >
        <md-tabs
            ref="mdTabs"
            md-sync-route
            class="t-md-tabs procedures"
            @md-changed="setCurrentPlan"
            @click="setCurrentPlan"
        >
            <template
                slot="md-tab"
                slot-scope="{ tab }"
            >
                {{ tab.label }} <span
                    v-if="tab.data.badge"
                    class="notification"
                    :class="tab.data.class"
                >{{ tab.data.badge }}</span>
            </template>
            <md-tab
                v-for="(plan, key) in patient.plans"
                :id="`${plan.ID}`"
                :key="key"
                md-dynamic-height
                :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/plan/${plan.ID}/procedures`"
                :md-label="`${plan.name} ${getPlanTotalPrice(plan.ID)}`"
                :md-template-data="{
                    badge: plan.state === 1 ? 'aprooved':'',
                    class:'md-info'
                }"
            >
                <router-view
                    v-if="$route && $route.params && $route.params.planID in patient.plans"
                    :id="key"
                    :current-plan="plan"
                />
                <md-empty-state
                    v-else-if="$route && $route.params"
                    :md-label="`No plan with ID ${$route.params.planID}`"
                    :md-description="`No pla with ID ${$route.params.planID} found. Scroll top, and create new one.`"
                >
                    <md-button
                        class="md-primary md-raised"
                        @click="scrollToTop()"
                    >
                        Scroll Top
                    </md-button>
                </md-empty-state>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    PATIENT_PLAN_SWITCH_CURRENT,
} from '@/constants';
import components from '@/components';
import ItemsList from './ItemsList.vue';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if( to.params.planID && to.params.planID !== from.params.planID){
                vm.setCurrentPlan(to.params.planID);
                vm.deleteTabStyle();
            }
        })
    },
    beforeRouteUpdate(to, from, next) {
        this.deleteTabStyle()
        if( to.params.planID && to.params.planID!== from.params.planID){
            this.setCurrentPlan(to.params.planID)
        }
        next()
    },
    components: {
        ...components,
        // DeleteForm,
    },
    data() {
        return {
            showDeleteForm: false,
        };
    },

    computed: {
        ...mapGetters({
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic',
            currentPlanProcedures: 'getPatientCurrentPlanProcedures',
            currentPlanID: 'getCurrentPlanID',
            manipulationsByPlanID: 'getManipulationsByPlanID',
        }),
        tabHeaders() {
            const tabHeaders = [];
            if (this.patient.plans) {
                Object.values(this.patient.plans).forEach((p, i) => {
                    tabHeaders[i] = {
                        ...p,
                        price: this.getPlanTotalPrice(p),
                    };
                });
            }
            return tabHeaders;
        },
    },

    mounted(){
        this.deleteTabStyle();
    },
    methods: {
        scrollToTop() {
            window.scrollTo(0, 0);
        },
        setCurrentPlan(planID){
            if(planID){
                this.$store.dispatch(PATIENT_PLAN_SWITCH_CURRENT, {
                    planID,
                });
            }
        },
        deleteTabStyle(){
            if (this.$refs.mdTabs) { this.$refs.mdTabs.$children[0].$el.removeAttribute('style') }
        },
        onChangeTab(plan) {
            if (this.patient.currentPlan && this.patient.currentPlan.ID !== plan.ID) {
                this.$store.dispatch(PATIENT_PLAN_SWITCH_CURRENT, { planID: pln.ID });
            }
        },
        showItemInfo(params) {
            this.$emit('showItemInfo', params);
        },
        getPlanTotalPrice(planID) {
            const totalPrice = this.manipulationsByPlanID(planID).reduce((a, b) => a + (b.totalPrice || 0), 0);
            return totalPrice
                ? ` - ${totalPrice.toFixed(2)} ${this.currentClinic.currencyCode}`
                : '';
        },
    },
};
</script>