<template>
    <div class="md-layout">
        <div class="md-layout-item">
            <signup-card>
                <h2 slot="title" class="title text-center">
                    Register
                </h2>
                <div slot="content-left" class="md-layout-item md-size-50 md-medium-size-50 md-small-size-100 ml-auto">
                    <div v-for="item in contentLeft" :key="item.title" class="info info-horizontal">
                        <div :class="`icon ${item.colorIcon}`">
                            <md-icon>{{ item.icon }}</md-icon>
                        </div>
                        <div class="description">
                            <h4 class="info-title">
                                {{ item.title }}
                            </h4>
                            <p class="description">
                                {{ item.description }}
                            </p>
                        </div>
                    </div>
                </div>
                <div slot="content-right" class="md-layout-item md-size-50 md-medium-size-50 md-small-size-100 mr-auto">
                    <slide-x-left-transition>
                        <div v-if="boolean2">
                            <md-field
                                slot="inputs"
                                class="md-form-group"
                                :class="[{ 'md-valid': !errors.has('username') && touched.username }, { 'md-error': errors.has('username') }]"
                            >
                                <md-icon>face</md-icon>
                                <label>User Name</label>
                                <md-input
                                    ref="login"
                                    v-model="username"
                                    v-validate="modelValidations.username"
                                    autocomplete="username"
                                    data-vv-name="username"
                                    type="username"
                                    required
                                    @keyup.enter="passwordFocus()"
                                />
                                <span class="md-error">{{ errors.first('username') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('username')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('username') && touched.username" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                            <md-field
                                slot="inputs"
                                class="md-form-group"
                                :class="[{ 'md-valid': !errors.has('firstName') && touched.firstName }, { 'md-error': errors.has('firstName') }]"
                            >
                                <md-icon>looks_one</md-icon>
                                <label>First Name</label>
                                <md-input
                                    ref="login"
                                    v-model="firstName"
                                    v-validate="modelValidations.firstName"
                                    autocomplete="firstName"
                                    data-vv-name="firstName"
                                    type="firstName"
                                    required
                                    @keyup.enter="passwordFocus()"
                                />
                                <span class="md-error">{{ errors.first('firstName') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('firstName')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('firstName') && touched.firstName" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                            <md-field
                                slot="inputs"
                                class="md-form-group"
                                :class="[{ 'md-valid': !errors.has('lastName') && touched.lastName }, { 'md-error': errors.has('lastName') }]"
                            >
                                <md-icon>looks_two</md-icon>
                                <label>Last Name</label>
                                <md-input
                                    ref="login"
                                    v-model="lastName"
                                    v-validate="modelValidations.lastName"
                                    autocomplete="lastName"
                                    data-vv-name="lastName"
                                    type="lastName"
                                    required
                                    @keyup.enter="passwordFocus()"
                                />
                                <span class="md-error">{{ errors.first('lastName') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('lastName')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('lastName') && touched.lastName" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                            <md-field
                                slot="inputs"
                                class="md-form-group"
                                :class="[{ 'md-error': errors.has('password') }, { 'md-valid': !errors.has('password') && touched.password }]"
                            >
                                <md-icon>lock_outline</md-icon>
                                <label>Password</label>
                                <md-input
                                    ref="password"
                                    v-model="password"
                                    autocomplete="password"
                                    v-validate="modelValidations.password"
                                    data-vv-name="password"
                                    type="password"
                                    required
                                    @keyup.enter="login()"
                                />
                                <span class="md-error">{{ errors.first('password') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('password')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('password') && touched.password" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                            <md-field
                                slot="inputs"
                                class="md-form-group"
                                :class="[{ 'md-error': errors.has('password') }, { 'md-valid': !errors.has('password') && touched.password }]"
                            >
                                <md-icon>lock_outline</md-icon>
                                <label>Repeate Password</label>
                                <md-input
                                    ref="rPassword"
                                    v-model="rPassword"
                                    autocomplete="rPassword"
                                    v-validate="modelValidations.rPassword"
                                    data-vv-name="rPassword"
                                    type="rPassword"
                                    required
                                    @keyup.enter="login()"
                                />
                                <span class="md-error">{{ errors.first('rPassword') }}</span>
                                <slide-y-down-transition>
                                    <md-icon v-show="errors.has('rPassword')" class="error">
                                        close
                                    </md-icon>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('rPassword') && touched.rPassword" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                            <md-checkbox v-model="boolean">
                                I agree to the terms and conditions.
                            </md-checkbox>
                            <div><a>Terms and Conditions</a></div>
                        </div>
                    </slide-x-left-transition>
                    <div class="button-container">
                        <md-checkbox v-model="boolean2">
                            I agree to the terms and conditions.
                        </md-checkbox>
                        <md-button slot="footer" :disabled="!boolean" class="md-success md-round mt-4" @click="registrate()">
                            Get Started
                        </md-button>
                    </div>
                </div>
            </signup-card>
        </div>
    </div>
</template>
<script>
import { SlideYDownTransition, SlideXLeftTransition } from 'vue2-transitions';
import components from '@/components';
import { USER_REGISTER, NOTIFY } from '@/constants';

export default {
    name: 'Register',
    components: {
        ...components,
        SlideYDownTransition,
        SlideXLeftTransition
    },
    data() {
        return {
            firstName: null,
            lastName: null,
            username: null,
            boolean: false,
            boolean2: false,
            email: null,
            password: null,
            rPassword: null,
            touched: {
                lastName: false,
                firstName: false,
                username: false,
                password: false,
                rPassword: false
            },
            modelValidations: {
                username: {
                    required: true,
                    min: 5
                },
                password: {
                    required: true,
                    min: 5
                },
                lastName: {
                    required: true,
                    min: 2
                },
                firstName: {
                    required: true,
                    min: 2
                },
                rPassword: {
                    required: true,
                    min: 2,
                    confirmed: 'password'
                }
            },
            contentLeft: [
                {
                    colorIcon: 'icon-success',
                    icon: 'timeline',
                    title: 'Marketing',
                    description: "We've created the marketing campaign of the website. It was a very interesting collaboration."
                },

                {
                    colorIcon: 'icon-danger',
                    icon: 'code',
                    title: 'Fully Coded in HTML5',
                    description: "We've developed the website with HTML5 and CSS3. The client has access to the code using GitHub."
                },

                {
                    colorIcon: 'icon-info',
                    icon: 'group',
                    title: 'Built Audience',
                    description: 'There is also a Fully Customizable CMS Admin Dashboard for this product.'
                }
            ]
        };
    },
    watch: {
        username() {
            this.touched.username = true;
        },
        password() {
            this.touched.password = true;
        },
        firstName() {
            this.touched.firstName = true;
        },
        lastName() {
            this.touched.lastName = true;
        }
    },
    methods: {
        passwordFocus() {
            this.$refs.password.$el.focus();
        },
        validate() {
            this.$validator.validateAll().then(isValid => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
            this.touched.username = true;
            this.touched.password = true;
            this.touched.lastName = true;
            this.touched.firstName = true;
            this.touched.rPassword = true;
        },
        registrate() {
            if (this.errors.has('username') || !this.username) {
                this.showErrorsValidate('username');
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: this.errors.first('username'),
                        type: 'warning'
                    }
                });
                return;
            }
            if (this.errors.has('lastName') || !this.lastName) {
                this.showErrorsValidate('lastName');
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: this.errors.first('lastName'),
                        type: 'warning'
                    }
                });
                return;
            }
            if (this.errors.has('firstName') || !this.firstName) {
                this.showErrorsValidate('firstName');
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: this.errors.first('firstName'),
                        type: 'warning'
                    }
                });
                return;
            }
            if (this.errors.has('password') || !this.password) {
                this.showErrorsValidate('password');
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: this.errors.first('password'),
                        type: 'warning'
                    }
                });
                return;
            }
            if (this.errors.has('rPassword') || !this.rPassword) {
                this.showErrorsValidate('rPassword');
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: this.errors.first('rPassword'),
                        type: 'warning'
                    }
                });
                return;
            }
            this.$store
                .dispatch(USER_REGISTER, {
                    params: {
                        username: this.username,
                        password: this.password,
                        lastName: this.lastName,
                        firstName: this.firstName
                    }
                })
                .then(
                    response => {
                        if (response) {
                            this.$router.push('/');
                        }
                    },
                    error => {
                        if (error.response.data.message === 'Wrong password') {
                            this.showErrorsValidate('password');
                        }
                        if (error.response.data.message === 'Invalid login') {
                            this.showErrorsValidate('username');
                        }
                    }
                );
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
<style lang="scss" scoped>
div :not(.md-toolbar) > .md-field:not(.md-chips) .md-error {
    margin-left: 36px;
}
</style>
