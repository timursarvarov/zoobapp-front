/* eslint-disable no-unused-vars */
<template>
    <div class="md-layout login-wrapper text-center">
        <div
            class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
        >
                <md-card>
                    <md-card-header class="md-card-header-icon md-card-header-green">
                        <div class="card-icon">
                            <md-icon>domain</md-icon>
                        </div>
                        <h4 class="title">Select Clinic</h4>
                    </md-card-header>

                    <md-card-content >
                        <div class="md-layout-item md-size-100">
                            <md-list>
                                <md-list-item v-for="(clinic, index) in clinics" :key="index">
                                    <md-radio
                                        v-model="checkedClinicId"
                                        :value="clinic.ID"
                                    >{{clinic.name | capitilize }}</md-radio>
                                </md-list-item>
                            </md-list>
                        </div>
                    </md-card-content>
                    <md-card-actions>
                            <md-button
                                :disabled="!checkedClinicId"
                                @click="setClinic()"
                                class="md-success"
                            >Choose</md-button>
                    </md-card-actions>
                </md-card>
        </div>
    </div>
</template>
<script>
    import { CLINIC_AUTH_REQUEST, NOTIFY } from '@/constants';
    import { mapGetters } from 'vuex';

    export default {
        components: {},
        data() {
            return {
                checkedClinicId: null,
            };
        },
        methods: {
            setClinic() {
                const currentTime = Math.floor(Date.now() / 1000);
                if (this.expiresAt < currentTime) {
                    this.$router.push('/login');
                } else {
                    this.$store
                        .dispatch(CLINIC_AUTH_REQUEST, {
                            clinicId: this.checkedClinicId,
                            accessToken: this.accessToken,
                        })
                        .then(
                            // eslint-disable-next-line no-unused-vars
                            (response) => {
                                this.$router.push('/');
                            },
                            (error) => {
                                if (error && error.response) {
                                    if (error.response.data.message === 'Wrong password') {
                                        this.showErrorsValidate('password');
                                    }
                                    if (error.response.data.message === 'Invalid login') {
                                        this.showErrorsValidate('username');
                                    }
                                }
                            },
                        );

                }
            },
        },
        computed: {
            ...mapGetters({
                clinics: 'getClinics',
                accessToken: 'fetchStateAccessToken',
                expiresAt: 'expiresAt',
            }),
        },
    };
</script>

<style lang="scss">
.login-wrapper {
    small.md-simple {
        color: #3c4858;
        cursor: pointer;
    }
}
</style>
