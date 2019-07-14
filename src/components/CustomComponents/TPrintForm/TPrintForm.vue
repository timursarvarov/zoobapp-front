<template>
    <md-dialog v-if="showForm"
        :md-click-outside-to-close="false"
        class="tooth-diagnosis-form" :md-active.sync="showFormLocal">
        <md-card>
            <md-card-header class="md-card-header-icon md-card-header-green">
                <div class="card-icon">
                    <md-icon>{{icon}}</md-icon>
                </div>
                <h4 class="title">{{title}}</h4>
            </md-card-header>

            <md-card-content class="content" id="myelement">
                <div class="print">
                    <div class="A4 sheet">
                        <div class="page-header" style="text-align: center">
                            {{currentClinic.name}}
                            <br>
                        </div>

                        <div class="page-footer">ZoobApp</div>

                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        <!--place holder for the fixed-position header-->
                                        <div class="page-header-space"></div>
                                    </td>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        <!--*** CONTENT GOES HERE ***-->
                                        <div class="page" style="line-height: 3;">
                                            <div class="yui-t7">
                                                <div class="inner">
                                                    <div class="hd">
                                                        <div class="hd-wrapper">
                                                            <div class="yui-u first">
                                                                <h3>{{patient.firstName + ' ' + patient.lastName}}</h3>
                                                            </div>

                                                            <div class="yui-u">
                                                                <div class="contact-info">
                                                                    <div class="contact-info__item" v-if="patient.email">
                                                                        <b> Email: </b>
                                                                        <span> {{patient.email}}</span>
                                                                    </div>
                                                                    <div class="contact-info__item" v-if="patient.allergy.length > 0"
                                                                    >
                                                                        <span>allergy: {{patient.allergy}}</span>
                                                                    </div>
                                                                    <div class="contact-info__item"
                                                                        v-if="patient.phone"
                                                                    >
                                                                    <b> Phone: </b>
                                                                        <span>+{{patient.phone}}</span>
                                                                    </div>
                                                                    <div class="contact-info__item" >
                                                                        <b> Date:</b>
                                                                        <span> {{new Date | moment("ll") }}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--// .hd-wrapper -->
                                                    </div>
                                                    <!--// hd -->

                                                    <div class="bd">
                                                        <div class="yui-main">
                                                            <div class="yui-b">
                                                                <div class="yui-gf">
                                                                    <div class="yui-u first">
                                                                        <h4>Profile</h4>
                                                                    </div>
                                                                    <div class="yui-u">
                                                                        <p
                                                                            class="enlarge"
                                                                        >Progressively evolve cross-platform ideas before impactful infomediaries. Energistically visualize tactical initiatives before cross-media catalysts for change.</p>
                                                                    </div>
                                                                </div>

                                                                <div class="yui-gf">
                                                                    <div class="yui-u first">
                                                                        <h4>Skills</h4>
                                                                    </div>
                                                                    <div class="yui-u">
                                                                        <div class="talent">
                                                                            <h4>Web Design</h4>
                                                                            <p>Assertively exploit wireless initiatives rather than synergistic core competencies.</p>
                                                                        </div>

                                                                        <div class="talent">
                                                                            <h4>Interface Design</h4>
                                                                            <p>Credibly streamline mission-critical value with multifunctional functionalities.</p>
                                                                        </div>

                                                                        <div class="talent">
                                                                            <h4>Project Direction</h4>
                                                                            <p>Proven ability to lead and manage a wide variety of design and development projects in team and independent situations.</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div class="yui-gf">
                                                                    <div class="yui-u first">
                                                                        <h4>Technical</h4>
                                                                    </div>
                                                                    <div class="yui-u">
                                                                        <ul class="talent">
                                                                            <li>XHTML</li>
                                                                            <li>CSS</li>
                                                                            <li
                                                                                class="last"
                                                                            >Javascript</li>
                                                                        </ul>

                                                                        <ul class="talent">
                                                                            <li>Jquery</li>
                                                                            <li>PHP</li>
                                                                            <li
                                                                                class="last"
                                                                            >CVS / Subversion</li>
                                                                        </ul>

                                                                        <ul class="talent">
                                                                            <li>OS X</li>
                                                                            <li>Windows XP/Vista</li>
                                                                            <li class="last">Linux</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                                <div class="yui-gf">
                                                                    <div class="yui-u first">
                                                                        <h4>Experience</h4>
                                                                    </div>

                                                                    <div class="yui-u">
                                                                        <div class="job">
                                                                            <h4>Facebook</h4>
                                                                            <h3>Senior Interface Designer</h3>
                                                                            <h4>2005-2007</h4>
                                                                            <p>Intrinsicly enable optimal core competencies through corporate relationships. Phosfluorescently implement worldwide vortals and client-focused imperatives. Conveniently initiate virtual paradigms and top-line convergence.</p>
                                                                        </div>

                                                                        <div class="job">
                                                                            <h4>Apple Inc.</h4>
                                                                            <h3>Senior Interface Designer</h3>
                                                                            <h4>2005-2007</h4>
                                                                            <p>Progressively reconceptualize multifunctional "outside the box" thinking through inexpensive methods of empowerment. Compellingly morph extensive niche markets with mission-critical ideas. Phosfluorescently deliver bricks-and-clicks strategic theme areas rather than scalable benefits.</p>
                                                                        </div>

                                                                        <div class="job">
                                                                            <h4>Microsoft</h4>
                                                                            <h3>Principal and Creative Lead</h3>
                                                                            <h4>2004-2005</h4>
                                                                            <p>Intrinsicly transform flexible manufactured products without excellent intellectual capital. Energistically evisculate orthogonal architectures through covalent action items. Assertively incentivize sticky platforms without synergistic materials.</p>
                                                                        </div>

                                                                        <div class="job last">
                                                                            <h4>International Business Machines (IBM)</h4>
                                                                            <h3>Lead Web Designer</h3>
                                                                            <h4>2001-2004</h4>
                                                                            <p>Globally re-engineer cross-media schemas through viral methods of empowerment. Proactively grow long-term high-impact human capital and highly efficient innovation. Intrinsicly iterate excellent e-tailers with timely e-markets.</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="yui-gf last">
                                                                    <div class="yui-u first">
                                                                        <h4>Education</h4>
                                                                    </div>
                                                                    <div class="yui-u">
                                                                        <h4>Indiana University - Bloomington, Indiana</h4>
                                                                        <h3>
                                                                            Dual Major, Economics and English &mdash;
                                                                            <strong>4.0 GPA</strong>
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="ft">
                                                        <p>
                                                            Jonathan Doe &mdash;
                                                            <a
                                                                href="mailto:name@yourdomain.com"
                                                            >name@yourdomain.com</a> &mdash; (313) - 867-5309
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td>
                                        <!--place holder for the fixed-position footer-->
                                        <div class="page-footer-space"></div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </md-card-content>
            <md-card-actions md-alignment="right">
                <md-button @click="print" class="md-success">Print</md-button>
            </md-card-actions>
        </md-card>
    </md-dialog>
</template>
<script>
    import { Tooth, TAvatar, TFilesList } from '@/components';
    import { Printd } from 'printd';
    import { mapGetters } from 'vuex';
    import printFormCss from './print-form-css';
    import formCss from './form-css';

    export default {
        name: 't-files-list',
        components: {
            Tooth,
            TAvatar,
            TFilesList,
        },
        props: {
            title: {
                type: String,
                default: '',
            },
            showForm: {
                type: Boolean,
                default: false,
            },
            icon: {
                type: String,
                default: 'add_a_photo',
            },
            patient: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                editor: null,
            };
        },
        methods: {
            print() {
                const d = new Printd();
                d.print(document.getElementById('myelement'), [
                    printFormCss,
                    formCss,
                ]);
            },
        },
        computed: {
            ...mapGetters({
                currentClinic: 'getCurrentClinic',
            }),
            showFormLocal: {
                // геттер:
                get() {
                    console.log(this.showForm);
                    return this.showForm;
                },
                // сеттер:
                set(newValue) {
                    this.$emit('update:showForm', newValue);
                },
            },
        },
    };
</script>
<style lang="scss">
.md-dialog.tooth-diagnosis-form {
    max-width: 100vw;
    max-height: 100vh;
    .content {
        max-height: 60vh;
        min-width: 60vw;
        overflow-y: scroll;
    }
}
</style>
