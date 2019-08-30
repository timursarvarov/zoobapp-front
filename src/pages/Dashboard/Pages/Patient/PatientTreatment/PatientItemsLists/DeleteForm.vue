<template>
    <div>
        <md-dialog
            class="item-delete-form"
            :md-active.sync="showFormL"
            :md-click-outside-to-close="!loading"
        >
            <div>
                <md-card>
                    <md-card-header
                        class="md-card-header-icon md-card-header-warning"
                    >
                        <div class="card-icon">
                            <md-icon>delete</md-icon>
                        </div>
                        <h4 class="name">
                            {{ titleText }}
                        </h4>
                    </md-card-header>
                    <md-card-content class="md-layout">
                        <div class="md-layout-item">
                            Dlete <b>{{ itemToDelete.name }}</b>?
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <md-button
                            :disabled="loading"
                            class="md-simple"
                            @click="showFormL = false"
                        >
                            Cancel
                        </md-button>
                        <md-button
                            :disabled="loading"
                            class="md-warning"
                            @click="deleteItem()"
                        >
                            <div v-if="loading">
                                <md-progress-spinner
                                    class="md-accent"
                                    :md-diameter="12"
                                    :md-stroke="2"
                                    md-mode="indeterminate"
                                />
                                deleting
                            </div>
                            <span v-else>Delete</span>
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </md-dialog>
    </div>
</template>
<script>
import {
    PATIENT_PLAN_DELETE,
    PATIENT_PROCEDURE_DELETE,
} from '@/constants';

export default {
    props: {

        titleText: {
            type: String,
            default: () => '',
        },
        planID: {
            type: Number,
            default: () => 0,
        },
        currentType: {
            type: String,
            default: () => '',
        },
        showForm: {
            type: Boolean,
            default: () => false,
        },
        itemToDelete: {
            type: Object,
            default: () => ({ name: '' }),
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
    methods: {
        deleteItem() {
            if (this.$route.name === 'procedures') {
                this.deleteProcedure();
            }
            if (this.$route.name === 'diagnosis') {
                this.deleteDiagnose();
            }
            if (this.$route.name === 'anamnesis') {
                this.deleteAnamnes();
            }
            if (this.currentType === 'plan') {
                this.deletePlan();
            }
        },
        deletePlan() {
            this.loading = true;
            this.$store.dispatch(PATIENT_PLAN_DELETE, {
                planID: this.itemToDelete.ID,
            }).then(
                () => {
                    this.$emit('onDeleted', false);
                    this.showFormL = false;
                },
            ).catch((err) => {
                throw new Error(err);
                this.showFormL = false;
            }).then(() => {
                this.loading = false;
            });
        },
        deleteProcedure() {
            this.loading = true;
            this.$store.dispatch(PATIENT_PROCEDURE_DELETE, {
                patientID: this.patientID,
                planID: this.planID,
                procedureID: this.itemToDelete.ID,
            }).then(
                () => {
                    this.$emit('onDeleted', false);
                },
            ).catch((err) => {
                throw new Error(err);
            }).then(() => {
                this.showFormL = false;
                this.loading = false;
            });
        },
    },
};
</script>
<style lang="scss" >
.md-dialog.item-delete-form {
    background-color: transparent !important;
    box-shadow: none !important;
}
</style>
