<template>
  <component
  :style="[{'background-color':`${computedColor}`}]"
  :is="tag"
  class="badge"
  :class="`badge-${type}`">
    <slot></slot>
  </component>
</template>
<script>

    const randomMC = require('random-material-color');

    export default {
        name: 'badge',
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
        computed: {
            computedColor() {
                const color = this.randomMC.getColor({ text: `${this.textToColor}` });
                return color;
            },
        },
        data() {
            return {
                randomMC: null,
            };
        },
        created() {
            this.randomMC = randomMC;
        },
    };
</script>
<style>
</style>
