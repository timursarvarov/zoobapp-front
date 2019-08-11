
<template>
    <div class="items-list-wrapper md-layout-item">
        <md-toolbar class="md-transparent">
            <div class="md-layout">
                <div class="md-layout-item">
                    <p class="category">
                        <b>Ballance</b>
                    </p>
                    <h3 class="title">
                        <animated-number :value="calculateProcedures(tableData)" />
                        {{currentClinic.currencyCode}}
                    </h3>
                </div>
                <div class="md-layout-item text-right">
                    <p class="category">
                        <b>Unbilled procedures</b>
                    </p>
                    <h3 class="title">
                        <span>
                            <animated-number :value="tableData.length" />
                        </span>
                    </h3>
                </div>
                <div class="md-layout-item text-right">
                    <p class="category">
                        <b>All invoices</b>
                    </p>
                    <h3 class="title">
                        <span>
                            <animated-number :value="selectedItems ? selectedItems.length: 0" />
                            {{currentClinic.currencyCode}}
                        </span>
                    </h3>
                </div>
                <div class="md-layout-item text-right">
                    <p class="category">
                        <b>Discounts</b>
                    </p>
                    <h3 class="title">
                        <animated-number :value="300" />
                        {{currentClinic.currencyCode}}
                    </h3>
                </div>
                <div class="md-layout-item text-right">
                    <p class="category">
                        <b>Tax</b>
                    </p>
                    <h3 class="title">
                        <animated-number :value="300" />
                        {{currentClinic.currencyCode}}
                    </h3>
                </div>
            </div>
        </md-toolbar>
        <patient-billing-items
            @onCreateInvoice="onCreateInvoice"/>
        <patient-billing-invoices/>
        <t-wizard-add-billing
            @onProcedureAdd="onProcedureAdd"
            :isDialogVisible.sync="showInvoiceForm"
            :selectedProcedures="selectedItems || []"
            :allProcedures="tableData"
            :currencyCode="currentClinic.currencyCode"
        />
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import components from '@/components';
    import { USER_BILLING_COLUMNS } from '@/constants';
    import PatientBillingItems from './PatientBillingItems.vue';
    import PatientBillingInvoices from './PatientBillingInvoices.vue';
    import { tObjProp } from '@/mixins';

    const randomMC = require('random-material-color');

    export default {
        name: 'patient-billing',
        mixins: [tObjProp],
        components: {
            ...components,
            PatientBillingItems,
            PatientBillingInvoices,
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
                computedAvailableBillingTableColumns: [],
                itemsTableColumns: [],
                selectedItems: [],
                showTableEditor: false,
                showForm: false,
                showSnackbar: false,
                showInvoiceForm: false,
                isInfinity: false,
                currentSort: 'date',
                currentSortOrder: 'desc',
                randomMC: '',
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
                currentClinic: 'getCurrentClinic',
                availableBillingTableColumns: 'availableBillingTableColumns',
            }),
            tableData() {
                const procedures = [];
                if (this.patient.plans) {
                    Object.values(this.patient.plans).forEach((plan) => {
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
                return procedures;
            },
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
            onCreateInvoice(items) {
                this.selectedItems = items || [];
                this.showInvoiceForm = true;
            },
            onProcedureAdd(p) {
                this.selectedItems.push(p);
            },
            planColor(text) {
                return this.randomMC.getColor({ text: `${text}` });
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
            this.randomMC = randomMC;
        },
        watch: {
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
