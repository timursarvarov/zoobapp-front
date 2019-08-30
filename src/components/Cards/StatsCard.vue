<template>
    <md-card class="md-card-stats">
        <md-card-header
            class="md-card-header-icon"
            :class="getClass(headerColor)"
        >
            <slot name="header" />
        </md-card-header>

        <md-card-actions md-alignment="left">
            <slot name="footer" />
        </md-card-actions>
    </md-card>
</template>
<script>
export default {
    name: 'StatsCard',
    props: {
        headerColor: {
            type: String,
            default: '',
        },
    },
    methods: {
        getClass(headerColor) {
            return `md-card-header-${headerColor}`;
        },
    },
};
</script>
