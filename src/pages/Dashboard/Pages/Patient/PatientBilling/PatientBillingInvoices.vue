
<template>
    <div class="items-list-wrapper">
        <md-table
            :md-selected-value.sync="selectedItems"
            v-model="tableData"
            :md-sort.sync="currentSort"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="customSort"
            class="table-striped table-with-header table-hover"
        >
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                    <h1 class="md-title"><b>Invoices</b></h1>
                </div>
                <div class="md-toolbar-section-end">
                    <md-button
                        @click="showTableEditor=!showTableEditor"
                        class="md-just-icon md-simple"
                    >
                        <md-icon>settings</md-icon>
                    </md-button>
                </div>
            </md-table-toolbar>

            <md-table-empty-state
                :md-label="`No ${type} found`"
                :md-description="`No ${type}  found. Scroll top, and create new ${type} .`"
            >
                <md-button class="md-primary md-raised" @click="scrollToTop()">Scroll Top</md-button>
            </md-table-empty-state>

            <md-table-row
                md-selectable="single"
                slot="md-table-row"
                slot-scope="{ item }" >
                <md-table-cell
                    v-for="field  in itemsTableColumns"
                    :key="field.key"
                    :class="field"
                    :md-label="field.title.toString()"
                    :md-sort-by=" item[field.key] ? item[field.key].toString() : ''"
                >
                    <div :class="field.key" v-if="field.key === 'ID'">{{ item.ID }}</div>
                    <div :class="field.key" v-else-if="field.key === 'procedures'">{{ item.procedures.length }}</div>
                    <div :class="field.key" v-else-if="field.key === 'payments'">{{ item.payments.length }}</div>
                    <div :class="field.key" v-else-if="field.key === 'round'">{{ item.round }}</div>
                    <div :class="field.key" v-else-if="field.key === 'discount'">
                        {{ item.discount || 0}}%
                        <br>
                    </div>

                    <div :class="field.key"
                        v-else-if="field.key === 'author' && item.author"
                        class="md-layout md-alignment-left-center"
                        >
                        <div class="md-layout" style="max-width:40px;">
                            <t-avatar
                                :small="true"
                                :textToColor="item.author.ID"
                                :imageSrc="item.author.avatar"
                                :title="item.author.firstName + ' ' + item.author.lastName"
                            />
                        </div>
                        <span class="md-layout-item">
                            <span>{{item.author.lastName | capitilize}}</span>
                            <br>
                            <span>{{item.author.firstName | capitilize}}</span>
                        </span>
                    </div>

                    <div v-else-if="field.key === 'createdDate' && item.createdDate">
                        <span>{{ item.createdDate | moment("from") }}</span>
                        <br>
                        <small>{{item.createdDate | moment("calendar")}}</small>
                    </div>
                    <div v-else-if="field.key === 'dueDate' && item.dueDate">
                        <span>{{ item.dueDate | moment("from") }}</span>
                        <br>
                        <small>{{item.dueDate | moment("calendar")}}</small>
                    </div>

                    <div v-else-if="field.key === 'total'">
                        {{item.total}}
                        <small>{{clinic.currencyCode}}</small>
                    </div>
                    <div v-else-if="field.key === 'tax'">
                        {{item.tax || 0}}%
                    </div>
                </md-table-cell>
            </md-table-row>
        </md-table>
        <t-table-editor
            icon="settings"
            color="success"
            :title="`Set ${type} columns order`"
            :availableTableColumns="computedAvailableBillingTableColumns"
            :tableColumns="itemsTableColumns"
            :showForm.sync="showTableEditor"
            @selected="setColumns"
        ></t-table-editor>
        <md-snackbar :md-position="'center'" :md-duration="true ? Infinity : 4000" :md-active.sync="showSnackbar" md-persistent>
                <span> {{`Set ${selectedItems.length} ${type} selected`}} Patients selected</span>
                <md-button class="md-primary" @click="showSnackbar = false">do something</md-button>
        </md-snackbar>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { TAvatar, TTableEditor } from '@/components';
    import {
        USER_INVOICE_COLUMNS,
    } from '@/constants';
    // import swal from 'sweetalert2';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TAvatar,
            TTableEditor,
        },
        props: {
            items: {
                type: Array,
                default: () => [],
            },
            teethSystem: {
                type: Number,
                default: () => 1,
            },
            type: {
                type: String,
                default: () => 'diagnosis',
            },
        },
        data() {
            return {
                tableData: [],
                computedAvailableBillingTableColumns: [],
                itemsTableColumns: [],
                selectedItems: [],
                showTableEditor: false,
                showForm: false,
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
            };
        },
        computed: {
            ...mapGetters({
                teethSchema: 'teethSchema',
                jaw: 'jaw',
                patient: 'getPatient',
                clinic: 'getCurrentClinic',
                availableInvoiceTableColumns: 'availableInvoiceTableColumns',
            }),
            invoices(){
                return this.patient.invoices || []
            },
            defaultFields() {
                const standartColumns = [
                    {
                        key: 'discount',
                        title: 'Discount',
                    },
                    {
                        key: 'dueDate',
                        title: 'Due date',
                    },
                    {
                        key: 'ID',
                        title: 'ID',
                    },
                    {
                        key: 'payments',
                        title: 'Payments',
                    },
                    {
                        key: 'procedures',
                        title: 'Procedures',
                    },
                    {
                        key: 'author',
                        title: 'Created By',
                    },
                    {
                        key: 'round',
                        title: 'Round',
                    },
                    {
                        key: 'tax',
                        title: 'Tax',
                    },
                    {
                        key: 'createdDate',
                        title: 'Created date',
                    },
                    {
                        key: 'total',
                        title: 'Total',
                    },
                ];
                return standartColumns;
            },
        },

        methods: {
            setTableData() {
                this.tableData = this.invoices;
            },
            setComputedAvailableBillingTableColumns() {
                if (this.type === 'diagnosis') {
                    const columns = this.availableInvoiceTableColumns.filter(
                        el => el.key !== 'manipulations' && el.key !== 'price',
                    );
                    this.computedAvailableBillingTableColumns = columns;
                } else {
                    this.computedAvailableBillingTableColumns = this.availableInvoiceTableColumns;
                }
            },
            getFieldName(key) {
                const field = this.availableInvoiceTableColumns.find(
                    f => f.key === key,
                );
                if (field) {
                    return field.title;
                }
                return '';
            },
            setItemsTableColumns() {
                const columns2 = JSON.parse(
                    localStorage.getItem(USER_INVOICE_COLUMNS),
                );
                if (columns2) {
                    this.itemsTableColumns = columns2;
                } else {
                    this.itemsTableColumns = this.defaultFields;
                }
            },
            setColumns(e) {
                // поменять после того как добавять соответствующие поля в беке
                localStorage.setItem(
                    USER_INVOICE_COLUMNS,
                    JSON.stringify(e),
                );
                this.setItemsTableColumns();
                this.setComputedAvailableBillingTableColumns();
            },
            onSelect(item) {
                console.log(item);
                this.showSnackbar = !this.showSnackbar;
            },
            getItemTotalPrice(manipulations) {
                let totalPrice = 0;
                manipulations.forEach((m) => {
                    totalPrice = +m.num * m.price;
                });
                return totalPrice;
            },
            scrollToTop() {
                window.scrollTo(0, 0);
            },
            recalculateJaw() {
                this.$emit('onJawChanged');
            },
            // ifDiagnoseHasLocations(teeth) {
            //     let show = false;
            //     show = Object.keys(teeth)
            //         .map(key => Object.keys(teeth[key]).length > 0)
            //         .indexOf(true);
            //     show = show !== -1;
            //     return show;
            // },
            getToothName(toothId) {
                const tooth = {
                    num: this.teethSchema[toothId][this.teethSystem],
                    name: this.teethSchema[toothId].name,
                };
                return tooth;
            },
            customSort(value) {
                const thisLocal = this;
                const val = value.sort((a, b) => {
                    const sortBy = thisLocal.currentSort;
                    if (typeof a[thisLocal.currentSort] === 'string') {
                        if (thisLocal.currentSortOrder === 'desc') {
                            return a[sortBy].localeCompare(b[sortBy]);
                        }
                        return b[sortBy].localeCompare(a[sortBy]);
                    }
                    if (typeof a[thisLocal.currentSort] === 'number') {
                        const orderLocal = thisLocal.currentSortOrder;
                        const dflt = orderLocal === 'asc'
                            ? Number.MAX_VALUE
                            : -Number.MAX_VALUE;
                        const aVal = a[sortBy] === null ? dflt : a[sortBy];
                        const bVal = b[sortBy] === null ? dflt : b[sortBy];
                        return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                    }
                    if (typeof a[thisLocal.currentSort] === 'object') {
                        const orderLocal = thisLocal.currentSortOrder;
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
            handleLike(item) {
            // swal({
            //     title: `You liked ${item.title}`,
            //     buttonsStyling: false,
            //     type: 'success',
            //     confirmButtonClass: 'md-button md-success',
            // });
            },
            handleEdit(item) {
                if (item) {
                    this.$emit('showItemInfo', {
                        itemId: item.id,
                        toothId: null,
                        type: this.type,
                    });
                }
            // this.$emit('editItem', item, this.type);
            },
            handleDelete(item) {
            // swal({
            //     title: 'Are you sure?',
            //     text: "You won't be able to revert this!",
            //     type: 'warning',
            //     showCancelButton: true,
            //     confirmButtonClass: 'md-button md-success btn-fill',
            //     cancelButtonClass: 'md-button md-danger btn-fill',
            //     confirmButtonText: 'Yes, delete it!',
            //     buttonsStyling: false,
            // }).then((result) => {
            //     if (result.value) {
            //         this.deleteRow(item);
            //         swal({
            //             title: 'Deleted!',
            //             text: `You deleted ${item.title}`,
            //             type: 'success',
            //             confirmButtonClass: 'md-button md-success btn-fill',
            //             buttonsStyling: false,
            //         });
            //     }
            // });
            },
            deleteRow(item) {},
        },
        mounted() {
        // Fuse search initialization.
        // this.fuseSearch = new Fuse(this.tableData, {
        //     keys: ['diagnose', 'code', 'author', 'date', 'title'],
        //     threshold: 0.3,
        // });
        },
        created() {
            this.setItemsTableColumns();
            this.setComputedAvailableBillingTableColumns();
            this.setTableData();
        },
        watch: {
            invoices(){
                this.setTableData();
            },
            searchQuery(value) {
                let result = this.tableData;
                if (value !== '') {
                    result = this.fuseSearch.search(this.searchQuery);
                }
                this.searchedData = result;
            },
            type(value) {
                this.setItemsTableColumns();
                this.setComputedAvailableBillingTableColumns();
            },
            selectedItems() {
                this.showSnackbar = this.selectedItems.length > 0;
            },
        },
    };
</script>

<style lang="scss"  >
.items-list-wrapper {


    .md-table-cell-container {

        overflow: hidden;
        .teeth{
            max-width:150px;
            width:14vw;
            min-width:50px;
            text-overflow: ellipsis;
            // word-wrap: break-word;
            overflow: hidden;
        }
         .code {
        width: 20px;
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
