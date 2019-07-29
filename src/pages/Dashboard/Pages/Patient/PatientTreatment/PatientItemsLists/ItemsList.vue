
<template>
    <div class="items-list-wrapper">
        <div class="t-toolbar" >
            <md-toolbar v-if="currentType==='procedures'" class="md-transparent">
                <div class="md-layout">
                    <div class="md-layout-item t-toolbar__section md-size-20 ">
                        <p class=" t-toolbar__section-text">
                            <b>Plan Name</b>
                        </p>
                        <h3 class="title t-toolbar__section-text">{{plan.name}}</h3>
                    </div>
                    <div class="md-layout-item text-right t-toolbar__section md-size-20 ">
                        <p class=" t-toolbar__section-text">
                            <b>Unbilled procedures</b>
                        </p>
                        <h3 class="title t-toolbar__section-text">
                            <span>
                                <animated-number :value="plan.procedures ? plan.procedures.length : 0" />
                            </span>
                        </h3>
                    </div>
                    <div class="md-layout-item text-right t-toolbar__section md-size-20 ">
                        <p class=" t-toolbar__section-text ">
                            <b>All Procedures</b>
                        </p>
                        <h3 class="title t-toolbar__section-text">
                            <span>
                                <animated-number :value="plan.procedures ? plan.procedures.length : 0" />
                            </span>
                        </h3>
                    </div>
                    <div class="md-layout-item text-right t-toolbar__section md-size-20 ">
                        <p class=" t-toolbar__section-text">
                            <b>Total Manipulations</b>
                        </p>
                        <h3 class="title t-toolbar__section-text">
                            <animated-number
                                :value="plan.procedures ? getTotalManips(plan.procedures) : 0"
                            />
                        </h3>
                    </div>
                    <div class="md-layout-item text-right t-toolbar__section md-size-20 ">
                        <p class=" t-toolbar__section-text">
                            <b>Total Price</b>
                        </p>
                        <h3 class="title t-toolbar__section-text">
                            <animated-number :value="getPlanTotalPrice(plan.procedures)" />
                            {{currentClinic.currencyCode}}
                        </h3>
                    </div>
                </div>
            </md-toolbar>
        </div>
        <md-empty-state
                v-if="items.length < 1"
                :md-label="`No ${currentType} found`"
                :md-description="`No ${currentType}  found. Scroll top, and create new ${currentType} .`"
            >
                <md-button class="md-primary md-raised" @click="scrollToTop()">Scroll Top</md-button>
        </md-empty-state>
        <div v-else >
            <md-toolbar v-if="currentType==='procedures'" class="md-transparent">
                <div class="md-toolbar-section-start md-layout">
                </div>
                <div class="md-toolbar-section-end ml-auto">
                    <md-button
                            @click="showTableEditor=!showTableEditor"
                            class="md-just-icon md-simple"
                        >
                            <md-icon>settings</md-icon>
                        </md-button>
                </div>
            </md-toolbar>
            <md-toolbar class="md-transparent md-layout">
                <div class="md-toolbar-section-start md-layout">
                    <div class="md-size-50 0">
                        <md-field>
                            <label for="pages">Per page</label>
                            <md-select v-model="pagination.perPage" name="pages">
                                <md-option
                                    v-for="item in pagination.perPageOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                                >{{ item }}</md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
                <div class="md-toolbar-section-end ml-auto">
                    <div class="md-layout" style="max-width: 300px">
                        <md-field>
                            <md-input
                                type="search"
                                class="mb-3"
                                clearable
                                style="width: 200px"
                                placeholder="Search records"
                                v-model="searchQuery"
                            ></md-input>
                        </md-field>
                    </div>
                </div>
            </md-toolbar>
            <md-table
                :md-selected-value.sync="selectedItems"
                :value="queriedData || []"
                :md-sort.sync="currentSort"
                :md-sort-order.sync="currentSortOrder"
                :md-sort-fn="customSort"
                class="table-striped paginated-table table-with-header table-hover"
            >
                <!-- <md-table-toolbar >
                    <md-field>
                        <label for="pages">Per page</label>
                        <md-select v-model="pagination.perPage" name="pages">
                            <md-option
                                v-for="item in pagination.perPageOptions"
                                :key="item"
                                :label="item"
                                :value="item"
                            >{{ item }}</md-option>
                        </md-select>
                    </md-field>
                    <div class="md-layout" style="max-width: 250px">
                        <md-field>
                            <md-input
                                type="search"
                                class="mb-3"
                                clearable
                                style="width: 200px"
                                placeholder="Search records"
                                v-model="searchQuery"
                            ></md-input>
                        </md-field>
                        <md-button
                            @click="showTableEditor=!showTableEditor"
                            class="md-just-icon md-simple"
                        >
                            <md-icon>settings</md-icon>
                        </md-button>
                    </div>
                </md-table-toolbar>-->

                <md-table-empty-state
                    :md-label="`No ${currentType} found`"
                    :md-description="`No ${currentType}  found. Scroll top, and create new ${currentType} .`"
                >
                    <md-button class="md-primary md-raised" @click="scrollToTop()">Scroll Top</md-button>
                </md-table-empty-state>

                <md-table-row
                    class="transitionable-row"
                    :class="[
                            {'just-added': item.justAdded},
                    ]"
                    slot="md-table-row"
                    :key="item.id || item.ID"
                    :md-selectable="currentType ==='procedures'?'multiple':'single'"
                    slot-scope="{ item }"
                >
                    <md-table-cell
                        v-for="field  in itemsTableColumns"
                        :key="field.key"
                        :class="field"
                        :md-label="getFieldName(field.key).toString()"
                        :md-sort-by="field.key"
                    >
                        <!-- :md-sort-by=" item[field.key] ? item[field.key].toString() : ''" -->
                        <div :class="field.key" v-if="field.key === 'code' && item.code">{{ item.code }}</div>

                        <div :class="field.key" v-else-if="field.key === 'title' && item.title">
                            {{ item.title }}
                            <br />
                            <small>{{item.description}}</small>
                        </div>

                        <div :class="field.key" v-else-if="field.key === 'teeth' && item.teeth">
                            <span
                                v-for="toothId in Object.keys(item.teeth)"
                                :key="toothId"
                            >{{ toothId | toCurrentTeethSystem(teethSystem) }},&nbsp;</span>
                        </div>

                        <div
                            :class="field.key"
                            v-else-if="field.key === 'createdBy' && item.createdBy"
                            class="md-layout md-alignment-left-center"
                        >
                            <div class="md-layout" style="max-width:40px;">
                                <t-avatar
                                    :small="true"
                                    :textToColor="item.createdBy.ID"
                                    :imageSrc="item.createdBy.avatar"
                                    :title="item.createdBy.firstName + ' ' + item.createdBy.lastName"
                                />
                            </div>
                            <span class="md-layout-item">
                                <span>{{item.createdBy.lastName | capitilize}}</span>
                                <br />
                                <span>{{item.createdBy.firstName | capitilize}}</span>
                            </span>
                        </div>

                        <div v-if="field.key === 'manipulations' && item.manipulations">
                            <div>
                                <small
                                    class="items-manipulations_wrapper"
                                    v-for="(m, i) in item.manipulations"
                                    :key="m.id || m.ID"
                                >
                                    <span class="text-left">{{i+1}}. {{m.manipulation.title}}</span>
                                    <span
                                        class="text-right"
                                    >{{m.num}} * {{m.price || 0}} = {{m.num * (m.price || 0)}} {{currentClinic.currencyCode}}</span>
                                    <br />
                                </small>
                            </div>
                        </div>

                        <div v-if="field.key === 'state'">
                            <div>{{item.state}}</div>
                        </div>

                        <div v-if="field.key === 'ID'">
                            <div>{{item.ID}}</div>
                        </div>

                        <div v-if="field.key === 'date' && item.date">
                            <span class="md-medium-hide">
                                {{ item.date | moment("from") }}
                                <br />
                            </span>
                            <small>{{item.date | moment("calendar")}}</small>
                        </div>
                        <div v-if="field.key === 'created' && item.created">
                            <span class="md-medium-hide">
                                {{ item.created | moment("from") }}
                                <br />
                            </span>
                            <small>{{item.created | moment("calendar")}}</small>
                        </div>

                        <div v-if="field.key === 'updated' && item.updated">
                            <span class="md-medium-hide">
                                {{ item.updated | moment("from") }}
                                <br />
                            </span>
                            <small>{{item.updated | moment("calendar")}}</small>
                        </div>

                        <div v-if="field.key === 'price' && item.manipulations">
                            <span>
                                {{getItemTotalPrice(item.manipulations)}}
                                <small>{{currentClinic.currencyCode}}</small>
                            </span>
                            <span class="md-small-hide">
                                <br />
                                <small>{{ getSubManips(item.manipulations)}} manipulations</small>
                            </span>
                        </div>
                    </md-table-cell>

                    <md-table-cell class md-label="Actions">
                        <md-button
                            v-show="ifDiagnoseHasLocations(item.teeth)"
                            class="md-just-icon md-simple"
                            @click.native="$emit('toggleItemVisibility', item, currentType)"
                        >
                            <md-icon v-if="item.showInJaw">visibility</md-icon>
                            <md-icon v-else>visibility_off</md-icon>
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
                <div class>
                    <p class="card-category">Showing {{from + 1}} to {{to}} of {{total}} entries</p>
                </div>
                <pagination
                    class="pagination-no-border pagination-success"
                    v-model="pagination.currentPage"
                    :per-page="pagination.perPage"
                    :total="total"
                ></pagination>
            </md-card-actions>
        </div>
        <t-table-editor
            icon="settings"
            color="success"
            :title="`Set ${currentType} columns order`"
            :availableTableColumns="computedAvailableItemsTableColumns"
            :tableColumns="itemsTableColumns"
            :showForm.sync="showTableEditor"
            @selected="setColumns"
        ></t-table-editor>

        <delete-form
            text="Delete Plan?"
            :showForm.sync="showDeleteForm"
            :itemToDelete="itemToDelete"
            :patientID="patient.ID"
            :currentType="currentType"
            :planID="plan.ID"
        />

        <md-snackbar
            :md-position="'center'"
            :md-duration="true ? Infinity : 4000"
            :md-active.sync="showSnackbar"
            text="Delete currentType?"
            md-persistent
        >
            <div class="md-layout">
                <div class="md-layout md-layout-item">
                    <div class="md-layout-item">
                        <span>
                            Selected:
                            <animated-number :value="selectedItems.length" />
                            {{currentType}}
                        </span>
                    </div>
                    <div class="md-layout-item">
                        <animated-number :value="getPlanTotalPrice(selectedItems)" />
                        {{currentClinic.currencyCode}}
                    </div>
                </div>
                <div class="md-layout md-layout-item">
                    <md-button class="md-simple" @click="showSnackbar = false">Delete</md-button>
                    <md-button class="md-simple" @click="showSnackbar = false">Create invoice</md-button>
                    <md-button class="md-success" @click="showSnackbar = false">Complete</md-button>
                </div>
            </div>
        </md-snackbar>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import Fuse from 'fuse.js';
    import {
        TAvatar,
        TTableEditor,
        AnimatedNumber,
        Pagination,
    } from '@/components';
    import {
        USER_DIAGNOSIS_COLUMNS,
        USER_ANAMNESIS_COLUMNS,
        USER_PROCEDURES_COLUMNS,
    } from '@/constants';
    import DeleteForm from './DeleteForm.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TAvatar,
            TTableEditor,
            AnimatedNumber,
            DeleteForm,
            Pagination,
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
                itemToDelete: {},
                showTableEditor: false,
                showDeleteForm: false,
                showSnackbar: false,
                isInfinity: false,
                currentSort: 'date',
                currentSortOrder: 'desc',
                pagination: {
                    perPage: 10,
                    currentPage: 1,
                    perPageOptions: [10, 25, 50],
                    total: 0,
                },
                fuseSearch: null,
            };
        },
        computed: {
            ...mapGetters({
                teethSchema: 'teethSchema',
                jaw: 'jaw',
                patient: 'getPatient',
                currentClinic: 'getCurrentClinic',
                availableItemsTableColumns: 'availableItemsTableColumns',
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

        methods: {
            getSubManips(manipulations) {
                let total = 0;
                if (!Array.isArray(manipulations)) {
                    return total;
                }
                manipulations.forEach((m) => {
                    total += m.num;
                });
                return total;
            },
            getTotalManips(items) {
                let total = 0;
                if (!Array.isArray(items)) {
                    return total;
                }
                items.forEach((item) => {
                    total += this.getSubManips(item.manipulations);
                });
                return total;
            },
            getItemTotalPrice(manipulations) {
                let totalPrice = 0;
                if (!Array.isArray(manipulations)) {
                    return totalPrice;
                }
                manipulations.forEach((m) => {
                    totalPrice += m.num * m.price;
                });
                return totalPrice;
            },
            getPlanTotalPrice(items) {
                let totalPrice = 0;
                if (!Array.isArray(items)) {
                    return totalPrice;
                }
                if (items) {
                    items.forEach((p) => {
                        if (p.manipulations) {
                            totalPrice += this.getItemTotalPrice(p.manipulations);
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
                    this.$emit('showItemInfo', {
                        itemId: item.id || item.ID,
                        toothId: null,
                        type: this.currentType,
                    });
                }
            },
            handleDelete(item) {
                this.itemToDelete = item;
                this.showDeleteForm = true;
            },
            removeClass() {
                setTimeout(() => {
                    if (document.querySelector('.just-added')) {
                        this.items.forEach((item, index) => {
                            if (item.justAdded) {
                                this.items[index].justAdded = false;
                            }
                        });
                    }
                }, 5000);
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
        watch: {
            searchQuery(value) {
                let result = this.tableData;
                if (value !== '') {
                    result = this.fuseSearch.search(this.searchQuery);
                }
                console.log(result);
                this.searchedData = result;
            },
            currentType() {
                this.setItemsTableColumns();
                this.setComputedAvailableItemsTableColumns();
            },
            selectedItems() {
                this.showSnackbar = this.selectedItems.length > 0;
            },
            items() {
                console.log(12);
                this.removeClass();
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
