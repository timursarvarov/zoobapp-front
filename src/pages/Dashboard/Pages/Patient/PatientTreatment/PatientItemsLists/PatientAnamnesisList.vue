<template lang="html">
    <div class="md-layout-item  md-size-100"></div>
</template>

<script>
import { mapGetters } from 'vuex';
import {} from '@/constants';
import components from '@/components';

export default {
    components: {
        ...components
    },
    props: {
        currentType: {
            type: String,
            default: 'anamnesis'
        }
    },
    data() {
        return {
            showDeleteForm: false
        };
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic',
            getProceduresByIds: 'getProceduresByIds'
        })
    },
    methods: {
        showItemInfo(params) {
            this.$emit('showItemInfo', params);
        }
    }
};
</script>
