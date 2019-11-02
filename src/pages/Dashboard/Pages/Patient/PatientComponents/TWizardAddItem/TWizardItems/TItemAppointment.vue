<template>
    <div class="wizard-tab-content" :style="[{ 'min-width': size.width ? `${size.width}px` : `70vw` }, { 'min-height': `${size.height}px` }]">
        <div ref="contentHeight" v-if="showAppointment" class="md-layout-item">
            <t-calendar :contentHeight="size.height" />
        </div>
    </div>
</template>
<script>
import components from '@/components';
export default {
    name: 'TItemAppointment',
    components: {
        ...components
    },
    props: {
        size: {
            type: Object,
            default: () => {}
        },
        showAppointment: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            modelValidations: {}
        };
    },
    methods: {
        validate() {
            console.log(this.showAppointment);
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res);
                this.$emit('validated-code', this.code);
                return res;
            });
        }
    }
};
</script>
