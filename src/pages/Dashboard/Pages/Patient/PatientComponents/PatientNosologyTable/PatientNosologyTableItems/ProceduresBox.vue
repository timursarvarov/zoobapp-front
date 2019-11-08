<template>
    <div class="procedures">
        <small v-for="(p, i) in proceduresIds" :key="i" class="items-manipulations_wrapper">
            <span class="text-left"> {{ i + 1 }}. {{ procedures[p].title }} -
                {{ $tc(`${$options.name}.manipulationNum`, procedures[p].summary.manipulations) }}</span>
            <div class="text-right">{{ procedures[p].summary.totalPrice | currency }}&nbsp;</div>
            <br />
        </small>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'ProceduresBox',
    components: {},
    props: {
        proceduresIds: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            procedures: 'getProcedures'
        })
    }
};
</script>
