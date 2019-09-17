<template>
    <div class="items-list-wrapper">
        <div>
            <slot name="toolbar" />
            <md-toolbar class="md-transparent">
                <div class="md-layout-item md-size-33">
                    <md-field>
                        <label for="pages">Per page</label>
                        <md-select v-model="pagination.perPage" name="pages">
                            <md-option v-for="item in pagination.perPageOptions" :key="item" :label="item" :value="item">{{ item }}</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout md-layout-item md-size-33">
                    <slot name="header" />
                </div>
                <div class="md-layout md-layout-item md-size-33 ml-auto">
                    <div class="md-layout-item md-size-80">
                        <md-field>
                            <md-input v-model="searchQuery" type="search" class="mb-3" clearable style="width: 200px" placeholder="Search records" />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-20 ml-auto">
                        <md-button class="md-just-icon md-simple" @click="showTableEditor = !showTableEditor">
                            <md-icon>settings</md-icon>
                        </md-button>
                    </div>
                </div>
            </md-toolbar>
            <md-table
                md-fixed-headere
                :md-selected-value.sync="selectedItemsL"
                :value="queriedData || []"
                :md-sort.sync="currentSort"
                :md-sort-order.sync="currentSortOrder"
                :md-sort-fn="customSort"
                class="table-striped table-with-header table-hover"
                :class="extraClass"
            >
                <div />
                <md-table-empty-state
                    v-if="!hasSlot('emptyState')"
                    :md-label="`No ${currentType} found`"
                    :md-description="`No ${currentType}  found. Scroll top, and create new ${currentType} .`"
                />
                <slot name="emptyState" v-else />

                <md-table-row
                    slot="md-table-row"
                    :key="item.ID"
                    slot-scope="{ item }"
                    :class="[{ 'just-added': item.justAdded }, { 'to-delete': item.ID === itemToDelete.ID }]"
                    :md-selectable="currentType === 'procedures' || currentType === 'billing' ? 'multiple' : 'single'"
                >
                    <md-table-cell
                        v-for="field in itemsTableColumns"
                        :key="field.key"
                        :class="field"
                        :md-label="field.title.toString()"
                        :md-sort-by="field.key"
                    >
                        <div v-if="field.key === 'code' && item.code" :class="field.key">{{ item.code }}</div>

                        <div v-else-if="field.key === 'title' && item.title" :class="field.key">
                            {{ item.title }}
                            <br />
                            <small>{{ item.description }}</small>
                        </div>
                        <div v-else-if="field.key === 'teeth' && item.teeth" :class="field.key">
                            <span v-for="toothId in Object.keys(item.teeth)" :key="toothId" class="tooth" :class="currentType">
                                <small>{{ toothId | toCurrentTeethSystem }}</small>
                            </span>
                        </div>
                        <avatar-box
                            v-else-if="field.key === 'createdBy' && item.createdBy"
                            small
                            :avatar="item.createdBy.avatar"
                            :id="item.createdBy.ID"
                            :firstLine="item.createdBy.firstName"
                            :secondLine="item.createdBy.lastName"
                        />
                        <manipulations-box v-if="field.key === 'manipulations' && item.manipulations" :procedureId="item.ID" />

                        <div v-else-if="field.key === 'state'">
                            <div>{{ item.state }}</div>
                        </div>

                        <div v-else-if="field.key === 'ID'">
                            <div class="md-title">{{ item.ID }}</div>
                        </div>

                        <div v-else-if="field.key === 'created' && item.created">
                            <span class>
                                <b>{{ item.created | moment('from') }}</b>
                                <br />
                            </span>
                            <small>{{ item.created | moment('calendar') }}</small>
                        </div>

                        <div v-else-if="field.key === 'updated' && item.updated">
                            <span class>
                                <b>{{ item.updated | moment('from') }}</b>
                                <br />
                            </span>
                            <small>{{ item.updated | moment('calendar') }}</small>
                        </div>

                        <div v-else-if="field.key === 'price' && item.manipulations" class="price">
                            <span class="md-title price_title">{{
                                getManipulationsByProcedureID(item.ID).reduce((a, b) => a + b.totalPrice, 0)
                            }}</span>
                            <small>{{ currentClinic.currencyCode }}</small>
                            <span class="md-small-hide price_sub-title">
                                <br />
                                <small class="text-left">
                                    {{ getManipulationsByProcedureID(item.ID).length }}
                                    manipulations
                                </small>
                            </span>
                        </div>
                        <avatar-box v-else-if="field.key === 'planID'" small :id="item.planID" :firstLine="patient.plans[item.planID].name" />
                        <div v-else-if="field.key === 'discount'">
                            <span class="md-title">{{ item.discout || 0 }}%</span>
                        </div>
                        <div v-else-if="field.key === 'dueDate' && item.dueDate">
                            <div v-if="!item.dueDate">No date</div>
                            <div v-else>
                                <span class>
                                    {{ item.dueDate | moment('from') }}
                                    <br />
                                </span>
                                <small>{{ item.dueDate | moment('calendar') }}</small>
                            </div>
                        </div>
                        <div v-else-if="field.key === 'payments'">
                            <span v-if="item.payments">{{ item.payments.length }}</span>
                            <span v-else>No payments</span>
                        </div>
                        <procedures-box v-else-if="field.key === 'procedures' && item.procedures" :proceduresIds="item.procedures" />
                        <div v-else-if="field.key === 'tax'" class="md-title">{{ item.tax || 0 }}%</div>
                        <div class="md-title" v-else-if="field.key === 'total'">
                            {{ item.total || 0 }}
                            <small>{{ currentClinic.currencyCode }}</small>
                        </div>
                    </md-table-cell>

                    <md-table-cell v-if="currentType !== 'invoices'" md-label="Actions">
                        <div>
                            <md-button
                                v-if="currentType !== 'billing'"
                                v-show="ifDiagnoseHasLocations(item.teeth)"
                                class="md-just-icon md-simple"
                                @click.native="toggleItemVisibility(item, currentType)"
                            >
                                <md-icon v-if="item.showInJaw">visibility</md-icon>
                                <md-icon v-else>visibility_off</md-icon>
                            </md-button>
                            <md-button class="md-just-icon md-info md-simple" @click.native="handleEdit(item)">
                                <md-icon>edit</md-icon>
                            </md-button>
                            <md-button class="md-just-icon md-danger md-simple" @click.native="handleDelete(item)">
                                <md-icon>close</md-icon>
                            </md-button>
                        </div>
                    </md-table-cell>
                </md-table-row>
            </md-table>
            <md-card-actions md-alignment="space-between">
                <div>
                    <p class="card-category">Showing {{ from + 1 }} to {{ to }} of {{ total }} entries</p>
                </div>
                <pagination
                    v-model="pagination.currentPage"
                    class="pagination-no-border pagination-success"
                    :per-page="pagination.perPage"
                    :total="total"
                />
            </md-card-actions>
        </div>
        <t-table-editor
            icon="settings"
            color="success"
            :title="`Set ${currentType} columns order`"
            :available-table-columns="computedAvailableItemsTableColumns"
            :table-columns="itemsTableColumns"
            :show-form.sync="showTableEditor"
            @selected="setColumns"
        />
        <md-snackbar :md-position="'center'" :md-duration="10000" :md-active.sync="showDeleteItemSnackbar" md-persistent>
            <div class="snackbar-wrapper md-layout md-alignment-center-space-between md-size-100">
                <div class="snackbar-text-wrapper">Delete {{ singleItemName() }} {{ itemToDelete.code }} - {{ itemToDelete.title }}?</div>
                <div class="snackbar-action-wrapper ml-auto md-alignment-center-right">
                    <md-button class="md-simple" @click="(showDeleteItemSnackbar = false), (itemToDelete = {})">cancel</md-button>
                    <md-button :disabled="deleting" class="md-warning" @click="deleteItem(item)">
                        <div v-if="deleting">
                            <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />&nbsp;
                            <span>Deleting...</span>
                        </div>
                        <span v-else> <md-icon>delete</md-icon>delete </span>
                    </md-button>
                </div>
            </div>
        </md-snackbar>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Fuse from 'fuse.js';
import components from '@/components';
import {
    USER_DIAGNOSIS_COLUMNS,
    USER_ANAMNESIS_COLUMNS,
    USER_BILLING_COLUMNS,
    USER_PROCEDURES_COLUMNS,
    USER_INVOICE_COLUMNS,
    PATIENT_ITEM_VISIBILITY_TOGGLE,
    PATIENT_PROCEDURE_DELETE,
    EB_SHOW_ITEM_WIZARD,
    NOTIFY
} from '@/constants';
import EventBus from '@/plugins/event-bus';

export default {
    name: 'PatientNosoologyTable',
    components: {
        ...components
    },
    props: {
        plan: {
            type: Object,
            default: () => {}
        },
        items: {
            type: Array,
            default: () => []
        },
        teethSystem: {
            type: Number,
            default: () => 1
        },
        currentType: {
            type: String,
            default: () => 'diagnosis'
        },
        selectedItems: {
            type: Array,
            default: () => []
        },
        extraClass: {
            type: String,
            default: () => 'paginated-table'
        }
    },
    data() {
        return {
            computedAvailableItemsTableColumns: [],
            itemsTableColumns: [],
            searchQuery: '',
            searchedData: [],
            deleting: false,
            itemToDelete: {},
            itemToEdit: {},
            showTableEditor: false,
            showDeleteForm: false,
            showSnackbar: false,
            currentSort: 'created',
            currentSortOrder: 'asc',
            pagination: {
                perPage: 10,
                currentPage: 1,
                perPageOptions: [10, 25, 50],
                total: 0
            },
            fuseSearch: null,
            showDeleteItemSnackbar: false
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patient: 'getPatient',
            getAvailableAnamnesTableColumns: 'getAvailableAnamnesTableColumns',
            getAvailableDiagnosisTableColumns: 'getAvailableDiagnosisTableColumns',
            getAvailableProceduresTableColumns: 'getAvailableProceduresTableColumns',
            getAvailableBillingTableColumns: 'getAvailableBillingTableColumns',
            getManipulationsByProcedureID: 'getManipulationsByProcedureID',
            getAvailableInvoiceTableColumns: 'getAvailableInvoiceTableColumns'
        }),
        slotsPassed() {
            return this.$slots;
        },
        selectedItemsL: {
            get() {
                return this.selectedItems;
            },
            set(value) {
                this.$emit('onSelected', value);
            }
        },
        queriedData() {
            let result = this.tableData;
            if (this.searchedData.length > 0) {
                result = this.searchedData;
            }
            return result.slice(this.from, this.to);
        },
        to() {
            let highBound = this.from + this.pagination.perPage;
            if (this.total < highBound) {
                highBound = this.total;
            }
            return highBound;
        },
        from() {
            return this.pagination.perPage * (this.pagination.currentPage - 1);
        },
        total() {
            return this.searchedData.length > 0 ? this.searchedData.length : this.tableData.length;
        },
        tableData() {
            return this.items;
        },
        currentTypeToLocalStorage() {
            if (this.currentType === 'diagnosis') {
                return USER_DIAGNOSIS_COLUMNS;
            }
            if (this.currentType === 'anamnesis') {
                return USER_ANAMNESIS_COLUMNS;
            }
            if (this.currentType === 'billing') {
                return USER_BILLING_COLUMNS;
            }
            if (this.currentType === 'procedures') {
                return USER_PROCEDURES_COLUMNS;
            }
            if (this.currentType === 'invoices') {
                return USER_INVOICE_COLUMNS;
            }
            return USER_DIAGNOSIS_COLUMNS;
        },
        defaultFields() {
            if (this.currentType === 'diagnosis') {
                return this.getAvailableDiagnosisTableColumns;
            } else if (this.currentType === 'anamnesis') {
                return this.getAvailableAnamnesTableColumns;
            } else if (this.currentType === 'billing') {
                return this.getAvailableBillingTableColumns;
            } else if (this.currentType === 'procedures') {
                return this.getAvailableProceduresTableColumns;
            } else if (this.currentType === 'invoices') {
                return this.getAvailableInvoiceTableColumns;
            } else return this.getAvailableBillingTableColumns;
        }
    },
    watch: {
        searchQuery(value) {
            let result = this.tableData;
            if (value !== '') {
                result = this.fuseSearch.search(this.searchQuery);
            }
            this.searchedData = result;
        },
        selectedItems() {
            this.showSnackbar = this.selectedItems.length > 0;
        },
        showDeleteItemSnackbar(val) {
            if (!val) {
                this.itemToDelete = '';
            }
        }
    },
    mounted() {
        // Fuse search initialization.
        this.fuseSearch = new Fuse(this.tableData, {
            keys: Object.values(this.itemsTableColumns).map(val => val.key),
            threshold: 0.3
        });
    },
    created() {
        this.setItemsTableColumns();
        this.setComputedAvailableItemsTableColumns();
    },

    methods: {
        hasSlot(slotName) {
            return this.slotsPassed && this.slotsPassed[slotName];
        },
        toggleItemVisibility(itemId, itemType) {
            if (itemId) {
                this.$store.dispatch(PATIENT_ITEM_VISIBILITY_TOGGLE, {
                    params: {
                        itemId,
                        type: itemType
                    }
                });
            }
            this.recalculateJaw(itemType);
        },
        setComputedAvailableItemsTableColumns() {
            this.computedAvailableItemsTableColumns = this.defaultFields;
        },
        // getFieldName(key) {
        //     const field = this.defaultFields.find(f => f.key === key);
        //     if (field) {
        //         return field.title;
        //     }
        //     return '';
        // },
        setItemsTableColumns() {
            const localStorageColumns = JSON.parse(localStorage.getItem(this.currentTypeToLocalStorage));
            if (localStorageColumns) {
                this.itemsTableColumns = localStorageColumns;
            } else {
                this.itemsTableColumns = this.defaultFields;
            }
        },
        setColumns(e) {
            //! поменять после того как добавять соответствующие поля в беке
            localStorage.setItem(this.currentTypeToLocalStorage, JSON.stringify(e));
            this.setItemsTableColumns();
            this.setComputedAvailableItemsTableColumns();
        },
        onSelect() {
            this.showSnackbar = !this.showSnackbar;
        },
        ifDiagnoseHasLocations(teeth) {
            if (!teeth) return false;
            let show = false;
            show = Object.keys(teeth)
                .map(key => Object.keys(teeth[key]).length > 0)
                .indexOf(true);
            show = show !== -1;
            return show;
        },
        sortBytypes(value) {
            const vm = this;
            const val = value.sort((a, b) => {
                const sortBy = vm.currentSort;
                if (Array.isArray(a[vm.currentSort])) {
                    const aArrayLength = a[vm.currentSort] ? Object.keys(a[vm.currentSort]).length : 0;
                    const bArrayLength = b[vm.currentSort] ? Object.keys(b[vm.currentSort]).length : 0;
                    const orderLocal = vm.currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aArrayLength === null ? dflt : aArrayLength;
                    const bVal = bArrayLength === null ? dflt : bArrayLength;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                } else if (typeof a[vm.currentSort] === 'string') {
                    if (vm.currentSortOrder === 'desc') {
                        return a[sortBy].localeCompare(b[sortBy]);
                    }
                    return b[sortBy].localeCompare(a[sortBy]);
                } else if (typeof a[vm.currentSort] === 'number') {
                    const orderLocal = vm.currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = a[sortBy] === null ? dflt : a[sortBy];
                    const bVal = b[sortBy] === null ? dflt : b[sortBy];
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                } else if (typeof a[vm.currentSort] === 'object') {
                    const orderLocal = vm.currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = a[sortBy] === null ? dflt : a[sortBy];
                    const bVal = b[sortBy] === null ? dflt : b[sortBy];
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                }
            });
            return val;
        },
        customSort(value) {
            const vm = this;
            if (vm.currentSort === 'teeth') {
                const val = value.sort((a, b) => {
                    const aTeethLength = a.teeth ? Object.keys(a.teeth).length : 0;
                    const bTeethLength = b.teeth ? Object.keys(b.teeth).length : 0;
                    const orderLocal = vm.currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aTeethLength === null ? dflt : aTeethLength;
                    const bVal = bTeethLength === null ? dflt : bTeethLength;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                });
                return val;
            }
            if (vm.currentSort === 'price') {
                const val = value.sort((a, b) => {
                    const aTeethPrice = this.getManipulationsByProcedureID(a.ID).reduce((a, b) => a + b.totalPrice, 0) || 0;
                    const bTeethPrice = this.getManipulationsByProcedureID(b.ID).reduce((a, b) => a + b.totalPrice, 0) || 0;
                    const orderLocal = vm.currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aTeethPrice === null ? dflt : aTeethPrice;
                    const bVal = bTeethPrice === null ? dflt : bTeethPrice;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                });
                return val;
            }
            const val = this.sortBytypes(value);
            return val;
        },
        handleEdit(item) {
            if (item) {
                const params = {
                    item,
                    type: this.currentType === 'billing' ? 'procedures' : this.currentType
                };
                EventBus.$emit(EB_SHOW_ITEM_WIZARD, params);
            }
        },
        handleDelete(item) {
            this.itemToDelete = item;
            this.showDeleteItemSnackbar = true;
        },
        deleteItem() {
            if (this.currentType === 'procedures') {
                this.deleteProcedure();
            }
            if (this.currentType === 'diagnosis') {
                this.deleteDiagnose();
            }
            if (this.currentType === 'anamnesis') {
                this.deleteAnamnes();
            }
            if (this.currentType === 'invoices') {
                console.log('delete invoice');
            }
        },
        singleItemName() {
            if (this.currentType === 'anamnesis') {
                return 'anamnes';
            }
            if (this.currentType === 'diagnosis') {
                return 'diagnose';
            }
            return 'procedure';
        },
        notifyItemDeleted() {
            this.$store.dispatch(NOTIFY, {
                settings: {
                    message: `${this.singleItemName()} deleted`,
                    type: 'success'
                }
            });
        },
        deleteProcedure() {
            this.deleting = true;
            this.$store
                .dispatch(PATIENT_PROCEDURE_DELETE, {
                    procedure: this.itemToDelete
                })
                .then(() => {
                    this.deleting = false;
                    this.showDeleteItemSnackbar = false;
                    this.notifyItemDeleted();
                })
                .catch(err => {
                    this.deleting = false;
                    throw new Error(err);
                })
                .then(() => {
                    this.deleting = false;
                    this.showDeleteItemSnackbar = false;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.text-right /deep/ .md-table-cell-container {
    display: flex;
    justify-content: flex-end;
}
.md-table /deep/ .md-table-head:last-child {
    text-align: right;
}

.table-stats {
    display: flex;
    align-items: center;
    text-align: right;
    flex-flow: row wrap;

    .td-price .td-total {
        display: inline-flex;
        font-weight: 500;
        font-size: 1.0625rem;
        margin-right: 50px;
    }

    &.table-striped .td-price {
        border-bottom: 0;
    }

    .td-price {
        font-size: 26px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }

    .td-price,
    > div {
        flex: 0 0 100%;
        padding: 12px 8px;
    }
}

.table-shopping /deep/ .md-table-head:nth-child(5),
.table-shopping /deep/ .md-table-head:nth-child(7),
.table-shopping /deep/ .md-table-head:nth-child(6) {
    text-align: right;
}
</style>
