
<template>
    <div class="items-list-wrapper">
        <md-empty-state
            v-if="items.length < 1"
            :md-label="`No ${currentType} found`"
            :md-description="`No ${currentType}  found. Scroll top, and create new ${currentType} .`"
        >
            <md-button
                class="md-primary md-raised"
                @click="scrollToTop()"
            >
                Scroll Top
            </md-button>
        </md-empty-state>
        <div v-else>
            <md-table
                :md-selected-value.sync="selectedItems"
                :value="queriedData || []"
                :md-sort.sync="currentSort"
                :md-sort-order.sync="currentSortOrder"
                :md-sort-fn="customSort"
                class="table-striped paginated-table table-with-header table-hover"
            >
                <md-table-toolbar>
                    <md-field>
                        <label for="pages">Per page</label>
                        <md-select
                            v-model="pagination.perPage"
                            name="pages"
                        >
                            <md-option
                                v-for="item in pagination.perPageOptions"
                                :key="item"
                                :label="item"
                                :value="item"
                            >
                                {{ item }}
                            </md-option>
                        </md-select>
                    </md-field>
                    <div
                        class="md-layout"
                        style="max-width: 250px"
                    >
                        <md-field>
                            <md-input
                                v-model="searchQuery"
                                type="search"
                                class="mb-3"
                                clearable
                                style="width: 200px"
                                placeholder="Search records"
                            />
                        </md-field>
                        <md-button
                            class="md-just-icon md-simple"
                            @click="showTableEditor=!showTableEditor"
                        >
                            <md-icon>settings</md-icon>
                        </md-button>
                    </div>
                </md-table-toolbar>

                <md-table-empty-state
                    :md-label="`No ${currentType} found`"
                    :md-description="`No ${currentType}  found. Scroll top, and create new ${currentType} .`"
                >
                    <md-button
                        class="md-primary md-raised"
                        @click="scrollToTop()"
                    >
                        Scroll Top
                    </md-button>
                </md-table-empty-state>

                <md-table-row
                    slot="md-table-row"
                    :key="item.ID"
                    slot-scope="{ item }"
                    class="transitionable-row"
                    :class="[
                        {'just-added': item.justAdded},
                        {'to-delete': item.ID === itemToDelete.ID},
                    ]"
                    :md-selectable="currentType ==='procedures'?'multiple':'single'"
                >
                    <md-table-cell
                        v-for="field in itemsTableColumns"
                        :key="field.key"
                        :class="field"
                        :md-label="getFieldName(field.key).toString()"
                        :md-sort-by="field.key"
                    >
                        <div
                            v-if="field.key === 'code' && item.code"
                            :class="field.key"
                        >
                            {{ item.code }}
                        </div>

                        <div
                            v-else-if="field.key === 'title' && item.title"
                            :class="field.key"
                        >
                            {{ item.title }}
                            <br>
                            <small>{{ item.description }}</small>
                        </div>

                        <div
                            v-else-if="field.key === 'teeth' && item.teeth"
                            :class="field.key"
                        >
                            <span
                                v-for="toothId in Object.keys(item.teeth)"
                                :key="toothId"
                            >

                                {{ toothId | toCurrentTeethSystem }},&nbsp;

                            </span>
                        </div>

                        <div
                            v-else-if="field.key === 'createdBy' && item.createdBy"
                            :class="field.key"
                            class="md-layout md-alignment-left-center"
                        >
                            <div
                                class="md-layout"
                                style="max-width:40px;"
                            >
                                <t-avatar
                                    :small="true"
                                    :text-to-color="item.createdBy.ID"
                                    :image-src="item.createdBy.avatar"
                                    :title="item.createdBy.firstName + ' ' + item.createdBy.lastName"
                                />
                            </div>
                            <span class="md-layout-item">
                                <span>{{ item.createdBy.lastName | capitilize }}</span>
                                <br>
                                <span>{{ item.createdBy.firstName | capitilize }}</span>
                            </span>
                        </div>

                        <div v-if="field.key === 'manipulations' && item.manipulations">
                            <div>
                                <small
                                    v-for="(m, i) in getManipulationsByProcedureID(item.ID)"
                                    :key="m.ID"
                                    class="items-manipulations_wrapper"
                                >
                                    <span class="text-left">{{ i+1 }}. {{ m.title }}</span>
                                    <span
                                        class="text-right"
                                    >{{ m.qty }} * {{ m.price || 0 }} = {{ m.totalPrice || 0 }} {{ currentClinic.currencyCode }}</span>
                                    <br>
                                </small>
                            </div>
                        </div>

                        <div v-if="field.key === 'state'">
                            <div>{{ item.state }}</div>
                        </div>

                        <div v-if="field.key === 'ID'">
                            <div>{{ item.ID }}</div>
                        </div>

                        <div v-if="field.key === 'date' && item.date">
                            <span class="md-medium-hide">
                                {{ item.date | moment("from") }}
                                <br>
                            </span>
                            <small>{{ item.date | moment("calendar") }}</small>
                        </div>
                        <div v-if="field.key === 'created' && item.created">
                            <span class="md-medium-hide">
                                {{ item.created | moment("from") }}
                                <br>
                            </span>
                            <small>{{ item.created | moment("calendar") }}</small>
                        </div>

                        <div v-if="field.key === 'updated' && item.updated">
                            <span class="md-medium-hide">
                                {{ item.updated | moment("from") }}
                                <br>
                            </span>
                            <small>{{ item.updated | moment("calendar") }}</small>
                        </div>

                        <div v-if="field.key === 'price' && item.manipulations">
                            <span>
                                {{ getManipulationsByProcedureID(item.ID).reduce((a, b) => a + b.totalPrice, 0) }}
                                <small>{{ currentClinic.currencyCode }}</small>
                            </span>
                            <span class="md-small-hide">
                                <br>
                                <small>{{ getManipulationsByProcedureID(item.ID).length }} manipulations</small>
                            </span>
                        </div>
                    </md-table-cell>

                    <md-table-cell
                        class
                        md-label="Actions"
                    >
                        <md-button
                            v-show="ifDiagnoseHasLocations(item.teeth)"
                            class="md-just-icon md-simple"
                            @click.native="toggleItemVisibility(item, currentType)"
                        >
                            <md-icon v-if="item.showInJaw">
                                visibility
                            </md-icon>
                            <md-icon v-else>
                                visibility_off
                            </md-icon>
                        </md-button>
                        <md-button
                            class="md-just-icon md-info md-simple"
                            @click.native="handleEdit(item)"
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
            <md-card-actions md-alignment="space-between">
                <div>
                    <p class="card-category">
                        Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
                    </p>
                </div>
                <md-button
                    class="md-simple"
                    @click="showTableEditor=!showTableEditor"
                >
                    <md-icon>settings</md-icon>
                    table settings
                </md-button>
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

        <md-snackbar
            :md-position="'center'"
            :md-duration="true ? Infinity : 4000"
            :md-active.sync="showSnackbar"
            text="Delete currentType?"
            md-persistent
        >
            <div class="snackbar-text-wrapper">
                Selected:
                <animated-number :value="selectedItems.length" />
                {{ currentType }} for
                <animated-number :value="getPlanTotalPrice(selectedItems)" />
                {{ currentClinic.currencyCode }}
            </div>
            <div>
                <md-button
                    v-if="selectedItems.length === items.length"
                    class="md-simple"
                    @click="selectedItems = []"
                >
                    Unselect
                </md-button>
                <md-button
                    v-else
                    class="md-simple"
                    @click="selectedItems = items"
                >
                    Select all
                </md-button>
                <md-button
                    class="md-simple"
                    @click="showSnackbar = false"
                >
                    Create invoice
                </md-button>
                <md-button
                    class="md-success"
                    @click="showSnackbar = false"
                >
                    Complete
                </md-button>
            </div>
        </md-snackbar>
        <md-snackbar
            :md-position="'center'"
            :md-duration="true ? Infinity : 4000"
            :md-active.sync="showDeleteItemSnackbar"
            md-persistent
        >
            <div class="snackbar-text-wrapper">
                Delete {{ singleItemName() }}
                {{ itemToDelete.code }} -
                {{ itemToDelete.title }}?
            </div>
            <div>
                <md-button
                    class="md-simple"
                    @click="showDeleteItemSnackbar = false, itemToDelete = {}"
                >
                    cancel
                </md-button>
                <md-button
                    :disabled="deleting"
                    class="md-warning"
                    @click="deleteItem()"
                >
                    <div v-if="deleting">
                        <md-progress-spinner
                            class="t-white"
                            :md-diameter="12"
                            :md-stroke="2"
                            md-mode="indeterminate"
                        />
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
import { mapGetters } from 'vuex';
import Fuse from 'fuse.js';
import components from '@/components';
import {
    USER_DIAGNOSIS_COLUMNS,
    USER_ANAMNESIS_COLUMNS,
    USER_PROCEDURES_COLUMNS,
    PATIENT_ITEM_VISIBILITY_TOGGLE,
    PATIENT_ITEM_JUST_ADDED_TOGGLE,
    PATIENT_PROCEDURE_DELETE,
    EB_SHOW_ITEM_WIZARD,
    NOTIFY,
} from '@/constants';
import EventBus from '@/plugins/event-bus';

export default {
    components: {
        ...components,
    },
    props: {
        plan: {
            type: Object,
            default: () => {},
        },
        items: {
            type: Array,
            default: () => [],
        },
        teethSystem: {
            type: Number,
            default: () => 1,
        },
        currentType: {
            type: String,
            default: () => 'diagnosis',
        },
    },
    data() {
        return {
            computedAvailableItemsTableColumns: [],
            itemsTableColumns: [],
            selectedItems: [],
            searchQuery: '',
            searchedData: [],
            deleting: false,
            itemToDelete: {},
            itemToEdit: {},
            showTableEditor: false,
            showDeleteForm: false,
            showSnackbar: false,
            currentSort: 'date',
            currentSortOrder: 'desc',
            pagination: {
                perPage: 10,
                currentPage: 1,
                perPageOptions: [10, 25, 50],
                total: 0,
            },
            fuseSearch: null,
            showDeleteItemSnackbar:false
        };
    },
    computed: {
        ...mapGetters({
            teethSchema: 'teethSchema',
            patient: 'getPatient',
            currentClinic: 'getCurrentClinic',
            availableItemsTableColumns: 'availableItemsTableColumns',
            getManipulationsByProcedureID: 'getManipulationsByProcedureID',
        }),
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
            return this.searchedData.length > 0
                ? this.searchedData.length
                : this.tableData.length;
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
            return USER_PROCEDURES_COLUMNS;
        },
        defaultFields() {
            if (this.currentType !== 'diagnosis') {
                const filteredColumns = this.availableItemsTableColumns.filter(
                    c => c.key !== 'manipulations' || c.key !== 'price',
                );
                return filteredColumns;
            }
            return this.availableItemsTableColumns;
        },
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
            if(!val){
                this.itemToDelete = ""
            }
        },
    },
    mounted() {
    // Fuse search initialization.
        this.fuseSearch = new Fuse(this.tableData, {
            keys: Object.values(this.itemsTableColumns).map(val => val.key),
            threshold: 0.3,
        });
    },
    created() {
        this.setItemsTableColumns();
        this.setComputedAvailableItemsTableColumns();
    },

    methods: {
        selectAll(){
            console.log(this.selectedItems)
            this.selectedItems = this.items;
            console.log(this.selectedItems)
        },
        toggleItemVisibility(itemId, itemType) {
            if (itemId) {
                this.$store.dispatch(PATIENT_ITEM_VISIBILITY_TOGGLE, {
                    params: {
                        itemId,
                        type: itemType,
                    },
                });
            }
            this.recalculateJaw(itemType);
        },
        getItemTotalPrice(manipulations) {
            let totalPrice = 0;
            if (!Array.isArray(manipulations)) {
                return totalPrice;
            }
            manipulations.forEach((m) => {
                totalPrice += m.qty * m.price;
            });
            return totalPrice;
        },
        getPlanTotalPrice(items) {
            let totalPrice = 0;
            let manips =[];
            if (!Array.isArray(items)) {
                return totalPrice;
            }
            if (items) {
                items.forEach((p) => {
                    if (p.ID) {
                        totalPrice += this.getManipulationsByProcedureID(p.ID).reduce((a, b) => a + (b.totalPrice || 0), 0);
                    }
                });
            }
            return totalPrice;
        },
        setComputedAvailableItemsTableColumns() {
            this.computedAvailableItemsTableColumns = this.defaultFields;
        },
        getFieldName(key) {
            const field = this.defaultFields.find(f => f.key === key);
            if (field) {
                return field.title;
            }
            return '';
        },
        setItemsTableColumns() {
            const columns2 = JSON.parse(
                localStorage.getItem(this.currentTypeToLocalStorage),
            );
            if (columns2) {
                this.itemsTableColumns = columns2;
            } else {
                this.itemsTableColumns = this.defaultFields;
            }
        },
        setColumns(e) {
            //! поменять после того как добавять соответствующие поля в беке
            localStorage.setItem(
                this.currentTypeToLocalStorage,
                JSON.stringify(e),
            );
            this.setItemsTableColumns();
            this.setComputedAvailableItemsTableColumns();
        },
        onSelect(item) {
            this.showSnackbar = !this.showSnackbar;
        },
        scrollToTop() {
            window.scrollTo(0, 0);
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
        customSort(value) {
            const vm = this;
            const val = value.sort((a, b) => {
                const sortBy = vm.currentSort;
                if (typeof a[vm.currentSort] === 'string') {
                    if (vm.currentSortOrder === 'desc') {
                        return a[sortBy].localeCompare(b[sortBy]);
                    }
                    return b[sortBy].localeCompare(a[sortBy]);
                }
                if (typeof a[vm.currentSort] === 'number') {
                    const orderLocal = vm.currentSortOrder;
                    const dflt = orderLocal === 'asc'
                        ? Number.MAX_VALUE
                        : -Number.MAX_VALUE;
                    const aVal = a[sortBy] === null ? dflt : a[sortBy];
                    const bVal = b[sortBy] === null ? dflt : b[sortBy];
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                }
                if (typeof a[vm.currentSort] === 'object') {
                    const orderLocal = vm.currentSortOrder;
                    const dflt = orderLocal === 'asc'
                        ? Number.MAX_VALUE
                        : -Number.MAX_VALUE;
                    const aVal = a[sortBy] === null ? dflt : a[sortBy];
                    const bVal = b[sortBy] === null ? dflt : b[sortBy];
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return val;
            });
        },
        handleEdit(item) {
            if (item) {
                const params = {
                    item,
                    type : this.currentType,
                };
                EventBus.$emit(EB_SHOW_ITEM_WIZARD,  params );
            }
        },
        handleDelete(item) {
            this.itemToDelete = item;
            this.showDeleteItemSnackbar = true;
        },
        deleteItem(){
            if (this.currentType === 'procedures') {
                this.deleteProcedure();
            }
            if (this.currentType === 'diagnosis') {
                this.deleteDiagnose();
            }
            if (this.currentType === 'anamnesis') {
                this.deleteAnamnes();
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
        notifyItemDeleted(){
            this.$store.dispatch(NOTIFY, {
                settings: {
                    message: `${this.singleItemName()} deleted`,
                    type: 'success',
                },
            });
        },
        deleteProcedure() {
            this.deleting = true;
            this.$store.dispatch(PATIENT_PROCEDURE_DELETE, {
                procedure: this.itemToDelete,
            })
                .then(()=>{
                    this.deleting = false;
                    this.showDeleteItemSnackbar = false;
                    this.notifyItemDeleted()
                })
                .catch((err) => {
                    this.deleting = false;
                    console.log(err)
                    throw new Error(err);
                }).then(() => {
                    this.deleting = false;
                    this.showDeleteItemSnackbar = false;
                });
        },
    },
};
</script>

<style lang="scss"  >
.items-list-wrapper {
    .md-table-cell-container {
        overflow: hidden;
        .teeth {
            max-width: 150px;
            width: 14vw;
            min-width: 50px;
            text-overflow: ellipsis;
            // word-wrap: break-word;
            overflow: hidden;
        }
        .code {
            width: 20px;
        }
        .items-manipulations_wrapper {
            text-overflow: ellipsis;
            overflow: hidden;
            align-items: stretch;
            display: flex;
            .text-left {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                // max-width: 70%;
            }
            .text-right {
                // flex-grow: 1;
                // // max-width: 30%;
                // text-overflow: ellipsis;
                // white-space: nowrap;
                text-align: right;
            }
        }
    }
    .md-card .md-card-actions {
        border: 0;
        margin-left: 20px;
        margin-right: 20px;
    }
    .paginated-table table > tbody > tr > td {
        width: fit-content;
    }
    // .footer-table table > tfoot > tr > th:first-child {
    //     width: 20px;
    // }
    // .footer-table table > tfoot > tr > th:nth-last-child(-n + 2) {
    //     width: 40px;
    // }
}
</style>
