<template lang="html">
    <div >
        <t-collapse-search
                :style="[{'max-height': `${customHeight}px`}]" class="set-procedure-form"
                :items="currentAnamnesis"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteAnamnesis"
                :loading="loading"
                :recalculateItems="recalculateItemsLocal"
                :customHeight="customHeight"
                :hideSlot="hideSlot"
                classType="info"
                type='anamnesis'
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
        />
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
                if (this.currentAnamnesis.length === 0 || languageChanged) {
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
                const index = this.favoriteAnamnesis.findIndex(d => d === item.code);
                const fItems = this.favoriteAnamnesis;
                if (index === -1) {
                    fItems.unshift(item.code);
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Procedue added to favorite anamnesis',
                            type: 'success',
                        },
                    });
                } else {
                    fItems.splice(index, 1);
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Procedue deleted from favorite anamnesis',
                            type: 'success',
                        },
                    });
                }
                localStorage.setItem(LOCAL_STORAGE.favoriteItems.anamnesis, JSON.stringify(fItems));
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
                favoriteAnamnesis: 'favoriteAnamnesis',
                currentAnamnesis: 'getCurrentAnamnesis',
            }),
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
