<template>
    <print-form v-if="showPrintForm" :showForm.sync="showPrintForm" :type="type" :selected-item="selectedItem" />
</template>
<script>
import { mapGetters } from 'vuex';
import { EB_SHOW_PATIENT_PRINT_FORM, STORE_KEY_PATIENT } from '@/constants';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';
import EventBus from '@/plugins/event-bus';
export default {
    components: {
        ...patientComponents
    },
    beforeDestroy() {
        EventBus.$off();
    },
    data() {
        return {
            showPrintForm: false,
            selectedTeeth: [],
            selectedItem: {},
            type: 'diagnosis'
        };
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`
        })
    },
    mounted() {
        EventBus.$on(EB_SHOW_PATIENT_PRINT_FORM, payLoad => {
            this.showItems(payLoad);
        });
    },
    methods: {
        showItems(payLoad) {
            this.selectedItem = payLoad.item;
            this.type = payLoad.type;
            this.showPrintForm = true;
        }
    }
};
</script>
