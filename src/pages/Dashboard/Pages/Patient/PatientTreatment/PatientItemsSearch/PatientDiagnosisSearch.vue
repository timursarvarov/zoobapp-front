<template lang="html">
    <div >
        <t-collapse-search
                :style="[{'max-height': `${customHeight}px`}]" class="set-procedure-form"
                :items="currentDiagnosis"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteDiagnosis"
                :loading="loading"
                :recalculateItems="recalculateItemsLocal"
                :customHeight="customHeight"
                classType="primary"
                type='diagnosis'
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
            />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {
        NOTIFY,
        CLINIC_DIAGNOSIS_GET,
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
                if (this.currentDiagnosis.length === 0 || languageChanged) {
                    this.loading = true;
                    this.$store.dispatch(CLINIC_DIAGNOSIS_GET, {
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
                const index = this.favoriteDiagnosis.findIndex(d => d === item.code);
                const fItems = this.favoriteDiagnosis;
                if (index === -1) {
                    fItems.unshift(item.code);
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Diagnose added to favorites',
                            type: 'success',
                        },
                    });
                } else {
                    fItems.splice(index, 1);
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Diagnose deleted from favorites',
                            type: 'success',
                        },
                    });
                }
                localStorage.setItem(LOCAL_STORAGE.favoriteItems.diagnosis, JSON.stringify(fItems));
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
                currentDiagnosis: 'getCurrentDiagnosis',
                favoriteDiagnosis: 'favoriteDiagnosis',
            }),
            favoriteDiagnosis() {
                const favoriteItems = localStorage.getItem([LOCAL_STORAGE.favoriteItems.diagnosis]);
                return favoriteItems ? JSON.parse(favoriteItems) : [];
            },
        },
        created() {
            this.getItems();
            this.lastAgeCategory = this.currentAgeCategory;
        },
        watch: {
            $i18n() {
                this.getItems('languageChanged');
            },
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
