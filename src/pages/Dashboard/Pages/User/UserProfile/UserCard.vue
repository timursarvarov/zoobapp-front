<template>
    <md-card class="md-card-profile">
        <t-avatar-input
            :textToColor="user.ID"
            :maxFilesize="2000"
            :imageSrc="user.avatar"
            :title="user.firstName+ ' ' + user.lastName"
            :formTitle="'Add your photo'"
            :buttonColor="'green'"
            @on-created="updateUserAvatar"
        />

        <md-card-content>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                            {'with-subline': true},
                            {'md-valid': !errors.has('firstName') && touched.firstName},
                            {'md-error': errors.has('firstName')}]"
                    >
                        <label>First Name</label>
                        <md-input
                            v-model="user.firstName"
                            type="text"
                            ref="firstName"
                            data-vv-name="firstName"
                            required
                            v-validate="modelValidations.firstName"
                        ></md-input>
                        <span class="md-error">{{errors.first('firstName')}}</span>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="errors.has('firstName')"
                                @click="user.firstName='',focusOn('firstName')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('firstName')  && touched.firstName"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                            {'with-subline': true},
                            {'md-valid': !errors.has('lastName') && touched.lastName},
                            {'md-error': errors.has('lastName')}]"
                    >
                        <label>Last Name</label>
                        <md-input
                            v-model="user.lastName"
                            type="text"
                            ref="lastName"
                            data-vv-name="lastName"
                            required
                            v-validate="modelValidations.lastName"
                        ></md-input>
                        <span class="md-error">{{errors.first('lastName')}}</span>
                         <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="errors.has('lastName')"
                                @click="user.lastName='',focusOn('lastName')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('lastName')  && touched.lastName"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field class="with-subline">
                        <label>User Name</label>
                        <md-input v-model="user.userName" disabled type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                        {'with-subline': true},
                        {'md-valid': !errors.has('phone') && touched.phone},
                        {'md-error': errors.has('phone')}]"
                    >
                        <label>Phone</label>
                        <span class="md-prefix">+</span>
                        <md-input
                            ref="phone"
                            v-model="user.phone"
                            type="number"
                            data-vv-name="phone"
                            required
                            v-validate="modelValidations.phone"
                        ></md-input>
                        <span class="md-error">{{errors.first('phone')}}</span>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="errors.has('phone')"
                                @click="user.phone='',focusOn('phone')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('phone')  && touched.phone"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                        {'with-subline': true},
                        {'md-valid': !errors.has('email') && touched.email},
                        {'md-error': errors.has('email')}]"
                    >
                        <label>Email</label>
                        <md-input
                            v-model="user.email"
                            ref="email"
                            type="text"
                            data-vv-name="email"
                            required
                            v-validate="modelValidations.email"
                        ></md-input>
                        <span class="md-error">{{errors.first('email')}}</span>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="errors.has('email')"
                                @click="user.email='',focusOn('email')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('email')  && touched.email"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field class="with-subline" >
                        <label>Address</label>
                        <md-input v-model="user.address" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="language">Language</label>
                        <md-select @md-selected="onLangChange()" v-model="user.lang" name="language" id="language">
                            <md-option :value="1">English</md-option>
                            <md-option :value="2">Русский</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field maxlength="5">
                        <label>About Me</label>
                        <md-textarea v-model="aboutme"></md-textarea>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100 text-right">
                    <md-button
                        @click="updateProfile"
                        class="md-raised md-success mt-4"
                    >Update Profile</md-button>
                </div>
            </div>
        </md-card-content>
    </md-card>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { SlideYDownTransition } from 'vue2-transitions';
    import { USER_AVATAR_UPLOAD, USER_UPDATE, NOTIFY } from '@/constants';
    import { TAvatarInput } from '@/components';

    export default {
        components: {
            SlideYDownTransition,
            TAvatarInput,
        },
        name: 'user-card',
        props: {
            cardUserImage: {
                type: String,
                default: './img/faces/marc.jpg',
            },
            buttonColor: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                city: null,
                country: null,
                code: null,
                aboutme: null,
                touched: {
                    firstName: false,
                    lastName: false,
                    email: false,
                    phone: false,
                },
                modelValidations: {
                    lastName: {
                        required: true,
                    },
                    firstName: {
                        required: true,
                        min: 2,
                    },
                    email: {
                        email: true,
                    },
                    phone: {
                        required: true,
                        min: 12,
                        max: 20,
                    },
                },
            };
        },
        methods: {
            onLangChange() {
                if (this.user.lang === 1) {
                    this.$i18n.locale = 'en';
                }
                if (this.user.lang === 2) {
                    this.$i18n.locale = 'ru';
                }
            },
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
                this.touched.lastName = true;
                this.touched.firstName = true;
                this.touched.email = true;
                this.touched.phone = true;
            },
            updateProfile() {
                this.$validator
                    .validateAll()
                    .then((result) => {
                        // TODO подключить после настройки api
                        // this.user['color'] = this.userColor
                        if (result) {
                            this.$store
                                .dispatch(USER_UPDATE, {
                                    user: this.user,
                                })
                                .then((response) => {
                                    if (response) {
                                        this.$store.dispatch(NOTIFY, {
                                            settings: {
                                                message: 'Updated',
                                                type: 'primary',
                                            },
                                        });
                                    }
                                });
                        }
                    });
            },
            updateUserAvatar(fd) {
                this.$store
                    .dispatch(USER_AVATAR_UPLOAD, {
                        fd,
                    })
                    .then((response) => {
                        console.log(response);
                        if (response) {
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: 'Profile image updated',
                                    type: 'primary',
                                },
                            });
                        }
                    });
            },
        },
        computed: {
            ...mapGetters({
                user: 'getProfile',
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
            },
        },
    };
</script>
<style lang="scss" scoped>
</style>
