<template>
    <div>
        <button class="md-success" @click="printD">
            PrintD
        </button>
        <md-button class="md-success" @click="print">
            Print
        </md-button>
        <div class="print-form__wrapper">
            <div class="A4page" size="A4">
                <div ref="print" size="A4" id="myelement">
                    <div class="print-form">
                        <!-- <t-print-form-patient-jaw :patient-props="patientProps" /> -->
                        <!-- <t-print-form-patient-bio v-if="printmodel.jaw" :patient="patient" /> -->
                        <div ref="header" class="print-form__page-header">
                            <t-print-form-patient-header :currentClinic="currentClinic" />
                        </div>

                        <div ref="footer" class="print-form__page-footer">
                            I'm The Footer
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        <!--place holder for the fixed-position header-->
                                        <div :style="{ minHeight: `${height.header}px` }" class="print-form__page-header-space"></div>
                                    </td>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        <!--*** CONTENT GOES HERE ***-->
                                        <div class="print-form__page">PAGE 1</div>
                                        <div class="print-form__page">PAGE 2</div>
                                        <div class="print-form__page" style="line-height: 3;">
                                            PAGE 3 - Long Content
                                            <br />
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tincidunt metus eu consectetur rutrum.
                                            Praesent tempor facilisis dapibus. Aliquam cursus diam ac vehicula pulvinar. Integer lacinia non odio et
                                            condimentum. Aenean faucibus cursus mi, sed interdum turpis sagittis a. Quisque quis pellentesque mi. Ut
                                            erat eros, posuere sed scelerisque ut, pharetra vitae tellus. Suspendisse ligula sapien, laoreet ac
                                            hendrerit sit amet, viverra vel mi. Pellentesque faucibus nisl et dolor pharetra, vel mattis massa
                                            venenatis. Integer congue condimentum nisi, sed tincidunt velit tincidunt non. Nulla sagittis sed lorem
                                            pretium aliquam. Praesent consectetur volutpat nibh, quis pulvinar est volutpat id. Cras maximus odio
                                            posuere suscipit venenatis. Donec rhoncus scelerisque metus, in tempus erat rhoncus sed. Morbi massa
                                            sapien, porttitor id urna vel, volutpat blandit velit. Cras sit amet sem eros. Quisque commodo facilisis
                                            tristique. Proin pellentesque sodales rutrum. Vestibulum purus neque, congue vel dapibus in, venenatis ut
                                            felis. Donec et ligula enim. Sed sapien sapien, tincidunt vitae lectus quis, ultricies rhoncus mi. Nunc
                                            dapibus nulla tempus nunc interdum, sed facilisis ex pellentesque. Nunc vel lorem leo. Cras pharetra
                                            sodales metus. Cras lacus ex, consequat at consequat vel, laoreet ac dui. Curabitur aliquam, sapien quis
                                            congue feugiat, nisi nisl feugiat diam, sed vehicula velit nulla ac nisl. Aliquam quis nisi euismod massa
                                            blandit pharetra nec eget nunc. Etiam eros ante, auctor sit amet quam vel, fringilla faucibus leo. Morbi a
                                            pulvinar nulla. Praesent sed vulputate nisl. Orci varius natoque penatibus et magnis dis parturient
                                            montes, nascetur ridiculus mus. Aenean commodo mollis iaculis. Maecenas consectetur enim vitae mollis
                                            venenatis. Ut scelerisque pretium orci id laoreet. In sit amet pharetra diam. Vestibulum in molestie
                                            lorem. Nunc gravida, eros non consequat fermentum, ex orci vestibulum orci, non accumsan sem velit ac
                                            lectus. Vivamus malesuada lacus nec velit dignissim, ac fermentum nulla pretium. Aenean mi nisi, convallis
                                            sed tempor in, porttitor eu libero. Praesent et molestie ante. Duis suscipit vitae purus sit amet aliquam.
                                            Vestibulum lectus justo, lobortis a purus a, dapibus efficitur metus. Suspendisse potenti. Duis dictum ex
                                            lorem. Suspendisse nec ligula consectetur magna hendrerit ullamcorper et eget mauris. Etiam vestibulum
                                            sodales diam, eget venenatis nunc luctus quis. Ut fermentum placerat neque nec elementum. Praesent orci
                                            erat, rhoncus vitae est eu, dictum molestie metus. Cras et fermentum elit. Aenean eget augue lacinia,
                                            varius ante in, ullamcorper dolor. Cras viverra purus non egestas consectetur. Nulla nec dolor ac lectus
                                            convallis aliquet sed a metus. Suspendisse eu imperdiet nunc, id pulvinar risus. Maecenas varius sagittis
                                            est, vel fermentum risus accumsan at. Vestibulum sollicitudin dui pharetra sapien volutpat, id convallis
                                            mi vestibulum. Phasellus commodo sit amet lorem quis imperdiet. Proin nec diam sed urna euismod ultricies
                                            at sed urna. Quisque ornare, nulla et vehicula ultrices, massa purus vehicula urna, ac sodales lacus leo
                                            vitae mi. Sed congue placerat justo at placerat. Aenean suscipit fringilla vehicula. Quisque iaculis orci
                                            vitae arcu commodo maximus. Maecenas nec nunc rutrum, cursus elit quis, porttitor sapien. Sed ac hendrerit
                                            ipsum, lacinia fringilla velit. Donec ultricies feugiat dictum.
                                        </div>
                                    </td>
                                </tr>
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td>
                                        <!--place holder for the fixed-position footer-->
                                        <div :style="{ minHeight: `${height.footer}px` }" class="print-form__page-footer-space"></div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <!-- <t-print-form-template /> -->
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import { Printd } from 'printd';
import { PATIENT_ADD_SUB_PROP } from '@/constants';

export default {
    name: 'PatientFiles',
    components: {
        ...components
    },
    data() {
        return {
            height: {
                footer: 100,
                header: 100
            },
            style: `
              @page {

}

.print-form thead {
      display: table-header-group;
  }
  .print-form tfoot {
      display: table-footer-group;
  }

  .print-form button {
      display: none;
  }

  body {
      margin: 0;
  }
  .print-form__page-header, .print-form__page-header-space {margin: 20mm;}

.print-form__page-footer,
.print-form__page-header {
  position: fixed;
}


            `
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic'
        })
    },
    mounted() {
        this.$nextTick(() => {
            this.matchHeight();
        });
    },
    methods: {
        matchHeight() {
            if (this.$refs.header) {
                this.height.header = this.$refs.header.clientHeight;
            }
            if (this.$refs.footer) {
                this.height.footer = this.$refs.footer.clientHeight;
            }
        },
        print() {
            this.showDiagnosis = true;
            let jaw = this.$refs.print.cloneNode(true);
            var myWindow = window.open('', '', 'width=1050,height=1835');
            myWindow.document.write('</body></html>');
            myWindow.document.write(`<html><head><html>
            <link rel="stylesheet" type="text/css" href="/css/print.css">
            <link rel="stylesheet" type="text/css" href="/css/print-media.css">
            </head>`);

            // div.innerHTMl = this.$refs.jaw.cloneNode(true)

            let div = document.createElement('div');
            div.id = 'row1';
            myWindow.document.getElementsByTagName('body')[0].appendChild(div);

            myWindow.document.getElementById('row1').appendChild(jaw);
            myWindow.focus();
            // myWindow.print();
            // myWindow.close();
        },
        printD() {
            this.matchHeight();
            const headerHeight = `.print-form__page-header-space { min-height : ${this.height.header}px;}`;
            const footerHeight = `.print-form__page-footer-space { min-height : ${this.height.footer}px;}`;
            console.log(this.height)
            const d = new Printd();
            d.print(document.getElementById('myelement'), ['/css/print.css', this.style, headerHeight, footerHeight]);
            // d.print(document.getElementById('myelement'), ['/css/print.css', '/css/print-media.css']);
        },
        onSuccess(response) {
            this.$store.dispatch(PATIENT_ADD_SUB_PROP, {
                params: {
                    propName: 'files',
                    value: response[0]
                }
            });
        },
        validate() {
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res, 'step2');
                this.$emit('validated-code', this.code);
                return res;
            });
        }
    }
};
</script>
