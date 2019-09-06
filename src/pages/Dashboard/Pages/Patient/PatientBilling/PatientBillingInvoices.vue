<template>
    <div class="invices-list-wrapper">
        <patient-nosology-table
            :items="getInvoicesAll"
            :selected-items="selectedItems"
            current-type="invoices"
            extraClass="no"
            @onSelected="onSelected"
        >
            <template slot="emptyState">
                <md-table-empty-state
                    :md-label="`No invoices found`"
                    md-description="To create invoice, firstly please aproove plan, and select unbilled procedures here"
                >
                    <md-button class="md-primary">Create invoice</md-button>
                </md-table-empty-state>
            </template>
        </patient-nosology-table>
    </div>
</template>
<script>
import components from '@/components';
import { mapGetters } from 'vuex';
import PatientNosologyTable from '@/pages/Dashboard/Pages/Patient/PatientNosologyTable';

export default {
    name: 'PatientBillingInvoices',
    components: {
        ...components,
        PatientNosologyTable
    },
    props: {},
    data() {
        return {
            selectedItems: []
        };
    },
    computed: {
        ...mapGetters({
            getInvoicesAll: 'getInvoicesAll',
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic'
        })
    },
    methods: {
        onSelected() {}
    }
};
</script>
