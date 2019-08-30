<template>
    <div
        v-show="active"
        :id="tabId"
        class="tab-pane fade"
        role="tabpanel"
        :name="name"
        :aria-hidden="!active"
        :aria-labelledby="`step-${tabId}`"
        :class="{'active show': active}"
    >
        <slot :active="active" />
    </div>
</template>
<script>
export default {
    name: 'WizardTab',
    props: {
        label: String,
        name: String,
        id: String,
        beforeChange: Function,
    },
    inject: ['addTab', 'removeTab'],
    data() {
        return {
            tabName: this.name,
            active: false,
            checked: false,
            hasError: false,
            tabId: '',
        };
    },
    mounted() {
        this.addTab(this);
    },
    destroyed() {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
        this.removeTab(this);
    },
};
</script>
<style>
</style>
