<template>
    <component
        :is="tag"
        :style="[{'background-color':`${computedColor}`}]"
        class="badge"
        :class="`badge-${type}`"
    >
        <slot />
    </component>
</template>
<script>

const randomMC = require('random-material-color');

export default {
    name: 'Badge',
    props: {
        tag: {
            type: String,
            default: 'span',
        },
        textToColor: {
            type: [String, Number],
            default: null,
        },
        type: {
            type: String,
            default: 'default',
            validator: (value) => {
                const acceptedValues = [
                    'primary',
                    'info',
                    'success',
                    'warning',
                    'danger',
                    'rose',
                ];
                return acceptedValues.indexOf(value) !== -1;
            },
        },
    },
    data() {
        return {
            randomMC: null,
        };
    },
    computed: {
        computedColor() {
            const color = this.randomMC.getColor({ text: `${this.textToColor}` });
            return color;
        },
    },
    created() {
        this.randomMC = randomMC;
    },
};
</script>
<style>
</style>
