<template lang="html">
            <div class="t-collapse-search-wrapper noselect">
            <md-toolbar class="md-transparent" >
              <div class="md-toolbar-section-end ">
              <md-field class="no-margin md-layout-item ml-auto md-size-50 md-small-size-90" >
                <label>Type to search procedure</label>
                <md-input v-model="search"  > </md-input>
                <slide-y-down-transition>
                  <md-button @click="search = ''"  v-show="search.length > 0" class="md-simple md-icon-button md-dense md-input-action ">
                    <md-icon :style="{ color: getItems.length === 0 ? '#9c27b0 !important': '' }"
                    >close</md-icon>
                </md-button>
                </slide-y-down-transition>
              </md-field>
                 <md-button
                 @click="toggleAll=!toggleAll"
                  class="md-mini md-just-icon md-simple md-round"
                >
                  <md-icon :class="[{rotate:toggleAll }]" >keyboard_arrow_down</md-icon>
                  <md-tooltip md-delay="500">Show all Procedures</md-tooltip>
                </md-button>
              </div>
            </md-toolbar>
            <div class="collapse-wrapper "  :style="[{'max-height': jawHeight - 120 + 'px'},{'min-height': jawHeight - 120 + 'px'}]" >
              <collapse
              v-if="showSlot"
              class=""
                    :collapse="itemsGroup"
                    icon="keyboard_arrow_down"
                    color-collapse="primary"
                    :toggleAll = "getToggleAll"
                  >

                <template  v-for="(procedureGroup, key) in getItems" :slot="'md-collapse-pane-'+(parseInt(key) + 1)" >
                  <div   :key="key">
                    <md-list class=" md-dense" >
                        <md-list-item  @click="procedureClick($event, procedure)"
                        :class="[{dental: !isEmpty(procedure.locations) && selectedTeeth.length == 0 }]"
                        class="item"
                        v-ripple v-for="(procedure, keyd) in procedureGroup.codes" :key="keyd" >


                          <div class="procedure-code" >
                            <h6  v-html="procedure.code"></h6>
                          </div>

                          <div class="md-list-item-text" >

                            <span  v-html="procedure.title"></span>
                            <small class="description text-warning" v-if="!isEmpty(procedure.locations) && selectedTeeth.length == 0" > Please firstly choose a tooth  </small>
                            <small class="description" v-else  v-html="procedure.explain">Horizontal Tabs</small>

                          </div>

                          <md-button  :class="[{'md-primary' : isFavorite(procedure)}, 'md-simple', 'md-list-action', 'md-icon-button']"   :md-ripple="false" >
                            <md-icon >star</md-icon>
                            <md-tooltip  md-delay="700">Add to Favorite</md-tooltip>
                          </md-button>


                        </md-list-item>
                      </md-list>
                      </div>
                </template>
              </collapse>

              <!-- <div> -->
                <slot v-if="!showSlot" name="empty-space"></slot>
              <!-- <div/> -->

              <md-empty-state
                v-if="getItems.length == 0 && showSlot"
                class="md-primary"
                md-icon="sentiment_dissatisfied"
                :md-label="`No matching '${this.itemType}'`"
                md-description="Try another search params">
              </md-empty-state>
            </div>
          </div>

</template>

<script>
    import { SlideYDownTransition } from 'vue2-transitions';
    import { Collapse } from '@/components';
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
                name: 'explain',
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
            Collapse,
            SlideYDownTransition,
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
            jawHeight: {
                type: Number,
                default: () => 1,
            },
            favoriteItems: {
                type: Array,
                default: () => [],
            },
            itemType: {
                type: String,
                default: () => 'Items',
            },
            showSlot: {
                type: Boolean,
                default: () => true,
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
                procedureOriginal: [],
                selectedProcedure: {},
            };
        },
        methods: {
            isFavorite(procedure) {
                if (this.favoriteItems.includes(procedure.code)) {
                    return true;
                }
                return false;
            },
            procedureClick(event, procedure) {
                if (event.target.classList.contains('md-icon')) {
                    this.$emit('onSetFavoritem', procedure);
                    this.loadData();
                } else {
                    this.$emit('onSelected', procedure);
                }
            },
            loadData() {
                this.unshiftFavoriteItems();
                this.searched = this.copyObj(this.items);
                Object.values(this.searched).forEach((group) => {
                    group.codes.forEach((procedure) => {
                        // eslint-disable-next-line
                    procedure.constCode = this.copyObj(procedure.code).slice(0);
                    });
                });
                this.procedureOriginal = this.copyObj(this.searched);
                this.fuse = new Fuse(this.items, fuseOptions);
            },
            unshiftFavoriteItems() {
                const favoriteItems = {
                    code: '★',
                    codes: [],
                    title: `Favorite ${this.itemType}`,
                };
                if (this.favoriteItems.length > 0) {
                    this.favoriteItems.forEach((fProcedure) => {
                        Object.values(this.items).forEach((group) => {
                            let favoriteD = null;
                            if (group.codes && group.code !== '★') {
                                favoriteD = group.codes.find(
                                    procedure => procedure.code === fProcedure,
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
                        procedure => procedure.code === '★',
                    );
                    if (favoriteIndex === -1) {
                        this.items.unshift(favoriteItems);
                    } else {
                        this.items.splice(favoriteIndex, 1, favoriteItems);
                    }
                } else {
                    const favoriteIndex = this.items.findIndex(
                        procedure => procedure.code === '★',
                    );
                    this.items.splice(favoriteIndex, 1);
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
                this.searched = this.copyObj(this.procedureOriginal).slice(0);
                const grooup = [];
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
                            grooup.push({
                                code: itemsGroupe.code,
                                title: itemsGroupe.title,
                                codes: results,
                            });
                        }
                    }
                });
                return grooup;
            },
            recalculateJawProcedure() {
                this.jaw.procedures = JSON.parse(
                    JSON.stringify(this.jawEthalon.procedures),
                );
                this.patient.items.forEach((procedure) => {
                    if (procedure.showInJaw) {
                        Object.keys(procedure.teeth).forEach((toothId) => {
                            Object.keys(procedure.teeth[toothId]).forEach(
                                (kLocation) => {
                                    this.jaw.procedures[toothId][kLocation] = procedure.teeth[toothId][kLocation];
                                },
                            );
                        });
                    }
                });
            },
        },
        computed: {
            filteredItems() {
                return this.getFilteredItems();
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
            this.searched = this.copyObj(this.procedureOriginal);
        },
    };
</script>
<style lang="scss">
.t-collapse-search-wrapper {
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
    .procedure-code {
        margin-right: 24px;
    }
    .collapse-wrapper {
        border-style: solid;
        border-color: rgba(128, 128, 128, 0.212);
        border-width: 1px;
        border-radius: 3px;
        margin: 20px 0 20px 0;
        overflow: hidden;
        overflow-y: scroll;
        padding: 20px 10px 20px 15px;
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
                    top: px;
                }
            }
        }
        .md-collapse-content {
            margin-top: 20px;
            padding: 0 1vw;
        }
        md-error .md-collapse-label:after {
            bottom: 6px;
        }

        .highlight {
            background-color: rgba(255, 255, 21, 0.979);
        }
        .md-list {
            .md-list-item {
                margin: 0;
            }
            background-color: #f7f7f7d5;
            border-style: solid;
            border-color: #eeecec9c;
            border-width: 1px;
            border-radius: 4px;
            margin-bottom: 15px;
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
}
</style>
