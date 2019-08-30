<template>
    <div class="patient-profile-wrapper">
        <nav-tabs-card v-if="patient.ID">
            <template slot="content">
                <!-- <span class="md-nav-tabs-title">Set new:</span> -->
                <md-tabs
                    md-sync-route
                    class="md-success"
                    md-alignment="left"
                >
                    <md-tab
                        id="tab-bio"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/bio`"
                        md-icon="account_box"
                        md-label="BIO"
                    >
                        <div class="md-layout">
                            <keep-alive>
                                <router-view name="Bio" />
                            </keep-alive>
                        </div>
                    </md-tab>
                    <md-tab
                        id="tab-treatment"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/treatment`"
                        md-icon="local_hospital"
                        md-label="Treatment"
                    >
                        <div class="md-layout">
                            <keep-alive>
                                <router-view name="TreatmentChild" />
                                <router-view name="itemsList" />
                            </keep-alive>
                        </div>
                    </md-tab>
                    <md-tab
                        id="tab-billing"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/billing`"
                        md-icon="account_balance"
                        md-label="Billing"
                    >
                        <div class="md-layout">
                            <router-view name="Billing" />
                        </div>
                    </md-tab>
                    <md-tab
                        id="tab-notes"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/notes`"
                        md-icon="question_answer"
                        md-label="Notes"
                    >
                        <router-view name="Notes" />
                    </md-tab>
                    <md-tab
                        id="tab-files"
                        :to="`/${$i18n.locale}/patient/${patient.ID}/files`"
                        md-icon="folder_shared"
                        md-label="Files"
                    >
                        <router-view name="Files" />
                    </md-tab>
                </md-tabs>
            </template>
        </nav-tabs-card>
        <router-view name="itemsList" />
        <div
            v-show="!patient.ID && patientStatus ==='loading'"
            class="jaw md-layout-item"
        >
            <div
                v-if="true"
                style="margin:auto; height:100%"
                class="md-layout mx-auto patient-wrapper-preloader"
            >
                <div style="height:60px;margin: auto;">
                    <md-progress-spinner md-mode="indeterminate" />
                </div>
            </div>
        </div>
        <div
            v-show="!patient.ID && patientStatus ==='error'"
            class="jaw md-layout-item"
        >
            <md-empty-state
                md-icon="error"
                md-label="No connection"
                md-description="No server connection"
            >
                <md-button
                    class="md-primary md-raised"
                    @click="getPatient"
                >
                    RETRY
                </md-button>
            </md-empty-state>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import { PATIENT_GET } from '@/constants';
import store from '@/store'

export default {
    beforeRouteEnter(to, from, next) {
        if (!store.getters.getPatient.ID || `${store.getters.getPatient.ID}` !== `${to.params.patientID}`) {
            store.dispatch(PATIENT_GET, {
                patientID: to.params.patientID,
            }).then((patient) => {
                if (patient) {
                    next((vm) => {
                        vm.setWindowTitle();
                    });
                }
            }).catch((err => {
                throw new Error(err);
            })).then(()=>{
                next();
            });
        }else {
            next();
        }
    },
    beforeRouteUpdate(to, from, next) {
        if (!this.patient.ID || `${this.patient.ID}` !== `${to.params.patientID}`) {
            store.dispatch(PATIENT_GET, {
                patientID: to.params.patientID,
            }).then((patient) => {
                if (patient) {
                    next(() => {
                        this.setWindowTitle();
                    });
                }
            }).catch((err => {
                throw new Error(err);
            })).then(()=>{
                next();
            });
        } else {
            next();
        }
    },
    beforeRouteLeave(to, from, next) {
        document.title = 'ZoobApp';
        next();
    },
    name: 'PatientProfile',
    components: {
        ...components,
    },
    data() {
        return {
            showDialog: false,
            actionSize: {},
            selectedTeeth: [],
            selectedDiagnose: [],
        };
    },
    computed: {
        ...mapGetters({
            jaw: 'jaw',
            patient: 'getPatient',
            patientStatus: 'getPatientStatus',
        }),
    },
    created() {
    },
    methods: {
        setWindowTitle(){
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
        },
        getPatient() {
            if (
                this.$route.params.patientID
                    && (this.patient.ID === null
                    || this.patient.ID
                        !== parseInt(this.$route.params.patientID, 10))
            ) {
                this.$store
                    .dispatch(PATIENT_GET, {
                        patientID: this.$route.params.patientID,
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
};
</script>
<style lang="scss" >
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
