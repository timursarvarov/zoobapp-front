<template>
    <div class="tooth-menu__wrapper" :class="direction + '-tooth-menu__wrapper'">
        <!-- :md-offset-x="127+offset"
        :md-offset-y="-36"-->
        <md-menu
            :md-offset-x="127+offset"
            :md-close-on-select="false"
            md-align-trigger
            md-size="medium"
            :md-direction="`${direction}-start`"
            @md-opened="opened = !opened"
            @md-closed="opened = !opened"
        >
            <!-- :disabled="items.length === 0 && !hasOtherItemTypes" -->
            <md-button
                :disabled="isEmpty(items)"
                :class="[
                    { 'has-items': items[type] && items[type].length > 0},
                    { [type]: items[type] && items[type].length > 0},
                    { [btnClass]: items[type] && items[type].length > 0},
                    { 'md-simple': (items[type] && items[type].length == 0) && hasOtherItemTypes},
                    { 'tooth-selected': selected},
                    { 'has-other-items': hasOtherItemTypes},
                    { 'circle': opened}
                ]"
                class="md-button t-tooth-button md-round dropdown-toggle"
                :style="{
                    maxWidth: buttonWidth + 'em',
                    minWidth: buttonWidth + 'em',
                    maxHeight: buttonWidth + 'em',
                    minHeight: buttonWidth + 'em',
                    fontSize:'0.8em',
                    }"
                md-menu-trigger
            >{{toothId | toCurrentTeethSystem(teethSystem)}}</md-button>

            <md-menu-content
                class="md-select-menu">
                <template v-for="(subItems, name, index) in items">
                    <md-menu-item :key="index"
                    class="tooth-menu-item item-categoty">
                      <b>{{name | capitilize}}:</b>
                    </md-menu-item>
                    <md-menu-item
                        class="tooth-menu-item"
                        @click="menuClick($event, item, toothId, name)"
                        v-for="(item, key) in subItems"
                        :key="`${key}${index}`"
                        :md-ripple="false"
                        :class="[
                        {'no-locations': item.hasLocations},
                        {[`tooth-${name}-content`]: true}
                        ]"
                    >
                        <div class="tooth-diagnosis-content__item">
                            <div class="tooth-items-code">
                                <span>
                                    <b>{{item.code}}</b>
                                </span>
                            </div>
                            <div class="tooth-diagnosis-text">
                                <span class="tooth-diagnosis-text-item">
                                    <span>{{item.title}}</span>
                                </span>
                            </div>
                        </div>

                        <div v-show="item.hasLocations" class="tooth-diagnosis-actions">
                            <md-button
                                @click.stop="toggleItemVisibility(item, name)"
                                :class="[
                            {'md-info': item.showInJaw}
                            ]"
                                class="md-just-icon md-simple md-round"
                            >
                                <md-icon v-if="item.showInJaw">visibility</md-icon>
                                <md-icon v-else>visibility_off</md-icon>
                            </md-button>
                        </div>
                    </md-menu-item>
                </template>
            </md-menu-content>
        </md-menu>
    </div>
</template>
<script>
    import { tObjProp } from '@/mixins';

    export default {
        name: 'jaw-menu',
        mixins: [tObjProp],
        props: {
            items: {
                type: Object,
                default: () => {},
            },
            selected: {
                type: Boolean,
                default: () => false,
            },
            btnClass: {
                type: String,
                default: () => 'md-primary',
            },
            toothId: {
                type: String,
                default: () => '',
            },
            teethSystem: {
                type: Number,
                default: () => 1,
            },
            windowWidth: {
                type: Number,
                default: () => 1,
            },
            direction: {
                type: String,
                default: () => 'top',
            },
            align: {
                type: String,
                default: () => 'center',
            },
            type: {
                type: String,
                default: () => 'diagnosis',
            },
            offset: {
                type: Number,
                default: () => 5,
            },
            // hasOtherItemTypes: {
            //     type: Boolean,
            //     default: () => false,
            // },
        },
        data() {
            return {
                opened: false,
                hover: '',
            };
        },
        methods: {
            toggleItemVisibility(item, type) {
                this.$emit('toggleItemVisibility', item.id, type);
            },
            menuClick(event, item, toothId, type) {
                const params = {
                    itemId: item.id,
                    toothId,
                    type,
                };
                this.$emit('showItem', params);
            },
        },
        computed: {
            hasOtherItemTypes() {
                let hasItems = false;
                Object.keys(this.items).forEach((category) => {
                    if (category !== this.type && this.items[category].length > 0) {
                        hasItems = true;
                    }
                });
                return hasItems;
            },
            buttonWidth() {
                if (this.windowWidth < 600) {
                    return 2.3;
                }
                if (this.windowWidth >= 600 && this.windowWidth < 960) {
                    return 2.3;
                }
                if (this.windowWidth <= 1280 && this.windowWidth > 960) {
                    return 1.8;
                }
                if (this.windowWidth < 1920 && this.windowWidth > 1280) {
                    return 2.3;
                }
                if (this.windowWidth >= 1920) {
                    return 2.3;
                }
                return 4;
            },
        },
    };
</script>

 <style lang="scss" >
.top-tooth-menu__wrapper {
    top: 0;
    left: 50%;
    transform: translate(-50%, 0.5vh);
}
.bottom-tooth-menu__wrapper {
    left: 50%;
    transform: translate(-50%, -0.5vh);
    bottom: 0;
}
.top-tooth-menu__wrapper,
.down-tooth-menu__wrapper,
.tooth-menu__wrapper {
    position: absolute;

    .dropdown-menu-center {
        transform: translate(-50%, 0) !important;
    }
    .tooth-selected {
        cursor: pointer;
    }
    .t-tooth-button.tooth-selected {
        color: white !important;
        // background-color: white!important;
    }
    .tooth-selected{
        .t-tooth-button{
            color: white !important;
            background-color:none !important;
        }
        // color: grey!important;
    }
    .has-items {
           box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.2),
            0 2px 5px 1px rgba(0, 0, 0, 0.14),
            0 3px 7px 2px rgba(0, 0, 0, 0.12) !important;
    }
    .anamnesis .anamnesis:active{
        background-color: #00bcd4!important;
    }
    .diagnosis {
        background-color: #9c27b0!important;
    }
    .diagnosis:active{
        background-color: #9c27b0!important;
    }
    .procedures .procedures:active {
        background-color: #4caf50!important;
    }
    .tooth-selected.t-tooth-button:not(.has-other-items):not(.has-items):not(.anamnesis):not(.diagnosis):not(.procedures)   {
        // box-shadow:none;
        background-color: transparent !important;
        color: white!important;
        box-shadow:none;
        font-weight: 800;
    }
    .t-tooth-button:not(.has-other-items):not(.has-items):not(.anamnesis):not(.diagnosis):not(.procedures):not(.tooth-selected)   {
        // box-shadow:none;
        background-color: white!important;
        color: grey!important;
    }
    .t-tooth-button:hover {
        box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12)!important;
    }
    .t-tooth-button.circle {
           box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12)!important;
    }
    .t-tooth-button.has-other-items:not(.anamnesis):not(.diagnosis):not(.procedures) {
          background-color: white!important;
        color: grey!important;
           box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.2),
            0 2px 5px 1px rgba(0, 0, 0, 0.14),
            0 3px 7px 2px rgba(0, 0, 0, 0.12) ;
    }
    .t-tooth-button {
        // background-color: white!important;
       box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
        position: relative;
        .md-ripple {
            min-height: 0;
            min-width: 0;
            max-height: inherit;
            max-width: inherit;
            padding: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .md-button-content {
                display: flex;
                align-items: center;
                justify-content: center;
                align-self: center !important;
                margin: auto;
                span {
                    align-self: center;
                }
            }
            &:after {
                display: none !important;
                // display: inline-block;
                // width: 0;
                // height: 0;
                // margin: 0!important;
            }
        }
    }
}
.tooth-diagnosis-content {
    .md-list-item-button:hover {
        color: white!important;
        background-color: #4caf50 !important;
        box-shadow: 0 2px 2px 0 rgba(76, 175, 80, 0.14),
            0 3px 1px -2px rgba(76, 175, 80, 0.2),
            0 1px 5px 0 rgba(76, 175, 80, 0.12);
    }
}
.tooth-anamnesis-content {
    .md-list-item-button:hover {
        color: white!important;
        background-color: #808080 !important;
        box-shadow: 0 2px 2px 0 rgba(76, 175, 80, 0.14),
            0 3px 1px -2px rgba(76, 175, 80, 0.2),
            0 1px 5px 0 rgba(76, 175, 80, 0.12);
    }
}
.tooth-procedures-content {
    .md-list-item-button:hover {
        color: white!important;
        background-color: #9c27b0 !important;
        box-shadow: 0 2px 2px 0 rgba(76, 175, 80, 0.14),
            0 3px 1px -2px rgba(76, 175, 80, 0.2),
            0 1px 5px 0 rgba(76, 175, 80, 0.12);
    }
}
 .item-categoty{
    min-height: 20px !important;
    padding: 5px 5px;
    margin: 0 .3125rem!important;
    align-items: center;
    position: relative;
        .md-list-item-container {
            .md-list-item-content.md-ripple{
            min-height: 15px!important;
            padding: 5px !important;
            // border-radius: 3px;
            }
        }
    }
     .no-locations{
        padding-right: 35px;
    }
.tooth-menu-item:not(.item-categoty) {
     margin: 0 .3125rem!important;
    align-items: center;
    position: relative;
    .md-list-item-button {
        overflow: visible;
    }

    .md-list-item-container {
        .md-list-item-content.md-ripple {
            padding: 5px !important;
            border-radius: 3px;
        }
        .md-list-item-content {
            display: flex;
            font-size: 12px;
            min-height: 12px !important;
            margin-right: 30px;
            span {
                padding: 0 0 0 5px !important;
            }
            cursor: pointer;
            .tooth-diagnosis-content__item {
                display: flex;
                flex-grow: 1;
                overflow: hidden;
                // margin-right: 30px;
            }
            .tooth-items-code {
                padding-right: 5px;
            }
            .md-list-item-text {
                position: relative;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .tooth-diagnosis-text {
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                // padding:0 30px 0 0 !important;
                .tooth-diagnosis-text-item {
                    padding: 0 !important;
                }
            }
        }
        .tooth-diagnosis-actions {
            position: absolute;
            right: -30px;
            .md-button {
                max-height: 17px;
                min-width: 24px;
                max-width: 24px;
                padding: 0;
                .md-ripple {
                    min-height: inherit;
                    min-width: inherit;
                    padding: 0 !important;
                }
            }
        }
    }
}
</style>
