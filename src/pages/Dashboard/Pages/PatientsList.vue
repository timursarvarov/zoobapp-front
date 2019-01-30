<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">Paginated Tables</h4>
        </md-card-header>
        <md-card-content>
          <md-table
            :value="queriedData"
            :md-sort.sync="currentSort"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="customSort"
            class="paginated-table table-striped table-hover"
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

              <md-field>
                <md-input
                  type="search"
                  class="mb-3"
                  clearable
                  style="width: 200px"
                  placeholder="Search records"
                  v-model="searchQuery"
                >
                </md-input>
              </md-field>
            </md-table-toolbar>

            <md-table-empty-state
              v-if="status === 'success' "
              md-label="No patients found"
              :md-description="`No user found for this '${searchQuery}' query.
                Try a different search term or create a new user.`"
            >
              <md-button class="md-primary md-raised">Create New User</md-button>
            </md-table-empty-state>

            <md-table-empty-state
              v-else
              md-label="Waiting for patients to load"
              :md-description="`Please be patient, just a few seconds...`"
            >
            </md-table-empty-state>

            <md-table-row
              slot="md-table-row"
              slot-scope="{ item }"
              md-selectable="multiple"
            >
              <md-table-cell
                md-label="Avatar"
                md-sort-by="avatar"
              >
                <md-avatar v-if="item.avatar">
                  <img
                    :src="item.avatar"
                    alt="People"
                  >
                </md-avatar>
                <md-avatar
                  v-else
                  class="md-avatar-icon"
                  :style="{background: 'black'}"
                >
                  {{item.firstName[0]}}{{item.lastName[0]}}
                </md-avatar>
              </md-table-cell>
              <md-table-cell
                md-label="Name"
                md-sort-by="name"
              >{{ item.firstName }}</md-table-cell>
              <md-table-cell
                md-label="Last Name"
                md-sort-by="lastName"
              >{{ item.lastName }}</md-table-cell>
              <md-table-cell
                md-label="Email"
                md-sort-by="email"
              >{{ item.email }}</md-table-cell>
              <md-table-cell md-label="Phone">{{ item.phone }}</md-table-cell>
              <md-table-cell
                md-label="Source"
                md-sort-by="source"
              >{{ item.source }}</md-table-cell>

              <md-table-cell
                md-label="Raiting"
                md-sort-by="raiting"
              >{{ item.raiting }}
                <star-rating
                  read-only
                  :glow="5"
                  :show-rating="false"
                  :star-size="12"
                  v-model="item.rating"
                ></star-rating>
              </md-table-cell>

              <md-table-cell md-label="Actions">

                <md-button
                  v-show="item.allergy"
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
                  <md-icon>dvr</md-icon>
                </md-button>
                <!-- <md-button
                  class="md-just-icon md-danger md-simple"
                  @click.native="handleDelete(item)"
                >
                  <md-icon>close</md-icon>
                </md-button> -->
              </md-table-cell>
            </md-table-row>
          </md-table>
          <div class="footer-table md-table">
            <table>
              <tfoot>
                <tr>
                  <th
                    v-for="item in footerTable"
                    :key="item.name"
                    class="md-table-head"
                  >
                    <div class="md-table-head-container md-ripple md-disabled">
                      <div class="md-table-head-label">
                        {{item}}
                      </div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <div class="">
            <p class="card-category">Showing {{from + 1}} to {{to}} of {{total}} entries</p>
          </div>
          <pagination
            class="pagination-no-border pagination-success"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
          >

          </pagination>
        </md-card-actions>
      </md-card>
    </div>
  </div>

</template>

<script>
  import { Pagination } from '@/components';
  import StarRating from 'vue-star-rating';
  // import patients from './patients';
  import Fuse from 'fuse.js';
  import swal from 'sweetalert2';
  import { mapGetters } from 'vuex';
  import { PATIENTS_REQUEST, AUTH_LOGOUT } from '@/store/modules/constants';

  export default {
    components: {
      Pagination,
      StarRating,
    },
    computed: {
      ...mapGetters({
        patients: 'getPatients',
        status: 'patientsStatus',
      }),
      /** *
       * Returns a page from the searched data or the whole data.
       * Search is performed in the watch section below
       */
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
    },
    data() {
      return {
        currentSort: 'name',
        currentSortOrder: 'asc',
        pagination: {
          perPage: 25,
          currentPage: 1,
          perPageOptions: [25, 50],
          total: 0,
        },
        footerTable: ['Name', 'Email', 'Age', 'Salary', 'Actions'],
        searchQuery: '',
        propsToSearch: ['name', 'email', 'age'],
        tableData: [],
        searchedData: [],
        fuseSearch: null,
      };
    },
    methods: {
      isEmpty(obj) {
        // eslint-disable-next-line
      for (const key in obj) {
          // eslint-disable-next-line
        if (obj.hasOwnProperty(key)) return false;
        }
        return true;
      },
      openPatientProfile() {
        this.$store.dispatch(AUTH_LOGOUT, { params: '' });
      },
      customSort(value) {
        return value.sort((a, b) => {
          const sortBy = this.currentSort;
          if (this.currentSortOrder === 'desc') {
            return a[sortBy].localeCompare(b[sortBy]);
          }
          return b[sortBy].localeCompare(a[sortBy]);
        });
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
    },
    created() {
      if (this.isEmpty(this.patients)) {
        this.$store.dispatch(PATIENTS_REQUEST, { params: '' });
      } else {
        this.tableData = this.patients;
      }
    },
    mounted() {
      // Fuse search initialization.
      if (!this.tableData && !this.isEmpty(this.patients)) {
        this.tableData = this.patients;
      }
      this.fuseSearch = new Fuse(this.tableData, {
        keys: ['name', 'email'],
        threshold: 0.3,
      });
    },
    watch: {
      /**
       * Searches through the table data by a given query.
       * NOTE: If you have a lot of data, it's recommended to do
       * the search on the Server Side and only display the results here.
       * @param value of the query
       */
      searchQuery(value) {
        let result = this.tableData;
        if (value !== '') {
          result = this.fuseSearch.search(this.searchQuery);
        }
        this.searchedData = result;
      },
      patients() {
        this.tableData = this.patients;
      },
    },
  };
</script>

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
