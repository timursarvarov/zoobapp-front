<template>
    <div class="items-list-wrapper">
        <div>
            <slot name="toolbar" />
            <md-toolbar class="md-transparent">
                <div class="md-layout-item md-size-33 md-small-size-100">
                    <md-field>
                        <label for="pages">{{ $t(`${$options.name}.perPage`) }}</label>
                        <md-select v-model="pagination.perPage" name="pages">
                            <md-option v-for="item in pagination.perPageOptions" :key="item" :label="item" :value="item">{{ item }}</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout md-layout-item md-size-33 md-small-size-100">
                    <slot name="header" />
                </div>
                <div class="md-layout md-layout-item md-size-33 md-small-size-100 ml-auto">
                    <div class="md-size-80 md-layout">
                        <md-field>
                            <label for="pages">{{ $t(`${$options.name}.typeToSearch`) }}</label>
                            <md-input v-model="searchQuery" type="search" class="mb-3" clearable style="width: 200px" />
                        </md-field>
                    </div>
                    <div class="md-size-20 ml-auto">
                        <md-button class="md-just-icon md-simple" @click="showTableEditor = !showTableEditor">
                            <md-icon>settings</md-icon>
                        </md-button>
                    </div>
                </div>
            </md-toolbar>
            <md-table
                :md-selected-value.sync="selectedItemsL"
                md-fixed-headere
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
                    md-icon="sentiment_dissatisfied"
                    :md-label="$t(`${$options.name}.noFoundTitle`)"
                    :md-description="$t(`${$options.name}.noFoundDescription`)"
                >
                    <md-button class="md-primary md-raised" @click="scrollToTop()">
                        {{ $t(`${$options.name}.scrollTop`) }}
                    </md-button>
                </md-table-empty-state>
                <slot name="emptyState" v-else />

                <md-table-row
                    slot="md-table-row"
                    :key="item.ID"
                    slot-scope="{ item }"
                    :class="[{ 'just-added': item.justAdded }, { 'to-delete': item.ID === itemToDelete.ID }]"
                    :[isSelectableRow()]="selectable ? 'multiple' : 'single'"
                >
                    <md-table-cell
                        v-for="field in itemsTableColumns"
                        :key="field.key"
                        :class="field"
                        :md-label="$t(`${$options.name}.${field.key}`)"
                        :md-sort-by="field.key"
                    >
                        <div v-if="field.key === 'code' && item.code" :class="field.key">{{ item.code }}</div>

                        <div v-else-if="field.key === 'title' && item.title" class="item-text">{{ item.title }}</div>
                        <div v-else-if="field.key === 'description' && item.description" class="item-text">
                            <small v-html="item.description" />
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
                            <span class="price_title">
                                <span class="md-title">{{
                                    getManipulationsByProcedureID(item.ID).reduce((a, b) => a + b.totalPrice, 0) | numSeparator
                                }}</span>
                                &nbsp;
                                <small>{{ currentClinic.currencyCode }}</small>
                            </span>
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
                        <div class="cell_actions">
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
                            <md-button class="md-just-icon md-simple" @click.native="handlePrint(item)">
                                <md-icon>print</md-icon>
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
            v-if="showTableEditor"
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
    USER_DIAGNOSIS_COLUMNS,
    USER_ANAMNESIS_COLUMNS,
    USER_BILLING_COLUMNS,
    USER_PROCEDURES_COLUMNS,
    USER_INVOICE_COLUMNS,
    PATIENT_ITEM_VISIBILITY_TOGGLE,
    PATIENT_PROCEDURE_DELETE,
    EB_SHOW_ITEM_WIZARD,
    EB_SHOW_PATIENT_PRINT_FORM,
    STORE_KEY_PATIENT,
    NOTIFY
} from '@/constants';
import EventBus from '@/plugins/event-bus';

export default {
    name: 'PatientNosologyTable',
    components: {
        ...components,
        'procedures-box': () => import('./PatientNosologyTableItems/ProceduresBox'),
        'manipulations-box': () => import('./PatientNosologyTableItems/ManipulationsBox')
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
        },
        selectable: {
            type: Boolean,
            default: () => false
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
            getAvailableAnamnesTableColumns: 'getAvailableAnamnesTableColumns',
            getAvailableDiagnosisTableColumns: 'getAvailableDiagnosisTableColumns',
            getAvailableProceduresTableColumns: 'getAvailableProceduresTableColumns',
            getAvailableBillingTableColumns: 'getAvailableBillingTableColumns',
            getManipulationsByProcedureID: `${STORE_KEY_PATIENT}/getManipulationsByProcedureID`,
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
                if (this.selectable) {
                    if (Array.isArray(value)) {
                        this.$emit('onSelected', value);
                    } else {
                        let items = [value];
                        this.$emit('onSelected', items);
                    }
                }
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
        scrollToTop() {
            window.scrollTo(0, 0);
        },
        isSelectableRow() {
            return this.selectable ? 'md-selectable' : '';
        },
        hasSlot(slotName) {
            return this.slotsPassed && this.slotsPassed[slotName];
        },
        toggleItemVisibility(itemId, itemType) {
            if (itemId) {
                this.$store.dispatch(`$_patient/${PATIENT_ITEM_VISIBILITY_TOGGLE}`, {
                    params: {
                        itemId,
                        type: itemType
                    }
                });
            }
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
        ifDiagnoseHasLocations(teeth) {
            if (!teeth) return false;
            let show = false;
            show = Object.keys(teeth)
                .map(key => Object.keys(teeth[key]).length > 0)
                .indexOf(true);
            show = show !== -1;
            return show;
        },
        customSort() {
            this.$emit('customSort', this.currentSort, this.currentSortOrder);
            return;
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
                .dispatch(`$_patient/${PATIENT_PROCEDURE_DELETE}`, {
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
