<template>
    <md-card class="md-card-profile">
        <t-avatar-input
            :text-to-color="user.ID"
            :max-filesize="2000"
            :image-src="user.avatar"
            :title="user.firstName + ' ' + user.lastName"
            :form-title="$t(`${$options.name}.addYourPhoto`)"
            :button-color="'green'"
            @on-created="updateUserAvatar"
        />

        <md-card-content>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                            { 'with-subline': true },
                            { 'md-valid': !errors.has('firstName') && touched.firstName },
                            { 'md-error': errors.has('firstName') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.firstName`) }}</label>
                        <md-input
                            ref="firstName"
                            v-model="user.firstName"
                            v-validate="modelValidations.firstName"
                            type="text"
                            data-vv-name="firstName"
                            required
                        />
                        <span class="md-error">{{ errors.first('firstName') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('firstName')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(user.firstName = ''), focusOn('firstName')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('firstName') && touched.firstName"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">
                                    done
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                            { 'with-subline': true },
                            { 'md-valid': !errors.has('lastName') && touched.lastName },
                            { 'md-error': errors.has('lastName') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.lastName`) }}</label>
                        <md-input
                            ref="lastName"
                            v-model="user.lastName"
                            v-validate="modelValidations.lastName"
                            type="text"
                            data-vv-name="lastName"
                            required
                        />
                        <span class="md-error">{{ errors.first('lastName') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('lastName')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(user.lastName = ''), focusOn('lastName')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('lastName') && touched.lastName"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">
                                    done
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field class="with-subline">
                        <label>{{ $t(`${$options.name}.userName`) }}</label>
                        <md-input v-model="user.userName" disabled type="text" />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                            { 'with-subline': true },
                            { 'md-valid': !errors.has('phone') && touched.phone },
                            { 'md-error': errors.has('phone') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.phone`) }} </label>
                        <span class="md-prefix">+</span>
                        <md-input ref="phone" v-model="user.phone" v-validate="modelValidations.phone" type="number" data-vv-name="phone" required />
                        <span class="md-error">{{ errors.first('phone') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('phone')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(user.phone = ''), focusOn('phone')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('phone') && touched.phone"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">
                                    done
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                            { 'with-subline': true },
                            { 'md-valid': !errors.has('email') && touched.email },
                            { 'md-error': errors.has('email') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.email`) }}</label>
                        <md-input ref="email" v-model="user.email" v-validate="modelValidations.email" type="text" data-vv-name="email" required />
                        <span class="md-error">{{ errors.first('email') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('email')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(user.email = ''), focusOn('email')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('email') && touched.email"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">
                                    done
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field class="with-subline">
                        <label>{{ $t(`${$options.name}.address`) }}</label>
                        <md-input v-model="user.address" type="text" />
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field maxlength="5">
                        <label>{{ $t(`${$options.name}.aboutMe`) }}</label>
                        <md-textarea v-model="aboutme" />
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100 text-right">
                    <md-button :disabled="_.isEmpty(changedFields) || loading" class="md-raised md-success mt-4" @click="updateProfile">
                        <span v-if="loading">
                            <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />
                            {{ $t(`${$options.name}.loading`) }}
                        </span>
                        <span v-else>
                            {{ $t(`${$options.name}.updateProfile`) }}
                        </span>
                    </md-button>
                </div>
            </div>
        </md-card-content>
    </md-card>
</template>
<script>
import { mapGetters } from 'vuex';
import { SlideYDownTransition } from 'vue2-transitions';
import { USER_AVATAR_UPLOAD, USER_UPDATE, NOTIFY, SERVER_ERRORS } from '@/constants';
import components from '@/components';

export default {
    name: 'UserCard',
    components: {
        SlideYDownTransition,
        ...components
    },
    props: {
        cardUserImage: {
            type: String,
            default: './img/faces/marc.jpg'
        },
        buttonColor: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            copiedUser: {},
            loading: false,
            code: null,
            aboutme: null,
            touched: {
                firstName: false,
                lastName: false,
                email: false,
                phone: false
            },
            modelValidations: {
                lastName: {
                    required: true
                },
                firstName: {
                    required: true,
                    min: 2
                },
                email: {
                    email: true
                },
                phone: {
                    required: true,
                    min: 12,
                    max: 20
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            user: 'getProfile'
        }),
        email() {
            return this.user.email;
        },
        firstName() {
            return this.user.firstName;
        },
        lastName() {
            return this.user.lastName;
        },
        phone() {
            return this.user.phone;
        },
        changedFields() {
            const fields = {};
            Object.keys(this.user).forEach(key => {
                if (!this._.isEqual(this.user[key], this.copiedUser[key])) {
                    fields[key] = this.user[key];
                }
            });
            return fields;
        }
    },
    watch: {
        email() {
            this.touched.email = true;
        },
        firstName() {
            this.touched.firstName = true;
        },
        lastName() {
            this.touched.lastName = true;
        },
        phone() {
            console.log(12);
            this.touched.phone = true;
        }
    },
    created() {
        this.copiedUser = this._.clone(this.user);
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
            this.touched.lastName = true;
            this.touched.firstName = true;
            this.touched.email = true;
            this.touched.phone = true;
        },
        updateProfile() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loading = true;
                    this.$store
                        .dispatch(USER_UPDATE, {
                            user: this.changedFields
                        })
                        .then(response => {
                            if (response) {
                                this.copiedUser = this._.clone(response);
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'Updated',
                                        type: 'success'
                                    }
                                });
                            }
                        })
                        .catch(error => {
                            if (error.code === SERVER_ERRORS.codes.ServerErrorCode) {
                                if (error.message === 'email exist') {
                                    this.showErrorsValidate({
                                        type: 'email',
                                        message: error.message
                                    });
                                }
                            }
                        })
                        .then(() => {
                            this.loading = false;
                        });
                }
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
        },
        updateUserAvatar(fd) {
            this.$store
                .dispatch(USER_AVATAR_UPLOAD, {
                    fd
                })
                .then(response => {
                    console.log(response);
                    if (response) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Profile image updated',
                                type: 'primary'
                            }
                        });
                    }
                });
        }
    }
};
</script>
<style lang="scss" scoped></style>
