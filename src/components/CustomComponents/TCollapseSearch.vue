<template lang="html">
    <div class="t-collapse-search-wrapper noselect">

        <div v-show="loading"
            class="no-plan-space"
                :style="[{'max-height': customHeight - 70 + 'px'},{'min-height': customHeight - 70 + 'px'}]" >
            <md-empty-state>
                <md-progress-spinner md-mode="indeterminate"/>
            </md-empty-state>
        </div>
        <div v-show="!loading" >

            <md-toolbar  class=" md-transparent no-side-padding md-layout md-alignment-top-space-between collapse-toolbar__items" >
                <div class="collapse-actions md-small-size-100 md-size-50" >
                    <slot name="title-start-1"></slot>
                    <slot name="title-start-2"></slot>
                </div>
                <div class="collapse-actions md-small-size-100 md-size-50" >
                    <div class=" collapse-toolbar__grow">
                        <md-field class="no-margin " >
                            <label>Search {{type}}</label>
                            <md-input v-model="search"  > </md-input>
                            <slide-y-down-transition>
                            <md-button @click="search = ''"  v-show="search.length > 0" class="md-simple md-icon-button md-dense md-input-action ">
                                <md-icon :style="{ color: getItems.length === 0 ? '#9c27b0 !important': '' }"
                                >close</md-icon>
                            </md-button>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <div class="ml-auto collapse-toolbar__nogrow">
                        <md-button
                            @click="toggleAll=!toggleAll"
                            class="md-mini md-just-icon md-simple md-round"
                        >
                            <md-icon :class="[{rotate:toggleAll }]" >keyboard_arrow_down</md-icon>
                            <md-tooltip md-delay="500">Show all {{type}}</md-tooltip>
                        </md-button>
                    </div>
                </div>
            </md-toolbar>

            <div v-show="!hideSlot && getItems.length > 0" class="collapse-wrapper "  :style="[{'max-height': customHeight - 70 + 'px'},{'min-height': customHeight - 70 + 'px'}]" >
                <custom-collapse
                        :colorCollapse="classType"
                        v-show="!hideSlot"
                        class=""
                            :collapse="itemsGroup"
                            icon="keyboard_arrow_down"
                            color-collapse="primary"
                            :toggleAll = "getToggleAll"
                        >

                        <template  v-for="(itemGroup, key) in getItems" :slot="'md-collapse-pane-'+(parseInt(key) + 1)" >
                            <div class="list-wrapper"   :key="key">
                            <md-list class=" md-dense" >
                                <md-list-item  @click="itemClick($event, item)"
                                :class="[{dental: !isEmpty(item.locations) && selectedTeeth.length == 0 }]"
                                class="item"
                                v-ripple v-for="(item, keyd) in itemGroup.codes" :key="keyd" >


                                    <div class="item-code" >
                                    <h6  v-html="item.code"></h6>
                                    </div>

                                    <div class="md-list-item-text" >

                                    <span  v-html="item.title"></span>
                                    <small class="description text-warning" v-if="!isEmpty(item.locations) && selectedTeeth.length == 0" > Please firstly choose a tooth  </small>
                                    <small class="description" v-else  v-html="item.description">Horizontal Tabs</small>

                                    </div>

                                    <md-button  :class="[{[`md-${classType}`] : isFavorite(item)}, 'md-simple', 'md-list-action', 'md-icon-button']"   :md-ripple="false" >
                                    <md-icon >star</md-icon>
                                    <md-tooltip  md-delay="700">Add to Favorite</md-tooltip>
                                    </md-button>


                                </md-list-item>
                                </md-list>
                                </div>
                        </template>
                </custom-collapse>
            </div>

            <div v-show="getItems.length == 0 && !hideSlot"
                class="no-plan-space"
                :style="[{'max-height': customHeight - 70 + 'px'},{'min-height': customHeight - 70 + 'px'}]" >
                <md-empty-state
                    :class="getClassType"
                    md-icon="sentiment_dissatisfied"
                    :md-label="`No matching ${type}`"
                    md-description="Try another search params">
                </md-empty-state>
            </div>
            <div class="no-plan-space"
                :style="[{'max-height': customHeight - 70 + 'px'},{'min-height': customHeight - 70 + 'px'}]" >
                <slot v-show="hideSlot" name="empty-space"></slot>
            </div>
        </div>
    </div>

</template>

<script>
    import { SlideYDownTransition } from 'vue2-transitions';
    import Fuse from 'fuse.js';

    import { tObjProp } from '@/mixins';

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
                weight: 0.1,
            },
            {
                name: 'description',
                weight: 0.9,
            },
            {
                name: 'code',
                weight: 0.2,
            },
        ],
    };

    export default {
        name: 'collapsable-search-panel',
        mixins: [tObjProp],
        components: {
            SlideYDownTransition,
            'custom-collapse': () => import('./CustomCollapse'),
        },
        props: {
            selectedTeeth: {
                type: Array,
                default: () => [],
            },
            items: {
                type: Array,
                default: () => [],
            },
            customHeight: {
                type: Number,
                default: () => 1,
            },
            favoriteItems: {
                type: Array,
                default: () => [],
            },
            recalculateItems: {
                type: Boolean,
                default: () => false,
            },
            loading: {
                type: Boolean,
                default: () => false,
            },
            hideSlot: {
                type: Boolean,
                default: () => false,
            },
            classType: {
                type: String,
                default: () => 'primary',
            },
            type: {
                type: String,
                default: () => 'diagnosis',
            },
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
                selecteditem: {},
            };
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
                this.searched = this.copyObj(this.items);
                Object.values(this.searched).forEach((group) => {
                    group.codes.forEach((item) => {
                        // eslint-disable-next-line
                    item.constCode = this.copyObj(item.code).slice(0);
                    });
                });
                this.itemOriginal = this.copyObj(this.searched);
                this.fuse = new Fuse(this.items, fuseOptions);
            },
            unshiftFavoriteItems() {
                const favoriteItems = {
                    code: '★',
                    codes: [],
                    title: `Favorite ${this.type}`,
                };
                if (this.favoriteItems.length > 0) {
                    this.favoriteItems.forEach((fitem) => {
                        Object.values(this.items).forEach((group) => {
                            let favoriteD = null;
                            if (group.codes && group.code !== '★') {
                                favoriteD = group.codes.find(
                                    item => item.code === fitem,
                                );
                            }
                            if (favoriteD) {
                                favoriteItems.codes.push(favoriteD);
                            }
                        });
                    });
                }
                if (favoriteItems.codes.length > 0) {
                    const favoriteIndex = this.items.findIndex(
                        item => item.code === '★',
                    );
                    if (favoriteIndex === -1) {
                        this.items.unshift(favoriteItems);
                    } else {
                        this.items.splice(favoriteIndex, 1, favoriteItems);
                    }
                } else {
                    const favoriteIndex = this.items.findIndex(
                        item => item.code === '★',
                    );
                    if(favoriteIndex > -1){
                        this.items.splice(favoriteIndex, 1);
                    }
                }
            },
            namespace(object, path) {
                return path
                    .split('.')
                    .reduce((value, index) => value[index], object);
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
                return `${sourceString.substring(
                    0,
                    startIndex,
                )}<span class="highlight">${sourceString.substring(
                    startIndex,
                    endIndex + 1,
                )}</span>${sourceString.substring(endIndex + 1)}`;
            },
            getFilteredItems() {
                this.searched = this.copyObj(this.itemOriginal).slice(0);
                const group = [];
                this.searched.forEach((itemsGroupe) => {
                    const fuseResults = new Fuse(
                        itemsGroupe.codes,
                        fuseOptions,
                    ).search(this.search);
                    const results = [];
                    if (fuseResults.length > 0) {
                        Object.values(fuseResults).forEach((result) => {
                            result.matches.forEach((match) => {
                                let text = this.namespace(result.item, match.key);
                                if (text) {
                                    let offset = 0;

                                    match.indices.forEach((index) => {
                                        text = this.highlightText(
                                            text,
                                            index[0] + offset,
                                            index[1] + offset,
                                        );
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
                                codes: results,
                            });
                        }
                    }
                });
                return group;
            },
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
                this.getItems.forEach((element) => {
                    dGroup.push(`${element.code}    ${element.title}`);
                });
                return dGroup;
            },
        },
        mounted() {
            this.loadData();
            this.searched = this.copyObj(this.itemOriginal);
        },
        watch: {
            recalculateItems() {
                this.loadData();
                this.searched = this.copyObj(this.itemOriginal);
            },
        },
    };
</script>
<style lang="scss">
.t-collapse-search-wrapper {
    .no-margin{
        margin: 0!important;
    }
    .collapse-toolbar__items {
        display: flex;
        justify-content: space-between;
        .collapse-toolbar__grow {
            flex-grow: 1;
        }
        .collapse-toolbar__nogrow {
            // padding-left: 15px
        }
        .collapse-actions{
            flex-grow: 1;
            display: flex;
        }
    }
    .no-side-padding {
        padding-left: 0;
        padding-right: 0;
    }
    width: 100%;
    .md-icon {
        transition: all 250ms ease-in;
        transition-property: all;
        transition-duration: 250ms;
        transition-timing-function: ease-in;
        transition-delay: 0s;
    }
    .rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }
    .item-code {
        margin-right: 24px;
    }
    .action-start {
        max-width: 170px;
    }
    .action-button {
        // max-width: 42px;
        // min-width: 42px;
    }
    .collapse-wrapper {
        background-color: #ececec6b;
        border-radius: 10px;
        overflow: hidden;
        overflow-y: scroll;
        // max-height: 40vh;
        // min-height: 30vh;
        padding: 6px;
        &::-webkit-scrollbar {
            width: 7px;
            // background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: grey;
            border-radius: 7px;
        }

        .md-collapse-label {
            padding: 10px 10px 10px 0;
            overflow: hidden;
            &:after {
                bottom: 0px;
            }
            .md-collapse-title {
                padding-left: 15px;
                font-weight: 400;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: 25px;
                .md-icon {
                    top: 7px;
                }
            }
        }
        .md-error .md-collapse-label:after {
            bottom: 6px;
        }

        .highlight {
            background-color: rgba(255, 255, 21, 0.979);
        }
        .md-list {
            border-radius: 4px;
            .md-list-item {
                margin: 0;
            }
            background-color: transparent;
            // border-style: solid;
            // border-color: #9b9b9b28;
            // box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
            border-width: 1px;
            margin-bottom: 15px;
            padding: 0;
        }
        .md-list-item-content {
            max-height: 64px;
            min-height: 44px;
            height: 44px;
            padding: 8px;
            // background-color: rgba(238, 236, 236, 0.201);
        }
        .dental {
            .md-list-item-text {
                cursor: not-allowed;
            }
        }
        .md-list-item-text {
            cursor: pointer;
        }
        .md-list-action {
            padding-right: 10px;
        }
        // }
        .md-collapse-content {
            margin-top: 20px;
            padding: 0 1vw;
            .list-wrapper {
                background-color: transparent;
            }
        }

        .highlight {
            background-color: rgba(255, 255, 21, 0.979);
        }
        .md-list-item-content {
            max-height: 64px;
            min-height: 44px;
            height: 44px;
            padding: 8px;
            // background-color: rgba(238, 236, 236, 0.201);
        }
        .dental {
            .md-list-item-text {
                cursor: not-allowed;
            }
        }
        .md-list-item-text {
            cursor: pointer;
        }
        .md-list-action {
            padding-right: 10px;
        }
    }
    .no-plan-space {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        max-width: 420px;
        padding: 36px;
        margin: 0 auto;
        position: relative;
        transition: opacity 0.15s cubic-bezier(0, 0, 0.2, 1),
            transform 0.3s cubic-bezier(0, 0, 0.2, 1);
        will-change: transform, opacity;
    }
}
</style>
