<template>
    <div>
        <md-dialog class="patient-add-form" :md-active.sync="showFormL">
            <div>
                <md-card>
                    <md-card-header class="md-card-header-icon md-card-header-green">
                        <div class="card-icon">
                            <md-icon>email</md-icon>
                        </div>
                        <h4 class="title">
                            {{ $t(`${$options.name}.enterEmail`) }}
                        </h4>
                    </md-card-header>

                    <md-card-content class="md-layout">
                        <div class="md-layout-item md-size-100">
                            <md-field :class="[{ 'md-valid': !errors.has('email') && touched.email }, { 'md-error': errors.has('email') }]">
                                <label>{{ $t(`${$options.name}.email`) }}</label>
                                <md-input ref="email" v-model="email" v-validate="modelValidations.email" type="email" data-vv-name="email" />
                                <span class="md-error">{{ errors.first('email') }}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="errors.has('email')"
                                        class="md-just-icon md-round md-input-action clear-button md-simple"
                                        @click="(email = ''), focusOn('email')"
                                    >
                                        <md-icon class="error">
                                            close
                                        </md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-icon v-show="!errors.has('email') && touched.email" class="success">
                                        done
                                    </md-icon>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                    </md-card-content>
                    <md-card-actions>
                        <div class="actions md-layout md-gutter">
                            <md-button class="ml-auto md-success" @click="sendPassword()">
                                {{ $t(`${$options.name}.send`) }}
                            </md-button>
                        </div>
                    </md-card-actions>
                </md-card>
            </div>
        </md-dialog>
    </div>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';
import { NOTIFY } from '@/constants';

export default {
    name: 'ForgotPassword',
    components: {
        SlideYDownTransition
    },
    props: {
        showForm: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            email: null,
            touched: {
                email: false
            },
            modelValidations: {
                email: {
                    email: true,
                    required: true
                }
            }
        };
    },
    computed: {
        showFormL: {
            get() {
                return this.showForm;
            },
            set(newValue) {
                this.$emit('update:showForm', newValue);
            }
        }
    },
    watch: {
        email() {
            this.touched.email = true;
        }
    },
    methods: {
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$refs[ref].$el.focus();
        }
    },
    validate() {
        this.$validator.validateAll().then(isValid => {
            this.$emit('on-submit', this.registerForm, isValid);
        });
        this.touched.email = true;
    },
    clearForm() {
        this.email = null;
    },
    sendPassword() {
        this.$validator.validateAll().then(result => {
            if (result) {
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: 'Here we send an email',
                        type: 'primary'
                    }
                });
                // this.$store
                //   .dispatch(PATIENT_CREATE, {
                //     params: {
                //       email: this.email,
                //     },
                //   })
                //   .then((response) => {
                //     if (response) {
                //     this.$router.push('/');
                //     this.$store.dispatch(NOTIFY, {
                //         settings: {
                //           message: 'Settings updated successfully',
                //           type: 'primary',
                //         },
                //       });
                //     }
                // });
            }
        });
    }
};

// The first param is called 'min', and the second is called 'max'.
</script>
<style lang="scss"></style>
