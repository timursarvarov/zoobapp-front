<template>
    <md-dialog class="tooth-diagnosis-form" :md-active.sync="showFormLocal">
        <div>
            <md-card>
                <md-card-header class="md-card-header-icon md-card-header-green">
                    <div class="card-icon">
                        <md-icon>{{icon}}</md-icon>
                    </div>
                    <h4 class="title">
                        <b>{{item.code}}</b>
                        {{item.title}}
                    </h4>
                </md-card-header>
                <md-card-content>
                    <div ref="contentWrapper" class="content-wrapper">
                        <div v-if="item" class="content-wrapper__tooth">
                            <div ref="toothWrapper" class="tooth-wrapper md-layout-item">
                                <tooth
                                    :selectedToothId="toothId"
                                    :jaw="jaw"
                                    :selectedDiagnose="item"
                                    :teethSystem="teethSystem"
                                    :originalItems="originalItems"
                                    :classType="classType"
                                    :scaleSize="7"
                                />
                            </div>
                            <div
                                :style="{
                                'max-height': height + 'px',
                            }"
                                class="content-body"
                            >
                                <div class="content" v-if="item.description || (item.manipulations && item.manipulations.length > 0)" >
                                    <div v-if="item.description" >
                                        <md-subheader>
                                            Description
                                        </md-subheader>
                                        <div class="md-layout-item">
                                            {{item.description}}
                                        </div>
                                    </div>
                                      <slot name="content"></slot>
                                    </div>
                                <div v-else>
                                    <md-empty-state
                                        class="md-primary"
                                        md-icon="list"
                                        md-label="No description to show"
                                        md-description="No description was created"
                                    >
                                        <md-button  @click="$emit('editItem', item), showFormLocal=false"
                                        class="md-primary md-raised">Add Description</md-button>
                                    </md-empty-state>
                                </div>
                            </div>
                        </div>
                        <div class="teeth-content">
                            <div class="teeth-content__wrapper" v-if="otherTeeth.length > 0 ">
                                <div class="teeth-content__title">Other teeth In this diagnose:</div>
                                <div class="teeth md-layout-item jaw mx-auto">
                                    <tooth
                                        v-for="toothId in otherTeeth"
                                        :key="toothId"
                                        :selectedToothId="toothId"
                                        :jaw="jaw"
                                        :selectedDiagnose="item"
                                        :teethSystem="teethSystem"
                                        :originalItems="originalItems"
                                        :classType="classType"
                                        :scaleSize="4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <div class="md-layout">
                        <div v-if="item.author" class="md-layout-item author">
                            <t-avatar
                                class="author-avatar"
                                :small="true"
                                :color="item.author.color"
                                :imageSrc="item.author.avatar"
                                :title="item.author.firstName + ' ' + item.author.lastName"
                            />&nbsp;
                            <span>{{item.author.lastName | capitilize}}</span>&nbsp;
                            <span>{{item.author.firstName | capitilize}}</span>&nbsp;
                            <span>{{ item.date | moment("from") | capitilize }}</span>&nbsp;
                            (
                            <small>{{item.date | moment("calendar")}}</small>)
                        </div>
                    </div>
                    <md-button class="md-info" @click="$emit('editItem', item), showFormLocal=false">Edit</md-button>
                    <md-button class="md-success" @click="showFormLocal = !showFormLocal">OK</md-button>
                </md-card-actions>
            </md-card>
        </div>
    </md-dialog>
</template>
<script>
    import { Tooth, TAvatar } from '@/components';

    export default {
        name: 't-tooth-items',
        components: {
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
            item: {
                type: Object,
                default: () => {},
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
                default: () => {},
            },
            title: {
                type: String,
                default: () => 'Tooth Diagnosis',
            },
        },
        data() {
            return {
                height: 0,
                width: 0,
            };
        },
        methods: {
            calculateHeight() {
                if (this.$refs.toothWrapper) {
                    this.height = this.$refs.toothWrapper.clientHeight;
                    this.width = this.$refs.contentWrapper.clientWidth - this.$refs.toothWrapper.clientWidth - 30;
                }
            },
        },
        mounted() {
            this.calculateHeight();
        },
        computed: {
            otherTeeth() {
                let teeth = [];
                if (this.item.teeth) {
                    teeth = Object.keys(this.item.teeth);
                    const tIndex = teeth.indexOf(this.toothId);
                    if (tIndex >= 0) {
                        teeth.splice(tIndex, 1);
                    }
                }
                return teeth;
            },
            diagnosisTitles() {
                const titles = [];
                this.diagnosisWithTooth.forEach((diagnose, index) => {
                    titles.push(
                        `${index + 1} - ${diagnose.code} ${diagnose.title}`,
                    );
                });
                return titles;
            },
            diagnosisWithTooth() {
                const diagnosis = [];
                this.patientItems.forEach((diagnose) => {
                    if (
                        diagnose.teeth
                        && Object.keys(diagnose.teeth).includes(this.toothId)
                    ) {
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
    max-width: 100vw;
    max-height: 100vh;
    .content-wrapper {
        max-width: 80vw;
        min-width: 60vw;
        overflow-y: auto;
        overflow-x: scroll;
        // max-height: 26vh;
        &::-webkit-scrollbar {
            width: 7px;
            // background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: grey;
            border-radius: 7px;
        }
        overflow-x: auto;
        .content {
            // max-width: calc(70vw - 90px);
        }
        .content-wrapper__tooth {
            min-height: 50vh;
            max-height: 50vh;
            display: flex;
            align-items: stretch;
            .md-empty-state {
                // padding: 0;
            }
            .tooth-wrapper {
                flex-grow: 0;
            }
            .content-body {
                max-width: calc(80vw - 90px);
                width: min-content;
                min-width: 60vw;
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                padding-left: 15px;
                padding-right: 15px;
                word-wrap: break-word;
                flex: 1 0 auto;
                overflow-y: auto;
                overflow-x: scroll;
                &::-webkit-scrollbar {
                    width: 7px;
                    // background-color: transparent;
                }
                &::-webkit-scrollbar-thumb {
                    background-color: grey;
                    border-radius: 7px;
                }
                overflow-x: auto;
            }
        }

        .teeth-content {
            position: relative;
            // max-width: fit-content;
            padding: 0 15px 0 15px;
            margin-top: 15px;

            .teeth-content__wrapper {
                border-style: solid;
                border-color: rgba(128, 128, 128, 0.212);
                border-width: 1px;
                border-radius: 3px;
                background-color: #eeecec9c;
                overflow-y: auto;
                overflow-x: auto;
                padding: 20px 10px 10px 10px;
                &::-webkit-scrollbar {
                    height: 4px;
                    // background-color: transparent;
                }
                &::-webkit-scrollbar-thumb {
                    background-color: grey;
                    border-radius: 7px;
                }
                .teeth-content__title {
                    position: absolute;
                    top: 5px;
                }
                .teeth {
                    display: flex;
                }
            }
        }
    }
    .author-avatar {
        display: inline-block;
        margin-right: 8px;
    }
    .author {
        padding: 8px 16px;
        text-align: left;
        vertical-align: middle;
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
