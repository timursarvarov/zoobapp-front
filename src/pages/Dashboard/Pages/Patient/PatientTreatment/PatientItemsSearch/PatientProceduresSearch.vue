<template lang="html">
    <div >
        <t-collapse-search
                :style="[{'max-height': `${customHeight}px`}]" class="set-procedure-form"
                :items="currentProcedures"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteProcedures"
                :loading="loading"
                :recalculateItems="recalculateItemsLocal"
                :customHeight="customHeight"
                :hideSlot="hideSlot"
                classType="success"
                type='procedures'
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
        >

            <template slot="title-start-2">
                <md-button
                    v-show="$route.name==='procedures'"
                    key="addplan"
                    class="md-success md-simple"
                    @click="$emit('addPlan')"
                >
                    <md-icon>add</md-icon>add plan
                </md-button>
            </template>
            <div   slot="empty-space">
                <md-empty-state
                    md-label="No created plans"
                    md-description="To implemet a procedure, you should firstly create a plan">
                        <md-button class="md-success md-raised" @click="$emit('addPlan')">Create New Plan</md-button>
                </md-empty-state>
            </div>
        </t-collapse-search>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {
        NOTIFY,
        CLINIC_PROCEDURES_GET,
        LOCAL_STORAGE,
    } from '@/constants';
    import components from '@/components';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            ...components,
        },
        props: {
            customHeight: {
                type: Number,
                default: 300,
            },
            selectedTeeth: {
                type: Array,
                default: () => [],
            },
            ageCategory: {
                type: String,
                default: () => 'adultTeeth',
            },
            currentPlan: {
                type: Object,
                default: () => {},
            },
            hideSlot: {
                type: Boolean,
                default: () => false,
            },
        },
        data() {
            return {
                recalculateItemsLocal: false,
                selecteditemLocal: {},
                loading: false,
                lastAgeCategory: 0,
            };
        },
        methods: {
            getItems(languageChanged) {
                if (this.currentProcedures.length === 0 || languageChanged) {
                    this.loading = true;
                    this.$store.dispatch(CLINIC_PROCEDURES_GET, {
                        lang: this.$i18n.locale,
                    }).then(() => {
                        this.loading = false;
                        this.recalculateItemsLocal = !this.recalculateItemsLocal;
                    }).catch((err) => {
                        console.log(err);
                        this.loading = false;
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
                            type: 'success',
                        },
                    });
                } else {
                    fItems.splice(index, 1);
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Procedue deleted from favorite procedures',
                            type: 'success',
                        },
                    });
                }
                localStorage.setItem(LOCAL_STORAGE.favoriteItems.procedures, JSON.stringify(fItems));
            },
            selectItem(item) {
                if (item) {
                    if (
                        !this.isEmpty(item.locations)
                        && this.selectedTeeth.length === 0
                    ) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please first select teeth',
                                type: 'warning',
                            },
                        });
                    } else {
                        Object.values(this.originalItems[this.$route.name]).forEach(
                            (group) => {
                                group.codes.forEach((itemOrigin) => {
                                    if (itemOrigin.code === item.constCode) {
                                        this.$emit('onSelectItem', itemOrigin);
                                    }
                                });
                            },
                        );
                    }
                }
            },
        },
        computed: {
            ...mapGetters({
                favoriteProcedures: 'favoriteProcedures',
                currentProcedures: 'getCurrentProcedures',
            }),
        },
        created() {
            this.getItems();
            this.lastAgeCategory = this.currentAgeCategory;
        },
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
