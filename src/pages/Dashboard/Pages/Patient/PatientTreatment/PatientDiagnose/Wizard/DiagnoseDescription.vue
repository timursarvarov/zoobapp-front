<template>
  <div :style="[{'min-width': `${size.width}px`},
          {'min-height': `${size.height}px`} ]">
    <h5 class="info-text">Write a diagnose description, or choose from templates.</h5>
    <div class="md-layout">
      <div class="md-layout-item md-size-100" ref="autocomplete">
        <mdt-auto-complite
          :mdFuzzySearch="true"
          v-model="selectedDescription"
          @md-selected="setDescription"
          :md-options="descriptionHeaders"
          :chooseContent="true"
        >
          <label>Templates</label>

          <template slot="md-autocomplete-item" slot-scope="{ item, term }">
            <md-highlight-text :md-term="term">{{ item }}</md-highlight-text>
          </template>

          <template slot="md-autocomplete-empty" slot-scope="{ term }">
            <div class="md-layout" style="white-space: pre-wrap;oveflow:hidden;">
              <span
                class="md-layout-item md-size-100"
                style="white-space: pre-wrap;oveflow:hidden;"
              >No templates "{{ term }}" were found.</span>
              <md-button
                style="min-width:40px;max-width:140px"
                class="md-primary md-layout-item mx-auto md-sm"
                @click="showPatientAddForm()"
              >CREATE TEMPLATE</md-button>
            </div>
          </template>
        </mdt-auto-complite>
      </div>
      <div class="md-layout-item md-size-100">
        <md-field>
          <label>Add description</label>
          <md-textarea ref="description" v-model="descriptionL"></md-textarea>
        </md-field>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line import/no-unresolved
  import { MdtAutoComplite } from '@/components';

  export default {
    components: {
      MdtAutoComplite,
    },
    model: {
      prop: 'description',
      event: 'updateDescription',
    },
    props: {
      description: {
        type: String,
        default: () => '',
      },
      descriptions: {
        type: Array,
        default: () => [],
      },
      size: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        selectedDescription: '',
        code: '',
        touched: {
          code: false,
        },
        modelValidations: {
          description: {
            required: true,
            min: 5,
          },
        },
      };
    },
    methods: {
      focusOn(ref) {
        if (!this.$refs[ref]) {
          return;
        }
        this.$refs[ref].$el.focus();
      },
      showErrorsValidate(error) {
        if (error.message === '') {
          return;
        }
        const field = this.$validator.fields.find({
          name: error.type,
          scope: this.$options.scope,
        });
        if (!field) return;
        this.$validator.errors.add({
          id: error.type,
          field: error.type,
          msg: error.message,
          scope: this.$options.scope,
        });
        field.setFlags({
          invalid: true,
          valid: false,
          validated: true,
        });
      },
      validate() {
        return this.$validator.validateAll().then((res) => {
          this.$emit('on-validated', res, 'step2');
          this.$emit('validated-code', this.code);
          return res;
        });
      },
      setDescription(key) {
        const desc = Object.values(this.descriptions).find(d => d.title === key);
        this.descriptionL = desc ? desc.description : '';
      },
    },
    computed: {
      descriptionHeaders: {
        get() {
          const descriptionTitles = Object.values(this.descriptions).map(
            d => d.title,
          );
          return descriptionTitles || [];
        },
        set() {},
      },
      descriptionL: {
        get() {
          return this.description;
        },
        set(value) {
          this.$emit('updateDescription', value);
        },
      },
    },
    mounted() {
      if (this.$refs.description) {
        this.$refs.description.$el.focus();
      }
    },
  };
</script>
<style lang="scss" >
.md-menu-content {
  z-index: 13;
  min-width: 300px;
}
.md-highlight-text-match {
  border-radius: 2px;
  background-color: yellow !important;
  padding: 0 !important;
}
</style>
