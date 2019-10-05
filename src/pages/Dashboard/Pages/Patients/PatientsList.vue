<template>
    <div class="md-layout patients-list-wrapper">
        <div class="md-layout-item">
            <md-card>
                <md-card-header class="md-card-header-icon md-layout md-gutter md-card-header-green">
                    <div class="card-icon">
                        <md-icon>assignment</md-icon>
                    </div>

                    <h4 class="title md-layout-item">{{ $t(`${$options.name}.title`) }}</h4>
                </md-card-header>
                <md-card-content>
                    <md-toolbar class="md-transparent">
                        <div class="md-toolbar-section-start md-layout">
                            <h4 class="title md-layout-item">
                                {{ $tc(`${$options.name}.patientNum`, patientsNum) }}
                            </h4>
                        </div>
                        <div class="md-toolbar-section-end md-layout ml-auto">
                            <md-switch @change="switchFIlterMode" v-model="filterMode">{{ $t(`${$options.name}.filterMode`) }}</md-switch>
                            <md-button class="md-just-icon md-simple" @click="showForm = !showForm">
                                <md-icon>settings</md-icon>
                            </md-button>
                        </div>
                    </md-toolbar>
                    <transition-expand>
                        <md-toolbar v-if="filterMode" class="md-transparent">
                            <div class="md-toolbar-section-start md-layout"></div>
                            <div class="md-toolbar-section-end md-layout ml-auto"></div>
                        </md-toolbar>
                    </transition-expand>
                    <md-toolbar class="md-transparent">
                        <div class="md-toolbar-section-start md-layout">
                            <div class="md-size-50 md-small-size-100">
                                <md-field>
                                    <label for="pages">{{ $t(`${$options.name}.perPage`) }}</label>
                                    <md-select v-model="queryParams.pagination.perPage" name="pages">
                                        <md-option v-for="item in perPageOptions" :key="item" :label="item" :value="item">{{ item }}</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                        </div>
                        <div class="md-toolbar-section-end ml-auto">
                            <div style="width: 300px">
                                <md-field :class="{ 'no-after-no-before': searching }">
                                    <label>{{ $t(`${$options.name}.searchTitle`) }}</label>
                                    <md-input v-model="queryParams.searchQuery" type="search" class="mb-3" />
                                </md-field>
                                <md-progress-bar v-if="searching" class="underline-progress" :md-stroke="1" md-mode="indeterminate" />
                            </div>
                        </div>
                    </md-toolbar>
                    <div class="table-wrapper">
                        <!-- <div v-if="searching || false" class="md-layout mx-auto table-wrapper-preloader">
                            <div style="height:60px;margin: auto;">
                                <md-progress-spinner md-mode="indeterminate" />
                            </div>
                        </div> -->
                        <md-table
                            :key="filterMode"
                            v-model="tableData"
                            @md-selected="onSelect"
                            :md-selected-value.sync="selectedPatients"
                            :md-sort.sync="queryParams.currentSort"
                            :md-sort-order.sync="queryParams.currentSortOrder"
                            :md-sort-fn="customSort"
                        >
                            <div style="height: 250px; position: inherit; overflow:hidden;">
                                <slide-x-left-transition>
                                    <md-table-empty-state
                                        v-show="status === 'success'"
                                        sltyle="min-height: 250px;"
                                        :md-label="$t(`${$options.name}.nothingFoundTitle`)"
                                        :md-description="$t(`${$options.name}.nothingFoundDescription`, { query: queryParams.searchQuery })"
                                    >
                                        <md-button class="md-primary md-raised" @click="$patientAddForm.showPatientAddForm(true)">
                                            {{ $t(`${$options.name}.nothingFoundCreateNew`) }}
                                        </md-button>
                                    </md-table-empty-state>
                                </slide-x-left-transition>
                                <slide-x-left-transition>
                                    <md-table-empty-state
                                        v-show="status === 'loading'"
                                        sltyle="min-height: 250px;"
                                        :md-label="$t(`${$options.name}.loadingTitle`)"
                                        :md-description="$t(`${$options.name}.loadingDescription`)"
                                    >
                                        <md-progress-spinner :md-diameter="40" :md-stroke="4" md-mode="indeterminate" />
                                    </md-table-empty-state>
                                </slide-x-left-transition>
                                <slide-x-left-transition>
                                    <md-table-empty-state
                                        v-show="status === 'error'"
                                        sltyle="min-height: 250px;"
                                        :md-label="$t(`${$options.name}.loadingErrorTitle`)"
                                        :md-description="$t(`${$options.name}.loadingErrorDescription`)"
                                    >
                                        <md-button class="md-primary md-raised" @click="search">
                                            {{ $t(`${$options.name}.loadingErrorAction`) }}
                                        </md-button>
                                    </md-table-empty-state>
                                </slide-x-left-transition>
                            </div>

                            <md-table-row
                                slot="md-table-row"
                                slot-scope="{ item }"
                                :class="[{ 'just-added': item.justAdded }]"
                                :md-selectable="filterMode ? 'multiple' : 'single'"
                                md-auto-select
                            >
                                <md-table-cell
                                    v-for="field in patientsTableColumns"
                                    :key="field.key"
                                    :md-sort-by="field.key"
                                    :md-label="$t(`${$options.name}.${field.key}`)"
                                >
                                    <avatar-box
                                        class="avatarbox_name"
                                        v-if="field.key === 'name'"
                                        :avatar="item.avatar"
                                        :id="item.ID"
                                        :firstLine="item.lastName"
                                        :secondLine="item.firstName"
                                        :notificationClass="item.allergy ? 'warning' : ''"
                                        :notification="!lodash.isEmpty(item.allergy) ? 'A' : ''"
                                    />

                                    <avatar-box
                                        class="avatarbox_createdBy"
                                        v-else-if="field.key === 'createdBy' && item.createdBy"
                                        small
                                        :avatar="item.createdBy.avatar"
                                        :id="item.createdBy.ID"
                                        :firstLine="item.createdBy.firstName"
                                        :secondLine="item.createdBy.lastName"
                                    />
                                    <div v-else-if="field.key === 'allergy'" class="allergy_wrapper">
                                        <span v-for="(a, i) in item.allergy" :key="i" class="allergy">
                                            <span>
                                                {{ a }}
                                                <md-tooltip>
                                                    {{ $t(`${$options.name}.allergyToolTip`) }} <br />
                                                    {{ a }}!
                                                </md-tooltip>
                                            </span>
                                        </span>
                                    </div>

                                    <div v-else-if="field.key === 'files' && item[field.key]" class="md-layout md-alignment-left-center">
                                        <span class="md-layout-item">{{ item[field.key].length }}</span>
                                    </div>
                                    <div v-else-if="field.key === 'lastName' && item[field.key]" class="md-layout md-alignment-left-center">
                                        <span class="md-layout-item">{{ item.lastName | capitilize }}</span>
                                    </div>
                                    <div v-else-if="field.key === 'firstName' && item[field.key]" class="md-layout md-alignment-left-center">
                                        <span class="md-layout-item">{{ item.firstName | capitilize }}</span>
                                    </div>

                                    <span v-else-if="$moment(item[field.key], $moment.ISO_8601, true).isValid()">
                                        <small v-if="field.key === 'birthday'">
                                            {{ $tc(`${$options.name}.yearsOld`, getAge(item[field.key])) }}
                                            <br />
                                            <small :key="lang + 1">{{ item[field.key] | moment('calendar') }}</small>
                                        </small>

                                        <div v-else>
                                            <small :key="lang + 2">{{ item[field.key] | moment('from') }}</small>
                                            <br />
                                            <small :key="lang + 3">{{ item[field.key] | moment('calendar') }}</small>
                                        </div>
                                    </span>
                                    <span v-else-if="field.key === 'firstName' || field.key === 'lastName'">{{ item[field.key] | capitilize }}</span>

                                    <span v-else-if="field.key === 'phone'">
                                        <span>+{{ item[field.key] }}</span>
                                    </span>
                                    <div v-else-if="field.key === 'rating'">
                                        <star-rating v-model="item.rating" read-only :glow="5" :show-rating="false" :star-size="12" />
                                    </div>
                                    <div v-else-if="field.key === 'ID'">
                                        <span class="md-layout-item">
                                            <b>{{ item[field.key] }}</b>
                                        </span>
                                    </div>
                                    <div v-else>{{ item[field.key] }}</div>
                                </md-table-cell>
                            </md-table-row>
                        </md-table>
                    </div>
                    <t-table-editor
                        v-if="showForm"
                        icon="settings"
                        color="success"
                        :title="$t(`${$options.name}.editorTitle`)"
                        :available-table-columns="availablePatientsTableColumns"
                        :table-columns="patientsTableColumns"
                        :show-form.sync="showForm"
                        @selected="setColumns"
                    />
                </md-card-content>
                <md-card-actions md-alignment="space-between">
                    <div class>
                        <p class="card-category" v-if="from && to && patientsNum">
                            {{ $tc(`${$options.name}.paginationNumFrom`, patientsNum, { n: from }) }}
                            {{ $tc(`${$options.name}.paginationNumTo`, patientsNum, { n: to }) }}
                            {{ $tc(`${$options.name}.paginationItems`, patientsNum) }}
                        </p>
                    </div>
                    <pagination
                        v-model="queryParams.pagination.currentPage"
                        class="pagination-no-border pagination-success"
                        :per-page="queryParams.pagination.perPage"
                        :total="patientsNum"
                    />
                </md-card-actions>
            </md-card>
        </div>
        <md-snackbar :md-position="'center'" :md-duration="true ? Infinity : 4000" :md-active.sync="showSnackbar" md-persistent>
            <span>{{ selectedPatients.length }} Patients selected</span>
            <md-button class="md-primary" @click="showSnackbar = false">Retry</md-button>
        </md-snackbar>
    </div>
</template>

<script>
import { SlideXLeftTransition } from 'vue2-transitions';
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';
import { setTimeout } from 'timers';
import components from '@/components';
import { PATIENTS_REQUEST, USER_PATIENTS_COLUMNS } from '@/constants';
// import { tObjProp } from '@/mixins';

export default {
    name: 'PatientsList',
    components: {
        ...components,
        StarRating,
        SlideXLeftTransition
    },
    // mixins: [tObjProp],
    data: () => ({
        filterMode: false,
        searching: false,
        showForm: false,
        showSnackbar: false,
        perPageOptions: [5, 25, 50],
        tableData: [],
        selectedPatients: [],
        queryParams: {
            currentSort: 'created',
            currentSortOrder: 'desc',
            pagination: {
                perPage: 25,
                currentPage: 1
            },
            searchQuery: ''
        },
        selected: [],
        callbackLauncher: null
    }),
    computed: {
        ...mapGetters({
            patients: 'getPatients',
            patient: 'goToPatient',
            patientsNum: 'getPatientsNum',
            status: 'patientsStatus',
            lang: 'getLang',
            availablePatientsTableColumns: 'availablePatientsTableColumns'
        }),
        to() {
            let highBound = this.from + this.queryParams.pagination.perPage;
            if (this.patientsNum < highBound) {
                highBound = this.patientsNum;
            }
            return highBound;
        },
        from() {
            let num = this.queryParams.pagination.perPage * (this.queryParams.pagination.currentPage - 1) + 1;
            return num;
        }
    },
    watch: {
        queryParams: {
            handler() {
                this.search();
            },
            deep: true
        },
        selectedPatients(value) {
            if (!this.lodash.isEmpty(value) && this.filterMode) {
                this.showSnackbar = true;
            } else {
                this.showSnackbar = false;
            }
        }
    },
    created() {
        this.setPatientsTableColumns();
        if (this.patients && this.patients.length === 0) {
            this.search();
        } else {
            this.tableData = this.patients;
        }
    },
    methods: {
        getAge(value) {
            return this.$moment().diff(value, 'years');
        },
        switchFIlterMode() {
            this.selectedPatients = [];
        },
        onSelect(i) {
            if (i && i.ID) {
                this.goToPatient(i);
            }
        },
        setPatientsTableColumns() {
            const columns2 = JSON.parse(localStorage.getItem(USER_PATIENTS_COLUMNS));
            this.patientsTableColumns = columns2 || this.availablePatientsTableColumns;
        },
        goToPatient(patient) {
            const lang = this.$i18n.locale;
            if (patient) {
                this.$router.push({
                    name: 'Bio',
                    params: {
                        lang,
                        patientID: patient.ID
                    }
                });
            }
        },
        customSort(value) {
            return value;
        },
        getFieldName(key) {
            const field = this.availablePatientsTableColumns.find(f => f.key === key);
            if (field) {
                return field.title;
            }
            return '';
        },
        setColumns(e) {
            //! поменять после того как добавять соответствующие поля в беке
            localStorage.setItem(USER_PATIENTS_COLUMNS, JSON.stringify(e));
            this.setPatientsTableColumns();
        },
        handleShowAllergy(item) {
            console.log(item);
        },
        search() {
            const vm = this;
            const DELAY = 400;
            if (this.callbackLauncher) {
                clearTimeout(vm.callbackLauncher);
                this.searching = true;
            }
            this.callbackLauncher = setTimeout(() => {
                vm.$store
                    .dispatch(PATIENTS_REQUEST, {
                        params: {
                            perPage: vm.queryParams.pagination.perPage,
                            page: vm.queryParams.pagination.currentPage,
                            search: vm.queryParams.searchQuery,
                            order: vm.queryParams.currentSortOrder,
                            orderBy: vm.queryParams.currentSort,
                            toStore: true
                        }
                    })
                    .then(result => {
                        vm.tableData = result.patients || [];
                        vm.searching = false;
                        vm.removeClass();
                        return result;
                    })
                    .catch(() => {
                        vm.searching = false;
                        return [];
                    });
            }, DELAY);
        },

        removeClass() {
            setTimeout(() => {
                if (document.querySelector('.just-added')) {
                    this.patients.forEach((patient, index) => {
                        if (patient.justAdded) {
                            this.patients[index].justAdded = false;
                        }
                    });
                }
            }, 3000);
        }
    }
};
</script>

<style lang="scss">
.patients-list-wrapper {
    .no-after-no-before {
        &:after,
        &:before {
            display: none;
        }
    }
    .underline-progress {
        position: absolute;
        bottom: 28px;
        height: 2px;
        width: inherit;
        margin: 0;
    }
    .md-card .md-card-actions {
        border: 0;
        margin-left: 20px;
        margin-right: 20px;
    }
    .pointer {
        cursor: pointer;
    }
}
</style>
