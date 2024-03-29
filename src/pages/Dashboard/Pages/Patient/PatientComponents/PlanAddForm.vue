<template>
    <div>
        <md-dialog class="plan-add-form" :md-active.sync="showFormL" @md-opened="focusOn('planName')">
            <div>
                <md-card>
                    <md-card-header class="md-card-header-icon">
                        <div class="card-icon md-card-header-green">
                            <md-icon>playlist_add</md-icon>
                        </div>
                        <h4 class="name">{{ $t(`${$options.name}.title`) }}</h4>
                    </md-card-header>
                    <md-card-content class="md-layout">
                        <div class="md-layout-item">
                            <md-field
                                :class="[
                                    { 'with-subline': true },
                                    { 'md-valid': !errors.has('planName') && touched.planName },
                                    { 'md-error': errors.has('planName') }
                                ]"
                            >
                                <label>{{ $t(`${$options.name}.labelName`) }}</label>
                                <md-input
                                    ref="planName"
                                    v-model="planName"
                                    v-validate="{ verify_plan: names, required: true, min: 2 }"
                                    v-focus
                                    type="text"
                                    data-vv-name="planName"
                                    required
                                />
                                <span class="md-error">{{ errors.first('planName') }}</span>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="errors.has('planName')"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action"
                                        @click="(planName = ''), focusOn('planName')"
                                    >
                                        <md-icon class="error">close</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        v-show="!errors.has('planName') && touched.planName"
                                        tabindex="-1"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">done</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <md-button :disabled="errors.has('planName') || loading" class="md-success" @click="addPlan()">
                            <span v-if="loading">
                                <md-progress-spinner class="t-white" :md-diameter="12" :md-stroke="2" md-mode="indeterminate" />
                                &nbsp; {{ $t(`${$options.name}.loading`) }}...
                            </span>
                            <span v-else>{{ $t(`${$options.name}.create`) }}</span>
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </md-dialog>
    </div>
</template>
<script>
import { SlideYDownTransition } from 'vue2-transitions';
import { PATIENT_PLAN_SET, NOTIFY } from '@/constants';

export default {
    components: {
        SlideYDownTransition
    },
    name: 'PlanAddForm',
    props: {
        patientId: {
            type: Number,
            default: () => 0
        },
        showForm: {
            type: Boolean,
            default: () => false
        },
        plans: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            loading: false,
            planName: null,
            touched: {
                planName: false
            }
        };
    },
    computed: {
        showFormL: {
            get() {
                return this.showForm;
            },
            set(value) {
                this.$emit('update:showForm', value);
            }
        },
        names() {
            const names = [];
            if (this.plans) {
                Object.values(this.plans).forEach((plan, index) => {
                    names[index] = plan.name;
                });
            }
            return names;
        }
    },
    created(){
        this.setInitialName();
    },
    watch: {
        planName() {
            this.touched.planName = true;
        }
    },
    methods: {
        focusOn(ref) {
            if (!this.$refs[ref]) {
                return;
            }
            this.$nextTick(() => {
                this.$refs[ref].$el.focus();
            });
        },
        validate() {
            this.$validator.validateAll().then(isValid => {
                this.$emit('on-submit', this.registerForm, isValid);
            });
            this.touched.planName = true;
        },
        clearForm() {
            this.planName = null;
            this.showFormL = false;
            this.$validator.reset();
        },
        setInitialName() {
            this.planName = `Plan № ${this.plans ? Object.keys(this.plans).length + 1 : 1}`;
        },
        addPlan() {
            if (this.planName) {
                this.$validator
                    .validateAll()
                    .then(result => {
                        if (result) {
                            this.loading = true;
                            this.$store
                                .dispatch(`$_patient/${PATIENT_PLAN_SET}`, {
                                    planName: this.planName
                                })
                                .then(resp => {
                                    if (resp) {
                                        this.$emit('onPlanCreated', resp.ID);
                                        this.$store.dispatch(NOTIFY, {
                                            settings: {
                                                message: `${this.planName} plan added`,
                                                type: 'success'
                                            }
                                        });
                                        this.$validator.reset();
                                        this.showFormL = false;
                                        this.$router.push({
                                            name: 'procedures',
                                            params: {
                                                lang: this.$i18n.locale,
                                                patientID: this.patientId,
                                                planID: resp.ID
                                            }
                                        });
                                    }
                                })
                                .catch(err => {
                                    this.$store.dispatch(NOTIFY, {
                                        settings: {
                                            message: err,
                                            type: 'warning'
                                        }
                                    });
                                    console.log(err);
                                })
                                .then(() => {
                                    this.loading = false;
                                });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }
};
</script>
<style lang="scss">
.md-dialog.plan-add-form {
    background-color: transparent !important;
    box-shadow: none !important;
    .wrapper-chips {
        margin-top: -30px;
        .md-error {
            display: block !important;
            left: 0;
            opacity: 1;
            // transform: translate3d(0,-12px,0);
            color: #ff1744;
            font-size: 0.6875rem;
            bottom: -0.3rem;
            line-height: normal;
            text-align: left;
        }
    }
}
</style>
