<template lang="html">
            <div>
            <md-toolbar class="md-transparent" >
              <div class="md-toolbar-section-end ">
              <md-field class="no-margin md-layout-item ml-auto md-size-50 md-small-size-90" >
                <label>Type to search treatment</label>
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

            <div class="collapse-wrapper md-layout md-gutter"  :style="[{'max-height': jawHeight - 120 + 'px'}]" >
              <collapse
              v-if="showSlot"
              class="md-layout-item md-size-100"
                    :collapse="itemsGroup"
                    icon="keyboard_arrow_down"
                    color-collapse="primary"
                    :toggleAll = "getToggleAll"
                  >

                <template  v-for="(treatmentGroup, key) in getItems" :slot="'md-collapse-pane-'+(parseInt(key) + 1)" >
                  <div   :key="key">
                    <md-list class=" md-dense" >
                        <md-list-item  @click="treatmentClick($event, treatment)"
                        :class="[{dental: !isEmpty(treatment.locations) && selectedTeeth.length == 0 }]"
                        class="item"
                        v-ripple v-for="(treatment, keyd) in treatmentGroup.codes" :key="keyd" >


                          <div class="treatment-code" >
                            <h6  v-html="treatment.code"></h6>
                          </div>

                          <div class="md-list-item-text" >

                            <span  v-html="treatment.title"></span>
                            <small class="description text-warning" v-if="!isEmpty(treatment.locations) && selectedTeeth.length == 0" > Please firstly choose a tooth  </small>
                            <small class="description" v-else  v-html="treatment.explain">Horizontal Tabs</small>

                          </div>

                          <md-button  :class="[{'md-primary' : isFavorite(treatment)}, 'md-simple', 'md-list-action', 'md-icon-button']"   :md-ripple="false" >
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
          treatmentOriginal: [],
          selectedTreatment: {},
        };
      },
      methods: {
        isFavorite(treatment) {
          if (this.favoriteItems.includes(treatment.code)) {
            return true;
          }
          return false;
        },
        treatmentClick(event, treatment) {
          if (event.target.classList.contains('md-icon')) {
            this.$emit('onSetFavoritem', treatment);
            this.loadData();
          } else {
            this.$emit('onSelected', treatment);
          }
        },
        loadData() {
          this.unshiftFavoriteItems();
          this.searched = this.copyObj(this.items);
          Object.values(this.searched).forEach((group) => {
            group.codes.forEach((treatment) => {
              // eslint-disable-next-line
          treatment.constCode = this.copyObj(treatment.code).slice(0);
            });
          });
          this.treatmentOriginal = this.copyObj(this.searched);
          this.fuse = new Fuse(this.items, fuseOptions);
        },
        unshiftFavoriteItems() {
          const favoriteItems = {
            code: '★',
            codes: [],
            title: `Favorite ${this.itemType}`,
          };
          if (this.favoriteItems.length > 0) {
            this.favoriteItems.forEach((fTreatment) => {
              Object.values(this.items).forEach((group) => {
                let favoriteD = null;
                if (group.codes && group.code !== '★') {
                  favoriteD = group.codes.find(
                    treatment => treatment.code === fTreatment,
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
              treatment => treatment.code === '★',
            );
            if (favoriteIndex === -1) {
              this.items.unshift(favoriteItems);
            } else {
              this.items.splice(favoriteIndex, 1, favoriteItems);
            }
          } else {
            const favoriteIndex = this.items.findIndex(
              treatment => treatment.code === '★',
            );
            this.items.splice(favoriteIndex, 1);
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
          return `${sourceString.substring(
            0,
            startIndex,
          )}<span class="highlight">${sourceString.substring(
            startIndex,
            endIndex + 1,
          )}</span>${sourceString.substring(endIndex + 1)}`;
        },
        getFilteredItems() {
          this.searched = this.copyObj(this.treatmentOriginal).slice(0);
          const grooup = [];
          this.searched.forEach((itemsGroupe) => {
            const fuseResults = new Fuse(itemsGroupe.codes, fuseOptions).search(
              this.search,
            );
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
        recalculateJawTreatment() {
          this.jaw.jawTreatment = JSON.parse(
            JSON.stringify(this.jawEthalon.jawTreatment),
          );
          this.patient.items.forEach((treatment) => {
            if (treatment.showInJaw) {
              Object.keys(treatment.teeth).forEach((toothId) => {
                Object.keys(treatment.teeth[toothId]).forEach((kLocation) => {
                  this.jaw.jawTreatment[toothId][kLocation] = treatment.teeth[toothId][kLocation];
                });
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
        this.searched = this.copyObj(this.treatmentOriginal);
      },
    };
</script>
<style lang="scss">
.set-treatment-form {
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
  .treatment-code {
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
    padding: 20px 10px 20px 10px;
    &::-webkit-scrollbar {
      width: 7px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 7px;
    }
    .md-collapse-label {
      padding: 0px 10px 25px 0;
      overflow: hidden;
      .md-collapse-title {
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 25px;
        .md-icon {
          top: 0;
        }
      }
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
