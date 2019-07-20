<template>
    <div>
        <md-dialog
            @md-opened="focusOn('planName')"
            class="plan-add-form"
            :md-active.sync="showFormL"
        >
            <div>
                <md-card>
                    <md-card-header
                        class="md-card-header-icon ">
                        <div class="card-icon"
                            :style="{'background-color': planColor}">
                            <md-icon>playlist_add</md-icon>
                        </div>
                        <h4 class="name">Add New Plan</h4>
                    </md-card-header>
                    <md-card-content class="md-layout">
                        <div class="md-layout-item">
                            <md-field
                                :class="[
                                {'with-subline': true},
                                {'md-valid': !errors.has('planName') && touched.planName},
                                {'md-error': errors.has('planName')}]"
                            >
                                <label>Plane name</label>
                                <md-input
                                    autofocus
                                    ref="planName"
                                    v-model="planName"
                                    type="text"
                                    data-vv-name="planName"
                                    required
                                    v-validate="{'verify_plan': names, required: true, min: 2}"
                                ></md-input>
                                <span class="md-error">{{errors.first('planName')}}</span>
                               <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="errors.has('planName')"
                                        @click="user.planName='',focusOn('planName')"
                                        class="md-button  md-icon-button md-dense md-input-action"
                                    >
                                        <md-icon class="error">close</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                                <slide-y-down-transition>
                                    <md-button
                                        tabindex="-1"
                                        v-show="!errors.has('planName')  && touched.planName"
                                        class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                                    >
                                        <md-icon class="success">done</md-icon>
                                    </md-button>
                                </slide-y-down-transition>
                            </md-field>
                        </div>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <md-button @click="addPlan()"
                        :disabled="errors.has('planName') || loading"
                        class="md-success">
                        <div v-if="loading">
                             <md-progress-spinner
                                class="t-white"
                                :md-diameter="12"
                                :md-stroke="2"
                                md-mode="indeterminate"
                            ></md-progress-spinner>
                        </div>
                        <span v-else>Create</span>

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

    const randomMC = require('random-material-color');

    export default {
        props: {
            patientId: {
                type: Number,
                default: () => 0,
            },
            showForm: {
                type: Boolean,
                default: () => false,
            },
            plans: {
                type: Array,
                default: () => [],
            },
        },
        components: {
            SlideYDownTransition,
        },
        data() {
            return {
                loading: false,
                randomMC: '',
                planName: null,
                names: null,
                touched: {
                    planName: false,
                },
            };
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
            // validate() {
            //     this.$validator.validateAll().then((isValid) => {
            //         this.$emit('on-submit', this.registerForm, isValid);
            //     });
            //     this.touched.planName = true;
            // },
            // clearForm() {
            //     this.planName = null;
            //     this.showFormL = false;
            //     this.$validator.reset();
            // },
            setInitialName() {
                this.planName = `Plan № ${this.plans.length + 1}`;
            },
            setPlansNames() {
                this.names = [];
                this.plans.forEach((plan, index) => {
                    this.names[index] = plan.name;
                });
            },
            addPlan() {
                if (this.planName) {
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            this.loading = true;
                            const params = {
                                patientId: this.patientId,
                                planName: this.planName,
                            };
                            this.$store.dispatch(PATIENT_PLAN_SET, {
                                params,
                            }).then(
                                (resp) => {
                                    console.log(resp);
                                    if (resp) {
                                        this.$emit('onPlanCreated', resp);
                                        this.$store.dispatch(NOTIFY, {
                                            settings: {
                                                message: `${this.planName} plan added`,
                                                type: 'success',
                                            },
                                        });
                                        this.$validator.reset();
                                        this.loading = false;
                                        this.showFormL = false;
                                    }
                                },
                            );
                        }
                    });
                }
            },
        },
        computed: {
            planColor() {
                const color = this.randomMC.getColor({ text: `${this.planName}` });
                return color;
            },
            showFormL: {
                get() {
                    return this.showForm;
                },
                set(value) {
                    this.$emit('update:showForm', value);
                },
            },
        },
        created() {
            this.randomMC = randomMC;
        },
        watch: {
            showFormL(value) {
                if (value) {
                    this.setInitialName();
                    this.setPlansNames();
                    this.$nextTick(() => {
                        this.focusOn('planName');
                    });
                }
            },
            planName() {
                this.touched.planName = true;
            },
        },
    };
</script>
<style lang="scss" >
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
