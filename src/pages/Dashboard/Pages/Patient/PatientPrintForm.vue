<template>
    <print-form v-if="showPrintForm" :showForm.sync="showPrintForm" :type="type" :selected-item="selectedItem" />
</template>
<script>
import { mapGetters } from 'vuex';
import { EB_SHOW_PATIENT_PRINT_FORM } from '@/constants';
import components from '@/components';
import EventBus from '@/plugins/event-bus';
export default {
    components: {
        ...components
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
            patient: 'getPatient'
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
