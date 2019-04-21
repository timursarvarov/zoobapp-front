
<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-layout md-gutter md-card-header-green">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>

          <h4 class="title md-layout-item">Paginated Tables</h4>

          <div class="md-layout-item md-layout md-gutter md-alignment-bottom-right">
            <div class="table-settings md-layout-item md-layout md-gutter md-alignment-bottom-right">
              <md-button
                @click="showForm=!showForm"
                class="md-just-icon md-simple"
              >
                <md-icon>settings</md-icon>
              </md-button>
            </div>
          </div>
        </md-card-header>
        <md-card-content>
          <md-table
            @md-selected="onSelect"
            :value="patients"
            :md-sort-fn="customSort"
            :md-sort.sync="queryParams.currentSort"
            :md-sort-order.sync="queryParams.currentSortOrder"
            class="paginated-table table-striped table-hover"
          >
            <md-table-toolbar>
              <div class="md-toolbar-row">
                <div class="md-toolbar-section-end"></div>
              </div>

              <div class="md-toolbar-row">
                <div class="md-toolbar-section-start">
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
                      >{{ item }}</md-option>
                    </md-select>
                  </md-field>
                </div>
                <div class="md-toolbar-section-end">
                  <md-field>
                    <md-input
                      type="search"
                      class="mb-3"
                      clearable
                      style="width: 200px"
                      placeholder="Search records"
                      v-model="queryParams.searchQuery"
                    ></md-input>
                  </md-field>
                </div>
              </div>
            </md-table-toolbar>

            <md-table-empty-state
              v-if="status === 'success' "
              md-label="No patients found"
              :md-description="`No user found for this '${queryParams.searchQuery}' query.
                Try a different search term or create a new user.`"
            >
              <md-button class="md-primary md-raised">Create New User</md-button>
            </md-table-empty-state>

            <md-table-empty-state
              v-else
              md-label="Waiting for patients to load"
              :md-description="`Please be patient, just a few seconds...`"
            ></md-table-empty-state>

            <md-table-row
              slot="md-table-row"
              slot-scope="{ item }"
              md-selectable="multiple"
            >
              <md-table-cell
                v-for="field  in patientsTableColumns"
                :key="field.key"
                :md-sort-by=" item[field.key] ? item[field.key].toString() : ''"
                :md-label="getFieldName(field.key).toString()"
              >
                <div v-if="field.key === 'avatar'">
                  <t-avatar
                    :color="item.color"
                    :imageSrc="item.avatar"
                    :title="item.firstName + ' ' + item.lastName"
                  />
                </div>

                <div v-else-if="item[field.key] === null"></div>
                <div v-else-if="(typeof item[field.key]) === 'array'">
                  111
                  <div
                    v-if="field.key === 'files'"
                    class="md-layout md-alignment-left-center"
                  >
                    <span class="md-layout-item">{{item[field.key].length }}</span>
                  </div>
                </div>

                <div v-else-if="(typeof item[field.key]) === 'object'">
                  <div
                    v-if="field.key === 'createdBy'"
                    class="md-layout md-alignment-left-center"
                  >
                    <div
                      class="md-layout-item md-layout"
                      style="max-width:35px;"
                    >
                      <t-avatar
                        :small="true"
                        :color="item[field.key].color"
                        :imageSrc="item[field.key].avatar"
                        :title="item[field.key].firstName + ' ' + item[field.key].lastName"
                      />
                    </div>
                    <span class="md-layout-item">
                      <span>{{item[field.key].lastName | capitilize}}</span>
                      <br>
                      <span>{{item[field.key].firstName | capitilize}}</span>
                    </span>
                  </div>
                  <div v-else-if="field.key === 'allergy'">{{item[field.key].join(', ') }}</div>
                </div>
                <div v-else-if="(typeof item[field.key]) === 'string' || field.key === 'avatar'">
                  <span v-if="$moment(item[field.key], $moment.ISO_8601, true).isValid()">
                    <span v-if="field.key==='birthday'">{{ $moment().diff(item[field.key], 'years') }} years</span>
                    <div v-else>
                      <span>{{ item[field.key] | moment("from") }}</span>
                      <br>
                      <small>{{ item[field.key] | moment("calendar")}}</small>
                    </div>
                  </span>
                  <span v-else-if="field.key === 'firstName' || field.key === 'lastName'">{{item[field.key] | capitilize}}</span>
                  <span v-else>{{item[field.key]}}</span>
                </div>
                <div v-else-if="(typeof item[field.key]) === 'number'">
                  <span v-if="field.key === 'phone'">
                    <span>+{{ item[field.key]}}</span>
                  </span>
                  <div v-else-if="field.key === 'rating'">
                    <star-rating
                      read-only
                      :glow="5"
                      :show-rating="false"
                      :star-size="12"
                      v-model="item.rating"
                    ></star-rating>
                  </div>
                  <div v-else>{{item[field.key]}}</div>
                </div>
              </md-table-cell>

              <md-table-cell md-label="Actions">
                <md-button
                  v-show="item.allergy && item.allergy.length > 0"
                  class="md-just-icon md-danger md-simple"
                  @click.native="handleShowAllergy(item)"
                >
                  <md-icon>report_problem</md-icon>
                </md-button>
                <md-button
                  class="md-just-icon md-info md-simple"
                  :to="{ name: 'Diagnose', params :{patientId : item.ID}}"
                >
                  <md-icon>open_in_new</md-icon>
                </md-button>
                <md-button
                  class="md-just-icon md-warning md-simple"
                  @click.native="openPatientProfile(item)"
                >
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
                    <div class="md-table-head-container md-ripple md-disabled">
                      <div class="md-table-head-label">Select</div>
                    </div>
                  </th>
                  <th
                    v-for="item in patientsTableColumns"
                    :key="item.key"
                    class="md-table-head"
                  >
                    <div class="md-table-head-container md-ripple md-disabled">
                      <div class="md-table-head-label">{{item.title}}</div>
                    </div>
                  </th>
                  <th class="md-table-head">
                    <div class="md-table-head-container md-ripple md-disabled">
                      <div class="md-table-head-label">Actions</div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
          <t-table-editor
            icon="settings"
            color="success"
            title="Set patients table columns order"
            :availableTableColumns="availablePatientsTableColumns"
            :tableColumns="patientsTableColumns"
            :showForm.sync="showForm"
            @selected="setColumns"
          ></t-table-editor>
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <div class>
            <p class="card-category">Showing {{from + 1}} to {{to}} of {{totalPages}} entries</p>
          </div>
          <pagination
            class="pagination-no-border pagination-success"
            v-model="queryParams.pagination.currentPage"
            :per-page="queryParams.pagination.perPage"
            :total="totalPages"
          />
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
    import { Pagination, TTableEditor, TAvatar } from '@/components';
    import {  } from '@/pages';
    import StarRating from 'vue-star-rating';
    import swal from 'sweetalert2';
    import { mapGetters } from 'vuex';
    import {
      PATIENTS_REQUEST,
      AUTH_LOGOUT,
      PATIENTS_LIST_COLUMNS,
    } from '@/constants';
    import { tObjProp } from '@/mixins';

    export default {
      name: 'patients-list',
      mixins: [tObjProp],
      components: {
        Pagination,
        StarRating,
        TTableEditor,
        TAvatar,
      },
      data: () => ({
        showForm: false,
        perPageOptions: [25, 50],
        totalPages: 500,
        queryParams: {
          currentSort: 'updated',
          currentSortOrder: 'asc',
          pagination: {
            perPage: 25,
            currentPage: 1,
          },
          searchQuery: '',
        },
        selected: [],
        callbackLauncher: null,
      }),
      methods: {
        // ...mapFilters(["capitilize"]),
        getFieldName(key) {
          const field = this.availablePatientsTableColumns.find(f => f.key === key);
          if (field) {
            return field.title;
          }
          return '';
        },
        onSelect(items) {
          if (this.selectedAllSearchedPatients) {
            this.selectedAllSearchedPatients = false;
          }
          this.selected = items;
        },
        setColumns(e) {
          // поменять после того как добавять соответствующие поля в беке
          localStorage.setItem('USER_PARIENTS_COLUMS', JSON.stringify(e));
          //  this.$store.dispatch(USER_UPDATE, {
          //   user: {
          //    columns: e,
          //   },
          // });
        },
        openPatientProfile() {
          this.$store.dispatch(AUTH_LOGOUT, { params: '' });
        },
        customSort(value) {
          console.log(value);
          console.log(this.queryParams.currentSort);
          console.log(this.queryParams.currentSortOrder);
        },
        handleLike(item) {
          swal({
            title: `You liked ${item.name}`,
            buttonsStyling: false,
            type: 'success',
            confirmButtonClass: 'md-button md-success',
          });
        },
        handleShowAllergy(item) {
          swal({
            title: 'Attention!',
            buttonsStyling: false,
            html: ` ${item.firstName} ${
              item.lastName
            } has allergy! Please dont use: <h3> ${item.allergy.join(', ')} </h3>`,
            type: 'warning',
            confirmButtonClass: 'md-button md-success',
            confirmButtonText: 'OK, I will not use them!',
          });
        },
        handleEdit(item) {
          swal({
            title: `You want to edit ${item.name}`,
            buttonsStyling: false,
            confirmButtonClass: 'md-button md-info',
          });
        },
        handleDelete(item) {
          swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'md-button md-success btn-fill',
            cancelButtonClass: 'md-button md-danger btn-fill',
            confirmButtonText: 'Yes, delete it!',
            buttonsStyling: false,
          }).then((result) => {
            if (result.value) {
              this.deleteRow(item);
              swal({
                title: 'Deleted!',
                text: `You deleted ${item.name}`,
                type: 'success',
                confirmButtonClass: 'md-button md-success btn-fill',
                buttonsStyling: false,
              });
            }
          });
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
              .then((resp) => { })
              .catch((err) => { });
          }, DELAY);
        },
      },
      created() {
        if (this.patients.length === 0) {
          this.search();
        } else {
          this.tableData = this.patients;
        }
      },
      computed: {
        ...mapGetters({
          patients: 'getPatients',
          status: 'patientsStatus',
          availablePatientsTableColumns: 'availablePatientsTableColumns',
        }),
        patientsTableColumns() {
          const columns1 = [
            {
              key: 'ID',
              title: 'ID',
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
              key: 'avatar',
              title: 'Avatar',
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
          const columns2 = JSON.parse(localStorage.getItem('USER_PARIENTS_COLUMS'));
          return columns2 || columns1;
        },
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
      },
      watch: {
        queryParams: {
          handler() {
            this.search();
          },
          deep: true,
        },
        patients() {
          this.tableData = this.patients;
        },
      },
    };
</script>

<style lang="scss" scoped>
.table-settings {
  position: absolute;
  margin-top: 15px;
}
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
