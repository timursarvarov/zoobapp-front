<template>
  <div
    class="md-layout md-gutter files-list"
    v-if="!isEmpty(queriedData)"
  >
    <div class="md-layout-item">
      <md-toolbar v-if="patient.files" class="md-transparent">
        <h3 class="md-title"> Total {{patient.files.length}} files ({{totalFiles|formatBytes}})</h3>
      </md-toolbar>
      <md-table
         v-viewer="options"
        :value="queriedData"
        :md-sort.sync="currentSort"
        :md-sort-order.sync="currentSortOrder"
        :md-sort-fn="customSort"
        class="paginated-table table-striped images table-hover"
      >
        <md-table-toolbar>
          <md-field>
            <label for="pages">Per page {{total}} </label>
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
          <md-table-cell md-label="">
            <div class="imgcontainer">
              <t-file-preview
              @show="show"
              :width="90"
              :iconSize="1"
              :height="60"
              :url="item.url"
              :mimeType="item.mimeType"
              :showOverlay="true"
              overlayIcon="visibility"
              />
            </div>
          </md-table-cell>
          <md-table-cell
            md-label="Name"
            md-sort-by="name"
          >{{ item.name }}</md-table-cell>
          <md-table-cell
            md-label="Created"
            md-sort-by="created"
          >
            <span>{{ item.created | moment("from") }}</span><br />
            <small>{{ item.created | moment("calendar")}}</small>
          </md-table-cell>
          <md-table-cell
            md-label="Updated"
            md-sort-by="updated"
          >
            <span>{{ item.updated | moment("from") }}</span><br />
            <small>{{ item.updated | moment("calendar")}}</small>
          </md-table-cell>
          <md-table-cell
            md-label="File Type"
            md-sort-by="fileType"
          >
    {{item.mimeType}}

          </md-table-cell>
          <md-table-cell
            md-label="File Size"
            md-sort-by="fileSize"
          >
            {{item.size | formatBytes}}
          </md-table-cell>
          <md-table-cell
            md-label="Author"
            md-sort-by="author"
          >
            <div class="md-layout md-alignment-left-center">
              <div
                class="md-layout-item md-layout"
                style="max-width:35px;"
              >
                <t-avatar
                  small
                  :color="item.author.color"
                  :noImgTag="true"
                  :imageSrc="item.author.avatar"
                  :title="item.author.firstName + ' ' + item.author.lastName"
                />
              </div>

              <span class="md-layout-item">
                <span>
                  {{item.author.lastName | capitilize}}
                </span>
                <br />
                <span>
                  {{item.author.firstName | capitilize}}
                </span>
              </span>
            </div>
          </md-table-cell>
          <md-table-cell md-label="Actions">
            <md-button
              class="md-just-icon md-simple"
              @click="downoladFile(item.url)"
            >
              <md-icon>cloud_download</md-icon>
            </md-button>
            <md-button
              class="md-just-icon md-simple"
              @click.native="printFile(item.url)"
            >
              <md-icon>print</md-icon>
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
  import { mapGetters } from 'vuex';
  import { Pagination, TAvatar, TFilePreview} from '@/components';
  import Fuse from 'fuse.js';
  import swal from 'sweetalert2';
  import 'viewerjs/dist/viewer.css';
  import { PATIENT_DOWNLOAD_FILE } from '@/store/modules/constants';

  export default {
    name: 'patient-files',
    components: {
      Pagination,
      TAvatar,
      TFilePreview,
    },
    data() {
      return {
          options: {
        filter (image) {
          return image.classList.contains('img-to-preview')
        }
      },
        currentSort: 'name',
        currentSortOrder: 'asc',
        pagination: {
          perPage: 25,
          currentPage: 1,
          perPageOptions: [ 10, 25, 50],
          total: 0,
        },
        footerTable: ['Name', 'Email', 'Age', 'Salary', 'Actions'],
        searchQuery: '',
        propsToSearch: ['name', 'email', 'age'],
        searchedData: [],
        fuseSearch: null,
        extensions: 'gif,jpg,jpeg,png,webp',
        addData: {
          show: false,
          name: '',
          type: '',
          content: '',
        },
      };
    },
    methods: {
          imagetoPrint(source)
      {
          return "<html><head><script>function step1(){\n" +
                  "setTimeout('step2()', 10);}\n" +
                  "function step2(){window.print();window.close()}\n" +
                  "</scri" + "pt></head><body onload='step1()'>\n" +
                  "<img src='" + source + "' /></body></html>";
      },
      printFile(source){
          printJS({printable: source, type:'pdf', showModal:true});
      },
      downoladFile(url) {
        window.location = `${url}?dl=1`;
      },
      show() {

          const vuer = this.$el.querySelector('.images').$vuer
          // console.log(this.$el.querySelector('.img-to-preview'));
          // const vuer = this.$el.querySelector('.img-to-preview').$vuer
        //  const vuer = this.$el.querySelector('.images').$vuer
        // vuer.show()
      },
      isEmpty(obj) {
        // eslint-disable-next-line
      for (const key in obj) {
          // eslint-disable-next-line
        if (obj.hasOwnProperty(key)) return false;
        }
        return true;
      },
      customSort(value) {
        if (this.currentSort === 'author') {
          return value.sort((a, b) => {
            const sortBy = this.currentSort;
            if (this.currentSortOrder === 'desc') {
              return a[sortBy].firstName.localeCompare(b[sortBy].firstName);
            }
            return b[sortBy].firstName.localeCompare(a[sortBy].firstName);
          });
        }
        return value.sort((a, b) => {
          const sortBy = this.currentSort;
          if (this.currentSortOrder === 'desc') {
            return a[sortBy].localeCompare(b[sortBy]);
          }
          return b[sortBy].localeCompare(a[sortBy]);
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
        const indexToDelete = this.files.findIndex(
          tableRow => tableRow.id === item.id,
        );
        if (indexToDelete >= 0) {
          this.files.splice(indexToDelete, 1);
        }
      },
    },
    computed: {
      ...mapGetters({
        access_token: 'fetchAccessToken',
        patient: 'getPatient',
      }),
      totalFiles(){
        return  this.patient.files.reduce((a, b) => a + (b['size'] || 0), 0);
      },
      postAction() {
        return `https://dental-api.owl.team/v1/patients/${
          this.patient ? this.patient.ID : ''
        }/files/`;
      },
      putAction() {
        return `https://dental-api.owl.team/v1/patients/${
          this.patient ? this.patient.ID : ''
        }/files/`;
      },
      headers() {
        return {
          Authorization: this.access_token,
        };
      },
      data() {
        return {
          'Access-Control-Allow-Credentials': true,
        };
      },
      queriedData() {
        let result = this.patient.files ? this.patient.files : [];
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
          : this.patient.files.length;
      },
    },
    mounted() {
      // Fuse search initialization.
      this.fuseSearch = new Fuse(this.files, {
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
        let result = this.patient.files;
        if (value !== '') {
          result = this.fuseSearch.search(this.searchQuery);
        }
        this.searchedData = result;
      },
    },
  };
</script>

<style lang="scss" >
.files-list {
  .md-table-cell {
    .md-table-cell-container {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
