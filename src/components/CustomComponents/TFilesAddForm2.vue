<template>
    <div>
        <div class="file-header-block">
            <md-toolbar
                class="toolbar-jaw md-alignment-center-space-between md-layout md-transparent"
            >
                <div class="md-layout-item">
                    <md-field
                         :class="[
                            {'with-subline': true},
                            {'md-valid': !errors.has('files') && touched.files},
                            {'md-error': errors.has('files')}]"
                            >
                        <label>Select files</label>
                        <md-file v-model="multiple" multiple @md-change="addedFiles" />
                         <span class="md-error">{{errors.first('files')}}</span>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="errors.has('files')"
                                @click="user.files='',focusOn('files')"
                                class="md-button md-icon-button md-dense md-input-action"
                            >
                                <md-icon class="error">close</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                        <slide-y-down-transition>
                            <md-button
                                tabindex="-1"
                                v-show="!errors.has('files')  && touched.files"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">done</md-icon>
                            </md-button>
                        </slide-y-down-transition>
                    </md-field>
                </div>
                <div>
                    <div
                        style="max-height:41px;"
                        class="manipulations-input__action md-layout-item md-alignment-center-right md-layout"
                    >
                        <md-button
                            ref="addButton"
                            tabindex="1"
                            id="addButton"
                            key="addButton"
                            :class="[{'md-primary': multiple}]"
                            class="md-button md-just-icon md-round"
                            @keydown.enter="downloadFile()"
                            @click="downloadFile()"
                        >
                            <md-icon>add</md-icon>
                        </md-button>
                    </div>
                </div>
            </md-toolbar>
        </div>
    </div>
</template>

<script>

    
    import { UPLOAD_FILE_SETTINGS } from '@/constants';

    const MAX_SIZE = 100000;
    const MAX_WIDTH = 500;
    const MAX_HEIGHT = 300;

    export default {
        name: 't-files-add-form',
        processRefreshToken: false,
        props: {
            url: {
                type: String,
                default: '',
            },
            access_token: {
                type: String,
                default: '',
            },
            files: {
                type: Array,
                default: () => [],
            },
            maxFilesize: {
                type: Number,
                default: () => 5,
            },
            tokenExpiresAt: {
                type: String,
                default: () => '',
            },
            authRefreshToken: {
                type: String,
                default: () => '',
            },
            patientAddSubProp: {
                type: String,
                default: () => '',
            },
        },
        data() {
            return {
                multiple: null,
                image: {
                    size: '',
                    height: '',
                    width: '',
                },
                imageError: '',
                modelValidations: {
                    files: {
                        required: true,
                    },
                },
            };
        },
        computed: {
            dropzoneOptions() {
                const options = {
                    url: this.url,
                    thumbnailWidth: 150,
                    maxFilesize: this.maxFilesize,
                    paramName: 'file',
                    forcefallback: true,
                    duplicateCheck: true,
                    autoProcessQueue: false,
                    headers: {
                        'Cache-Control': null,
                        'X-Requested-With': null,
                    },
                };
                return options;
            },
        },
        methods: {
            onSuccess(file, response) {
                this.$emit('onSuccess', response);
            },
            downloadFile() {
                this.$emit('onSaveFiles', this.multiple);
                console.log(this.multiple);
            },
            addedFiles(files) {
                this.$emit('onAddedFiles', files);
                console.log(files);
                if (!files || files.length === 0) {
                    return;
                }
                this.imageError = '';
                const file = files[0];
                if (!file || file.type.indexOf('image/') !== 0) return;
                this.image.size = file.size;
                if (this.image.size > MAX_SIZE) {
                    this.imageError = `The image size (${this.image.size}) is too much (max is ${MAX_SIZE}).`;
                    return;
                }

                const reader = new FileReader();

                reader.readAsDataURL(file);
                reader.onload = (evt) => {
                    const img = new Image();
                    img.onload = () => {
                        this.image.width = img.width;
                        this.image.height = img.height;
                        console.log(this.image);
                        console.log(reader.result);
                        if (this.image.width > MAX_WIDTH) {
                            this.imageError = `The image width (${this.image.width}) is too much (max is ${MAX_WIDTH}).`;
                            return;
                        }
                        if (this.image.height > MAX_HEIGHT) {
                            this.imageError = `The image height (${this.image.height}) is too much (max is ${MAX_HEIGHT}).`;
                        }
                    };
                    img.src = evt.target.result;
                };

                reader.onerror = (evt) => {
                    console.error(evt);
                };
            },
        },
    };
</script>

<style lang="scss" scoped>
.file-header-block {
    border-radius: 8px;
    border: none;
    background-color: rgb(236, 236, 236) !important;
}
</style>
