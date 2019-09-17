<template>
    <div class="print_clinic_min">
        <div class="print_clinic_min_title">
            <div class="print_clinic_min_title__image">
                <img :src="currentClinic.logo" />
            </div>
            <div class="print_clinic_min_title__text">
                <div class="title">
                    {{ currentClinic.name }}
                </div>
                <div class="sub_title">
                    <div>
                        <small>
                            phone: <b>+{{ currentClinic.phone }}</b></small
                        >
                    </div>
                    <div>
                        <small>
                            url: <b>{{ currentClinic.url }}</b></small
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="print_clinic_min_info">
            <vue-qrcode tag="img" :options="{ width: 60 }" :value="currentClinic.url" />
        </div>
    </div>
</template>
<script>
import VueQrcode from '@chenfengyuan/vue-qrcode';

export default {
    name: 'TPrintFormPatientHeader',
    components: {
        VueQrcode
    },
    props: {
        currentClinic: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
        this.$emit('onMounted');
    },
    data() {
        return {
            editor: null
        };
    }
};
</script>
