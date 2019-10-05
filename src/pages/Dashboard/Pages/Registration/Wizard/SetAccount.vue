<template>
    <div>
        <h5 class="info-text">
            {{ $t(`${$options.name}.title`) }}
        </h5>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-50 md-small-size-100">
                <md-field
                    slot="inputs"
                    class="md-form-group"
                    :class="[{ 'md-valid': !errors.has('username') && touched.username }, { 'md-error': errors.has('username') }]"
                >
                    <md-icon>face</md-icon>
                    <label>
                        {{ $t(`${$options.name}.userName`) }}
                    </label>
                    <md-input
                        ref="username"
                        v-model="account.username"
                        v-validate="modelValidations.username"
                        autocomplete="username"
                        data-vv-name="username"
                        type="username"
                        required
                        @keyup.enter="focusOn('firstName')"
                    />
                    <span class="md-error">{{ errors.first('username') }}</span>
                    <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('username')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                            @click="(account.username = ''), focusOn('username')"
                        >
                            <md-icon class="error">
                                close
                            </md-icon>
                        </md-button>
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
                    <label>
                        {{ $t(`${$options.name}.firstName`) }}
                    </label>
                    <md-input
                        ref="firstName"
                        v-model="account.firstName"
                        v-validate="modelValidations.firstName"
                        autocomplete="firstName"
                        data-vv-name="firstName"
                        type="firstName"
                        required
                        @keyup.enter="focusOn('lastName')"
                    />
                    <span class="md-error">{{ errors.first('firstName') }}</span>
                    <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('firstName')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                            @click="(account.firstName = ''), focusOn('firstName')"
                        >
                            <md-icon class="error">
                                close
                            </md-icon>
                        </md-button>
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
                    <label>{{ $t(`${$options.name}.lastName`) }}</label>
                    <md-input
                        ref="lastName"
                        v-model="account.lastName"
                        v-validate="modelValidations.lastName"
                        autocomplete="lastName"
                        data-vv-name="lastName"
                        type="text"
                        required
                        @keyup.enter="focusOn('password')"
                    />
                    <span class="md-error">{{ errors.first('lastName') }}</span>
                    <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('lastName')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                            @click="(account.lastName = ''), focusOn('lastName')"
                        >
                            <md-icon class="error">
                                close
                            </md-icon>
                        </md-button>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon v-show="!errors.has('lastName') && touched.lastName" class="success">
                            done
                        </md-icon>
                    </slide-y-down-transition>
                </md-field>
            </div>
            <div class="md-layout-item md-size-50 md-small-size-100">
                <md-field :class="[{ 'md-form-group': true }]">
                    <md-icon>email</md-icon>
                    <label>{{ $t(`${$options.name}.email`) }}</label>
                    <md-input
                        v-model="email"
                        v-validate="modelValidations.email"
                        disabled
                        data-vv-name="email"
                        type="text"
                        name="email"
                        required
                        @keyup.enter="focusOn('password')"
                    />
                </md-field>

                <md-field
                    slot="inputs"
                    class="md-form-group"
                    :class="[{ 'md-error': errors.has('password') }, { 'md-valid': !errors.has('password') && touched.password }]"
                >
                    <md-icon>lock_outline</md-icon>
                    <label>{{ $t(`${$options.name}.password`) }}</label>
                    <md-input
                        ref="password"
                        v-model="account.password"
                        v-validate="modelValidations.password"
                        autocomplete="password"
                        data-vv-name="password"
                        type="password"
                        required
                        @keyup.enter="focusOn('rPassword')"
                    />
                    <span class="md-error">{{ errors.first('password') }}</span>
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
                    slot="inputs"
                    class="md-form-group"
                    :class="[{ 'md-error': errors.has('rPassword') }, { 'md-valid': !errors.has('rPassword') && touched.rPassword }]"
                >
                    <md-icon>lock_outline</md-icon>
                    <label>{{ $t(`${$options.name}.repeatPassword`) }}</label>
                    <md-input
                        ref="rPassword"
                        v-model="account.rPassword"
                        v-validate="modelValidations.rPassword"
                        autocomplete="password"
                        data-vv-name="rPassword"
                        type="password"
                        required
                    />
                    <span class="md-error">{{ errors.first('rPassword') }}</span>
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
    name: 'SetAccount',
    components: {
        SlideYDownTransition
    },
    props: {
        error: {
            type: Object,
            default: () => ({
                message: 'Wrong username',
                type: 'username'
            })
        },
        email: {
            type: String,
            default: () => ''
        }
    },
    data() {
        return {
            account: {
                lastName: '',
                firstName: '',
                username: '',
                password: '',
                rPassword: ''
            },
            touched: {
                firstName: false,
                lastName: false,
                username: false,
                password: false,
                rPassword: false
            },
            modelValidations: {
                firstName: {
                    required: true,
                    min: 2
                },
                lastName: {
                    required: true,
                    min: 2
                },
                password: {
                    required: true
                },
                rPassword: {
                    required: true,
                    confirmed: 'password'
                },
                username: {
                    required: true,
                    min: 5
                }
            }
        };
    },
    watch: {
        error: {
            handler(val) {
                if (val.message) {
                    this.showErrorsValidate(val);
                    this.error.message = '';
                }
            },
            deep: true
        },
        account: {
            handler(newValue) {
                this.$emit('on-input', newValue);
            },
            deep: true
        },
        'account.firstName': function() {
            this.touched.firstName = true;
        },
        'account.lastName': function() {
            this.touched.lastName = true;
        },
        'account.username': function() {
            this.touched.username = true;
        },
        'account.password': function() {
            this.touched.password = true;
        },
        'account.rPassword': function() {
            this.touched.rPassword = true;
        },
        'account.email': function() {
            this.username = this.email.substring(0, this.email.indexOf('@'));
        }
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
            return this.$validator.validateAll().then(res => {
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
                scope: this.$options.scope
            });
            if (!field) return;
            this.$validator.errors.add({
                id: error.type,
                field: error.type,
                msg: error.message,
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
<style></style>
