<template>
    <md-card class="md-card-profile currentClinic-wrapper">
        <t-avatar-input
            :text-to-color="currentClinic.ID"
            :max-filesize="2000"
            :image-src="currentClinic.logo"
            :title="currentClinic.name"
            :form-title="$t(`${$options.name}.addClinicLogo`)"
            :button-color="'green'"
            @on-created="updateClinicLogo"
        />
        <md-card-content>
            <div class="md-layout">
                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[{ 'with-subline': true }, { 'md-valid': !errors.has('name') && touched.name }, { 'md-error': errors.has('name') }]"
                    >
                        <label>{{ $t(`${$options.name}.clinicName`) }}</label>
                        <md-input
                            ref="name"
                            v-model="name"
                            v-validate="modelValidations.name"
                            :disabled="loading"
                            type="text"
                            data-vv-name="name"
                            required
                        />
                        <span v-show="!errors.has('name') && touched.name" class="md-helper-text">
                            {{ $t(`${$options.name}.clinicNameHint`) }}
                        </span>
                        <span class="md-error">{{ errors.first('name') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('name')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(name = ''), focusOn('name')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('name') && touched.name"
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

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                            { 'with-subline': true },
                            { 'md-valid': !errors.has('phone') && touched.phone },
                            { 'md-error': errors.has('phone') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.phone`) }}</label>
                        <span class="md-prefix">+</span>
                        <md-input
                            ref="phone"
                            v-model="phone"
                            v-validate="modelValidations.phone"
                            :disabled="loading"
                            type="number"
                            data-vv-name="phone"
                            required
                        />
                        <span class="md-error">{{ errors.first('phone') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('phone')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(phone = ''), focusOn('phone')"
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

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field class="with-subline">
                        <label>{{ $t(`${$options.name}.address`) }}</label>
                        <md-input v-model="address" type="text" />
                    </md-field>
                </div>

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[{ 'with-subline': true }, { 'md-valid': !errors.has('url') && touched.url }, { 'md-error': errors.has('url') }]"
                    >
                        <label> {{ $t(`${$options.name}.addressHint`) }}</label>
                        <md-input
                            ref="url"
                            v-model="url"
                            v-validate="modelValidations.url"
                            :disabled="loading"
                            autocomplete="site"
                            type="text"
                            data-vv-name="url"
                            required
                        />
                        <span class="md-error">{{ errors.first('url') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('url')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(url = ''), focusOn('url')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('url') && touched.url"
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

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                            { 'with-subline': true },
                            { 'md-valid': !errors.has('email') && touched.email },
                            { 'md-error': errors.has('email') }
                        ]"
                    >
                        <label>{{ $t(`${$options.name}.email`) }}</label>
                        <md-input
                            ref="email"
                            v-model="email"
                            v-validate="modelValidations.email"
                            :disabled="loading"
                            autocomplete="email"
                            type="text"
                            data-vv-name="email"
                            required
                        />
                        <span class="md-error">{{ errors.first('email') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('email')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
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

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[{ 'with-subline': true }, { 'md-valid': !errors.has('tax') && touched.tax }, { 'md-error': errors.has('tax') }]"
                    >
                        <label>{{ $t(`${$options.name}.tax`) }} %</label>
                        <md-input
                            ref="tax"
                            v-model="tax"
                            v-validate="modelValidations.tax"
                            :disabled="loading"
                            data-vv-name="tax"
                            type="number"
                            min="0"
                        />
                        <span v-show="!errors.has('tax') && touched.tax" class="md-helper-text">Tax will be added to clients bill</span>
                        <span class="md-error">{{ errors.first('tax') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('tax')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(tax = ''), focusOn('tax')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('tax') && touched.tax"
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
                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field class="with-subline">
                        <label for="teethSystem"> {{ $t(`${$options.name}.teethSystem`) }} </label>
                        <md-select id="teethSystem" v-model="teethSystem" :disabled="loading" name="teethSystem">
                            <md-option :value="1">
                                {{ $t(`${$options.name}.FDI`) }}
                            </md-option>
                            <md-option :value="2">
                                {{ $t(`${$options.name}.UNS`) }}
                            </md-option>
                            <md-option :value="3">
                                {{ $t(`${$options.name}.palmer`) }}
                            </md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout md-layout-item md-size-33">
                    <md-field class="with-subline">
                        <label for="selectedCurrency">{{ $t(`${$options.name}.selectCurrency`) }}</label>
                        <md-select id="selectedCurrency" v-model="selectedCurrency" md-dense name="selectedCurrency">
                            <md-option v-for="(item, key) in currency" :key="key" :disabled="loading" :value="item.code">
                                {{ `${item.code} - ${item.symbol} ${item.name} ` }}
                            </md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout md-layout-item md-size-33">
                    <md-field class="with-subline">
                        <label for="teethSystem">{{ $t(`${$options.name}.selectUTC`) }}</label>
                        <md-select id="selectedCurrency" v-model="selectedTimezone" md-dense name="selectedCurrency">
                            <md-option v-for="(item, key) in timezones" :key="key" :disabled="loading" :value="item.offset">
                                {{ item.UTC }}
                                <!-- <small>{{item.cities}}</small> -->
                            </md-option>
                        </md-select>
                    </md-field>
                </div>

                <div class="md-layout md-layout-item md-size-100">
                    <md-field class="with-subline" maxlength="5">
                        <label>{{ $t(`${$options.name}.description`) }}</label>
                        <md-textarea v-model="description" />
                    </md-field>
                </div>
            </div>
        </md-card-content>
        <md-card-actions>
            <md-button :disabled="loading" native-type="submit" class="md-raised md-success ml-auto" @click="updateClinicSettings">
                <div v-if="loading">
                    <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />
                    &nbsp;
                    <span> {{ $t(`${$options.name}.saving`) }}... </span>
                </div>
                <span v-else>
                    {{ $t(`${$options.name}.saving`) }}
                </span>
            </md-button>
        </md-card-actions>
    </md-card>
</template>
<script>
import { mapGetters } from 'vuex';
import { SlideYDownTransition } from 'vue2-transitions';
import { CLINIC_LOGO_UPLOAD, CLINIC_UPDATE, NOTIFY, TIMEZONES, COMMON_CURRENCY } from '@/constants';
import components from '@/components';

export default {
    name: 'ClinicSettings',
    components: {
        SlideYDownTransition,
        ...components
    },
    props: {
        buttonColor: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            selectedTimezone: '',
            selectedCurrency: '',
            timeZoneForOptions: [],
            currencyForOptions: [],
            address: '',
            image: '',
            email: '',
            url: '',
            phone: '',
            name: '',
            description: '',
            tax: 0,
            teethSystem: '',
            timezones: TIMEZONES,
            currency: COMMON_CURRENCY,
            loading: false,
            touched: {
                url: false,
                email: false,
                phone: false,
                name: false,
                tax: false
            },
            modelValidations: {
                url: {
                    url: true
                },
                email: {
                    email: true
                },
                phone: {
                    required: true,
                    min: 12,
                    max: 20
                },
                tax: {
                    min: 0
                },
                name: {
                    required: true
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic'
        })
    },
    watch: {
        url() {
            this.touched.url = true;
        },
        email() {
            this.touched.email = true;
        },
        phone() {
            this.touched.phone = true;
        },
        name() {
            this.touched.name = true;
        },
        tax() {
            this.touched.tax = true;
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$refs[ref].$el.focus();
        },
        timezoneSelected(timezoneL) {
            if (timezoneL) {
                this.timezones.forEach(element => {
                    if (`${element.cities}` === timezoneL.cities) {
                        this.currentClinic.timezoneOffset = element.offset;
                        this.selectedTimezone = `${element.UTC} ${element.cities}`;
                    }
                });
            }
        },
        currencySelected(currency) {
            console.log(currency);
            if (currency) {
                Object.values(this.currency).forEach(element => {
                    if (element.code === currency.code) {
                        this.currentClinic.currencyCode = element.code;
                        this.selectedCurrency = `${element.symbol} ${element.name} ${element.code}`;
                    }
                });
            }
        },
        validate() {
            this.$validator.validate('url', 'email', 'phone', 'name', 'tax').then(isValid => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
            this.touched.url = true;
            this.touched.email = true;
            this.touched.phone = true;
        },
        updateClinicLogo(fd) {
            this.$store
                .dispatch(CLINIC_LOGO_UPLOAD, {
                    fd
                })
                .then(response => {
                    console.log(response);
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Image uploaded',
                            type: 'success'
                        }
                    });
                });
        },
        updateClinicSettings() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loading = true;
                    const clinic = {
                        image: this.image,
                        email: this.email,
                        url: this.url,
                        phone: this.phone,
                        address: this.address,
                        name: this.name,
                        tax: this.tax,
                        teethSystem: this.teethSystem,
                        timezoneOffset: this.selectedTimezone,
                        currencyCode: this.selectedCurrency,
                        description: this.description
                    };
                    this.$store
                        .dispatch(CLINIC_UPDATE, {
                            clinic
                        })
                        .then(response => {
                            if (response) {
                                this.loading = false;
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'Settings updated',
                                        type: 'success'
                                    }
                                });
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            throw new Error(err);
                        });
                }
            });
        },
        createArrayTimezones() {
            const Ntimezones = {};
            this.timezones.forEach(element => {
                this.timeZoneForOptions.unshift(`${element.UTC} ${element.cities}`);
            });

            return Ntimezones;
        },
        createArrayCurrency() {
            const Ncurrency = {};
            Object.values(this.currency).forEach(element => {
                this.currencyForOptions.unshift(`${element.symbol} ${element.name} ${element.code}`);
            });

            return Ncurrency;
        },
        setLocalTimezone() {
            this.$nextTick(() => {
                this.timezones.forEach(element => {
                    if (element.offset === this.currentClinic.timezoneOffset) {
                        this.selectedTimezone = `${element.UTC} ${element.cities}`;
                    }
                });
            });
        },
        setLocalCurrency() {
            Object.values(this.currency).forEach(element => {
                if (element.code === this.currentClinic.currencyCode) {
                    this.selectedCurrency = `${element.symbol} ${element.name} ${element.code}`;
                }
            });
        },
        loadData() {
            // this.createArrayTimezones();
            // this.createArrayCurrency();
            // this.setLocalTimezone();
            // this.setLocalCurrency();
            this.url = this.currentClinic.url;
            this.address = this.currentClinic.address;
            this.email = this.currentClinic.email;
            this.phone = this.currentClinic.phone;
            this.name = this.currentClinic.name;
            this.tax = this.currentClinic.tax;
            this.teethSystem = this.currentClinic.teethSystem;
            this.selectedTimezone = this.currentClinic.timezoneOffset;
            this.selectedCurrency = this.currentClinic.currencyCode;
            this.description = this.currentClinic.description;
        }
    }
};
</script>
<style lang="scss">
.md-highlight-text-match {
    border-radius: 2px;
    background-color: yellow !important;
    padding: 0 !important;
}
</style>
