<template>
    <div class=" wizard-tab-content"
    :style="[
        {'min-width': size.width ? `${size.width}px`: `70vw`},
      ]"
    >
    {{getManipulationsByIds(itemID)}}
            <div class="absolute-header-block" >
                <md-toolbar  class=" toolbar-jaw  manipulations-editor md-alignment-center-space-between md-layout md-transparent" >
                    <div  class="manipulations-autocomplite md-layout-item md-size-50 md-medium-size-40 md-small-size-100">
                        <cool-select
                            class="with-action md-field "
                            :class="[
                                {'md-focused': coolSelectFocus || selectedManipulationID},
                                {'md-error': !touched.selectedManipID ? errors.has('selectedManipID'): false}
                                ]"
                            @focus="coolSelectFocus = true"
                            @blur="coolSelectFocus = false"
                            tabindex="1"
                            v-model="selectedManipulationID"
                            :items="manipulationsForOptions"
                            inputForTextClass="md-input"
                            :arrowsDisableInstantSelection="true"
                            :disableFirstItemSelectOnEnter="true"
                            item-text="text"
                            itemValue="ID"
                            ref="autocomplete"
                            @select="setManipulation"
                            data-vv-name="selectedManipID"
                            type="selectedManipID"
                            name="selectedManipID"
                            v-validate="'is_exist'"
                        >
                            <template slot="input-end">
                                <md-button
                                    @click="selectedManipulationID = null, itemToEditIndex = null"
                                    tabindex="-1"
                                    v-show="selectedManipulationID"
                                    class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                >
                                    <md-icon class="success">close</md-icon>
                                </md-button>
                            </template>
                            <template slot="input-after">
                                <slide-y-down-transition>
                                    <span
                                        v-show=" !touched.selectedManipID ? errors.has('selectedManipID'): false"
                                        :class="[
                                        {'error': errors.has('selectedManipID')},
                                        {'md-valid': !errors.has('selectedManipID')}]"
                                    >{{errors.first('selectedManipID')}}</span>
                                </slide-y-down-transition>
                            </template>

                            <template slot="input-start">
                                <label for="input">Select manipulation</label>
                            </template>
                            <template v-if="item" slot="item" slot-scope="{ item }">
                                <div style="display: flex;">
                                    <md-button class="IZ-select-button md-layout-item">
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
                            <md-field
                                class=""  >
                                <label>Qty</label>
                                <md-input
                                tabIndex='1'
                                id='qty'
                                key='qty'
                                ref="qty"
                                min="1"
                                type="number"
                                v-model="manipulationsNum"
                                @keyup.enter="getFocus('price')"
                             ></md-input>
                            </md-field>
                                <!-- @keydown.enter.prevent="focusOn('price')" -->
                        </div>
                        <div class="manipulations-input md-layout-item md-size-25">
                            <md-field
                                class=""  >
                                <label>Price {{currencyCode}}</label>
                                <md-input
                                tabIndex='1'
                                ref="price"
                                id='price'
                                key='price'
                                min="0"
                                type="number"
                                @keyup.enter="getFocus('addButton')"
                                v-model="manipulationsPrice"></md-input>
                            </md-field>
                                <!-- @keydown.enter.prevent="focusOn('addButton')" -->
                        </div>
                        <div class="manipulations-input md-layout-item md-size-25 ">
                            <md-field
                                class="">
                                <label>Total {{currencyCode}}</label>
                                <md-input
                                tabindex="-1"
                                type="number"
                                disabled
                                v-model="manipulationsPriceTotal"></md-input>
                            </md-field>
                        </div>
                        <div style="max-height:41px;" class="manipulations-input__action md-layout-item md-alignment-center-right md-layout ">
                            <slide-y-down-transition>
                            <md-button
                                v-show="itemToEditIndex === null"
                                ref="addButton"
                                tabIndex='1'
                                id='addButton'
                                key='addButton'
                                :disabled="!selectedManipulationID"
                                :class="[{'md-primary': selectedManipulationID}]"
                                class="md-button  md-just-icon md-round"
                                @keydown.enter="addManipulation()"
                                @focus="getFocus('addButton')"
                                @click="addManipulation()"
                                >
                                <!-- @keydown.enter.prevent="focusOn('autocomplete')" -->
                                    <md-icon>add</md-icon>
                            </md-button>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                            <md-button
                                v-show="itemToEditIndex !== null"
                                ref="editButton"
                                tabIndex='1'
                                id='editButton'
                                key='editButton'
                                :disabled="!selectedManipulationID"
                                :class="[{'md-info': selectedManipulationID}]"
                                class="md-button  md-just-icon md-round"
                                @keydown.enter="editManipulation()"
                                @focus="getFocus('editButton')"
                                @click="editManipulation()"
                                >
                                <!-- @keydown.enter.prevent="focusOn('autocomplete')" -->
                                    <md-icon>save</md-icon>
                            </md-button>
                            </slide-y-down-transition>
                        </div>
                    </div>

                </md-toolbar>

            </div>

            <div class="content-wrapper">
                <md-table :value="getManipulationsByIds(itemID)"
                    table-header-color="green">
                    <md-table-empty-state
                        md-label="No manipulations found"
                        md-description="please select manipilation">
                    </md-table-empty-state>
                    <md-table-row
                        slot="md-table-row"
                        slot-scope="{ item, index }"
                        :class="[
                                        {'just-added': item.justAdded},
                                ]"
                        >
                        <md-table-cell md-label="Code">{{ item.manipulation.code }}</md-table-cell>
                        <md-table-cell md-label="Title">{{ item.manipulation.title }}</md-table-cell>
                        <md-table-cell  md-label="Qty" class="manipulations-input" >{{item.num}}</md-table-cell>
                        <md-table-cell >*</md-table-cell>

                        <md-table-cell md-label="Price">{{ item.price.toFixed(2) }}</md-table-cell>
                        <md-table-cell md-label="Total">{{ (item.price * item.num).toFixed(2) }}</md-table-cell>
                        <md-table-cell  class="actions" >
                            <md-button
                                class="md-just-icon md-info md-simple"
                                @click.native="setEditedManipulation(item ,index)"
                            >
                                <md-icon>edit</md-icon>
                            </md-button>
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
</template>
<script>
// eslint-disable-next-line import/no-unresolved
    import { mapGetters } from 'vuex';
    import { CoolSelect } from 'vue-cool-select';
    import { SlideYDownTransition } from 'vue2-transitions';
    import { AnimatedNumber } from '@/components';
    import { PATIENT_MANIPULATION_SET, NOTIFY } from '@/constants';

    export default {
        name: 't-item-manipulations',
        value: {
            type: String,
            required: true,
        },
        components: {
            AnimatedNumber,
            CoolSelect,
            SlideYDownTransition,
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
            manipulations: {
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
            originalItem: {
                type: Object,
                default: () => {},
            },
            itemID: {
                type: Number,
                default: () => 0,
            },
        },
        data() {
            return {
                showForm: false,
                onValidate: false,
                itemToEditIndex: null,
                focusedField: null,
                manipulationsNum: 1,
                manipulationsPrice: 0,
                step: 1,
                coolSelectFocus: false,
                manipulationsPriceTotal: 0,
                selectedManipulationID: '',
                manipulationsToAdd: [],
                manipulationToEdit: {},
                showIfinite: true,
                touched: {
                    selectedManipID: false,
                },
                modelValidations: {
                    selectedManipID: {
                        max: 0,
                    },
                },
            };
        },
        methods: {
            setDefaultManips() {
                if (this.originalItem && this.originalItem.defaultManipulations) {
                    this.originalItem.defaultManipulations.forEach((mID) => {
                        const manip = this.manipulations.find(m => m.ID === mID);
                        if (manip) {
                            this.setManipulation(manip, 'initiated');
                            this.addManipulation('setDefault');
                        }
                    });
                }
            },
            addManipulation(manip, initiated) {
                if (!this.itemID) {
                    return;
                }
                console.log(this.manipulationToAdd);
                console.log(this.itemID);

                this.isLoading = true;
                this.$store
                    .dispatch(PATIENT_MANIPULATION_SET, {
                        manipulationParams: {
                            procedureID: this.itemID,
                            ID: Math.random(),
                            price: parseInt(this.manipulationsPrice, 10),
                            num: parseInt(this.manipulationsNum, 10),
                            manipulation: this.manipulationToAdd,
                            created: new Date(),
                        },
                        initiated,
                    })
                    .then(
                        (response) => {
                            console.log(response);
                            this.isLoading = false;
                        },
                        (error) => {
                            this.$store.dispatch(NOTIFY, {
                                settings: {
                                    message: error.response.data.error,
                                    type: 'warning',
                                },
                            });
                            console.log(error);
                            this.isLoading = false;
                        },
                    ).catch((err) => {
                        console.log(err);
                        this.isLoading = false;
                    });
            },
            getFocus(field) {
                this.focusedField = field;
            },
            handleDelete(item) {
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
                this.touched.selectedManipID = false;
                return this.$validator.validateAll().then((res) => {
                    this.$emit('on-validated', res, 'step2');
                    this.$emit('validated-code', this.code);
                    return res;
                });
            },
            setEditedManipulation(manipulation, index) {
                console.log(index);
                this.selectedManipulationID = manipulation.manipulation.ID;
                this.itemToEditIndex = index;
                this.manipulationToAdd = manipulation.manipulation;
                this.manipulationsPrice = manipulation.price;
                this.manipulationsNum = this.selectedTeethNum;
                this.focusOn('qty');
            },
            setManipulation(manipulation, initiated, index) {
                console.log(manipulation, initiated, index);
                this.manipulationToAdd = manipulation;
                this.manipulationsPrice = manipulation.price;
                this.manipulationsNum = this.selectedTeethNum;
                if (!initiated) {
                    this.focusOn('qty');
                }
            },
            editManipulation() {
                console.log(this.itemToEditIndex,
                            this.manipulationToAdd,
                            this.manipulationsPrice,
                            this.manipulationsNum);
                this.$set(this.manipulationsToAdd, this.itemToEditIndex, {
                    manipulation: this.manipulationToAdd,
                    price: parseInt(this.manipulationsPrice, 10),
                    num: parseInt(this.manipulationsNum, 10),
                    justAdded: true,
                });
                this.selectedManipulationID = '';
                this.manipulationsPrice = 0;
                this.manipulationsNum = this.selectedTeethNum;
                this.selectedManipulationID = '';
                this.itemToEditIndex = null;
                this.removeClass();
            },
            // addManipulation(setDefault = '') {
            // this.manipulationsToAdd.unshift({
            //     manipulation: this.manipulationToAdd,
            //     price: this.manipulationsPrice,
            //     num: this.manipulationsNum,
            //     justAdded: !setDefault,
            // });
            // this.selectedManipulationID = '';
            // this.manipulationsPrice = 0;
            // this.manipulationsNum = this.selectedTeethNum;
            // this.selectedManipulationID = '';
            // this.removeClass();

            // this.focusOn('autocomplete');
            // },
            removeClass() {
                setTimeout(() => {
                    if (document.querySelector('.just-added')) {
                        this.manipulationsToAdd.forEach((manipulation, index) => {
                            if (manipulation.justAdded) {
                                this.manipulationsToAdd[index].justAdded = false;
                                this.removeClass();
                            }
                        });
                    }
                }, 5000);
            },
        },
        computed: {
            ...mapGetters({
                getManipulationsByIds: 'getManipulationsByIds',
            }),
            totalPrice() {
                let sum = 0;
                this.manipulationsToAdd.forEach((manip) => {
                    sum += manip.price * manip.num;
                });
                return sum;
            },
            manipulationsForOptions() {
                const manips = [];
                this.manipulations.forEach((man) => {
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
            this.$nextTick(() => {
                if (this.manipulationsToEdit.length > 0) {
                    this.manipulationsToAdd = this.manipulationsToEdit;
                } else {
                    // this.setDefaultManips();
                }
            });
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
            selectedManipulationID(value) {
                this.touched.selectedManipID = true;
            },
        },
    };
</script>
