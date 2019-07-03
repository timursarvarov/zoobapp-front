<template>
    <div
        class="wizard-tab-content"
    >
        <div class='md-layout-item' >
          
        </div>
    </div>
</template>
<script>
    import { TAutoComplite, TWuswug } from '@/components';

    export default {
        components: {
            TAutoComplite,
        },
        model: {
            prop: 'description',
            event: 'updateDescription',
        },
        props: {
            description: {
                type: String,
                default: () => '',
            },
            descriptions: {
                type: Array,
                default: () => [],
            },
            size: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                contentDescription: '',
                selectedDescription: '',
                code: '',
                touched: {
                    code: false,
                },
                modelValidations: {
                    // description: {
                    //     required: true,
                    //     min: 5,
                    // },
                },
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
                // if (error.message === '') {
                //     return;
                // }
                // const field = this.$validator.fields.find({
                //     name: error.type,
                //     scope: this.$options.scope,
                // });
                // if (!field) return;
                // this.$validator.errors.add({
                //     id: error.type,
                //     field: error.type,
                //     msg: error.message,
                //     scope: this.$options.scope,
                // });
                // field.setFlags({
                //     invalid: true,
                //     valid: false,
                //     validated: true,
                // });
            },
            validate() {
                return this.$validator.validateAll().then((res) => {
                    this.$emit('on-validated', res, 'step2');
                    this.$emit('validated-code', this.code);
                    return res;
                });
            },
            setDescription(key) {
                const desc = Object.values(this.descriptions).find(
                    d => d.title === key,
                );
                if (desc) {
                    this.descriptionL = desc.description;
                    this.contentDescription = desc.description;
                }
            },
        },
        computed: {
            descriptionHeaders: {
                get() {
                    const descriptionTitles = Object.values(this.descriptions).map(
                        d => d.title,
                    );
                    return descriptionTitles || [];
                },
                set() {},
            },
            descriptionL: {
                get() {
                    return this.description;
                },
                set(value) {
                    this.$emit('updateDescription', value);
                },
            },
        },
        mounted() {
            if (this.$refs.description) {
                this.$refs.description.$el.focus();
            }
            this.contentDescription = this.descriptionL;
        },
    };
</script>
