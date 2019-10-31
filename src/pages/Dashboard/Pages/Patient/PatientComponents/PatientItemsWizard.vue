<template>
    <t-wizard-add-item
        v-if="showAddItemWizard"
        :selected-item="selectedItem"
        :steps="stepsForWizard"
        :jaw="patient.jaw"
        :is-dialog-visible.sync="showAddItemWizard"
        :current-type="type"
        :single-item-name="singleItemName"
    />
</template>
<script>
import { mapGetters } from 'vuex';
import { EB_SHOW_ITEM_WIZARD , STORE_KEY_PATIENT} from '@/constants';
import components from '@/components';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';
import EventBus from '@/plugins/event-bus';
export default {
    components: {
        ...components,
        ...patientComponents
    },
    data() {
        return {
            showAddItemWizard: false,
            selectedTeeth: [],
            selectedItem: {},
            type: 'diagnosis'
        };
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            getPatientProcedureByID: `${STORE_KEY_PATIENT}/getPatientProcedureByID`,
            getPatientAnanmnesisByID: `${STORE_KEY_PATIENT}/getPatientAnanmnesisByID`,
            getPatientDiagnosisByID: `${STORE_KEY_PATIENT}/getPatientDiagnosisByID`
        }),
        singleItemName() {
            if (this.type === 'anamnesis') {
                return 'anamnes';
            }
            if (this.type === 'diagnosis') {
                return 'diagnose';
            }
            return 'procedure';
        },
        stepsForWizard() {
            if (this.type === 'anamnesis') {
                return ['locations', 'files', 'description'];
            }
            if (this.type === 'diagnosis') {
                return ['locations', 'files', 'description'];
            }
            if (this.type === 'procedures') {
                return ['locations', 'manipulations', 'files', 'description', 'appointment'];
            }
            return [];
        }
    },
    mounted() {
        EventBus.$on(EB_SHOW_ITEM_WIZARD, payLoad => {
            this.showItems(payLoad);
        });
    },
    beforeDestroy() {
        EventBus.$off();
    },
    methods: {
        showItems(payLoad) {
            console.log(payLoad.item)
            this.selectedItem = payLoad.item;
            this.type = payLoad.type;
            this.showAddItemWizard = true;
        },
    }
};
</script>
