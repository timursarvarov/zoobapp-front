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
                <md-table-empty-state :md-label="$t(`${$options.name}.noInvoiceTitle`)" :md-description="$t(`${$options.name}.noInvoiceDescription`)">
                    <md-button class="md-primary">{{ $t(`${$options.name}.createInvoice`) }}</md-button>
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
