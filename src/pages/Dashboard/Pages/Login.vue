/* eslint-disable no-unused-vars */
<template>
    <div class="md-layout login-wrapper text-center">
        <div
            class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
        >
            <!-- <form> -->
            <login-card header-color="green">
                <h4 slot="title" class="title">Log in</h4>
                <md-button slot="buttons" class="md-just-icon md-simple md-white">
                    <i class="fab fa-facebook-square"></i>
                </md-button>
                <md-button slot="buttons" class="md-just-icon md-simple md-white">
                    <i class="fab fa-twitter"></i>
                </md-button>
                <md-button slot="buttons" class="md-just-icon md-simple md-white">
                    <i class="fab fa-google-plus-g"></i>
                </md-button>
                <p slot="description" class="description">Or Be Classical</p>
                <div slot="inputs">
                    <md-field
                        class="md-form-group with-subline"
                        :class="[
                {'md-valid': !errors.has('username') && touched.username},
                {'md-error': errors.has('username')}]"
                    >
                        <md-icon>face</md-icon>
                        <label>User Name</label>
                        <md-input
                            ref="username"
                            autocomplete="username"
                            v-model="username"
                            v-on:keyup.enter="focusOn('password')"
                            data-vv-name="username"
                            type="username"
                            required
                            v-validate="modelValidations.username"
                        ></md-input>
                        <span class="md-error">{{errors.first('username')}}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('username')"
                                @click="username='',focusOn('login')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('username')  && touched.username"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>

                    <md-field
                        class="md-form-group with-subline"
                        slot="inputs"
                        :class="[{'md-error': errors.has('password')},
                            {'md-valid': !errors.has('password') && touched.password}]"
                    >
                        <md-icon>lock_outline</md-icon>
                        <label>Password</label>
                        <md-input
                            ref="password"
                            autocomplete="password"
                            v-on:keyup.enter="login()"
                            v-model="password"
                            data-vv-name="password"
                            type="password"
                            required
                            v-validate="modelValidations.password"
                        ></md-input>
                    </md-field>
                    <div class="md-layout">
                        <small
                            class="md-simple ml-auto"
                            @click="showForgot = !showForgot"
                        >Forgot password?</small>
                    </div>
                </div>
                <md-button slot="footer" @click="login" class="md-simple md-success md-lg">Lets Go</md-button>
            </login-card>
            <!-- </form> -->
        </div>
        <forgot-password :showForm.sync="showForgot" />
    </div>
</template>
<script>
    import { SlideYDownTransition } from 'vue2-transitions';
import { setTimeout } from 'timers';
    import components from '@/components';
    import {
        AUTH_REQUEST, NOTIFY, CLINIC_AUTH_REQUEST, SERVER_ERRORS,
    } from '@/constants';
    import ForgotPassword from './ForgotPassword.vue';

    export default {
        name: 'login',
        components: {
            ...components,
            SlideYDownTransition,
            ForgotPassword,
        },
        data() {
            return {
                showForgot: false,
                username: null,
                password: null,
                touched: {
                    username: false,
                    password: false,
                },
                modelValidations: {
                    username: {
                        required: true,
                        min: 5,
                    },
                    password: {
                        required: true,
                        min: 5,
                    },
                },
            };
        },
        methods: {
            focusOn(ref) {
                if (!this.$refs[ref]) {
                    return;
                }
                this.$refs[ref].$el.focus();
            },
            validate() {
                this.$validator.validateAll().then((isValid) => {
                    this.$emit('on-submit', this.registerForm, isValid);
                });
                this.touched.username = true;
                this.touched.password = true;
            },
            login() {
                //  this.$router.push('choose_clinic');
                //  return;
                const { username, password } = this;
                if (this.errors.has('username') || !this.username) {
                    this.showErrorsValidate('username');
                    this.$store.dispatch(NOTIFY, {
                        settings: { message: 'Введите валидный логин' },
                    });
                    return;
                }
                if (this.errors.has('password') || !this.password) {
                    this.showErrorsValidate('password');
                    this.$store.dispatch(NOTIFY, {
                        settings: { message: 'Введите валидный пароль' },
                    });
                    return;
                }
                this.$store.dispatch(AUTH_REQUEST, { username, password }).then(
                    (result) => {
                        if (result.organizations.length === 1) {
                            this.setClinic(result);
                        } else {
                            this.$router.push('choose_clinic');
                        }
                    },
                    (error) => {
                        if (error.code === SERVER_ERRORS.codes.LoginErrorCode) {
                            if (error.message === SERVER_ERRORS.messages.InvalidLoginErrorMessage) {
                                this.showErrorsValidate('username');
                            }
                            if (error.message === SERVER_ERRORS.messages.WrongPasswordErrorMessage) {
                                this.showErrorsValidate('password');
                            }
                        }
                    },
                );
            },
            setClinic(data) {
                this.$store
                    .dispatch(CLINIC_AUTH_REQUEST, {
                        clinicId: data.organizations[0].ID,
                        accessToken: data.accessToken,
                    })
                    .then(
                        (result) => {
                            if (result.accessToken) {
                                this.$router.push({ name: 'Dashboard', params: { lang: this.$i18n.locale } });
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        type: 'success',
                                        message: `Loging in ${data.organizations[0].name}`,
                                    },
                                });
                            }
                        },
                    );
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
        },
        mounted() {
            this.$nextTick(() => {
                const vm = this;
                setTimeout(() => {
                    if (vm.$refs.username) {
                        vm.$refs.username.$el.focus();
                    }
                }, 1000);
            });
        },
        watch: {
            username() {
                this.touched.username = true;
            },
            password() {
                this.touched.password = true;
            },
        },
    };
</script>

<style lang="scss">
.login-wrapper {
    small.md-simple {
        color: #3c4858;
        cursor: pointer;
    }
    .md-field {
        margin-top: 24px;
        .md-error {
            position: absolute;
            left: 36px !important;
            display: block !important;
            opacity: 1;
            // transform: translate3d(0,-12px,0);
            color: #ff1744;
            font-size: 0.6875rem;
            bottom: -1.3rem;
            line-height: normal;
            text-align: left;
        }
    }
}
</style>
