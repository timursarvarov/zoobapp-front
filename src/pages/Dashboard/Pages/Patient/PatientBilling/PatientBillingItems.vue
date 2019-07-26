
<template>
    <div class="items-list-wrapper">
        <md-table
            :md-selected-value.sync="selectedItems"
            :value="tableData"
            :md-sort.sync="currentSort"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="customSort"
            class="table-striped table-with-header table-hover"
        >
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                    <h1 class="md-title"><b>Unbilled procedures</b></h1>
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
                slot="md-table-row"
                md-selectable="multiple"
                slot-scope="{ item }"
                md-auto-select
            >
                <md-table-cell
                    v-for="field  in itemsTableColumns"
                    :key="field.key"
                    :class="field"
                    :md-label="getFieldName(field.key).toString()"
                    :md-sort-by=" item[field.key] ? item[field.key].toString() : ''"
                >
                    <div :class="field.key" v-if="field.key === 'code'">{{ item.code }}</div>
                    <div :class="field.key" v-else-if="field.key === 'title'">
                        {{ item.title }}
                        <br>
                        <small>{{item.description}}</small>
                    </div>
                    <div :class="field.key" v-else-if="field.key === 'teeth'">
                        <span
                            v-for="toothId in Object.keys(item.teeth)"
                            :key="toothId"
                        >{{ toothId | toCurrentTeethSystem(teethSystem) }},&nbsp;</span>
                    </div>

                    <div
                        :class="field.key"
                        v-else-if="field.key === 'author'"
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
                    <div v-if="field.key === 'date'">
                        <span>{{ item.date | moment("from") }}</span>
                        <br>
                        <small>{{item.date | moment("calendar")}}</small>
                    </div>

                    <div v-if="field.key === 'price' && item.manipulations">
                        {{getItemTotalPrice(item.manipulations)}}
                        <small>{{currentClinic.currencyCode}}</small>
                    </div>
                    <div v-if="field.key === 'plan'"
                        class="md-layout md-alignment-center-left"
                    >
                        <div class="md-layout" style="max-width:40px;">
                            <t-avatar
                                :small="true"
                                :textToColor="item.planId"
                            />
                        </div>
                        <div class="md-layout md-alignment-center-left">
                            <span style="height: fit-content;" class="md-xsmall-hide">
                                {{item.planName| capitilize}}
                            </span>
                        </div>
                    </div>
                    <div class="manipulations" v-if="field.key === 'manipulations' && item.manipulations">
                        <div>
                            <small
                                class="items-manipulations_wrapper"
                                v-for="(m, i) in item.manipulations"
                                :key="m.id"
                            >
                                <span class="text-left">{{i+1}}. {{m.manipulation.title}}</span>
                                <span
                                    class="text-right"
                                >{{m.num}} * {{m.price || 0}} = {{m.num * (m.price || 0)}} {{currentClinic.currencyCode}}</span>
                                <br />
                            </small>
                        </div>
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
        <md-snackbar
            v-if="!showForm"
            :md-position="'center'"
            :md-duration="true ? Infinity : 4000"
            :md-active.sync="showSnackbar"
            md-persistent
        >
            <p>{{`${selectedItems.length}`}}
                Procedures for
                <animated-number :value="calculateProcedures(selectedItems)" /> {{currentClinic.currencyCode}}
                selected
            </p>
            <div>
                <md-button class="md-simple" @click="showSnackbar = false, selectedItems=[]">unselect</md-button>
                <md-button
                    class="md-success"
                    @click="showCreateInvoice()"
                >Create Invoice</md-button>
            </div>
        </md-snackbar>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import {
        TAvatar,
        TTableEditor,
        AnimatedNumber,
    } from '@/components';
    import { USER_BILLING_COLUMNS } from '@/constants';
    import { tObjProp } from '@/mixins';


    export default {
        mixins: [tObjProp],
        components: {
            TAvatar,
            TTableEditor,
            AnimatedNumber,
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
                patient: 'getPatient',
                currentClinic: 'getCurrentClinic',
                availableBillingTableColumns: 'availableBillingTableColumns',
            }),
            defaultFields() {
                const standartColumns = [
                    {
                        key: 'code',
                        title: 'Code',
                    },
                    {
                        key: 'title',
                        title: 'Title',
                    },
                    {
                        key: 'teeth',
                        title: 'Teeth',
                    },
                    {
                        key: 'author',
                        title: 'Created By',
                    },
                    {
                        key: 'date',
                        title: 'Date',
                    },
                    {
                        key: 'manipulations',
                        title: 'Manipulations',
                    },
                    {
                        key: 'price',
                        title: 'Price',
                    },
                ];
                return standartColumns;
            },
        },

        methods: {
            setTableData() {
                const procedures = [];
                if (this.patient.plans) {
                    this.patient.plans.forEach((plan) => {
                        if (plan.state === 1 && plan.procedures) {
                            plan.procedures.forEach((p) => {
                                procedures.push({
                                    ...p,
                                    planId: plan.ID,
                                    planName: plan.name,
                                    planCreated: plan.created,
                                });
                            });
                        }
                    });
                }
                this.tableData = procedures;
            },
            allPlans() {
                return this.patient.plans;
            },
            showCreateInvoice() {
                this.showSnackbar = false,
                this.$emit('onCreateInvoice', this.selectedItems);
            },
            onProcedureAdd(p) {
                this.selectedItems.push(p);
            },
            calculateProcedures(procedures = []) {
                let sum = 0;
                procedures.forEach((p) => {
                    if (p.manipulations) {
                        sum += this.calculateManipulations(p.manipulations);
                    }
                });
                return sum;
            },
            calculateManipulations(m = []) {
                let sum = 0;
                m.forEach((manip) => {
                    sum += manip.price * manip.num;
                });
                return sum;
            },
            convertHex(hex, opacity) {
                const hexLocal = hex.replace('#', '');
                const r = parseInt(hexLocal.substring(0, 2), 16);
                const g = parseInt(hexLocal.substring(2, 4), 16);
                const b = parseInt(hexLocal.substring(4, 6), 16);

                const result = `rgba(${r},${g},${b},${opacity / 100})`;
                return result;
            },
            setComputedAvailableBillingTableColumns() {
                if (this.type === 'diagnosis') {
                    const columns = this.availableBillingTableColumns.filter(
                        el => el.key !== 'manipulations' && el.key !== 'price',
                    );
                    this.computedAvailableBillingTableColumns = columns;
                } else {
                    this.computedAvailableBillingTableColumns = this.availableBillingTableColumns;
                }
            },
            getFieldName(key) {
                const field = this.availableBillingTableColumns.find(
                    f => f.key === key,
                );
                if (field) {
                    return field.title;
                }
                return '';
            },
            setItemsTableColumns() {
                const columns2 = JSON.parse(
                    localStorage.getItem(USER_BILLING_COLUMNS),
                );
                if (columns2) {
                    this.itemsTableColumns = columns2;
                } else {
                    this.itemsTableColumns = this.defaultFields;
                }
            },
            setColumns(e) {
                // поменять после того как добавять соответствующие поля в беке
                localStorage.setItem(USER_BILLING_COLUMNS, JSON.stringify(e));
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
                    totalPrice += m.num * m.price;
                });
                return totalPrice;
            },
            scrollToTop() {
                window.scrollTo(0, 0);
            },
            recalculateJaw() {
                this.$emit('onJawChanged');
            },
            ifDiagnoseHasLocations(teeth) {
                let show = false;
                show = Object.keys(teeth)
                    .map(key => Object.keys(teeth[key]).length > 0)
                    .indexOf(true);
                show = show !== -1;
                return show;
            },
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
            allPlans() {
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
    }
    .manipulations{
    max-width: 30vw;
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
                flex-grow:1;
                // max-width: 30%;
                text-overflow: ellipsis;
                white-space: nowrap;
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
