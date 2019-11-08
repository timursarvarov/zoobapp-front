<template>
    <div class="manipulations">
        <small v-for="(mID, i) in manipulationsIDs" :key="mID" class="items-manipulations_wrapper">
            <span class="text-left">{{ i + 1 }}. {{ allManipulations[mID].title }}</span>
            <div class="text-right">
                {{ allManipulations[mID].qty }} * {{ allManipulations[mID].price | currency('') }} =
                {{ allManipulations[mID].totalPrice | currency }}
            </div>
            <br />
        </small>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'ManipulationsBox',
    components: {},
    props: {
        manipulationsIDs: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            allManipulations: `${STORE_KEY_PATIENT}/getAllManipulations`
        })
    },
    methods() {}
};
</script>
