<template lang="html">

  <div class="md-layout md-gutter procedure-wrapper">
        <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="mx-auto" style="flex-grow:1;"  ref="wrjaw">
            <jaw
                    :selectedTeeth="selectedTeeth"
                    @onSelectedTeeth='onSelectedTeeth'
                    @showToothInfo='showToothInfo'
                    @toggleItemVisibility='toggleProcedureVisibility'
                    :jaw="jaw"
                    :patientItems="{
                                diagnosis: patient.diagnosis,
                                procedures: currentPlan.procedures,
                                anamnesis: patient.anamnesis,
                                }"
                    :teethSchema="teethSchema"
                    :teethSystem="currentClinic.teethSystem"
                    type="procedures"
                >
            <div slot="title-start">
              <md-field class="md-layout-item no-margin"
              >
                    <label for="plans">Plans</label>
                    <md-select
                    @md-selected = "changePLan"
                    v-model="currentPlanId"
                    name="plan" id="plan"
                    :disabled="patient.plans.length<1"
                    >
                    <md-option
                      v-for="(plan, index) in patient.plans"
                      :key="index"
                      :value="plan.id">{{plan.title}}</md-option>
                    </md-select>
                  </md-field>
              </div>
              <div class=""
                slot="title-end" >
                <md-button
                  class="md-primary md-sm md-simple "
                  @click="showAddPlan = true"
                >
                <md-icon>add</md-icon>
                add plan
                </md-button>
              </div>
          </jaw>
        </div>
      </div>
      <div class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50">
          <t-collapse-search
            :style="[{'max-height': jawHeight + 'px'}]" class="set-procedure-form"
            :items="procedures"
            :selectedTeeth="selectedTeeth"
            :favoriteItems="favoriteProcedures"
            itemType="Procedures"
            :jawHeight="jawHeight"
            :showSlot="patient.plans.length > 0 && !!currentPlanId"
            @onSetFavoritem="setFavoriteProcedure"
            @onSelected="selectProcedure"
            >
                <md-empty-state
                    slot="empty-space"
                    md-label="No created plans"
                    md-description="To implemet a procedure, you should firstly create a plan">
                    <md-button class="md-primary md-raised" @click="showAddPlan = true">Create New Plan</md-button>
                </md-empty-state>
          </t-collapse-search>
      </div>


      <tabs
      v-if="patient.plans.length > 0"
        ref="tabs"
        :tab-name="Object.values(patient.plans).map(e=>e.title)"
        color-button="warning"
        class="procedures-tabs"
      >
        <!-- <h4
          class="title"
          slot="header-title"
        >Navigation Pills - <small class="description">Horizontal Tabs</small></h4> -->
          <template
           v-for="(plan, index) in patient.plans"
          :slot="`tab-pane-${index+1}`">
            <div :key="index" >
                <procedures-list
                    :items="plan.procedures"
                    @editProcedure="editProcedure"
                    @onJawChanged="recalculateJawProcedure()"
                    :teethSystem="currentClinic.teethSystem"
                ></procedures-list>
            </div>
          </template>
      </tabs>


        <jaw-add-procedure-wizard
            v-if="showAddProcedureWizard"
            @on-created='saveProcedure'
            :currentPlan="currentPlan"
            :selectedTeeth="selectedTeeth"
            :selectedProcedure="selectedProcedure"
            :jaw='jaw'
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :isDialogVisible.sync="showAddProcedureWizard"
        />

        <plan-add-form
            :showForm.sync="showAddPlan"
            :plans="patient.plans"
            @onPlanCreated="setPlan"
        />

        <t-tooth-Items
            v-if="showToothProcedures"
            :showForm.sync="showToothProcedures"
            @editItem="editProcedure"
            :item="procedureToShow"
            :toothId="toothIdforProcedures"
            :patientItems = "currentPlan.procedures"
            :originalItems = "procedures"
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :jaw='jaw'
            classType="procedure"
        >
            <div slot="content" v-if="procedureToShow.manipulations.length > 0">
                <md-subheader>
                    Manipulations
                </md-subheader>
                <div class="md-layout-item">

                    <md-table v-model="procedureToShow.manipulations" table-header-color="green" >
                        <md-table-empty-state
                            md-label="No manipulations found"
                            md-description="please select manipilation">
                        </md-table-empty-state>
                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                            <md-table-cell md-label="Code">{{ item.manipulation.code }}</md-table-cell>
                            <md-table-cell md-label="Title">{{ item.manipulation.title }}</md-table-cell>
                            <md-table-cell  md-label="Qty" class="manipulations-input" >{{item.num}}</md-table-cell>
                            <md-table-cell >*</md-table-cell>
                            <md-table-cell md-label="Price">{{ item.price }}</md-table-cell>
                            <md-table-cell md-label="Total">{{ item.price * item.num }}</md-table-cell>
                        </md-table-row>
                    </md-table>
                    <div class="footer-table md-table">
                    <table>
                        <tfoot>
                            <tr>
                                <th class="md-table-head">
                                    <div class="md-table-head-container md-ripple md-disabled">
                                        <div class="md-table-head-label">
                                            Total manipulations: {{procedureToShow.manipulations.length}}
                                        </div>
                                    </div>
                                </th>
                                <th class="md-table-head">
                                    <div class="md-table-head-container md-ripple md-disabled">
                                        <div class="md-table-head-label">
                                            Total price:
                                            <!-- {{currencyCode}} -->
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            </div>
        </t-tooth-items>
  </div>

</template>

<script>
    import {
        NOTIFY,
        PATIENT_PROCEDURES_SET,
        PATIENT_PROCEDURE_UPDATE,
        PATIENT_PLAN_SET,
        PATIENT_PLAN_DELETE,
        PATIENT_TOGGLE_ITEM_VISIBILITY,
        PATIENT_PLAN_EDIT,
        USER_SET_PARAM,
        PROCEDURES,
    } from '@/constants';
    import { mapGetters } from 'vuex';
    import {
        TCollapseSearch, Jaw, Tabs, TToothItems,
    } from '@/components';
    import ProceduresList from './ProceduresList.vue';
    import PlanAddForm from './PlanAddForm.vue';
    import JawAddProcedureWizard from './JawAddProcedureWizard.vue';
    import { tObjProp } from '@/mixins';

    export default {
        name: 'procedures',
        mixins: [tObjProp],
        components: {
            TToothItems,
            TCollapseSearch,
            Tabs,
            Jaw,
            ProceduresList,
            JawAddProcedureWizard,
            PlanAddForm,
        },
        data() {
            return {
                showToothProcedures: false,
                toothIdforProcedures: 0,
                procedureIdtoShow: 0,
                currentPlanId: null,
                showAddPlan: false,
                showAddProcedureWizard: false,
                jawHeight: 0,
                showSelectedToothDialog: false,
                search: '',
                searched: [],
                selectedTeeth: [],
                firstTabs: [],
                toggleAll: false,
                fuse: false,
                filter: {},
                procedureOriginal: [],
                users: [],
                selectedProcedure: {},
            };
        },
        methods: {
            editProcedure(procedure) {
                if (!this.isEmpty(procedure.teeth)) {
                    this.selectedTeeth = Object.keys(procedure.teeth);
                }
                this.selectedProcedure = procedure;
                this.showAddProcedureWizard = true;
            },
            toggleProcedureVisibility(itemId) {
                if (itemId) {
                    this.$store.dispatch(PATIENT_TOGGLE_ITEM_VISIBILITY, {
                        params: {
                            itemId,
                            type: 'procedure',
                            planId: this.currentPlanId,
                        },
                    });
                }
                this.recalculateJawProcedure();
            },
            showToothInfo(procedureId, toothId) {
                this.toothIdforProcedures = toothId;
                this.procedureIdtoShow = procedureId;
                this.showToothProcedures = true;
            },
            changePLan(planId) {
                if (planId) {
                    this.patient.plans.forEach((plan) => {
                        if (plan.id !== planId && plan.showInJaw) {
                            this.$store.dispatch(PATIENT_PLAN_EDIT, {
                                planId: plan.id,
                                key: 'showInJaw',
                                value: false,
                            });
                        }
                    });
                    this.$store.dispatch(PATIENT_PLAN_EDIT, {
                        planId,
                        key: 'showInJaw',
                        value: true,
                    });
                    this.recalculateJawProcedure();
                }
            },
            focusOnLastTab(name) {
                if (this.$refs.tabs) {
                    this.$refs.tabs.switchPanel(name);
                }
            },
            selectPlan(p) {
                if (this.patient.plans.findIndex(plan => plan.id === p.id) > -1) {
                    this.currentPlanId = p.id;
                }
            },
            onSelectedTeeth(teeth) {
                this.selectedTeeth = teeth;
            },
            saveEditedProcedure(p) {
                this.$store.dispatch(PATIENT_PROCEDURE_UPDATE, {
                    params: {
                        procedure: p,
                        planId: this.currentPlanId,
                    },
                });
                this.recalculateJawProcedure();
            },
            saveProcedure(p) {
                if (p.id) {
                    this.saveEditedProcedure(p);
                    return;
                }
                const procedureL = this.copyObj(p);
                procedureL.date = new Date();
                procedureL.author = {
                    ID: this.user.ID,
                    avatar: this.user.avatar,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                };
                procedureL.showInJaw = true;
                procedureL.id = Math.random();
                this.$store.dispatch(PATIENT_PROCEDURES_SET, {
                    planId: this.currentPlanId,
                    procedure: procedureL,
                });
                // this.selectedTeeth = [];
                this.recalculateJawProcedure();
            },
            setPlan(p) {
                const planL = this.copyObj(p);
                planL.date = new Date();
                planL.author = {
                    ID: this.user.ID,
                    avatar: this.user.avatar,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                };
                planL.procedures = [];
                planL.showInJaw = true;
                planL.id = Math.random();
                this.$store.dispatch(PATIENT_PLAN_SET, {
                    plan: planL,
                });
                this.selectPlan(planL);
                this.focusOnLastTab(planL.title);
            },
            deletePlan(plan) {},
            selectProcedure(procedure) {
                if (procedure) {
                    if (
                        !this.isEmpty(procedure.locations)
                        && this.selectedTeeth.length === 0
                    ) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please first select teeth',
                                type: 'warning',
                            },
                        });
                    } else {
                        Object.values(this.procedures).forEach((group) => {
                            group.codes.forEach((procedureOrigin) => {
                                if (procedureOrigin.code === procedure.constCode) {
                                    this.selectedProcedure = procedureOrigin;
                                }
                            });
                        });
                        this.showAddProcedureWizard = true;
                    }
                }
            },
            matchHeight() {
                if (this.$refs.wrjaw) {
                    this.jawHeight = this.$refs.wrjaw.clientHeight;
                }
            },
            onLoad() {
                const index = this.patient.plans.findIndex(p => p.showInJaw);
                if (index > -1) {
                    this.currentPlanId = this.patient.plans[index].id;
                }
            },
            setFavoriteProcedure(procedure) {
                const index = this.favoriteProcedures.findIndex(
                    d => d === procedure.code,
                );
                if (index === -1) {
                    this.favoriteProcedures.unshift(procedure.code);
                } else {
                    this.favoriteProcedures.splice(index, 1);
                }
                this.$store.dispatch(USER_SET_PARAM, {
                    type: 'favoriteProcedures',
                    value: this.favoriteProcedures,
                });
            },
            recalculateJawProcedure() {
                if (this.jawEthalon.procedures) {
                    this.jaw.procedures = JSON.parse(
                        JSON.stringify(this.jawEthalon.procedures),
                    );
                    if (this.currentPlan.procedures) {
                        this.currentPlan.procedures.forEach((procedure) => {
                            if (procedure.showInJaw) {
                                Object.keys(procedure.teeth).forEach((toothId) => {
                                    Object.keys(procedure.teeth[toothId]).forEach(
                                        (kLocation) => {
                                            if (
                                                kLocation
                                                in this.jaw.procedures[toothId]
                                            ) {
                                                if (
                                                    !procedure.teeth[toothId][
                                                        kLocation
                                                    ]
                                                ) {
                                                    this.jaw.procedures[toothId][
                                                        kLocation
                                                    ] = procedure.teeth[toothId][
                                                        kLocation
                                                    ];
                                                }
                                            } else {
                                                this.jaw.procedures[toothId][
                                                    kLocation
                                                ] = procedure.teeth[toothId][
                                                    kLocation
                                                ];
                                            }
                                        },
                                    );
                                });
                            }
                        });
                    }
                }
            },
        },
        updated() {
            this.$nextTick(() => {
                this.matchHeight();
            });
        },
        destroyed() {
            window.removeEventListener('resize', this.matchHeight);
        },
        computed: {
            ...mapGetters({
                jaw: 'jaw',
                jawEthalon: 'jawEthalon',
                patient: 'getPatient',
                favoriteProcedures: 'favoriteProcedures',
                teethSchema: 'teethSchema',
                currentClinic: 'getCurrentClinic',
                user: 'getProfile',
            }),
            procedureToShow() {
                //    const d = Object.values(this.currentPlan).find( procedure => procedure.id === this.procedureIdtoShow,)
                const d = this.currentPlan.procedures.find(
                    procedure => procedure.id === this.procedureIdtoShow,
                );
                return d || {};
            },
            currentPlan() {
                let plan = {};
                const index = this.patient.plans.findIndex(
                    planL => planL.id === this.currentPlanId,
                );
                if (index > -1) {
                    plan = this.patient.plans[index];
                }
                return plan;
            },
            procedures() {
                return PROCEDURES;
            },
        },
        mounted() {
            window.addEventListener('resize', this.matchHeight);
            this.$nextTick(() => {
                this.matchHeight();
            });
            this.onLoad();
        },
    };
</script>
<style lang="scss">
.procedure-wrapper {
    .procedures-tabs {
        padding-left: 0;
        padding-right: 0;
    }
    .md-card {
        box-shadow: none;
        .tab-pane-1,
        .tab-pane-2,
        .tab-pane-3,
        .tab-pane-4,
        .tab-pane-5,
        .tab-pane-6,
        .tab-pane-7,
        .tab-pane-8,
        .tab-pane-9,
        .tab-pane-10 {
            width: 100%;
        }
    }
    .set-procedure-form {
        .md-icon {
            transition: all 250ms ease-in;
            transition-property: all;
            transition-duration: 250ms;
            transition-timing-function: ease-in;
            transition-delay: 0s;
        }
        .rotate {
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
        }
        .procedure-code {
            margin-right: 24px;
        }
        // .collapse-wrapper {
        //     border-style: solid;
        //     border-color: rgba(128, 128, 128, 0.212);
        //     border-width: 1px;
        //     border-radius: 3px;
        //     // margin: 20px 0 20px 0;
        //     overflow: hidden;
        //     overflow-y: scroll;
        //     // max-height: 40vh;
        //     // min-height: 30vh;
        //     padding: 20px 10px 20px 10px;
        //     &::-webkit-scrollbar {
        //         width: 7px;
        //         // background-color: transparent;
        //     }
        //     &::-webkit-scrollbar-thumb {
        //         background-color: grey;
        //         border-radius: 7px;
        //     }
        //     .md-collapse-label {
        //         // padding: 0px 10px 25px 0;
        //         overflow: hidden;
        //         .md-collapse-title {
        //             font-weight: 400;
        //             white-space: nowrap;
        //             overflow: hidden;
        //             text-overflow: ellipsis;
        //             margin-right: 25px;
        //             .md-icon {
        //                 top: 9px;
        //             }
        //         }
        //     }
        //     md-error .md-collapse-label:after {
        //         bottom: 6px;
        //     }

        //     .highlight {
        //         background-color: rgba(255, 255, 21, 0.979);
        //     }
        //     .md-list {
        //         .md-list-item {
        //             margin: 0;
        //         }
        //         background-color: #f7f7f7d5;
        //         border-style: solid;
        //         border-color: #eeecec9c;
        //         border-width: 1px;
        //         border-radius: 4px;
        //         margin-bottom: 15px;
        //     }
        //     .md-list-item-content {
        //         max-height: 64px;
        //         min-height: 44px;
        //         height: 44px;
        //         padding: 8px;
        //         // background-color: rgba(238, 236, 236, 0.201);
        //     }
        //     .dental {
        //         .md-list-item-text {
        //             cursor: not-allowed;
        //         }
        //     }
        //     .md-list-item-text {
        //         cursor: pointer;
        //     }
        //     .md-list-action {
        //         padding-right: 10px;
        //     }
        // }
        .noresult {
            color: red !important;
        }
        .md-checkbox {
            padding-top: 7px;
            margin-left: 17px;
        }
    }
}
</style>
