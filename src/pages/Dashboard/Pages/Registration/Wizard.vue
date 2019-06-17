<template>
    <div class="md-layout md-gutter wizard-registration-form">
        <div class="md-layout-item md-size-66 md-xsmall-size-100 md-small-size-80 mx-auto">
            <simple-wizard>
                <template slot="header">
                    <h3 class="title">Build your profile</h3>
                    <h5 class="category">This information we will use to create your account.</h5>
                </template>

                <wizard-tab :before-change="() => validateStep('step1')">
                    <template slot="label">Email</template>
                    <get-email
                        ref="step1"
                        :error.sync="errorEmail"
                        @on-validated="onStepValidated"
                        @validated-email="setEmail"
                    />
                </wizard-tab>

                <wizard-tab :before-change="() => validateStep('step2')">
                    <template slot="label">Verification</template>
                    <check-email
                        ref="step2"
                        :email="email"
                        :error.sync="errorCode"
                        @validated-code="setCode"
                        @on-validated="onStepValidated"
                    />
                </wizard-tab>

                <wizard-tab :before-change="() => validateStep('step3')">
                    <template slot="label">Account</template>
                    <set-account
                        ref="step3"
                        :error.sync="errorAccount"
                        :email="email"
                        @validated-account="setAccount"
                        @on-validated="onStepValidated"
                    />
                </wizard-tab>

                <wizard-tab :before-change="() => validateStep('step4')">
                    <template slot="label">Clinic</template>
                    <set-clinic
                        ref="step4"
                        :error.sync="errorClinic"
                        @validated-clinicName="setClinicSettings"
                        @addedLogo="updateClinicLogo"
                        @on-validated="onStepValidated"
                    />
                </wizard-tab>
            </simple-wizard>
        </div>
    </div>
</template>
<script>
    import GetEmail from './Wizard/GetEmail.vue';
    import CheckEmail from './Wizard/CheckEmail.vue';
    import SetAccount from './Wizard/SetAccount.vue';
    import SetClinic from './Wizard/SetClinic.vue';
    // import swal from 'sweetalert2';
    import { SimpleWizard, WizardTab } from '@/components';
    import { mapGetters } from 'vuex';
    import {
        USER_REGISTER,
        NOTIFY,
        AUTH_REQUEST,
        CLINIC_LOGO_UPLOAD,
        CLINIC_UPDATE,
    } from '@/constants';

    export default {
        name: 'refistration-wizard',
        data() {
            return {
                wizardModel: {},
                code: null,
                email: null,
                account: {},

                errorEmail: {
                    type: 'email',
                    message: '',
                    exceptions: [],
                },
                errorCode: {
                    type: 'code',
                    message: '',
                    exceptions: [],
                },
                errorAccount: {
                    type: 'username',
                    message: '',
                    exceptions: [],
                },
                errorClinic: {
                    type: 'clinicName',
                    message: '',
                    exceptions: [],
                },
                username: '',
                firstName: '',
                lastName: '',
                password: '',
                clinicName: '',
            };
        },
        components: {
            GetEmail,
            CheckEmail,
            SetAccount,
            SetClinic,
            SimpleWizard,
            WizardTab,
        },
        methods: {
            updateClinicLogo(fd) {
                this.$store
                    .dispatch(CLINIC_LOGO_UPLOAD, {
                        fd,
                    })
                    .then((response) => {
                        console.log(response);
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Clinic logo uploaded',
                                type: 'success',
                            },
                        });
                    });
            },
            setAccount(account) {
                this.account = account;
            },
            setEmail(email) {
                this.email = email;
            },
            setCode(code) {
                this.code = code;
            },
            validateStep(ref) {
                if (ref === 'step1') {
                    return this.$refs[ref].validate().then((res) => {
                        // проверка на повторное запрещенное значение
                        if (
                            this.errorEmail.exceptions.some(
                                val => val === this.email,
                            )
                        ) {
                            this.errorEmail.message = 'Wrong code';
                            return false;

                        // в проверка на frontend валидацию и отправка в back
                        }
                        if (res) {
                            return Promise.resolve(this.sendValidateCode());
                        }
                        // ответ fronted валидации в случае не валидных данных
                        return res;
                    });
                }
                if (ref === 'step2') {
                    return this.$refs[ref].validate().then((res) => {
                        if (
                            this.errorCode.exceptions.some(val => val === this.code)
                        ) {
                            this.errorCode.message = 'Wrong code that was checked before';
                            return false;
                        }
                        if (res) {
                            return Promise.resolve(this.checkValidateCode());
                        }
                        return res;
                    });
                }
                if (ref === 'step3') {
                    return this.$refs[ref].validate().then((res) => {
                        if (
                            this.errorAccount.exceptions.some(
                                val => val === this.account,
                            )
                        ) {
                            this.errorAccount.message = 'Wrong code that was checked before';
                            return false;
                        }
                        if (res) {
                            return Promise.resolve(this.registrateUser());
                        }
                        return res;
                    });
                }
                if (ref === 'step4') {
                    return this.$refs[ref].validate().then((res) => {
                        if (res) {
                            return Promise.resolve(this.setClinicName());
                        }
                        console.log(1212);
                        return res;
                    });
                }
                return false;
            },
            sendValidateCode() {
                // отправлям email в backend
                // this.errorEmail.message = "This email is allready registrated"
                // this.errorEmail.exceptions.push(this.email)
                // return false;
                return true;
            },
            checkValidateCode() {
                // отправлям email в backend
                // this.errorCode.message = "Wrong code"
                // this.errorCode.exceptions.push(this.code)
                // console.log(this.code)
                return true;
            },
            registrateUser() {
                // return true;
                return new Promise((resolve, reject) => {
                    this.$store
                        .dispatch(USER_REGISTER, {
                            params: {
                                username: this.account.username,
                                password: this.account.password,
                                lastName: this.account.lastName,
                                firstName: this.account.firstName,
                            },
                        })
                        .then(
                            (response) => {
                                // this.$router.push('/');
                                console.log(response);
                                // return true;
                                resolve(this.login());
                            },
                            (error) => {
                                const err = error.response.data.error;
                                if (err === 'user_name exist') {
                                    this.errorAccount.message = 'Username already exist';
                                    this.errorAccount.exceptions.push(
                                        this.account.username,
                                    );
                                } else {
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message: 'error.response.data.error',
                                            type: 'warning',
                                        },
                                    });
                                }
                                // eslint-disable-next-line
                            reject(false);
                            // return false;
                            },
                        );
                });
            },
            login() {
                return new Promise((resolve, reject) => {
                    this.$store
                        .dispatch(AUTH_REQUEST, {
                            username: this.account.username,
                            password: this.account.password,
                        })
                        .then(
                            // (response) => {
                            (response) => {
                                if (response) {
                                    resolve(true);
                                }
                            },
                            (error) => {
                                reject(new Error(error));
                            },
                        );
                });
            },
            setClinicName() {
                return new Promise((resolve, reject) => {
                    this.$store
                        .dispatch(CLINIC_UPDATE, {
                            clinic: {
                                ID: this.currentClinic.ID,
                                name: this.clinicName,
                            },
                        })
                        .then(
                            (response) => {
                                if (response) {
                                    this.$router.push('/');
                                    resolve(true);
                                }
                            },
                            () => {
                                reject(new Error(false));
                            },
                        );
                });
            },
            setClinicSettings(name) {
                this.clinicName = name;
            },
            onStepValidated(validated, model) {
                this.validated = validated;
                this.wizardModel[model] = validated;
            },
            wizardComplete() {
                // swal({
                //     title: 'Good job!',
                //     text: 'You clicked the finish button!',
                //     type: 'success',
                //     confirmButtonClass: 'md-button md-success',
                //     buttonsStyling: false,
                // });
            },
        },
        computed: {
            ...mapGetters({
                currentClinic: 'getCurrentClinic',
            }),
        },
    };
</script>
<style lang="scss">
.wizard-registration-form {
    span.md-error {
        padding-left: 38px !important;
    }
    // .md-input-action{
    //     position: absolute;
    //     .md-ripple{
    //         padding: 0 !important;
    //          display: flex;
    //         align-items: center;
    //         justify-content: center;
    //             position: relative;
    //         .md-button-content{
    //             width: 100%;
    //             height: 100%;
    //               display: flex;
    //             align-items: center;
    //             justify-content: center;
    //             // align-self: center!important;
    //             margin: auto;
    //             .md-icon{
    //                  align-self: center;
    //             }
    //         }
    //     }
    // }
}
</style>
