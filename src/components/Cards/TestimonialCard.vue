<template>
    <md-card class="md-card-testimonial">
        <md-card-header class="icon">
            <md-icon>
                <slot name="header-icon" />
            </md-icon>
        </md-card-header>

        <md-card-content>
            <slot name="content" />
        </md-card-content>

        <md-card-actions md-alignment="left">
            <slot name="footer" />
        </md-card-actions>
    </md-card>
</template>
<script>
export default {
    name: 'TestimonialCard',
};
</script>
