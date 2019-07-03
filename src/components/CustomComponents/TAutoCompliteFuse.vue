
<template>
    <md-field class="md-autocomplete" :class="fieldClasses" md-clearable :md-inline="isBoxLayout">
        <md-menu
            md-direction="bottom-start"
            :md-dense="mdDense"
            md-align-trigger
            :md-active.sync="showMenu"
            md-size="auto"
            :mdCloseOnClick="true"
            :mdCloseOnSelect="true"
        >
            <!-- md-full-width -->
            <md-input
                tabindex="-1"
                ref='input'
                v-model="searchTerm"
                v-bind="$attrs"
                :id="mdInputId"
                :name="mdInputName"
                :maxlength="mdInputMaxlength"
                :placeholder="mdInputPlaceholder"
                @focus.stop="openOnFocus"
                @input="onInput"
                @keyup.down="openOnFocus, mooveFocusItems(0)"
                @click.stop.prevent="openOnFocus"
                @keyup.up="mooveFocusItems(-1)"
                @blur="hideOptions"
            />
            <md-menu-content
                :class="contentClasses"
                v-show="hasScopedEmptySlot || hasFilteredItems"
                ref="scrolable"
            >
                <div class="md-autocomplete-loading" v-if="isPromisePending">
                    <md-progress-spinner :md-diameter="40" :md-stroke="4" md-mode="indeterminate" />
                </div>

                <transition name="fade">
                    <div
                        class="md-autocomplete-items"
                        v-show="hasFilteredItems"
                        ref="md-menu-content"
                    >
                        <md-menu-item
                            :id="index + 0"
                            class="list-item"
                            tabindex="-1"
                            v-for="(item, index) in list"
                            :key="index + 0"
                            @click.stop.prevent="selectItem(item, $event)"
                            v-on="$listeners"
                            :ref=" 'item' + index"
                            @keyup.down="mooveFocusItems(index+1)"
                            @keyup.up="mooveFocusItems(index-1)"
                        >
                            <!-- @click[canClick]="cantClick" -->
                            <slot
                                name="md-autocomplete-item"
                                :item="item"
                                :index="index"
                                :term="searchTerm"
                                v-if="$scopedSlots['md-autocomplete-item']"
                            />
                            <template v-else>{{ item }}</template>
                        </md-menu-item>
                        <infinite-loading
                        :key="list.length"
                            @infinite="infiniteHandler"
                            :identifier="infiniteId"
                        >

                            <div slot="spinner">
                                <md-progress-spinner
                                    :md-diameter="40"
                                    :md-stroke="4"
                                    md-mode="indeterminate"
                                />
                            </div>
                            <div slot="no-more">
                                <md-subheader>No more manipulations</md-subheader>
                                </div>
                            <div slot="no-results">No results message</div>
                            <div slot="error" slot-scope="{ trigger }">
                                Error message, click
                                <a href="javascript:;" @click="trigger">here</a> to retry
                            </div>
                        </infinite-loading>
                    </div>
                </transition>

                <md-menu-item v-show="hasScopedEmptySlot && !hasFilteredItems">
                    <div class="md-autocomplete-empty">
                        <slot name="md-autocomplete-empty" :term="searchTerm" />
                    </div>
                </md-menu-item>
            </md-menu-content>
        </md-menu>

        <slot />
    </md-field>
</template>

<script>
/* eslint-disable */
import fuzzy from "fuzzysearch";
import { reject, Promise } from 'q';
import InfiniteLoading from 'vue-infinite-loading';
const isPromise = require("is-promise");
export default {
    components:{
        InfiniteLoading,
    },
    name: "t-autocomplete-fuse",
    props: {
        value: {
            type: String,
            required: true,
             default:'',
        },
        stepSize: {
            type: Number,
            default: 20,
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
            list:[],
            callbackLauncher: null,
            blur: false,
            searching: false,
            showIfinite: false,
            busy: false,
            step: 1,
            infiniteId: 1,
            data: [],
            searchTerm: this.value,
            showMenu: false,
            triggerPopover: false,
            isPromisePending: false,
            filteredAsyncOptions: []
        };
    },

   
    methods: {
        
        con($event){
            console.log($event);
        },
            infiniteHandler($state) {
                this.filterOptions()
                    .then(res => {
                        this.step += 1;
                        if(res.length < this.stepSize){
                            $state.complete();
                        }else{
                            $state.loaded();
                        }
                    })
                    .catch((err) => {
                        $state.error();
                    });
            },
        filterOptions(e){
            let promise = new Promise((resolve, reject) => {
                const from = this.step === 1 ? 0 : (this.step * this.stepSize)-this.stepSize;
                const to = this.step * this.stepSize
                if(this.value){
                    const items = this.filteredStaticOptions.slice(from, to)
                    if (items.length > 0){
                        if(this.step===1){
                            this.list = items
                        }else{
                            items.forEach(item=>{
                                this.list.push(item)
                            });
                        }
                        resolve(items)
                    }else{
                        resolve(items)
                        reject(err)
                    }
                }else{
                    const items = this.mdOptions.slice(from, to)
                    if (items.length > 0){
                        if(this.step===1){
                            this.list = items
                        }else{
                            items.forEach(item=>{
                                this.list.push(item)
                            });
                        }
                        resolve(items)
                    }else{
                         resolve(items)
                        }
                        reject(err)
                }

            });
            return promise

        },
        reloadInfin() {
             new Promise(resolve => {
                this.searching = true;
                const vm = this;
                const DELAY = 400;
                if (this.callbackLauncher) {
                    clearTimeout(vm.callbackLauncher);
                }

                this.callbackLauncher = setTimeout(() => {
                    resolve(
                        vm.step = 1,
                        vm.infiniteId += 1,
                        vm.filterOptions('reloadInfin')
                            .then(res => {
                                vm.searching = false;
                            })
                            .catch((err) => {
                                vm.searching = false;
                            }),
                    );
                }, DELAY);
                })
        },
        mooveFocusItems(e) {
            this.$nextTick(() => {
                if (this.$refs && this.$refs["md-menu-content"]) {
                    let index = e;
                    const length = this.$refs["md-menu-content"].children
                        .length;
                    if (e === -1) {
                        index = length - 1;
                    } else if (e === length) {
                        index = 0;
                    }
                    console.log(  this.$refs["md-menu-content"].children[index].querySelector("button"))
                    if (this.$refs["item0"] ) {
                        if(this.$refs["md-menu-content"].children[index].querySelector("button")){
                            this.$refs["md-menu-content"].children[index]
                                .querySelector("button")
                                .focus();
                        }else{
                            index = 0;
                            this.$refs["md-menu-content"].children[index]
                                .querySelector("button")
                                .focus();
                        }
                    }
                }
            });
        },
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
            const target = item.toLowerCase();
            const search = this.searchTerm.toLowerCase();
            if (this.mdFuzzySearch) {
                return fuzzy(search, target);
            }
            return target.includes(search);

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
                    if (
                        typeof values[i] === "string" &&
                        this.matchText(values[i])
                    ) {
                        return true;
                    }
                }
            });
        },
      
        openOnFocus() {
            if (this.mdOpenOnFocus) {
                this.showOptions();
                this.$emit('focus')
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
            this.blur = false;
            if (this.showMenu) {
                return false;
            }
            this.showMenu = true;
            this.$nextTick(() => {
                this.triggerPopover = true;
                this.$emit("md-opened");
                this.initiate();
            });
        },
        hideOptions(e) {
            this.$nextTick(() => {
                this.triggerPopover = false;
                this.$emit("md-closed");
                const insideComp =
                    e &&
                    e.target &&
                    e.target.classList.contains("md-button-clean");
                if (e !== undefined && !insideComp) {
                    this.$emit("blur");
                }
            });
        },
        selectItem(item, $event) {

                this.blur = true;
                let content = "";
                content = $event.target.textContent.trim();
                this.searchTerm = this.chooseContent ? content : this.searchTerm;
                this.$emit("input", this.searchTerm);
                this.$emit("md-selected", item);
                 console.log(item.title);
                 console.log(this.$attrs);
                 console.log($event.isTrusted);
                //  console.log(this.$listeners);
                // this.$off();
                // console.log(this.$listeners);
        },
        initiate() {
             if (this.$refs && this.$refs["scroll"]) {
              const elList = this.$refs["scroll"]
               elList.addEventListener('scroll', () => {
                })
          }
        }
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
            this.reloadInfin();
            if(val){
                this.showOptions();
            }
        }
    },
    mounted(){
          this.initiate();
          this.reloadInfin();
          let vm=this;
    }
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
.md-menu-content:not(.md-select-menu)
    .md-menu-content-container
    .md-list
    .md-list-item
    .md-list-item-button:focus {
    background-color: #9c27b0 !important;
    -webkit-box-shadow: 0 12px 20px -10px rgba(156, 39, 176, 0.28),
        0 4px 20px 0px rgba(0, 0, 0, 0.12),
        0 7px 8px -5px rgba(156, 39, 176, 0.2);
    box-shadow: 0 12px 20px -10px rgba(156, 39, 176, 0.28),
        0 4px 20px 0px rgba(0, 0, 0, 0.12),
        0 7px 8px -5px rgba(156, 39, 176, 0.2);
    color: #fff !important;
}

    .md-menu-content{
        width: auto !important; max-width: none!important;
}
</style>
