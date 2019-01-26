<template>

  <nav-tabs-card
    class="treatment-wrapper"
    v-if="patient.ID"
  >
    <template slot="content">
      <span class="md-nav-tabs-title">
        Set new:
      </span>
      <md-tabs
        :class="['md-' + currentTabColor()]"
        md-alignment="left"
        md-sync-route
      >
        <md-tab
          id="tab-anamnes"
          md-icon="history"
          md-label="Anamnes"
          :to="`/patient/${patient.ID}/treatment/anamnes`"
        >
          <div class="md-layout md-gutter">
            <div class="md-layout-item  md-small-size-100 md-xsmall-size-100">
              <jaw
                :prefer="'anamnes'"
                :jaw="jaw"
                v-model="selectedTeeth"
              >
                <div slot="bottom">
                  {{selectedTeeth}}

                  <md-button class="md-simple  jaw-state">
                    <div class="icon-wrapper">
                      <icon-base
                        class="icon-wrapper--item"
                        width="30"
                        height="30"
                        icon-name="icon-root-canal"
                      />
                      <small class="icon-wrapper--item">Pulpit</small>
                    </div>
                  </md-button>

                </div>
              </jaw>

            </div>
            <div
              class="md-layout-item  md-small-size-100 md-xsmall-size-100"
              style="overflow:scroll; height:400px;"
            >
              <md-button @click="Implant(selectedTeeth[0])">Implant</md-button>

            </div>

          </div>

          <!-- <jaw-anamnes></jaw-anamnes> -->
        </md-tab>

        <md-tab
          id="tab-diagnose"
          md-icon="create"
          md-label="Diagnose"
          :to="`/patient/${patient.ID}/treatment/diagnose`"
        >
          <div class="md-layout md-gutter ">
            <diagnose
              :selectedTeeth="selectedTeeth"
              v-model="selectedDiagnose"
            ></diagnose>

          </div>

        </md-tab>

        <md-tab
          id="tab-therapy"
          md-icon="add"
          md-label="Therapy"
          :to="`/patient/${patient.ID}/treatment/therapy`"
        ></md-tab>
        <md-tab
          id="tab-notes"
          md-icon="question_answer"
          md-label="Notes"
          :to="`/patient/${patient.ID}/treatment/notes`"
        >
          <notes></notes>
        </md-tab>
      </md-tabs>
    </template>
  </nav-tabs-card>

</template>

<script>
  import { mapGetters } from 'vuex';
  import { NavTabsCard, Jaw, IconBase } from '@/components';
  import { TEETH_INITIATION, PATIENT_GET } from '@/store/modules/constants';

  import {
    AnamnesList,
    Diagnose,
    DiagnoseList,
    Notes,
    JawAnamnes,
    TreatmentList,
  } from '@/pages';

  export default {
    components: {
      // JawCard,
      Jaw,
      NavTabsCard,
      JawAnamnes,
      Diagnose,
      DiagnoseList,
      Notes,
      TreatmentList,
      AnamnesList,
      IconBase,
    },
    data() {
      return {
        showDialog: false,
        actionSize: {},
        selectedTeeth: [],
        selectedDiagnose: [],
      };
    },
    methods: {
      isEmpty(obj) {
        // eslint-disable-next-line
      for (const key in obj) {
          // eslint-disable-next-line
        if (obj.hasOwnProperty(key)) return false;
        }
        return true;
      },
      Implant() {
        console.log(this.selectedTeeth);
        for (let index = 0; index < this.selectedTeeth.length; index += 1) {
          this.jaw.jawAnamnes[this.selectedTeeth[index]].implant = true;
          this.jaw.jawAnamnes[this.selectedTeeth[index]].root = false;
        }
      // this.jaw.jawAnamnes[17].implant = true;
      // this.jaw.jawAnamnes[17].root = false;
      },
      currentTabColor() {
        let color = '';
        if (this.$route.name === 'Anamnes') {
          color = 'warning';
        } else if (this.$route.name === 'Diagnose') {
          color = 'primary';
        } else if (this.$route.name === 'Therapy') {
          color = 'success';
        } else if (this.$route.name === 'Notes') {
          color = 'info';
        }
        return color;
      },
    },
    computed: {
      ...mapGetters({
        clinicSettings: 'getClinicSettings',
        toothLocations: 'toothLocations',
        teethBabyBottom: 'teethBabyBottom',
        teethBabyTop: 'teethBabyTop',
        teethBabyAll: 'teethBabyAll',
        teethAll: 'teethAll',
        teethAdultAll: 'teethAdultAll',
        teethAdultTop: 'teethAdultTop',
        teethAdultBottom: 'teethAdultBottom',
        jaw: 'jaw',
        patient: 'getPatient',
      }),
    },
    created() {
      this.$store.dispatch(TEETH_INITIATION);
      if (
        this.$route.params.patientId
      && (this.patient.ID === null
        || this.patient.ID !== parseInt(this.$route.params.patientId, 10))
      ) {
        this.$store.dispatch(PATIENT_GET, {
          patientId: this.$route.params.patientId,
        });
      }
    },
  };
</script>
<style lang="scss" >
.treatment-wrapper {
  padding-bottom: 50px;

  .md-tabs-navigation {
    overflow-x: auto;
    overflow-y: auto;
    &::-webkit-scrollbar {
      height: 7px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: white;
      border-radius: 7px;
    }
  }
  .text-right {
    display: flex;
  }
}
</style>
