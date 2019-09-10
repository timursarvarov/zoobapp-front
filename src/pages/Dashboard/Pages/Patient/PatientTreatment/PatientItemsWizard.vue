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
import { EB_SHOW_ITEM_WIZARD } from '@/constants';
import components from '@/components';
import EventBus from '@/plugins/event-bus';
export default {
    components: {
        ...components
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
            patient: 'getPatient',
            getPatientProcedureByID: 'getPatientProcedureByID',
            getPatientAnanmnesisByID: 'getPatientAnanmnesisByID',
            getPatientDiagnosisByID: 'getPatientDiagnosisByID'
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
                return ['locations', 'manipulations', 'files', 'description', 'appointments'];
            }
            return [];
        }
    },
    mounted() {
        EventBus.$on(EB_SHOW_ITEM_WIZARD, payLoad => {
            this.showItems(payLoad);
        });
    },
    methods: {
        showItems(payLoad) {
            this.selectedItem = payLoad.item;
            this.type = payLoad.type;
            this.showAddItemWizard = true;
        },
        getItem(ID) {
            if (this.type === 'diagnosis' && ID) {
                return this.getPatientDiagnosisByID(ID);
            } else if (this.type === 'procedures' && ID) {
                return this.getPatientProcedureByID(ID);
            } else if (this.type === 'anamnesis' && ID) {
                return this.getAnamnesisById(ID);
            } else {
                return {};
            }
        }
    }
};
</script>
