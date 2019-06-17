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
                        <FullCalendar
                            :header="{
                                left: 'prev, next, today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,'
                            }"
                            :nowIndicator="true"
                            ref="fullCalendar"
                            @dateClick="handleDateClick"
                            @select="handleDateSelect"
                            defaultView="timeGridWeek"
                            :selectMinDistance="1"
                            :plugins="calendarPlugins"
                            :selectable="true"
                            :timeZoneParam="'UTC'"
                            :selectMirror="true"
                            :local="lang"
                            :events="events" />
                    </md-card-content>
                </md-card>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import FullCalendar from '@fullcalendar/vue';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import timeGrid from '@fullcalendar/timegrid';
    import interaction from '@fullcalendar/interaction';
    import timeline from '@fullcalendar/timeline';
    import list from '@fullcalendar/list';
    import ruLocale from '@fullcalendar/core/locales/ru';
    import {
        TIMEZONES,
    } from '@/constants';

    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    export default {
        components: {
            FullCalendar,
        },
        data() {
            return {
                calendarApi: null,
                calendarPlugins: [
                    dayGridPlugin,
                    timeGrid,
                    interaction,
                    timeline,
                    list,
                ],
                events: [
                    {
                        title: 'All Day Event',
                        start: new Date(y, m, 1),
                        className: 'event-default',
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        start: new Date(y, m, d - 4, 6, 0),
                        allDay: false,
                        className: 'event-rose',
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        start: new Date(y, m, d + 3, 6, 0),
                        allDay: false,
                        className: 'event-rose',
                    },
                    {
                        title: 'Meeting',
                        start: new Date(y, m, d - 1, 10, 30),
                        allDay: false,
                        className: 'event-green',
                    },
                    {
                        title: 'Lunch',
                        start: new Date(y, m, d + 7, 12, 0),
                        end: new Date(y, m, d + 7, 14, 0),
                        allDay: false,
                        className: 'event-red',
                    },
                    {
                        title: 'Md-pro Launch',
                        start: new Date(y, m, d - 2, 12, 0),
                        allDay: true,
                        className: 'event-azure',
                    },
                    {
                        title: 'Birthday Party',
                        start: new Date(y, m, d + 1, 19, 0),
                        end: new Date(y, m, d + 1, 22, 30),
                        allDay: false,
                        className: 'event-azure',
                    },
                    {
                        title: 'Click for Creative Tim',
                        start: new Date(y, m, 21),
                        end: new Date(y, m, 22),
                        url: 'http://www.creative-tim.com/',
                        className: 'event-orange',
                    },
                    {
                        title: 'Click for Google',
                        start: new Date(y, m, 21),
                        end: new Date(y, m, 22),
                        url: 'http://www.creative-tim.com/',
                        className: 'event-orange',
                    },
                ],
            };
        },
        methods: {
            handleDateClick(arg) {
                if (confirm(`Would you like to add an event to ${arg.dateStr} ?`)) {
                    this.events.push({
                        // add new event data
                        title: 'New Event',
                        start: arg.date,
                        allDay: arg.allDay,
                    });
                }
            },
            handleDateSelect(arg) {
                if (confirm(`Would you like to add an event to ${arg.dateStr} ?`)) {
                    this.events.push({
                        // add new event data
                        title: 'New Event',
                        start: arg.date,
                        allDay: arg.allDay,
                    });
                }
            },
            initiateCalendar() {
                this.calendarApi = this.$refs.fullCalendar.getApi();
                // this.calendarApi.setOption('locale', this.lang);
                // this.calendarApi.setOption('timeZoneParam', 'UTC');
            },
        },
        computed: {
            ...mapGetters({
                user: 'getProfile',
            }),
            getNamedTimeZone() {

            },
            lang() {
                if (this.user.lang === 1) {
                    return 'en';
                }
                if (this.user.lang === 2) {
                    return 'ru';
                }
                return 'en';
            },
            locales() {
                return [ruLocale];
            },
            timezones() {
                return TIMEZONES;
            },

        },
        mounted() {
            this.initiateCalendar();
        },
    };
</script>
<style lang="scss" >
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@fullcalendar/timeline/main.css';
@import '~@fullcalendar/list/main.css';
#fullCalendar {
    min-height: 300px;
}
    .fc-button-primary:not(:disabled):active:focus,
    .fc-button-primary:not(:disabled).fc-button-active:focus {
        box-shadow: none;
    }
    .fc-event{
        border:none;
    }

.md-card-calendar {
    .md-card-content {
        padding: 0 !important;
    }
}

.text-center {
    text-align: center;
}
</style>
