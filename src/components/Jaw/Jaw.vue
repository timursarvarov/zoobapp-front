
<template>
    <div>
        <div class="jaw-wrapper">
            <md-toolbar class="md-transparent">
                <div class="md-toolbar-section-start">
                    <slot name="title-start"></slot>
                </div>
                <div class="md-toolbar-section-end">
                    <slot name="title-end"></slot>
                    <md-button
                        @click="selectedTeethLocal = [], toggleAdultBottom = false, toggleAdultTop = false"
                        :class="[{'md-primary': selectedTeethLocal.length > 0 }, 'md-just-icon', 'md-round', 'md-simple']"
                    >
                        <md-icon>clear_all</md-icon>
                        <md-tooltip md-delay="1000">Unselect all teeth</md-tooltip>
                    </md-button>
                    <drop-down direction="down">
                        <md-button
                            slot="title"
                            class="md-button md-just-icon md-round md-simple md-block"
                            data-toggle="dropdown"
                        >
                            <md-icon>more_vert</md-icon>
                        </md-button>
                        <ul class="dropdown-menu dropdown-menu-right">
                            <li v-ripple>
                                <md-subheader>Preffer view</md-subheader>
                            </li>
                            <hr>
                            <li>
                                <md-switch
                                    @change="calculateJaw('Anamnes')"
                                    v-model="prefer"
                                    value="anamnes"
                                >Anamnes</md-switch>
                            </li>
                            <li>
                                <md-switch
                                    @change="calculateJaw('Diagnoe')"
                                    v-model="prefer"
                                    value="diagnose"
                                >Diagnose</md-switch>
                            </li>
                            <li>
                                <md-switch
                                    @change="calculateJaw('Procedure')"
                                    v-model="prefer"
                                    value="procedure"
                                >Procedure</md-switch>
                            </li>
                            <hr>
                            <li>
                                <md-switch
                                    v-model="toggleAdultTop"
                                    @change="toggleTeeth(topAdultTeeth)"
                                >Toggle Top</md-switch>
                            </li>
                            <li>
                                <md-switch
                                    v-model="toggleAdultBottom"
                                    @change="toggleTeeth(bottomAdultTeeth)"
                                >Toggle Bottom</md-switch>
                            </li>
                        </ul>
                    </drop-down>
                </div>
            </md-toolbar>
            <div>
                <slot name="top"></slot>
            </div>

            <div class="jaw-scroll md-layout mx-auto">
                <div class="jaw-top md-alignment-top-center mx-auto md-layout-item md-size-100">
                    <div class="tooth" v-for="(toothId ) in topAdultTeeth" :key="toothId">
                        <div
                            v-ripple.click.100
                            :class="[
                            {'selected': isToothSelected(toothId) },
                            {'isToothShownDiagnose': isToothShownDiagnose(toothId) },
                                ]"
                            :ref="toothId"
                            @click="selectTooth($event, toothId)"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                :viewBox="jawSVG[toothId].viewBox"
                                :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) + 'px' }"
                            >
                                <g v-if="jawComputed[toothId]">
                                    <template v-for="(value, location) in defaultLocations">
                                        <path
                                            v-if="!jawComputed[toothId][location].hide"
                                            :key="`${toothId}${location}`"
                                            :class="[ jawComputed[toothId][location].classes ]"
                                            :d="jawSVG[toothId][location]['d']"
                                        ></path>
                                    </template>
                                </g>
                            </svg>
                            <span
                                :class="[prefer,'tooth-number']"
                            >{{toothId | toCurrentTeethSystem(teethSystem)}}</span>
                        </div>
                        <div
                            @click="$emit('showToothInfo', toothId)"
                            v-if="separatedItems[toothId]"
                            class="tooth-diagnosis"
                            @mouseenter="mouseOverToothId = toothId"
                            @mouseleave="mouseOverToothId = ''"
                        >
                            <div
                                class="tooth-diagnosis-content"
                            >
                                <div class="tooth-diagnosis-text" >
                                    <div
                                    >{{type | capitilize }} for {{toothId | toCurrentTeethSystem(teethSystem)}}</div>
                                </div>
                            </div>
                            <hr>
                            <div
                                class="tooth-diagnosis-content"
                                @mouseenter="diagnoseOnHoverToggle(toothId, k)"
                                @mouseleave="diagnoseOnHoverToggle(toothId, k)"
                                v-for="(d, k) in separatedItems[toothId]"
                                :key="k"
                            >
                                <div class="tooth-diagnosis-code">
                                    <b>{{d.code}}</b>
                                </div>
                                <div class="tooth-diagnosis-text">
                                    <marquee-text
                                        :repeat="3"
                                        :duration="4"
                                        :paused="separatedItems[toothId][k].hover"
                                        :key="`${toothId}${k}`"
                                    >
                                        <span class="tooth-diagnosis-text-item">
                                            <span>{{d.title}}</span>
                                        </span>
                                    </marquee-text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="jaw-bottom md-layout-item md-size-100">
                    <div class="tooth" v-for="(toothId ) in bottomAdultTeeth" :key="toothId">
                        <div
                            v-ripple.click.100
                            :class="[
                                {'selected': isToothSelected(toothId) },
                                {'isToothShownDiagnose': isToothShownDiagnose(toothId) },
                                ]"
                            :ref="toothId"
                            :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) + 'px' }"
                            @click="selectTooth($event, toothId)"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                :viewBox="jawSVG[toothId].viewBox"
                                :style="{ 'width': getCustomWidth(jawSVG[toothId].width_perc) + 'px' }"
                            >
                                <g v-if="jawComputed[toothId]">
                                    <template v-for="(value, location) in defaultLocations">
                                        <path
                                            v-if=" !jawComputed[toothId][location].hide"
                                            :key="`${toothId}${location}`"
                                            :class="[ jawComputed[toothId][location].classes ]"
                                            :d="jawSVG[toothId][location]['d']"
                                        ></path>
                                    </template>
                                </g>
                            </svg>
                            <span
                                class="tooth-number"
                            >{{toothId | toCurrentTeethSystem(teethSystem)}}</span>
                        </div>
                        <div
                            @click="$emit('showToothInfo', toothId)"
                            v-if="separatedItems[toothId]"
                            class="tooth-diagnosis"
                            @mouseenter="mouseOverToothId = toothId"
                            @mouseleave="mouseOverToothId = ''"
                        >
                            <div
                                class="tooth-diagnosis-content"
                            >
                                <div class="tooth-diagnosis-text">
                                    <div>
                                        <span style=" transform: translate(50%); ">
                                    {{type | capitilize }} for {{toothId | toCurrentTeethSystem(teethSystem)}}
                                    </span>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div
                                class="tooth-diagnosis-content"
                                @mouseenter="diagnoseOnHoverToggle(toothId, k)"
                                @mouseleave="diagnoseOnHoverToggle(toothId, k)"
                                v-for="(d, k) in separatedItems[toothId]"
                                :key="k"
                            >
                                <div class="tooth-diagnosis-code">
                                    <b>{{d.code}}</b>
                                </div>
                                <div class="tooth-diagnosis-text">
                                    <marquee-text
                                        :repeat="3"
                                        :duration="4"
                                        :paused="separatedItems[toothId][k].hover"
                                        :key="`${toothId}${k}`"
                                    >
                                        <span class="tooth-diagnosis-text-item">
                                            <span>{{d.title}}</span>
                                        </span>
                                    </marquee-text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md-layout md-gutter">
                <div
                    class="md-layout-item"
                    :class="[{'text-info': selectedTeethLocal.length > 0},
                    {'text-warning': selectedTeethLocal.length === 0}
                    ]"
                >
                    <span>
                        <animated-number :value="selectedTeethLocal.length"></animated-number>
                    </span>
                    <span v-show="selectedTeethLocal.length <= 1"> tooth selected</span>
                    <span v-show="selectedTeethLocal.length > 1"> teeth selected</span>
                </div>
                <div class="text-danger">
                    <span v-show="prefer.length < 3">
                            <span v-show="!prefer.includes('anamnes')">Anamnes</span>
                            <span v-show="prefer.length === 0">, </span>
                            <span v-show="!prefer.includes('diagnose')">Diagnosis</span>
                            <span v-show="prefer.length <= 1"> and</span>
                            <span v-show="!prefer.includes('procedure')"> Procedures</span>
                            <span v-show="prefer.length < 2"> are</span>
                            <span v-show="prefer.length >= 2"> is</span>
                        hided
                    </span>
                </div>
            </div>
            <div class="md-layout-item">
                <slot name="bottom"></slot>
            </div>
        </div>
    </div>
</template>
<script>
    import MarqueeText from 'vue-marquee-text-component';
    import jawSVGjs from './jawSVG';
    import { AnimatedNumber } from '@/components';
    import { tObjProp, jawFunctions } from '@/mixins';
    import { SlideYDownTransition } from 'vue2-transitions';
    import {
        TEETH_ADDULT_ALL,
        TEETH_DEFAULT_LOCATIONS,
        TEETH_ADDULT_BOTTOM,
        TEETH_ADDULT_TOP,
        TEETH_BABY_ALL,
        TEETH_ALL,
    } from '@/constants';

    export default {
        mixins: [tObjProp, jawFunctions],
        components: {
            SlideYDownTransition,
            AnimatedNumber,
            MarqueeText,
        },
        props: {
            jaw: {
                type: Object,
                default: () => {},
            },
            patientItems: {
                type: Array,
                default: () => [],
            },
            patientProcedures: {
                type: Array,
                default: () => [],
            },
            selectedTeeth: {
                type: Array,
                default: () => [],
            },
            type: {
                type: String,
                default: () => 'diagnosis',
            },

            teethSystem: {
                type: Number,
                default: () => 1,
            // 1 = FDI World Dental Federation notation
            // 2 = Universal numbering system
            // 3 = Palmer notation method
            },
        },
        name: 'AppMain',
        data() {
            return {
                mouseOverToothId: '',
                separatedItems: {},
                separatedProcedures: {},
                windowWidth: 0,
                toggleAdultTop: false,
                toggleAdultBottom: false,
                prefer: ['anamnes', 'procedure', 'diagnose'],
                SvgTeeth: [],
                teethSettngs: [],
                showSelectedToothDialog: false,
                jawComputed: {},
                selectedTeethLocal: [],
            };
        },

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
            defaultLocations() {
                return TEETH_DEFAULT_LOCATIONS;
            },
            separatedItemsComp() {
                return this.separatedItems;
            },
            jawSVG() {
                const jawVG = JSON.parse(jawSVGjs);
                return jawVG;
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
        },

        created() {
            this.calculateJaw('created');
            // this.selectedTeethLocal = this.selectedTeeth;
            // this.prefer = this.prefer;
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },

        methods: {
            getToothClasses(toothId, location) {
                let toothClasses = {};
                toothClasses = {
                    // Название класса локации из высчитанной формуллы для отображеня в диагнозов анамнеза и лечения
                    /* anamnes || procedure|| diagnose */
                    [this.preferableJawClasses(
                        toothId,
                        location,
                        this.jaw,
                        this.prefer,
                    )]: true,

                    // Название класса локации из svg для отображеня в норме
                    /* root || corona|| gum etc. */
                    [location]: true,
                };
                return toothClasses;
            },
            diagnoseOnHoverToggle(toothId, index) {
                const item = this.separatedItems[toothId][index];
                item.hover = !item.hover;
                const d = this.copyObj(this.separatedItems);
                this.separatedItems = {};
                d.toothId = d[toothId].splice(index, 1, item);
                this.separatedItems = d;
            },
            getDiagnoseForEachTooth() {
                if (this.patientItems) {
                    this.separatedItems = {};
                    this.patientItems.forEach((item) => {
                        if (!this.isEmpty(item.teeth)) {
                            Object.keys(item.teeth).forEach((toothId) => {
                                if (this.separatedItems[toothId]) {
                                    this.separatedItems[toothId].push({
                                        title: item.title,
                                        code: item.code,
                                        hover: true,
                                    });
                                } else {
                                    this.separatedItems[toothId] = [];
                                    this.separatedItems[toothId].push({
                                        title: item.title,
                                        code: item.code,
                                        hover: true,
                                    });
                                }
                            });
                        }
                    });
                }
            },
            getCustomWidth(toothWidth) {
                if (this.windowWidth < 600) {
                    return 5 * toothWidth;
                }
                if (this.windowWidth >= 600 && this.windowWidth < 960) {
                    return ((this.windowWidth - 80) / 100) * toothWidth;
                }
                if (this.windowWidth <= 1280 && this.windowWidth > 960) {
                    return ((this.windowWidth - 240) / 2 / 100) * toothWidth;
                }
                if (this.windowWidth < 1920 && this.windowWidth > 1280) {
                    return ((this.windowWidth - 280) / 2 / 100) * toothWidth;
                }
                if (this.windowWidth >= 1920) {
                    return ((this.windowWidth - 380) / 2 / 100) * toothWidth;
                }
                return (this.windowWidth / 2 / 100) * toothWidth;
            },
            handleResize() {
                this.windowWidth = window.innerWidth;
            },
            toggleTeeth(teethToTogle) {
                const existingTeeth = [];
                const selTeeth = this.copyObj(this.selectedTeethLocal);
                this.selectedTeethLocal = [];

                for (let index = 0; index < teethToTogle.length; index += 1) {
                    if (selTeeth.indexOf(teethToTogle[index]) > -1) {
                        existingTeeth.push(teethToTogle[index]);
                    }
                }
                if (existingTeeth.length === 0) {
                    this.selectedTeethLocal = selTeeth.concat(teethToTogle);
                } else if (existingTeeth.length < teethToTogle.length) {
                    const teethToAdd = teethToTogle.filter(
                        el => existingTeeth.indexOf(el) < 0,
                    );
                    this.selectedTeethLocal = selTeeth.concat(teethToAdd);
                } else {
                    const teethToDelete = selTeeth.filter(
                        el => existingTeeth.indexOf(el) >= 0,
                    );
                    this.selectedTeethLocal = selTeeth.filter(
                        value => !teethToDelete.includes(value),
                    );
                }
                this.$emit('onSelectedTeeth', this.selectedTeethLocal);
            },
            calculateJaw() {
                const jaw = {};
                this.teeth.forEach((toothId) => {
                    jaw[toothId] = {};
                    Object.keys(this.defaultLocations).forEach((location) => {
                        if (!(location in jaw[toothId])) {
                            jaw[toothId][location] = {};
                        }
                        jaw[toothId][location].classes = this.getToothClasses(
                            toothId,
                            location,
                        );
                        // СВОЙСТВО hide применяется если во view выбранного диагноза нет текущей локации
                        jaw[toothId][location].hide = this.isHidingLocation(
                            toothId,
                            location,
                            this.jaw,
                            this.prefer,
                            this.defaultLocations,
                        );
                    });
                });
                this.jawComputed = jaw;
                this.getDiagnoseForEachTooth();
            },

            setTeeth() {
                for (let i = 0; i < this.teeth.length; i += 1) {
                    this.teethSettngs[i] = {
                        toothID: this.teeth[i],
                    };

                    Object.keys(this.defaultLocations).forEach((key) => {
                        this.teethSettngs[i][key] = this.defaultLocations[key];
                    });
                }
            },
            selectTooth(event, tooth) {
                const index = this.selectedTeethLocal.indexOf(tooth);
                if (index === -1) {
                    this.selectedTeethLocal.push(tooth);
                } else {
                    this.selectedTeethLocal.splice(index, 1);
                }

                let bottomTeethCount = 0;
                let topTeethCount = 0;

                for (
                    let index1 = 0;
                    index1 < this.bottomAdultTeeth.length;
                    index1 += 1
                ) {
                    if (
                        this.selectedTeethLocal.indexOf(
                            this.bottomAdultTeeth[index1],
                        ) > -1
                    ) {
                        bottomTeethCount += 1;
                    }
                }
                if (bottomTeethCount < this.bottomAdultTeeth.length) {
                    this.toggleAdultBottom = false;
                } else {
                    this.toggleAdultBottom = true;
                }
                for (
                    let index2 = 0;
                    index2 < this.topAdultTeeth.length;
                    index2 += 1
                ) {
                    if (
                        this.selectedTeethLocal.indexOf(
                            this.topAdultTeeth[index2],
                        ) > -1
                    ) {
                        topTeethCount += 1;
                    }
                }
                if (topTeethCount < this.topAdultTeeth.length) {
                    this.toggleAdultTop = false;
                } else {
                    this.toggleAdultTop = true;
                }
                this.$emit('onSelectedTeeth', this.selectedTeethLocal);
            },
            isToothSelected(tooth) {
                if (this.selectedTeethLocal.indexOf(tooth) !== -1) {
                    return true;
                }
                return false;
            },
            isToothShownDiagnose(toothId) {
                if (this.mouseOverToothId === toothId) {
                    return true;
                }
                return false;
            },
        },
        watch: {
            selectedTeeth: {
                handler(val) {
                    this.selectedTeethLocal = val;
                },
                deep: true,
            },
            jaw: {
                handler() {
                    // console.log(newValue);
                    // const startTime = performance.now();

                    this.calculateJaw('watcher');
                // const duration = performance.now() - startTime;
                // console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);
                },
                deep: true,
            },
            windowHeight() {
                this.handleResize();
            },
            // пересчитывам диагнозы для зубов при из изменении
            computedDiagnosis() {
                this.getDiagnoseForEachTooth();
            },
        },
    };
</script>

<style lang="scss" scoped>
.jaw-wrapper {
    .title {
        .list-item {
            display: inline-block;
            margin-right: 10px;
        }
        .list-enter-active,
        .list-leave-active {
            transition: all 1s;
        }
        .list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
            opacity: 0;
            transform: translateY(30px);
        }
    }
}
</style>
