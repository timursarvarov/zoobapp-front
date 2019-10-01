<template>
    <div class="md-layout history-notes-wrapper">
        <div class="md-layout-item md-size-100">
            <time-line plain :type="simpleTimeline">
                <time-line-item :class="{ 'timeline-inverted': responsive }" badge-type="info" badge-icon="edit">
                    <t-badge slot="header" type="info">
                        {{ $t(`${$options.name}.createNote`) }}
                    </t-badge>

                    <div slot="content">
                        <md-field :class="[{ 'md-valid': !errors.has('noteText') && touched.noteText }, { 'md-error': errors.has('noteText') }]">
                            <label>{{ $t(`${$options.name}.writeaCoolNote`) }} </label>
                            <md-textarea v-model="noteText" v-validate="modelValidations.noteText" class="md-info" data-vv-name="noteText" required />
                            <span class="md-error">{{ errors.first('noteText') }}</span>
                            <slide-y-down-transition>
                                <md-icon v-show="errors.has('noteText')" class="error">
                                    close
                                </md-icon>
                            </slide-y-down-transition>
                            <slide-y-down-transition>
                                <md-icon v-show="!errors.has('noteText') && touched.noteText" class="success">
                                    done
                                </md-icon>
                            </slide-y-down-transition>
                        </md-field>
                    </div>
                    <div slot="footer">
                        <md-button class="md-info" @click="createNote()">
                            Add note {{ $t(`${$options.name}.addNote`) }}
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
                        acronim: (note.author.firstName ? note.author.firstName[0] : '') + (note.author.lastName ? note.author.lastName[0] : ''),
                        img: note.author.avatar
                    }"
                >
                    <t-badge slot="header" type="danger" :text-to-color="user.ID">
                        {{ note.author.firstName + ' ' + note.author.lastName }}
                    </t-badge>
                    <div slot="content">
                        <div v-if="note.author.ID !== user.ID" slot="content">
                            {{ note.note }}
                            <hr />
                        </div>
                        <div v-else>
                            <p slot="content">
                                {{ note.note }}
                            </p>
                        </div>
                        <h6 class="md-layout-item">
                            <md-icon>access_time</md-icon>
                            {{ note.created | moment('from', 'now') }}
                        </h6>
                    </div>
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
    name: 'PatientNotes',
    components: {
        SlideYDownTransition,
        ...components
    },
    data() {
        return {
            noteText: null,
            responsive: false,
            touched: {
                noteText: false
            },
            modelValidations: {
                noteText: {
                    required: true,
                    min: 10
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            patient: 'getPatient',
            user: 'getProfile'
        }),
        simpleTimeline() {
            if (this.responsive) {
                return 'simple';
            }
            return '';
        },
        noteTextL() {
            return this.noteText;
        }
    },
    watch: {
        noteTextL() {
            this.touched.noteText = true;
        }
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
            this.$validator.validateAll().then(isValid => {
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
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$store
                        .dispatch(PATIENT_NOTE_CREATE, {
                            note: this.noteText
                        })
                        .then(note => {
                            console.log(note);
                            this.noteText = null;
                            this.$nextTick(() => this.$validator.reset());

                            if (note) {
                                this.$store.dispatch(NOTIFY, {
                                    settings: {
                                        message: 'Note added!',
                                        type: 'primary'
                                    }
                                });
                            }
                        });
                }
            });
        }
    }
};
</script>
<style lang="scss">
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
