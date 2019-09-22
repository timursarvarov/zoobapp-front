<template>
    <div v-if="!isEmpty(files)" class="files-list">
        <div class="">
            <md-table
                v-viewer="options"
                :value="queriedData"
                :md-sort.sync="currentSort"
                :md-sort-order.sync="currentSortOrder"
                :md-sort-fn="customSort"
                class="paginated-table table-striped images table-hover"
            >
                <md-table-toolbar v-if="paginated">
                    <md-field>
                        <label for="pages">Per page {{ total }}</label>
                        <md-select v-model="pagination.perPage" name="pages">
                            <md-option v-for="(item, index) in pagination.perPageOptions" :key="index" :label="item" :value="item">
                                {{ item }}
                            </md-option>
                        </md-select>
                    </md-field>

                    <md-field>
                        <md-input v-model="searchQuery" type="search" class="mb-3" clearable style="width: 200px" placeholder="Search records" />
                    </md-field>
                </md-table-toolbar>

                <md-table-empty-state :md-label="`Nothing to show`" :md-description="` Scroll top, and add new file .`">
                    <md-button class="md-primary md-raised" @click="scrollToTop()">
                        Scroll Top
                    </md-button>
                </md-table-empty-state>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell
                        v-for="(field, index) in columns"
                        :key="index"
                        :class="[{ 'md-xsmall-hide': !!(field.key != 'filePreview') }]"
                        :md-label="field.title"
                    >
                        <div v-if="field.key === 'filePreview'">
                            <div class="imgcontainer">
                                <t-file-preview
                                    :width="90"
                                    :icon-size="1"
                                    :height="60"
                                    :url="item.url"
                                    :mime-type="item.mimeType"
                                    :show-overlay="true"
                                    overlay-icon="visibility"
                                    @show="show"
                                />
                            </div>
                        </div>
                        <div v-else-if="field.key === 'name'" :md-label="field.title" :md-sort-by="field.sortable ? field.key : ''">
                            {{ item[field.key] }}
                        </div>
                        <div v-else-if="field.key === 'created'" :md-label="field.title" :md-sort-by="field.sortable ? field.key : ''">
                            <span>{{ item.created | moment('from') }}</span>
                            <br />
                            <small>{{ item.created | moment('calendar') }}</small>
                        </div>
                        <div v-else-if="field.key === 'fileType'" :md-sort-by="field.sortable ? field.key : ''" :md-label="field.title">
                            {{ item.mimeType }}
                        </div>
                        <div v-else-if="field.key === 'filesize'" :md-label="field.title" :md-sort-by="field.sortable ? field.key : ''">
                            {{ item.size | formatBytes }}
                        </div>
                        <avatar-box
                            v-else-if="field.key === 'author' && item.author"
                            small
                            :avatar="item.author.avatar"
                            :id="item.author.ID"
                            :firstLine="item.author.firstName"
                            :secondLine="item.author.lastName"
                        />
                    </md-table-cell>
                    <md-table-cell md-label="Actions">
                        <md-button class="md-just-icon md-simple" @click="downoladFile(item.url)">
                            <md-icon>cloud_download</md-icon>
                        </md-button>
                        <md-button class="md-just-icon md-simple" @click.native="printFile(item.url)">
                            <md-icon>print</md-icon>
                        </md-button>
                        <md-button class="md-just-icon md-danger md-simple" @click.native="handleDelete(item)">
                            <md-icon>close</md-icon>
                        </md-button>
                    </md-table-cell>
                </md-table-row>
            </md-table>
            <div>
                <div class="footer-table md-table">
                    <table>
                        <tfoot>
                            <tr>
                                <th v-for="(item, index) in columns" :key="index" class="md-table-head">
                                    <div class="md-table-head-container md-ripple md-disabled">
                                        <div class="md-table-head-label">
                                            {{ item.title }}
                                        </div>
                                    </div>
                                </th>
                                <th class="md-table-head">
                                    <div class="md-table-head-container md-ripple md-disabled">
                                        <div class="md-table-head-label">
                                            Actions
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div v-if="paginated" class="md-layout" md-alignment="space-between">
                    <div class="md-layout-item">
                        <p class="card-category">Showing {{ from + 1 }} to {{ to }} of {{ total }} entries</p>
                    </div>
                    <div v-if="files" class="md-layout-item">
                        <p>Total {{ files.length }} files ({{ totalFiles | formatBytes }})</p>
                    </div>
                    <pagination
                        v-model="pagination.currentPage"
                        class="mb-3 pagination-no-border pagination-success"
                        :per-page="pagination.perPage"
                        :total="total"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Fuse from 'fuse.js';

// import swal from 'sweetalert2';
import 'viewerjs/dist/viewer.css';
import { tObjProp } from '@/mixins';
// import components from '@/components';

export default {
    name: 'TFilesList',
    components: {
        // ...components
        't-file-preview': () => import('./TFilePreview/TFilePreview'),
        'avatar-box': () => import('./AvatarBox'),
        pagination: () => import('@/components/Pagination')
    },
    mixins: [tObjProp],
    props: {
        paginated: {
            type: Boolean,
            default: () => true
        },
        accessToken: {
            type: String,
            default: ''
        },
        fixedheader: {
            type: String,
            default: ''
        },
        files: {
            type: Array,
            default: () => []
        },
        columns: {
            type: Array,
            default: () => [
                {
                    key: 'filePreview',
                    title: 'Preview',
                    sortable: false
                },
                {
                    key: 'name',
                    title: 'Name',
                    sortable: true
                },
                {
                    key: 'created',
                    title: 'Created',
                    sortable: true
                },
                {
                    key: 'fileType',
                    title: 'File Type',
                    sortable: true
                },
                {
                    key: 'filesize',
                    title: 'File Size',
                    sortable: true
                },
                {
                    key: 'author',
                    title: 'Author',
                    sortable: true
                }
            ]
        }
    },
    data() {
        return {
            options: {
                filter(image) {
                    return image.classList.contains('img-to-preview');
                }
            },
            currentSort: 'name',
            currentSortOrder: 'asc',
            pagination: {
                perPage: 25,
                currentPage: 1,
                perPageOptions: [10, 25, 50],
                total: 0
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
                content: ''
            }
        };
    },
    computed: {
        totalFiles() {
            return this.files.reduce((a, b) => a + (b.size || 0), 0);
        },
        headers() {
            return {
                Authorization: this.access_token
            };
        },
        data() {
            return {
                'Access-Control-Allow-Credentials': true
            };
        },
        queriedData() {
            if (this.paginated) {
                let result = this.files ? this.files : [];
                if (this.searchedData.length > 0) {
                    result = this.searchedData;
                }
                return result.slice(this.from, this.to);
            }
            return this.files;
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
            return this.searchedData.length > 0 ? this.searchedData.length : this.files.length;
        }
    },
    watch: {
        /**
         * Searches through the table data by a given query.
         * NOTE: If you have a lot of data, it's recommended to do
         * the search on the Server Side and only display the results here.
         * @param value of the query
         */
        searchQuery(value) {
            let result = this.files;
            if (value !== '') {
                result = this.fuseSearch.search(this.searchQuery);
            }
            this.searchedData = result;
        }
    },
    mounted() {
        // Fuse search initialization.
        this.fuseSearch = new Fuse(this.files, {
            keys: ['name', 'email'],
            threshold: 0.3
        });
    },
    methods: {
        downoladFile(url) {
            window.location = `${url}?dl=1`;
        },
        show() {
            // const vuer = this.$el.querySelector('.images').$vuer;
            // console.log(this.$el.querySelector('.img-to-preview'));
            // const vuer = this.$el.querySelector('.img-to-preview').$vuer
            //  const vuer = this.$el.querySelector('.images').$vuer
            // vuer.show()
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

        handleDelete(item) {
            console.log(item);
        },
        deleteRow(item) {
            const indexToDelete = this.files.findIndex(tableRow => tableRow.id === item.id);
            if (indexToDelete >= 0) {
                this.files.splice(indexToDelete, 1);
            }
        }
    }
};
</script>

<style lang="scss">
.files-list {
    .md-table-cell {
        .md-table-cell-container {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
