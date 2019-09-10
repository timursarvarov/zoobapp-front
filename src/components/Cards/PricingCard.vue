<template>
    <md-card class="md-card-pricing" :class="cardClass">
        <slot name="category" />
        <md-card-content>
            <div class="md-card-icon" :class="iconColor">
                <slot name="icon" />
            </div>
            <slot name="title" />
            <slot name="description" />
        </md-card-content>
        <md-card-actions class="text-center">
            <slot name="footer" />
        </md-card-actions>
    </md-card>
</template>
<script>
export default {
    name: 'PricingCard',
    props: {
        cardClass: {
            type: String,
            default: ''
        },
        iconColor: {
            type: String,
            default: ''
        }
    }
};
</script>
<style></style>
