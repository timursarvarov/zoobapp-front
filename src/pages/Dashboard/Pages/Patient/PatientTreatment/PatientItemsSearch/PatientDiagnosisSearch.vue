<template lang="html">
    <div>
        <t-collapse-search
            :style="[{'max-height': `${customHeight}px`}]"
            class="set-procedure-form"
            :items="currentDiagnosis"
            :selected-teeth="selectedTeeth"
            :favorite-items="favoriteDiagnosis"
            :loading="loading"
            :recalculate-items="recalculateItemsLocal"
            :custom-height="customHeight"
            class-type="success"
            type="diagnosis"
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
    components: {
        ...components,
    },
    mixins: [tObjProp],
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
    computed: {
        ...mapGetters({
            favoriteDiagnosis: 'favoriteDiagnosis',
            currentDiagnosis: 'getCurrentClinicDiagnosis',
        }),
        lang(){
            return this.$i18n.locale
        }
    },
    watch:{
        lang(val){
            this.getItems(val)
        }
    },
    created() {
        this.getItems();
        this.lastAgeCategory = this.currentAgeCategory;
    },
    methods: {
        getItems(languageChanged) {
            if (this.currentDiagnosis.length === 0 || languageChanged) {
                this.loading = true;
                this.$store.dispatch(CLINIC_DIAGNOSIS_GET).then(() => {
                    this.loading = false;
                    this.recalculateItemsLocal = !this.recalculateItemsLocal;
                }).catch((err) => {
                    throw new Error(err);
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
                        message: 'Procedue added to favorite diagnosis',
                        type: 'success',
                    },
                });
            } else {
                fItems.splice(index, 1);
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: 'Procedue deleted from favorite diagnosis',
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
                    this.$emit('onSelectItem', item);
                }
            }
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