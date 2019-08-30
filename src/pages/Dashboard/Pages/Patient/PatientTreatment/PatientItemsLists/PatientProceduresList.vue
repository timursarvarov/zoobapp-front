
<template lang="html">
    <div class="md-layout-item  md-size-100">
        <md-toolbar
            class="md-transparent"
        >
            <div
                class="md-toolbar-row t-toolbar"
                style="margin-top:20px;margin-bottom:20px;"
            >
                <div class="md-layout">
                    <div class="md-layout-item t-toolbar__section md-size-16 ">
                        <div class=" t-toolbar__section-text">
                            <b>Plan Name</b>
                        </div>
                        <h3 class="title t-toolbar__section-text">
                            {{ currentPlan.name }}
                        </h3>
                    </div>
                    <div class="md-layout-item  t-toolbar__section md-size-16 ">
                        <div class=" t-toolbar__section-text">
                            <b>Unbilled procedures</b>
                        </div>
                        <h3 class="title t-toolbar__section-text">
                            <animated-number :value="currentPlanProcedures.length" />
                        </h3>
                    </div>
                    <div class="md-layout-item  t-toolbar__section md-size-16 ">
                        <div class=" t-toolbar__section-text ">
                            <b>Total Procedures</b>
                        </div>
                        <h3 class="title t-toolbar__section-text">
                            <animated-number :value="currentPlanProcedures.length" />
                        </h3>
                    </div>
                    <div class="md-layout-item  t-toolbar__section md-size-16 ">
                        <div class=" t-toolbar__section-text">
                            <b>Total Manipulations</b>
                        </div>
                        <h3 class="title t-toolbar__section-text">
                            <animated-number
                                :value="manipulationsByPlanID(currentPlan.ID).length"
                            />
                        </h3>
                    </div>
                    <div class="md-layout-item  t-toolbar__section md-size-16 ">
                        <div class=" t-toolbar__section-text">
                            <b>Total Price</b>
                        </div>
                        <h3 class="title t-toolbar__section-text">
                            <animated-number :value="getPlanTotalPrice" />
                            {{ currentClinic.currencyCode }}
                        </h3>
                    </div>
                </div>
            </div>
            <div class="md-toolbar-row">
                <div class="md-toolbar-section-start">
                    {{ currentPlan.state }}
                </div>

                <div class="md-toolbar-section-end">
                    <md-button
                        class="md-simple"
                    >
                        <md-icon>
                            edit
                        </md-icon>
                        Change plan title
                    </md-button>
                    <md-button
                        class="md-simple"
                        @click="showSnackbar = true"
                    >
                        <md-icon>
                            delete
                        </md-icon>
                        Delete plan
                    </md-button>
                    <md-button
                        class="md-primary"
                    >
                        <md-icon>
                            check
                        </md-icon>
                        Make primary
                    </md-button>
                </div>
            </div>
        </md-toolbar>
        <items-list
            :items="currentPlanProcedures"
            :teeth-system="currentClinic.teethSystem"
            current-type="procedures"
            @showItemInfo="showItemInfo"
            @onJawChanged="recalculateJaw()"
        />
        <md-snackbar
            :md-position="'center'"
            :md-duration="true ? Infinity : 4000"
            :md-active.sync="showSnackbar"
            md-persistent
        >
            <div class="snackbar-text-wrapper">
                Delete
                {{ currentPlan.name }}?
            </div>
            <div>
                <md-button
                    class="md-simple"
                    @click="showSnackbar = false"
                >
                    cancel
                </md-button>
                <md-button
                    :disabled="deleting"
                    class="md-warning"
                    @click="deletePlan()"
                >
                    <div v-if="deleting">
                        <md-progress-spinner
                            class="t-white"
                            :md-diameter="12"
                            :md-stroke="2"
                            md-mode="indeterminate"
                        />
                &nbsp;
                        <span>
                            Deleting...
                        </span>
                    </div>
                    <span v-else>
                        <md-icon>
                            delete
                        </md-icon>
                        delete
                    </span>
                </md-button>
            </div>
        </md-snackbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    NOTIFY,
    PATIENT_PLAN_EDIT,
    PATIENT_PLAN_DELETE,
    PATIENT_ITEM_VISIBILITY_TOGGLE,
} from '@/constants';
import components from '@/components';
import ItemsList from './ItemsList.vue';

export default {
    components: {
        ...components,
        ItemsList,
    },
    props:{
        currentPlan: {
            type: Object,
            default: ()=>{},
        }
    },
    data() {
        return {
            showSnackbar: false,
            deleting: false,
        };
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic',
            currentPlanProcedures: 'getPatientCurrentPlanProcedures',
            manipulationsByPlanID: 'getManipulationsByPlanID',
        }),
        getPlanTotalPrice() {
            return  this.manipulationsByPlanID(this.currentPlan.ID).reduce((a, b) => a + (b.totalPrice || 0), 0);
        },
    },
    methods: {
        showItemInfo(params) {
            this.$emit('showItemInfo', params);
        },
        redirectToPlan(){
            this.$router.push({
                name: 'procedures',
                params: {
                    lang: this.$i18n.locale,
                    patientID: this.patient.ID,
                },
            });
        },
        deletePlan() {
            this.deleting = true;
            this.$store.dispatch(PATIENT_PLAN_DELETE, {
                planID: this.currentPlan.ID,

            }).then().catch((err) => {
                this.showSnackbar = false;
                if(this.lodash.isEmpty(this.patient.plans)){
                    this.redirectToPlan()
                }
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: 'Plan deleted',
                        type: 'success',
                    },
                });
                console.log(err);
            }).then(() => {
                this.deleting = false;
                this.showSnackbar = false;
            });
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
