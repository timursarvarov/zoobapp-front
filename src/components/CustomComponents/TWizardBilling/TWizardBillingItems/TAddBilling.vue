<template>
    <div class="wizard-tab-content add-billing">
        <div class="absolute-header-block">
            <md-toolbar class="toolbar-jaw  md-layout md-alignment-center-space-between md-transparent">
                <div class="total text-right md-layout-item md-size-20 md-medium-size-33">
                    <p
                        class="category"
                    >
                        <b>Created</b>
                    </p>
                    <h3
                        class="title"
                    >
                        {{invoice.created || new Date()  | moment('ll')}}
                    </h3>
                </div>
                 <div class="md-layout-item md-size-20 md-medium-size-33 text-right">
                    <p
                        class="category"
                    >
                        <b>Sum sdfasdfa</b>
                    </p>
                    <h3
                        class="title"
                    >
                        <animated-number :toFix="2" :value="calculateProcedures" />
                        <small>&nbsp;{{currencyCode}}</small>
                    </h3>
                </div>

                <div class="md-layout-item md-size-20 md-medium-size-33 text-right">
                    <p
                        class="category"
                    >
                        <b>Discount </b>&nbsp;(
                        - <animated-number :toFix="2"  :value="discountSum" />
                        <small>&nbsp;{{currencyCode}}</small>)
                    </p>
                    <h3
                        class="title"
                    >
                        <animated-number :value="invoice.discount" />
                        <small>&nbsp;%</small>
                    </h3>
                </div>
                <div class=" md-layout-item md-size-20 md-medium-size-33 text-right">
                    <p
                        class="category"
                    >
                        <b>Round off</b>&nbsp;(
                        <animated-number  :toFix="2" :value="roundPercentage" />
                        <small>&nbsp;%</small>)
                    </p>
                    <h3
                        class="title"
                    >
                        <animated-number :toFix="2" :value="afterRound" />
                        <small>&nbsp;{{currencyCode}}</small>
                    </h3>
                </div>
                <div class=" md-layout-item md-size-20 md-medium-size-33 text-right">
                        <p
                            class="category"
                        >
                            <b>Tax</b>&nbsp;(
                            <animated-number  :toFix="2" :value="taxSum" />
                            <small>&nbsp;{{currencyCode}}</small>)
                        </p>
                        <h3
                            class="title"
                        >
                            <animated-number :value="invoice.tax||0" />
                            <small>&nbsp;%</small>
                        </h3>
                </div>
                <div class="md-layout-item md-size-20 md-medium-size-33 text-right">
                    <p
                        class="category"
                    >
                        <b>Total Sum</b>
                    </p>
                    <h3
                        class="title"
                    >
                        <animated-number :toFix="2" :value="afterTax" />
                        <small>&nbsp;{{currencyCode}}</small>
                    </h3>
                </div>

                <div v-if="unselectedProcedures.length > 0"  class="md-layout md-size-100 md-alignment-center-space-beetwen">
                    <div
                        class="manipulations-autocomplite md-layout-item"
                        ref="autocomplete"
                    >
                        <cool-select
                            tabindex="1"
                            v-model="selectedProcedure"
                            :items="unselectedProcedures"
                            :arrowsDisableInstantSelection="true"
                            :disableFirstItemSelectOnEnter="true"
                            item-text="text"
                            itemValue="title"
                            ref="autocomplete"
                            @select="setProcedureToAdd"
                            :placeholder="selectedProcedure ? '': 'Select manipulation'"
                        >
                            <template v-if="item" slot="item" slot-scope="{ item }">
                                <div style="display: flex;">
                                    <md-button class="IZ-select-button md-layout-item">
                                        <span
                                            class="text-left"
                                            v-if="item.title && item.code"
                                        >{{ `${item.code} - ${item.title}` }}</span>
                                        <span
                                            class="text-right"
                                        >{{`${calculateManipulations(item.manipulations)}`}} {{currencyCode}}</span>
                                    </md-button>
                                </div>
                            </template>
                            <template slot="no-data">
                                <div
                                    class="md-layout"
                                    style="display: flex; white-space: pre-wrap;oveflow:hidden;"
                                >
                                    <span
                                        class="md-layout-item md-size-100"
                                        style="white-space: pre-wrap;oveflow:hidden;"
                                    >No procedures were found.</span>
                                </div>
                            </template>
                        </cool-select>
                    </div>
                    <div
                        class="manipulations-input__action md-alignment-center-right md-layout md-layout-item"
                    >
                        <md-button
                            :disabled="!selectedProcedure"
                            :class="[{'md-primary': selectedProcedure}]"
                            class="md-button md-just-icon md-round"
                            @click="addProcedure()"
                        >
                            <md-icon>add</md-icon>
                        </md-button>
                    </div>
                </div>
            </md-toolbar>
        </div>
        <div class="content-wrapper md-card-plain">
            <div
                v-for="(p, key) in selectedProcedures"
                :key="key"
                class="md-layout procedure md-alignment-center-right"
            >
                <hr class="md-size-100 md-layout-item" style="opacity: 0.2" />
                <div
                    class="md-layout-item md-layout md-size-100 md-alignment-center-space-beetwen procedure__title"
                >
                    <div class="md-layout">
                        <div class="md-layout md-layout-item md-alignment-center-left md-size-10">
                            <b>{{key+1}}</b>
                        </div>
                        <div class="md-layout md-layout-item md-alignment-center-left">
                            <div class="md-layout-item md-size-100">
                                <b>{{p.code}} - {{p.title}}</b>
                            </div>
                            <div class="md-layout-item md-size-100">
                                <small>{{p.planTitle}}</small>
                            </div>
                        </div>
                        <div class="md-layout md-layout-item md-alignment-center-right">
                            <animated-number :toFix="2" :value="calculateManipulations(p.manipulations)||0" />
                            &nbsp;{{currencyCode}}
                        </div>
                    </div>
                </div>
                <div class="md-layout-item md-size-90">
                    <md-table
                        v-model="p.manipulations"
                        class="no-header small"
                        table-header-color="green"
                    >
                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                            <md-table-cell md-label="Code">
                                <small>{{ item.manipulation.code }}</small>
                            </md-table-cell>
                            <md-table-cell class="manipulation-title" md-label="Title">
                                <small>{{ item.manipulation.title }}</small>
                            </md-table-cell>
                            <md-table-cell md-label="Qty" class="manipulations-input">
                                <small>{{item.num}}</small>
                            </md-table-cell>
                            <md-table-cell>*</md-table-cell>
                            <md-table-cell md-label="Price">
                                <small>{{ (item.price? item.price: 0).toFixed(2) }}</small>
                            </md-table-cell>
                            <md-table-cell md-label="Total">
                                <small>{{ (item.price * item.num).toFixed(2) }} &nbsp;{{currencyCode}}</small>
                            </md-table-cell>
                        </md-table-row>
                    </md-table>
                </div>
            </div>
        </div>
        <hr/>
        <div class="md-layout" >

            <div class="total md-layout-item md-layout md-size-100">
                <div class="md-layout-item text-right">
                    <p
                        class="category"
                    >
                        <b>Sum</b>
                    </p>
                    <h3
                        class="title"
                    >
                        <animated-number :toFix="2" :value="calculateProcedures" />
                        <small>&nbsp;{{currencyCode}}</small>
                    </h3>
                </div>
            </div>
            <div class="md-layout-item md-alignment-center-right md-layout md-size-100">
                <label class="md-layout-item md-size-35 md-form-label">
                    Add discount to this invoice
                    </label>
                    <div class="md-layout-item md-size-30">
                        <md-field
                                :class="[
                                        {'with-subline': true},
                                        {'md-valid': !errors.has('discount') && touched.discount},
                                        {'md-error': errors.has('discount')}]"
                            >
                            <label>Discount %</label>
                            <md-input
                                min="0"
                                max="100"
                                v-model="invoice.discount"
                                ref="discount"
                                type="number"
                                data-vv-name="discount"
                                v-validate="'between:0,101'" name="between_field"
                            ></md-input>
                            <span class="md-error">{{errors.first('discount')}}</span>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="errors.has('discount')"
                                    @click="invoice.discount='',focusOn('discount')"
                                    class="md-button md-icon-button md-dense md-input-action"
                                >
                                    <md-icon class="error">close</md-icon>
                                </md-button>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="!errors.has('discount')  && touched.discount"
                                    class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                >
                                    <md-icon class="success">done</md-icon>
                                </md-button>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <div class="total text-right md-layout-item md-layout md-size-30">
                        <div >
                            <p
                                class="category"
                                :style="{color: getGreenToRed(invoice.discount)}"
                            >
                                <b>After Discount </b>&nbsp;(
                                - <animated-number :toFix="2" :value="discountSum||0" />
                                <small>&nbsp;{{currencyCode}}</small>)
                            </p>
                            <h3
                                :style="{color: getGreenToRed(invoice.discount)}"
                                class="title"
                            >
                                <animated-number :toFix="2" :value="afterDiscount" />
                                <small>&nbsp;{{currencyCode}}</small>
                            </h3>
                        </div>
                    </div>
            </div>
             <div class="md-layout-item md-alignment-center-right md-layout md-size-100">
                    <label class="md-layout-item md-size-35 md-form-label">
                    Round sum
                    </label>
                    <div class="md-layout-item md-size-30">
                        <md-field
                                :class="[
                                        {'with-subline': true},
                                        {'md-valid': !errors.has('round') && touched.round},
                                        {'md-error': errors.has('round')}]"
                            >
                            <label>Round {{currencyCode}}</label>
                            <md-input
                                min="0"
                                v-model="invoice.round"
                                ref="round"
                                type="number"
                                data-vv-name="round"
                                v-validate="modelValidations.round"
                            ></md-input>
                            <span class="md-error">{{errors.first('round')}}</span>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="errors.has('round')"
                                    @click="invoice.round='',focusOn('round')"
                                    class="md-button md-icon-button md-dense md-input-action"
                                >
                                    <md-icon class="error">close</md-icon>
                                </md-button>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="!errors.has('round')  && touched.round"
                                    class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                >
                                    <md-icon class="success">done</md-icon>
                                </md-button>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <div class="total text-right md-layout-item md-layout md-size-30" >
                        <div>
                            <p
                                class="category"
                                :style="{color: getGreenToRed(roundPercentage)}"
                            >
                                <b>After round off</b>&nbsp;(
                                <animated-number  :toFix="2" :value="roundPercentage" />
                                <small>&nbsp;%</small>)
                            </p>
                            <h3
                                class="title"
                                :style="{color: getGreenToRed(roundPercentage)}"
                            >
                                <animated-number :toFix="2" :value="afterRound" />
                                <small>&nbsp;{{currencyCode}}</small>
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
                                :class="[
                                        {'with-subline': true},
                                        {'md-valid': !errors.has('tax') && touched.tax},
                                        {'md-error': errors.has('tax')}]"
                            >
                            <label>Tax %</label>
                            <md-input
                                min="0"
                                max="100"
                                v-model="invoice.tax"
                                ref="tax"
                                type="number"
                                data-vv-name="tax"
                                v-validate="'min_value:0'"
                            ></md-input>
                            <span class="md-error">{{errors.first('tax')}}</span>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="errors.has('tax')"
                                    @click="invoice.tax='',focusOn('tax')"
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
                    <div class="total text-right md-layout-item md-layout md-size-30">
                        <div>
                            <p
                                class="category"
                            >
                                <b>After Tax</b>&nbsp;(
                                <animated-number  :toFix="2" :value="taxSum" />
                                <small>&nbsp;{{currencyCode}}</small>)
                            </p>
                            <h3
                                class="title"
                            >
                                <animated-number :toFix="2" :value="afterTax" />
                                <small>&nbsp;{{currencyCode}}</small>
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
                            md-immediately
                             :class="[
                                        {'with-subline': true},
                                        {'md-valid': !errors.has('dueDate') && touched.dueDate},
                                        {'md-error': errors.has('dueDate')}]"
                            v-validate="{'is_after':  new Date()}"
                            name="dueDate"
                            v-model="invoice.dueDate"
                            :md-disabled-dates="disabledDates"
                            >
                            <label>Select due date</label>
                            <span class="md-error">{{errors.first('dueDate')}}</span>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="errors.has('dueDate')"
                                    @click="invoice.dueDate='',focusOn('dueDate')"
                                    class="md-button md-icon-button md-dense md-input-action"
                                >
                                    <md-icon class="error">close</md-icon>
                                </md-button>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-button
                                    tabindex="-1"
                                    v-show="!errors.has('dueDate')  && touched.dueDate"
                                    class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                >
                                    <md-icon class="success">done</md-icon>
                                </md-button>
                            </slide-y-down-transition>
                        </md-datepicker>
                    </div>
                    <div class="total text-right md-layout-item md-layout md-size-30">
                        <div>
                            <p
                                class="category"
                            >
                                <b>Due date</b>
                            </p>
                            <h3
                                class="title"
                                v-if="invoice.dueDate"
                            >
                                {{invoice.dueDate  | moment('ll')}}
                            </h3>
                        </div>
                    </div>
            </div>
            <hr class="md-layout-item md-size-100"/>
            <div style="padding-bottom:22px;" class="md-layout-item md-layout text-right  md-size-100">
                <div class="md-layout-item ">
                    <p
                        class="category"
                    >
                        <b>Total Sum</b>
                    </p>
                    <h2
                        class="title"
                    >
                        <animated-number :toFix="2" :value="afterTax" />
                        <small>&nbsp;{{currencyCode}}</small>
                    </h2>
                </div>
            </div>
        </div>
        <md-field>
            <label>Note</label>
            <md-textarea v-model="invoice.note"></md-textarea>
        </md-field>
    </div>
</template>
<script>
/* eslint-disable func-names */
import { SlideYDownTransition } from 'vue2-transitions';
import { CoolSelect } from 'vue-cool-select';


export default {
  name: 't-add-billing',
  components: {
    // TAutoComplite,
    SlideYDownTransition,
    CoolSelect,
    'animated-number': () => import('@/components/AnimatedNumber'),
  },
  props: {
    size: {
      type: Object,
      default: () => {},
    },
    invoiceToCreate: {
      type: Object,
      default: () => {},
    },
    selectedProcedures: {
      type: Array,
      default: () => [],
    },
    allProcedures: {
      type: Array,
      default: () => [],
    },
    showAppointment: {
      type: Boolean,
      default: () => false,
    },
    currencyCode: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      disabledDates: date => date < this.currentDate,
      invoice: {
        dueDate: null,
        createdDate: null,
        discount: null,
        round: null,
        tax: null,
        note: null,
        total: null,
        payments: [],
        procedures: [],
      },
      currentDate: new Date(),
      manipulationsNum: 0,
      selectedProcedure: '',
      modelValidations: {
        dueDate: {
        },
        discount: {
        },
        tax: {
          min: 0,
        },
        round: {
          min: 0,
        },
      },
      touched: {
        dueDate: false,
        discount: false,
        tax: false,
        round: false,
      },
    };
  },
  methods: {
    calculateManipulations(m = []) {
      let sum = 0;
      m.forEach((manip) => {
        sum += manip.price * manip.num;
      });
      return sum;
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
      return this.$validator.validateAll().then((res) => {
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
      this.$emit('onProcedureAdd', this.procedureToAdd);
      this.invoice.procedures.push(this.procedureToAdd.id);
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
      const r = p < 50 ? 225 : Math.floor(255 - (p * 2 - 100) * 255 / 100);
      const g = p >= 50 ? 225 : Math.floor((p * 2) * 255 / 100);
      return `rgb(${r},${g},0)`;
    },
  },
  computed: {
    unselectedProcedures() {
      const procedures = this.allProcedures.filter(p => !this.selectedProcedures.find(searchedP => searchedP.id === p.id));
      return procedures || [];
    },
    afterDiscount() {
      const absDics = (this.calculateProcedures / 100) * this.invoice.discount;
      const disc = this.calculateProcedures - absDics;
      return disc > 0 ? parseInt(disc, 10) : 0;
    },
    discountSum() {
      const absDics = (this.calculateProcedures / 100) * this.invoice.discount;
      return absDics;
    },
    afterRound() {
      const r = this.invoice.round > 0 ? this.invoice.round : 0;
      return parseInt(r, 10);
    },
    roundPercentage() {
      let percentage = 0;
      if (this.afterDiscount !== 0) {
        const percent = this.afterDiscount / 100;
        const absDifferent = this.afterDiscount - this.afterRound;
        percentage = absDifferent / percent;
      }
      return percentage;
    },
    afterTax() {
      const tax = this.invoice.tax < 0 ? 0 : this.invoice.tax;
      const absTax = parseInt(((this.afterRound / 100) * tax), 10);
      const taxAbs = parseInt(this.afterRound, 10) + absTax;
      return taxAbs > 0 ? taxAbs : 0;
    },
    taxSum() {
      const absTax = this.afterRound ? ((this.afterRound / 100) * this.invoice.tax) : 0;
      return this.invoice.tax > 0 ? absTax : 0;
    },
    calculateProcedures() {
      let sum = 0;
      this.selectedProcedures.forEach((p) => {
        if (p.manipulations) {
          sum += this.calculateManipulations(p.manipulations);
        }
      });
      return sum;
    },
  },
  watch: {
    'invoice.discount': function () {
      this.touched.discount = true;
      this.invoice.round = this.afterDiscount;
    },
    afterDiscount(value) {
      this.invoice.round = value;
    },
    'invoice.dueDate': function () {
      this.touched.dueDate = true;
    },
    'invoice.tax': function () {
      this.touched.tax = true;
      this.invoice.total = this.afterTax;
    },
    afterTax(val) {
      this.invoice.total = val;
    },
    'invoice.round': function (value) {
      if (!value) {
        this.invoice.round = this.afterDiscount;
      }
      this.touched.round = true;
    },
    invoice: {
      handler(newValue) {
        this.$emit('onCreateInvoice', newValue);
      },
      deep: true,
    },
  },
  created() {
    this.invoice.procedures.push(this.selectedProcedures.map(p => p.id));
    this.invoice.round = this.afterDiscount;
    this.invoice.total = this.afterTax;
    if (!this.invoice.createdDate) {
      this.invoice.createdDate = new Date();
    }
  },
};
</script>

<style lang="scss">
.add-billing {
    .procedure {
        .procedure__title {
            border-top: solid rgba(255, 255, 255, 0.165) 2px;
            line-height: 18px;
            padding: 9px 0;
            // background-color: rgba(128, 128, 128, 0.065)
        }
        .manipulation-title {
            width: 50%;
        }
    }
    .manipulations-autocomplite {
    }
    .manipulations-input__action {
        max-width: 70px;
    }
    .category{
        white-space: nowrap;
    }
    .md-datepicker{
        transform: translate(0, 0);

    }
    .total{
        margin-bottom: 20px!important;
    }
}
    .md-datepicker-dialog{
        transform: translate(0, 0);
    }
</style>
