
<template lang="html">
    <div class="md-layout-item  md-size-100" >
        {{patient.plans}}
            <items-list
                v-if="$route.name ==='anamnesis' && patient.anamnesis && patient.anamnesis.length > 0"
                :items="patient.anamnesis||[]"
                @showItemInfo="showItemInfo"
                @onJawChanged="recalculateJaw()"
                :teethSystem="currentClinic.teethSystem"
                currentType="anamnesis"
            >
            </items-list>
            <delete-form
                v-if="patient.currentPlan"
                text="Delete Plan?"
                :showForm.sync="showDeleteForm"
                :itemToDelete="patient.currentPlan"
                :patientID="patient.ID"
                currentType='plan'
            />
            </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {
        PATIENT_PLAN_EDIT,
        PATIENT_PLAN_CURRENT_SET,
        PATIENT_ITEM_VISIBILITY_TOGGLE,
    } from '@/constants';
    import components from '@/components';
    import ItemsList from './ItemsList.vue';
    import DeleteForm from './DeleteForm.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            ...components,
            ItemsList,
            DeleteForm,
        },
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
        methods: {
            showItemInfo(params) {
                this.$emit('showItemInfo', params);
            },
        },
        computed: {
            ...mapGetters({
                patient: 'getPatient',
                currentClinic: 'getCurrentClinic',
                getProceduresByIds: 'getProceduresByIds',
            }),
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
