<template>
    <div class="print_patient_bio">
        <div class="print_patient_bio__image">
            <vue-qrcode tag="img" :options="{ width: 120 }" :value="patient.ID" />
        </div>
        <div class="print_patient_bio__text text">
            <div class="title">
                {{ patient.lastName | capitilize }}
                {{ patient.firstName | capitilize }}
            </div>
            <div class="sub_title">
                <div>
                    <small>
                        Phone:
                        <b>+{{ patient.phone }}</b>
                    </small>
                </div>
                <div v-if="patient.birthday">
                    <small>
                        Birth date
                        <b>{{ patient.birthday | moment('YYYY/MMMM/D')  }}</b>
                    </small>
                </div>
                <div v-if="patient.address">
                    <small>
                        Address
                        <b>{{ patient.address }}</b>
                    </small>
                </div>
                <div v-if="patient.email">
                    <small>
                        email
                        <b>{{ patient.email }}</b>
                    </small>
                </div>
                <div v-if="patient.allergy && patient.allergy.length > 0" class="allergy_wrapper">
                    <b>ALLERGY</b>:
                    <span v-for="(a, i) in patient.allergy" :key="i" class="allergy">
                        <span>
                            {{ a }}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VueQrcode from '@chenfengyuan/vue-qrcode';

export default {
    name: 'TPrintFormPatientBio',
    components: {
        VueQrcode
    },
    props: {
        patient: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            editor: null
        };
    },
    computed: {
        window() {
            return window;
        }
    }
};
</script>
