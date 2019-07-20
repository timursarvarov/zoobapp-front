<template>
    <div>
        <h5 class="info-text">Let's start with the basic information (with validation)</h5>
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
                        v-model="username"
                        v-on:keyup.enter="focusOn('firstName')"
                        data-vv-name="username"
                        type="username"
                        required
                        v-validate="modelValidations.username"
                    ></md-input>
                    <span class="md-error">{{errors.first('username')}}</span>
                    <slide-y-down-transition>
                        <md-icon class="error" v-show="errors.has('username')">close</md-icon>
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
                        v-model="firstName"
                        v-on:keyup.enter="focusOn('lastName')"
                        data-vv-name="firstName"
                        type="firstName"
                        required
                        v-validate="modelValidations.firstName"
                    ></md-input>
                    <span class="md-error">{{errors.first('firstName')}}</span>
                    <slide-y-down-transition>
                        <md-icon class="error" v-show="errors.has('firstName')">close</md-icon>
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
                        v-model="lastName"
                        v-on:keyup.enter="focusOn('email')"
                        data-vv-name="lastName"
                        type="lastName"
                        required
                        v-validate="modelValidations.lastName"
                    ></md-input>
                    <span class="md-error">{{errors.first('lastName')}}</span>
                    <slide-y-down-transition>
                        <md-icon class="error" v-show="errors.has('lastName')">close</md-icon>
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
                <md-field
                    :class="[
          {'md-valid': !errors.has('email') && touched.email},
          {'md-form-group': true},
          {'md-error': errors.has('email')}]"
                >
                    <md-icon>email</md-icon>
                    <label>Email</label>
                    <md-input
                        v-model="email"
                        ref="email"
                        data-vv-name="email"
                        v-on:keyup.enter="focusOn('password')"
                        type="text"
                        name="email"
                        required
                        v-validate="modelValidations.email"
                    ></md-input>
                    <slide-y-down-transition>
                        <md-icon class="error" v-show="errors.has('email')">close</md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon class="success" v-show="!errors.has('email') && touched.email">done</md-icon>
                    </slide-y-down-transition>
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
                        v-model="password"
                        data-vv-name="password"
                        type="password"
                        required
                        v-validate="modelValidations.password"
                    ></md-input>
                    <span class="md-error">{{errors.first('password')}}</span>
                    <slide-y-down-transition>
                        <md-icon class="error" v-show="errors.has('password')">close</md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            class="success"
                            v-show="!errors.has('password') && touched.password"
                        >done</md-icon>
                    </slide-y-down-transition>
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
                        v-model="rPassword"
                        data-vv-name="rPassword"
                        type="password"
                        required
                        v-validate="modelValidations.rPassword"
                    ></md-input>
                    <span class="md-error">{{errors.first('rPassword')}}</span>
                    <slide-y-down-transition>
                        <md-icon class="error" v-show="errors.has('rPassword')">close</md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon
                            class="success"
                            v-show="!errors.has('rPassword') && touched.rPassword"
                        >done</md-icon>
                    </slide-y-down-transition>
                </md-field>
            </div>
        </div>
    </div>
</template>
<script>
    import { SlideYDownTransition } from 'vue2-transitions';

    export default {
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
    };
</script>
<style>
</style>
