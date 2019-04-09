<template>
  <div ref="parent">
    <jaw-add-diagnose
      ref="jawadddiagnose"
      :jaw="jaw"
      :prefer="prefer"
      :selectedDiagnose="selectedDiagnose"
      :selectedTeeth="selectedTeeth"
      v-model="newDiagnoseParamsLocal"
      :teethSchema="teethSchema"
      :teethSystem="teethSystem"
      :defaultLocations="defaultLocations"
    >
    <div slot="title" >
      <slide-y-down-transition>
      <span v-show="errors.has('locations')"
        :class="[{'error': errors.has('locations')},
            {'md-valid': !errors.has('locations') && touched.locations}]"
      >{{errors.first('locations')}}</span>
      </slide-y-down-transition>
    </div>

    </jaw-add-diagnose>
    <div v-show="false">
      <md-field class="md-form-group" slot="inputs">
        <md-icon>lock_outline</md-icon>
        <label>code</label>
        <md-input
          v-model="locations"
          data-vv-name="locations"
          type="locations"
          v-validate="modelValidations.locations"
        ></md-input>
        <span class="md-error">{{errors.first('locations')}}</span>
        <slide-y-down-transition>
          <md-button
            v-show="errors.has('locations')"
            class="md-just-icon md-round md-input-action clear-button md-simple"
          >
            <md-icon class="error">close</md-icon>
          </md-button>
        </slide-y-down-transition>
        <slide-y-down-transition>
          <md-icon class="success" v-show="!errors.has('locations') && touched.locations">done</md-icon>
        </slide-y-down-transition>
      </md-field>
    </div>
  </div>
</template>
<script>
    import { JawAddDiagnose } from '@/components';
    import { SlideYDownTransition } from 'vue2-transitions';
    import { isEmpty } from '@/mixins';

    export default {
      mixins: [isEmpty],
      components: {
        SlideYDownTransition,
        JawAddDiagnose,
      },
      model: {
        prop: 'newDiagnoseParams',
        event: 'updateDiagonoseParams',
      },
      props: {
        error: {
          type: Object,
          default: () => ({
            message: 'Choose tooth or disease location',
            type: 'locations',
            show: 'false',
          }),
        },
        jaw: {
          type: Object,
          default: () => {},
        },
        defaultLocations: {
          type: Object,
          default: () => {},
        },
        // локации оригинального диагноза для проверки валидации
        originalLocations: {
          type: Object,
          default: () => {},
        },
        prefer: {
          type: String,
          default: () => 'diagnose',
        },
        selectedDiagnose: {
          type: Object,
          default: () => ({
            title: '',
            code: '',
          }),
        },
        selectedTeeth: {
          type: Array,
          default: () => [],
        },
        newDiagnoseParams: {
          type: Object,
          default: () => {},
        },
        teethSchema: {
          type: Object,
          default: () => {},
        },
        teethSystem: {
          type: Number,
          default: () => 1,
          // 1 = FDI World Dental Federation notation
          // 2 = Universal numbering system
          // 3 = Palmer notation method
        },
      },
      data() {
        return {
          diagnoseLocal: {},
          modelValidations: {
            locations: {
              required: true,
            },
          },
          dialogWidth: '',
          locations: '',
          touched: {
            locations: false,
          },
        };
      },
      methods: {
        matchWidth() {
          if (this.$refs.parent) {
            this.dialogWidth = this.$refs.parent.clientWidth;
            const size = {
              width: this.$refs.parent.clientWidth,
              height: this.$refs.parent.clientHeight,
            };
            this.$emit('mounted-size', size);
          }
        },
        validate() {
          return this.$validator.validateAll().then((res) => {
            this.$emit('on-validated', res);
            this.matchWidth();
            return res;
          });
        },
        isValidLoctions() {
          if (this.originalLocations === undefined) {
            return true;
          }
          if (this.isEmpty(this.originalLocations)) {
            return true;
          }
          return !this.isEmpty(this.diagnoseLocal.teeth);
        },
      },
      computed: {
        newDiagnoseParamsLocal: {
          get() {
            return this.newDiagnoseParams;
          },
          set(newValue) {
            this.$emit('updateDiagonoseParams', newValue);
            this.diagnoseLocal = {};
            this.diagnoseLocal = newValue;
            this.locations = this.isValidLoctions() ? 1 : '';
          },
        },
      },
      created() {
        this.locations = this.isValidLoctions() ? 1 : '';
      },
      watch: {
        locations() {
          this.touched.locations = true;
        },
      },
    };
</script>
<style>
</style>
