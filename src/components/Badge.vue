<template>
    <component :is="tag" :style="[{ 'background-color': `${color}` }]" class="badge" :class="`badge-${type}`">
        <slot />
    </component>
</template>
<script>
export default {
    name: 'Badge',
    props: {
        tag: {
            type: String,
            default: 'span'
        },
        color: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'default',
            validator: value => {
                const acceptedValues = ['primary', 'info', 'success', 'warning', 'danger', 'rose'];
                return acceptedValues.indexOf(value) !== -1;
            }
        }
    }
};
</script>
<style></style>
