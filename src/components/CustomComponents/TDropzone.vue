
<template>
    <div :id="id" ref="dropzoneElement" :class="{ ' dropzone': includeStyling }">
        <div v-if="useCustomSlot" class="dz-message">
            <slot>Drop files here to upload</slot>
        </div>
    </div>
</template>

<script>
import Dropzone from "dropzone"; //eslint-disable-line
    Dropzone.autoDiscover = false;
    export default {
        props: {
            id: {
                type: String,
                required: true,
                default: 'dropzone',
            },
            options: {
                type: Object,
                required: true,
            },
            includeStyling: {
                type: Boolean,
                default: true,
                required: false,
            },
            destroyDropzone: {
                type: Boolean,
                default: true,
                required: false,
            },
            duplicateCheck: {
                type: Boolean,
                default: false,
                required: false,
            },
            useCustomSlot: {
                type: Boolean,
                default: false,
                required: false,
            },
        },
        data() {
            return {
                wasQueueAutoProcess: true,
            };
        },
        computed: {
            dropzoneSettings() {
                const defaultValues = {
                    thumbnailWidth: 200,
                    thumbnailHeight: 200,
                };
                Object.keys(this.options).forEach(function (key) {
                    defaultValues[key] = this.options[key];
                }, this);
                return defaultValues;
            },
        },
        mounted() {
            if (this.$isServer && this.hasBeenMounted) {
                return;
            }
            this.hasBeenMounted = true;
            this.dropzone = new Dropzone(
                this.$refs.dropzoneElement,
                this.dropzoneSettings,
            );
            const vm = this;
            this.dropzone.on('thumbnail', (file, dataUrl) => {
                vm.$emit('vdropzone-thumbnail', file, dataUrl);
            });
            this.dropzone.on('addedfile', function (file) {
                let isDuplicate = false;
                if (vm.duplicateCheck) {
                    if (this.files.length) {
                        let _i;
                        let _len;
                        for (
                            _i = 0, _len = this.files.length;
                            _i < _len - 1;
                            _i += 1 // -1 to exclude current file
                        ) {
                            if (
                                this.files[_i].name === file.name
                                && this.files[_i].size === file.size
                                && this.files[_i].lastModifiedDate.toString()
                                    === file.lastModifiedDate.toString()
                            ) {
                                this.removeFile(file);
                                isDuplicate = true;
                                vm.$emit('vdropzone-duplicate-file', file);
                            }
                        }
                    }
                }
                vm.$emit('vdropzone-file-added', file);
            });
            this.dropzone.on('addedfiles', (files) => {
                vm.$emit('vdropzone-files-added', files);
            });
            this.dropzone.on('removedfile', (file) => {
                vm.$emit('vdropzone-removed-file', file);
                if (file.manuallyAdded) vm.dropzone.options.maxFiles++;
            });
            this.dropzone.on('success', (file, response) => {
                vm.$emit('vdropzone-success', file, response);
            });
            this.dropzone.on('successmultiple', (file, response) => {
                vm.$emit('vdropzone-success-multiple', file, response);
            });
            this.dropzone.on('error', (file, message, xhr) => {
                vm.$emit('vdropzone-error', file, message, xhr);
            });
            this.dropzone.on('errormultiple', (files, message, xhr) => {
                vm.$emit('vdropzone-error-multiple', files, message, xhr);
            });
            this.dropzone.on('sending', (file, xhr, formData) => {
                vm.$emit('vdropzone-sending', file, xhr, formData);
            });
            this.dropzone.on('sendingmultiple', (file, xhr, formData) => {
                vm.$emit('vdropzone-sending-multiple', file, xhr, formData);
            });
            this.dropzone.on('complete', (file) => {
                vm.$emit('vdropzone-complete', file);
            });
            this.dropzone.on('completemultiple', (files) => {
                vm.$emit('vdropzone-complete-multiple', files);
            });
            this.dropzone.on('canceled', (file) => {
                vm.$emit('vdropzone-canceled', file);
            });
            this.dropzone.on('canceledmultiple', (files) => {
                vm.$emit('vdropzone-canceled-multiple', files);
            });
            this.dropzone.on('maxfilesreached', (files) => {
                vm.$emit('vdropzone-max-files-reached', files);
            });
            this.dropzone.on('maxfilesexceeded', (file) => {
                vm.$emit('vdropzone-max-files-exceeded', file);
            });
            this.dropzone.on('processing', (file) => {
                vm.$emit('vdropzone-processing', file);
            });
            this.dropzone.on('processingmultiple', (files) => {
                vm.$emit('vdropzone-processing-multiple', files);
            });
            this.dropzone.on('uploadprogress', (file, progress, bytesSent) => {
                vm.$emit('vdropzone-upload-progress', file, progress, bytesSent);
            });
            this.dropzone.on(
                'totaluploadprogress',
                (totaluploadprogress, totalBytes, totalBytesSent) => {
                    vm.$emit(
                        'vdropzone-total-upload-progress',
                        totaluploadprogress,
                        totalBytes,
                        totalBytesSent,
                    );
                },
            );
            this.dropzone.on('reset', () => {
                vm.$emit('vdropzone-reset');
            });
            this.dropzone.on('queuecomplete', () => {
                vm.$emit('vdropzone-queue-complete');
            });
            this.dropzone.on('drop', (event) => {
                vm.$emit('vdropzone-drop', event);
            });
            this.dropzone.on('dragstart', (event) => {
                vm.$emit('vdropzone-drag-start', event);
            });
            this.dropzone.on('dragend', (event) => {
                vm.$emit('vdropzone-drag-end', event);
            });
            this.dropzone.on('dragenter', (event) => {
                vm.$emit('vdropzone-drag-enter', event);
            });
            this.dropzone.on('dragover', (event) => {
                vm.$emit('vdropzone-drag-over', event);
            });
            this.dropzone.on('dragleave', (event) => {
                vm.$emit('vdropzone-drag-leave', event);
            });
            vm.$emit('vdropzone-mounted');
        },
        beforeDestroy() {
            if (this.destroyDropzone) this.dropzone.destroy();
        },
        methods: {
            manuallyAddFile(file, fileUrl) {
                file.manuallyAdded = true;
                this.dropzone.emit('addedfile', file);
                let containsImageFileType = false;
                if (
                    fileUrl.indexOf('.png') > -1
                    || fileUrl.indexOf('.jpg') > -1
                    || fileUrl.indexOf('.jpeg') > -1
                ) { containsImageFileType = true; }
                if (
                    this.dropzone.options.createImageThumbnails
                    && containsImageFileType
                    && file.size
                        <= this.dropzone.options.maxThumbnailFilesize * 1024 * 1024
                ) {
                    fileUrl && this.dropzone.emit('thumbnail', file, fileUrl);
                    const thumbnails = file.previewElement.querySelectorAll(
                        '[data-dz-thumbnail]',
                    );
                    for (let i = 0; i < thumbnails.length; i += 1) {
                        thumbnails[i].style.width = `${
                            this.dropzoneSettings.thumbnailWidth
                        }px`;
                        thumbnails[i].style.height = `${
                            this.dropzoneSettings.thumbnailHeight
                        }px`;
                        thumbnails[i].style['object-fit'] = 'contain';
                    }
                }
                this.dropzone.emit('complete', file);
                if (this.dropzone.options.maxFiles) { this.dropzone.options.maxFiles--; }
                this.dropzone.files.push(file);
                this.$emit('vdropzone-file-added-manually', file);
            },
            setOption(option, value) {
                this.dropzone.options[option] = value;
            },
            removeAllFiles(bool) {
                this.dropzone.removeAllFiles(bool);
            },
            processQueue() {
                const dropzoneEle = this.dropzone;
                this.dropzone.processQueue();
                this.dropzone.on('success', () => {
                    dropzoneEle.options.autoProcessQueue = true;
                });
                this.dropzone.on('queuecomplete', () => {
                    dropzoneEle.options.autoProcessQueue = false;
                });
            },
            init() {
                return this.dropzone.init();
            },
            destroy() {
                return this.dropzone.destroy();
            },
            updateTotalUploadProgress() {
                return this.dropzone.updateTotalUploadProgress();
            },
            getFallbackForm() {
                return this.dropzone.getFallbackForm();
            },
            getExistingFallback() {
                return this.dropzone.getExistingFallback();
            },
            setupEventListeners() {
                return this.dropzone.setupEventListeners();
            },
            removeEventListeners() {
                return this.dropzone.removeEventListeners();
            },
            disable() {
                return this.dropzone.disable();
            },
            enable() {
                return this.dropzone.enable();
            },
            filesize(size) {
                return this.dropzone.filesize(size);
            },
            accept(file, done) {
                return this.dropzone.accept(file, done);
            },
            addFile(file) {
                return this.dropzone.addFile(file);
            },
            removeFile(file) {
                this.dropzone.removeFile(file);
            },
            getAcceptedFiles() {
                return this.dropzone.getAcceptedFiles();
            },
            getRejectedFiles() {
                return this.dropzone.getRejectedFiles();
            },
            getFilesWithStatus() {
                return this.dropzone.getFilesWithStatus();
            },
            getQueuedFiles() {
                return this.dropzone.getQueuedFiles();
            },
            getUploadingFiles() {
                return this.dropzone.getUploadingFiles();
            },
            getAddedFiles() {
                return this.dropzone.getAddedFiles();
            },
            getActiveFiles() {
                return this.dropzone.getActiveFiles();
            },
        },
    };
</script>

<style lang="scss">


.dropzone,
.dropzone * {
    box-sizing: border-box;
}
.dropzone {
    position: relative;

    .dz-preview {
        position: relative;
        display: inline-block;
        width: 120px;
        margin: 0.5em;

        .dz-progress {
            display: block;
            height: 15px;
            border: 1px solid #aaa;
            .dz-upload {
                display: block;
                height: 100%;
                width: 0;
                background: green;
            }
        }

        .dz-error-message {
            color: red;
            display: none;
        }
        &.dz-error {
            .dz-error-message,
            .dz-error-mark {
                display: block;
            }
        }
        &.dz-success {
            .dz-success-mark {
                display: block;
            }
        }

        .dz-error-mark,
        .dz-success-mark {
            position: absolute;
            display: none;
            left: 30px;
            top: 30px;
            width: 54px;
            height: 58px;
            left: 50%;
            margin-left: -(54px/2);
        }
    }
}

.vue-dropzone {
    border: 2px solid #e5e5e5;
    font-family: "Arial", sans-serif;
    letter-spacing: 0.2px;
    color: #777;
    transition: background-color 0.2s linear;
    &:hover {
        background-color: #f6f6f6;
    }
    i {
        color: #ccc;
    }
    .dz-preview {
        .dz-image {
            border-radius: 0;
            width: 100%;
            height: 100%;
            img:not([src]) {
                width: 200px;
                height: 200px;
            }
            &:hover {
                img {
                    transform: none;
                    -webkit-filter: none;
                }
            }
        }
        .dz-details {
            bottom: 0;
            top: 0;
            color: white;
            background-color: rgba(33, 150, 243, 0.8);
            transition: opacity 0.2s linear;
            text-align: left;
            .dz-filename {
                overflow: hidden;
            }
            .dz-filename span,
            .dz-size span {
                background-color: transparent;
            }
            .dz-filename:not(:hover) span {
                border: none;
            }
            .dz-filename:hover span {
                background-color: transparent;
                border: none;
            }
        }
        .dz-progress .dz-upload {
            background: #cccccc;
        }
        .dz-remove {
            position: absolute;
            z-index: 30;
            color: white;
            margin-left: 15px;
            padding: 10px;
            top: inherit;
            bottom: 15px;
            border: 2px white solid;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 0.8rem;
            font-weight: 800;
            letter-spacing: 1.1px;
            opacity: 0;
        }
        &:hover {
            .dz-remove {
                opacity: 1;
            }
        }
        .dz-success-mark,
        .dz-error-mark {
            margin-left: auto;
            margin-top: auto;
            width: 100%;
            top: 35%;
            left: 0;
            svg {
                margin-left: auto;
                margin-right: auto;
            }
        }
        .dz-error-message {
            top: calc(15%);
            margin-left: auto;
            margin-right: auto;
            left: 0;
            width: 100%;
            &:after {
                bottom: -6px;
                top: initial;
                border-top: 6px solid #a92222;
                border-bottom: none;
            }
        }
    }
}

@mixin keyframes($name) {
    @-webkit-keyframes #{$name} {
        @content;
    }
    @-moz-keyframes #{$name} {
        @content;
    }
    @keyframes #{$name} {
        @content;
    }
}

@mixin prefix($map, $vendors: webkit moz ms o) {
    @each $prop, $value in $map {
        @if $vendors {
            @each $vendor in $vendors {
                #{"-" + $vendor + "-" + $prop}: #{$value};
            }
        }
        // Dump regular property anyway
        #{$prop}: #{$value};
    }
}

@include keyframes(passing-through) {
    0% {
        opacity: 0;
        @include prefix(
            (
                transform: translateY(40px)
            )
        );
    }

    30%,
    70% {
        opacity: 1;
        @include prefix(
            (
                transform: translateY(0px)
            )
        );
    }

    100% {
        opacity: 0;
        @include prefix(
            (
                transform: translateY(-40px)
            )
        );
    }
}

@include keyframes(slide-in) {
    0% {
        opacity: 0;
        @include prefix(
            (
                transform: translateY(40px)
            )
        );
    }

    30% {
        opacity: 1;
        @include prefix(
            (
                transform: translateY(0px)
            )
        );
    }
}

@include keyframes(pulse) {
    0% {
        @include prefix(
            (
                transform: scale(1)
            )
        );
    }
    10% {
        @include prefix(
            (
                transform: scale(1.1)
            )
        );
    }
    20% {
        @include prefix(
            (
                transform: scale(1)
            )
        );
    }
}

.dropzone,
.dropzone * {
    box-sizing: border-box;
}
.dropzone {
    $image-size: 120px;

    $image-border-radius: 20px;

    &.dz-clickable {
        cursor: pointer;

        * {
            cursor: default;
        }
        .dz-message {
            &,
            * {
                cursor: pointer;
            }
        }
    }

    min-height: 150px;
    border: 2px solid rgba(0, 0, 0, 0.3);
    background: white;
    padding: 20px 20px;

    &.dz-started {
        .dz-message {
            display: none;
        }
    }

    &.dz-drag-hover {
        border-style: solid;
        .dz-message {
            opacity: 0.5;
        }
    }
    .dz-message {
        text-align: center;
        margin: 2em 0;
    }

    .dz-preview {
        position: relative;
        display: inline-block;

        vertical-align: top;

        margin: 16px;
        min-height: 100px;

        &:hover {
            // Making sure that always the hovered preview element is on top
            z-index: 1000;
            .dz-details {
                opacity: 1;
            }
        }

        &.dz-file-preview {
            .dz-image {
                border-radius: $image-border-radius;
                background: #999;
                background: linear-gradient(to bottom, #eee, #ddd);
            }

            .dz-details {
                opacity: 1;
            }
        }

        &.dz-image-preview {
            background: white;
            .dz-details {
                @include prefix(
                    (
                        transition: opacity 0.2s linear
                    )
                );
            }
        }

        .dz-remove {
            font-size: 14px;
            text-align: center;
            display: block;
            cursor: pointer;
            border: none;
            &:hover {
                text-decoration: underline;
            }
        }

        &:hover .dz-details {
            opacity: 1;
        }
        .dz-details {
            $background-color: #444;

            z-index: 20;

            position: absolute;
            top: 0;
            left: 0;

            opacity: 0;

            font-size: 13px;
            min-width: 100%;
            max-width: 100%;
            padding: 2em 1em;
            text-align: center;
            color: rgba(0, 0, 0, 0.9);

            $width: 120px;

            line-height: 150%;

            .dz-size {
                margin-bottom: 1em;
                font-size: 16px;
            }

            .dz-filename {
                white-space: nowrap;

                &:hover {
                    span {
                        // border: 1px solid rgba(200, 200, 200, 0.8);
                        // background-color: rgba(255, 255, 255, 0.8);
                    }
                }
                &:not(:hover) {
                    span {
                        border: 1px solid transparent;
                    }
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .dz-filename,
            .dz-size {
                span {
                    // background-color: rgba(255, 255, 255, 0.4);
                    padding: 0 0.4em;
                    border-radius: 3px;
                }
            }
        }

        &:hover {
            .dz-image {
                // opacity: 0.8;
                img {
                    @include prefix(
                        (
                            transform: scale(1.05, 1.05)
                        )
                    ); // Getting rid of that white bleed-in
                    @include prefix(
                        (
                            filter: blur(8px)
                        ),
                        webkit
                    ); // Getting rid of that white bleed-in
                }
            }
        }
        .dz-image {
            border-radius: $image-border-radius;
            overflow: hidden;
            width: $image-size;
            height: $image-size;
            position: relative;
            display: block;
            z-index: 10;

            img {
                display: block;
            }
        }

        &.dz-success {
            .dz-success-mark {
                @include prefix(
                    (
                        animation: passing-through 3s
                            cubic-bezier(0.77, 0, 0.175, 1)
                    )
                );
            }
        }
        &.dz-error {
            .dz-error-mark {
                opacity: 1;
                @include prefix(
                    (
                        animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1)
                    )
                );
            }
        }

        .dz-success-mark,
        .dz-error-mark {
            $image-height: 54px;
            $image-width: 54px;

            pointer-events: none;

            opacity: 0;
            z-index: 500;

            position: absolute;
            display: block;
            top: 50%;
            left: 50%;
            margin-left: -($image-width/2);
            margin-top: -($image-height/2);

            svg {
                display: block;
                width: $image-width;
                height: $image-height;
            }
        }

        &.dz-processing .dz-progress {
            opacity: 1;
            @include prefix(
                (
                    transition: all 0.2s linear
                )
            );
        }
        &.dz-complete .dz-progress {
            opacity: 0;
            @include prefix(
                (
                    transition: opacity 0.4s ease-in
                )
            );
        }

        &:not(.dz-processing) {
            .dz-progress {
                @include prefix(
                    (
                        animation: pulse 6s ease infinite
                    )
                );
            }
        }
        .dz-progress {
            opacity: 1;
            z-index: 1000;

            pointer-events: none;
            position: absolute;
            height: 16px;
            left: 50%;
            top: 50%;
            margin-top: -8px;

            width: 80px;
            margin-left: -40px;

            // border: 2px solid #333;
            background: rgba(255, 255, 255, 0.9);

            // Fix for chrome bug: https://code.google.com/p/chromium/issues/detail?id=157218
            -webkit-transform: scale(1);

            border-radius: 8px;

            overflow: hidden;

            .dz-upload {
                background: #333;
                background: linear-gradient(to bottom, #666, #444);
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 0;
                @include prefix(
                    (
                        transition: width 300ms ease-in-out
                    )
                );
            }
        }

        &.dz-error {
            .dz-error-message {
                display: block;
            }
            &:hover .dz-error-message {
                opacity: 1;
                pointer-events: auto;
            }
        }

        .dz-error-message {
            $width: $image-size + 20px;
            $color: rgb(190, 38, 38);

            pointer-events: none;
            z-index: 1000;
            position: absolute;
            display: block;
            display: none;
            opacity: 0;
            @include prefix(
                (
                    transition: opacity 0.3s ease
                )
            );
            border-radius: 8px;
            font-size: 13px;
            top: $image-size + 10px;
            left: -10px;
            width: $width;
            background: $color;
            background: linear-gradient(to bottom, $color, darken($color, 5%));
            padding: 0.5em 1.2em;
            color: white;

            // The triangle pointing up
            &:after {
                content: "";
                position: absolute;
                top: -6px;
                left: $width / 2 - 6px;
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid $color;
            }
        }
    }
}
</style>
