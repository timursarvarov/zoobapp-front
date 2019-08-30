<template>
    <div
        class="wizard-tab-content"
        :style="[
        {'min-width': size.width ? `${size.width}px`: `70vw`},
        {'min-height': `${size.height}px`} ]"
    >
        <div class="md-layout-item">
            <t-calendar v-if="showAppointment" />
        </div>
    </div>
</template>
<script>
export default {
  name: 't-item-appointment',
  components: {
    't-calendar': () => import('@/components/CustomComponents/TCalendar'),
  },
  props: {
    size: {
      type: Object,
      default: () => {},
    },
    showAppointment: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      modelValidations: {},
    };
  },
  methods: {
    validate() {
      return this.$validator.validateAll().then((res) => {
        this.$emit('on-validated', res, 'step2');
        this.$emit('validated-code', this.code);
        return res;
      });
    },
  },
  computed: {},
};
</script>
