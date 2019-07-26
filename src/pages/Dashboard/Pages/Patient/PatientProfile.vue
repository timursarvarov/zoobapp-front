<template>
    <div class="patient-profile-wrapper" >
        <nav-tabs-card  v-show="patient.ID">
            <template slot="content">
                <!-- <span class="md-nav-tabs-title">Set new:</span> -->
                <md-tabs :class="['md-' + currentTabColor()]" md-alignment="left">
                    <md-tab id="tab-diagnose" md-icon="local_hospital" md-label="Treatment">
                        <div class="md-layout">
                            <patient-treatment ref="treatment" />
                        </div>
                    </md-tab>
                    <md-tab id="tab-anamnes" md-icon="account_box" md-label="BIO">
                        <div class="md-layout">
                            <patient-card />
                        </div>
                    </md-tab>

                    <md-tab id="tab-billing" md-icon="account_balance" md-label="Billing">
                        <patient-billing />
                    </md-tab>
                    <md-tab id="tab-notes" md-icon="question_answer" md-label="Notes">
                        <notes />
                    </md-tab>
                    <md-tab id="tab-files" md-icon="folder_shared" md-label="Files">
                        <patient-files />
                    </md-tab>
                </md-tabs>
            </template>
        </nav-tabs-card>
        <div class="jaw md-layout-item" v-show="!patient.ID && patientStatus ==='loading'"  >
             <div style="margin:auto; height:100%" class="md-layout mx-auto patient-wrapper-preloader"
                    v-if="true" >
                    <div  style="height:60px;margin: auto;" >
                        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
                    </div>
                </div>
        </div>
        <div v-show="!patient.ID && patientStatus ==='error'" class="jaw md-layout-item">
            <md-empty-state
                md-icon="error"
                md-label="No connection"
                md-description="No server connection"
            >
                <md-button @click="getPatient" class="md-primary md-raised">RETRY</md-button>
            </md-empty-state>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { NavTabsCard } from '@/components';
    import { PATIENT_GET, NOTIFY } from '@/constants';

    import {
        PatientTreatment,
        Notes,
        PatientFiles,
        PatientCard,
        PatientBilling,
    } from '@/pages';

    export default {
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                if (vm.patient.ID) {
                    let firstName = '';
                    let lastName = '';
                    if (typeof vm.patient.firstName === 'string') {
                        firstName = vm.patient.firstName.charAt(0).toUpperCase()
                            + vm.patient.firstName.slice(1);
                    }
                    if (typeof vm.patient.lastName === 'string') {
                        lastName = vm.patient.lastName.charAt(0).toUpperCase()
                            + vm.patient.lastName.slice(1);
                    }

                    document.title = `${firstName} ${lastName} - ZoobApp`;
                }
            });
        },
        beforeRouteUpdate(to, from, next) {
            if (this.patient.ID) {
                let firstName = '';
                let lastName = '';
                if (typeof this.patient.firstName === 'string') {
                    firstName = this.patient.firstName.charAt(0).toUpperCase()
                        + this.patient.firstName.slice(1);
                }
                if (typeof this.patient.lastName === 'string') {
                    lastName = this.patient.lastName.charAt(0).toUpperCase()
                        + this.patient.lastName.slice(1);
                }
                document.title = `${firstName} ${lastName} - ZoobApp`;
            }
            next();
        },
        beforeRouteLeave(to, from, next) {
            document.title = 'ZoobApp';
            next();
        },
        components: {
            NavTabsCard,
            PatientTreatment,
            Notes,
            PatientFiles,
            PatientCard,
            PatientBilling,
        },
        name: 'PatientProfile',
        data() {
            return {
                showDialog: false,
                actionSize: {},
                selectedTeeth: [],
                selectedDiagnose: [],
            };
        },
        methods: {
            currentTabColor() {
                let color = '';
                color = 'success';
                return color;
            },
            getPatient() {
                if (
                    this.$route.params.patientId
                    && (this.patient.ID === null
                    || this.patient.ID !== parseInt(this.$route.params.patientId, 10))
                ) {
                    this.$store
                        .dispatch(PATIENT_GET, {
                            patientId: this.$route.params.patientId,
                        })
                        .then((patient) => {
                            if (patient) {
                                document.title = `${patient.firstName} ${patient.lastName} `
                                    + ' - ZoobApp';
                            }
                        });
                }
            },
        },
        computed: {
            ...mapGetters({
                jaw: 'jaw',
                patient: 'getPatient',
                patientStatus: 'getPatientStatus',
            }),
        },
        created() {
            this.getPatient();
        },
        watch: {
            $route() {
                if (
                    this.$route.params.patientId
                    && (this.patient.ID === null
                    || this.patient.ID
                        !== parseInt(this.$route.params.patientId, 10))
                ) {
                    this.$store.dispatch(PATIENT_GET, {
                        patientId: this.$route.params.patientId,
                    });
                    this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Patient changed',
                            type: 'success',
                        },
                    });
                }
            },
        },
    };
</script>
<style lang="scss" >
.patient-profile-wrapper {
     .patient-wrapper-preloader{
            position: absolute;
            z-index: 30;
            top:0;
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
