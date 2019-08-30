<template>
    <md-card
        class="md-card-tabs"
        :class="[
            {'flex-column': flexColumn},
            {'nav-pills-iconsd': navPillsIcons},
            {'md-card-plain': plain}
        ]"
    >
        <md-card-header>
            <slot name="header-title" />
        </md-card-header>
        <md-card-content>
            <md-list class="nav-tabs">
                <md-list-item
                    v-for="(item, index) of tabName"
                    :key="item.ID"
                    :class="[
                        {active: isActivePanel(tabName[index])},
                        {[getColorButton(colorButton)]: isActivePanel(tabName[index])}]"
                    @click="switchPanel(tabName[index]), $emit('onChangeTab', item)"
                >
                    <div class="md-button-content">
                        {{ tabName[index].name | capitilize }}
                        <small
                            v-if="tabName[index].price"
                        >{{ tabName[index].price }}</small>
                        <md-icon v-if="navPillsIcons">
                            {{ tabName[index].icon }}
                        </md-icon>
                        <span
                            v-if="tabName[index].state"
                            :style="{background: tabName[index].background}"
                            class="notification"
                        >{{ tabName[index].state }}</span>
                    </div>
                </md-list-item>
            </md-list>

            <transition
                name="fade"
                mode="out-in"
            >
                <div class="tab-content">
                    <template v-for="(item, index) in tabName">
                        <template v-if="isActivePanel(tabName[index])">
                            <div
                                :key="item.ID"
                                :class="getTabContent(index + 1)"
                            >
                                <slot :name="getTabContent(index + 1)">
                                    This is the default text!
                                </slot>
                            </div>
                        </template>
                    </template>
                </div>
            </transition>
        </md-card-content>
        <md-card-actions>
            <slot name="footer-actions" />
        </md-card-actions>
    </md-card>
</template>

<script>
export default {
    name: 'TTabs',
    props: {
        flexColumn: Boolean,
        navPillsIcons: Boolean,
        plain: Boolean,
        tabIcon: Array,
        tabName: {
            type: Array,
            default: () => {},
        },
        tabStatus: {
            type: Array,
            default: () => {},
        },
        colorButton: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            activePanel: this.tabName[this.selectedPanelIndex()],
        };
    },
    computed: {},
    methods: {
        switchPanel(panel) {
            console.log(panel);
            this.activePanel = panel;
        },
        isActivePanel(panel) {
            return this.activePanel.ID === panel.ID;
        },
        getColorButton(colorButton) {
            return `md-${colorButton}`;
        },
        getTabContent(index) {
            return `tab-pane-${index}`;
        },
        selectedPanelIndex() {
            return 0;
        },
    },
};
</script>

<style lang="scss" >
.md-card-tabs {
    .nav-tabs {
        overflow-x: scroll !important;
        overflow: hIDden;
        padding: 12px 15px !important;
        &::-webkit-scrollbar {
            height: 7px;
            background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgba(128, 128, 128, 0.63);
            border-radius: 7px;
        }
    }
    .md-list-item-button {
        overflow: visible;
        .md-ripple {
            text-transform: none;
            .notification {
                text-transform: uppercase;
                z-index: 20;
                position: absolute;
                top: -8px !important;
                border: 1px solID #fff;
                transform: translate(50%, -8px);
                font-size: 9px;
                color: #ffffff;
                min-width: 20px;
                padding: 1px 5px !important;
                height: 20px;
                border-radius: 10px !important;
                text-align: center;
                line-height: 16px;
                display: block;
                width: fit-content;
            }
        }
    }
}
</style>
