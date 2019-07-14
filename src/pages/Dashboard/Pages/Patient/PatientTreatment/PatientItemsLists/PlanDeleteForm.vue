<template>
    <div>
        <md-dialog
            class="plan-add-form"
            :md-active.sync="showFormL"
            :md-click-outside-to-close="false"
        >
            <div>
                <md-card>
                    <md-card-header
                        class="md-card-header-icon md-card-header-warning">
                        <div class="card-icon">
                            <md-icon>delete</md-icon>
                        </div>
                        <h4 class="name">Delete plan </h4>
                    </md-card-header>
                    <md-card-content class="md-layout">
                        <div class="md-layout-item">
                            Dlete <b>{{plan.name}}</b>?
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <md-button @click="deletePlan()"
                            :disabled="loading"
                            class="md-simple"
                            >
                                <div v-if="loading">
                                    <md-progress-spinner
                                        class="md-primary"
                                        :md-diameter="18"
                                        :md-stroke="2"
                                        md-mode="indeterminate"
                                    ></md-progress-spinner>
                                </div>
                                <span v-else>Delete</span>

                            </md-button>
                        <md-button @click="showFormL = false"
                            class="md-success">
                            Cancel

                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </md-dialog>
    </div>
</template>
<script>
    import {
        PATIENT_PLAN_EDIT,
        PATIENT_PLANS_GET,
        PATIENT_PLAN_DELETE,
    } from '@/constants';

    export default {
        props: {
            showForm: {
                type: Boolean,
                default: () => false,
            },
            plan: {
                type: Object,
                default: () => {},
            },
            patientID: {
                type: Number,
                default: () => null,
            },
        },
        data() {
            return {
                loading: false,
            };
        },
        methods: {
            deletePlan() {
                this.loading = true;
                this.$store.dispatch(PATIENT_PLAN_DELETE, {
                    params: {
                        patientId: this.patientID,
                        planID: this.plan.ID,
                    },
                }).then(
                    () => {
                        this.$emit('onPlanDeleted', false);
                        this.showFormL = false;
                        this.loading = false;
                    },
                ).catch(() => {
                    this.showFormL = false;
                    this.loading = false;
                });
            },
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
    };
</script>
<style lang="scss" >
.md-dialog.plan-add-form {
    background-color: transparent !important;
    box-shadow: none !important;
}
</style>
