<template>
    <div class=" wizard-tab-content"
    :style="[
        {'min-width': size.width ? `${size.width}px`: `70vw`},
      ]"
    >
      <!-- {'min-height': `${size.height}px`}  -->
            <div class="absolute-header-block" >
                <md-toolbar  class=" toolbar-jaw  manipulations-editor md-alignment-center-space-between md-layout md-transparent" >
                    <div  class="manipulations-autocomplite md-layout-item md-size-50 md-medium-size-40 md-small-size-100">
                        <cool-select
                            tabindex="1"
                            v-model="selectedManipulations"
                            :items="manipulationsForOptions"
                            :arrowsDisableInstantSelection="true"
                            :disableFirstItemSelectOnEnter="true"
                            item-text="text"
                            itemValue="title"
                            ref="autocomplete"
                            @select="setManipulation"
                            :placeholder="selectedManipulations ? '': 'Select manipulation'"
                        >
                            <template v-if="item" slot="item" slot-scope="{ item }">
                                <div style="display: flex;">
                                    <md-button class="IZ-select-button">
                                        <span class="text-left" v-if="item.title && item.code">
                                            {{ `${item.code} - ${item.title}` }}
                                        </span>
                                        <span class="text-right" >{{`${item.price}`}} {{currencyCode}}</span>
                                    </md-button>
                                </div>
                            </template>
                            <template slot="no-data">
                                <div class="md-layout" style="display: flex; white-space: pre-wrap;oveflow:hidden;">
                                    <span
                                        class="md-layout-item md-size-100"
                                        style="white-space: pre-wrap;oveflow:hidden;"
                                    >No manipulations were found.</span>
                                </div>
                            </template>
                        </cool-select>
                    </div>
                    <div
                        class=" md-layout md-alignment-center-space-between ">
                        <div class="manipulations-input md-layout-item md-size-25">
                            <md-field  >
                                <label>Qty</label>
                                <md-input
                                tabIndex='1'
                                id='qty'
                                key='qty'
                                ref="qty"
                                min="1"
                                type="number"
                                v-model="manipulationsNum"
                             ></md-input>
                            </md-field>
                                <!-- @keydown.enter.prevent="focusOn('price')" -->
                        </div>
                        <div class="manipulations-input md-layout-item md-size-25">
                            <md-field  >
                                <label>Price {{currencyCode}}</label>
                                <md-input
                                tabIndex='1'
                                ref="price"
                                id='price'
                                key='price'
                                min="0"
                                type="number"
                                @focus="getFocus('price')"
                                v-model="manipulationsPrice"></md-input>
                            </md-field>
                                <!-- @keydown.enter.prevent="focusOn('addButton')" -->
                        </div>
                        <div class="manipulations-input md-layout-item md-size-25 ">
                            <md-field>
                                <label>Total {{currencyCode}}</label>
                                <md-input
                                tabindex="-1"
                                type="number"
                                disabled
                                v-model="manipulationsPriceTotal"></md-input>
                            </md-field>
                        </div>
                        <div class="manipulations-input__action md-layout-item md-alignment-center-right md-layout ">

                            <md-button
                                ref="addButton"
                                tabIndex='1'
                                id='addButton'
                                key='addButton'
                                :disabled="!selectedManipulations"
                                :class="[{'md-primary': selectedManipulations}]"
                                class="md-button  md-just-icon md-round"
                                @keydown.enter="addManipulation()"
                                @focus="getFocus('addButton')"
                                @click="addManipulation()"
                                >
                                <!-- @keydown.enter.prevent="focusOn('autocomplete')" -->
                                    <md-icon>add</md-icon>
                            </md-button>
                        </div>
                    </div>

                </md-toolbar>

            </div>

            <div class="content-wrapper">

                <md-table v-model="manipulationsToAdd" table-header-color="green">
                    <md-table-empty-state
                        md-label="No manipulations found"
                        md-description="please select manipilation">
                    </md-table-empty-state>
                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                        <md-table-cell md-label="Code">{{ item.manipulation.code }}</md-table-cell>
                        <md-table-cell md-label="Title">{{ item.manipulation.title }}</md-table-cell>
                        <md-table-cell  md-label="Qty" class="manipulations-input" >{{item.num}}</md-table-cell>
                        <md-table-cell >*</md-table-cell>
                        <md-table-cell md-label="Price">{{ item.price.toFixed(2) }}</md-table-cell>
                        <md-table-cell md-label="Total">{{ (item.price * item.num).toFixed(2) }}</md-table-cell>
                        <md-table-cell  class="actions" >
                             <md-button
                            class="md-just-icon md-danger md-simple"
                            @click.native="handleDelete(item)"
                        >
                            <md-icon>close</md-icon>
                        </md-button>
                        </md-table-cell>
                    </md-table-row>
                </md-table>
            </div>
            <div class="footer-table md-table">
                <table>
                    <tfoot>
                        <tr>
                            <th class="md-table-head">
                                <div class="md-table-head-container md-ripple md-disabled">
                                    <div class="md-table-head-label">
                                        Total manipulations: {{manipulationsToAdd.length}}
                                    </div>
                                </div>
                            </th>
                            <th class="md-table-head">
                                <div class="md-table-head-container md-ripple md-disabled">
                                    <div class="md-table-head-label">
                                        Total price:
                                            <animated-number :value="totalPrice"></animated-number>
                                        {{currencyCode}}
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
// eslint-disable-next-line import/no-unresolved
    import { TAutoCompliteFuse, AnimatedNumber } from '@/components';
    import { MANIPULATIONS, AUTH_REFRESH_TOKEN } from '@/constants';
    import { CoolSelect } from 'vue-cool-select';

    export default {
        value: {
            type: String,
            required: true,
        },
        components: {
            TAutoCompliteFuse,
            AnimatedNumber,
            CoolSelect,
        },
        model: {
            prop: 'description',
            event: 'updateDescription',
        },
        props: {
            currencyCode: {
                type: String,
                default: () => '',
            },
            selectedTeeth: {
                type: Array,
                default: () => [],
            },
            size: {
                type: Object,
                default: () => {},
            },
            manipulationsToEdit: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                focusedField: null,
                manipulationsNum: 1,
                manipulationsPrice: 0,
                step: 1,
                manipulationsPriceTotal: 0,
                selectedManipulations: '',
                manipulationsToAdd: [],
                manipulationToEdit: {},
                showIfinite: true,
                touched: {
                    code: false,
                },
                modelValidations: {
                    description: {
                        required: true,
                        min: 5,
                    },
                },
            };
        },
        methods: {

            getFocus(field) {
                console.log(field);
                this.focusedField = field;
            },
            handleDelete(item) {
            },
            deleteRow(item) {
                const indexToDelete = this.manipulationsToAdd.findIndex(
                    tableRow => tableRow.id === item.id,
                );
                if (indexToDelete >= 0) {
                    this.manipulationsToAdd.splice(indexToDelete, 1);
                }
            },
            focusOn(ref) {
                if (this.$refs[ref]) {
                    if (ref === 'autocomplete') {
                        this.$refs[ref].$el.querySelector('input').focus();
                    } else if (ref === 'qty') {
                        this.$refs.autocomplete.$el.blur();
                        this.$refs[ref].$el.focus();
                    } else {
                        this.$refs[ref].$el.focus();
                    }
                }
            },
            showErrorsValidate(error) {
                if (error.message === '') {
                    return;
                }
                const field = this.$validator.fields.find({
                    name: error.type,
                    scope: this.$options.scope,
                });
                if (!field) return;
                this.$validator.errors.add({
                    id: error.type,
                    field: error.type,
                    msg: error.message,
                    scope: this.$options.scope,
                });
                field.setFlags({
                    invalid: true,
                    valid: false,
                    validated: true,
                });
            },
            validate() {
                return this.$validator.validateAll().then((res) => {
                    this.$emit('on-validated', res, 'step2');
                    this.$emit('validated-code', this.code);
                    this.$emit('addManipulations', this.manipulationsToAdd);
                    return res;
                });
            },
            setManipulation(manipulation) {
                this.manipulationToAdd = manipulation;
                this.manipulationsPrice = manipulation.price;
                this.manipulationsNum = this.selectedTeethNum;
                console.log('md-selected');
                this.focusOn('qty');
            },
            addManipulation() {
                console.log(this.focusedField);
                this.manipulationsToAdd.unshift({
                    manipulation: this.manipulationToAdd,
                    price: this.manipulationsPrice,
                    num: this.manipulationsNum,
                });
                this.selectedManipulations = '';
                this.manipulationsPrice = 0;
                this.manipulationsNum = this.selectedTeethNum;
                this.selectedManipulations = '';

                this.focusOn('autocomplete');
            },
        },
        computed: {
            totalPrice() {
                let sum = 0;
                this.manipulationsToAdd.forEach((manip) => {
                    sum += manip.price * manip.num;
                });
                return sum;
            },
            manipulationsForOptions() {
                const manips = [];
                MANIPULATIONS.forEach((man) => {
                    manips.push({
                        ...man,
                        text: `${man.code} ${man.title} ${man.price}`,
                    });
                });
                return manips;
            },
            manipulationHeaders: {
                get() {
                    const descriptionTitles = Object.values(this.manipulationsForOptions).map(
                        d => `${d.code ? d.code : ''} ${d.title}`,
                    );
                    return descriptionTitles || [];
                },
                set() {},
            },
            descriptionL: {
                get() {
                    return this.description;
                },
                set(value) {
                    this.$emit('updateDescription', value);
                },
            },
            selectedTeethNum() {
                return this.selectedTeeth.length || 1;
            },
        },
        mounted() {
            if (this.$refs.description) {
                this.$refs.description.$el.focus();
            }
            this.$nextTick(() => {
                if (this.manipulationsToEdit.length > 0) {
                    this.manipulationsToAdd = this.manipulationsToEdit;
                }
            });

            // window.addEventListener('keyup', ({event, useCapture }) => {
            //     if (event.keyCode === 13) {
            //         this.callEvent(event, useCapture);
            //     }
            // });
        },
        watch: {
            manipulationsNum() {
                this.manipulationsPriceTotal = this.manipulationsNum * this.manipulationsPrice;
            },
            manipulationsPrice() {
                this.manipulationsPriceTotal = this.manipulationsNum * this.manipulationsPrice;
            },
            selectedTeeth() {
                this.manipulationsNum = this.selectedTeethNum;
            },
        },
    };
</script>
