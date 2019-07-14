<template lang="html">
    <div class="md-layout-item  md-size-100" >
        <keep-alive>
            <items-list
                v-if="currentType === 'anamnesis' && patient.anamnesis.length > 0"
                :items="patient.anamnesis||[]"
                @showItemInfo="showItemInfo"
                @onJawChanged="recalculateJaw()"
                @toggleItemVisibility="toggleItemVisibility"
                :teethSystem="currentClinic.teethSystem"
                type="anamnesis"
            >
            </items-list>
        </keep-alive>
        <items-list
            v-if="currentType === 'diagnosis' && patient.diagnosis.length > 0"
            :items="patient.diagnosis||[]"
            @showItemInfo="showItemInfo"
            @onJawChanged="recalculateJaw()"
            @toggleItemVisibility="toggleItemVisibility"
            :teethSystem="currentClinic.teethSystem"
            type="diagnosis"
            >
        </items-list>
        <t-tabs
                v-if="patient.plans.length > 0 && currentType === 'procedures' "
                @onChangeTab="onChangeTab"
                ref="tabs"
                :tab-name="tabHeaders"
                color-button="success"
                class="procedures-tabs"
            >
                <div
                    v-for="(plan, index) of plans"
                    :slot="`tab-pane-${index+1}`"
                    :key="plan.ID"
                    >
                    <!-- <div :key="index"> -->
                        <items-list
                            :key="plan.ID"
                            @onJawChanged="recalculateJaw()"
                            @toggleItemVisibility="toggleItemVisibility"
                            @showItemInfo="showItemInfo"
                            :teethSystem="currentClinic.teethSystem"
                            type="procedures"
                            :items="plan.procedures||[]"
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
                        <div class=" md-layout ml-auto">
                            <div class="ml-auto">
                                <md-button class="md-simple"
                                    @click="showDeleteForm = true"
                                    >
                                    Delete plan
                                </md-button>
                                <md-button
                                    :disabled="currentPlan.state === 1"
                                    class="md-success"
                                    @click="editPLanField( currentPlan.ID, 'state', 1)" >
                                    Approve plan
                                </md-button>
                            </div>
                        </div>
                    </template>
        </t-tabs>
        <plan-delete-form
            :showForm.sync="showDeleteForm"
            :plan="currentPlan"
            :patientID="patient.ID"
            @onPlanDeleted="onPlanDeleted"
        />

    </div>
</template>

<script>
    import {
        PATIENT_PLAN_EDIT,
        PATIENT_PLANS_GET,
    } from '@/constants';
    import { mapGetters } from 'vuex';
    import {
        TTabs,
    } from '@/components';
    import ItemsList from './ItemsList.vue';
    import PlanDeleteForm from './PlanDeleteForm.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TTabs,
            ItemsList,
            PlanDeleteForm,
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
                tabHeaders: [],
            };
        },
        methods: {
            initiateTabHeaders() {
                this.tabHeaders = [];
                if (this.patient.plans) {
                    this.headers = Object.values(this.patient.plans).forEach((p, i) => {
                        this.tabHeaders[i] = {
                            ID: p.ID,
                            name: p.name,
                            state: p.state === 1 ? 'approved' : '',
                            background: p.state === 1 ? '#00bcd4' : '',
                            price: this.getPlanTotalPrice(p),
                        };
                    });
                }
            },
            pushToHeader(p) {
                this.tabHeaders.push({
                    ID: p.ID,
                    name: p.name,
                    state: '',
                    background: '',
                    price: '',
                });
            },
            onChangeTab(index) {
                this.focusedPlanID = this.patient.plans[index].ID;
                this.$emit('onChangeTab', index);
            },
            toggleItemVisibility(itemId, itemType) {
                this.$emit('toggleItemVisibility', itemId, itemType);
            },
            showItemInfo(params) {
                this.$emit('showItemInfo', params);
            },
            onPlanCreated(p) {
                this.pushToHeader(p);
                this.focusOnTab(p.ID);
            },
            onPlanDeleted() {
                this.initiatePlans();
            },
            getAllPlans() {
                this.$emit('onLoadingAllPLans', true);
                this.$store.dispatch(PATIENT_PLANS_GET, {
                    patientId: this.patient.ID,
                }).then(
                    (resp) => {
                        this.$emit('onLoadingAllPLans', false);
                        if (resp.length > 0) {
                            this.initiatePlans();
                        }
                    },
                ).catch(() => {
                    this.$emit('onLoadingAllPLans', false);
                });
            },
            focusOnTab(ID) {
                this.focusedPlanID = ID;
                const index = this.patient.plans.findIndex(p => p.ID === ID);
                if (this.$refs.tabs && index > -1) {
                    this.$refs.tabs.switchPanel(this.patient.plans[index]);
                }
            },
            initiatePlans() {
                this.tabHeaders = [];
                this.initiateTabHeaders();
                const approvedIndex = this.patient.plans.findIndex(p => p.state === 1);
                if (approvedIndex > -1) {
                    this.focusOnTab(this.patient.plans[approvedIndex].ID);
                    this.$emit('onChangeTab', approvedIndex);
                } else if (this.patient.plans.length > 0) {
                    this.$emit('onChangeTab', 0);
                    this.focusOnTab(this.patient.plans[0].ID);
                }
            },
            changeTabHeaders(ID) {
                const pIndex = this.patient.plans.findIndex(p => p.ID === ID);
                const tabPlanIndex = this.tabHeaders.findIndex(p => p.ID === ID);
                if (pIndex > -1 && tabPlanIndex > -1) {
                    this.tabHeaders[tabPlanIndex].state = this.patient.plans[pIndex].state === 1 ? 'approved' : '';
                    this.tabHeaders[tabPlanIndex].background = this.patient.plans[pIndex].state === 1 ? '#00bcd4' : '';
                    this.tabHeaders[tabPlanIndex].price = this.getPlanTotalPrice(this.patient.plans[pIndex]);
                }
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
                return totalPrice ? `${totalPrice} ${this.currentClinic.currencyCode}` : '';
            },
        },
        computed: {
            ...mapGetters({
                patient: 'getPatient',
                currentClinic: 'getCurrentClinic',
            }),
            currentPlan() {
                const index = this.patient.plans.findIndex(p => p.ID === this.focusedPlanID);
                if (index > -1) {
                    return this.patient.plans[index];
                }
                return {};
            },
            plans() {
                return this.patient.plans;
            },
        },
        created() {
            if (this.patient.plans.length < 1) {
                this.getAllPlans();
            } else {
                this.initiatePlans();
            }
        },
        watch: {
            // eslint-disable-next-line func-names
            'patient.ID': function () {
                this.getAllPlans();
            },
        },
    };
</script>
<style lang="scss">
.set-diagnose-form {
    // .md-checkbox {
    //     padding-top: 7px;
    //     margin-left: 17px;
    // }
    .tab-content > div {
        flex-grow: 1;
    }
    .md-card {
        box-shadow: none;
    }
}
</style>
