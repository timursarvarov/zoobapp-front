<template>
    <div>
        <h5 class="info-text">
            Put your email, we will send you verification code
        </h5>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-100">
                <md-field
                    :class="[{ 'md-valid': !errors.has('email') && touched.email }, { 'md-form-group': true }, { 'md-error': errors.has('email') }]"
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
                    />
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
                        <md-button
                            v-show="!errors.has('email') && touched.email"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                        >
                            <md-icon class="success">
                                done
                            </md-icon>
                        </md-button>
                    </slide-y-down-transition>
                </md-field>
            </div>
        </div>
    </div>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';

export default {
    name: 'GetEmail',
    components: {
        SlideYDownTransition
    },
    props: {
        error: {
            type: Object,
            default: () => ({
                message: 'Wrong email',
                type: 'email'
            })
        }
    },
    data() {
        return {
            email: '',
            touched: {
                email: false
            },
            modelValidations: {
                email: {
                    required: true,
                    email: true
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
        validate() {
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res, 'step1');
                this.$emit('validated-email', this.email);
                return res;
            });
        }
    }
};
</script>
<style lang="scss"></style>
