
<template>
    <div>
        <h5 class="info-text">Let's start with the basic information</h5>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-50 md-small-size-100">
                <md-field
                    class="md-form-group"
                    slot="inputs"
                    :class="[
            {'md-valid': !errors.has('username') && touched.username},
            {'md-error': errors.has('username')}]"
                >
                    <md-icon>face</md-icon>
                    <label>User Name</label>
                    <md-input
                        ref="username"
                        autocomplete="username"
                        v-model="account.username"
                        v-on:keyup.enter="focusOn('firstName')"
                        data-vv-name="username"
                        type="username"
                        required
                        v-validate="modelValidations.username"
                    ></md-input>
                    <span class="md-error">{{errors.first('username')}}</span>
                    <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('username')"
                            @click="account.username='',focusOn('username')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                        >
                            <md-icon class="error">close</md-icon>
                        </md-button>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            class="success"
                            v-show="!errors.has('username') && touched.username"
                        >done</md-icon>
                    </slide-y-down-transition>
                </md-field>
                <md-field
                    class="md-form-group"
                    slot="inputs"
                    :class="[
            {'md-valid': !errors.has('firstName') && touched.firstName},
            {'md-error': errors.has('firstName')}]"
                >
                    <md-icon>looks_one</md-icon>
                    <label>First Name</label>
                    <md-input
                        ref="firstName"
                        autocomplete="firstName"
                        v-model="account.firstName"
                        v-on:keyup.enter="focusOn('lastName')"
                        data-vv-name="firstName"
                        type="firstName"
                        required
                        v-validate="modelValidations.firstName"
                    ></md-input>
                    <span class="md-error">{{errors.first('firstName')}}</span>
                    <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('firstName')"
                            @click="account.firstName='',focusOn('firstName')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                        >
                            <md-icon class="error">close</md-icon>
                        </md-button>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            class="success"
                            v-show="!errors.has('firstName') && touched.firstName"
                        >done</md-icon>
                    </slide-y-down-transition>
                </md-field>
                <md-field
                    class="md-form-group"
                    slot="inputs"
                    :class="[
            {'md-valid': !errors.has('lastName') && touched.lastName},
            {'md-error': errors.has('lastName')}]"
                >
                    <md-icon>looks_two</md-icon>
                    <label>Last Name</label>
                    <md-input
                        ref="lastName"
                        autocomplete="lastName"
                        v-model="account.lastName"
                        v-on:keyup.enter="focusOn('password')"
                        data-vv-name="lastName"
                        type="text"
                        required
                        v-validate="modelValidations.lastName"
                    ></md-input>
                    <span class="md-error">{{errors.first('lastName')}}</span>
                    <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('lastName')"
                            @click="account.lastName='',focusOn('lastName')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                        >
                            <md-icon class="error">close</md-icon>
                        </md-button>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            class="success"
                            v-show="!errors.has('lastName') && touched.lastName"
                        >done</md-icon>
                    </slide-y-down-transition>
                </md-field>
            </div>
            <div class="md-layout-item md-size-50 md-small-size-100">
                <md-field :class="[
          {'md-form-group': true}]">
                    <md-icon>email</md-icon>
                    <label>Email</label>
                    <md-input
                        disabled
                        v-model="email"
                        data-vv-name="email"
                        v-on:keyup.enter="focusOn('password')"
                        type="text"
                        name="email"
                        required
                        v-validate="modelValidations.email"
                    ></md-input>
                </md-field>

                <md-field
                    class="md-form-group"
                    slot="inputs"
                    :class="[{'md-error': errors.has('password')},
            {'md-valid': !errors.has('password') && touched.password}]"
                >
                    <md-icon>lock_outline</md-icon>
                    <label>Password</label>
                    <md-input
                        ref="password"
                        autocomplete="password"
                        v-on:keyup.enter="focusOn('rPassword')"
                        v-model="account.password"
                        data-vv-name="password"
                        type="password"
                        required
                        v-validate="modelValidations.password"
                    ></md-input>
                    <span class="md-error">{{errors.first('password')}}</span>
                    <!-- <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('password')"
                            @click="account.password='',focusOn('password')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                        >
                            <md-icon class="error">close</md-icon>
                        </md-button>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            class="success"
                            v-show="!errors.has('password') && touched.password"
                        >done</md-icon>
                    </slide-y-down-transition> -->
                </md-field>
                <md-field
                    class="md-form-group"
                    slot="inputs"
                    :class="[{'md-error': errors.has('password')},
            {'md-valid': !errors.has('password') && touched.password}]"
                >
                    <md-icon>lock_outline</md-icon>
                    <label>Repeate Password</label>
                    <md-input
                        ref="rPassword"
                        autocomplete="password"
                        v-model="account.rPassword"
                        data-vv-name="rPassword"
                        type="password"
                        required
                        v-validate="modelValidations.rPassword"
                    ></md-input>
                    <span class="md-error">{{errors.first('rPassword')}}</span>
                    <!-- <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('rPassword')"
                            @click="account.rPassword='',focusOn('rPassword')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                        >
                            <md-icon class="error">close</md-icon>
                        </md-button>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            class="success"
                            v-show="!errors.has('rPassword') && touched.rPassword"
                        >done</md-icon>
                    </slide-y-down-transition> -->
                </md-field>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable func-names */
    import { SlideYDownTransition } from 'vue2-transitions';

    export default {
        components: {
            SlideYDownTransition,
        },
        props: {
            error: {
                type: Object,
                default: () => ({
                    message: 'Wrong username',
                    type: 'username',
                }),
            },
            email: {
                type: String,
                default: () => '',
            },
        },
        data() {
            return {
                account: {
                    lastName: '',
                    firstName: '',
                    username: '',
                    password: '',
                    rPassword: '',
                },
                touched: {
                    firstName: false,
                    lastName: false,
                    username: false,
                    password: false,
                    rPassword: false,
                },
                modelValidations: {
                    firstName: {
                        required: true,
                        min: 2,
                    },
                    lastName: {
                        required: true,
                        min: 2,
                    },
                    password: {
                        required: true,
                    },
                    rPassword: {
                        required: true,
                        confirmed: 'password',
                    },
                    username: {
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
            getError(fieldName) {
                return this.errors.first(fieldName);
            },
            validate() {
                return this.$validator.validateAll().then((res) => {
                    this.$emit('on-validated', res, 'step3');
                    this.$emit('validated-account', this.account);
                    return res;
                });
            },
            showErrorsValidate(error) {
                if (error.message === '') {
                    return;
                }
                const field = this.$validator.fields.find({
                    name: error.type,
                    scope: this.$options.scope,
                });
                if (!field) return;
                this.$validator.errors.add({
                    id: error.type,
                    field: error.type,
                    msg: error.message,
                    scope: this.$options.scope,
                });
                field.setFlags({
                    invalid: true,
                    valid: false,
                    validated: true,
                });
            },
        },
        watch: {
            error: {
                handler(val) {
                    if (val.message) {
                        this.showErrorsValidate(val);
                        this.error.message = '';
                    }
                },
                deep: true,
            },
            account: {
                handler(newValue) {
                    this.$emit('on-input', newValue);
                },
                deep: true,
            },
            'account.firstName': function () {
                this.touched.firstName = true;
            },
            'account.lastName': function () {
                this.touched.lastName = true;
            },
            'account.username': function () {
                this.touched.username = true;
            },
            'account.password': function () {
                this.touched.password = true;
            },
            'account.rPassword': function () {
                this.touched.rPassword = true;
            },
            'account.email': function () {
                this.username = this.email.substring(0, this.email.indexOf('@'));
            },
        },
    };
</script>
<style>
</style>
