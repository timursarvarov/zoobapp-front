<template>
    <div class="invices-list-wrapper">
         <t-nosology-table
            :items="getInvoicesAll"
            :selected-items="selectedItems"
            current-type="invoices"
            @onSelected="onSelected"
        >
             <template slot="emptyState">
                <md-table-empty-state
                        :md-label="`No invoices found`"
                        md-description="To create invoice, firstly please aproove plan, and select unbilled procedures here"
                    >
                        <md-button
                            class="md-primary"
                        >
                            Create invoice
                        </md-button>
                    </md-table-empty-state>
            </template>
        </t-nosology-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import components from '@/components';

export default {
    name: 'PatientBillingInvoices',
    components: {
        ...components
    },
    props: {},
    data() {
        return {
            selectedItems:[],
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
        onSelected(){

        }
    },
};
</script>
