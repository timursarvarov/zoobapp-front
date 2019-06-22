<template>
    <div>
        <div class="header text-center">
            <h3 class="title">FullCalendar.io</h3>
            <p class="category">
                Handcrafted by our friends from
                <a
                    target="_blank"
                    href="https://fullcalendar.io/"
                >FullCalendar.io</a>. Please checkout the
                <a
                    href="https://fullcalendar.io/docs"
                    target="_blank"
                >full documentation</a>.
            </p>
        </div>

        <div class="md-layout">
            <div class="md-layout-item md-size-80 mx-auto">
                <md-card class="md-card-calendar">
                    <md-card-content>
                       <t-calendar/>
                    </md-card-content>
                </md-card>
            </div>
        </div>
    </div>
</template>
<script>
    import { TCalendar } from '@/components';

    export default {
        components: {
            TCalendar,
        },
        data() {
            return {
            };
        },
        methods: {
        },
        computed: {
        },
        mounted() {
        },
    };
</script>
<style lang="scss" >
.text-center {
    text-align: center;
}
</style>
