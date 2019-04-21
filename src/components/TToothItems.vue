<template>
    <md-dialog
        class="tooth-diagnosis-form"
        :md-active.sync="showFormLocal"
    >
        <div>
            <md-card>
                <md-card-header class="md-card-header-icon md-card-header-green">
                    <div class="card-icon">
                        <md-icon>{{icon}}</md-icon>
                    </div>
                    <h4 class="title">{{title}}</h4>
                </md-card-header>
                <md-card-content>
                    <div class="tooth-diagnosis-collapse-wrapper">
                        <collapse
                            :collapse="diagnosisTitles"
                            icon="keyboard_arrow_down"
                            color-collapse="success"
                        >
                            <template
                                v-for="(diagnose, index) in diagnosisWithTooth"
                                :slot="'md-collapse-pane-'+(parseInt(index) + 1)"
                            >
                                <div
                                    class="tooth-content-wrapper"
                                    :key="index"
                                >
                                    <div class="md-layout">
                                        <div class="">
                                            <tooth
                                                :selectedToothId="toothId"
                                                :jaw='jaw'
                                                :selectedDiagnose="diagnose"
                                                :teethSystem="teethSystem"
                                                :originalItems="originalItems"
                                                :classType="classType"
                                            />
                                        </div>
                                        <div class="md-layout-item content-body">
                                            <div class="content">
                                                <div v-if="diagnose.description">{{diagnose.description}}</div>
                                                <div v-else>
                                                    <md-empty-state
                                                        class="md-primary"
                                                        md-icon="list"
                                                        md-label="No description to show"
                                                        md-description="No description was created"
                                                    >
                                                    </md-empty-state>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                            <div class="md-layout md-alignment-center-space-between footer">
                                                <div>

                                                    <div class=" md-layout md-layout-item md-alignment-center author">
                                                        <div>
                                                            <t-avatar
                                                                :small="true"
                                                                :color="diagnose.author.color"
                                                                :imageSrc="diagnose.author.avatar"
                                                                :title="diagnose.author.firstName + ' ' + diagnose.author.lastName"
                                                            />
                                                        </div>
                                                        <div
                                                            class=" md-layout-item "
                                                            style="display: table"
                                                        >
                                                            <div style="  display: table-cell; vertical-align: middle;">
                                                                <span>{{diagnose.author.lastName | capitilize}}</span><br/>
                                                                <span>{{diagnose.author.firstName | capitilize}}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div class="md-layout-item">
                                                    <span>{{ diagnose.date | moment("from") | capitilize }} </span><br/>
                                                    (<small>{{diagnose.date | moment("calendar")}}</small>)
                                                </div>
                                                <div class="md-layout-item" >
                                                    Other teeth In this diagnose:<br/>
                                                        <span v-for="toothId in otherTeeth(index)" :key="toothId">
                                                                {{toothId | toCurrentTeethSystem(teethSystem)}},
                                                        </span>
                                                </div>
                                            </div>
                                </div>
                            </template>
                        </collapse>
                    </div>

                </md-card-content>
                <md-card-actions>
                    <md-button
                        class="md-success"
                        @click="showFormLocal = !showFormLocal"
                    >OK</md-button>
                </md-card-actions>
            </md-card>
        </div>
    </md-dialog>
</template>
<script>
    import { Collapse, Tooth, TAvatar } from '@/components';

    export default {
        name: 't-tooth-diagnosis',
        components: {
            Collapse,
            Tooth,
            TAvatar,
        },
        props: {
            buttonColor: {
                type: String,
                default: '',
            },
            teethSystem: {
                type: Number,
                default: () => 1,
            },
            showForm: {
                type: Boolean,
                default: false,
            },
            toothId: {
                type: String,
                default: '0',
            },
            icon: {
                type: String,
                default: 'list',
            },
            patientItems: {
                type: Array,
                default: () => [],
            },
            classType: {
                type: String,
                default: () => 'diagnosis',
            },
            originalItems: {
                type: Array,
                default: () => [],
            },
            jaw: {
                type: Object,
                default: () => { },
            },
            title: {
                type: String,
                default: () => 'Tooth Diagnosis',
            },
        },
        data() {
            return {
            };
        },
        methods: {
            otherTeeth(dIndex) {
                return Object.keys(this.diagnosisWithTooth[dIndex].teeth);
            },

        },
        mounted() {
        },
        computed: {
            diagnosisTitles() {
                const titles = [];
                this.diagnosisWithTooth.forEach((diagnose, index) => {
                    titles.push(`${index + 1} - ${diagnose.code} ${diagnose.title}`);
                });
                return titles;
            },
            diagnosisWithTooth() {
                const diagnosis = [];
                this.patientItems.forEach((diagnose) => {
                    if (diagnose.teeth && Object.keys(diagnose.teeth).includes(this.toothId)) {
                        diagnosis.push(diagnose);
                    }
                });
                return diagnosis;
            },
            showFormLocal: {
                // геттер:
                get() {
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
    min-width: 80vh;
    max-height: 90vh;
    .tooth-diagnosis-collapse-wrapper {
        max-height: 60vh;
        border-style: solid;
        border-color: rgba(128, 128, 128, 0.212);
        border-width: 1px;
        border-radius: 3px;
        margin: 20px 0 20px 0;
        overflow: hidden;
        overflow-y: scroll;
        padding: 20px 10px 20px 10px;
        &::-webkit-scrollbar {
            width: 7px;
            background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: grey;
            border-radius: 7px;
        }
        .tooth-content-wrapper {
            background-color: #f7f7f7d5;
            border-style: solid;
            border-color: #eeecec9c;
            border-width: 1px;
            border-radius: 4px;
            margin: 15px 0 5px 0;
            padding: 15px;
        }
        .md-collapse {
            .md-collapse-label:after {
                bottom: 0px;
            }
            .content-body {
                display: flex;
                flex-direction: column;
                .content {
                    flex: 1 0 auto;
                }
                .footer {
                    flex: 0 0 auto;
                }
            }
        }
    }
    .size-text {
        transition: visibility 0s linear 0.33s, opacity 0.33s linear;
    }
    .error {
        color: red;
    }
    .success {
        color: green;
    }
    background-color: transparent !important;
    box-shadow: none !important;
}
</style>
