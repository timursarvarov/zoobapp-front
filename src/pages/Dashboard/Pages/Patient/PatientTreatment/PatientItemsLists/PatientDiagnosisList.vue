<template lang="html">
    <div>
        <patient-nosology-table
            current-type="diagnosis"
            extraClass="no"
            :items="sortedData"
            :selected-items="selectedItems"
            @onSelected="onSelected"
            @customSort="customSort"
        />
        <md-snackbar
            v-if="showDeleteItemSnackbar"
            :md-position="'center'"
            :md-duration="10000"
            :md-active.sync="showDeleteItemSnackbar"
            md-persistent
        >
            <div class="snackbar-wrapper md-layout md-alignment-center-space-between md-size-100">
                <div class="snackbar-text-wrapper ">
                    {{ $t(`${$options.name}.selected`) }}
                    <animated-number :value="selectedItems.length" />
                    {{ $tc(`${$options.name}.proceduresInAnamnes`, selectedItems.length) }}
                </div>
                <div class="snackbar-action-wrapper  ml-auto md-alignment-center-right ">
                    <md-button v-if="selectedItems.length === getPatientDiagnosis.length" class="md-simple" @click="unselectAll()">
                        {{ $t(`${$options.name}.unselect`) }}
                    </md-button>
                    <md-button v-else class="md-simple" @click="selectedItems = getPatientDiagnosis">
                        {{ $t(`${$options.name}.selectAll`) }}
                    </md-button>
                    <md-button class="md-simple" @click="showDeleteItemSnackbar = false">
                        {{ $t(`${$options.name}.complete`) }}
                    </md-button>
                    <md-button class="md-success" @click="showCreateInvoice()">
                        {{ $t(`${$options.name}.createInvoice`) }}
                    </md-button>
                </div>
            </div>
        </md-snackbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EB_SHOW_PATIENT_PRINT_FORM, STORE_KEY_PATIENT } from '@/constants';
import components from '@/components';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';
import EventBus from '@/plugins/event-bus';

export default {
    components: {
        ...components,
        ...patientComponents
    },
    name: 'PatientDiagnosisList',
    props: {
        currentType: {
            type: String,
            default: 'diagnosis'
        }
    },
    data() {
        return {
            showDeleteItemSnackbar: false,
            deleting: false,
            selectedItems: [],
            sortedData: []
        };
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            currentClinic: 'getCurrentClinic',
            getPatientDiagnosis: `${STORE_KEY_PATIENT}/getPatientDiagnosis`
        }),
    },
    watch: {
        getPatientDiagnosis() {
            this.customSort();
        }
    },
    methods: {
        sortBytypes(currentSort, currentSortOrder) {
            const vm = this;
            const val = vm.getPatientDiagnosis.sort((a, b) => {
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
        customSort(currentSort = 'created', currentSortOrder = 'asc') {
            const vm = this;
            if (currentSort === 'teeth') {
                vm.sortedData = vm.getPatientDiagnosis.sort((a, b) => {
                    const aTeethLength = a.teeth ? Object.keys(a.teeth).length : 0;
                    const bTeethLength = b.teeth ? Object.keys(b.teeth).length : 0;
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aTeethLength === null ? dflt : aTeethLength;
                    const bVal = bTeethLength === null ? dflt : bTeethLength;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                });
            }
            if (currentSort === 'price') {
                vm.sortedData = vm.getPatientDiagnosis.sort((a, b) => {
                    const aTeethPrice =  0;
                    const bTeethPrice =  0;
                    const orderLocal = currentSortOrder;
                    const dflt = orderLocal === 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
                    const aVal = aTeethPrice === null ? dflt : aTeethPrice;
                    const bVal = bTeethPrice === null ? dflt : bTeethPrice;
                    return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
                });
            }
            this.sortedData = this.sortBytypes(currentSort, currentSortOrder);
        },
        handlePrint(item) {
            if (item) {
                const params = {
                    item,
                    type: 'plan'
                };
                EventBus.$emit(EB_SHOW_PATIENT_PRINT_FORM, params);
            }
        },
        unselectAll() {
            this.selectedItems = [];
            this.showDeleteItemSnackbar = false;
        },
        onSelected(items) {
            console.log(items);
            if (items) {
                this.selectedItems = items;
                this.showDeleteItemSnackbar = items.length > 0;
            }
        }
    }
};
</script>
