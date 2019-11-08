<template>
    <div class="procedure_manipulations">
        <md-table :value="currentManipulations" class="no-header small" table-header-color="green">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Code">
                    <small>{{ item.code }}</small>
                </md-table-cell>
                <md-table-cell class="manipulation-title" md-label="Title">
                    <small>{{ item.title }}</small>
                </md-table-cell>
                <md-table-cell md-label="Qty" class="manipulations-input">
                    <small>{{ item.qty }}</small>
                </md-table-cell>
                <md-table-cell>*</md-table-cell>
                <md-table-cell md-label="Price">
                    <small>{{ (item.price ? item.price : 0) | currency('') }}</small>
                </md-table-cell>
                <md-table-cell md-label="Total">
                    <small>{{ item.totalPrice | currency }}</small>
                </md-table-cell>
            </md-table-row>
        </md-table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { STORE_KEY_PATIENT } from '@/constants';

export default {
    props: {
        manipulationsIds: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters({
            allManipulations: `${STORE_KEY_PATIENT}/getAllManipulations`,
            currentClinic: 'getCurrentClinic'
        }),
        currentManipulations() {
            if (this.manipulationsIds) {
                let manips = [];
                this.manipulationsIds.forEach(mID => {
                    manips[mID] = this.allManipulations[mID];
                });
                return manips;
            }
            return [];
        }
    }
};
</script>
