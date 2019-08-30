<template>
    <div class="md-layout history-notes-wrapper">
        <div class="md-layout-item md-size-100">
            <time-line
                plain
                :type="simpleTimeline"
            >
                <time-line-item
                    :class="{'timeline-inverted': responsive}"
                    badge-type="info"
                    badge-icon="edit"
                >
                    <t-badge
                        slot="header"
                        type="info"
                    >
                        Create a note
                    </t-badge>

                    <div slot="content">
                        <md-field
                            :class="[
                                {'md-valid': !errors.has('noteText') && touched.noteText},
                                {'md-error': errors.has('noteText')}]"
                        >
                            <label>Write a cool note</label>
                            <md-textarea
                                v-model="noteText"
                                v-validate="modelValidations.noteText"
                                class="md-info"
                                data-vv-name="noteText"
                                required
                            />
                            <span class="md-error">{{ errors.first('noteText') }}</span>
                            <slide-y-down-transition>
                                <md-icon
                                    v-show="errors.has('noteText')"
                                    class="error"
                                >
                                    close
                                </md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon
                                    v-show="!errors.has('noteText') && touched.noteText"
                                    class="success"
                                >
                                    done
                                </md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <div slot="footer">
                        <md-button
                            class="md-info"
                            @click="createNote()"
                        >
                            Add note
                        </md-button>
                    </div>
                </time-line-item>
                <time-line-item
                    v-for="note in patient.notes"
                    :key="note.ID"
                    :inverted="note.author.ID !== user.ID"
                    badge-type="danger"
                    badge-icon="card_travel"
                    :badge-avatar="{
                        // TODO поменять на цвет автора после добавления в api
                        color: user.color,
                        acronim: (note.author.firstName ? note.author.firstName[0]:'')
                            + (note.author.lastName ? note.author.lastName[0]:''),
                        img:note.author.avatar,}"
                >
                    <t-badge
                        slot="header"
                        type="danger"
                        :text-to-color="user.ID"
                    >
                        {{ note.author.firstName + ' ' + note.author.lastName }}
                    </t-badge>
                    <div slot="content">
                        <div
                            v-if="note.author.ID !== user.ID"
                            slot="content"
                        >
                            {{ note.note }}
                            <hr>
                        </div>
                        <div v-else>
                            <p slot="content">
                                {{ note.note }}
                            </p>
                            <!-- <md-field>
                                <label>Textarea</label>
                                <md-textarea v-model="note.note"></md-textarea>
                            </md-field> -->
                        </div>
                        <h6 class="md-layout-item">
                            <md-icon>access_time</md-icon>
                            {{ note.created | moment("from", "now") }}
                        </h6>
                    </div>

                    <!-- <div class="md-layout" slot="footer">
                        <h6 class="md-layout-item">
                            <md-icon>access_time</md-icon>
                            {{note.created | moment("from", "now")}}
                        </h6>
                        <div class="md-info md-layout-item">
                            <md-button
                                class="md-layout-item md-info"
                                v-if="note.author.ID === user.ID"
                                @click="createNote()"
                            >Save</md-button>
                        </div>
                    </div> -->
                </time-line-item>
                <time-line-item
                    inverted
                    badge-type="danger"
                    badge-icon="card_travel"
                >
                    <t-badge
                        slot="header"
                        type="danger"
                    >
                        Another Title
                    </t-badge>
                    <p slot="content">
                        Wifey made the best Father's Day meal ever.
                        So thankful so happy so blessed. Thank you for making my family
                        We just had fun with the “future” theme !!!
                        It was a fun night all together ...
                        The always rude Kanye Show
                        at 2am Sold Out Famous viewing @ Figueroa and 12th in downtown.
                    </p>

                    <h6 slot="footer">
                        <md-icon>access_time</md-icon>11 hours ago via Twitter
                    </h6>
                </time-line-item>

                <time-line-item
                    inverted
                    badge-type="info"
                    badge-icon="fingerprint"
                >
                    <t-badge
                        slot="header"
                        type="info"
                    >
                        Another Title
                    </t-badge>
                    <div slot="content">
                        <p>
                            Called I Miss the Old Kanye That’s all it was
                            Kanye And I love you like Kanye loves Kanye Famous viewing @
                            Figueroa and 12th in downtown LA 11:10PM
                        </p>
                        <p>
                            What if Kanye made a song about Kanye Royère
                            doesn't make a Polar bear bed but the Polar bear couch is my
                            favorite piece of furniture we own It wasn’t
                            any Kanyes Set on his goals Kanye
                        </p>
                        <hr>
                        <drop-down direction="down">
                            <md-button
                                slot="title"
                                class="md-button md-info md-round dropdown-toggle"
                                data-toggle="dropdown"
                            >
                                <md-icon>build</md-icon>
                            </md-button>
                            <ul
                                class="dropdown-menu"
                                :class="{'dropdown-menu-right': !responsive}"
                            >
                                <li>
                                    <a href="#">Mike John responded to your email</a>
                                </li>
                                <li>
                                    <a href="#">You have 5 new tasks</a>
                                </li>
                                <li>
                                    <a href="#">You're now friend with Andrew</a>
                                </li>
                                <li>
                                    <a href="#">Another Notification</a>
                                </li>
                                <li>
                                    <a href="#">Another One</a>
                                </li>
                            </ul>
                        </drop-down>
                    </div>
                </time-line-item>

                <time-line-item
                    :class="{'timeline-inverted': responsive}"
                    badge-type="warning"
                    badge-icon="flight_land"
                >
                    <t-badge
                        slot="header"
                        type="warning"
                    >
                        Another Title
                    </t-badge>
                    <p slot="content">
                        Tune into Big Boy's 92.3 I'm about
                        to play the first single from Cruel Winter Tune into Big Boy's 92.3 I'm
                        about to play the first single from
                        Cruel Winter also to Kim’s hair and makeup Lorraine jewelry and the
                        whole style squad at Balmain and the
                        Yeezy team. Thank you Anna for the invite thank you to the whole Vogue
                        team
                    </p>
                </time-line-item>
            </time-line>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SlideYDownTransition } from 'vue2-transitions';
import components from '@/components';
import { PATIENT_NOTE_CREATE, NOTIFY } from '@/constants';

export default {
    name: 'Note',
    components: {
        SlideYDownTransition,
        ...components,
    },
    data() {
        return {
            noteText: null,
            responsive: false,
            touched: {
                noteText: false,
            },
            modelValidations: {
                noteText: {
                    required: true,
                    min: 10,
                },
            },
        };
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient',
            user: 'getProfile',
        }),
        simpleTimeline() {
            if (this.responsive) {
                return 'simple';
            }
            return '';
        },
        noteTextL() {
            return this.noteText;
        },
    },
    watch: {
        noteTextL() {
            this.touched.noteText = true;
        },
    },
    mounted() {
        this.onResponsiveInverted();
        window.addEventListener('resize', this.onResponsiveInverted);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResponsiveInverted);
    },
    methods: {
        validate() {
            this.$validator.validateAll().then((isValid) => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
            this.touched.noteText = true;
        },
        onResponsiveInverted() {
            if (window.innerWidth < 768) {
                this.responsive = true;
            } else {
                this.responsive = false;
            }
        },
        createNote() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.$store
                        .dispatch(PATIENT_NOTE_CREATE, {
                            note: this.noteText,
                        })
                        .then((note) => {
                            console.log(note);
                            this.noteText = null;
                            this.$nextTick(() => this.$validator.reset());

                            if (note) {
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'Note added!',
                                        type: 'primary',
                                    },
                                });
                            }
                        });
                }
            });
        },
    },
};
</script>
<style lang="scss" >
.history-notes-wrapper {
    word-break: break-all;
    .md-has-textarea {
        margin-bottom: 20px;
        span.md-error {
            bottom: -2rem !important;
        }
    }
}
</style>
