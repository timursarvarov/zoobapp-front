<template>
    <nav-tabs-card class="procedure-wrapper" v-if="patient.ID">
        <template slot="content">
            <!-- <span class="md-nav-tabs-title">Set new:</span> -->
            <md-tabs :class="['md-' + currentTabColor()]" md-alignment="left">
                <md-tab
                    id="tab-anamnes"
                    md-icon="history"
                    md-label="BIO"
                >
                     <div class="md-layout ">
                        <patient-card/>
                    </div>
                </md-tab>

                <md-tab
                    id="tab-diagnose"
                    md-icon="create"
                    md-label="Treatment"
                >
                    <div class="md-layout ">
                        <patient-treatment/>
                    </div>
                </md-tab>

                <md-tab
                    id="tab-notes"
                    md-icon="question_answer"
                    md-label="Notes"
                >
                    <notes></notes>
                </md-tab>
                <md-tab
                    id="tab-files"
                    md-icon="folder_shared"
                    md-label="Files"
                >
                    <patient-add-files-form/>
                    <patient-files></patient-files>
                </md-tab>
            </md-tabs>
        </template>
    </nav-tabs-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { NavTabsCard } from '@/components';
    import { PATIENT_GET, NOTIFY } from '@/constants';

    import {
        PatientTreatment,
        Notes,
        PatientFiles,
        PatientAddFilesForm,
        PatientCard,

    } from '@/pages';

    export default {
        components: {
            NavTabsCard,
            PatientTreatment,
            Notes,
            PatientFiles,
            PatientAddFilesForm,
            PatientCard,
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
        },
        computed: {
            ...mapGetters({
                jaw: 'jaw',
                patient: 'getPatient',
            }),
        },
        created() {
            // this.$store.dispatch(TEETH_INITIATION_ETHALON);
            if (
                this.$route.params.patientId
                && (this.patient.ID === null
                || this.patient.ID !== parseInt(this.$route.params.patientId, 10))
            ) {
                this.$store.dispatch(PATIENT_GET, {
                    patientId: this.$route.params.patientId,
                });
            }
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
.procedure-wrapper {
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
    .text-right {
        display: flex;
    }
    .md-tabs-navigation{
        padding: 15px;
        .md-button{
            min-width: 100px;
        }
    }
}
</style>
