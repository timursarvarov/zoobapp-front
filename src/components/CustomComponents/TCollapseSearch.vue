/* eslint-disable vue/no-v-html */
<template lang="html">
    <div class="t-collapse-search-wrapper noselect">
        <div v-show="loading" class="no-plan-space" :style="[{ 'max-height': customHeight - 70 + 'px' }, { 'min-height': customHeight - 70 + 'px' }]">
            <md-empty-state>
                <md-progress-spinner md-mode="indeterminate" />
            </md-empty-state>
        </div>
        <div v-show="!loading">
            <md-toolbar class=" md-transparent no-side-padding md-layout md-alignment-top-space-between collapse-toolbar__items">
                <div class="collapse-actions md-small-size-100 md-size-50">
                    <slot name="title-start-1" />
                    <slot name="title-start-2" />
                </div>
                <div class="collapse-actions md-small-size-100 md-size-50">
                    <div class=" collapse-toolbar__grow">
                        <md-field class="no-margin ">
                            <label> {{ $t(`${$options.name}.search-${type}`) }}</label>
                            <md-input v-model="search" />
                            <slide-y-down-transition>
                                <md-button v-show="search.length > 0" class="md-simple md-icon-button md-dense md-input-action " @click="search = ''">
                                    <md-icon
                                        :style="{
                                            color: getItems.length === 0 ? '#9c27b0 !important' : ''
                                        }"
                                    >
                                        close
                                    </md-icon>
                                </md-button>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <div class="ml-auto collapse-toolbar__nogrow">
                        <md-button class="md-mini md-just-icon md-simple md-round" @click="toggleAll = !toggleAll">
                            <md-icon :class="[{ rotate: toggleAll }]">
                                keyboard_arrow_down
                            </md-icon>
                            <md-tooltip md-delay="500"> {{ $t(`${$options.name}.showAll`) }} </md-tooltip>
                        </md-button>
                    </div>
                </div>
            </md-toolbar>

            <div
                v-show="!hideSlot && getItems.length > 0"
                class="collapse-wrapper "
                :style="[{ 'max-height': customHeight - 70 + 'px' }, { 'min-height': customHeight - 70 + 'px' }]"
            >
                <custom-collapse
                    v-show="!hideSlot"
                    :color-collapse="classType"
                    class=""
                    :collapse="itemsGroup"
                    icon="keyboard_arrow_down"
                    :toggle-all="getToggleAll"
                >
                    <template v-for="(itemGroup, key) in getItems" :slot="'md-collapse-pane-' + (parseInt(key) + 1)">
                        <div :key="key" class="list-wrapper">
                            <md-list class=" md-dense">
                                <md-list-item
                                    v-for="(item, keyd) in itemGroup.codes"
                                    :key="keyd"
                                    v-ripple
                                    :class="[
                                        {
                                            dental: !lodash.isEmpty(item.locations) && selectedTeeth.length == 0
                                        }
                                    ]"
                                    class="item"
                                    @click="itemClick($event, item)"
                                >
                                    <div class="item-code">
                                        <h6 v-html="item.code" />
                                    </div>

                                    <div class="md-list-item-text">
                                        <span v-html="item.title" />
                                        <small
                                            v-if="!lodash.isEmpty(item.locations) && selectedTeeth.length == 0"
                                            class="description md-caption text-warning"
                                        >
                                            {{ $t(`${$options.name}.chooseTooth`) }}
                                        </small>
                                        <small v-else class="description md-caption" v-html="item.description" />
                                    </div>

                                    <md-button
                                        :class="[
                                            {
                                                [`md-${classType}`]: isFavorite(item)
                                            },
                                            'md-simple',
                                            'md-list-action',
                                            'md-icon-button'
                                        ]"
                                        :md-ripple="false"
                                    >
                                        <md-icon>star</md-icon>
                                        <md-tooltip md-delay="700">
                                            Add to Favorite
                                        </md-tooltip>
                                    </md-button>
                                </md-list-item>
                            </md-list>
                        </div>
                    </template>
                </custom-collapse>
            </div>

            <div
                v-show="getItems.length == 0 && !hideSlot"
                class="no-plan-space"
                :style="[{ 'max-height': customHeight - 70 + 'px' }, { 'min-height': customHeight - 70 + 'px' }]"
            >
                <md-empty-state
                    :class="getClassType"
                    md-icon="sentiment_dissatisfied"
                    :md-label="$t(`${$options.name}.noFoundTitle`)"
                    :md-description="$t(`${$options.name}.noFoundDescription`)"
                />
            </div>
            <div
                v-show="hideSlot"
                class="no-plan-space"
                :style="[{ 'max-height': customHeight - 70 + 'px' }, { 'min-height': customHeight - 70 + 'px' }]"
            >
                <slot name="empty-space" />
            </div>
        </div>
    </div>
</template>

<script>
import { SlideYDownTransition } from 'vue2-transitions';
import Fuse from 'fuse.js';
import CustomCollapse from './CustomCollapse';

const fuseOptions = {
    findAllMatches: true,
    include: ['score', 'matches'],
    includeMatches: true,
    threshold: 0.5,
    location: 0,
    distance: 3,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        {
            name: 'title',
            weight: 0.1
        },
        {
            name: 'description',
            weight: 0.9
        },
        {
            name: 'code',
            weight: 0.2
        }
    ]
};

export default {
    name: 'TCollapseSearch',
    components: {
        SlideYDownTransition,
        CustomCollapse
    },
    props: {
        selectedTeeth: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        },
        customHeight: {
            type: Number,
            default: () => 1
        },
        favoriteItems: {
            type: Array,
            default: () => []
        },
        recalculateItems: {
            type: Boolean,
            default: () => false
        },
        loading: {
            type: Boolean,
            default: () => false
        },
        hideSlot: {
            type: Boolean,
            default: () => false
        },
        classType: {
            type: String,
            default: () => 'primary'
        },
        type: {
            type: String,
            default: () => 'diagnosis'
        }
    },
    data() {
        return {
            search: '',
            searched: [],
            firstTabs: [],
            toggleAll: false,
            fuse: false,
            //   filter: {},
            itemOriginal: [],
            selecteditem: {}
        };
    },
    computed: {
        filteredItems() {
            return this.getFilteredItems();
        },
        getClassType() {
            return `md-${this.classType}`;
        },
        getToggleAll() {
            if (this.search || this.toggleAll) {
                return true;
            }
            return this.toggleAll;
        },
        getItems() {
            return this.search === '' ? this.searched : this.filteredItems;
        },

        itemsGroup() {
            const dGroup = [];
            this.getItems.forEach(element => {
                dGroup.push(`${element.code}    ${element.title}`);
            });
            return dGroup;
        }
    },
    watch: {
        recalculateItems() {
            this.loadData();
            this.searched = this.lodash.cloneDeep(this.itemOriginal);
        }
    },
    mounted() {
        this.loadData();
        this.searched = this.lodash.cloneDeep(this.itemOriginal);
    },
    methods: {
        isFavorite(item) {
            if (this.favoriteItems.includes(item.code)) {
                return true;
            }
            return false;
        },
        itemClick(event, item) {
            if (event.target.classList.contains('md-icon')) {
                this.$emit('onSetFavoritem', item);
                this.loadData();
            } else {
                this.$emit('onSelected', item);
            }
        },
        loadData() {
            this.search = '';
            this.unshiftFavoriteItems();
            this.searched = this.lodash.cloneDeep(this.items);
            Object.values(this.searched).forEach(group => {
                group.codes.forEach(item => {
                    // eslint-disable-next-line
                    item.constCode = this.lodash.cloneDeep(item.code).slice(0);
                });
            });
            this.itemOriginal = this.lodash.cloneDeep(this.searched);
            this.fuse = new Fuse(this.items, fuseOptions);
        },
        unshiftFavoriteItems() {
            const favoriteItems = {
                code: '★',
                codes: [],
                title: `Favorite ${this.type}`
            };
            if (this.favoriteItems.length > 0) {
                this.favoriteItems.forEach(fitem => {
                    Object.values(this.items).forEach(group => {
                        let favoriteD = null;
                        if (group.codes && group.code !== '★') {
                            favoriteD = group.codes.find(item => item.code === fitem);
                        }
                        if (favoriteD) {
                            favoriteItems.codes.push(favoriteD);
                        }
                    });
                });
            }
            if (favoriteItems.codes.length > 0) {
                const favoriteIndex = this.items.findIndex(item => item.code === '★');
                if (favoriteIndex === -1) {
                    this.items.unshift(favoriteItems);
                } else {
                    this.items.splice(favoriteIndex, 1, favoriteItems);
                }
            } else {
                const favoriteIndex = this.items.findIndex(item => item.code === '★');
                if (favoriteIndex > -1) {
                    this.items.splice(favoriteIndex, 1);
                }
            }
        },
        namespace(object, path) {
            return path.split('.').reduce((value, index) => value[index], object);
        },
        setValue(object, path, newValue) {
            const paths = path.split('.');
            let count = 0;
            // eslint-disable-next-line
            paths.reduce((value, index) => {
                count += 1;
                if (count >= paths.length) {
                    // eslint-disable-next-line
                    value[index] = newValue;
                } else {
                    const nValue = value[index];
                    return nValue;
                }
            }, object);
        },
        highlightText(sourceString, startIndex, endIndex) {
            return `${sourceString.substring(0, startIndex)}<span class="highlight">${sourceString.substring(
                startIndex,
                endIndex + 1
            )}</span>${sourceString.substring(endIndex + 1)}`;
        },
        getFilteredItems() {
            this.searched = this.lodash.cloneDeep(this.itemOriginal).slice(0);
            const group = [];
            this.searched.forEach(itemsGroupe => {
                const fuseResults = new Fuse(itemsGroupe.codes, fuseOptions).search(this.search);
                const results = [];
                if (fuseResults.length > 0) {
                    Object.values(fuseResults).forEach(result => {
                        result.matches.forEach(match => {
                            let text = this.namespace(result.item, match.key);
                            if (text) {
                                let offset = 0;

                                match.indices.forEach(index => {
                                    text = this.highlightText(text, index[0] + offset, index[1] + offset);
                                    offset += 31;
                                });
                                this.setValue(result.item, match.key, text);
                            }
                        });
                        results.push(result.item);
                    });

                    if (results.length > 0) {
                        group.push({
                            code: itemsGroupe.code,
                            title: itemsGroupe.title,
                            codes: results
                        });
                    }
                }
            });
            return group;
        }
    }
};
</script>
