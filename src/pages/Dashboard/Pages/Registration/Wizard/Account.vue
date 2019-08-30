<template>
    <div>
        <h5 class="info-text">
            Let's start with the basic information (with validation)
        </h5>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-50 md-small-size-100">
                <md-field
                    slot="inputs"
                    class="md-form-group"
                    :class="[
                        {'md-valid': !errors.has('username') && touched.username},
                        {'md-error': errors.has('username')}]"
                >
                    <md-icon>face</md-icon>
                    <label>User Name</label>
                    <md-input
                        ref="username"
                        v-model="username"
                        v-validate="modelValidations.username"
                        autocomplete="username"
                        data-vv-name="username"
                        type="username"
                        required
                        @keyup.enter="focusOn('firstName')"
                    />
                    <span class="md-error">{{ errors.first('username') }}</span>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="errors.has('username')"
                            class="error"
                        >
                            close
                        </md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="!errors.has('username') && touched.username"
                            class="success"
                        >
                            done
                        </md-icon>
                    </slide-y-down-transition>
                </md-field>
                <md-field
                    slot="inputs"
                    class="md-form-group"
                    :class="[
                        {'md-valid': !errors.has('firstName') && touched.firstName},
                        {'md-error': errors.has('firstName')}]"
                >
                    <md-icon>looks_one</md-icon>
                    <label>First Name</label>
                    <md-input
                        ref="firstName"
                        v-model="firstName"
                        v-validate="modelValidations.firstName"
                        autocomplete="firstName"
                        data-vv-name="firstName"
                        type="firstName"
                        required
                        @keyup.enter="focusOn('lastName')"
                    />
                    <span class="md-error">{{ errors.first('firstName') }}</span>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="errors.has('firstName')"
                            class="error"
                        >
                            close
                        </md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="!errors.has('firstName') && touched.firstName"
                            class="success"
                        >
                            done
                        </md-icon>
                    </slide-y-down-transition>
                </md-field>
                <md-field
                    slot="inputs"
                    class="md-form-group"
                    :class="[
                        {'md-valid': !errors.has('lastName') && touched.lastName},
                        {'md-error': errors.has('lastName')}]"
                >
                    <md-icon>looks_two</md-icon>
                    <label>Last Name</label>
                    <md-input
                        ref="lastName"
                        v-model="lastName"
                        v-validate="modelValidations.lastName"
                        autocomplete="lastName"
                        data-vv-name="lastName"
                        type="lastName"
                        required
                        @keyup.enter="focusOn('email')"
                    />
                    <span class="md-error">{{ errors.first('lastName') }}</span>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="errors.has('lastName')"
                            class="error"
                        >
                            close
                        </md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="!errors.has('lastName') && touched.lastName"
                            class="success"
                        >
                            done
                        </md-icon>
                    </slide-y-down-transition>
                </md-field>
            </div>
            <div class="md-layout-item md-size-50 md-small-size-100">
                <md-field
                    :class="[
                        {'md-valid': !errors.has('email') && touched.email},
                        {'md-form-group': true},
                        {'md-error': errors.has('email')}]"
                >
                    <md-icon>email</md-icon>
                    <label>Email</label>
                    <md-input
                        ref="email"
                        v-model="email"
                        v-validate="modelValidations.email"
                        data-vv-name="email"
                        type="text"
                        name="email"
                        required
                        @keyup.enter="focusOn('password')"
                    />
                    <slide-y-down-transition>
                        <md-icon
                            v-show="errors.has('email')"
                            class="error"
                        >
                            close
                        </md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="!errors.has('email') && touched.email"
                            class="success"
                        >
                            done
                        </md-icon>
                    </slide-y-down-transition>
                </md-field>

                <md-field
                    slot="inputs"
                    class="md-form-group"
                    :class="[{'md-error': errors.has('password')},
                             {'md-valid': !errors.has('password') && touched.password}]"
                >
                    <md-icon>lock_outline</md-icon>
                    <label>Password</label>
                    <md-input
                        ref="password"
                        v-model="password"
                        v-validate="modelValidations.password"
                        autocomplete="password"
                        data-vv-name="password"
                        type="password"
                        required
                        @keyup.enter="focusOn('rPassword')"
                    />
                    <span class="md-error">{{ errors.first('password') }}</span>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="errors.has('password')"
                            class="error"
                        >
                            close
                        </md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="!errors.has('password') && touched.password"
                            class="success"
                        >
                            done
                        </md-icon>
                    </slide-y-down-transition>
                </md-field>
                <md-field
                    slot="inputs"
                    class="md-form-group"
                    :class="[{'md-error': errors.has('password')},
                             {'md-valid': !errors.has('password') && touched.password}]"
                >
                    <md-icon>lock_outline</md-icon>
                    <label>Repeate Password</label>
                    <md-input
                        ref="rPassword"
                        v-model="rPassword"
                        v-validate="modelValidations.rPassword"
                        autocomplete="password"
                        data-vv-name="rPassword"
                        type="password"
                        required
                    />
                    <span class="md-error">{{ errors.first('rPassword') }}</span>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="errors.has('rPassword')"
                            class="error"
                        >
                            close
                        </md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            v-show="!errors.has('rPassword') && touched.rPassword"
                            class="success"
                        >
                            done
                        </md-icon>
                    </slide-y-down-transition>
                </md-field>
            </div>
        </div>
    </div>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';

export default {
    name: 'Account',
    components: {
        SlideYDownTransition,
    },
    props: {
        avatar: {
            type: String,
            default: './img/default-avatar.png',
        },
    },
    data() {
        return {
            image: '',
            single: null,
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            rPassword: '',
            email: '',
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
                email: {
                    required: true,
                    email: true,
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
    watch: {
        firstName() {
            this.touched.firstName = true;
        },
        lastName() {
            this.touched.lastName = true;
        },
        email() {
            this.touched.email = true;
        },
        username() {
            this.touched.username = true;
        },
        password() {
            this.touched.password = true;
        },
        rPassword() {
            this.touched.rPassword = true;
        },
    },
    methods: {
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            console.log(ref);
            this.$refs[ref].$el.focus();
        },
        getError(fieldName) {
            return this.errors.first(fieldName);
        },
        validate() {
            return this.$validator.validateAll().then((res) => {
                this.$emit('on-validated', res);
                return res;
            });
        },
    },
};
</script>
<style>
</style>
