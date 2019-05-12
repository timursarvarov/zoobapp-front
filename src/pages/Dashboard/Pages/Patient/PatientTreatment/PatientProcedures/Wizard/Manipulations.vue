<template>
    <div class="manipulations-wrapper"
    :style="[
        {'min-width': size.width ? `${size.width}px`: `70vw`},
        {'min-height': `${size.height}px`} ]"
    >
        <div class="manipulations-editor md-alignment-center-space-between md-layout ">

                <div class="manipulations-autocomplite md-layout-item md-size-55 md-small-size-100"  ref="autocomplete">
                    <t-auto-complite
                        :mdFuzzySearch="true"
                        v-model="selectedManipulations"
                        @md-selected="setManipulation"
                        :md-options="manipulationsForOptions"
                        :chooseContent="true"
                        @md-opened="selectedManipulations =''"
                    >
                        <label>Manipulations</label>

                        <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                            <md-highlight-text :md-term="term">{{ `${item.code} - ${item.title}` }}</md-highlight-text>
                        </template>

                        <template slot="md-autocomplete-empty" slot-scope="{ term }">
                            <div class="md-layout" style="white-space: pre-wrap;oveflow:hidden;">
                                <span
                                    class="md-layout-item md-size-100"
                                    style="white-space: pre-wrap;oveflow:hidden;"
                                >No templates "{{ term }}" were found.</span>
                                <md-button
                                    style="min-width:40px;max-width:140px"
                                    class="md-primary md-layout-item mx-auto md-sm"
                                    @click="showPatientAddForm()"
                                >CREATE Manipulation</md-button>
                            </div>
                        </template>
                    </t-auto-complite>
                </div>
                <div class="manipulations-input md-layout-item  md-small-size-50  md-size-10">
                    <md-field>
                        <label>Qty</label>
                        <md-input
                        min="1"
                        type="number"
                        v-model="manipulationsNum"></md-input>
                    </md-field>
                </div>
                <div class="manipulations-input md-layout-item md-size-10 md-small-size-50">
                    <md-field>
                        <label>Price {{currencyCode}}</label>
                        <md-input
                        min="0"
                        type="number"
                        v-model="manipulationsPrice"></md-input>
                    </md-field>
                </div>
                <div class="manipulations-input md-layout-item md-small-size-50">
                    <md-field>
                        <label>Total {{currencyCode}}</label>
                        <md-input
                        type="number"
                        disabled
                        v-model="manipulationsPriceTotal"></md-input>
                    </md-field>
                </div>
                <div class="manipulations-input__action md-layout-item ">

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
            <div class="content-wrapper">

                <md-table v-model="manipulationsToAdd" table-header-color="green" md-fixed-header>
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
    import { TAutoComplite, AnimatedNumber } from '@/components';
    import { MANIPULATIONS } from '@/constants';
    import swal from 'sweetalert2';

    export default {
        components: {
            TAutoComplite,
            AnimatedNumber,
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
        },
        data() {
            return {
                manipulationsNum: 1,
                manipulationsPrice: 0,
                manipulationsPriceTotal: 0,
                selectedManipulations: '',
                manipulationsToAdd: [],
                manipulationToEdit: {},
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
            handleDelete(item) {
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'md-button md-success btn-fill',
                    cancelButtonClass: 'md-button md-danger btn-fill',
                    confirmButtonText: 'Yes, delete it!',
                    buttonsStyling: false,
                }).then((result) => {
                    if (result.value) {
                        this.deleteRow(item);
                        swal({
                            title: 'Deleted!',
                            text: `You deleted ${item.manipulation.title}`,
                            type: 'success',
                            confirmButtonClass: 'md-button md-success btn-fill',
                            buttonsStyling: false,
                        });
                    }
                });
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
            },
            addManipulation() {
                this.manipulationsToAdd.unshift({
                    manipulation: this.manipulationToAdd,
                    price: this.manipulationsPrice,
                    num: this.manipulationsNum,
                });
                this.selectedManipulations = '';
                this.manipulationsPrice = 0;
                this.manipulationsNum = this.selectedTeethNum;
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
                return MANIPULATIONS;
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
<style lang="scss" >
.manipulations-wrapper{
    max-width: calc(100vw - 60px);
    .md-tabs-content table thead {
    display: table-header-group !important;
}
    position: relative;
    // max-width: 70vw;
    .manipulations-editor{
        position: inherit;
        width: 100%;
        // display: flex;
        // justify-content: space-between;
        padding: 15px;
        background-color: rgba(233, 233, 233, 0.459);
        border-radius: 10px;
        margin-bottom: 3vh;
        margin-top: 3vh;
        .manipulations-autocomplite{
            flex-grow: 1;
            // padding-right: 0.5vw;
            // padding-left: 0.5vw;
            input{
                text-overflow: ellipsis;
                padding-right: 0;
            }
            .md-button{
                display:none;
            }
        }
        .manipulations-input__action{
            // padding-right: 0.5vw;
            // padding-left: 0.5vw;
            max-width: 66px;
        }
        .manipulations-input{
            // padding-right: 0.5vw;
            // padding-left: 0.5vw;
            max-width: 100px;
            input{
                max-width:100%;
            }
        }
    }
    .md-menu-content {
        z-index: 13;
        min-width: 300px;
    }
    .md-highlight-text-match {
        border-radius: 2px;
        background-color: yellow !important;
        padding: 0 !important;
    }
    .content-wrapper{
        .md-table-content{

        max-height: calc(100vh - 520px)!important;
        min-height: 35vh;
        }
    }

}
</style>
