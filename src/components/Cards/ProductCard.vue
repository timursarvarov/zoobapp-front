/* eslint-disable vue/valid-v-bind */
<template>
    <md-card
        class="md-card-product"
        :data-count="hoverCount"
        @mouseleave.native="onMouseLeave"
    >
        <md-card-header
            :data-header-animation="headerAnimation"
            :class="[{hovered: imgHovered}, {hinge: headerDown}, {fadeInDown: fixedHeader}]"
            class="md-card-header-image animated"
            @mouseenter.native="onMouseOver"
        >
            <slot name="imageHeader" />
        </md-card-header>

        <md-card-content>
            <div
                v-if="headerAnimation === 'true'"
                class="md-card-action-buttons text-center"
            >
                <md-button
                    v-if="headerDown"
                    class="md-danger md-simple fix-broken-card"
                    @click="fixHeader"
                >
                    <slot name="fixed-button" /> Fix Header!
                </md-button>
                <md-button class="md-simple md-just-icon">
                    <slot name="first-button" />
                </md-button>
                <md-button class="md-success md-simple md-just-icon">
                    <slot name="second-button" />
                </md-button>
                <md-button class="md-danger md-simple md-just-icon">
                    <slot name="third-button" />
                </md-button>
            </div>
            <slot name="title" />
            <slot name="description" />
        </md-card-content>

        <md-card-actions md-alignment="space-between">
            <slot name="footer" />
        </md-card-actions>
    </md-card>
</template>

<script>
export default {
    name: 'ProductCard',
    props: {
        headerAnimation: {
            type: String,
            default: 'true',
        },
    },
    data() {
        return {
            hoverCount: 0,
            imgHovered: false,
            fixedHeader: false,
        };
    },
    computed: {
        headerDown() {
            return this.hoverCount > 15;
        },
    },
    methods: {
        headerBack() {
            this.fixedHeader = false;
        },
        fixHeader() {
            this.hoverCount = 0;
            this.fixedHeader = true;

            setTimeout(this.headerBack, 480);
        },
        onMouseOver() {
            if (this.headerAnimation === 'true') {
                this.imgHovered = true;
                this.hoverCount += 1;
            }
        },
        onMouseLeave() {
            if (this.headerAnimation === 'true') {
                this.imgHovered = false;
            }
        },
    },
};
</script>

<style lang="scss">
</style>
