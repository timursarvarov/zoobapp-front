<template lang="html">
    <div>
        <t-collapse-search
            :style="[{ 'max-heigfht': `${customHeight}px` }]"
            class="set-procedure-form"
            :items="currentProcedures"
            :selected-teeth="selectedTeeth"
            :favorite-items="favoriteProcedures"
            :loading="loading"
            :recalculate-items="recalculateItemsLocal"
            :custom-height="customHeight"
            :hide-slot="!currentPlanID"
            class-type="success"
            type="procedures"
            @onSetFavoritem="setFavoriteItems"
            @onSelected="selectItem"
        >
            <template slot="title-start-2">
                <md-button key="addplan" class="md-success md-simple" @click="$emit('addPlan')">
                    <md-icon>add</md-icon> {{ $t(`${$options.name}.addNewPlan`) }}
                </md-button>
            </template>
            <div slot="empty-space">
                <md-empty-state :md-label="$t(`${$options.name}.noPlansTitle`)" :md-description="$t(`${$options.name}.noPlansDescription`)">
                    <md-button class="md-success md-raised" @click="$emit('addPlan')">
                        {{ $t(`${$options.name}.addNewPlan`) }}
                    </md-button>
                </md-empty-state>
            </div>
        </t-collapse-search>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { NOTIFY, CLINIC_PROCEDURES_GET, LOCAL_STORAGE } from '@/constants';
import components from '@/components';
import { tObjProp } from '@/mixins';

export default {
    components: {
        ...components
    },
    mixins: [tObjProp],
    name: 'PatientProceduresSearch',
    props: {
        customHeight: {
            type: Number,
            default: 300
        },
        selectedTeeth: {
            type: Array,
            default: () => []
        },
        hideSlot: {
            type: Boolean,
            default: () => false
        },
        recalculateItems: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            recalculateItemsLocal: false,
            selecteditemLocal: {},
            loading: false,
            lastAgeCategory: 0
        };
    },
    computed: {
        ...mapGetters({
            favoriteProcedures: 'favoriteProcedures',
            currentProcedures: 'getCurrentClinicProcedures',
            ungroupedProcedures: 'getUngroupedProcedures',
            currentPlanID: 'getCurrentPlanID',
            ageCategory: 'ageCategory'
        }),
        lang() {
            return this.$i18n.locale;
        }
    },
    watch: {
        lang(val) {
            this.getItems(val);
        },
        ageCategory() {
            this.recalculateItemsLocal = !this.recalculateItemsLocal;
        },
        recalculateItems() {}
    },
    created() {
        this.getItems();
        this.lastAgeCategory = this.currentAgeCategory;
    },
    methods: {
        getItems(languageChanged) {
            if (this.currentProcedures.length === 0 || languageChanged) {
                this.loading = true;
                this.$store
                    .dispatch(CLINIC_PROCEDURES_GET)
                    .then(() => {
                        this.loading = false;
                        this.recalculateItemsLocal = !this.recalculateItemsLocal;
                    })
                    .catch(err => {
                        this.loading = false;
                        throw new Error(err);
                    });
            } else {
                this.recalculateItemsLocal = !this.recalculateItemsLocal;
            }
        },
        setFavoriteItems(item) {
            const index = this.favoriteProcedures.findIndex(d => d === item.code);
            const fItems = this.favoriteProcedures;
            if (index === -1) {
                fItems.unshift(item.code);
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: 'Procedue added to favorite procedures',
                        type: 'success'
                    }
                });
            } else {
                fItems.splice(index, 1);
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: 'Procedue deleted from favorite procedures',
                        type: 'success'
                    }
                });
            }
            localStorage.setItem(LOCAL_STORAGE.favoriteItems.procedures, JSON.stringify(fItems));
        },
        selectItem(item) {
            if (item) {
                if (!this.lodash.isEmpty(item.locations) && this.selectedTeeth.length === 0) {
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Please first select teeth',
                            type: 'warning'
                        }
                    });
                } else {
                    // вытаскиваем неизмененную fuse поиском оригинальную нозологию
                    const unchangedItem = Object.values(this.ungroupedProcedures).find(i => i.ID === item.ID);
                    if (unchangedItem) {
                        this.$emit('onSelectItem', unchangedItem);
                    }
                }
            }
        }
    }
};
</script>
<style lang="scss">
.set-diagnose-form {
    .tab-content > div {
        flex-grow: 1;
    }
    .md-card {
        box-shadow: none;
    }
}
</style>
