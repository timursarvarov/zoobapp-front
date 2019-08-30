<template>
    <md-card
        :data-count="hoverCount"
        class="md-card-chart"
        @mouseleave.native="onMouseLeave"
    >
        <md-card-header
            :data-header-animation="headerAnimation"
            :class="[
                {hovered: imgHovered},
                {hinge: headerDown},
                {fadeInDown: fixedHeader},
                {animated: true},
                {[getClass(backgroundColor)]: true},
                {'md-card-header-text': headerText},
                {'md-card-header-icon': headerIcon}]"
            @mouseenter.native="onMouseOver"
        >
            <div
                v-if="chartInsideHeader"
                :id="chartId"
                class="ct-chart"
            />
            <slot name="chartInsideHeader" />
        </md-card-header>

        <md-card-content>
            <div
                v-if="chartInsideContent"
                :id="chartId"
                class="ct-chart"
            />
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
                <slot name="first-button" />
                <slot name="second-button" />
                <slot name="third-button" />
            </div>
            <slot name="content" />
        </md-card-content>

        <md-card-actions
            v-if="!noFooter"
            md-alignment="left"
        >
            <slot name="footer" />
        </md-card-actions>
    </md-card>
</template>
<script>
export default {
    name: 'ChartCard',
    props: {
        headerText: Boolean,
        headerIcon: Boolean,
        noFooter: Boolean,
        chartInsideContent: Boolean,
        chartInsideHeader: Boolean,
        chartType: {
            type: String,
            default: 'Line', // Line | Pie | Bar
        },
        headerAnimation: {
            type: String,
            default: 'true',
        },
        chartOptions: {
            type: Object,
            default: () => ({}),
        },
        chartResponsiveOptions: {
            type: Array,
            default: () => [],
        },
        chartAnimation: {
            type: Array,
            default: () => [],
        },
        chartData: {
            type: Object,
            default: () => ({
                labels: [],
                series: [],
            }),
        },
        backgroundColor: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            hoverCount: 0,
            imgHovered: false,
            fixedHeader: false,
            chartId: 'no-id',
        };
    },
    computed: {
        headerDown() {
            return this.hoverCount > 15;
        },
    },
    mounted() {
        this.updateChartId();
        this.$nextTick(this.initChart);
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
                this.hoverCount = +1;
            }
        },
        onMouseLeave() {
            if (this.headerAnimation === 'true') {
                this.imgHovered = false;
            }
        },

        getClass(backgroundColor) {
            return `md-card-header-${backgroundColor}`;
        },
        /** *
             * Initializes the chart by merging the chart
             *  options sent via props and the default chart options
             */
        initChart() {
            const chartIdQuery = `#${this.chartId}`;
            this.$Chartist[this.chartType](
                chartIdQuery,
                this.chartData,
                this.chartOptions,
                this.chartAnimation,
            );
        },
        /** *
             * Assigns a random id to the chart
             */
        updateChartId() {
            const currentTime = new Date().getTime().toString();
            const randomInt = this.getRandomInt(0, currentTime);
            this.chartId = `div_${randomInt}`;
        },
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
    },
};
</script>
