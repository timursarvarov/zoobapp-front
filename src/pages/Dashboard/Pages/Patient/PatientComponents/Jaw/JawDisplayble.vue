<template>
    <div>
        <div class="jaw-displayble-wrapper">
            <transition name="fade" mode="out-in">
                <div v-if="jawType === 'babyTeeth'" key="babyTeeth" class="jaw-scroll">
                    <div class="jaw-top md-alignment-top-center md-size-100">
                        <div class="tooth" v-ripple v-for="toothId in topBabyTeeth" :key="toothId">
                            <tooth
                                :toothId="toothId"
                                :jaw="jaw"
                                :selectedItem="item"
                                :teethSystem="teethSystem"
                                :originalItems="originalItems"
                                :type="type"
                                :scaleSize="7"
                            />
                        </div>
                    </div>
                    <div class="jaw-bottom md-size-100">
                        <div class="tooth" v-ripple v-for="toothId in bottomBabyTeeth" :key="toothId">
                            <tooth
                                :toothId="toothId"
                                :jaw="jaw"
                                :selectedItem="item"
                                :teethSystem="teethSystem"
                                :originalItems="originalItems"
                                :type="type"
                                :scaleSize="7"
                            />
                        </div>
                    </div>
                </div>
                <div v-else key="adultTeeth" class="jaw-scroll">
                    <div class="jaw-top md-alignment-top-center md-size-100">
                        <div class="tooth" v-ripple v-for="toothId in topAdultTeeth" :key="toothId">
                            <tooth
                                :toothId="toothId"
                                :jaw="jaw"
                                :selectedItem="item"
                                :teethSystem="teethSystem"
                                :originalItems="originalItems"
                                :type="type"
                                :scaleSize="7"
                            />
                        </div>
                    </div>
                    <div class="jaw-bottom md-size-100">
                        <div class="tooth" v-ripple v-for="toothId in bottomAdultTeeth" :key="toothId">
                            <tooth
                                :toothId="toothId"
                                :jaw="jaw"
                                :selectedItem="item"
                                :teethSystem="teethSystem"
                                :originalItems="originalItems"
                                :type="type"
                                :scaleSize="7"
                            />
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import {
    TEETH_ADDULT_ALL,
    TEETH_DEFAULT_LOCATIONS,
    TEETH_ADDULT_BOTTOM,
    TEETH_ADDULT_TOP,
    TEETH_BABY_BOTTOM,
    TEETH_BABY_TOP,
    TEETH_BABY_ALL,
    TEETH_ALL
} from '@/constants';

export default {
    components: {
        tooth: () => import('./Tooth')
    },
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        originalItems: {
            type: Array,
            default: () => []
        },
        jaw: {
            type: Object,
            default: () => {}
        },
        teethSystem: {
            type: Number,
            default: () => 1
            // 1 = FDI World Dental Federation notation
            // 2 = Universal numbering system
            // 3 = Palmer notation method
        }
    },
    name: 'JawDisplayble',
    computed: {
        teeth() {
            return TEETH_ALL;
        },
        babyTeeth() {
            return TEETH_BABY_ALL;
        },
        adultTeeth() {
            return TEETH_ADDULT_ALL;
        },
        topAdultTeeth() {
            return TEETH_ADDULT_TOP;
        },
        bottomAdultTeeth() {
            return TEETH_ADDULT_BOTTOM;
        },
        topBabyTeeth() {
            return TEETH_BABY_TOP;
        },
        bottomBabyTeeth() {
            return TEETH_BABY_BOTTOM;
        },
        defaultLocations() {
            return TEETH_DEFAULT_LOCATIONS;
        },
        separatedItemsComp() {
            return this.separatedItems;
        },
        teethSystemL() {
            let system = 'fdi';
            if (this.teethSystem === 1) {
                system = 'fdi';
            } else if (this.teethSystem === 2) {
                system = 'universal';
            } else if (this.teethSystem === 3) {
                system = 'palmer';
            }
            return system;
        },
        jawType() {
            if (this.item && this.item.teeth && this.item.teeth.length > 0) {
                const firstToothId = Object.keys(this.item.teeth)[0];
                if (this.babyTeeth.includes(firstToothId)) {
                    return 'babyTeeth';
                }
            }
            return 'adultTeeth';
        }
    }
};
</script>
