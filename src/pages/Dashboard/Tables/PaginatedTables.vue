<template>
    <div class="md-layout">
        <div class="md-layout-item">
            <md-card>
                <md-card-header class="md-card-header-icon md-card-header-green">
                    <div class="card-icon">
                        <md-icon>assignment</md-icon>
                    </div>
                    <h4 class="title">
                        Paginated Tables
                    </h4>
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
                                <md-select v-model="pagination.perPage" name="pages">
                                    <md-option v-for="item in pagination.perPageOptions" :key="item" :label="item" :value="item">
                                        {{ item }}
                                    </md-option>
                                </md-select>
                            </md-field>

                            <md-field>
                                <md-input
                                    v-model="searchQuery"
                                    type="search"
                                    class="mb-3"
                                    clearable
                                    style="width: 200px"
                                    placeholder="Search records"
                                />
                            </md-field>
                        </md-table-toolbar>

                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                            <md-table-cell md-label="Name" md-sort-by="name">
                                {{ item.name }}
                            </md-table-cell>
                            <md-table-cell md-label="Email" md-sort-by="email">
                                {{ item.email }}
                            </md-table-cell>
                            <md-table-cell md-label="Age">
                                {{ item.age }}
                            </md-table-cell>
                            <md-table-cell md-label="Salary">
                                {{ item.salary }}
                            </md-table-cell>
                            <md-table-cell md-label="Actions">
                                <md-button class="md-just-icon md-info md-simple" @click.native="handleLike(item)">
                                    <md-icon>favorite</md-icon>
                                </md-button>
                                <md-button class="md-just-icon md-warning md-simple" @click.native="handleEdit(item)">
                                    <md-icon>dvr</md-icon>
                                </md-button>
                                <md-button class="md-just-icon md-danger md-simple" @click.native="handleDelete(item)">
                                    <md-icon>close</md-icon>
                                </md-button>
                            </md-table-cell>
                        </md-table-row>
                    </md-table>
                    <div class="footer-table md-table">
                        <table>
                            <tfoot>
                                <tr>
                                    <th v-for="item in footerTable" :key="item.name" class="md-table-head">
                                        <div class="md-table-head-container md-ripple md-disabled">
                                            <div class="md-table-head-label">
                                                {{ item }}
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </md-card-content>
                <md-card-actions md-alignment="space-between">
                    <div class>
                        <p class="card-category">Showing {{ from + 1 }} to {{ to }} of {{ total }} entries</p>
                    </div>
                    <pagination
                        v-model="pagination.currentPage"
                        class="pagination-no-border pagination-success"
                        :per-page="pagination.perPage"
                        :total="total"
                    />
                </md-card-actions>
            </md-card>
        </div>
    </div>
</template>

<script>
import Fuse from 'fuse.js';
import components from '@/components';
import users from './users';

export default {
    name: 'PaginatedTables',
    components: {
        ...components
    },
    data() {
        return {
            currentSort: 'name',
            currentSortOrder: 'asc',
            pagination: {
                perPage: 5,
                currentPage: 1,
                perPageOptions: [5, 10, 25, 50],
                total: 0
            },
            footerTable: ['Name', 'Email', 'Age', 'Salary', 'Actions'],
            searchQuery: '',
            propsToSearch: ['name', 'email', 'age'],
            tableData: users,
            searchedData: [],
            fuseSearch: null
        };
    },
    computed: {
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
            return this.searchedData.length > 0 ? this.searchedData.length : this.tableData.length;
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
            let result = this.tableData;
            if (value !== '') {
                result = this.fuseSearch.search(this.searchQuery);
            }
            this.searchedData = result;
        }
    },
    mounted() {
        // Fuse search initialization.
        this.fuseSearch = new Fuse(this.tableData, {
            keys: ['name', 'email'],
            threshold: 0.3
        });
    },
    methods: {
        customSort(value) {
            console.log(value);
            return value.sort((a, b) => {
                const sortBy = this.currentSort;
                if (this.currentSortOrder === 'desc') {
                    return a[sortBy].localeCompare(b[sortBy]);
                }
                return b[sortBy].localeCompare(a[sortBy]);
            });
        },
        handleLike(item) {
            console.log(item);
        },
        handleEdit(item) {
            console.log(item);
        },
        handleDelete(item) {
            console.log(item);
        },
        deleteRow(item) {
            const indexToDelete = this.tableData.findIndex(tableRow => tableRow.id === item.id);
            if (indexToDelete >= 0) {
                this.tableData.splice(indexToDelete, 1);
            }
        }
    }
};
</script>

<style lang="css" scoped>
.md-card .md-card-actions {
    border: 0;
    margin-left: 20px;
    margin-right: 20px;
}
</style>
