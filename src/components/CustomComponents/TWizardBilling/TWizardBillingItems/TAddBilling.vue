<template>
    <div class="wizard-tab-content add-billing">
            <div class="absolute-header-block">
                <md-toolbar class="toolbar-jaw  md-alignment-center-right md-transparent" >
                        <div class="md-layout-item md-small-size-100 md-size-30">
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
                                    v-model="discount"
                                    ref="discount"
                                    type="number"
                                    data-vv-name="discount"
                                    required
                                    v-validate="modelValidations.discount"
                                ></md-input>
                                <span class="md-error">{{errors.first('discount')}}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="errors.has('discount')"
                                        @click="user.discount='',focusOn('discount')"
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
                        <div class="md-layout-item md-small-size-100 md-size-30">
                            <md-field
                                :class="[
                                {'with-subline': true},
                                {'md-valid': !errors.has('tax') && touched.tax},
                                {'md-error': errors.has('tax')}]"
                            >
                                <md-icon>event</md-icon>
                                <label>Tax %</label>
                                <md-input
                                    min="0"
                                    max="100"
                                    v-model="tax"
                                    ref="tax"
                                    type="number"
                                    data-vv-name="tax"
                                    required
                                    v-validate="modelValidations.tax"
                                ></md-input>
                                <span class="md-error">{{errors.first('tax')}}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="errors.has('tax')"
                                        @click="user.tax='',focusOn('tax')"
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

                            <div class="md-layout-item md-layout md-alignment-center-right">
                                    <p class="category md-layout md-layout-item md-alignment-center-right md-size-100"><b>Total</b></p>
                                    <h3 class="title md-layout md-layout-item md-alignment-center-right md-size-100">
                                            <animated-number :value="calculateProcedures(procedures)" />
                                            <small>
                                                &nbsp;{{currencyCode}}
                                            </small>
                                    </h3>
                            </div>

                </md-toolbar>

            </div>

            <div class="content-wrapper md-card-plain">
                <div class=" md-layout md-alignment-center-space-beetwen">
                    <div class="manipulations-autocomplite md-layout-item md-size-80"  ref="autocomplete">
                        <t-auto-complite
                            :mdFuzzySearch="true"
                            v-model="selectedManipulations"
                            @md-selected="setManipulation"
                            :md-options="manipulationsForOptions"
                            :chooseContent="true"
                            @md-opened="selectedManipulations =''"
                        >
                            <label>Type to add more procedures</label>

                            <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                                <md-highlight-text :md-term="term">{{ `${item.code} - ${item.title}` }}</md-highlight-text>
                            </template>

                            <template slot="md-autocomplete-empty" slot-scope="{ term }">
                                <div class="md-layout" style="white-space: pre-wrap;oveflow:hidden;">
                                    <span
                                        class="md-layout-item md-size-100"
                                        style="white-space: pre-wrap;oveflow:hidden;"
                                    >No templates "{{ term }}" were found.</span>
                                </div>
                            </template>
                        </t-auto-complite>
                    </div>
                    <div class="manipulations-input__action md-size-20 md-alignment-center-right md-layout md-layout-item ">

                        <md-button
                            :disabled="!selectedManipulations"
                            :class="[{'md-primary': manipulationsNum}]"
                            class="md-button  md-just-icon md-round"
                            @click="addManipulation()"
                            >
                                <md-icon>add</md-icon>
                        </md-button>
                    </div>
                </div>
                <div  v-for="(p, key) in procedures" :key="key"
                    :style="[{backgroundColor:`${convertHex(p.planColor, 20 )}`}]"
                    class="md-layout procedure md-alignment-center-right" >
                    <div class="md-layout-item md-layout md-size-100 md-alignment-center-space-beetwen procedure__title">
                            <div class="md-layout" >
                                <div class="md-layout md-layout-item md-alignment-center-left md-size-10">
                                    <b>{{key+1}}</b>
                                </div>
                                <div class="md-layout md-layout-item md-alignment-center-left">
                                    <div  class="md-layout-item  md-size-100" >
                                        <b>{{p.code}} - {{p.title}}</b>
                                    </div>
                                    <div class="md-layout-item md-size-100" >
                                        <small>{{p.planTitle}}</small>
                                    </div>
                                </div>
                                <div class="md-layout md-layout-item md-alignment-center-right">
                                    <animated-number :value="calculateManipulations(p.manipulations)" /> &nbsp;{{currencyCode}}
                                </div>
                                </div>
                    </div>
                    <div class="md-layout-item md-size-90">
                        <md-table v-model="p.manipulations" class="no-header small" table-header-color="green">
                            <md-table-row slot="md-table-row" slot-scope="{ item }">
                                <md-table-cell md-label="Code"><small>{{ item.manipulation.code }}</small></md-table-cell>
                                <md-table-cell class="manipulation-title" md-label="Title"><small>{{ item.manipulation.title }}</small></md-table-cell>
                                <md-table-cell  md-label="Qty" class="manipulations-input" ><small>{{item.num}}</small></md-table-cell>
                                <md-table-cell >*</md-table-cell>
                                <md-table-cell md-label="Price"><small>{{ item.price.toFixed(2) }}</small></md-table-cell>
                                <md-table-cell md-label="Total"><small>{{ (item.price * item.num).toFixed(2) }} &nbsp;{{currencyCode}}</small></md-table-cell>
                            </md-table-row>
                        </md-table>
                    </div>
                </div>
            </div>
            <md-field>
                <label>Note</label>
                <md-textarea v-model="note"></md-textarea>
            </md-field>
    </div>
</template>
<script>
    import { TAutoComplite, AnimatedNumber } from '@/components';

    export default {
        components: {
            TAutoComplite,
            AnimatedNumber,
        },
        props: {
            size: {
                type: Object,
                default: () => {},
            },
            procedures: {
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
                invoice: {},
                dueDate: '',
                discount: 0,
                tax: 0,
                expandSingle: false,
                expandNews: false,
                note: '',
                selectedManipulations: '',
                modelValidations: {
                    discount: {
                        required: true,
                        min: 0,
                        max: 100,
                    },
                    tax: {
                        required: true,
                        min: 0,
                    },
                },
                touched: {
                    discount: false,
                    tax: false,
                },
            };
        },
        methods: {
            calculateProcedures(procedures = []) {
                let sum = 0;
                procedures.forEach((p) => {
                    if (p.manipulations) {
                        sum += this.calculateManipulations(p.manipulations);
                    }
                });
                return sum;
            },
            calculateManipulations(m = []) {
                let sum = 0;
                m.forEach((manip) => {
                    sum += manip.price * manip.num;
                });
                return sum;
            },
            convertHex(hex, opacity) {
                const hexLocal = hex.replace('#', '');
                const r = parseInt(hexLocal.substring(0, 2), 16);
                const g = parseInt(hexLocal.substring(2, 4), 16);
                const b = parseInt(hexLocal.substring(4, 6), 16);

                const result = `rgba(${r},${g},${b},${opacity / 100})`;
                return result;
            },
            focusOn(ref) {
                if (!this.$refs[ref]) {
                    return;
                }
                this.$refs[ref].$el.focus();
            },
            validate() {
                this.touched.tax = true;
                this.touched.discount = true;
                return this.$validator.validateAll().then((res) => {
                    this.$emit('on-validated', res, 'step2');
                    this.$emit('validated-code', this.code);
                    return res;
                });
            },
            setManipulation(manipulation) {
                this.manipulationToAdd = manipulation;
                this.manipulationsPrice = manipulation.price;
                this.manipulationsNum = this.selectedTeethNum;
            },
        },
        computed: {
            manipulationsForOptions() {
                return this.allProcedures;
            },
        },
        watch: {
            discount() {
                this.touched.discount = true;
            },
            tax() {
                this.touched.tax = true;
            },
        },
        created() {
        },
    };
</script>

<style lang="scss">
    .add-billing{
        .procedure{
            .procedure__title{
            border-top: solid rgba(255, 255, 255, 0.165) 2px;
                line-height: 18px;
                padding: 9px 0;
                // background-color: rgba(128, 128, 128, 0.065)
            }
            .manipulation-title{
                width: 50%;
            }
        }
    }

</style>
