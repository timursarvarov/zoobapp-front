<template>
    <form>
        <md-card>
            <md-card-header class="md-card-header-text md-card-header-green">
                <div class="card-text">
                    <h4 class="title">
                        Type Validation
                    </h4>
                </div>
            </md-card-header>

            <md-card-content>
                <div class="md-layout">
                    <label class="md-layout-item md-size-20 md-form-label">Required Text</label>
                    <div class="md-layout-item">
                        <md-field
                            :class="[
                                {'md-error': errors.has('required')},
                                {'md-valid': !errors.has('required') && touched.required}]"
                        >
                            <md-input
                                v-model="required"
                                v-validate="modelValidations.required"
                                data-vv-name="required"
                                type="text"
                                required
                            />
                            <slide-y-down-transition>
                                <md-icon
                                    v-show="errors.has('required')"
                                    class="error"
                                >
                                    close
                                </md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon
                                    v-show="!errors.has('required') && touched.required"
                                    class="success"
                                >
                                    done
                                </md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <label class="md-layout-item md-size-20 md-label-on-right">
                        <code>required</code>
                    </label>
                </div>
                <div class="md-layout">
                    <label class="md-layout-item md-size-20 md-form-label">Email</label>
                    <div class="md-layout-item">
                        <md-field
                            :class="[
                                {'md-error': errors.has('email')},
                                {'md-valid': !errors.has('email') && touched.email}]"
                        >
                            <md-input
                                v-model="email"
                                v-validate="modelValidations.email"
                                data-vv-name="email"
                                type="text"
                                required
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
                    </div>
                    <label class="md-layout-item md-size-20 md-label-on-right">
                        <code>email="true"</code>
                    </label>
                </div>
                <div class="md-layout">
                    <label class="md-layout-item md-size-20 md-form-label">Number</label>
                    <div class="md-layout-item">
                        <md-field
                            :class="[
                                {'md-error': errors.has('number')},
                                {'md-valid': !errors.has('number') && touched.number}]"
                        >
                            <md-input
                                v-model="number"
                                v-validate="modelValidations.number"
                                data-vv-name="number"
                                type="number"
                                required
                            />
                            <slide-y-down-transition>
                                <md-icon
                                    v-show="errors.has('number')"
                                    class="error"
                                >
                                    close
                                </md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon
                                    v-show="!errors.has('number') && touched.number"
                                    class="success"
                                >
                                    done
                                </md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <label class="md-layout-item md-size-20 md-label-on-right">
                        <code>number="true"</code>
                    </label>
                </div>
                <div class="md-layout">
                    <label class="md-layout-item md-size-20 md-form-label">Url</label>
                    <div class="md-layout-item">
                        <md-field
                            :class="[
                                {'md-error': errors.has('url')},
                                {'md-valid': !errors.has('url') && touched.url}]"
                        >
                            <md-input
                                v-model="url"
                                v-validate="modelValidations.url"
                                data-vv-name="url"
                                type="url"
                                required
                            />
                            <slide-y-down-transition>
                                <md-icon
                                    v-show="errors.has('url')"
                                    class="errror"
                                >
                                    close
                                </md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon
                                    v-show="!errors.has('url') && touched.url"
                                    class="success"
                                >
                                    done
                                </md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <label class="md-layout-item md-size-20 md-label-on-right">
                        <code>url="true"</code>
                    </label>
                </div>
                <div class="md-layout">
                    <label class="md-layout-item md-size-20 md-form-label">Equal to</label>
                    <div class="md-layout-item">
                        <div class="md-layout">
                            <div class="md-layout-item">
                                <md-field
                                    :class="[
                                        {'md-error': errors.has('equalToSource')},
                                        {'md-valid': !errors.has('equalToSource') && touched.equalToSource}]"
                                >
                                    <label>#idSource</label>
                                    <md-input
                                        ref="equalToSource"
                                        v-model="equalToSource"
                                        v-validate="modelValidations.equalToSource"
                                        data-vv-name="equalToSource"
                                        type="text"
                                        required
                                    />
                                    <slide-y-down-transition>
                                        <md-icon
                                            v-show="errors.has('equalToSource')"
                                            class="error"
                                        >
                                            close
                                        </md-icon>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <md-icon
                                            v-show="!errors.has('equalToSource') && touched.equalToSource"
                                            class="success"
                                        >
                                            done
                                        </md-icon>
                                    </slide-y-down-transition>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-field
                                    :class="[
                                        {'md-error': errors.has('equalToDest')},
                                        {'md-valid': !errors.has('equalToDest') && touched.equalToDest}]"
                                >
                                    <label>#idDestination</label>
                                    <md-input
                                        v-model="equalToDest"
                                        v-validate="modelValidations.equalToDest"
                                        data-vv-name="equalToDest"
                                        data-vv-as="equalToSource"
                                        type="text"
                                        required
                                    />
                                    <slide-y-down-transition>
                                        <md-icon
                                            v-show="errors.has('equalToDest')"
                                            class="error"
                                        >
                                            close
                                        </md-icon>
                                    </slide-y-down-transition>
                                    <slide-y-down-transition>
                                        <md-icon
                                            v-show="!errors.has('equalToDest') && touched.equalToDest"
                                            class="success"
                                        >
                                            done
                                        </md-icon>
                                    </slide-y-down-transition>
                                </md-field>
                            </div>
                        </div>
                    </div>
                    <label class="md-layout-item md-size-20 md-label-on-right">
                        <code>equalTo="#idSource"</code>
                    </label>
                </div>
            </md-card-content>

            <md-card-actions class="text-center">
                <md-button
                    native-type="submit"
                    class="md-success"
                    @click.native.prevent="validate"
                >
                    Validate Inputs
                </md-button>
            </md-card-actions>
        </md-card>
    </form>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';

export default {
    name: 'TypeValidationsForms',
    components: {
        SlideYDownTransition,
    },
    data() {
        return {
            equalToSource: '',
            equalToDest: '',
            required: '',
            email: '',
            number: '',
            url: '',
            touched: {
                required: false,
                email: false,
                number: false,
                url: false,
                equalToSource: false,
                equalToDest: false,
            },
            modelValidations: {
                required: {
                    required: true,
                },
                email: {
                    required: true,
                    email: true,
                },
                number: {
                    required: true,
                    numeric: true,
                },
                url: {
                    required: true,
                    url: true,
                },
                equalToSource: {
                    required: true,
                },
                equalToDest: {
                    required: true,
                    confirmed: 'equalToSource',
                },
            },
        };
    },
    watch: {
        required() {
            this.touched.required = true;
        },
        email() {
            this.touched.email = true;
        },
        number() {
            this.touched.number = true;
        },
        url() {
            this.touched.url = true;
        },
        equalToSource() {
            this.touched.equalToSource = true;
        },
        equalToDest() {
            this.touched.equalToDest = true;
        },
    },
    methods: {
        validate() {
            this.$validator.validateAll().then((isValid) => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
        },
    },
};
</script>
<style lang="scss" >
.type-validations-wrapper {
    .md-card .md-card-actions {
        border: none;
    }

    .text-center {
        justify-content: center !important;
    }
}
</style>
