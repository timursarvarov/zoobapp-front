<template>
    <div>
        <md-dialog
            class="plan-add-form"
            :md-active.sync="showFormL"
            @md-opened="focusOn('planName')"
        >
            <div>
                <md-card>
                    <md-card-header
                        class="md-card-header-icon "
                    >
                        <div class="card-icon md-card-header-green">
                            <md-icon>{{ icon }}</md-icon>
                        </div>
                        <h4 class="name">
                            {{ title }}
                        </h4>
                    </md-card-header>
                    <md-card-content class="md-layout">
                        <slot="content" />
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <slot="actions" />
                    </md-card-actions>
                </md-card>
            </div>
        </md-dialog>
    </div>
</template>
<script>
export default {
    name: 'TDialogForm',
    props: {
        icon: {
            type: String,
            default: () => 'playlist_add',
        },
        title: {
            type: String,
            default: () => '',
        },
        showForm: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
        };
    },
    computed: {
        showFormL: {
            get() {
                return this.showForm;
            },
            set(value) {
                this.$emit('update:showForm', value);
            },
        },
    },
    watch: {
    },
    methods: {
    },
};
</script>
<style lang="scss" >
.md-dialog.plan-add-form {
    background-color: transparent !important;
    box-shadow: none !important;
}
</style>
