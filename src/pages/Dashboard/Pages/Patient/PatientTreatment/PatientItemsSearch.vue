<template lang="html">
    <div >
        <t-collapse-search
            v-show="currentType === 'anamnesis'"
                :style="[{'max-height': `${customHeight}px`}]" class="set-procedure-form"
                :items="originalItems.anamnesis"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteAnamnesis"
                itemType="anamnesis"
                :loading="originalItemsLoading.anamnesis "
                :recalculateItems="recalculateItemsLocal"
                :customHeight="customHeight"
                :hideSlot="currentPlan.ID === undefined && currentType === 'procedures'"
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
            >
        </t-collapse-search>
        <t-collapse-search
            v-show="currentType === 'diagnosis'"
                :style="[{'max-height': `${customHeight}px`}]" class="set-procedure-form"
                :items="originalItems.diagnosis"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteDiagnosis"
                itemType="diagnosis"
                :loading="originalItemsLoading.diagnosis"
                :recalculateItems="recalculateItemsLocal"
                :customHeight="customHeight"
                :hideSlot="currentPlan.ID === undefined && currentType === 'procedures'"
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
            >
        </t-collapse-search>
        <t-collapse-search
            v-show="currentType === 'procedures'"
                :style="[{'max-height': `${customHeight}px`}]" class="set-procedure-form"
                :items="originalItems.procedures"
                :selectedTeeth="selectedTeeth"
                :favoriteItems="favoriteProcedures"
                itemType="procedures"
                :loading="originalItemsLoading.procedures || loadingAllPLans"
                :recalculateItems="recalculateItemsLocal"
                :customHeight="customHeight"
                :hideSlot="currentPlan.ID === undefined && currentType === 'procedures'"
                @onSetFavoritem="setFavoriteItems"
                @onSelected="selectItem"
            >
                    <template slot="title-start-2">
                            <md-button
                                v-show="currentType==='procedures'"
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
    import {
        NOTIFY,
        USER_SET_PARAM,
        LOCATIONS,
        CLINIC_DIAGNOSIS_GET,
        CLINIC_PROCEDURES_GET,
        CLINIC_MANIPULATIONS_GET,
        CLINIC_SET_PROP,
    } from '@/constants';
    import { mapGetters } from 'vuex';
    import {
        TCollapseSearch,
    } from '@/components';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TCollapseSearch,
        },
        props: {
            customHeight: {
                type: Number,
                default: 300,
            },
            currentType: {
                type: String,
                default: 'anamnesis',
            },
            selectedTeeth: {
                type: Array,
                default: () => [],
            },
            recalculateItems: {
                type: Boolean,
                default: () => false,
            },
            ageCategory: {
                type: String,
                default: () => 'adultTeeth',
            },
            loadingAllPLans: {
                type: Boolean,
                default: () => false,
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
                originalItemsLoading: {
                    procedures: false,
                    diagnosis: false,
                    anamnesis: false,
                    manipulations: false,
                },
            };
        },
        methods: {
            getItems() {
                if (
                    this.currentDiagnosis.length <= 0
                    || this.originalItems.diagnosis.length <= 0
                ) {
                    this.originalItemsLoading[this.currentType] = true;
                    this.$store.dispatch(CLINIC_DIAGNOSIS_GET).then(() => {
                        this.setOriginalItems(['diagnosis']);
                        this.originalItemsLoading.diagnosis = false;
                    });
                }
                if (
                    this.currentManipulations.length <= 0
                    || this.originalItems.manipulations.length <= 0
                ) {
                    this.originalItemsLoading.manipulations = true;
                    this.$store.dispatch(CLINIC_MANIPULATIONS_GET).then(() => {
                        this.setOriginalItems(['manipulations']);
                        this.originalItemsLoading.manipulations = false;
                    });
                }
                if (
                    this.currentProcedures.length <= 0
                    || this.originalItems.anamnesis.length <= 0
                ) {
                    this.originalItemsLoading.anamnesis = true;
                    this.$store.dispatch(CLINIC_PROCEDURES_GET).then(() => {
                        this.setOriginalItems(['anamnesis']);
                        this.originalItemsLoading.anamnesis = false;
                    });
                }
                if (
                    this.currentProcedures.length <= 0
                    || this.originalItems.procedures.length <= 0
                ) {
                    this.originalItemsLoading.procedures = true;
                    this.$store.dispatch(CLINIC_PROCEDURES_GET).then(() => {
                        this.setOriginalItems(['procedures']);
                        this.originalItemsLoading.procedures = false;
                    });
                }
            },
            setOriginalItems(types) {
                if (types.includes('diagnosis') && this.originalItems.diagnosis) {
                    const diagnosis = this.filterItems(
                        this.currentDiagnosis,
                        true,
                        'diagnosis',
                    );
                    this.$store.dispatch(CLINIC_SET_PROP, {
                        props: {
                            type: 'diagnosisComputed',
                            value: diagnosis,
                        },
                    });
                }
                if (
                    (types.includes('anamnesis'))
                    && this.originalItems.procedures
                ) {
                    const anamnesis = this.filterItems(
                        this.currentProcedures,
                        false,
                        'anamnesis',
                    );
                    this.$store.dispatch(CLINIC_SET_PROP, {
                        props: {
                            type: 'anamnesisComputed',
                            value: anamnesis,
                        },
                    });
                }
                if (
                    (types.includes('manipulations'))
                    && this.originalItems.procedures
                ) {
                    const manipulations = this.filterManipulations(
                        this.currentManipulations,
                    );
                    this.$store.dispatch(CLINIC_SET_PROP, {
                        props: {
                            type: 'manipulationsComputed',
                            value: manipulations,
                        },
                    });
                }
                if (
                    (types.includes('procedures'))
                    && this.originalItems.procedures
                ) {
                    const procedures = this.filterItems(
                        this.currentProcedures,
                        true,
                        'procedures',
                    );
                    this.$store.dispatch(CLINIC_SET_PROP, {
                        props: {
                            type: 'proceduresComputed',
                            value: procedures,
                        },
                    });
                }
                this.recalculateItemsLocal = !this.recalculateItemsLocal;
            },
            filterItems(items = [], available, type) {
                let filteredItems = [];
                let localType = type;
                if (type === 'anamnesis') {
                    localType = 'procedures';
                }
                items.forEach((item) => {
                    let groupIndex = filteredItems.findIndex(
                        el => el.code === item.categoryCode,
                    );
                    if (groupIndex === -1) {
                        groupIndex = filteredItems.push({
                            code: item.categoryCode,
                            title: this.$t(
                                `${localType}.categories.${
                                    item.categoryCode
                                }.title`,
                            ),
                            codes: [],
                        }) - 1;
                    }
                    if (
                        (type === 'anamnesis' || (item.available || !available))
                        && LOCATIONS[item.templateID].ageCategory.includes(
                            this.ageCategory,
                        )
                    ) {
                        if (!item.defaultManipulations) {
                            filteredItems[groupIndex].codes.push({
                                ...LOCATIONS[item.templateID],
                                code: item.code,
                                title: this.$t(`${localType}.${item.ID}.title`),
                                description: this.$t(
                                    `${localType}.${item.ID}.description`,
                                ),
                            });
                        } else {
                            filteredItems[groupIndex].codes.push({
                                ...LOCATIONS[item.templateID],
                                defaultManipulations: item.defaultManipulations,
                                code: item.code,
                                title: this.$t(`${localType}.${item.ID}.title`),
                                description: this.$t(
                                    `${localType}.${item.ID}.description`,
                                ),
                            });
                        }
                    }
                });
                filteredItems = filteredItems.filter(el => el.codes.length !== 0);
                return filteredItems;
            },
            filterManipulations(manipulations) {
                let filteredItems = [];
                manipulations.forEach((item) => {
                    const compItem = item;
                    const title = this.$t(`manipulations.${item.ID}.title`);
                    compItem.title = title === `manipulations.${item.ID}.title` ? compItem.title : title;
                    compItem.price = 22.22;
                    filteredItems.push(
                        compItem,
                    );
                });
                filteredItems = filteredItems.filter(el => el.available);
                return filteredItems;
            },
            setFavoriteItems(items) {
                const index = this.favoriteItems.findIndex(d => d === items.code);
                if (this.currentType === 'diagnosis') {
                    if (index === -1) {
                        this.favoriteDiagnosis.unshift(items.code);
                    } else {
                        this.favoriteDiagnosis.splice(index, 1);
                    }
                    this.$store.dispatch(USER_SET_PARAM, {
                        type: 'favoriteDiagnosis',
                        value: this.favoriteDiagnosis,
                    });
                }
                if (this.currentType === 'anamnesis') {
                    if (index === -1) {
                        this.favoriteAnamnesis.unshift(items.code);
                    } else {
                        this.favoriteAnamnesis.splice(index, 1);
                    }
                    this.$store.dispatch(USER_SET_PARAM, {
                        type: 'favoriteAnamnesis',
                        value: this.favoriteAnamnesis,
                    });
                }
                if (this.currentType === 'procedures') {
                    if (index === -1) {
                        this.favoriteProcedures.unshift(items.code);
                    } else {
                        this.favoriteProcedures.splice(index, 1);
                    }
                    this.$store.dispatch(USER_SET_PARAM, {
                        type: 'favoriteProcedures',
                        value: this.favoriteProcedures,
                    });
                }
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
                        Object.values(this.originalItems[this.currentType]).forEach(
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
                favoriteDiagnosis: 'favoriteDiagnosis',
                favoriteProcedures: 'favoriteProcedures',
                favoriteAnamnesis: 'favoriteAnamnesis',
                currentClinic: 'getCurrentClinic',
                currentProcedures: 'getCurrentProcedures',
                currentDiagnosis: 'getCurrentDiagnosis',
                currentManipulations: 'getCurrentManipulations',
            }),
            originalItems() {
                const originalItems = {
                    manipulations: this.currentClinic.manipulationsComputed || [],
                    anamnesis: this.currentClinic.anamnesisComputed || [],
                    diagnosis: this.currentClinic.diagnosisComputed || [],
                    procedures: this.currentClinic.proceduresComputed || [],
                };
                return originalItems;
            },
            favoriteItems() {
                if (this.currentType === 'anamnesis') {
                    return this.favoriteAnamnesis;
                }
                if (this.currentType === 'procedures') {
                    return this.favoriteProcedures;
                }
                return this.favoriteDiagnosis;
            },
        },
        created() {
            this.getItems();
        },
        watch: {
            recalculateItems() {
                this.recalculateItemsLocal = !this.recalculateItemsLocal;
            },
            ageCategory() {
                this.setOriginalItems(['anamnesis', 'diagnosis', 'procedures']);
            },
            // eslint-disable-next-line func-names
            '$i18n.locale': function () {
                this.setOriginalItems(['anamnesis', 'diagnosis', 'procedures', 'manipulations']);
            },
        },
    };
</script>
<style lang="scss">
.set-diagnose-form {
    // .md-checkbox {
    //     padding-top: 7px;
    //     margin-left: 17px;
    // }
    .tab-content > div {
        flex-grow: 1;
    }
    .md-card {
        box-shadow: none;
    }
}
</style>
