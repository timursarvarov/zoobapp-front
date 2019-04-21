<template lang="html">

  <div class="md-layout md-gutter procedure-wrapper">
      <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="md-layout-item" ref="wrjaw">
          <jaw
            :selectedTeeth="selectedTeeth"
            @onSelectedTeeth='onSelectedTeeth'
            @showToothInfo='showToothInfo'
            :jaw="jaw"
            :patientItems="currentPlan.procedures"
            :prefer="['procedure']"
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
          :style="[{'max-height': jawHeight + 'px'}, {'min-height': jawHeight + 'px'}]" class=" md-layout-item md-size-100 set-procedure-form md-small-size-100 md-xsmall-size-100 md-size-50"
          :items = "procedures"
          :selectedTeeth = "selectedTeeth"
          :favoriteItems = "favoriteProcedures"
          itemType = "Procedures"
          :jawHeight = "jawHeight"
          :showSlot = "patient.plans.length > 0 && !!currentPlanId"
          @onSetFavoritem = "setFavoriteProcedure"
          @onSelected = "selectProcedure"
          >
          <md-empty-state
            slot="empty-space"
            md-label="No created plans"
            md-description="To implemet a procedure, you should firstly create a plan">
            <md-button class="md-primary md-raised" @click="showAddPlan = true">Create New Plan</md-button>
          </md-empty-state>
          </t-collapse-search>
      </div>

      <div class="md-layout-item md-layout md-size-100" >
      <tabs
        ref="tabs"
        :tab-name="Object.values(patient.plans).map(e=>e.title)"
        color-button="warning"
      >
        <h4
          class="title"
          slot="header-title"
        >Navigation Pills - <small class="description">Horizontal Tabs</small></h4>
          <template
           v-for="(plan, index) in patient.plans"
          :slot="`tab-pane-${index+1}`">
            <div :key="index" >
               <procedures-list
               :items="plan.procedures"
              @onJawChanged="recalculateJawProcedure()"
              :teethSystem="currentClinic.teethSystem"
            ></procedures-list>
            </div>
          </template>
      </tabs>
      <div class="md-layout-item md-layout md-size-100" >

        <jaw-add-procedure-wizard
          v-if="showForm"
          @on-created='saveProcedure'
          :currentPlan="currentPlan"
          :selectedTeeth="selectedTeeth"
          :selectedProcedure="selectedProcedure"
          :jaw='jaw'
          :teethSchema="teethSchema"
          :teethSystem="currentClinic.teethSystem"
          :isDialogVisible.sync="showForm"
          />

        <plan-add-form
        :showForm.sync="showAddPlan"
        :plans="patient.plans"
        @onPlanCreated="setPlan"
        />

        <t-tooth-Items
        v-if="showToothProcedures"
        :showForm.sync="showToothProcedures"
        :toothId = "toothIdforProcedures"
        :patientItems = "currentPlan.procedures"
        :originalItems = "procedures"
        :teethSystem="currentClinic.teethSystem"
        :jaw='jaw'
        classType="procedure"
        />

        </div>
        </div>
  </div>

</template>

<script>
    import {
        NOTIFY,
        PATIENT_PROCEDURES_SET,
        PATIENT_PLAN_SET,
        PATIENT_PLAN_DELETE,
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
                currentPlanId: null,
                showAddPlan: false,
                showForm: false,
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
            showToothInfo(toothId) {
                this.toothIdforProcedures = toothId;
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
                this.$refs.tabs.switchPanel(name);
            },
            selectPlan(p) {
                if (this.patient.plans.findIndex(plan => plan.id === p.id) > -1) {
                    this.currentPlanId = p.id;
                }
            },
            onSelectedTeeth(teeth) {
                this.selectedTeeth = teeth;
            },
            saveProcedure(t) {
                const procedureL = this.copyObj(t);
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
                this.selectedTeeth = [];
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
                        this.showForm = true;
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
                                            this.jaw.procedures[toothId][
                                                kLocation
                                            ] = procedure.teeth[toothId][kLocation];
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
        .collapse-wrapper {
            border-style: solid;
            border-color: rgba(128, 128, 128, 0.212);
            border-width: 1px;
            border-radius: 3px;
            margin: 20px 0 20px 0;
            overflow: hidden;
            overflow-y: scroll;
            // max-height: 40vh;
            // min-height: 30vh;
            padding: 20px 10px 20px 10px;
            &::-webkit-scrollbar {
                width: 7px;
                background-color: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background-color: grey;
                border-radius: 7px;
            }
            .md-collapse-label {
                // padding: 0px 10px 25px 0;
                overflow: hidden;
                .md-collapse-title {
                    font-weight: 400;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-right: 25px;
                    .md-icon {
                        top: 9px;
                    }
                }
            }
            md-error .md-collapse-label:after {
                bottom: 6px;
            }

            .highlight {
                background-color: rgba(255, 255, 21, 0.979);
            }
            .md-list {
                .md-list-item {
                    margin: 0;
                }
                background-color: #f7f7f7d5;
                border-style: solid;
                border-color: #eeecec9c;
                border-width: 1px;
                border-radius: 4px;
                margin-bottom: 15px;
            }
            .md-list-item-content {
                max-height: 64px;
                min-height: 44px;
                height: 44px;
                padding: 8px;
                // background-color: rgba(238, 236, 236, 0.201);
            }
            .dental {
                .md-list-item-text {
                    cursor: not-allowed;
                }
            }
            .md-list-item-text {
                cursor: pointer;
            }
            .md-list-action {
                padding-right: 10px;
            }
        }
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
