
<template lang="html">
    <div
        class="md-toolbar-row md-layout t-toolbar"
        style="margin-top:20px;margin-bottom:20px;"
    >
        <div
            v-for="(head, key) in headers"
            :key="key"
            class="md-layout-item t-toolbar__section"
        >
            <div class=" t-toolbar__section-text">
                <b>{{ head.title }} </b>
                <div v-if="head.subTitlePrefix !== undefined">
                    <small v-if="lodash.isNumber(head.subTitlePrefix)">
                        <animated-number
                            :to-fix="head.subTitleToFix"
                            :value="head.subTitlePrefix"
                        /> &nbsp;
                        {{ head.subTitlePostfix }}
                    </small>
                    <small v-else>
                        {{ head.subTitlePrefix }} &nbsp;
                        {{ head.subTitlePostfix }}
                    </small>
                </div>
            </div>
            <h3 class="title t-toolbar__section-text">
                <span v-if="lodash.isNumber(head.valuePrefix)">
                    <animated-number
                        :to-fix="head.valueToFix"
                        :value="head.valuePrefix"
                    />

                    <small>{{ head.valuePostfix }}</small>
                </span>
                <span v-else>
                    {{ head.valuePrefix }}
                    <small>{{ head.valuePostfix }}</small>
                </span>
            </h3>
        </div>
    </div>
</template>

<script>
import animatedNumber from '@/components/AnimatedNumber';

export default {
    components: {
        animatedNumber
    },
    props:{
        headers: {
            type: Array,
            default: ()=>[],
        }
    },
};
</script>
<style lang="scss">

