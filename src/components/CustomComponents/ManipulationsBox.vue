<template>
    <div class="manipulations">
        <small v-for="(m, i) in getManipulationsByProcedureID(procedureId)" :key="m.ID" class="items-manipulations_wrapper">
            <span class="text-left">{{ i + 1 }}. {{ m.title }}</span>
            <div class="text-right">
                {{ m.qty }} * {{ m.price || 0 | numSeparator }} =
                {{ m.totalPrice || 0 | numSeparator }}
                {{ currentClinic.currencyCode }}
            </div>
            <br />
        </small>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ManipulationsBox',
    components: {},
    props: {
        procedureId: {
            type: Number,
            default: () => null
        }
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            getManipulationsByProcedureID: 'getManipulationsByProcedureID'
        })
    }
};
</script>
