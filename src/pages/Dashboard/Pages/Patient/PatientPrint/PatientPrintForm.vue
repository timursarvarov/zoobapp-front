<template>
    <div>
        <md-button class="md-success" @click="print">
            Print
        </md-button>
        <div class="print-form__wrapper">
            <div ref="print" class="A4page" size="A4" id="myelement">
                <t-print-form-template />
            </div>
        </div>
    </div>
</template>

<script>
// const printMain = require('css-to-string-loader!css-loader!./print.css');
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
            code: '',
            touched: {
                code: false
            }
        };
    },
    created() {
        console.log(process.env.NODE_ENV);
    },
    computed: {
        ...mapGetters({})
    },
    methods: {
        // print() {
        //     this.showDiagnosis = true;
        //     let styles = printMain;
        //     let jaw = this.$refs.print.cloneNode(true);
        //     // let bio = this.$refs.bio.cloneNode(true);
        //     // let anamnesis = this.$refs.anamnesis.cloneNode(true);
        //     // let dentaldiagnosis = this.$refs.dentaldiagnosis.cloneNode(true);
        //     // let oraldiagnosis = this.$refs.oraldiagnosis.cloneNode(true);
        //     // let currentTreatment = this.$refs.currentTreatment.cloneNode(true);
        //     // let dentaldiagnosisnote = this.$refs.dentaldiagnosisnote.cloneNode(true);
        //     // let anamnesisNotes = this.$refs.anamnesisNotes.cloneNode(true);
        //     // let specialNotes = this.$refs.specialNotes.cloneNode(true);

        //     var title = document.title;
        //     var myWindow = window.open('', '', 'width=1050,height=1835');
        //     myWindow.document.write('</body></html>');
        //     myWindow.document.write('<html><head><style>' + styles + '</style></head>');

        //     // div.innerHTMl = this.$refs.jaw.cloneNode(true)
        //     for (let i = 0; i <= 9; i++) {
        //         let div = document.createElement('div');
        //         div.id = 'row' + i;
        //         div.className = 'flex';
        //         myWindow.document.getElementsByTagName('body')[0].appendChild(div);
        //     }
        //     let div = document.createElement('div');

        //     myWindow.document.getElementById('row1').appendChild(jaw);
        //     // myWindow.document.getElementById('row2').appendChild(bio);
        //     // myWindow.document.getElementById('row2').appendChild(anamnesis);
        //     // myWindow.document.getElementById('row3').appendChild(anamnesisNotes);
        //     // myWindow.document.getElementById('row4').appendChild(specialNotes);
        //     // myWindow.document.getElementById('row5').appendChild(dentaldiagnosis);
        //     // myWindow.document.getElementById('row6').appendChild(oraldiagnosis);
        //     // myWindow.document.getElementById('row7').appendChild(dentaldiagnosisnote);
        //     // myWindow.document.getElementById('row8').appendChild(currentTreatment);

        //     myWindow.focus();
        //     // myWindow.print();
        //     // myWindow.close();
        // },
        print() {
            const d = new Printd();
            d.print(document.getElementById('myelement'), ['/css/print.css']);
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
<style lang="scss" scoped>
.print-form__wrapper {
    height: calc(100vh - 300px);
    overflow: hidden;
    overflow-x: scroll;
    overflow-y: scroll;
    padding-top: 50px;
    padding-bottom: 50px;
}
.A4page {
    background: white;
    display: block;
    margin: 0 auto;
    margin-bottom: 0.5cm;
    box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
}
.A4page[size='A4'] {
    width: 21cm;
    height: auto;
}
</style>
