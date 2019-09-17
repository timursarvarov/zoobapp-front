<template>
    <div class="wizard-tab-content" :style="[{ 'min-width': size.width ? `${size.width}px` : `70vw` }]">
        <div class="absolute-header-block">
            <md-toolbar class="toolbar-jaw manipulations-editor md-alignment-center-space-between md-layout md-transparent">
                <div class="manipulations-autocomplite md-layout-item md-size-50 md-medium-size-40 md-small-size-100">
                    <cool-select
                        ref="autocomplete"
                        v-model="selectedManipulationID"
                        v-validate="'is_exist'"
                        class="with-action md-field"
                        :class="[
                            {
                                'md-focused': coolSelectFocus || selectedManipulationID
                            },
                            {
                                'md-error': !touched.selectedManipID ? errors.has('selectedManipID') : false
                            }
                        ]"
                        tabindex="1"
                        :items="clinicManipulations"
                        input-for-text-class="md-input"
                        :arrows-disable-instant-selection="true"
                        :disable-first-item-select-on-enter="true"
                        item-text="text"
                        item-value="ID"
                        data-vv-name="selectedManipID"
                        type="selectedManipID"
                        name="selectedManipID"
                        @focus="coolSelectFocus = true"
                        @blur="coolSelectFocus = false"
                        @select="setManipulation"
                    >
                        <template slot="input-end">
                            <md-button
                                v-show="selectedManipulationID"
                                tabindex="-1"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                @click="unsetSelectedManipulations()"
                            >
                                <md-icon class="success">close</md-icon>
                            </md-button>
                        </template>
                        <template slot="input-after">
                            <slide-y-down-transition>
                                <span
                                    v-show="!touched.selectedManipID ? errors.has('selectedManipID') : false"
                                    :class="[
                                        {
                                            error: errors.has('selectedManipID')
                                        },
                                        {
                                            'md-valid': !errors.has('selectedManipID')
                                        }
                                    ]"
                                    >{{ errors.first('selectedManipID') }}</span
                                >
                            </slide-y-down-transition>
                        </template>

                        <template slot="input-start">
                            <label for="input">Select manipulation</label>
                        </template>
                        <template v-if="item" slot="item" slot-scope="{ item }">
                            <div style="display: flex;">
                                <md-button class="IZ-select-button md-layout-item">
                                    <span class="text-left">{{ `${item.code} - ${item.title}` }}</span>
                                    <span class="text-right">{{ `${item.price}` }} {{ currencyCode }}</span>
                                </md-button>
                            </div>
                        </template>
                        <template slot="no-data">
                            <div class="md-layout" style="display: flex; white-space: pre-wrap;oveflow:hidden;">
                                <span class="md-layout-item md-size-100" style="white-space: pre-wrap;oveflow:hidden;"
                                    >No manipulations were found.</span
                                >
                            </div>
                        </template>
                    </cool-select>
                </div>
                <div class="md-layout md-alignment-center-space-between">
                    <div class="manipulations-input md-layout-item md-size-25">
                        <md-field class>
                            <label>Qty</label>
                            <md-input
                                id="qty"
                                key="qty"
                                ref="qty"
                                v-model="manipulationsNum"
                                tab-index="1"
                                min="1"
                                type="number"
                                @keyup.enter="getFocus('price')"
                            />
                        </md-field>
                        <!-- @keydown.enter.prevent="focusOn('price')" -->
                    </div>
                    <div class="manipulations-input md-layout-item md-size-25">
                        <md-field class>
                            <label>Price {{ currencyCode }}</label>
                            <md-input
                                id="price"
                                ref="price"
                                key="price"
                                v-model="manipulationPrice"
                                tab-index="1"
                                min="0"
                                type="number"
                                @keyup.enter="getFocus('addButton')"
                            />
                        </md-field>
                        <!-- @keydown.enter.prevent="focusOn('addButton')" -->
                    </div>
                    <div class="manipulations-input md-layout-item md-size-25">
                        <md-field class>
                            <label>Total {{ currencyCode }}</label>
                            <md-input v-model="manipulationsPriceTotal" tabindex="-1" type="number" disabled />
                        </md-field>
                    </div>
                    <div style="max-height:41px;" class="manipulations-input__action md-layout-item md-alignment-center-right md-layout">
                        <slide-y-down-transition>
                            <md-button
                                v-show="!manipulationToEdit.ID"
                                id="addButton"
                                ref="addButton"
                                key="addButton"
                                tab-index="1"
                                :disabled="!selectedManipulationID || isLoading"
                                :class="[{ 'md-primary': selectedManipulationID }]"
                                class="md-button md-just-icon md-round"
                                @keydown.enter="addManipulation()"
                                @focus="getFocus('addButton')"
                                @click="addManipulation()"
                            >
                                <!-- @keydown.enter.prevent="focusOn('autocomplete')" -->
                                <md-progress-spinner v-if="isLoading" class="t-white" :md-diameter="24" :md-stroke="2" md-mode="indeterminate" />
                                <md-icon v-else>add</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                v-show="manipulationToEdit.ID"
                                id="editButton"
                                ref="editButton"
                                key="editButton"
                                tab-index="1"
                                :disabled="!selectedManipulationID || isLoading"
                                :class="[{ 'md-info': selectedManipulationID }]"
                                class="md-button md-just-icon md-round"
                                @keydown.enter="saveManipulation()"
                                @focus="getFocus('editButton')"
                                @click="saveManipulation()"
                            >
                                <!-- @keydown.enter.prevent="focusOn('autocomplete')" -->
                                <md-progress-spinner v-if="isLoading" class="t-white" :md-diameter="24" :md-stroke="2" md-mode="indeterminate" />
                                <md-icon v-else>save</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </div>
                </div>
            </md-toolbar>
        </div>

        <div class="content-wrapper">
            <md-table :value="currentManipulations" table-header-color="green" class="table-striped table-with-header table-hover">
                <md-table-empty-state md-label="No manipulations found" md-description="please select manipilation" />
                <md-table-row
                    slot="md-table-row"
                    slot-scope="{ item, index }"
                    :class="[
                        { 'just-added': item.justAdded },
                        {
                            'editable-mode': item.editing && manipulationToEdit.ID
                        }
                    ]"
                >
                    <md-table-cell md-label="#">{{ index + 1 }}</md-table-cell>
                    <md-table-cell md-label="Code">{{ item.catalogManipulationID }}</md-table-cell>
                    <md-table-cell class="manip_title"  md-label="Title">
                        <div class="md-layout">
                            <small>{{ item.title }}</small>
                        </div>
                        </md-table-cell>
                    <md-table-cell md-label="Qty" class="manipulations-input">{{ item.qty }}</md-table-cell>
                    <md-table-cell>*</md-table-cell>

                    <md-table-cell md-label="Price">{{ item.price }}</md-table-cell>
                    <md-table-cell md-label="Total">{{ item.totalPrice }}</md-table-cell>
                    <md-table-cell class="actions">
                        <md-button class="md-just-icon md-round md-info md-simple" @click.native="setEditedManipulation(item), (item.editing = true)">
                            <md-icon>edit</md-icon>
                        </md-button>
                        <md-button class="md-just-icon md-round md-danger md-simple" @click.native="startDeleteManipulations(item)">
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
                                    Total manipulations:
                                    {{ currentManipulations.length }}
                                </div>
                            </div>
                        </th>
                        <th class="md-table-head">
                            <div class="md-table-head-container md-ripple md-disabled">
                                <div class="md-table-head-label">
                                    Total price:
                                    <animated-number :value="totalPrice" />
                                    {{ currencyCode }}
                                </div>
                            </div>
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <md-snackbar :md-position="'center'" :md-duration="true ? Infinity : 4000" :md-active.sync="showSnackbar" md-persistent>
            <div class="snackbar-text-wrapper">
                <div>
                    <small>Delete Manipulation:</small>
                </div>
                {{ manipulationToDelete.code }}
                {{ manipulationToDelete.title }}
            </div>
            <div>
                <md-button class="md-simple" @click="(manipulationToDelete = {}), (showSnackbar = false)">cancel</md-button>
                <md-button class="md-warning" @click="(showSnackbar = false), deleteManipulation()">Delete</md-button>
            </div>
        </md-snackbar>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { CoolSelect } from 'vue-cool-select';
import { SlideYDownTransition } from 'vue2-transitions';
import AnimatedNumber from '@/components/AnimatedNumber';

import { PATIENT_MANIPULATION_SET, NOTIFY, PATIENT_MANIPULATION_EDIT, PATIENT_MANIPULATION_DELETE } from '@/constants';

export default {
    name: 'TItemManipulations',
    value: {
        type: String,
        required: true
    },
    components: {
        CoolSelect,
        SlideYDownTransition,
        AnimatedNumber
    },
    model: {
        prop: 'description',
        event: 'updateDescription'
    },
    props: {
        currencyCode: {
            type: String,
            default: () => ''
        },
        selectedTeeth: {
            type: Array,
            default: () => []
        },
        // manipulations: {
        //     type: Array,
        //     default: () => [],
        // },
        size: {
            type: Object,
            default: () => {}
        },
        manipulationsToEdit: {
            type: Array,
            default: () => []
        },
        originalItem: {
            type: Object,
            default: () => {}
        },
        itemID: {
            type: Number,
            default: () => 0
        }
    },
    data() {
        return {
            progressTimeout: 100,
            delay: null,
            showForm: false,
            canDelete: true,
            onValidate: false,
            focusedField: null,
            manipulationsNum: 1,
            manipulationPrice: 0,
            step: 1,
            coolSelectFocus: false,
            manipulationsPriceTotal: 0,
            selectedManipulationID: '',
            manipulationToEdit: {},
            manipulationToDelete: {},
            showSnackbar: false,
            isLoading: false,
            touched: {
                selectedManipID: false
            },
            modelValidations: {
                selectedManipID: {
                    max: 0
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            getManipulationsByProcedureID: 'getManipulationsByProcedureID',
            getPatientProcedureByID: 'getPatientProcedureByID',
            clinicManipulations: 'getCurrentManipulations'
        }),
        currentManipulations() {
            return this.getManipulationsByProcedureID(this.itemID);
        },
        totalPrice() {
            let sum = 0;
            this.currentManipulations.forEach(manip => {
                sum += manip.price * manip.qty;
            });
            return sum;
        },
        manipulationHeaders: {
            get() {
                const descriptionTitles = Object.values(this.clinicManipulations).map(d => `${d.code ? d.code : ''} ${d.title}`);
                return descriptionTitles || [];
            },
            set() {}
        },
        descriptionL: {
            get() {
                return this.description;
            },
            set(value) {
                this.$emit('updateDescription', value);
            }
        },
        selectedTeethNum() {
            return this.selectedTeeth.length || 1;
        }
    },
    watch: {
        manipulationsNum() {
            this.manipulationsPriceTotal = this.manipulationsNum * this.manipulationPrice;
        },
        manipulationPrice() {
            this.manipulationsPriceTotal = this.manipulationsNum * this.manipulationPrice;
        },
        selectedTeeth() {
            this.manipulationsNum = this.selectedTeethNum;
        },
        selectedManipulationID() {
            this.touched.selectedManipID = true;
        }
    },
    mounted() {
        this.$nextTick(() => {});
    },
    methods: {
        startDeleteManipulations(manipulation) {
            this.manipulationToDelete = manipulation;
            this.showSnackbar = true;
        },
        unsetSelectedManipulations() {
            if (this.manipulationToEdit.ID) {
                this.manipulationToEdit = {};
                this.removeEditingClass(this.manipulationToEdit.ID);
            }
            this.selectedManipulationID = null;
        },
        deleteManipulation() {
            if (!this.itemID) {
                return;
            }
            this.isLoading = true;
            this.$store
                .dispatch(PATIENT_MANIPULATION_DELETE, {
                    procedureID: this.itemID,
                    manipulationID: this.manipulationToDelete.ID
                })
                .then(
                    () => {
                        this.isLoading = false;
                        this.manipulationToDelete = {};
                    },
                    error => {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Deleted',
                                type: 'warning'
                            }
                        });
                        console.log(error);
                        this.isLoading = false;
                    }
                )
                .catch(err => {
                    this.isLoading = false;
                    throw new Error(err);
                });
        },
        addManipulation() {
            if (!this.itemID) {
                return;
            }
            this.isLoading = true;
            this.$store
                .dispatch(PATIENT_MANIPULATION_SET, {
                    manipulationParams: {
                        procedureID: this.itemID,
                        price: parseInt(this.manipulationPrice, 10),
                        qty: parseInt(this.manipulationsNum, 10),
                        totalPrice: parseInt(this.manipulationsNum, 10) * parseInt(this.manipulationPrice, 10),
                        catalogManipulationID: this.manipulationToAdd.ID
                    }
                })
                .then(
                    () => {
                        this.selectedManipulationID = '';
                        this.manipulationPrice = 0;
                        this.manipulationsNum = 0;
                    },
                    error => {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: error.message,
                                type: 'warning'
                            }
                        });
                    }
                )
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.isLoading = false;
                });
        },
        saveManipulation() {
            if (!this.itemID) {
                return;
            }
            this.isLoading = true;
            this.$store
                .dispatch(PATIENT_MANIPULATION_EDIT, {
                    manipulationParams: {
                        manipulationID: this.manipulationToEdit.ID,
                        price: parseInt(this.manipulationPrice, 10),
                        qty: parseInt(this.manipulationsNum, 10),
                        totalPrice: parseInt(this.manipulationsNum, 10) * parseInt(this.manipulationPrice, 10)
                    }
                })
                .then(
                    () => {
                        this.removeEditingClass(this.manipulationToEdit.ID);
                        this.selectedManipulationID = '';
                        this.manipulationPrice = 0;
                        this.manipulationsNum = 0;
                        this.selectedManipulationID = '';
                        this.manipulationToEdit = {};
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Manipulation saved',
                                type: 'success'
                            }
                        });
                    },
                    error => {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: error,
                                type: 'warning'
                            }
                        });
                        console.log(error);
                    }
                )
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.isLoading = false;
                });
        },
        getFocus(field) {
            this.focusedField = field;
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
            this.touched.selectedManipID = false;
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res, 'step2');
                this.$emit('validated-code', this.code);
                return res;
            });
        },
        setEditingClass(manipulation) {
            this.currentManipulations.forEach((m, index) => {
                if (m.ID === manipulation.ID) {
                    this.currentManipulations[index].editing = true;
                } else if (m.editing) {
                    this.currentManipulations[index].editing = false;
                }
            });
        },
        setEditedManipulation(manipulation) {
            this.setEditingClass(manipulation);
            this.manipulationToEdit = manipulation;
            this.selectedManipulationID = manipulation.catalogManipulationID;
            this.manipulationPrice = manipulation.price;
            this.manipulationsNum = manipulation.qty;
            this.focusOn('qty');
        },
        setManipulation(manipulation, initiated) {
            if (this.manipulationToEdit.ID) {
                this.removeEditingClass(manipulation.ID);
                this.manipulationToEdit = {};
            }
            this.manipulationToAdd = manipulation;
            this.manipulationPrice = manipulation.price;
            this.manipulationsNum = this.selectedTeethNum;
            // }
            if (!initiated) {
                this.focusOn('qty');
            }
        },
        removeEditingClass(manipID) {
            const index = this.currentManipulations.findIndex(m => m.ID === manipID);
            if (index > -1) {
                this.currentManipulations[index].editing = false;
            }
        }
    }
};
</script>
<style lang="scss">
.progress-wrapper {
    margin-right: 15px;
    height: 60px;
    position: relative;
    .progress-wrapper-item {
        width: 60px;
        position: absolute;
        display: flex;
        top: 0;
        bottom: 0;
        .progress-counter-text {
            margin: auto;
        }
    }
}
</style>
