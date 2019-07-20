<template>
  <span>{{animatedNumber}}</span>
</template>
<script>
    import TWEEN from '@tweenjs/tween.js';

    export default {
        props: {
            value: {
                default: 0,
            },
            duration: {
                type: Number,
                default: 800,
            },
            toFix: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                animatedNumber: 0,
            };
        },
        methods: {
            initAnimation(newValue, oldValue) {
                const vm = this;

                function animate() {
                    if (TWEEN.update()) {
                        requestAnimationFrame(animate);
                    }
                }

                new TWEEN.Tween({ tweeningNumber: oldValue })
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .to({ tweeningNumber: newValue }, this.duration)
                    .onUpdate((object) => {
                        vm.animatedNumber = object.tweeningNumber.toFixed(this.toFix);
                        // vm.animatedNumber = Number(object.tweeningNumber).toFixed(this.toFix);
                    })
                    .start();

                animate();
            },
        },
        mounted() {
            this.initAnimation(this.value, 0);
        },
        watch: {
            value(newValue, oldValue) {
                this.initAnimation(newValue, oldValue);
            },
        },
    };
</script>
<style>
</style>
