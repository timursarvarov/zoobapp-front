<template>
    <md-card class="md-card-tabs" :class="[{ 'flex-column': flexColumn }, { 'nav-pills-icons': navPillsIcons }, { 'md-card-plain': plain }]">
        <md-card-header>
            <slot name="header-title" />
        </md-card-header>
        <md-card-content>
            <md-list class="nav-tabs">
                <md-list-item
                    v-for="(item, index) in tabName"
                    :key="item"
                    :class="[{ active: isActivePanel(tabName[index]) }, { [getColorButton(colorButton)]: isActivePanel(tabName[index]) }]"
                    @click="switchPanel(tabName[index]), $emit('onChangeTab', index)"
                >
                    {{ tabName[index] }}
                    <md-icon v-if="navPillsIcons">
                        {{ tabIcon[index] }}
                    </md-icon>
                </md-list-item>
            </md-list>

            <transition name="fade" mode="out-in">
                <div class="tab-content">
                    <template v-for="(item, index) in tabName">
                        <template v-if="isActivePanel(tabName[index])">
                            <div :key="item" :class="getTabContent(index + 1)">
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
    name: 'Tabs',
    props: {
        flexColumn: Boolean,
        navPillsIcons: Boolean,
        plain: Boolean,
        tabName: Array,
        tabIcon: Array,
        colorButton: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            activePanel: this.tabName[0]
        };
    },
    computed: {},
    methods: {
        switchPanel(panel) {
            this.activePanel = panel;
        },
        isActivePanel(panel) {
            return this.activePanel === panel;
        },
        getColorButton(colorButton) {
            return `md-${colorButton}`;
        },
        getTabContent(index) {
            return `tab-pane-${index}`;
        }
    }
};
</script>

<style lang="scss"></style>
