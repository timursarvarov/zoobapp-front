<template>
    <div>
        <h5 class="info-text">
            What are you doing? (checkboxes)
        </h5>
        <div class="md-layout">
            <div class="md-layout-item">
                <div class="md-layout">
                    <div class="md-layout-item md-size-33 md-small-size-100">
                        <icon-checkbox v-model="model.design" icon="fas fa-pencil-alt" title="Design" />
                    </div>
                    <div class="md-layout-item md-size-33 md-small-size-100">
                        <icon-checkbox v-model="model.code" icon="fas fa-terminal" title="Code" />
                    </div>
                    <div class="md-layout-item md-size-33 md-small-size-100">
                        <icon-checkbox v-model="model.develop" icon="fas fa-laptop" title="Develop" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import components from '@/components';

export default {
    name: 'SecondStep',
    components: {
        ...components
    },
    data() {
        return {
            model: {
                design: false,
                code: true,
                develop: false
            }
        };
    },
    methods: {
        validate() {
            this.$emit('on-validated', true, this.model);
            return Promise.resolve(true);
        }
    }
};
</script>
<style></style>
