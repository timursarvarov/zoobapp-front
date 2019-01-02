<template lang="html">
  <div class="set-diagnose-form">
    <div class="md-layout">
    <md-field class="md-layout-item">
      <label>Type to search diagnose</label>
      <md-input v-model="search"  ></md-input>
    </md-field>
    <div class="md-layout-item md-size-30">
      <md-checkbox v-model="toggleAll" :disabled='search.length > 0' >Show all</md-checkbox>
    </div>
    </div>
       <collapse-transition>
          <div class="collapse-wrapper">
            <collapse
                  :collapse="diagnosisGroup"
                  icon="keyboard_arrow_down"
                  color-collapse="success"
                  :toggleAll = "getToggleAll"

                >

              <template  v-for="(diagnoseGroup, key) in getDiagnosis" :slot="'md-collapse-pane-'+(parseInt(key) + 1)" >
                  <md-table
                  v-model="diagnoseGroup.codes"
                  @md-selected="onSelect"
                >

                  <md-table-row
                    slot="md-table-row"
                    slot-scope="{ item }"
                    md-auto-select
                  >
                    <md-table-cell v-ripple v-html="item.code" > </md-table-cell>
                    <md-table-cell  v-ripple.900> <span  v-html="item.title"></span> <br/> <span class="helper"  v-html="item.explain"></span>  </md-table-cell>
                    <md-table-cell>
                    </md-table-cell>
                  </md-table-row>
                </md-table>
              </template>
            </collapse>
          </div>
       </collapse-transition>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import { Collapse } from '@/components';
  import Fuse from 'fuse.js';
  import { CollapseTransition } from 'vue2-transitions';

  const fuseOptions = {
    findAllMatches: true,
    // tokenize: true,
    // matchAllTokens: true,
    // shouldSort: true,
    include: ['score', 'matches'],
    includeMatches: true,
    threshold: 0.5,
    location: 0,
    distance: 3,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    // keys: ['title', 'explain', 'code'],
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
    components: {
      Collapse,
      CollapseTransition,
    },
    data() {
      return {
        search: '',
        searched: [],
        firstTabs: [],
        toggleAll: false,

        fuse: false,
        filter: '',
        diagnoseOriginal: [],
        users: [],
      };
    },
    methods: {
      onSelect() {
        console.log(11);
      },
      copyObj(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      loadData() {
        this.searched = this.copyObj(this.diagnosis);
        this.diagnoseOriginal = this.copyObj(this.searched);
        this.fuse = new Fuse(this.diagnosis, fuseOptions);
      },
      namespace(object, path) {
        return path.split('.').reduce((value, index) => value[index], object);
      },
      setValue(object, path, newValue) {
        const paths = path.split('.');
        let count = 0;
        paths.reduce((value, index) => {
          count++;
          if (count >= paths.length) {
            value[index] = newValue;
          } else {
            return value[index];
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
    },
    computed: {
      ...mapGetters({
        diagnosis: 'getDiagnosis',
      }),
      filteredDiagnosis() {
        this.searched = this.copyObj(this.diagnoseOriginal);
        const grooup = [];
        this.searched.forEach((diagnosisGroupe) => {
          const fuseResults = new Fuse(diagnosisGroupe.codes, fuseOptions).search(
            this.search,
          );
          const results = [];
          console.log(fuseResults);
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
              console.log(results);
              grooup.push({
                code: diagnosisGroupe.code,
                title: diagnosisGroupe.title,
                codes: results,
              });
            }
          }
        });
        return grooup;
      },
      getToggleAll() {
        if (this.search || this.toggleAll) {
          return true;
        }
        return this.toggleAll;
      },
      getDiagnosis() {
        this.searched = this.copyObj(this.diagnoseOriginal);
        return this.search === '' ? this.searched : this.filteredDiagnosis;
      },
      diagnosisGroup() {
        const dGroup = [];
        this.getDiagnosis.forEach((element) => {
          dGroup.push(`${element.code}  ${element.title}`);
        });
        return dGroup;
      },
    },
    mounted() {
      this.loadData();
    },
  };
</script>
<style lang="scss">
.set-diagnose-form {
  .collapse-wrapper {
    margin: 20px 0 20px 0;
    overflow: hidden;
    overflow-y: scroll;
    max-height: 50vh;
    &::-webkit-scrollbar {
      width: 7px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 7px;
    }
    .md-collapse-label {
      padding: 5px 10px 15px 0;
      .md-collapse-title {
        font-weight: 400;
        .md-icon {
          top: 5px;
        }
      }
    }
    .md-collapse-label:after {
      bottom: 6px;
    }
    .highlight {
      background-color: #ffc;
    }
    .helper {
      font-weight: 400;
      font-size: 11px;
    }
  }
}
</style>
