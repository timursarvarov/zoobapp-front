<template>
    <div class="procedures">
        <small v-for="(p, i) in procedures" :key="p.ID" class="items-manipulations_wrapper">
            <span class="text-left"> {{ i + 1 }}. {{ p.title }} - ({{ getManipulationsByProcedureID(p.ID).length }}manipulations) </span>
            <div class="text-right">
                {{ procedureTotalPrice(p.ID) | numSeparator }}&nbsp;
                <small>{{ currentClinic.currencyCode }}</small>
            </div>
            <br />
        </small>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

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
            currentClinic: 'getCurrentClinic',
            getProceduresByIds: 'getProceduresByIds',
            getManipulationsByProcedureID: `${STORE_KEY_PATIENT}/getManipulationsByProcedureID`
        }),
        procedures() {
            return this.getProceduresByIds(this.proceduresIds);
        }
    },
    methods: {
        procedureTotalPrice(ID) {
            const sum = this.getManipulationsByProcedureID(ID).reduce((a, b) => a + b.totalPrice, 0);
            return sum || 0;
        }
    }
};
</script>
