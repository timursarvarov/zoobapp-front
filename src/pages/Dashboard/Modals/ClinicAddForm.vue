<template>
    <clinic-add-form
        v-if="showAddClinic"
        :showAddClinic.sync="showAddClinic"/>
</template>
<script>
import components from "@/components"


export default {
    name: 'ClinicAddForm',
    components: {
        ...components
    },
    data() {
        return{

        }
    },
    computed: {
        showAddClinic: {
            get() {
                return this.$clinicAddForm.clinicAddFormShown;
            },
            set() {
                // this.$clinicAddForm.clinicAddFormShown = !this.$clinicAddForm.clinicAddFormShown;
            }
        }
    },
};

</script>
