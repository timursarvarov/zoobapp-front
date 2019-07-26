<template>
    <md-card class="md-card-profile currentClinic-wrapper">
        <t-avatar-input
            :textToColor="currentClinic.ID"
            :maxFilesize="2000"
            :imageSrc="currentClinic.logo"
            :title="currentClinic.name"
            :formTitle="'Add clinic logo'"
            :buttonColor="'green'"
            @on-created="updateClinicLogo"
        />
        <md-card-content>
            <div class="md-layout" >
                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                        {'with-subline': true},
                        {'md-valid': !errors.has('name') && touched.name},
                        {'md-error': errors.has('name')}]"
                    >
                        <label>Clinic Name</label>
                        <md-input
                            :disabled="loading"
                            v-model="name"
                            type="text"
                            ref="name"
                            data-vv-name="name"
                            required
                            v-validate="modelValidations.name"
                        ></md-input>
                        <span v-show="!errors.has('name') && touched.name" class="md-helper-text">Enter a cool currentClinic name</span>
                        <span class="md-error">{{errors.first('name')}}</span>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="errors.has('name')"
                                @click="name='',focusOn('name')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('name')  && touched.name"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                        {'with-subline': true},
                        {'md-valid': !errors.has('phone') && touched.phone},
                        {'md-error': errors.has('phone')}]"
                    >
                        <label>Phone</label>
                        <span class="md-prefix">+</span>
                        <md-input
                            :disabled="loading"
                            ref="phone"
                            v-model="phone"
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
                                @click="phone='',focusOn('phone')"
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

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field class='with-subline'>
                        <label>Address</label>
                        <md-input  v-model="address" type="text"></md-input>
                    </md-field>
                </div>

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                        {'with-subline': true},
                        {'md-valid': !errors.has('url') && touched.url},
                        {'md-error': errors.has('url')}]"
                    >
                        <label>Clinic web site address</label>
                        <md-input
                            :disabled="loading"
                            autocomplete="site"
                            ref="url"
                            v-model="url"
                            type="text"
                            data-vv-name="url"
                            required
                            v-validate="modelValidations.url"
                        ></md-input>
                        <span class="md-error">{{errors.first('url')}}</span>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="errors.has('url')"
                                @click="url='',focusOn('url')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('url')  && touched.url"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                        {'with-subline': true},
                        {'md-valid': !errors.has('email') && touched.email},
                        {'md-error': errors.has('email')}]"
                    >
                        <label>Email</label>
                        <md-input
                            :disabled="loading"
                            autocomplete="email"
                            v-model="email"
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
                                @click="email='',focusOn('email')"
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

                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field
                        :class="[
                        {'with-subline': true},
                        {'md-valid': !errors.has('tax') && touched.tax},
                        {'md-error': errors.has('tax')}]"
                    >
                        <label>Tax %</label>
                        <md-input
                            :disabled="loading"
                            data-vv-name="tax"
                            ref="tax" v-model="tax" type="number" min="0"
                            v-validate="modelValidations.tax"
                        ></md-input>
                        <span v-show="!errors.has('tax') && touched.tax" class="md-helper-text">Tax will be added to clients bill</span>
                        <span class="md-error">{{errors.first('tax')}}</span>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="errors.has('tax')"
                                @click="tax='',focusOn('tax')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('tax')  && touched.tax"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>
                <div class="md-layout md-layout-item md-small-size-100 md-size-33">
                    <md-field class='with-subline' >
                        <label for="teethSystem">Teeth System</label>
                        <md-select
                            :disabled="loading"
                            v-model="teethSystem" name="teethSystem" id="teethSystem">
                            <md-option :value="1">FDI World Dental Federation notation</md-option>
                            <md-option :value="2">Universal numbering system</md-option>
                            <md-option :value="3">Palmer notation method</md-option>
                        </md-select>
                    </md-field>
                </div>
                 <div class="md-layout md-layout-item md-size-33">
                    <md-field class='with-subline' >
                        <label for="selectedCurrency">Select Currency</label>
                        <md-select  md-dense v-model="selectedCurrency" name="selectedCurrency" id="selectedCurrency">
                            <md-option
                                :disabled="loading"
                                v-for="(item, key) in  currency"
                                :key="key"
                                :value="item.code">
                                {{`${item.code} - ${item.symbol} ${item.name} `}}
                            </md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout md-layout-item md-size-33">
                     <md-field class='with-subline' >
                        <label for="teethSystem">Select UTC Timezone</label>
                        <md-select  md-dense v-model="selectedTimezone" name="selectedCurrency" id="selectedCurrency">
                            <md-option
                                :disabled="loading"
                                v-for="(item, key) in  timezones"
                                :key="key"
                                :value="item.offset">
                                {{ item.UTC}}
                                <!-- <small>{{item.cities}}</small> -->
                            </md-option>
                        </md-select>
                    </md-field>
                </div>

                <div class="md-layout md-layout-item md-size-100">
                    <md-field class='with-subline' maxlength="5">
                        <label>Description</label>
                        <md-textarea v-model="description"></md-textarea>
                    </md-field>
                </div>
            </div>
        </md-card-content>
        <md-card-actions>
            <md-button
                :disabled="loading"
                native-type="submit"
                @click="updateClinicSettings"
                class="md-raised md-success ml-auto"
            >
            <div v-if="loading">
                <md-progress-spinner
                        class="t-white"
                        :md-diameter="12"
                        :md-stroke="2"
                        md-mode="indeterminate"
                    >
                </md-progress-spinner>
                &nbsp;
            <span >
                Saving...
            </span >
            </div>
            <span v-else>
                Update Settings
            </span>


            </md-button>
        </md-card-actions>
    </md-card>
</template>
    <script>
    import { mapGetters } from 'vuex';
    import { SlideYDownTransition } from 'vue2-transitions';
    import {
        CLINIC_LOGO_UPLOAD,
        CLINIC_UPDATE,
        NOTIFY,
        TIMEZONES,
        COMMON_CURRENCY,
    } from '@/constants';
    import { TAvatarInput } from '@/components';

    export default {
        components: {
            SlideYDownTransition,
            TAvatarInput,
        },
        name: 'currentClinic-settings',
        props: {
            buttonColor: {
                type: String,
                default: '',
            },
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
                    tax: false,
                },
                modelValidations: {
                    url: {
                        url: true,
                    },
                    email: {
                        email: true,
                    },
                    phone: {
                        required: true,
                        min: 12,
                        max: 20,
                    },
                    tax: {
                        min: 0,
                    },
                    name: {
                        required: true,
                    },
                },
            };
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
                    this.timezones.forEach((element) => {
                        if (`${element.cities}` === timezoneL.cities) {
                            this.currentClinic.timezoneOffset = element.offset;
                            this.selectedTimezone = `${element.UTC} ${
                                element.cities
                            }`;
                        }
                    });
                }
            },
            currencySelected(currency) {
                console.log(currency);
                if (currency) {
                    Object.values(this.currency).forEach((element) => {
                        if (element.code === currency.code) {
                            this.currentClinic.currencyCode = element.code;
                            this.selectedCurrency = `${element.symbol} ${
                                element.name
                            } ${element.code}`;
                        }
                    });
                }
            },
            validate() {
                this.$validator
                    .validate('url', 'email', 'phone', 'name', 'tax')
                    .then((isValid) => {
                        this.$emit('on-submit', this.registerForm, isValid);
                    });
                this.touched.url = true;
                this.touched.email = true;
                this.touched.phone = true;
            },
            updateClinicLogo(fd) {
                this.$store
                    .dispatch(CLINIC_LOGO_UPLOAD, {
                        fd,
                    })
                    .then((response) => {
                        console.log(response);
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Image uploaded',
                                type: 'success',
                            },
                        });
                    });
            },
            updateClinicSettings() {
                this.$validator.validateAll().then((result) => {
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
                            description: this.description,
                        };
                        this.$store
                            .dispatch(CLINIC_UPDATE, {
                                clinic,
                            })
                            .then((response) => {
                                if (response) {
                                    this.loading = false;
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message: 'Settings updated',
                                            type: 'success',
                                        },
                                    });
                                }
                            })
                            .catch(
                                (err) => {
                                    this.loading = false;
                                    console.log(err);
                                },
                            );
                    }
                });
            },
            createArrayTimezones() {
                const Ntimezones = {};
                this.timezones.forEach((element) => {
                    this.timeZoneForOptions.unshift(
                        `${element.UTC} ${element.cities}`,
                    );
                });

                return Ntimezones;
            },
            createArrayCurrency() {
                const Ncurrency = {};
                Object.values(this.currency).forEach((element) => {
                    this.currencyForOptions.unshift(
                        `${element.symbol} ${element.name} ${element.code}`,
                    );
                });

                return Ncurrency;
            },
            setLocalTimezone() {
                this.$nextTick(() => {
                    this.timezones.forEach((element) => {
                        if (element.offset === this.currentClinic.timezoneOffset) {
                            this.selectedTimezone = `${element.UTC} ${
                                element.cities
                            }`;
                        }
                    });
                });
            },
            setLocalCurrency() {
                Object.values(this.currency).forEach((element) => {
                    if (element.code === this.currentClinic.currencyCode) {
                        this.selectedCurrency = `${element.symbol} ${
                            element.name
                        } ${element.code}`;
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
            },
        },
        computed: {
            ...mapGetters({
                currentClinic: 'getCurrentClinic',
            }),
        },
        created() {
            this.loadData();
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
            },
        },
    };
</script>
<style lang="scss">
 .md-highlight-text-match {
        border-radius: 2px;
        background-color: yellow !important;
        padding: 0 !important;
    }
</style>
