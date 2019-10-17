<template>
    <div class="patient-profile-wrapper">
        <nav-tabs-card v-if="patient.ID">
            <template slot="content">
                <!-- <span class="md-nav-tabs-title">Set new:</span> -->
                <md-tabs md-sync-route class="md-success" md-alignment="left">
                    <md-tab
                        id="tab-bio"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/bio`"
                        md-icon="account_box"
                        :md-label="$t(`${$options.name}.BIO`)"
                    >
                        <div class="md-layout">
                            <router-view name="Bio" />
                        </div>
                    </md-tab>
                    <md-tab
                        id="tab-treatment"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/treatment`"
                        md-icon="local_hospital"
                        :md-label="$t(`${$options.name}.treatment`)"
                    >
                        <div class="md-layout">
                            <!-- <keep-alive> -->
                            <router-view name="treatmentchild" />
                            <!-- </keep-alive> -->
                        </div>
                    </md-tab>
                    <md-tab
                        id="tab-billing"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/billing`"
                        md-icon="account_balance"
                        :md-label="$t(`${$options.name}.billing`)"
                    >
                        <div class="md-layout">
                            <router-view name="Billing" />
                        </div>
                    </md-tab>
                    <md-tab
                        id="tab-notes"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/notes`"
                        md-icon="question_answer"
                        :md-label="$t(`${$options.name}.notes`)"
                    >
                        <router-view name="Notes" />
                    </md-tab>
                    <md-tab
                        id="tab-files"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/files`"
                        md-icon="folder_shared"
                        :md-label="$t(`${$options.name}.files`)"
                    >
                        <router-view name="Files" />
                    </md-tab>
                    <md-tab id="tab-print" md-icon="print" :md-label="$t(`${$options.name}.print`)" @click="showPrint()" />
                </md-tabs>
                <patient-items-wizard />
                <patient-print-form />
            </template>
        </nav-tabs-card>
        <div v-show="!patient.ID && patient.status === 'loading'" class="jaw md-layout-item">
            <div v-if="true" style="margin:auto; height:100%" class="md-layout mx-auto patient-wrapper-preloader">
                <div style="height:60px;margin: auto;">
                    <md-progress-spinner md-mode="indeterminate" />
                </div>
            </div>
        </div>
        <div v-show="!patient.ID && patient.status === 'error'" class="jaw md-layout-item">
            <md-empty-state md-icon="error" md-label="No connection" md-description="No server connection">
                <md-button class="md-primary md-raised" @click="getPatient">
                    RETRY
                </md-button>
            </md-empty-state>
        </div>
        <div v-show="!patient.ID && patient.status === 'notExist'" class="jaw md-layout-item">
            <md-empty-state
                md-icon="person_outline"
                md-label="No patient found"
                md-description="you don't allowed to see this patient or patient do not exist"
            >
                <md-button class="md-primary md-raised" @click="$patientAddForm.showPatientAddForm(true)">
                    Create new patient
                </md-button>
            </md-empty-state>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import { PATIENT_GET, STORE_KEY_PATIENT, EB_SHOW_PATIENT_PRINT_FORM } from '@/constants';
import PatientPrintForm from './PatientPrintForm/PatientPrintForm';
import EventBus from '@/plugins/event-bus';
import patientComponents from '@/pages/Dashboard/Pages/Patient/PatientComponents';
import store from './_store';



export default {
    // beforeRouteEnter(to, from, next) {
    // const STORE_KEY_PATIENT = '$_patient';
    // console.log(store._modules);
    // // eslint-disable-next-line no-underscore-dangle
    // if (!(STORE_KEY_PATIENT in store._modules.root._children)) {
    //     store.registerModule(STORE_KEY_PATIENT, store);
    // }
    // if (!store.getters.getPatient.ID || `${store.getters.getPatient.ID}` !== `${to.params.patientID}`) {
    //     store
    //         .dispatch(`$_patient/${PATIENT_GET, {
    //             patientID: to.params.patientID
    //         })
    //         .then(patient => {
    //             if (patient) {
    //                 next(vm => {
    //                     vm.setWindowTitle();
    //                 });
    //             }
    //         })
    //         .catch(err => {
    //             next(to);
    //             throw err;
    //         });
    // } else {
    //     next();
    // }
    // },
    beforeRouteLeave(to, from, next) {
        document.title = 'ZoobApp';
        next();
    },
    beforeDestroy(){
        this.$store.unregisterModule(STORE_KEY_PATIENT);
    },
    name: 'PatientProfile',
    components: {
        ...components,
        ...patientComponents,
        PatientPrintForm
    },
    data() {
        return {
            showPrintForm: false,
            showDialog: false,
            actionSize: {},
            selectedTeeth: [],
            selectedDiagnose: []
        };
    },
    created() {
        if (!(STORE_KEY_PATIENT in this.$store._modules.root._children)) {
            this.$store.registerModule(STORE_KEY_PATIENT, store);
        }
        this.$store
            .dispatch(`$_patient/${PATIENT_GET}`, {
                patientID: this.$route.params.patientID
            })
            .then(patient => {
                if (patient) {
                    this.setWindowTitle();
                }
            })
            .catch(err => {
                throw err;
            });
    },
    computed: {
        ...mapGetters({
            patient: `${STORE_KEY_PATIENT}/getPatient`,
        }),
        routePatientID() {
            return this.$route.params.patientID;
        }
    },
    watch: {
        routePatientID(val) {
            if (`${this.patient.ID}` !== `${val}`) {
                this.getPatient();
            }
        }
    },
    methods: {
        showPrint() {
            const params = {
                type: 'patient',
                item: this.patient
            };
            EventBus.$emit(EB_SHOW_PATIENT_PRINT_FORM, params);
        },
        setWindowTitle() {
            if (this.patient.ID) {
                let firstName = '';
                let lastName = '';
                if (typeof this.patient.firstName === 'string') {
                    firstName = this.patient.firstName.charAt(0).toUpperCase() + this.patient.firstName.slice(1);
                }
                if (typeof this.patient.lastName === 'string') {
                    lastName = this.patient.lastName.charAt(0).toUpperCase() + this.patient.lastName.slice(1);
                }
                document.title = `${firstName} ${lastName} - ZoobApp`;
            }
        },
        getPatient() {
            if (this.$route.params.patientID && (this.patient.ID === null || this.patient.ID !== parseInt(this.$route.params.patientID, 10))) {
                this.$store
                    .dispatch(`$_patient/${PATIENT_GET}`, {
                        patientID: this.$route.params.patientID
                    })
                    .then(() => {
                        this.setWindowTitle();
                    });
            }
        }
    }
};
</script>
<style lang="scss">
.patient-profile-wrapper {
    .patient-wrapper-preloader {
        position: absolute;
        z-index: 30;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .md-tabs-navigation {
        overflow-x: auto;
        overflow-y: auto;
        &::-webkit-scrollbar {
            height: 7px;
            // background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: white;
            border-radius: 7px;
        }
    }
    .md-tabs-navigation {
        padding: 15px;
        .md-button {
            min-width: 100px;
        }
    }
}
</style>
