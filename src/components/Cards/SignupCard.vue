<template>
    <md-card class="md-card-signup">
        <slot name="title" />

        <md-card-content>
            <div class="md-layout">
                <slot name="content-left" />
                <slot name="content-right" />
            </div>
        </md-card-content>

        <md-card-actions>
            <slot name="footer" />
        </md-card-actions>
    </md-card>
</template>

<script>
export default {
    name: 'SignupCard'
};
</script>

<style lang="css"></style>
