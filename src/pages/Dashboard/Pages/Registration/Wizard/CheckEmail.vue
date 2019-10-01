<template>
    <div>
        <h5 class="info-text">
            {{ $t(`${$options.name}.title`) }}
            <br />
            {{ $t(`${$options.name}.description`) }}
        </h5>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-100">
                <md-field>
                    <md-icon>email</md-icon>
                    <label>
                    {{ $t(`${$options.name}.email`) }}
                    </label>
                    <md-input v-model="email" v-validate="modelValidations.email" disabled data-vv-name="email" type="text" name="email" />
                </md-field>

                <md-field
                    slot="inputs"
                    class="md-form-group"
                    :class="[{ 'md-error': errors.has('code') }, { 'md-valid': !errors.has('code') && touched.code }]"
                >
                    <md-icon>lock_outline</md-icon>
                    <label>
                        {{ $t(`${$options.name}.code`) }}
                    </label>
                    <md-input
                        ref="code"
                        v-model="code"
                        v-validate="modelValidations.code"
                        autocomplete="code"
                        data-vv-name="code"
                        type="code"
                        required
                        @keyup.enter="focusOn('')"
                    />
                    <span class="md-error">{{ errors.first('code') }}</span>
                    <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('code')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                            @click="(code = ''), focusOn('code')"
                        >
                            <md-icon class="error">
                                close
                            </md-icon>
                        </md-button>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-button v-show="!errors.has('code') && touched.code" class="md-just-icon md-round md-input-action clear-button md-simple">
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
    name: 'CheckEmail',
    components: {
        SlideYDownTransition
    },
    props: {
        email: {
            type: String,
            default: ''
        },
        error: {
            type: Object,
            default: () => ({
                message: 'Wrong code',
                type: 'code'
            })
        }
    },
    data() {
        return {
            code: '',
            touched: {
                code: false
            },
            modelValidations: {
                code: {
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
        code() {
            this.touched.code = true;
            this.$emit('on-validated', this.code);
        }
    },
    mounted() {
        this.$refs.code.$el.focus();
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
                this.$emit('on-validated', res, 'step2');
                this.$emit('validated-code', this.code);
                return res;
            });
        }
    }
};
</script>
<style></style>
