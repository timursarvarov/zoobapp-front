/* eslint-disable no-unused-vars */
<template>
    <div class="md-layout login-wrapper text-center">
        <div class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100">
            <!-- <form> -->
            <login-card header-color="green">
                <h4 slot="title" class="title">
                    Log in
                </h4>
                <!-- <md-button slot="buttons" class="md-just-icon md-simple md-white">
                    <i class="fab fa-facebook-square" />
                </md-button>
                <md-button slot="buttons" class="md-just-icon md-simple md-white">
                    <i class="fab fa-twitter" />
                </md-button>
                <md-button slot="buttons" class="md-just-icon md-simple md-white">
                    <i class="fab fa-google-plus-g" />
                </md-button>
                <p slot="description" class="description">
                    Or Be Classical
                </p> -->
                <div slot="inputs">
                    <md-field
                        class="md-form-group with-subline"
                        :class="[{ 'md-valid': !errors.has('username') && touched.username }, { 'md-error': errors.has('username') }]"
                    >
                        <md-icon>face</md-icon>
                        <label for="userName">{{ $t(`${$options.name}.userName`) }}</label>
                        <md-input
                            if="userName"
                            v-focus
                            ref="username"
                            v-model="username"
                            v-validate="modelValidations.username"
                            autocomplete="username"
                            data-vv-name="username"
                            type="username"
                            required
                            @keyup.enter="focusOn('password')"
                        />
                        <span class="md-error">{{ errors.first('username') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('username')"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(username = ''), focusOn('login')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('username') && touched.username"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">
                                    done
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>

                    <md-field
                        slot="inputs"
                        class="md-form-group with-subline"
                        :class="[{ 'md-error': errors.has('password') }, { 'md-valid': !errors.has('password') && touched.password }]"
                    >
                        <md-icon>lock_outline</md-icon>
                        <label for="password">{{ $t(`${$options.name}.password`) }}</label>
                        <md-input
                            id="password"
                            ref="password"
                            v-model="password"
                            v-validate="modelValidations.password"
                            autocomplete="password"
                            data-vv-name="password"
                            type="password"
                            required
                            @keyup.enter="login()"
                        />
                        <span class="md-error">{{ errors.first('password') }}</span>
                    </md-field>
                    <div class="md-layout">
                        <small class="md-simple ml-auto" @click="showForgot = !showForgot">
                            {{ $t(`${$options.name}.forgotPassword`) }}
                        </small>
                    </div>
                </div>
                <md-button slot="footer" class="md-success md-simple" @click="login">
                    {{ $t(`${$options.name}.login`) }}
                </md-button>
            </login-card>
            <!-- </form> -->
        </div>
        <forgot-password :show-form.sync="showForgot" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SlideYDownTransition } from 'vue2-transitions';
import components from '@/components';
import { AUTH_REQUEST, NOTIFY, CLINIC_AUTH_REQUEST, SERVER_ERRORS } from '@/constants';
import ForgotPassword from './ForgotPassword.vue';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from) {
                vm.fromParams.from = from;
                vm.fromParams.clinicID = vm.clinic.ID;
            }
        });
    },
    name: 'Login',
    components: {
        ...components,
        SlideYDownTransition,
        ForgotPassword
    },
    data() {
        return {
            fromParams: {
                from: null,
                clinicID: null
            },
            showForgot: false,
            username: null,
            password: null,
            touched: {
                username: false,
                password: false
            },
            modelValidations: {
                username: {
                    required: true,
                    min: 5
                },
                password: {
                    required: true,
                    min: 5
                }
            }
        };
    },
    watch: {
        username() {
            this.touched.username = true;
        },
        password() {
            this.touched.password = true;
        }
    },
    computed: {
        ...mapGetters({
            clinic: 'getCurrentClinic'
        })
    },
    methods: {
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$refs[ref].$el.focus();
        },
        validate() {
            this.$validator.validateAll().then(isValid => {
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
                    settings: { message: this.errors.first('username') }
                });
                return;
            }
            if (this.errors.has('password') || !this.password) {
                this.showErrorsValidate('password');
                this.$store.dispatch(NOTIFY, {
                    settings: { message: this.errors.first('password') }
                });
                return;
            }
            this.$store.dispatch(AUTH_REQUEST, { username, password }).then(
                result => {
                    if (result.organizations && result.organizations.length === 1) {
                        this.setClinic(result);
                    } else {
                        this.$router.push('choose_clinic');
                    }
                },
                error => {
                    if (error.code === SERVER_ERRORS.codes.LoginErrorCode) {
                        if (error.message === SERVER_ERRORS.messages.InvalidLoginErrorMessage) {
                            this.showErrorsValidate('username');
                        }
                        if (error.message === SERVER_ERRORS.messages.WrongPasswordErrorMessage) {
                            this.showErrorsValidate('password');
                        }
                    }
                }
            );
        },
        setClinic(data) {
            this.$store
                .dispatch(CLINIC_AUTH_REQUEST, {
                    clinicId: this.fromParams.clinicID || data.organizations[0].ID,
                    accessToken: data.accessToken
                })
                .then(result => {
                    if (result.accessToken) {
                        if (this.fromParams.clinicID) {
                            this.$router.push(this.fromParams.from);
                        } else {
                            this.$router.push({ name: 'Dashboard', params: { lang: this.$i18n.locale } });
                        }
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                type: 'success',
                                message: `Loging in ${data.organizations[0].name}`
                            }
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
        }
    }
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
