<template>
    <div class="md-layout patients-list-wrapper">
        <div class="md-layout-item">
            <md-card>
                <md-card-header
                    class="md-card-header-icon md-layout md-gutter md-card-header-green"
                >
                    <div class="card-icon">
                        <md-icon>assignment</md-icon>
                    </div>

                    <h4 class="title md-layout-item">
                        Patients List
                    </h4>
                </md-card-header>
                <md-card-content>
                    <md-toolbar class="md-transparent">
                        <div class="md-toolbar-section-start md-layout">
                            <h4 class="title md-layout-item">
                                Total Patients:
                                <animated-number :value="patientsNum" />
                            </h4>
                        </div>
                        <div class="md-toolbar-section-end md-layout ml-auto">
                            <md-button
                                class="md-just-icon md-simple"
                                @click="showForm=!showForm"
                            >
                                <md-icon>settings</md-icon>
                            </md-button>
                        </div>
                    </md-toolbar>
                    <md-toolbar class="md-transparent">
                        <div class="md-toolbar-section-start md-layout">
                            <div class="md-size-50 md-small-size-100">
                                <md-field>
                                    <label for="pages">Per page</label>
                                    <md-select
                                        v-model="queryParams.pagination.perPage"
                                        name="pages"
                                    >
                                        <md-option
                                            v-for="item in perPageOptions"
                                            :key="item"
                                            :label="item"
                                            :value="item"
                                        >
                                            {{ item }}
                                        </md-option>
                                    </md-select>
                                </md-field>
                            </div>
                        </div>
                        <div class="md-toolbar-section-end ml-auto">
                            <div style="width: 300px">
                                <md-field :class="{'no-after-no-before': searching}">
                                    <label>Search for patient</label>
                                    <md-input
                                        v-model="queryParams.searchQuery"
                                        type="search"
                                        class="mb-3"
                                    />
                                </md-field>
                                <md-progress-bar
                                    v-if="searching"
                                    class="underline-progress"
                                    :md-stroke="1"
                                    md-mode="indeterminate"
                                />
                            </div>
                        </div>
                    </md-toolbar>
                    <div class="table-wrapper">
                        <div
                            v-if="searching"
                            class="md-layout mx-auto table-wrapper-preloader"
                        >
                            <div style="height:60px;margin: auto;">
                                <md-progress-spinner md-mode="indeterminate" />
                            </div>
                        </div>
                        <md-table
                            v-model="tableData"
                            :md-selected-value.sync="selectedPatients"
                            :md-sort.sync="queryParams.currentSort"
                            :md-sort-order.sync="queryParams.currentSortOrder"
                            :md-sort-fn="customSort"
                            class="table-striped paginated-table table-hover"
                        >
                            <div style="height: 250px; position: inherit; overflow:hidden;">
                                <slide-x-left-transition>
                                    <md-table-empty-state
                                        v-show="status === 'success' "
                                        sltyle="min-height: 250px;"
                                        md-label="No patients found"
                                        :md-description="`No user found for this '${queryParams.searchQuery}' query.
                                    Try a different search term or create a new user.`"
                                    >
                                        <md-button
                                            class="md-primary md-raised"
                                            @click="$patientAddForm.showPatientAddForm(true);"
                                        >
                                            Create New User
                                        </md-button>
                                    </md-table-empty-state>
                                </slide-x-left-transition>
                                <slide-x-left-transition>
                                    <md-table-empty-state
                                        v-show="status === 'loading'"
                                        sltyle="min-height: 250px;"
                                        md-label="Loading..."
                                        :md-description="`Please be patient, just a few seconds...`"
                                    />
                                </slide-x-left-transition>
                                <slide-x-left-transition>
                                    <md-table-empty-state
                                        v-show="status === 'error' "
                                        sltyle="min-height: 250px;"
                                        md-label="Ooopps"
                                        :md-description="`Something wrong with connection`"
                                    >
                                        <md-button
                                            class="md-primary md-raised"
                                            @click="search"
                                        >
                                            retry
                                        </md-button>
                                    </md-table-empty-state>
                                </slide-x-left-transition>
                            </div>

                            <md-table-row
                                slot="md-table-row"
                                slot-scope="{ item }"
                                :class="[
                                    {'just-added': item.justAdded},
                                ]"
                                class="transitionable-row"
                                md-selectable="multiple"
                            >
                                <md-table-cell
                                    v-for="field in patientsTableColumns"
                                    :key="field.key"
                                    :md-sort-by="field.key"
                                    :md-label="getFieldName(field.key).toString()"
                                >
                                    <div
                                        class="pointer"
                                        @click="goToPatient(item)"
                                    >
                                        <div
                                            v-if="field.key === 'name'"
                                            class="md-layout md-alignment-center-left md-gutter patient-name"
                                        >
                                            <t-avatar
                                                :text-to-color="item.ID"
                                                :image-src="item.avatar"
                                                :title="item.firstName + ' ' + item.lastName"
                                                :notification="item.allergy && item.allergy.length ? 'A' : ''"
                                            />

                                            <span class="md-layout-item patient-name">
                                                <span>{{ item.lastName | capitilize }}</span>
                                                <br>
                                                <span>{{ item.firstName | capitilize }}</span>
                                            </span>
                                        </div>

                                        <div v-else-if="item[field.key] === null">
                                            1
                                        </div>
                                        <div
                                            v-else-if="(typeof item[field.key]) === 'array'"
                                            class="pointer"
                                            @click="goToPatient(item)"
                                        >
                                            111
                                            <div
                                                v-if="field.key === 'files' && item[field.key]"
                                                class="md-layout md-alignment-left-center"
                                            >
                                                <span
                                                    class="md-layout-item"
                                                >{{ item[field.key].length }}</span>
                                            </div>
                                        </div>

                                        <div v-else-if="(typeof item[field.key]) === 'object'">
                                            <div
                                                v-if="field.key === 'createdBy'"
                                                class="md-layout md-alignment-left-center"
                                            >
                                                <t-avatar
                                                    :small="true"
                                                    :plan-color="item[field.key].ID"
                                                    :image-src="item[field.key].avatar"
                                                    :title="item[field.key].firstName + ' ' + item[field.key].lastName"
                                                />
                                                <span class="md-layout-item">
                                                    <span>{{ item[field.key].lastName | capitilize }}</span>
                                                    <br>
                                                    <span>{{ item[field.key].firstName | capitilize }}</span>
                                                </span>
                                            </div>
                                            <div
                                                v-else-if="field.key === 'allergy'"
                                            >
                                                {{ item[field.key].join(', ') }}
                                            </div>
                                        </div>
                                        <div
                                            v-else-if="(typeof item[field.key]) === 'string' || field.key === 'avatar'"
                                            class="pointer"
                                            @click="goToPatient(item)"
                                        >
                                            <span
                                                v-if="$moment(item[field.key], $moment.ISO_8601, true).isValid()"
                                            >
                                                <small v-if="field.key==='birthday'">
                                                    {{ $moment().diff(item[field.key], 'years') }} years
                                                    <br>
                                                    <small>{{ item[field.key] | moment("calendar") }}</small>
                                                </small>

                                                <div v-else>
                                                    <small>{{ item[field.key] | moment("from") }}</small>
                                                    <br>
                                                    <small>{{ item[field.key] | moment("calendar") }}</small>
                                                </div>
                                            </span>
                                            <span
                                                v-else-if="field.key === 'firstName' || field.key === 'lastName'"
                                            >{{ item[field.key] | capitilize }}</span>
                                            <span v-else>{{ item[field.key] }}</span>
                                        </div>
                                        <div
                                            v-else-if="(typeof item[field.key]) === 'number'"
                                            class="pointer"
                                            @click="goToPatient(item)"
                                        >
                                            <span v-if="field.key === 'phone'">
                                                <span>+{{ item[field.key] }}</span>
                                            </span>
                                            <div v-else-if="field.key === 'rating'">
                                                <star-rating
                                                    v-model="item.rating"
                                                    read-only
                                                    :glow="5"
                                                    :show-rating="false"
                                                    :star-size="12"
                                                />
                                            </div>
                                            <div v-else>
                                                {{ item[field.key] }}
                                            </div>
                                        </div>
                                    </div>
                                </md-table-cell>

                                <md-table-cell
                                    md-label="Actions"
                                    class="text-right"
                                >
                                    <md-button
                                        v-show="item.allergy && item.allergy.length > 0"
                                        class="md-just-icon md-danger md-simple"
                                        @click.native="handleShowAllergy(item)"
                                    >
                                        <md-icon>report_problem</md-icon>
                                    </md-button>
                                    <md-button
                                        class="md-just-icon md-info md-simple"
                                        :to="{ name: 'Treatment', params :{ lang: $i18n.locale, patientID : item.ID}}"
                                    >
                                        <md-icon>open_in_new</md-icon>
                                    </md-button>
                                    <md-button class="md-just-icon md-warning md-simple">
                                        <md-icon>more_vert</md-icon>
                                    </md-button>
                                </md-table-cell>
                            </md-table-row>
                        </md-table>
                        <div class="footer-table md-table">
                            <table>
                                <tfoot>
                                    <tr>
                                        <th class="md-table-head">
                                            <div
                                                class="md-table-head-container md-ripple md-disabled"
                                            >
                                                <div class="md-table-head-label">
                                                    Select
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            v-for="item in patientsTableColumns"
                                            :key="item.key"
                                            class="md-table-head"
                                        >
                                            <div
                                                class="md-table-head-container md-ripple md-disabled"
                                            >
                                                <div class="md-table-head-label">
                                                    {{ item.title }}
                                                </div>
                                            </div>
                                        </th>
                                        <th class="md-table-head">
                                            <div
                                                class="md-table-head-container md-ripple md-disabled"
                                            >
                                                <div class="md-table-head-label">
                                                    Actions
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <t-table-editor
                        icon="settings"
                        color="success"
                        title="Set patients columns order"
                        :available-table-columns="availablePatientsTableColumns"
                        :table-columns="patientsTableColumns"
                        :show-form.sync="showForm"
                        @selected="setColumns"
                    />
                </md-card-content>
                <md-card-actions md-alignment="space-between">
                    <div class>
                        <p class="card-category">
                            Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
                        </p>
                    </div>
                    <pagination
                        v-model="queryParams.pagination.currentPage"
                        class="pagination-no-border pagination-success"
                        :per-page="queryParams.pagination.perPage"
                        :total="totalPages"
                    />
                </md-card-actions>
            </md-card>
        </div>
        <md-snackbar
            v-if="selectedPatients"
            :md-position="'center'"
            :md-duration="true ? Infinity : 4000"
            :md-active.sync="showSnackbar"
            md-persistent
        >
            <span>{{ selectedPatients.length }} Patients selected</span>
            <md-button
                class="md-primary"
                @click="showSnackbar = false"
            >
                Retry
            </md-button>
        </md-snackbar>
    </div>
</template>

<script>
import { SlideXLeftTransition } from 'vue2-transitions';
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';
import { setTimeout } from 'timers';
import components from '@/components';
import {
    PATIENTS_REQUEST,
    USER_PATIENTS_COLUMNS,
    PATIENT_GET,
    NOTIFY,
} from '@/constants';
import { tObjProp } from '@/mixins';

export default {
    name: 'PatientsList',
    components: {
        ...components,
        StarRating,
        SlideXLeftTransition,
    },
    mixins: [tObjProp],
    data: () => ({
        searching: false,
        showForm: false,
        showSnackbar: false,
        perPageOptions: [25, 50],
        tableData: [],
        selectedPatients: [],
        total: 0,
        queryParams: {
            currentSort: 'created',
            currentSortOrder: 'desc',
            pagination: {
                perPage: 25,
                currentPage: 1,
            },
            searchQuery: '',
        },
        selected: [],
        callbackLauncher: null,
    }),
    computed: {
        ...mapGetters({
            patients: 'getPatients',
            patient: 'goToPatient',
            patientsNum: 'getPatientsNum',
            status: 'patientsStatus',
            availablePatientsTableColumns: 'availablePatientsTableColumns',
        }),
        to() {
            let highBound = this.from + this.queryParams.pagination.perPage;
            if (this.total < highBound) {
                highBound = this.total;
            }
            return highBound;
        },
        from() {
            return (
                this.queryParams.pagination.perPage
                    * (this.queryParams.pagination.currentPage - 1)
            );
        },
        totalPages() {
            return Math.ceil(this.total / this.queryParams.pagination.perPage);
        },
    },
    watch: {
        queryParams: {
            handler() {
                this.search();
            },
            deep: true,
        },
        selectedPatients() {
            this.showSnackbar = true;
        },
    },
    created() {
        this.setPatientsTableColumns();
        if (this.patients && this.patients.length === 0) {
            this.search();
        } else {
            this.tableData = this.patients;
            this.total = Math.ceil(
                this.patientsNum / this.queryParams.pagination.perPage,
            );
        }
    },
    methods: {
        setPatientsTableColumns() {
            const columns1 = [
                {
                    key: 'ID',
                    title: 'ID',
                },
                {
                    key: 'name',
                    title: 'Name',
                },
                {
                    key: 'address',
                    title: 'Address',
                },
                {
                    key: 'allergy',
                    title: 'Allergy',
                },
                {
                    key: 'birthday',
                    title: 'Birthday',
                },
                {
                    key: 'created',
                    title: 'Created',
                },
                {
                    key: 'createdBy',
                    title: 'Created By',
                },
            ];
            const columns2 = JSON.parse(
                localStorage.getItem(USER_PATIENTS_COLUMNS),
            );
            this.patientsTableColumns = columns2 || columns1;
        },
        goToPatient(patient) {
            const lang = this.$i18n.locale;
            if (patient) {
                this.$router.push({
                    name: 'Bio',
                    params: {
                        lang,
                        patientID: patient.ID,
                    },
                });
            }
        },
        customSort(value) {
            return value;
        },
        getFieldName(key) {
            const field = this.availablePatientsTableColumns.find(
                f => f.key === key,
            );
            if (field) {
                return field.title;
            }
            return '';
        },
        setColumns(e) {
            // поменять после того как добавять соответствующие поля в беке
            localStorage.setItem(USER_PATIENTS_COLUMNS, JSON.stringify(e));
            this.setPatientsTableColumns();
            //  this.$store.dispatch(USER_UPDATE, {
            //   user: {
            //    columns: e,
            //   },
            // });
        },
        handleLike(item) {
            // swal({
            //     title: `You liked ${item.name}`,
            //     buttonsStyling: false,
            //     type: 'success',
            //     confirmButtonClass: 'md-button md-success',
            // });
        },
        handleShowAllergy(item) {
            // swal({
            //     title: 'Attention!',
            //     buttonsStyling: false,
            //     html: ` ${item.firstName} ${
            //         item.lastName
            //     } has allergy! Please dont use: <h3> ${item.allergy.join(
            //         ', ',
            //     )} </h3>`,
            //     type: 'warning',
            //     confirmButtonClass: 'md-button md-success',
            //     confirmButtonText: 'OK, I will not use them!',
            // });
        },
        handleEdit(item) {
            // swal({
            //     title: `You want to edit ${item.name}`,
            //     buttonsStyling: false,
            //     confirmButtonClass: 'md-button md-info',
            // });
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
            //             text: `You deleted ${item.name}`,
            //             type: 'success',
            //             confirmButtonClass: 'md-button md-success btn-fill',
            //             buttonsStyling: false,
            //         });
            //     }
            // });
        },
        deleteRow(item) {
            const indexToDelete = this.tableData.findIndex(
                tableRow => tableRow.id === item.id,
            );
            if (indexToDelete >= 0) {
                this.tableData.splice(indexToDelete, 1);
            }
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
                            toStore: true,
                        },
                    })
                    .then((result) => {
                        vm.tableData = result.patients || [];
                        vm.searching = false;
                        vm.total = Math.ceil(
                            result.patientsNum
                                    / vm.queryParams.pagination.perPage,
                        );
                        vm.removeClass();
                        return result;
                    })
                    .catch((err) => {
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
        },
    },
};
</script>

<style lang="scss" >
.patients-list-wrapper {
    .no-after-no-before {
        &:after,
        &:before {
            display: none;
        }
    }
    .underline-progress {
        position: absolute;
        bottom: 10px;
        height: 2px;
        width: inherit;
        margin: 0;
    }
    // .table-wrapper {
    //     position: inherit;
    //     .patient-name {
    //         // max-width: 90%;
    //         text-overflow: ellipsis;
    //         overflow: hidden;
    //     }
    //     .patient-name {
    //         text-overflow: ellipsis;
    //         width: fit-content;
    //     }
    //     .md-tabs-content .with-header table thead {
    //         display: contents;
    //     }
    //     .paginated-table table > tbody > tr > td {
    //         width: fit-content;
    //     }
    //     table > thead > tr > th.md-table-head.md-table-cell-selection {
    //         .md-table-head-label {
    //             width: 30px;
    //             margin-left: 23px;
    //         }
    //     }
    //     .table-settings {
    //         position: absolute;
    //         margin-top: 15px;
    //     }
    //     .table-wrapper-preloader {
    //         position: absolute;
    //         z-index: 30;
    //         top: 0;
    //         left: 0;
    //         right: 0;
    //         bottom: 0;
    //         background-color: white;
    //         opacity: 0.8;
    //     }
    // }
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
