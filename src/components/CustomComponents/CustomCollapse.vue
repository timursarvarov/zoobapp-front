<template>
    <div>
        <div
            v-for="(item, index) in collapse"
            :key="item"
            :class="['md-collapse', activeCollapse(index + 1), { [getColorCollapse(colorCollapse)]: !toggleAll }]"
        >
            <div v-ripple :class="{ 'no-hover': toggleAll }" class="md-collapse-label" @click="toggle(index + 1)">
                <h5 class="md-collapse-title" :style="{ color: toggleAll ? '#3c4858 !important' : '' }">
                    <span v-html="item" />
                    <md-icon v-show="!toggleAll">
                        {{ icon }}
                    </md-icon>
                </h5>
            </div>

            <collapse-transition>
                <div v-show="getActiveCollapse(index + 1)" class="md-collapse-content">
                    <slot :name="getCollapseContent(index + 1)" />
                </div>
            </collapse-transition>
        </div>
    </div>
</template>

<script>
import { CollapseTransition } from 'vue2-transitions';

export default {
    name: 'CustomCollapse',
    components: {
        CollapseTransition
    },
    props: {
        collapse: Array,
        icon: String,
        colorCollapse: String,
        toggleAll: Boolean
    },
    data() {
        return {
            isActive: 1
        };
    },
    methods: {
        getActiveCollapse(index) {
            if (this.toggleAll) {
                return true;
            }
            return this.isActive === index;
        },
        activeCollapse(index) {
            return {
                'is-active': this.isActive === index
            };
        },
        toggle(index) {
            if (index === this.isActive) {
                this.isActive = 0;
            } else {
                this.isActive = index;
            }
        },
        getCollapseContent(index) {
            return `md-collapse-pane-${index}`;
        },
        getColorCollapse(colorCollapse) {
            if (!this.toggleAll) {
                return `md-${colorCollapse}`;
            }
            return false;
        }
    }
};
</script>

<style lang="scss" scoped>
.text-center {
    display: flex;
}
.no-hover {
    cursor: default;
    color: #3c4858 !important;
}
.md-collapse-title {
    margin-right: 12px;
}
</style>
