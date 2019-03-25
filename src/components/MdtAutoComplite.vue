
<template>
  <md-field
    class="md-autocomplete"
    :class="fieldClasses"
    md-clearable
    :md-inline="isBoxLayout"
  >
    <md-menu
      md-direction="bottom-start"
      :md-dense="mdDense"
      md-align-trigger
      md-full-width
      :md-active.sync="showMenu"
    >
      <md-input
        v-model="searchTerm"
        v-bind="$attrs"
        :id="mdInputId"
        :name="mdInputName"
        :maxlength="mdInputMaxlength"
        :placeholder="mdInputPlaceholder"
        @focus.stop="openOnFocus"
        @blur="hideOptions"
        @input="onInput"
        @click.stop.prevent="openOnFocus"
      />

      <md-menu-content
        :class="contentClasses"
        v-show="hasScopedEmptySlot || hasFilteredItems"
      >

        <div
          class="md-autocomplete-loading"
          v-if="isPromisePending"
        >
          <md-progress-spinner
            :md-diameter="40"
            :md-stroke="4"
            md-mode="indeterminate"
          />
        </div>

        <transition name="fade">

          <div
            class="md-autocomplete-items"
            v-show="hasFilteredItems"
          >
            <md-menu-item
              v-for="(item, index) in getOptions()"
              :key="index"
              @click="selectItem(item, $event)"
            >
              <slot
                name="md-autocomplete-item"
                :item="item"
                :term="searchTerm"
                v-if="$scopedSlots['md-autocomplete-item']"
              />
              <template v-else>{{ item }}</template>
            </md-menu-item>
          </div>
        </transition>

        <md-menu-item v-show="hasScopedEmptySlot && !hasFilteredItems">
          <div class="md-autocomplete-empty">
            <slot
              name="md-autocomplete-empty"
              :term="searchTerm"
            />
          </div>
        </md-menu-item>

      </md-menu-content>
    </md-menu>

    <slot />
  </md-field>
</template>

<script>
/* eslint-disable */
import fuzzy from 'fuzzysearch'
const isPromise = require("is-promise");
export default {
  name: "MdtAutocomplete",
  props: {
    value: {
      type: String,
      required: true
    },
    mdDense: Boolean,
    chooseContent: Boolean,
    mdLayout: {
      type: String,
      default: "floating"
    },
    mdOpenOnFocus: {
      type: Boolean,
      default: true
    },
    mdFuzzySearch: {
      type: Boolean,
      default: true
    },
    mdOptions: {
      type: [Array, Promise],
      required: true
    },
    mdInputName: String,
    mdInputId: String,
    mdInputMaxlength: [String, Number],
    mdInputPlaceholder: [String, Number]
  },
  data() {
    return {
      searchTerm: this.value,
      showMenu: false,
      triggerPopover: false,
      isPromisePending: false,
      filteredAsyncOptions: []
    };
  },

  computed: {
    isBoxLayout() {
      return this.mdLayout === "box";
    },
    fieldClasses() {
      if (this.isBoxLayout) {
        return "md-autocomplete-box";
      }
    },
    contentClasses() {
      if (this.isBoxLayout) {
        return "md-autocomplete-box-content";
      }
    },
    shouldFilter() {
      return this.mdOptions[0] && this.searchTerm;
    },
    filteredStaticOptions() {
      if (this.isPromise(this.mdOptions)) {
        return false;
      }
      const firstItem = this.mdOptions[0];
      if (this.shouldFilter) {
        if (typeof firstItem === "string") {
          return this.filterByString();
        }
        if (typeof firstItem === "object") {
          return this.filterByObject();
        }
      }
      return this.mdOptions;
    },
    hasFilteredItems() {
      return (
       (this.filteredStaticOptions &&
       this.filteredStaticOptions.length > 0) ||
       (this.filteredAsyncOptions &&
        this.filteredAsyncOptions.length > 0)
      );
    },
    hasScopedEmptySlot() {
      return this.$scopedSlots["md-autocomplete-empty"];
    }
  },
  watch: {
    mdOptions: {
      deep: true,
      immediate: true,
      handler() {
        if (this.isPromise(this.mdOptions)) {
          this.isPromisePending = true;
          this.mdOptions.then(options => {
            this.filteredAsyncOptions = options;
            this.isPromisePending = false;
          });
        }
      }
    },
    value(val) {
      this.searchTerm = val;
    }
  },
  methods: {
    getOptions() {
      if (this.isPromise(this.mdOptions)) {
        return this.filteredAsyncOptions;
      }
      return this.filteredStaticOptions;
    },
    isPromise(obj) {
      return isPromise(obj);
    },
    matchText(item) {
        const target = item.toLowerCase()
        const search = this.searchTerm.toLowerCase()
        if (this.mdFuzzySearch ) {
          return fuzzy(search, target)
        }
        return target.includes(search)

      return item;
    },
    filterByString() {
      return this.mdOptions.filter(item => this.matchText(item));
    },
    filterByObject() {
      return this.mdOptions.filter(item => {
        const values = Object.values(item);
        const valuesCount = values.length;
        for (let i = 0; i <= valuesCount; i++) {
          if (typeof values[i] === "string" && this.matchText(values[i])) {
            return true;
          }
        }
      });
    },
    openOnFocus() {
      if (this.mdOpenOnFocus) {
        this.showOptions();
      }
    },
    onInput(value) {
      this.$emit("input", value);
      if (!this.mdOpenOnFocus) {
        this.showOptions();
      }
      if (
        this.searchTerm.constructor
          .toString()
          .match(/function (\w*)/)[1]
          .toLowerCase() !== "inputevent"
      ) {
        this.$emit("md-changed", this.searchTerm);
      }
    },
    showOptions() {
      if (this.showMenu) {
        return false;
      }
      this.showMenu = true;
      this.$nextTick(() => {
        this.triggerPopover = true;
        this.$emit("md-opened");
      });
    },
    hideOptions() {
      this.$nextTick(() => {
        this.triggerPopover = false;
        this.$emit("md-closed");
      });
    },
    selectItem(item, $event) {
      let content = "";
      content = $event.target.textContent.trim();
      this.searchTerm = this.chooseContent ? content : this.searchTerm
      this.$emit("input", this.searchTerm);
      this.$emit("md-selected", item);
      this.hideOptions();
    }
  },
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
