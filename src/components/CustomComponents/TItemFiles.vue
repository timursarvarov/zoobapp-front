<template>
    <div class="wizard-tab-content" :style="[{ 'min-width': `${size.width}px` }, { 'min-height': `${size.height}px` }]">
        <div class="absolute-header-block">
            <t-files-add-form
                class="md-layout-item"
                :url="url"
                :access_token="access_token"
                :tokenExpiresAt="`${tokenExpiresAt}`"
                :authRefreshToken="authRefreshToken"
                :patientAddSubProp="patientAddSubProp"
                :maxFilesize="5"
                @onSuccess="onSuccess"
            >
                <div slot="emptyState">
                    <h3>
                        Add new file
                    </h3>
                    <span>
                        Click here or drope some files
                    </span>
                </div>
            </t-files-add-form>
        </div>
        <div class="files-list">
            <t-files-list :columns="columns" :paginated="false" :access_token="access_token" :files="patient.files" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { tObjProp } from '@/mixins';
import {
    AUTH_REFRESH_TOKEN,
    PATIENT_ADD_SUB_PROP,
    BASE_URL
    // eslint-disable-next-line import/no-unresolved
} from '@/constants';

export default {
    name: 'patient-files',
    mixins: [tObjProp],
    components: {
        't-files-add-form': () => import('./TFilesAddForm'),
        't-files-list': () => import('./TFilesList')
    },
    props: {
        size: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            columns: [
                {
                    key: 'filePreview',
                    title: 'Preview',
                    sortable: false
                },
                {
                    key: 'name',
                    title: 'Name',
                    sortable: true
                },
                {
                    key: 'filesize',
                    title: 'File Size',
                    sortable: true
                }
            ]
        };
    },
    methods: {
        onSuccess(response) {
            this.$store.dispatch(PATIENT_ADD_SUB_PROP, {
                params: {
                    propName: 'files',
                    value: response[0]
                }
            });
        },
        validate() {
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res, 'step3');
                return res;
            });
        }
    },
    computed: {
        ...mapGetters({
            access_token: 'fetchStateAccessToken',
            patient: 'getPatient',
            tokenExpiresAt: 'expiresAt'
        }),
        url() {
            return `${BASE_URL}/patients/${this.patient ? this.patient.ID : ''}/files/`;
        },
        authRefreshToken() {
            return AUTH_REFRESH_TOKEN;
        },
        patientAddSubProp() {
            return PATIENT_ADD_SUB_PROP;
        }
    }
};
</script>
