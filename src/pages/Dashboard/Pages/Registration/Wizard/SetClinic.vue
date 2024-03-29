<template>
    <div>
        <h5 class="info-text">
            <label>{{ $t(`${$options.name}.setClinic`) }}</label>
        </h5>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-100 md-small-size-100">
                <div class="picture-container">
                    <div class="picture">
                        <div v-if="!currentClinic.logo">
                            <!-- <icon-base
                                class="icon-wrapper--item"
                                width="104"
                                height="104"
                                icon-name="icon-tooth-wings"
                                style="margin-top:10px;"
                            /> -->
                        </div>
                        <div v-else>
                            <img :src="currentClinic.logo" />
                        </div>
                        <input ref="imageInserter" type="file" accept="image/*" @change="onFileChange" />
                    </div>
                    <h6 class="description">
                        <label>{{ $t(`${$options.name}.chooseClinicLogo`) }}</label>
                    </h6>
                </div>
            </div>
            <div class="md-layout-item md-size-100 md-small-size-100">
                <md-field
                    :class="[
                        { 'md-valid': !errors.has('clinicName') && touched.clinicName },
                        { 'md-form-group': true },
                        { 'md-error': errors.has('clinicName') }
                    ]"
                >
                    <md-icon>business</md-icon>
                    <label>{{ $t(`${$options.name}.clinicName`) }}</label>
                    <md-input
                        ref="clinicName"
                        v-model="clinicName"
                        v-validate="modelValidations.clinicName"
                        data-vv-name="clinicName"
                        type="text"
                        name="clinicName"
                        required
                    />
                    <span class="md-error">{{ errors.first('clinicName') }}</span>
                    <slide-y-down-transition>
                        <md-button
                            v-show="errors.has('clinicName')"
                            class="md-just-icon md-round md-input-action clear-button md-simple"
                            @click="(clinicName = ''), focusOn('clinicName')"
                        >
                            <md-icon class="error">
                                close
                            </md-icon>
                        </md-button>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                        <md-icon v-show="!errors.has('clinicName') && touched.clinicName" class="success">
                            done
                        </md-icon>
                    </slide-y-down-transition>
                </md-field>
            </div>
            <image-cropper-form
                v-model="fd"
                :max-filesize="2000"
                button-color="green"
                title="Add clinic logo"
                :icon="'add_a_photo'"
                :image-name="currentClinic.ID != null ? currentClinic.ID.toString() + '_' + Date.now() : ''"
                :image-to-corp="image"
                :show-form.sync="showForm"
            />
        </div>
    </div>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';
import { mapGetters } from 'vuex';
import { NOTIFY } from '@/constants';
import { ImageCropperForm } from '@/pages';

export default {
    name: 'SetClinic',
    components: {
        SlideYDownTransition,
        ImageCropperForm
    },
    props: {
        error: {
            type: Object,
            default() {
                return {
                    message: 'Wrong clinic name',
                    type: 'clinicName'
                };
            }
        }
    },
    data() {
        return {
            fd: null,
            showForm: false,
            image: '',
            clinicName: '',
            touched: {
                clinicName: false
            },
            modelValidations: {
                clinicName: {
                    required: true,
                    min: 5
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic'
        })
    },
    watch: {
        error: {
            handler(val) {
                if (val.message) {
                    this.showErrorsValidate(val);
                    this.error.message = '';
                }
            },
            deep: true
        },
        clinicName() {
            this.touched.clinicName = true;
        },
        fd() {
            this.$emit('addedLogo', this.fd);
        }
    },
    methods: {
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$refs[ref].$el.focus();
        },
        clearImage() {
            const input = this.$refs.imageInserter;
            input.type = 'text';
            input.type = 'file';
        },
        handlePreview(file) {
            this.model.imageUrl = URL.createObjectURL(file.raw);
        },
        getError(fieldName) {
            return this.errors.first(fieldName);
        },
        validate() {
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res, 'step4');
                this.$emit('validated-clinicName', this.clinicName);
                return res;
            });
        },
        onFileChange(e) {
            const files = e.target.files || e.dataTransfer.files;
            if (files.length > 0) {
                this.createImage(files[0]);
                this.showForm = true;
                this.clearImage();
            } else {
                this.$store.dispatch(NOTIFY, {
                    settings: {
                        message: 'No files selected!',
                        type: 'warning'
                    }
                });
            }
        },
        createImage(file) {
            const reader = new FileReader();
            const vm = this;

            reader.onload = e => {
                vm.image = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        showErrorsValidate(error) {
            if (error.message === '') {
                return;
            }
            const field = this.$validator.fields.find({
                name: error.type,
                scope: this.$options.scope
            });
            if (!field) return;
            this.$validator.errors.add({
                id: error.type,
                field: error.type,
                msg: error.message,
                scope: this.$options.scope
            });
            field.setFlags({
                invalid: true,
                valid: false,
                validated: true
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.picture {
    input {
        max-width: 120px;
    }
}
</style>
