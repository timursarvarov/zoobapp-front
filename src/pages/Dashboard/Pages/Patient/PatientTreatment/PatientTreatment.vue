<template>
    <nav-tabs-card class="procedure-wrapper" v-if="patient.ID">
        <template slot="content">
            <!-- <span class="md-nav-tabs-title">Set new:</span> -->
            <md-tabs :class="['md-' + currentTabColor()]" md-alignment="left" md-sync-route>
                <md-tab
                    id="tab-anamnes"
                    md-icon="history"
                    md-label="Anamnes"
                    :to="`/patient/${patient.ID}/anamnes`"
                >
                     <div class="md-layout ">
                        <anamnes/>
                    </div>
                </md-tab>

                <md-tab
                    id="tab-diagnose"
                    md-icon="create"
                    md-label="Diagnose"
                    :to="`/patient/${patient.ID}/diagnose`"
                >
                    <div class="md-layout ">
                        <diagnose/>
                    </div>
                </md-tab>

                <md-tab
                    id="tab-therapy"
                    md-icon="add"
                    md-label="Procedure"
                    :to="`/patient/${patient.ID}/procedure`"
                >
                    <div class="md-layout">
                        <procedures/>
                    </div>
                </md-tab>
                <md-tab
                    id="tab-notes"
                    md-icon="question_answer"
                    md-label="Notes"
                    :to="`/patient/${patient.ID}/notes`"
                >
                    <notes></notes>
                </md-tab>
                <md-tab
                    id="tab-files"
                    md-icon="folder_shared"
                    md-label="Files"
                    :to="`/patient/${patient.ID}/files`"
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
    import { NavTabsCard, Jaw, IconBase } from '@/components';
    import { PATIENT_GET, NOTIFY } from '@/constants';

    import {
        Anamnes,
        Diagnose,
        Notes,
        PatientFiles,
        PatientAddFilesForm,
        Procedures,
    } from '@/pages';

    export default {
        components: {
            Anamnes,
            NavTabsCard,
            Diagnose,
            Procedures,
            Notes,
            PatientFiles,
            PatientAddFilesForm,
        },
        data() {
            return {
                showDialog: false,
                actionSize: {},
                selectedTeeth: [],
                selectedDiagnose: [],
            };
        },
        methods: {
            Implant() {
                console.log(this.selectedTeeth);
                for (let index = 0; index < this.selectedTeeth.length; index += 1) {
                    this.jaw.anamnesis[this.selectedTeeth[index]].implant = true;
                    this.jaw.anamnesis[this.selectedTeeth[index]].root = false;
                }
            // this.jaw.anamnesis[17].implant = true;
            // this.jaw.anamnesis[17].root = false;
            },
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
