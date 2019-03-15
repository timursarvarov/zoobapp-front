<template>
  <div class="md-layou history-notes-wrapper">
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
          <badge
            slot="header"
            type="info"
          >Create a note</badge>

          <div slot="content">
            <md-field :class="[
              {'md-valid': !errors.has('noteText') && touched.noteText},
              {'md-error': errors.has('noteText')}]">
              <label>Write a cool note</label>
              <md-textarea
                class="md-info"
                data-vv-name="noteText"
                required
                v-model="noteText"
                v-validate="modelValidations.noteText"
              ></md-textarea>
              <span class="md-error">{{errors.first('noteText')}}</span>
              <slide-y-down-transition>
                <md-icon
                  class="error"
                  v-show="errors.has('noteText')"
                >close</md-icon>
              </slide-y-down-transition>
              <slide-y-down-transition>
                <md-icon
                  class="success"
                  v-show="!errors.has('noteText') && touched.noteText"
                >done</md-icon>
              </slide-y-down-transition>
            </md-field>

          </div>
          <div slot="footer">
            <md-button
              @click="createNote()"
              class="md-info"
            >Add note</md-button>
          </div>

        </time-line-item>
        <time-line-item
          v-for="note in patient.notes"
          :key="note.ID"
          :inverted="note.author.ID !== user.ID"
          badge-type="danger"
          badge-icon="card_travel"
          :badgeAvatar="{
            // TODO поменять на цвет автора после добавления в api
            color: user.color,
            acronim: (note.author.firstName ? note.author.firstName[0]:'')
            + (note.author.lastName ? note.author.lastName[0]:''),
            img:note.author.avatar,}"
        >
          <badge
            slot="header"
            type="danger"
            :color="user.color"
          >
            {{note.author.firstName + ' ' + note.author.lastName}}
          </badge>
          <div slot="content">
          <div  v-if="note.author.ID !== user.ID" slot="content">
            {{note.note}}
            <hr>
          </div>
          <div v-else >
             <md-field>
              <label>Textarea</label>
              <md-textarea v-model="noteText"></md-textarea>
            </md-field>
          </div>
          </div>

          <div class="md-layout" slot="footer" >
          <h6 class="md-layout-item" >
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
          </div>

        </time-line-item>
        <time-line-item
          inverted
          badge-type="danger"
          badge-icon="card_travel"
        >
          <badge
            slot="header"
            type="danger"
          >Another Title</badge>
          <p slot="content">
            Wifey made the best Father's Day meal ever.
            So thankful so happy so blessed. Thank you for making my family
            We just had fun with the “future” theme !!!
            It was a fun night all together ...
            The always rude Kanye Show
            at 2am Sold Out Famous viewing @ Figueroa and 12th in downtown.</p>

          <h6 slot="footer">
            <md-icon>access_time</md-icon>
            11 hours ago via Twitter
          </h6>
        </time-line-item>

        <time-line-item
          inverted
          badge-type="info"
          badge-icon="fingerprint"
        >
          <badge
            slot="header"
            type="info"
          >Another Title</badge>
          <div slot="content">
            <p>
              Called I Miss the Old Kanye That’s all it was
              Kanye And I love you like Kanye loves Kanye Famous viewing @
              Figueroa and 12th in downtown LA 11:10PM</p>
            <p>
              What if Kanye made a song about Kanye Royère
              doesn't make a Polar bear bed but the Polar bear couch is my
              favorite piece of furniture we own It wasn’t
              any Kanyes Set on his goals Kanye</p>
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
                <li><a href="#">Mike John responded to your email</a></li>
                <li><a href="#">You have 5 new tasks</a></li>
                <li><a href="#">You're now friend with Andrew</a></li>
                <li><a href="#">Another Notification</a></li>
                <li><a href="#">Another One</a></li>
              </ul>
            </drop-down>
          </div>
        </time-line-item>

        <time-line-item
          :class="{'timeline-inverted': responsive}"
          badge-type="warning"
          badge-icon="flight_land"
        >
          <badge
            slot="header"
            type="warning"
          >Another Title</badge>
          <p slot="content">
            Tune into Big Boy's 92.3 I'm about
            to play the first single from Cruel Winter Tune into Big Boy's 92.3 I'm
            about to play the first single from
            Cruel Winter also to Kim’s hair and makeup Lorraine jewelry and the
            whole style squad at Balmain and the
            Yeezy team. Thank you Anna for the invite thank you to the whole Vogue
            team</p>
        </time-line-item>
      </time-line>
    </div>
  </div>
</template>
<script>
  import { TimeLine, TimeLineItem, Badge } from '@/components';
  import { mapGetters } from 'vuex';
  import { PATIENT_CREATE_NOTE, NOTIFY } from '@/store/modules/constants';
  import { SlideYDownTransition } from 'vue2-transitions';

  export default {
    components: {
      SlideYDownTransition,
      TimeLine,
      TimeLineItem,
      Badge,
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
              .dispatch(PATIENT_CREATE_NOTE, {
                params: {
                  note: this.noteText,
                  patientId: this.patient.ID,
                },
              })
              .then((response) => {
                this.noteText = null;
                this.$nextTick(() => this.$validator.reset());

                if (response) {
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
