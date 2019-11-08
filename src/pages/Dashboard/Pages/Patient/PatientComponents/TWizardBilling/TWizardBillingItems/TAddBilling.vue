<template>
    <div class="wizard-tab-content add-billing">
        <md-toolbar class="toolbar-jaw  t-toolbar md-transparent">
            <t-toolbar-row :headers="headers" />
            <div v-if="unselectedProcedures.length > 0" class="md-layout md-toolbar-row md-size-100 md-alignment-center-space-beetwen">
                <div ref="autocomplete" class="manipulations-autocomplite md-layout-item">
                    <cool-select
                        ref="autocomplete"
                        v-model="selectedProcedure"
                        class="with-action md-field"
                        :class="[{ 'md-focused': coolSelectFocus }]"
                        tabindex="1"
                        :items="unselectedProcedures"
                        :arrows-disable-instant-selection="true"
                        :disable-first-item-select-on-enter="true"
                        item-text="text"
                        item-value="title"
                        :placeholder="selectedProcedure ? '' : 'Select unbilled procedures'"
                        @focus="coolSelectFocus = true"
                        @blur="coolSelectFocus = false"
                        @select="setProcedureToAdd"
                    >
                        <template v-if="item" slot="item" slot-scope="{ item }">
                            <div style="display: flex;">
                                <md-button class="IZ-select-button md-layout-item">
                                    <span v-if="item.title" class="text-left">{{ `${item.code} - ${item.title}` }} </span>
                                    <span v-if="item.teeth" class="teeth md-layout-item">
                                        <span v-for="(toothID, toothKey) in item.teeth" :key="toothKey" class="tooth procedures">
                                            {{ toothKey | toCurrentTeethSystem }}
                                        </span>
                                    </span>

                                    <span class="text-right">
                                        {{
                                            //! TODO из бэка брать
                                            33333
                                        }}
                                        {{ currency }}
                                    </span>
                                </md-button>
                            </div>
                        </template>
                        <template slot="no-data">
                            <div class="md-layout" style="display: flex; white-space: pre-wrap;oveflow:hidden;">
                                <span class="md-layout-item md-size-100" style="white-space: pre-wrap;oveflow:hidden;"
                                    >No procedures were found.</span
                                >
                            </div>
                        </template>
                    </cool-select>
                </div>
                <div class="manipulations-input__action md-alignment-center-right md-layout md-layout-item">
                    <md-button
                        :disabled="!selectedProcedure"
                        :class="[{ 'md-primary': selectedProcedure }]"
                        class="md-button md-just-icon md-round"
                        @click="addProcedure()"
                    >
                        <md-icon>add</md-icon>
                    </md-button>
                </div>
            </div>
        </md-toolbar>

        <div class="content-wrapper md-layout-item md-card-plain">
            <div
                v-for="(p, key) in selectedProcedures"
                :key="key"
                class="procedure"
                :class="[{ 'just-added': p.justAdded }, { 'to-delete': p.ID === itemToDelete.ID }]"
            >
                <hr class="md-size-100 md-layout-item" />
                <div class="procedure_header">
                    <div class="procedure_header-num">
                        <b>{{ key + 1 }}</b>
                    </div>
                    <div class="procedure_header-title">
                        <div class="md-layout md-layout-item md-size-100">
                            <b>{{ p.code }} - {{ p.title }}</b>
                            <span v-if="p.teeth" class="teeth md-layout-item">
                                <span v-for="(toothID, toothKey) in p.teeth" :key="toothKey" class="tooth procedures">
                                    {{ toothKey | toCurrentTeethSystem }}
                                </span>
                            </span>
                        </div>
                        <div class="md-layout-item md-size-100">
                            <small>{{ patient.plans[p.planID].title }}</small>
                        </div>
                    </div>
                    <div class="procedure_header-price">
                        <div class="procedure_header-created md-layout-item">
                            <span class="md-medium-hide">
                                {{ p.created | moment('from') }}
                                <br />
                            </span>
                            <small>{{ p.created | moment('calendar') }}</small>
                        </div>
                        // !TODO из бэка
                        <animated-number :to-fix="2" :value="33333" />
                        &nbsp;{{ currency}}
                    </div>
                    <div class="procedure_header-actions">
                        <md-button class="md-just-icon md-round md-simple" @click="setItemToDelete(p)">
                            <md-icon>close</md-icon>
                        </md-button>
                    </div>
                </div>
                <manipulations-table v-if="p.manipulations" :manipulations-ids="p.manipulations"/>
            </div>
        </div>
        <hr />
        <div class="md-layout">
            <div class="total md-layout-item md-layout md-size-100">
                <div class="md-layout-item text-right">
                    <div>
                        <div class="category">
                            <b>Sum</b>
                        </div>
                        <h3 class="title">
                            <animated-number :to-fix="2" :value="totalPrice" />
                            <small>&nbsp;{{ currency }}</small>
                        </h3>
                    </div>
                </div>
            </div>
            <div class="md-layout-item md-alignment-center-right md-layout md-size-100">
                <label class="md-layout-item md-size-35 md-form-label">
                    Add discount to this invoice
                </label>
                <div class="md-layout-item md-size-30">
                    <md-field
                        :class="[
                            { 'with-subline': true },
                            {
                                'md-valid': !errors.has('discount') && touched.discount
                            },
                            { 'md-error': errors.has('discount') }
                        ]"
                    >
                        <label>Discount %</label>
                        <md-input
                            ref="discount"
                            v-model="invoice.discount"
                            v-validate="'between:0,101'"
                            min="0"
                            max="100"
                            type="number"
                            data-vv-name="discount"
                            name="between_field"
                        />
                        <span class="md-error">{{ errors.first('discount') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('discount')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(invoice.discount = ''), focusOn('discount')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('discount') && touched.discount"
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
                <div class="total text-right md-layout-item md-layout md-size-30">
                    <div>
                        <p class="category" :style="{ color: getGreenToRed(invoice.discount) }">
                            <b>After Discount </b>&nbsp;( -
                            <animated-number :to-fix="2" :value="discountSum || 0" />
                            <small>&nbsp;{{ currency }}</small
                            >)
                        </p>
                        <h3 :style="{ color: getGreenToRed(invoice.discount) }" class="title">
                            <animated-number :to-fix="2" :value="afterDiscount" />
                            <small>&nbsp;{{ currency }}</small>
                        </h3>
                    </div>
                </div>
            </div>

            <div class="md-layout-item md-alignment-center-right md-layout md-size-100">
                <label class="md-layout-item md-size-35 md-form-label">
                    Add tax to this invoice
                </label>
                <div class="md-layout-item md-size-30">
                    <md-field
                        :class="[{ 'with-subline': true }, { 'md-valid': !errors.has('tax') && touched.tax }, { 'md-error': errors.has('tax') }]"
                    >
                        <label>Tax %</label>
                        <md-input ref="tax" v-model="invoice.tax" v-validate="'min_value:0'" min="0" max="100" type="number" data-vv-name="tax" />
                        <span class="md-error">{{ errors.first('tax') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('tax')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(invoice.tax = ''), focusOn('tax')"
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
                                class="md-button
                                md-icon-button md-dense
                                md-input-action
                                noselect md-simple"
                            >
                                <md-icon class="success">
                                    done
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>
                <div class="total text-right md-layout-item md-layout md-size-30">
                    <div>
                        <p class="category">
                            <b>After Tax</b>&nbsp;(
                            <animated-number :to-fix="2" :value="taxSum" />
                            <small>&nbsp;{{ currency }}</small
                            >)
                        </p>
                        <h3 class="title">
                            <animated-number :to-fix="2" :value="afterTax" />
                            <small>&nbsp;{{ currency }}</small>
                        </h3>
                    </div>
                </div>
            </div>
            <div class="md-layout-item md-alignment-center-right md-layout md-size-100">
                <label class="md-layout-item md-size-35 md-form-label">
                    Set postponement date
                </label>
                <div class="md-layout-item md-size-30">
                    <md-datepicker
                        v-model="invoice.dueDate"
                        v-validate="{ is_after: new Date() }"
                        md-immediately
                        :class="[
                            { 'with-subline': true },
                            {
                                'md-valid': !errors.has('dueDate') && touched.dueDate
                            },
                            { 'md-error': errors.has('dueDate') }
                        ]"
                        name="dueDate"
                        :md-disabled-dates="disabledDates"
                    >
                        <label>Select due date</label>
                        <span class="md-error">{{ errors.first('dueDate') }}</span>
                        <slide-y-down-transition>
                            <md-button
                                v-show="errors.has('dueDate')"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action"
                                @click="(invoice.dueDate = ''), focusOn('dueDate')"
                            >
                                <md-icon class="error">
                                    close
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="!errors.has('dueDate') && touched.dueDate"
                                tabindex="-1"
                                class="md-button
                                md-icon-button md-dense
                                md-input-action
                                noselect
                                md-simple"
                            >
                                <md-icon class="success">
                                    done
                                </md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-datepicker>
                </div>
                <div class="total text-right md-layout-item md-layout md-size-30">
                    <div>
                        <p class="category">
                            <b>Due date</b>
                        </p>
                        <h3 v-if="invoice.dueDate" class="title">
                            {{ invoice.dueDate | moment('ll') }}
                        </h3>
                    </div>
                </div>
            </div>
            <hr class="md-layout-item md-size-100" />
            <div style="padding-bottom:22px;" class="md-layout-item md-layout text-right  md-size-100">
                <div class="md-layout-item ">
                    <p class="category">
                        <b>Total Sum</b>
                    </p>
                    <h2 class="title">
                        <animated-number :to-fix="2" :value="afterTax" />
                        <small>&nbsp;{{ currency }}</small>
                    </h2>
                </div>
            </div>
        </div>
        <md-field>
            <label>Note</label>
            <md-textarea v-model="invoice.note" />
        </md-field>
        <md-snackbar :md-position="'center'" :md-duration="10000" :md-active.sync="showDeleteItemSnackbar" md-persistent>
            <div class="snackbar-text-wrapper">
                Delete
                {{ itemToDelete.code }} - {{ itemToDelete.title }}?
            </div>
            <div>
                <md-button class="md-simple" @click="(showDeleteItemSnackbar = false), (itemToDelete = {})">
                    cancel
                </md-button>
                <md-button :disabled="deleting" class="md-warning" @click="deleteItem()">
                    <div v-if="deleting">
                        <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />
                        &nbsp;
                        <span>
                            Deleting...
                        </span>
                    </div>
                    <span v-else>
                        <md-icon>
                            delete
                        </md-icon>
                        delete
                    </span>
                </md-button>
            </div>
        </md-snackbar>
    </div>
</template>
<script>
/* eslint-disable func-names */
import { SlideYDownTransition } from 'vue2-transitions';
import { ManipulationsTable } from './ManipulationsTable';
import { CoolSelect } from 'vue-cool-select';
import { mapGetters } from 'vuex';
import animatedNumber from '@/components/AnimatedNumber';
import { NOTIFY, STORE_KEY_PATIENT } from '@/constants';
import TToolbarRow from '@/components/CustomComponents/TToolbarRow';

export default {
    name: 'TAddBilling',
    components: {
        SlideYDownTransition,
        CoolSelect,
        TToolbarRow,
        animatedNumber,
        ManipulationsTable
    },
    model: {
        prop: 'selectedProcedures',
        event: 'change'
    },
    props: {
        size: {
            type: Object,
            default: () => {}
        },
        invoiceToCreate: {
            type: Object,
            default: () => {}
        },
        selectedProcedures: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            disabledDates: date => date < this.currentDate,
            invoice: {
                dueDate: null,
                created: null,
                discount: null,
                round: null,
                tax: null,
                note: null,
                total: null,
                payments: [],
                procedures: []
            },
            deleting: false,
            showDeleteItemSnackbar: false,
            itemToDelete: {},
            coolSelectFocus: false,
            currentDate: new Date(),
            manipulationsNum: 0,
            selectedProcedure: '',
            modelValidations: {
                dueDate: {},
                discount: {},
                tax: {
                    min: 0
                },
                round: {
                    min: 0
                }
            },
            touched: {
                dueDate: false,
                discount: false,
                tax: false,
                round: false
            }
        };
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            allManipulations: `${STORE_KEY_PATIENT}/getAllManipulations`,
            getUnbilledAndApprovedPlansProcedures: `${STORE_KEY_PATIENT}/getUnbilledAndApprovedPlansProcedures`,
            currency: 'getCurrency'
        }),
        headers() {
            const headers = [
                {
                    title: 'Sum',
                    subTitlePrefix: parseInt(this.selectedProcedures.length, 10),
                    subTitlePostfix: 'procedures',
                    subTitleToFix: 0,
                    valuePrefix: this.totalPrice,
                    valuePostfix: this.currency,
                    valueToFix: 2
                },
                {
                    title: 'Discount',
                    subTitlePrefix: parseInt(this.invoice.discount, 10) || 0,
                    subTitlePostfix: '%',
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.discountSum, 10),
                    valueToFix: 2,
                    valuePostfix: this.currency
                },
                {
                    title: 'Tax',
                    subTitlePrefix: parseInt(this.invoice.tax, 10) || 0,
                    subTitlePostfix: '%',
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.taxSum, 10),
                    valueToFix: 2,
                    valuePostfix: this.currency
                },
                {
                    title: 'Total sum',
                    // !TODO пофиксить из бэка
                    subTitlePrefix: 33333,
                    subTitlePostfix: 'manipulations',
                    subTitleToFix: 0,
                    valuePrefix: parseInt(this.afterTax, 10),
                    valueToFix: 2,
                    valuePostfix: this.currency
                }
            ];
            return headers;
        },
        totalPrice() {
            // ! TODO из бэка берется
            return 3333
        },
        unselectedProcedures() {
            const procedures = this.getUnbilledAndApprovedPlansProcedures.filter(
                p => !this.selectedProcedures.find(searchedP => searchedP.ID === p.ID)
            );
            procedures.forEach((p, i) => {
                procedures[i].text = `${p.code} - ${p.title}`;
            });
            return procedures || [];
        },
        afterDiscount() {
            const absDics = (this.totalPrice / 100) * this.invoice.discount;
            const disc = this.totalPrice - absDics;
            return disc > 0 ? parseInt(disc, 10) : 0;
        },
        discountSum() {
            const absDics = (this.totalPrice / 100) * this.invoice.discount;
            return absDics;
        },
        afterTax() {
            const tax = this.invoice.tax < 0 ? 0 : this.invoice.tax;
            const absTax = parseInt((this.afterDiscount / 100) * tax, 10);
            const taxAbs = parseInt(this.afterDiscount, 10) + absTax;
            return taxAbs > 0 ? taxAbs : 0;
        },
        taxSum() {
            const absTax = this.afterDiscount ? (this.afterDiscount / 100) * this.invoice.tax : 0;
            return this.invoice.tax > 0 ? absTax : 0;
        }
    },
    watch: {
        'invoice.discount': function() {
            this.touched.discount = true;
            // this.invoice.round = this.afterDiscount;
        },
        // afterDiscount(value) {
        //     this.invoice.round = value;
        // },
        'invoice.dueDate': function() {
            this.touched.dueDate = true;
        },
        'invoice.tax': function() {
            this.touched.tax = true;
            this.invoice.total = this.afterTax;
        },
        afterTax(val) {
            this.invoice.total = val;
        },
        // 'invoice.round': function (value) {
        //     if (!value) {
        //         this.invoice.round = this.afterDiscount;
        //     }
        //     this.touched.round = true;
        // },
        invoice: {
            handler(newValue) {
                this.$emit('onCreateInvoice', newValue);
            },
            deep: true
        }
    },
    created() {
        this.invoice.procedures = this.selectedProcedures.map(p => p.ID);
        this.invoice.tax = this.clinic.tax;
        this.invoice.total = this.afterTax;
        if (!this.invoice.created) {
            this.invoice.created = new Date();
        }
    },
    methods: {
        setItemToDelete(item) {
            this.showDeleteItemSnackbar = true;
            this.itemToDelete = item;
        },
        deleteItem() {
            const index = this.selectedProcedures.findIndex(p => p.ID === this.itemToDelete.ID);
            if (index > -1) {
                this.selectedProcedures.splice(index, 1);
            }
            this.showDeleteItemSnackbar = false;
        },
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$refs[ref].$el.focus();
        },
        validate() {
            this.touched.tax = true;
            this.touched.round = true;
            this.touched.discount = true;
            this.touched.dueDate = true;
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res, 'step2');
                this.$emit('validated-code', this.code);
                this.$emit('onCreateInvoice', this.invoice);
                return res;
            });
        },
        setProcedureToAdd(procedure) {
            this.procedureToAdd = procedure;
        },
        addProcedure() {
            this.selectedProcedure = '';
            // this.selectedProcedures.push(this.procedureToAdd)
            this.$emit('change', this.procedureToAdd);
            this.$store.dispatch(NOTIFY, {
                settings: {
                    message: `Procedure ${this.procedureToAdd.code} ${this.procedureToAdd.title} added to invoice list`,
                    type: 'success'
                }
            });
        },
        getGreenToRed(percent) {
            let p = '';
            if (percent < 0) {
                p = 100 - 0;
            } else if (percent > 100) {
                p = 100 - 100;
            } else {
                p = 100 - percent;
            }
            const r = p < 50 ? 225 : Math.floor(255 - ((p * 2 - 100) * 255) / 100);
            const g = p >= 50 ? 225 : Math.floor((p * 2 * 255) / 100);
            return `rgb(${r},${g},0)`;
        }
    }
};
</script>
