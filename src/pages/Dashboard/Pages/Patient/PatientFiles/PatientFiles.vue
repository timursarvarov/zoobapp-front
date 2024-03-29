<template>
    <div class="patients-files-wrapper">
        <div>
            <t-files-add-form
                class="add-files"
                :url="url"
                :access_token="access_token"
                :token-expires-at="`${tokenExpiresAt}`"
                :auth-refresh-token="authRefreshToken"
                :patient-add-sub-prop="patientAddSubProp"
                :max-filesize="5"
                @onSuccess="onSuccess"
            >
                <md-empty-state
                    slot="emptyState"
                    md-icon="cloud_upload"
                    :md-label="$t(`${$options.name}.addFileTitle`)"
                    :md-description="$t(`${$options.name}.addFileDescription`)"
                >
                    <div>
                        <b> {{ $tc(`${$options.name}.totalFiles`, files.length) }} ({{ totalFiles | formatBytes }})</b>
                    </div>
                </md-empty-state>
            </t-files-add-form>
        </div>
        <t-files-list :access_token="access_token" :files="patient.files" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import { tObjProp } from '@/mixins';
import {
    AUTH_REFRESH_TOKEN,
    PATIENT_ADD_SUB_PROP,
    BASE_URL,
    STORE_KEY_PATIENT
    // eslint-disable-next-line import/no-unresolved
} from '@/constants';

export default {
    name: 'PatientFiles',
    components: {
        ...components
    },
    mixins: [tObjProp],
    data() {
        return {
            code: '',
            touched: {
                code: false
            }
        };
    },
    computed: {
        ...mapGetters({
            access_token: 'fetchStateAccessToken',
            patient: `${STORE_KEY_PATIENT}/getPatient`,
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
        },
        totalFiles() {
            return this.files.reduce((a, b) => a + (b.size || 0), 0);
        },
        files() {
            return this.patient.files || [];
        }
    },
    methods: {
        onSuccess(response) {
            this.$store.dispatch(`$_patient/${PATIENT_ADD_SUB_PROP}`, {
                params: {
                    propName: 'files',
                    value: response[0]
                }
            });
        },
        validate() {
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res, 'step2');
                this.$emit('validated-code', this.code);
                return res;
            });
        }
    }
};
</script>

<style lang="scss">
.patients-files-wrapper {
    .add-files {
        padding: 15px;
    }
}
</style>
