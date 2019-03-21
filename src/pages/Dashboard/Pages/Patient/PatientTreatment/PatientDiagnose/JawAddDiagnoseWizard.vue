<template>
  <md-dialog
      :md-active.sync="isDialogVisibleL"
      class="jaw-dialog-wrapper"
    >
    <div class="wizard-add-diagnose-form">
      <div >
        <simple-wizard>
          <template slot="header">
            <h5 class="title">{{selectedDiagnose.title}}</h5>
            <span>
              <span v-if="!isEmpty(diagnoseToCreate.teeth)" class="category">
                for:
                  <transition-group name="list">
                    <span v-for="(item, key) in diagnoseToCreate.teeth" :key="key"  class="list-item">
                        {{ key | toCurrentTeethSystem(teethSystem) }}
                    </span>
                  </transition-group>
              </span>
              <slide-y-down-transition>
                <span v-if="isEmpty(diagnoseToCreate.teeth)" class="category">
                Please select disease locations
                </span>
              </slide-y-down-transition>
            </span>
          </template>

          <wizard-tab
          v-if="selectedTeeth.length > 0"
          :before-change="() => validateStep('step1')">
            <template slot="label">
              Location
            </template>
            <tooth-locations
              ref="step1"
              :jaw="jaw"
              :prefer="prefer"
              :defaultLocations="defaultLocations"
              :error.sync="errorLocations"
              :selectedDiagnose="selectedDiagnose"
              :selectedTeeth="selectedTeeth"
              v-model="selectedDiagnoseLocal"
              :teethSchema="teethSchema"
              :teethSystem="teethSystem"
              @mounted-size="setSize"
            />
          </wizard-tab>

          <wizard-tab
          :before-change="() => validateStep('step2')">
            <template slot="label">
              Add description
            </template>
            <diagnose-description ref="step2"
            v-model="diagnoseToCreate.description"
            :size="jawListSize"
            :descriptions="diagnoseDescriptions"
            @on-validated="diagnoseCreated"/>
          </wizard-tab>

        </simple-wizard>
      </div>
    </div>
  </md-dialog>
</template>
<script>
  import { SlideYDownTransition } from 'vue2-transitions';
  import ToothLocations from './Wizard/ToothLocations.vue';
  import DiagnoseDescription from './Wizard/DiagnoseDescription.vue';
  import swal from 'sweetalert2';
  import { SimpleWizard, WizardTab } from '@/components';
  import { mapGetters } from 'vuex';
  import {
    USER_REGISTER,
    NOTIFY,
    AUTH_REQUEST,
    CLINIC_LOGO_UPLOAD,
    CLINIC_UPDATE,
  } from '@/store/modules/constants';

  export default {
    name: 'refistration-wizard',
    props: {
      isDialogVisible: {
        type: Boolean,
        default: false,
      },
        defaultLocations: {
        type: Object,
        default: () => {}
      },
        jaw: {
        type: Object,
        default: () => {}
      },
      prefer: {
        type: String,
        default: () => "diagnose"
      },
      selectedDiagnose: {
        type: Object,
        default: () => {
          return {
            code:'',
            title: '',
            locations: [],
          }
        }
      },
      selectedTeeth: {
        type: Array,
        default: () => []
      },
      // newDiagnoseParams: {
      //   type: Object,
      //   default: () => {}
      // },
      teethSchema: {
        type: Object,
        default: () => {}
      },
      teethSystem: {
        type: Number,
        default: () => 1
        // 1 = FDI World Dental Federation notation
        // 2 = Universal numbering system
        // 3 = Palmer notation method
      }
    },
    data() {
      return {
        errorLocations: {
          message: 'Choose tooth or disease location',
          type: 'locations',
          show: 'false'
        },
        jawListSize:{},
        diagnoseToCreate: {
          teeth: {},
          description:''
        },
      };
    },
    components: {
      DiagnoseDescription,
      SimpleWizard,
      WizardTab,
      ToothLocations,
      SlideYDownTransition
    },
    methods: {
      isEmpty(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) return false;
      }
       return true;
      },
      diagnoseCreated(d){
        this.$emit('on-created', this.diagnoseToCreate);
      },
      setSize(value){
        this.jawListSize = value;
      },
      validateStep(ref) {
        if (ref === 'step1') {
          return this.$refs[ref].validate().then((res) => {
            if(!res){
              this.$store.dispatch(NOTIFY, {
              settings: {
                message: 'Please choose diseas locations',
                type: 'warning',
              },
            });
            }
            return res;
          });
        } if (ref === 'step2') {
          return this.$refs[ref].validate().then((res) => {
            if(!res){
              this.$store.dispatch(NOTIFY, {
              settings: {
                message: 'Please add dignose description',
                type: 'warning',
                }
              })
              return false
              } else {
                this.isDialogVisibleL = false;
                 this.$store.dispatch(NOTIFY, {
                  settings: {
                    message: 'Diagnose added',
                    type: 'success',
                    }
                  })
              return res;
              }
          });
        }
      },
    },
    computed: {
      ...mapGetters({
        diagnoseDescriptions: 'diagnoseDescriptions',
      }),
      selectedDiagnoseLocal: {
        get: function() {
          return this.selectedDiagnose;
        },
        set: function(newValue) {
          this.diagnoseToCreate = {};
          this.diagnoseToCreate = newValue;
        },
      },
      isDialogVisibleL: {
        get() {
          return this.isDialogVisible;
        },
        set(value) {
          this.$emit('update:isDialogVisible', value);
        },
      },
    },
  };
</script>
<style lang="scss">
  .jaw-dialog-wrapper {
    min-width: 550px;
    min-height: 80%!important;
    max-height: 100% !important;
    background-color: transparent !important;
    box-shadow: none;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-font-smoothing: antialiased !important;
    .md-dialog-container{
      padding: 30px;
    }
    .tab-content{
      padding: 0;
    }
  .wizard-add-diagnose-form{
    .md-card-header{
      text-align: left;
      .list-item {
        display: inline-block;
        margin-right: 10px;
      }
      .list-enter-active, .list-leave-active {
        transition: all 1s;
      }
      .list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
        opacity: 0;
        transform: translateY(30px);
      }
    }
  }
}
</style>
