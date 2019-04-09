<template lang="html">

  <div class="md-layout md-gutter treatment-wrapper">
      <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="md-layout-item" ref="wrjaw">
          <jaw
            :selectedTeeth="selectedTeeth"
            @onSelectedTeeth='onSelectedTeeth'
            :jaw="jaw"
            :patientTreatments="patient.treatments"
            :prefer="'treatment'"
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            >
            <div slot="title-start">
              <md-field class="md-layout-item no-margin" >
                    <label for="movie">Plans</label>
                    <md-select v-model="currentPlanId" name="plan" id="plan">
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
                  class="md-primary md-just-icon md-sm md-simple md-round"
                  @click="showAddPlan = true"
                >
                <md-icon>add</md-icon>
                  <md-tooltip md-delay="500">Add new plan</md-tooltip>
                </md-button>
              </div>
          </jaw>
        </div>
      </div>
      <div class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50">
          <t-collapse-search
          :style="[{'max-height': jawHeight + 'px'}]" class=" md-layout-item md-size-100 set-treatment-form md-small-size-100 md-xsmall-size-100 md-size-50"
          :items = "treatments"
          :selectedTeeth = "selectedTeeth"
          :favoriteItems = "favoriteTreatments"
          itemType = "Treatments"
          :jawHeight = "jawHeight"
          :showSlot = "patient.plans.length > 0 || currentPlanId"
          @onSetFavoritem = "setFavoriteTreatment"
          @onSelected = "selectTreatment"
          >
          <md-empty-state
            slot="empty-space"
            md-label="No plans created"
            md-description="To implemet a treatment, you should firstly create a plan">
            <md-button class="md-primary md-raised" @click="showAddPlan = true">Create New Plan</md-button>
          </md-empty-state>
          </t-collapse-search>
      </div>

      <div class="md-layout-item md-layout md-size-100" >
      <tabs
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
               <treatments-list
               :items="plan.treatments"
              @onJawChanged="recalculateJawTreatment()"
              :teethSystem="currentClinic.teethSystem"
            ></treatments-list>
            </div>
          </template>
      </tabs>
      <div class="md-layout-item md-layout md-size-100" >

        <jaw-add-treatment-wizard
          v-if="showForm"
          @on-created='saveTreatment'
          :currentPlan="currentPlan"
          :selectedTeeth="selectedTeeth"
          :selectedTreatment="selectedTreatment"
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

        </div>
        </div>
  </div>

</template>

<script>

    import {
      NOTIFY,
      PATIENT_TREATMETS_SET,
      PATIENT_PLAN_SET,
      PATIENT_PLAN_DELETE,
      USER_SET_PARAM,
      TREATMENTS,
    } from '@/constants';
    import { mapGetters } from 'vuex';
    import { TCollapseSearch, Jaw, Tabs } from '@/components';
    import TreatmentsList from './TreatmentsList.vue';
    import PlanAddForm from './PlanAddForm.vue';
    import JawAddTreatmentWizard from './JawAddTreatmentWizard.vue';
    import { tObjProp } from '@/mixins';

    export default {
      beforeRouteUpdate(to, from, next) {
        this.matchHeight();
      },
      name: 'treatments',
      mixins: [tObjProp],
      components: {
        TCollapseSearch,
        Tabs,
        Jaw,
        TreatmentsList,
        JawAddTreatmentWizard,
        PlanAddForm,
      },
      data() {
        return {
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
          treatmentOriginal: [],
          users: [],
          selectedTreatment: {},
        };
      },
      methods: {
        selectPlan(p) {
          if (this.patient.plans.findIndex(plan => plan.id === p.id) > -1) {
            this.currentPlanId = p.id;
          }
        },
        onSelectedTeeth(teeth) {
          this.selectedTeeth = teeth;
        },
        saveTreatment(t) {
          const treatmentL = this.copyObj(t);
          treatmentL.date = new Date();
          treatmentL.author = {
            ID: this.user.ID,
            avatar: this.user.avatar,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
          };
          treatmentL.showInJaw = true;
          treatmentL.id = Math.random();
          console.log(this.currentPlanId);
          console.log(treatmentL);
          this.$store.dispatch(PATIENT_TREATMETS_SET, {
            planId: this.currentPlanId,
            treatment: treatmentL,
          });
          this.selectedTeeth = [];
          this.recalculateJawTreatment();
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
          planL.treatments = [];
          planL.showInJaw = true;
          planL.id = Math.random();
          this.$store.dispatch(PATIENT_PLAN_SET, {
            plan: planL,
          });
          this.selectPlan(planL);
        },
        deletePlan(plan) {},
        selectTreatment(treatment) {
          if (treatment) {
            if (!this.isEmpty(treatment.locations) && this.selectedTeeth.length === 0) {
              this.$store.dispatch(NOTIFY, {
                settings: {
                  message: 'Please first select teeth',
                  type: 'warning',
                },
              });
            } else {
              Object.values(this.treatments).forEach((group) => {
                group.codes.forEach((treatmentOrigin) => {
                  if (treatmentOrigin.code === treatment.constCode) {
                    this.selectedTreatment = treatmentOrigin;
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
        setFavoriteTreatment(treatment) {
          const index = this.favoriteTreatments.findIndex(d => d === treatment.code);
          if (index === -1) {
            this.favoriteTreatments.unshift(treatment.code);
          } else {
            this.favoriteTreatments.splice(index, 1);
          }
          this.$store.dispatch(USER_SET_PARAM, {
            type: 'favoriteTreatments',
            value: this.favoriteTreatments,
          });
        },
        recalculateJawTreatment() {
          this.jaw.jawTreatment = JSON.parse(
            JSON.stringify(this.jawEthalon.jawTreatment),
          );
          // this.patient.treatments.forEach((treatment) => {
          //   if (treatment.showInJaw) {
          //     Object.keys(treatment.teeth).forEach((toothId) => {
          //       Object.keys(treatment.teeth[toothId]).forEach((kLocation) => {
          //         this.jaw.jawTreatment[toothId][kLocation] = treatment.teeth[toothId][kLocation];
          //       });
          //     });
          //   }
          // });
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
          favoriteTreatments: 'favoriteTreatments',
          teethSchema: 'teethSchema',
          currentClinic: 'getCurrentClinic',
          user: 'getProfile',
        }),
        currentPlan() {
          let plan = {};
          const index = this.patient.plans.findIndex(planL => planL.id === this.currentPlanId);
          if (index > -1) {
            plan = this.patient.plans[index];
          }
          return plan;
        },
        treatments() {
          return TREATMENTS;
        },
        // patientTreatments() {
        //   if (this.patient) {
        //     return this.patient.treatments;
        //   }
        //   return [];
        // },
        // filteredTreatments() {
        //   return this.getFilteredTreatments();
        // },
        // getToggleAll() {
        //   if (this.search || this.toggleAll) {
        //     return true;
        //   }
        //   return this.toggleAll;
        // },
      },
      mounted() {
        window.addEventListener('resize', this.matchHeight);
        this.matchHeight();
      },
    };
</script>
<style lang="scss">
.treatment-wrapper{
  .md-card{
    box-shadow:none;
    .tab-pane-1,
    .tab-pane-2,
    .tab-pane-3,
    .tab-pane-4,
    .tab-pane-5,
    .tab-pane-6,
    .tab-pane-7,
    .tab-pane-8,
    .tab-pane-9,
    .tab-pane-10, {
      width: 100%
    }
  }
.set-treatment-form {
   .md-icon{
      transition: all 250ms ease-in;
      transition-property: all;
      transition-duration: 250ms;
      transition-timing-function: ease-in;
      transition-delay: 0s;
    }
    .rotate{
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
  .treatment-code {
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
      padding: 0px 10px 25px 0;
      overflow: hidden;
      .md-collapse-title {
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 25px;
        .md-icon {
          top: 0;
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
