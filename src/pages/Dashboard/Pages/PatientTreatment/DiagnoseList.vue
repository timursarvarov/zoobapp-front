<template>
  <div
    class="md-layout md-gutter"
    v-if="!isEmpty(originalDiagnosis)"
  >
    <div class="md-layout-item">
      <md-toolbar class="md-transparent">
        <h3 class="md-title">All Diagnosis</h3>
      </md-toolbar>

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
              placeholder="Search patient diagnose"
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
          <md-table-cell
            md-sort-by="teeth"
            md-label="Teeth"
          >
            <span
              v-for="toothId in Object.keys(item.teeth)"
              :key="toothId"
            >
              {{ getToothName(toothId).num}},
            </span>
          </md-table-cell>
          <md-table-cell
            md-sort-by="author"
            md-label="Diagnosed by"
          >{{ item.author }}</md-table-cell>
          <md-table-cell
            md-sort-by="date"
            class="date"
            md-label="Date"
          >
            <span><br />{{ item.date | moment("from") }}</span><br />
            <small>{{item.date | moment("calendar")}}</small>
          </md-table-cell>
          <md-table-cell
            class="actions"
            md-label="Actions"
          >
            <md-button
              v-show="ifDiagnoseHasLocations(item.teeth)"
              class="md-just-icon md-simple"
              @click.native="showHidePatientDiagnose(item)"
            >
              <md-icon v-show="isHidedDiagnose(item)">visibility</md-icon>
              <md-icon v-show="!isHidedDiagnose(item)">visibility_off</md-icon>
            </md-button>
            <md-button
              class="md-just-icon md-info md-simple"
              @click.native="handleEdit(item)"
            >
              <md-icon>edit</md-icon>
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
      <div
        class="md-layout"
        md-alignment="space-between"
      >
        <div class="md-layout-item">
          <p class="card-category">Showing {{from + 1}} to {{to}} of {{total}} entries</p>
        </div>
        <pagination
          class=" mb-3 pagination-no-border pagination-success"
          v-model="pagination.currentPage"
          :per-page="pagination.perPage"
          :total="total"
        >
        </pagination>
      </div>
    </div>
  </div>

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
        originalDiagnosis: [],
        currentSort: 'date',
        currentSortOrder: 'desc',
        pagination: {
          perPage: 10,
          currentPage: 1,
          perPageOptions: [10, 25, 50],
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
        propsToSearch: ['code', 'diagnose', 'date', 'author', 'title'],
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
      tableData() {
        return this.originalDiagnosis;
      },
      patientDiagnosis() {
        return this.patient.diagnosis;
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
      isEmpty(obj) {
        // eslint-disable-next-line
      for (const key in obj) {
          // eslint-disable-next-line
        if (obj.hasOwnProperty(key)) return false;
        }
        return true;
      },
      isHidedDiagnose(diagnose) {
        const OindexToDelete = this.tableData.findIndex(
          tableRow => tableRow.id === diagnose.id,
        );
        const PindexToDelete = this.patientDiagnosis.findIndex(
          pDiagnose => pDiagnose.id === diagnose.id,
        );
        return OindexToDelete !== -1 && PindexToDelete !== -1;
      },
      showHidePatientDiagnose(diagnose) {
        console.log(this.originalDiagnosis);
        const indexToDelete = this.patientDiagnosis.findIndex(
          pDiagnose => pDiagnose.id === diagnose.id,
        );
        if (indexToDelete >= 0) {
          this.patientDiagnosis.splice(indexToDelete, 1);
        } else {
          const indexToAdd = this.originalDiagnosis.findIndex(
            oDiagnose => oDiagnose.id === diagnose.id,
          );
          this.patientDiagnosis.push(this.originalDiagnosis[indexToAdd]);
        }
      },
      copyObj(obj) {
        return JSON.parse(JSON.stringify(obj));
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
          // console.log("ab+")
          // console.log(typeof a);
          // console.log("b")
          // console.log(b)
          const sortBy = thisLocal.currentSort;
          if (typeof a[thisLocal.currentSort] === 'string') {
            if (thisLocal.currentSortOrder === 'desc') {
              return a[sortBy].localeCompare(b[sortBy]);
            }

            return b[sortBy].localeCompare(a[sortBy]);
          }
          if (typeof a[thisLocal.currentSort] === 'number') {
            const orderLocal = thisLocal.currentSortOrder;
            const dflt =            orderLocal == 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
            const aVal = a[sortBy] == null ? dflt : a[sortBy];
            const bVal = b[sortBy] == null ? dflt : b[sortBy];
            return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
          }
          if (typeof a[thisLocal.currentSort] === 'object') {
            const orderLocal = thisLocal.currentSortOrder;
            const dflt =            orderLocal == 'asc' ? Number.MAX_VALUE : -Number.MAX_VALUE;
            const aVal = a[sortBy] == null ? dflt : a[sortBy];
            const bVal = b[sortBy] == null ? dflt : b[sortBy];
            return orderLocal === 'asc' ? aVal - bVal : bVal - aVal;
          }
        });
        return val;
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
        const indexToDeleteOrigin = this.patientDiagnosis.findIndex(
          diagnose => diagnose.id === item.id,
        );
        if (indexToDeleteOrigin >= 0) {
          this.patientDiagnosis.splice(indexToDeleteOrigin, 1);
        }
      },
    },
    mounted() {
      // Fuse search initialization.
      this.fuseSearch = new Fuse(this.tableData, {
        keys: ['diagnose', 'code', 'author', 'date', 'title'],
        threshold: 0.3,
      });
      this.originalDiagnosis = this.copyObj(this.patientDiagnosis);
    },
    watch: {
      searchQuery(value) {
        let result = this.tableData;
        if (value !== '') {
          result = this.fuseSearch.search(this.searchQuery);
        }
        this.searchedData = result;
      },
      patientDiagnosis() {
        if (
          Object.keys(this.patientDiagnosis).length
        >= Object.keys(this.originalDiagnosis).length
        ) {
          this.originalDiagnosis = this.copyObj(this.patientDiagnosis);
        }
      },
    },
  };
</script>

<style lang="scss" >
.md-tabs-content table thead {
  display: table-header-group !important;
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
.paginated-table table > tbody > tr > td {
  width: auto;
}
.footer-table table > tfoot > tr > th:first-child {
  width: 20px;
}
.footer-table table > tfoot > tr > th:nth-last-child(-n + 2) {
  width: 40px;
}
</style>
