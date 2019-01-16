<template>

  <md-card>
    <md-card-header class=" diagnose-list md-card-header-icon md-card-header-primary">
      <div class="card-icon">
        <md-icon>assignment</md-icon>
      </div>
      <h4 class="title">All Diagnosis</h4>
    </md-card-header>
    <md-card-content>
      {{currentSort}}

      {{currentSortOrder}}
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

        <md-table-row
          slot="md-table-row"
          slot-scope="{ item }"
        >
          <md-table-cell
            class="code"
            md-label="Code"
            md-sort-by="code"
          >{{ item.code }}</md-table-cell>
          <md-table-cell
            md-label="Diagnose"
            md-sort-by="title"
          >{{ item.title }}</md-table-cell>
          <md-table-cell md-label="Teeth">
            <md-chip
              v-for="toothId in Object.keys(item.teeth)"
              :key="toothId"
            >
              {{ getToothName(toothId).num}}
            </md-chip>
          </md-table-cell>
          <md-table-cell md-label="Diagnosed by">{{ item.author }}</md-table-cell>
          <md-table-cell
            class="date"
            md-label="Date"
          >{{ item.date }}</md-table-cell>
          <md-table-cell
            class="actions"
            md-label="Actions"
          >
            <md-button
              class="md-just-icon md-info md-simple"
              @click.native="handleLike(item)"
            >
              <md-icon>favorite</md-icon>
            </md-button>
            <md-button
              class="md-just-icon md-warning md-simple"
              @click.native="handleEdit(item)"
            >
              <md-icon>dvr</md-icon>
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
      <div class="footer-table md-table">
        <table>
          <tfoot>
            <tr>
              <th
                v-for="item in footerTable"
                :key="item"
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

</template>

<script>
  import { Pagination } from '@/components';
  import { mapGetters } from 'vuex';
  import Fuse from 'fuse.js';
  import swal from 'sweetalert2';

  export default {
    components: {
      Pagination,
    },
    props: {
      diagnosis: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        currentSort: 'code',
        currentSortOrder: 'asc',
        pagination: {
          perPage: 5,
          currentPage: 1,
          perPageOptions: [5, 10, 25, 50],
          total: 0,
        },
        footerTable: [
          'Code',
          'Diagnose',
          'Teeth',
          'Diagnosed by',
          'Date',
          'Actions',
        ],
        searchQuery: '',
        propsToSearch: ['code', 'diagnose', 'date', 'author'],
        // tableData: users,
        searchedData: [],
        fuseSearch: null,
      };
    },
    computed: {
      ...mapGetters({
        teethSystem: 'teethSystem',
        teethSchema: 'teethSchema',
        jaw: 'jaw',
        patient: 'getPatient',
      }),
      /** *
       * Returns a page from the searched data or the whole data.
       * Search is performed in the watch section below
       */
      diagnosisLocal() {
        return this.diagnosis;
      },
      patientDiagnosis() {
        return this.patient.diagnosis;
      },
      tableData() {
        return this.diagnosisLocal;
      },

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

    methods: {
      getToothName(toothId) {
        const tooth = {
          num: this.teethSchema[toothId][this.teethSystem],
          name: this.teethSchema[toothId].name,
        };
        return tooth;
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
          title: `You liked ${item.title}`,
          buttonsStyling: false,
          type: 'success',
          confirmButtonClass: 'md-button md-success',
        });
      },
      handleEdit(item) {
        swal({
          title: `You want to edit ${item.title}`,
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
              text: `You deleted ${item.title}`,
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
    mounted() {
      // Fuse search initialization.
      this.fuseSearch = new Fuse(this.tableData, {
        keys: ['diagnose', 'code', 'author'],
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
    },
  };
</script>

<style lang="css" scoped>
.diagnose-list{
.md-tabs-content table thead {
  display: table-header-group !important;
}
}
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
.code {
  width: 20px;
}
.actions,
.date {
  width: 50px;
}
.footer-table table > tfoot > tr > th:first-child {
  width: 20px;
}
.footer-table table > tfoot > tr > th:nth-last-child(-n + 2) {
  width: 40px;
}
</style>
