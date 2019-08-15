<template lang="html">
    <div class="md-layout-item  md-size-100" >
        <md-tabs md-sync-route  class="t-md-tabs"
            :class="currentType">
            <md-tab
                :id="`tab-plan-${plan.ID}`"
                v-for="(plan, name, index) in this.patient.plans"
                :key="index"
                :to="`/${$i18n.locale}/patient/${patient.ID}/treatment/procedures/${plan.ID}`"
                :md-label="plan.name">
                {{plan}}
                <items-list
                            :key="name"
                            @onJawChanged="recalculateJaw()"
                            @showItemInfo="showItemInfo"
                            :teethSystem="currentClinic.teethSystem"
                            currentType="procedures"
                            :items="getProceduresByIds(plan.procedures) || []"
                            :plan="plan"
                        >
                        <template v-if="plan.state === 1" slot="title-start" >
                                <h4 class="title text-success">
                                    Plan approved
                                </h4>

                        </template>
                        </items-list>
            </md-tab>
        </md-tabs>
        <t-tabs
                v-if="patient.plans && $route.name ==='procedures' && patient.currentPlan "
                @onChangeTab="onChangeTab"
                ref="tabs"
                :tab-name="tabHeaders"
                color-button="success"
                class="procedures-tabs"
            >
                <div
                    v-for="(plan, name, index) in this.patient.plans"
                    :slot="`tab-pane-${index+1}`"
                    :key="plan.ID"
                    >
                        <items-list
                            :key="name"
                            @onJawChanged="recalculateJaw()"
                            @showItemInfo="showItemInfo"
                            :teethSystem="currentClinic.teethSystem"
                            currentType="procedures"
                            :items="getProceduresByIds(plan.procedures) || []"
                            :plan="plan"
                        >
                        <template v-if="plan.state === 1" slot="title-start" >
                                <h4 class="title text-success">
                                    Plan approved
                                </h4>

                        </template>
                        </items-list>
                    </div>
                    <template slot="footer-actions">
    <div class="md-layout ml-auto"
        v-if="patient.currentPlan">
        <div class="ml-auto">
            <md-button class="md-simple" @click="showDeleteForm = true">Delete plan</md-button>
            <md-button
                :disabled="patient.currentPlan.state === 1 "
                class="md-success"
                @click="editPLanField( patient.currentPlan.ID, 'state', 1)"
            >Approve plan</md-button>
        </div>
    </div>
</template>
        </t-tabs>
        <delete-form
            v-if="patient.currentPlan"
            text="Delete Plan?"
            :showForm.sync="showDeleteForm"
            :itemToDelete="patient.currentPlan"
            :patientID="patient.ID"
            currentType='plan'
        />

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {
        PATIENT_PLAN_EDIT,
        PATIENT_PLAN_CURRENT_SET,
    } from '@/constants';
    import components from '@/components';
    import ItemsList from './ItemsList.vue';
    import DeleteForm from './DeleteForm.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            ...components,
            ItemsList,
            DeleteForm,
        },
        props: {
            currentType: {
                type: String,
                default: 'anamnesis',
            },
        },
        data() {
            return {
                focusedPlanID: null,
                showToothDiagnosis: false,
                showDeleteForm: false,
                showAddItemWizard: false,
                jawHeight: 0,
                showParams: {},
                loadingAllPLans: false,
            };
        },
        methods: {
            getProcedures(procedures = []) {
                const planProcedures = [];
                if (procedures) {
                    procedures.forEach((ID) => {
                        planProcedures.push(this.patient.procedures[ID]);
                    });
                }
                return planProcedures;
            },
            onChangeTab(plan) {
                if (this.patient.currentPlan && this.patient.currentPlan.ID !== plan.ID) {
                    this.$store.dispatch(PATIENT_PLAN_CURRENT_SET, { plan });
                }
            },
            showItemInfo(params) {
                this.$emit('showItemInfo', params);
            },
            focusOnTab(plan) {
                if (!this.patient.plans || !this.$refs.tabs) return;

                this.$refs.tabs.switchPanel(plan);
            },
            editPLanField(planId, key, value) {
                this.$store.dispatch(PATIENT_PLAN_EDIT, {
                    planId,
                    key,
                    value,
                });
                this.changeTabHeaders(planId);
            },
            changeCurrentPLan(planId) {
                this.focusedPlanID = planId;
            },
            getItemTotalPrice(manipulations) {
                let totalPrice = 0;
                manipulations.forEach((m) => {
                    totalPrice += m.num * m.price;
                });
                return totalPrice;
            },
            getPlanTotalPrice(plan) {
                let totalPrice = 0;
                if (plan.procedures) {
                    plan.procedures.forEach((p) => {
                        if (p.manipulations) {
                            totalPrice += this.getItemTotalPrice(p.manipulations);
                        }
                    });
                }
                return totalPrice
                    ? `${totalPrice} ${this.currentClinic.currencyCode}`
                    : '';
            },
        },
        computed: {
            ...mapGetters({
                patient: 'getPatient',
                currentClinic: 'getCurrentClinic',
                getProceduresByIds: 'getProceduresByIds',
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
        watch: {
            // eslint-disable-next-line func-names
            // 'patient.ID': function (val) {
            //     if (val) {
            //         // this.getAllPlans();
            //     }
            // },
            // eslint-disable-next-line func-names
            'patient.currentPlan': function (plan) {
                if (plan) {
                    this.focusOnTab(plan);
                }
            },
        },
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
