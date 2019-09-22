<template>
    <div class="md-layout">
        <div class="md-layout-item md-size-100">
            <md-card>
                <md-card-header class="md-card-header-icon md-card-header-green">
                    <div class="card-icon">
                        <md-icon>assignment</md-icon>
                    </div>
                    <h4 class="title">
                        Total Manipulations: {{ getCurrentManipulations.length }}
                        <small v-if="filteredData.length !== getCurrentManipulations">Filtered: {{ filteredData.length }}</small>
                    </h4>
                </md-card-header>
                <md-card-content>
                    <clinic-nosology-table :items="filteredData || []" currentType="manipulations" @onSelected="onSelected">
                        <md-table-empty-state
                            v-if="loading"
                            slot="emptyState"
                            :md-label="`Loading manipulations`"
                            :md-description="`Please be patient almoast loaded`"
                        >
                            <md-progress-spinner :md-diameter="40" :md-stroke="4" md-mode="indeterminate" />
                        </md-table-empty-state>
                        <template slot="firsToolbarEnd">
                            <md-button @click="showAddNosologyForm = true" class="md-simple">
                                <md-icon>add</md-icon>
                                add Manipulation
                            </md-button>
                        </template>
                        <template slot="firsToolbarStart">
                            <div class="manipulations-autocomplite">
                                <cool-select
                                    ref="autocomplete"
                                    v-model="selectedManipulationID"
                                    v-validate="'is_exist'"
                                    class="with-action md-field"
                                    :class="[
                                        {
                                            'md-focused': coolSelectFocus || selectedManipulationID
                                        }
                                    ]"
                                    tabindex="1"
                                    :items="categories"
                                    input-for-text-class="md-input"
                                    :arrows-disable-instant-selection="true"
                                    :disable-first-item-select-on-enter="true"
                                    item-text="text"
                                    item-value="text"
                                    data-vv-name="selectedManipID"
                                    type="selectedManipID"
                                    name="selectedManipID"
                                    @focus="coolSelectFocus = true"
                                    @blur="coolSelectFocus = false"
                                    @select="filterManipulations"
                                >
                                    <template slot="input-end">
                                        <md-button
                                            v-show="selectedManipulationID"
                                            tabindex="-1"
                                            class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                            @click="unsetSelectedManipulationCategories()"
                                        >
                                            <md-icon class="success">close</md-icon>
                                        </md-button>
                                    </template>

                                    <template slot="input-start">
                                        <label for="input">Select manipulation category</label>
                                    </template>
                                    <template v-if="item" slot="item" slot-scope="{ item }">
                                        <div style="display: flex;">
                                            <md-button class="IZ-select-button md-layout-item">
                                                <span class="text-left">{{ `${item.text}` }}</span>
                                                <span class="text-right">{{ `${item.num}` }}</span>
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
                        </template>
                    </clinic-nosology-table>
                </md-card-content>
            </md-card>
        </div>
        <md-snackbar v-if="showItemSnackbar" :md-position="'center'" :md-duration="10000" :md-active.sync="showItemSnackbar" md-persistent>
            <div class="snackbar-wrapper md-layout md-alignment-center-space-between md-size-100">
                <div class="snackbar-text-wrapper">
                    Selected: &nbsp;
                    <animated-number :value="selectedItems.length" />manipulations
                </div>
                <div class="snackbar-action-wrapper ml-auto md-alignment-center-right">
                    <md-button v-if="selectedItems.length === getCurrentManipulations.length" class="md-simple" @click="unselectAll()"
                        >Unselect</md-button
                    >
                    <md-button v-else class="md-simple" @click="selectedItems = getCurrentManipulations">Select all</md-button>
                    <md-button class="md-simple">Disable</md-button>
                    <md-button class="md-success">Enable</md-button>
                </div>
            </div>
        </md-snackbar>
        <div v-if="showAddNosologyForm">
            <clinic-add-nosology-form :showForm.sync="showAddNosologyForm" />
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import ClinicNosologyTable from './ClinicNosologyTable';
// import ClinicAddNosologyForm from './ClinicAddNosologyForm';
import { CLINIC_MANIPULATIONS_GET } from '@/constants';
import { CoolSelect } from 'vue-cool-select';

export default {
    name: 'ClinicManipulations',
    components: {
        ...components,
        ClinicNosologyTable,
        'clinic-add-nosology-form':() => import('./ClinicAddNosologyForm'),
        CoolSelect
    },
    data() {
        return {
            selectedItems: [],
            showItemSnackbar: false,
            loading: false,
            coolSelectFocus: false,
            showAddNosologyForm: false,
            selectedManipulationID: null,
            filteredData: []
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patient: 'getPatient',
            getAvailableAnamnesTableColumns: 'getAvailableAnamnesTableColumns',
            getCurrentManipulations: 'getCurrentManipulations'
        }),
        categories() {
            let cat = [];
            this.getCurrentManipulations.forEach(m => {
                if (!cat.find(c => c.text === `${m.categoryCode} - ${m.categoryTitle}`))
                    cat.push({
                        text: `${m.categoryCode} - ${m.categoryTitle}`,
                        categoryTitle: m.categoryTitle,
                        categoryCode: m.categoryCode,
                        num: this.getCurrentManipulations.filter(
                            manip => manip.categoryCode === m.categoryCode && manip.categoryTitle === m.categoryTitle
                        ).length
                    });
            });
            return cat;
        }
    },
    watch: {
        showItemSnackbar(val) {
            if (!val) {
                this.itemToDelete = '';
            }
        }
    },
    created() {
        this.loading = true;
        if (this.getCurrentManipulations.length === 0) {
            this.$store.dispatch(CLINIC_MANIPULATIONS_GET).then(res => {
                this.filteredData = res;
                this.loading = false;
            });
        } else {
            this.filteredData = this.getCurrentManipulations;
        }
    },
    methods: {
        unsetSelectedManipulationCategories() {
            this.filteredData = this.getCurrentManipulations;
            this.selectedManipulationID = null;
        },
        filterManipulations(val) {
            if (val) {
                this.filteredData = this.getCurrentManipulations.filter(
                    manip => manip.categoryCode === val.categoryCode && manip.categoryTitle === val.categoryTitle
                );
            } else {
                this.filteredData = this.getCurrentManipulations;
            }
        },
        unselectAll() {
            this.selectedItems = [];
            this.showItemSnackbar = false;
        },
        onSelected(items) {
            this.selectedItems = items;
            this.showItemSnackbar = items.length > 0;
        }
    }
};
</script>

<style lang="scss" scoped></style>
