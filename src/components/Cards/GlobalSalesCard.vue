<template>
    <md-card class="md-card-global-sales">
        <md-card-header class="md-card-header-icon" :class="getClass(headerColor)">
            <slot name="header" />
        </md-card-header>

        <md-card-content>
            <slot name="content" />
        </md-card-content>
    </md-card>
</template>

<script>
export default {
    name: 'GlobalSalesCard',
    props: {
        headerColor: {
            type: String,
            default: ''
        }
    },
    methods: {
        getClass(headerColor) {
            return `md-card-header-${headerColor}`;
        }
    }
};
</script>

<style lang="css"></style>
