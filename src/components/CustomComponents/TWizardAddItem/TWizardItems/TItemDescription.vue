<template>
    <div class="wizard-tab-content" :style="[{ 'min-width': size.width ? `${size.width}px` : `70vw` }, { 'min-height': `${size.height}px` }]">
        <div class="md-layout-item">
            <t-wuswug :contentDescription="contentDescription" v-model="descriptionL">
                <div slot="start" ref="autocomplete">
                    <div ref="autocomplete" class="manipulations-autocomplite">
                        <cool-select
                            ref="autocomplete"
                            v-model="selectedDescription"
                            class="with-action md-field"
                            :class="[{ 'md-focused': coolSelectFocus }]"
                            tabindex="1"
                            :items="descriptionHeaders"
                            :arrows-disable-instant-selection="true"
                            :disable-first-item-select-on-enter="true"
                            item-text="text"
                            item-value="title"
                            :placeholder="selectedDescription ? '' : $t(`${$options.name}.selectDescription`)"
                            @focus="coolSelectFocus = true"
                            @blur="coolSelectFocus = false"
                            @select="setDescription"
                        >
                            <template v-if="item" slot="item" slot-scope="{ item }">
                                <div style="display: flex;">
                                    <md-button class="IZ-select-button md-layout-item">
                                        <span v-if="item && item.title" class="text-left">
                                            {{ item.title | capitilize }}
                                            <br />
                                            <span v-if="item && item.description" class="text-left">{{ `${item.description}` }}</span>
                                        </span>
                                    </md-button>
                                </div>
                            </template>
                            <template slot="no-data">
                                <div class="md-layout" style="display: flex; white-space: pre-wrap;oveflow:hidden;">
                                    <span class="md-layout-item md-size-100" style="white-space: pre-wrap;oveflow:hidden;">
                                        {{ $t(`${$options.name}.selectDescription`) }}
                                    </span>
                                </div>
                            </template>
                        </cool-select>
                    </div>
                </div>
            </t-wuswug>
        </div>
    </div>
</template>
<script>
import TWuswug from '@/components/CustomComponents/TWuswug';
import { CoolSelect } from 'vue-cool-select';

export default {
    name: 'TItemDescription',
    components: {
        TWuswug,
        CoolSelect
    },
    model: {
        prop: 'description',
        event: 'updateDescription'
    },
    props: {
        description: {
            type: String,
            default: () => ''
        },
        descriptions: {
            type: Array,
            default: () => []
        },
        size: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            contentDescription: '',
            selectedDescription: '',
            code: '',
            coolSelectFocus: false,
            touched: {
                code: false
            },
            modelValidations: {
                description: {
                    required: true,
                    min: 5
                }
            }
        };
    },
    methods: {
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$refs[ref].$el.focus();
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
        },
        validate() {
            return this.$validator.validateAll().then(res => {
                this.$emit('on-validated', res, 'step2');
                this.$emit('validated-code', this.code);
                return res;
            });
        },
        setDescription(item) {
            this.descriptionL = item.description;
            this.contentDescription = item.description;
        }
    },
    computed: {
        descriptionHeaders: {
            get() {
                const descriptionTitles = [];
                Object.values(this.descriptions).forEach(d => {
                    descriptionTitles.push({
                        ...d,
                        text: d.title + d.description
                    });
                });
                return descriptionTitles || [];
            },
            set() {}
        },
        descriptionL: {
            get() {
                return this.description;
            },
            set(value) {
                this.$emit('updateDescription', value);
            }
        }
    },
    mounted() {
        if (this.$refs.description) {
            this.$refs.description.$el.focus();
        }
        this.contentDescription = this.descriptionL;
    }
};
</script>
<style lang="scss">
.ProseMirror {
    min-height: 200px;
}
</style>
