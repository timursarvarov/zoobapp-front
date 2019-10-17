<template>
    <div class="invices-list-wrapper">
        {{ getPaymentsAll }}
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'PatientBillingPayments',
    props: {},
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            getInvoicesAll: `${STORE_KEY_PATIENT}/getInvoicesAll`,
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            currentClinic: 'getCurrentClinic',
            getPaymentsAll: `${STORE_KEY_PATIENT}/getPaymentsAll`
        })
    }
};
</script>
