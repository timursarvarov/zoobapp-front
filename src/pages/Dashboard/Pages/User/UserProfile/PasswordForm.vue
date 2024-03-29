<template>
    <form>
        <md-card class="password-form-wrapper">
            <md-card-header class="md-card-header-icon md-card-header-green">
                <div class="card-icon">
                    <md-icon>lock</md-icon>
                </div>
                <h4 class="title">
                    {{ $t(`${$options.name}.passwordSettings`) }}
                </h4>
            </md-card-header>

            <md-card-content>
                <md-field
                    :class="[
                        { 'with-subline': true },
                        { 'md-valid': !errors.has('oldPassword') && touched.oldPassword },
                        { 'md-error': errors.has('oldPassword') }
                    ]"
                >
                    <label>{{ $t(`${$options.name}.oldPassword`) }}</label>
                    <md-input v-model="oldPassword" v-validate="modelValidations.oldPassword" data-vv-name="oldPassword" type="password" required />
                    <span class="md-error">{{ errors.first('oldPassword') }}</span>
                </md-field>

                <md-field
                    :class="[
                        { 'with-subline': true },
                        { 'md-error': errors.has('newPassword') },
                        { 'md-valid': !errors.has('newPassword') && touched.newPassword }
                    ]"
                >
                    <label>{{ $t(`${$options.name}.newPassword`) }}</label>
                    <md-input
                        ref="newPassword"
                        v-model="newPassword"
                        v-validate="modelValidations.newPassword"
                        data-vv-name="newPassword"
                        type="password"
                        required
                    />
                    <span class="md-error">{{ errors.first('newPassword') }}</span>
                </md-field>
                <md-field
                    :class="[
                        { 'with-subline': true },
                        { 'md-error': errors.has('rNewPassword') },
                        { 'md-valid': !errors.has('rNewPassword') && touched.rNewPassword }
                    ]"
                >
                    <label>{{ $t(`${$options.name}.rNewPassword`) }}</label>
                    <md-input
                        v-model="rNewPassword"
                        v-validate="modelValidations.rNewPassword"
                        data-vv-name="rNewPassword"
                        data-vv-as="newPassword"
                        type="password"
                        required
                    />
                    <span class="md-error">{{ errors.first('rNewPassword') }}</span>
                </md-field>
            </md-card-content>

            <md-card-actions>
                <md-button :disabled="loading" native-type="submit" class="md-success" @click.native.prevent="validate">
                    <span v-if="loading">
                        <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />
                        {{ $t(`${$options.name}.loading`) }}
                    </span>
                    <span v-else>
                        {{ $t(`${$options.name}.updatePassword`) }}
                    </span>
                </md-button>
            </md-card-actions>
        </md-card>
    </form>
</template>
<script>
import { USER_UPDATE, NOTIFY } from '@/constants';

export default {
    name: 'PasswordForm',
    data() {
        return {
            loading: false,
            oldPassword: '',
            newPassword: '',
            rNewPassword: '',
            touched: {
                oldPassword: false,
                newPassword: false,
                rNewPassword: false
            },
            modelValidations: {
                oldPassword: {
                    required: true,
                    min: 5
                },
                newPassword: {
                    required: true,
                    min: 5
                },
                rNewPassword: {
                    required: true,
                    min: 5,
                    confirmed: 'newPassword'
                }
            }
        };
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
        }
    },
    methods: {
        updatePassword() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loading = true;
                    this.$store
                        .dispatch(USER_UPDATE, {
                            user: {
                                password: this.oldPassword,
                                password_new: this.newPassword
                            }
                        })
                        .then(response => {
                            this.oldPassword = '';
                            this.newPassword = '';
                            this.rNewPassword = '';
                            this.$nextTick(() => this.$validator.reset());
                            if (response) {
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'Password updated successfully',
                                        type: 'success'
                                    }
                                });
                            }
                        })
                        .catch(err => {
                            if (err) {
                                if (err.response.data.message === 'Wrong password') {
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
                scope: this.$options.scope
            });
            if (!field) return;
            this.$validator.errors.add({
                id: errField,
                field: errField,
                msg: errField === 'username' ? 'Invalid login' : 'Wrong password',
                scope: this.$options.scope
            });
            field.setFlags({
                invalid: true,
                valid: false,
                validated: true
            });
        },
        validate() {
            this.$validator.validateAll().then(isValid => {
                this.$emit('on-submit', this.registerForm, isValid);
            });

            this.touched.oldPassword = true;
            this.touched.newPassword = true;
            this.touched.rNewPassword = true;
            this.updatePassword();
        }
    }
};
</script>
<style lang="scss">
.password-form-wrapper {
    .md-card .md-card-actions {
        border: none;
    }
}
</style>
