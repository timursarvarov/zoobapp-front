<template>
    <div class="items-list-wrapper">
        <div>
            <slot name="toolbar" />
            <md-toolbar class="md-transparent" style="z-index: 10;">
                <div class="md-toolbar-row">
                    <div class="md-toolbar-section-start">
                        <slot name="firsToolbarStart" />
                    </div>
                    <div class="md-toolbar-section-end">
                        <slot name="firsToolbarEnd" />
                        <md-button class="md-just-icon md-simple" @click="showTableEditor = !showTableEditor">
                            <md-icon>settings</md-icon>
                        </md-button>
                    </div>
                </div>
            </md-toolbar>
            <md-toolbar class="md-transparent">
                <div class="md-layout-item md-size-33">
                    <md-field>
                        <label>{{ $t(`${$options.name}.perPage`) }}</label>
                        <md-select v-model="pagination.perPage" name="pages">
                            <md-option v-for="item in pagination.perPageOptions" :key="item" :label="item" :value="item">{{ item }}</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout md-layout-item md-size-33">
                    <slot name="header" />
                </div>
                <div class="md-layout md-layout-item md-size-33 ml-auto">
                    <md-field>
                        <label>{{ $t(`${$options.name}.typeToSearch`) }}</label>
                        <md-input v-model="searchQuery" type="search" class="mb-3" clearable style="width: 200px" />
                    </md-field>
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
            >
                <div />
                <md-table-empty-state
                    v-if="!hasSlot('emptyState')"
                    :md-label="$t(`${$options.name}.noFoundTitle`, { currentType })"
                    :md-description="$t(`${$options.name}.noFoundDescription`, { currentType })"
                />
                <slot name="emptyState" v-else />

                <md-table-row
                    slot="md-table-row"
                    :key="item.ID"
                    slot-scope="{ item }"
                    :class="[{ 'just-added': item.justAdded }, { 'to-delete': item.ID === itemToDelete.ID }]"
                    md-selectable="multiple"
                >
                    <md-table-cell
                        v-for="field in itemsTableColumns"
                        :key="field.key"
                        :class="field"
                        :md-label="$t(`${$options.name}.${field.key}`)"
                        :md-sort-by="field.key"
                    >
                        <div v-if="field.key === 'code' && item.code" :class="field.key">{{ item.code }}</div>

                        <div v-else-if="field.key === 'title' && item.title" :class="field.key" class="item-text">{{ item.title }}</div>
                        <div v-else-if="field.key === 'description'" class="item-text">
                            <small v-html="item.description" />
                        </div>

                        <div v-else-if="field.key === 'ID'">
                            <div>{{ item.ID }}</div>
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

                        <div v-else-if="field.key === 'price'" class="price">
                            <span class="md-title price_title">{{ item.price }}</span>
                            &nbsp;
                            <small>{{ currentClinic.currencyCode }}</small>
                        </div>
                        <div v-else-if="field.key === 'categoryCode'" class="categoryCode">
                            <span>{{ item.categoryCode }}</span>
                        </div>
                        <div v-else-if="field.key === 'categoryTitle'" class="item-text">
                            <small>{{ item.categoryTitle }}</small>
                        </div>
                        <div v-else-if="field.key === 'state'" class="state">
                            <span>{{ item.state }}</span>
                        </div>
                    </md-table-cell>

                    <md-table-cell v-if="currentType !== 'invoices'" md-label="Actions">
                        <div class="cell_actions">
                            <md-button class="md-just-icon md-info md-simple" @click.native="handleEdit(item)">
                                <md-icon>edit</md-icon>
                            </md-button>
                            <md-button class="md-just-icon md-simple" @click.native="handleDelete(item)">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </div>
                    </md-table-cell>
                </md-table-row>
            </md-table>
            <md-card-actions md-alignment="space-between">
                <div>
                    <p class="card-category">
                        {{ $tc(`${$options.name}.paginationNumFrom`, total, { n: from }) }}
                        {{ $tc(`${$options.name}.paginationNumTo`, total, { n: to }) }}
                        {{ $tc(`${$options.name}.paginationItems`, total) }}
                    </p>
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
            :title="$t(`${$options.name}.editorTitle`)"
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
    CLINIC_MANIPULATIONS_COLUMNS,
    // CLINIC_PROCEDURES_COLUMNS,
    // CLINIC_DIAGNOSIS_COLUMNS,
    PATIENT_PROCEDURE_DELETE,
    EB_SHOW_ITEM_WIZARD,
    EB_SHOW_PATIENT_PRINT_FORM,
    STORE_KEY_PATIENT,
    NOTIFY
} from '@/constants';
import EventBus from '@/plugins/event-bus';

export default {
    name: 'ClinicNosologyTable',
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
            default: () => 'manipulations'
        },
        selectedItems: {
            type: Array,
            default: () => []
        },
        filteredData: {
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
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            getAvailableManipulationsTableColumns: 'getAvailableManipulationsTableColumns'
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
            const items = this.customSort(this.items, this.currentSort, this.currentSortOrder);
            return items;
        },
        currentTypeToLocalStorage() {
            if (this.currentType === 'manipulations') {
                return CLINIC_MANIPULATIONS_COLUMNS;
            }
            // if (this.currentType === 'anamnesis') {
            //     return USER_ANAMNESIS_COLUMNS;
            // }
            // if (this.currentType === 'billing') {
            //     return USER_BILLING_COLUMNS;
            // }
            // if (this.currentType === 'procedures') {
            //     return USER_PROCEDURES_COLUMNS;
            // }
            // if (this.currentType === 'invoices') {
            //     return USER_INVOICE_COLUMNS;
            // }
            return CLINIC_MANIPULATIONS_COLUMNS;
        },
        defaultFields() {
            if (this.currentType === 'diagnosis') {
                return this.getAvailableDiagnosisTableColumns;
            } else if (this.currentType === 'manipulations') {
                return this.getAvailableManipulationsTableColumns;
            } else return this.getAvailableBillingTableColumns;
        }
    },
    watch: {
        searchQuery(value) {
            let result = this._.clone(this.tableData);
            if (value !== '') {
                result = this.fuseSearch.search(this.searchQuery);
            }
            console.log(value, this.searchedData, this.fuseSearch);
            this.searchedData = this._.clone(result);
        },
        selectedItems() {
            this.showSnackbar = this.selectedItems.length > 0;
        },
        showDeleteItemSnackbar(val) {
            if (!val) {
                this.itemToDelete = '';
            }
        },
        tableData: {
            deep: true,
            handler(value) {
                this.initiateFuseSearch();
                this.searchQuery = '';
                this.searchedData = this._.clone(value);
            }
        }
    },
    mounted() {
        this.initiateFuseSearch();
    },
    created() {
        this.setItemsTableColumns();
        this.setComputedAvailableItemsTableColumns();
    },

    methods: {
        initiateFuseSearch() {
            this.fuseSearch = new Fuse(this.tableData, {
                keys: Object.values(this.itemsTableColumns).map(val => val.key),
                threshold: 0.3
            });
        },
        hasSlot(slotName) {
            return this.slotsPassed && this.slotsPassed[slotName];
        },
        setComputedAvailableItemsTableColumns() {
            this.computedAvailableItemsTableColumns = this.defaultFields;
        },
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
        sortBytypes(value, currentSort, currentSortOrder) {
            const val = value.sort((a, b) => {
                const sortBy = currentSort;
                if (Array.isArray(a[currentSort])) {
                    const aArrayLength = a[currentSort] ? Object.keys(a[currentSort]).length : 0;
                    const bArrayLength = b[currentSort] ? Object.keys(b[currentSort]).length : 0;
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aArrayLength === null ? dflt : aArrayLength;
                    const bVal = bArrayLength === null ? dflt : bArrayLength;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                } else if (typeof a[currentSort] === 'string') {
                    if (currentSortOrder === 'desc') {
                        return a[sortBy].localeCompare(b[sortBy]);
                    }
                    return b[sortBy].localeCompare(a[sortBy]);
                } else if (typeof a[currentSort] === 'number') {
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = a[sortBy] === null ? dflt : a[sortBy];
                    const bVal = b[sortBy] === null ? dflt : b[sortBy];
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                } else if (typeof a[currentSort] === 'object') {
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = a[sortBy] === null ? dflt : a[sortBy];
                    const bVal = b[sortBy] === null ? dflt : b[sortBy];
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                }
            });
            return val;
        },
        customSort(value, currentSort, currentSortOrder) {
            //  this.$emit('customSort', this.currentSort, this.currentSortOrder )
            const val = this.sortBytypes(value, currentSort, currentSortOrder);
            return val;
            // const val = this.sortBytypes(value);
            // return val;
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
        handlePrint(item) {
            if (item) {
                const params = {
                    item,
                    type: this.currentType === 'billing' ? 'procedures' : this.currentType
                };
                EventBus.$emit(EB_SHOW_PATIENT_PRINT_FORM, params);
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

<style lang="scss" scoped></style>
