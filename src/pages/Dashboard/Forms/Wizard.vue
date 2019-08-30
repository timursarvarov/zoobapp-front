<template>
    <div class="md-layout">
        <div class="md-layout-item md-size-66 md-xsmall-size-80 mx-auto">
            <simple-wizard>
                <template slot="header">
                    <h3 class="title">
                        Build your profile
                    </h3>
                    <h5 class="category">
                        This information will let us know more about you.
                    </h5>
                </template>

                <wizard-tab :before-change="() => validateStep('step1')">
                    <template slot="label">
                        About
                    </template>
                    <first-step
                        ref="step1"
                        @on-validated="onStepValidated"
                    />
                </wizard-tab>

                <wizard-tab :before-change="() => validateStep('step2')">
                    <template slot="label">
                        Account
                    </template>
                    <second-step
                        ref="step2"
                        @on-validated="onStepValidated"
                    />
                </wizard-tab>

                <wizard-tab :before-change="() => validateStep('step3')">
                    <template slot="label">
                        Address
                    </template>
                    <third-step
                        ref="step3"
                        @on-validated="wizardComplete"
                    />
                </wizard-tab>
            </simple-wizard>
        </div>
    </div>
</template>
<script>
import FirstStep from './Wizard/FirstStep.vue';
import SecondStep from './Wizard/SecondStep.vue';
import ThirdStep from './Wizard/ThirdStep.vue';
// import swal from 'sweetalert2';
import components from '@/components';

export default {
    name: 'WizardForm',
    components: {
        FirstStep,
        SecondStep,
        ThirdStep,
        ...components,
    },
    data() {
        return {
            wizardModel: {},
        };
    },
    methods: {
        validateStep(ref) {
            return this.$refs[ref].validate();
        },
        onStepValidated(validated, model) {
            this.wizardModel = { ...this.wizardModel, ...model };
        },
        wizardComplete() {
            // swal({
            //   title: 'Good job!',
            //   text: 'You clicked the finish button!',
            //   type: 'success',
            //   confirmButtonClass: 'md-button md-success',
            //   buttonsStyling: false,
            // });
        },
    },
};
</script>
