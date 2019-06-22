<template>
    <md-dialog v-if="showForm" class="tooth-diagnosis-form" :md-active.sync="showFormLocal">
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
                        <div class="md-layout">
                            <div class="teeth-content md-layout-item mx-auto">
                                <div
                                    class="teeth-content__wrapper mx-auto"
                                    v-if="otherTeeth.length > 0 "
                                >
                                    <div
                                        v-for="(cJaw, key) in compJaw"
                                        :key="key"
                                        class="teeth md-alignment-center-center md-layout jaw mx-auto"
                                    >
                                        <tooth
                                            v-for="toothId in cJaw"
                                            :key="toothId"
                                            :showNumber="false"
                                            :toothId="toothId"
                                            :jaw="jaw"
                                            :selectedItem="item"
                                            :teethSystem="teethSystem"
                                            :originalItems="originalItems"
                                            :type="type"
                                            :scaleSize="3.5"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="md-layout-item md-layout">
                                <md-list>
                                    <md-list-item v-if="item.author">
                                        <md-avatar>
                                            <t-avatar
                                                class="author-avatar"
                                                :small="true"
                                                :color="item.author.color"
                                                :imageSrc="item.author.avatar"
                                                :title="item.author.firstName + ' ' + item.author.lastName"
                                            />
                                        </md-avatar>
                                        <div class="md-list-item-text">
                                            <span>{{item.author.lastName | capitilize}}</span>
                                            <span>{{item.author.firstName | capitilize}}</span>
                                        </div>
                                    </md-list-item>

                                    <md-list-item
                                        v-if="item.date"
                                    >
                                        <div class="md-list-item-text">
                                        <span>{{ item.date | moment("from") | capitilize }}</span>
                                        <span>{{item.date | moment("calendar")}}</span>
                                        </div>
                                    </md-list-item>
                                </md-list>
                            </div>
                        </div>

                        <div v-if="showEmptyState()">
                            <div v-if="item.manipulations && item.manipulations.length>0">
                                <md-toolbar class="md-transparent"> <span class="md-title">Manipulations </span> </md-toolbar>
                                <div class="md-layout-item">
                                    <md-table
                                        v-model="item.manipulations"
                                        table-header-color="green"
                                    >
                                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                                            <md-table-cell
                                                md-label="Code"
                                            >{{ item.manipulation.code }}</md-table-cell>
                                            <md-table-cell
                                                md-label="Title"
                                            >{{ item.manipulation.title }}</md-table-cell>
                                            <md-table-cell
                                                md-label="Qty"
                                                class="manipulations-input"
                                            >{{item.num}}</md-table-cell>
                                            <md-table-cell>*</md-table-cell>
                                            <md-table-cell md-label="Price">{{ item.price }}</md-table-cell>
                                            <md-table-cell
                                                md-label="Total"
                                            >{{ item.price * item.num }} {{currencyCode}}</md-table-cell>
                                        </md-table-row>
                                    </md-table>
                                    <div class="footer-table md-table">
                                        <table>
                                            <tfoot>
                                                <tr>
                                                    <th class="md-table-head">
                                                        <div
                                                            class="md-table-head-container md-ripple md-disabled"
                                                        >
                                                            <div
                                                                class="md-table-head-label"
                                                            >Total manipulations: {{item.manipulations.length}}</div>
                                                        </div>
                                                    </th>
                                                    <th class="md-table-head">
                                                        <div
                                                            class="md-table-head-container md-ripple md-disabled"
                                                        >
                                                            <div class="md-table-head-label">
                                                                Total price:
                                                                {{totalPrice}}
                                                                {{currencyCode}}
                                                            </div>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div >
                                <md-toolbar class="md-transparent"> <span class="md-title">Description </span> </md-toolbar>
                                <div  v-html="item.description" class="md-layout-item"></div>
                            </div>
                            <div v-if="files.length > 0" >
                                <md-toolbar class="md-transparent"> <span class="md-title">Files </span> </md-toolbar>
                                <div class="md-layout-item imgcontainer files md-layout">
                                    <div
                                        v-viewer="options"
                                        class="md-xsmall-size-100 md-layout-item md-size-50 md-medium-size-33 md-small-size-50 file-wrapper"
                                        v-for="(file, key) in files"
                                        :key="key"
                                    >
                                        <t-file-preview
                                            @show="show"
                                            :width="360"
                                            :iconSize="4"
                                            :title="file.name"
                                            :height="240"
                                            :url="file.url"
                                            :mimeType="file.mimeType"
                                            :showOverlay="true"
                                            overlayIcon="visibility"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <md-empty-state
                                class="md-primary"
                                md-icon="list"
                                md-label="No description to show"
                                md-description="No description was created"
                            ></md-empty-state>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <md-button @click="$emit('onPrint', item, type), showFormLocal=false">Print</md-button>
                    <md-button
                        class="md-info"
                        @click="$emit('editItem', item, type), showFormLocal=false"
                    >Edit</md-button>
                    <md-button class="md-success" @click="showFormLocal = !showFormLocal">OK</md-button>
                </md-card-actions>
            </md-card>
        </div>
    </md-dialog>
</template>
<script>
    import {
 Tooth, TAvatar, TFilesList, TFilePreview 
} from '@/components';
    import {
        TEETH_ADDULT_ALL,
        TEETH_DEFAULT_LOCATIONS,
        TEETH_ADDULT_BOTTOM,
        TEETH_ADDULT_TOP,
        TEETH_BABY_BOTTOM,
        TEETH_BABY_TOP,
        TEETH_BABY_ALL,
        TEETH_ALL,
    } from '@/constants';

    export default {
        name: 't-tooth-items',
        components: {
            Tooth,
            TAvatar,
            TFilesList,
            TFilePreview,
        },
        props: {
            files: {
                type: Array,
                default: () => [],
            },
            currencyCode: {
                type: String,
                default: () => '',
            },
            access_token: {
                type: String,
                default: '',
            },
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
                default: () => ({
                    description: '',
                    manipulations: [],
                    otherTeeth: [],
                }),
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
            type: {
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
                options: {
                    filter(image) {
                        return image.classList.contains('img-to-preview');
                    },
                },
                columns: [
                    {
                        key: 'filePreview',
                        title: 'Preview',
                        sortable: false,
                    },
                    {
                        key: 'name',
                        title: 'Name',
                        sortable: true,
                    },
                    {
                        key: 'filesize',
                        title: 'File Size',
                        sortable: true,
                    },
                ],
            };
        },
        methods: {
            show() {
            // const vuer = this.$el.querySelector('.images').$vuer;
            // console.log(this.$el.querySelector('.img-to-preview'));
            // const vuer = this.$el.querySelector('.img-to-preview').$vuer
            //  const vuer = this.$el.querySelector('.images').$vuer
            // vuer.show()
            },
            showEmptyState() {
                if (
                    (this.item.description && this.item.description.length > 0)
                || (this.item.manipulations
                    && this.item.manipulations.length > 0)
                || (this.files && this.files.length > 0)
                ) {
                    return true;
                }
                return false;
            },
        },
        computed: {
            totalPrice() {
                let sum = 0;
                if (this.item.manipulations && this.item.manipulations.length > 0) {
                    this.item.manipulations.forEach((manip) => {
                        sum += manip.price * manip.num;
                    });
                }
                return sum;
            },
            otherTeeth() {
                let teeth = [];
                if (this.item.teeth) {
                    teeth = Object.keys(this.item.teeth);
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
            teeth() {
                return TEETH_ALL;
            },
            babyTeeth() {
                return TEETH_BABY_ALL;
            },
            adultTeeth() {
                return TEETH_ADDULT_ALL;
            },
            topAdultTeeth() {
                return TEETH_ADDULT_TOP;
            },
            bottomAdultTeeth() {
                return TEETH_ADDULT_BOTTOM;
            },
            topBabyTeeth() {
                return TEETH_BABY_TOP;
            },
            bottomBabyTeeth() {
                return TEETH_BABY_BOTTOM;
            },
            defaultLocations() {
                return TEETH_DEFAULT_LOCATIONS;
            },
            jawType() {
                if (this.item.teeth && this.item.teeth.length > 0) {
                    const firstToothId = Object.keys(this.item.teeth)[0];
                    if (this.babyTeeth.includes(firstToothId)) {
                        return 'babyTeeth';
                    }
                }
                return 'adultTeeth';
            },
            compJaw() {
                if (this.jawType === 'babyTeeth') {
                    const jaw = [this.topBabyTeeth, this.bottomBabyTeeth];
                    return jaw;
                }
                const jaw = [this.topAdultTeeth, this.bottomAdultTeeth];
                return jaw;
            },
        },
    };
</script>
<style lang="scss">
.md-dialog.tooth-diagnosis-form {
    max-width: 100vw;
    max-height: 100vh;
    .content-wrapper {
        max-height: 70vh;
        max-width: 80vw;
        min-width: 70vw;
        overflow-y: scroll;
        // max-height: 26vh;
        &::-webkit-scrollbar {
            width: 7px;
            // background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: grey;
            border-radius: 7px;
        }
        .files {
            .file-wrapper {
                padding: 15px;
            }
        }
        .teeth-content {
            padding: 0 15px 0 15px;
            margin-top: 15px;

            .teeth-content__wrapper {
                width: 400px;
                border-style: solid;
                border-color: rgba(128, 128, 128, 0.212);
                border-width: 1px;
                border-radius: 3px;
                background-color: #eeecec9c;
                padding: 20px 10px 10px 10px;
                .teeth {
                    display: flex;
                }
            }
        }
        // .content-wrapper__tooth {
        //     min-height: 50vh;
        //     max-height: 50vh;
        //     display: flex;
        //     align-items: stretch;
        //     .md-empty-state {
        //         // padding: 0;
        //     }
        //     .tooth-wrapper {
        //         flex-grow: 0;
        //     }
        //     .content-body {
        //         max-width: calc(80vw - 90px);
        //         width: min-content;
        //         min-width: 60vw;
        //         display: flex;
        //         flex-grow: 1;
        //         flex-direction: column;
        //         padding-left: 15px;
        //         padding-right: 15px;
        //         word-wrap: break-word;
        //         flex: 1 0 auto;
        //         overflow-y: auto;
        //         overflow-x: scroll;
        //         &::-webkit-scrollbar {
        //             width: 7px;
        //             // background-color: transparent;
        //         }
        //         &::-webkit-scrollbar-thumb {
        //             background-color: grey;
        //             border-radius: 7px;
        //         }
        //         overflow-x: auto;
        //     }
        // }
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
