<template>
    <div>
        <t-dropzone
            ref="myDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            v-on:vdropzone-sending="addHeader"
            v-on:vdropzone-file-added="checkForExpiredToken"
            v-on:vdropzone-files-added="checkForExpiredToken"
            v-on:vdropzone-file-added-manually="checkForExpiredToken"
            v-on:vdropzone-success="onSuccess"
            :useCustomSlot="true"
        >
           <slot name="emptyState"/>
        </t-dropzone>
    </div>
</template>

<script>

    
    import { AUTH_REFRESH_TOKEN } from '@/constants';

    export default {
        name: 't-files-add-form2',
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
        components: {
            't-dropzone': () => import('./TDropzone'),
        },
        data() {
            return {};
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
            addHeader(file, xhr) {
                xhr.setRequestHeader(
                    'Authorization',
                    `Bearer ${this.access_token}`,
                );
            },
            checkForExpiredToken() {
                const currentTime = Math.floor(Date.now() / 1000);
                if (this.tokenExpiresAt < currentTime) {
                    if (!this.processRefreshToken) {
                        this.processRefreshToken = true;
                        // eslint-disable-next-line no-new
                        new Promise((resolve, reject) => {
                            this.$store.dispatch(AUTH_REFRESH_TOKEN).then(
                                (response) => {
                                    this.$refs.myDropzone.processQueue();
                                    this.processRefreshToken = false;
                                    resolve(response);
                                },
                                (error) => {
                                    this.processRefreshToken = false;
                                    reject(error);
                                },
                            );
                        });
                    }
                } else {
                    this.$refs.myDropzone.processQueue();
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
.dropzone{
    border-radius: 8px;
    opacity: 0.98;
    border: none;
    background-color: rgb(236, 236, 236)!important;
}
</style>
