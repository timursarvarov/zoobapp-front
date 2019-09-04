
<template lang="html">
    <div class="md-layout-item  md-size-100">
        <items-list
            v-if="$route.name ==='anamnesis' && patient.anamnesis && patient.anamnesis.length > 0"
            :items="patient.anamnesis||[]"
            :teeth-system="currentClinic.teethSystem"
            current-type="anamnesis"
            @showItemInfo="showItemInfo"
            @onJawChanged="recalculateJaw()"
        />
        <delete-form
            v-if="patient.currentPlan"
            text="Delete Plan?"
            :show-form.sync="showDeleteForm"
            :item-to-delete="patient.currentPlan"
            :patient-i-d="patient.ID"
            current-type="plan"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    PATIENT_PLAN_EDIT,
    PATIENT_ITEM_VISIBILITY_TOGGLE,
} from '@/constants';
import components from '@/components';
import ItemsList from './ItemsList.vue';
import { tObjProp } from '@/mixins';

export default {
    components: {
        ...components,
        ItemsList,
    },
    mixins: [tObjProp],
    props: {
        currentType: {
            type: String,
            default: 'anamnesis',
        },
    },
    data() {
        return {
            showDeleteForm: false,
        };
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic',
            getProceduresByIds: 'getProceduresByIds',
        }),
    },
    methods: {
        showItemInfo(params) {
            this.$emit('showItemInfo', params);
        },
    },
};
</script>
<style lang="scss">
.set-diagnose-form {
    .tab-content > div {
        flex-grow: 1;
    }
    .md-card {
        box-shadow: none;
    }
}
</style>