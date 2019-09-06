<template>
    <div class="invices-list-wrapper">
        {{ getPaymentsAll }}
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import components from '@/components';

export default {
    name: 'PatientBillingPayments',
    components: {
        ...components
    },
    props: {},
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            getInvoicesAll: 'getInvoicesAll',
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic',
            getPaymentsAll: 'getPaymentsAll'
        })
    }
};
</script>
