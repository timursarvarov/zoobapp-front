<template lang="html">
    <div class="md-layout-item  md-size-100"></div>
</template>

<script>
import { mapGetters } from 'vuex';
import components from '@/components';
// import DeleteForm from './DeleteForm.vue';
import { tObjProp } from '@/mixins';

export default {
    components: {
        ...components
        // DeleteForm,
    },
    mixins: [tObjProp],
    props: {
        currentType: {
            type: String,
            default: 'diagnosis'
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
<style lang="scss">
.set-diagnose-form {
    .tab-content > div {
        flex-grow: 1;
    }
    .md-card {
        box-shadow: none;
    }
}
</style>
