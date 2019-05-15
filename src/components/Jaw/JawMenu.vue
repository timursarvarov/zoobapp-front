<template>
    <div class="tooth-menu__wrapper" :class="direction + '-tooth-menu__wrapper'">
        <!-- :md-offset-x="127+offset"
        :md-offset-y="-36"-->
        <md-menu
            :md-offset-x="127+offset"
            :md-close-on-select="false"
            md-align-trigger
            md-size="medium"
            :disabled="items.length === 0"
            :md-direction="`${direction}-start`"
        >
            <md-button
                :disabled="items.length === 0"
                :class="[
                    { [btnClass]: items.length > 0},
                    { 'md-simple': items.length === 0},
                    { 'tooth-selected': selected},
                    { 'circle': hasOtherTypes}
                ]"
                class="md-button t-tooth-button md-round dropdown-toggle"
                :style="{
                    color: selected ? 'white !important': '',
                    maxWidth: buttonWidth + 'em',
                    minWidth: buttonWidth + 'em',
                    maxHeight: buttonWidth + 'em',
                    minHeight: buttonWidth + 'em',
                    fontSize:'0.8em',
                    }"
                md-menu-trigger
                 >
                 {{toothId | toCurrentTeethSystem(teethSystem)}}
            </md-button>

            <md-menu-content>
                <md-menu-item
                    @click="menuClick($event, item, toothId)"
                    class="tooth-diagnosis-content"
                    v-for="(item, key) in items"
                    :key="key"
                    :md-ripple="false"
                    :style="{'padding-right': item.hasLocations ? '35px' : '0px'}"
                >
                    <div class="tooth-diagnosis-content__item">
                        <div class="tooth-diagnosis-code">
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
                            @click.stop="toggleItemVisibility(item)"
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
                type: Array,
                default: () => [],
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
            offset: {
                type: Number,
                default: () => 5,
            },
            hasOtherTypes: {
                type: Boolean,
                default: () => false,
            },
        },
        data() {
            return {
                isDropped: false,
            };
        },
        methods: {
            toggleItemVisibility(item) {
                this.$emit('toggleItemVisibility', item.id);
            },
            menuClick(event, item, toothId) {
                this.$emit('showItem', item.id, `${toothId}`);
            },
        },
        computed: {
            buttonWidth() {
                if (this.windowWidth < 600) {
                    return 2;
                }
                if (this.windowWidth >= 600 && this.windowWidth < 960) {
                    return 2.2;
                }
                if (this.windowWidth <= 1280 && this.windowWidth > 960) {
                    return 1.8;
                }
                if (this.windowWidth < 1920 && this.windowWidth > 1280) {
                    return 1.8;
                }
                if (this.windowWidth >= 1920) {
                    return 1.8;
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
        color: white !important;
        // font-weight: 600;
    }
    .tooth-selected.circle {
        // cursor: pointer;
        // color: white !important;
           border: 1px solid rgb(255, 255, 255);
        // font-weight: 600;
    }
    .circle:after {
        content: '';
        display: block;
        position: absolute;
        top:0px;
        bottom:0px;
        left:0px;
        right:0px;
        border-radius: 15px;
          border: 1px solid rgb(146, 143, 143);
    }
    .t-tooth-button {
        position: relative;
        .md-ripple {
            min-height: inherit;
            min-width: inherit;
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
                align-self: center!important;
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
    padding-right: 35px;
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
            .tooth-diagnosis-code {
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
