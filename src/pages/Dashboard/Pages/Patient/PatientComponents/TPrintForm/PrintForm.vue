<template>
    <div>
        <md-dialog class="patient-add-form " :md-active.sync="showFormL">
            <div>
                <md-card>
                    <md-card-header class="md-card-header-icon">
                        <div class="card-icon">
                            <md-icon>print</md-icon>
                        </div>
                        <h4 class="title">Print</h4>
                    </md-card-header>

                    <md-card-content class="md-layout">
                        <div class="md-layout-item">
                            <div class="print-form__wrapper md-scrollbar">
                                <div ref="print" id="myelement">
                                    <div class="print-form">
                                        <!-- <t-print-form-patient-jaw :patient-props="patientProps" /> -->
                                        <!-- <t-print-form-patient-bio v-if="printmodel.jaw" :patient="patient" /> -->
                                        <div ref="header" class="print-form__page-header">
                                            <t-print-form-patient-header :currentClinic="currentClinic" @onMounted="onHeaderMounted" />
                                        </div>

                                        <div ref="footer" class="print-form__page-footer">I'm The Footer</div>

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
                                                        <div class="print-form__page">
                                                            <!-- <div class="print-form__page__block">
                                                            </div>-->
                                                            <t-print-form-patient-bio :patient="patient" />
                                                            <print-form-patient v-if="type === 'patient'" />
                                                            <t-print-form-patient-jaw v-else-if="type === 'jaw'" :patient-props="patientProps" />
                                                            <t-print-form-patient-procedure
                                                                v-else-if="type === 'procedures'"
                                                                :num="1"
                                                                :procedure-id="selectedItem.ID"
                                                            />
                                                            <t-print-form-patient-procedures
                                                                :selectedItem="selectedItem"
                                                                v-else-if="type === 'plan'" />
<!--                                                            <t-print-form-patient-plan-->
<!--                                                                :planID="`${selectedItem.ID}`"-->
<!--                                                                :num="0"-->
<!--                                                            >-->
<!--                                                                <template slot="procedures" slot-scope="{ procedureId, index, showManipulations }">-->
<!--                                                                    <t-print-form-patient-procedure-->
<!--                                                                        :showManipulations="showManipulationsGlobal && showManipulations"-->
<!--                                                                        :num="index + 1"-->
<!--                                                                        :procedure-id="procedureId"-->
<!--                                                                    />-->
<!--                                                                </template>-->
<!--                                                            </t-print-form-patient-plan>-->
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
                            </div>
                        </div>
                    </md-card-content>

                    <md-card-actions md-alignment="right">
                        <md-button class="md-success" @click="showFormL = !showFormL">close</md-button>
                        <md-button class="md-success" @click="printD()">Print</md-button>
                        <md-button class="md-success" @click="print()">Print</md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </md-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Printd } from 'printd';
import { PATIENT_ADD_SUB_PROP, STORE_KEY_PATIENT } from '@/constants';

export default {
    name: 'PrintForm',
    components: {
        'print-form-patient': () => import('./PrintFormPatient'),
        't-print-form-patient-bio': () => import('./TPrintFormPatientBio'),
        't-print-form-patient-jaw': () => import('./TPrintFormPatientJaw'),
        't-print-form-patient-procedure': () => import('./TPrintFormPatientProcedure'),
        't-print-form-patient-plan': () => import('./TPrintFormPatientPlan'),
        't-print-form-patient-header': () => import('./TPrintFormPatientHeader'),
        't-print-form-patient-procedures': () => import('./TPrintFormPatientProcedures')
    },
    props: {
        showForm: {
            type: Boolean,
            default: () => false
        },
        type: {
            type: String,
            default: () => ''
        },
        selectedItem: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            height: {
                footer: 100,
                header: 100
            },
            selectedPlans: []
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            patient: `${STORE_KEY_PATIENT}/getPatient`,
            getApprovedPlansIDs: `${STORE_KEY_PATIENT}/getApprovedPlansIDs`
        }),
        showFormL: {
            get() {
                return this.showForm;
            },
            set(newValue) {
                this.$emit('update:showForm', newValue);
            }
        },
        patientProps() {
            const props = {
                patientItems: {
                    diagnosis: this.patient.diagnosis,
                    procedures: this.currentPlanProcedures,
                    anamnesis: this.patient.anamnesis
                },
                type: 'procedures',
                ageCategory: this.patient.ageCategory,
                jaw: this.patient.jaw
            };
            return props;
        }
    },
    mounted() {
        this.matchHeight();
    },
    created() {
        if (this.patient.plans) {
            this.selectedPlans = this.lodash.clone(Object.keys(this.patient.plans));
            // this.selectedPlans = this.getApprovedPlansIDs;
        }
    },
    methods: {
        matchHeight() {
            return new Promise(resolve => {
                if (this.$refs.header) {
                    this.height.header = this.$refs.header.clientHeight;
                }
                if (this.$refs.footer) {
                    this.height.footer = this.$refs.footer.clientHeight;
                }
                resolve(this.height);
            });
        },
        onHeaderMounted() {
            this.matchHeight();
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
            // Tip: texts & urls are supported
            this.matchHeight().then(height => {
                const d = new Printd();
                const styles = [
                    '/css/print.css',
                    `.print-form__page-header-space { min-height : ${height.header}px;}`,
                    `.print-form__page-footer-space { min-height : ${height.footer}px;}`
                ];
                const scripts = [];
                const el = document.getElementById('myelement');
                const printCallback = ({ launchPrint }) => launchPrint();
                d.print(el, styles, scripts, printCallback);
            });
        },
        onSuccess(response) {
            this.$store.dispatch(`$_patient/${PATIENT_ADD_SUB_PROP}`, {
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
