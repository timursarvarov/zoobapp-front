<template>
    <form>
        <md-card class="password-form-wrapper">
            <md-card-header class="md-card-header-icon md-card-header-green">
                <div class="card-icon">
                    <md-icon>lock</md-icon>
                </div>
                <h4 class="title">Password Settings</h4>
            </md-card-header>

            <md-card-content>
                <md-field
                    :class="[
                        {'with-subline': true},
                        {'md-valid': !errors.has('oldPassword') && touched.oldPassword},
                        {'md-error': errors.has('oldPassword')}]"
                >
                    <label>Old Password</label>
                    <md-input
                        v-model="oldPassword"
                        data-vv-name="oldPassword"
                        type="password"
                        required
                        v-validate="modelValidations.oldPassword"
                    ></md-input>
                    <span class="md-error">{{errors.first('oldPassword')}}</span>
                </md-field>

                <md-field
                    :class="[
                        {'with-subline': true},
                        {'md-error': errors.has('newPassword')},
                        {'md-valid': !errors.has('newPassword') && touched.newPassword}]"
                >
                    <label>New Password</label>
                    <md-input
                        v-model="newPassword"
                        data-vv-name="newPassword"
                        type="password"
                        ref="newPassword"
                        required
                        v-validate="modelValidations.newPassword"
                    ></md-input>
                    <span class="md-error">{{errors.first('newPassword')}}</span>
                </md-field>
                <md-field
                    :class="[
                    {'with-subline': true},
                    {'md-error': errors.has('rNewPassword')},
                    {'md-valid': !errors.has('rNewPassword') && touched.rNewPassword}]"
                >
                    <label>Repeat New Password</label>
                    <md-input
                        v-model="rNewPassword"
                        data-vv-name="rNewPassword"
                        data-vv-as="newPassword"
                        type="password"
                        required
                        v-validate="modelValidations.rNewPassword"
                    ></md-input>
                    <span class="md-error">{{errors.first('rNewPassword')}}</span>
                </md-field>
            </md-card-content>

            <md-card-actions>
                <md-button
                    :disabled="loading"
                    native-type="submit"
                    @click.native.prevent="validate"
                    class="md-success"
                >
                <span v-if="loading">
                    Loading
                </span>
                <span v-else >
                    Update Password
                </span>

                </md-button>
            </md-card-actions>
        </md-card>
    </form>
</template>
<script>
    import { USER_UPDATE, NOTIFY } from '@/constants';

    export default {
        name: 'password-form',
        data() {
            return {
                loading: false,
                oldPassword: '',
                newPassword: '',
                rNewPassword: '',
                touched: {
                    oldPassword: false,
                    newPassword: false,
                    rNewPassword: false,
                },
                modelValidations: {
                    oldPassword: {
                        required: true,
                        min: 5,
                    },
                    newPassword: {
                        required: true,
                        min: 5,
                    },
                    rNewPassword: {
                        required: true,
                        min: 5,
                        confirmed: 'newPassword',
                    },
                },
            };
        },
        methods: {
            updatePassword() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        this.$store
                            .dispatch(USER_UPDATE, {
                                user: {
                                    password: this.oldPassword,
                                    password_new: this.newPassword,
                                },
                            })
                            .then((response) => {
                                this.oldPassword = '';
                                this.newPassword = '';
                                this.rNewPassword = '';
                                this.$nextTick(() => this.$validator.reset());
                                if (response) {
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message:
                                                'Password updated successfully',
                                            type: 'success',
                                        },
                                    });
                                }
                            })
                            .catch((err) => {
                                if (err) {
                                    if (
                                        err.response.data.message
                                        === 'Wrong password'
                                    ) {
                                        this.showErrorsValidate('oldPassword');
                                    }
                                }
                            })
                            .then(() => {
                                this.loading = false;
                            });
                    }
                });
            },
            showErrorsValidate(errField = 'username') {
                const field = this.$validator.fields.find({
                    name: errField,
                    scope: this.$options.scope,
                });
                if (!field) return;
                this.$validator.errors.add({
                    id: errField,
                    field: errField,
                    msg:
                        errField === 'username'
                            ? 'Invalid login'
                            : 'Wrong password',
                    scope: this.$options.scope,
                });
                field.setFlags({
                    invalid: true,
                    valid: false,
                    validated: true,
                });
            },
            validate() {
                this.$validator.validateAll().then((isValid) => {
                    this.$emit('on-submit', this.registerForm, isValid);
                });

                this.touched.oldPassword = true;
                this.touched.newPassword = true;
                this.touched.rNewPassword = true;
                this.updatePassword();
            },
        },
        watch: {
            oldPassword() {
                this.touched.oldPassword = true;
            },
            newPassword() {
                this.touched.newPassword = true;
            },
            rNewPassword() {
                this.touched.rNewPassword = true;
            },
        },
    };
</script>
<style lang="scss" >
.password-form-wrapper {
    .md-card .md-card-actions {
        border: none;
    }
}
</style>
