
<template>
    <div>
        <div class="jaw-wrapper">
            <md-toolbar class="md-transparent jaw-toolbar">
                <div class="t">
                    <slot name="title-start">
                    </slot>
                </div>
                <div class="md-toolbar-section-end">
                    <slot name="title-end"></slot>
                    <md-menu
                        :md-offset-x="127"
                        :md-close-on-select="false"
                        md-align-trigger
                        md-size="medium"
                        md-direction="bottom-start"
                    >
                        <md-button
                            md-menu-trigger
                            class="md-button md-just-icon md-round md-simple md-block"
                            data-toggle="dropdown"
                        >
                            <md-icon>more_vert</md-icon>
                        </md-button>

                        <md-menu-content>
                            <md-menu-item>
                                <md-switch
                                    @change="selectedTeethLocal = [], $emit('onChangeAgeCategory',jawType )"
                                    v-model="jawType"
                                    value="babyTeeth"
                                >Baby teeth</md-switch>
                            </md-menu-item>
                            <md-menu-item>
                                <md-switch
                                    @change="calculateJaw('Anamnes')"
                                    v-model="prefer"
                                    value="anamnesis"
                                >Anamnes</md-switch>
                            </md-menu-item>
                            <md-menu-item>
                                <md-switch
                                    @change="calculateJaw('Diagnoe')"
                                    v-model="prefer"
                                    value="diagnosis"
                                >Diagnose</md-switch>
                            </md-menu-item>
                            <md-menu-item>
                                <md-switch
                                    @change="calculateJaw('Procedure')"
                                    v-model="prefer"
                                    value="procedures"
                                >Procedure</md-switch>
                            </md-menu-item>
                            <md-menu-item>
                                <md-switch
                                    v-model="toggleAll"
                                    @change="jawType==='babyTeeth' ? toggleTeeth(babyTeeth): toggleTeeth(adultTeeth)"
                                >Toggle all</md-switch>
                            </md-menu-item>
                            <md-menu-item>
                                <md-switch
                                    v-model="toggleAdultTop"
                                    @change="jawType==='babyTeeth' ? toggleTeeth(topBabyTeeth): toggleTeeth(topAdultTeeth)"
                                >Toggle Top</md-switch>
                            </md-menu-item>
                            <md-menu-item>
                                <md-switch
                                    v-model="toggleAdultBottom"
                                    @change="jawType==='babyTeeth' ? toggleTeeth(bottomBabyTeeth): toggleTeeth(bottomAdultTeeth)"
                                >Toggle Bottom</md-switch>
                            </md-menu-item>
                        </md-menu-content>
                    </md-menu>
                </div>
            </md-toolbar>
            <div>
                <slot name="top"></slot>
            </div>
            <!-- <transition name="fade" mode="out-in"> -->
                <div v-if="jawType === 'babyTeeth'" key="babyTeeth" class="jaw-scroll mx-auto">
                    <div class="jaw-top md-alignment-top-center mx-auto md-size-100">
                        <div
                            class="tooth"
                            v-for="(toothId, topJawToothIndex) in topBabyTeeth"
                            :key="toothId"
                        >
                            <div
                                v-ripple.click.100
                                class="tooth-content"
                                :class="[
                                    {'selected': isToothSelected(toothId) },
                                    {'isToothShownDiagnose': isToothShownDiagnose(toothId) },
                                        ]"
                                :ref="toothId"
                                @click.exact="selectTooth(toothId)"
                                @click.ctrl.exact="selectTooth(toothId, 'multiple')"
                                @click.meta.exact="selectTooth(toothId, 'multiple')"
                                @click.shift.exact="selectTooth(toothId, 'shift')"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    :viewBox="jawSVG[toothId].viewBox"
                                    :style="{ 'width': getCustomWidth(toothId) + 'vw' }"
                                >
                                    <g v-if="jawComputed[toothId]">
                                        <template v-for="(value, location) in defaultLocations">
                                            <path
                                                v-if="!jawComputed[toothId][location].hide"
                                                :key="`${toothId}${location}`"
                                                :class="[jawComputed[toothId][location].classes]"
                                                :d="jawSVG[toothId][location]"
                                            ></path>
                                        </template>
                                    </g>
                                </svg>
                            </div>
                            <jaw-menu
                                :btnClass="btnClass"
                                :selected="isToothSelected(toothId)"
                                :windowWidth="windowWidth"
                                :teethSystem="teethSystem"
                                :toothId="toothId"
                                direction="top"
                                :align="getMenuAlign('adult', topJawToothIndex)"
                                :items="separatedItems[toothId] || {}"
                                :type="type"
                                :offset="getCustomWidth(toothId)"
                                @toggleItemVisibility="toggleItemVisibility"
                                @showItem="showToothInfo"
                            />
                        </div>
                    </div>
                    <div class="jaw-bottom md-size-100">
                        <div
                            class="tooth"
                            v-for="(toothId, bottomAdultTeethIndex ) in bottomBabyTeeth"
                            :key="toothId"
                        >
                            <div
                                v-ripple.click.100
                                class="tooth-content"
                                :class="[
                                        {'selected': isToothSelected(toothId) },
                                        {'isToothShownDiagnose': isToothShownDiagnose(toothId) },
                                        ]"
                                :ref="toothId"
                                @click.exact="selectTooth(toothId)"
                                @click.ctrl.exact="selectTooth(toothId, 'multiple')"
                                @click.meta.exact="selectTooth(toothId, 'multiple')"
                                @click.shift.exact="selectTooth(toothId, 'shift')"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    :viewBox="jawSVG[toothId].viewBox"
                                    :style="{ 'width': getCustomWidth(toothId) + 'vw' }"
                                >
                                    <g v-if="jawComputed[toothId]">
                                        <template v-for="(value, location) in defaultLocations">
                                            <path
                                                v-if=" !jawComputed[toothId][location].hide"
                                                :key="`${toothId}${location}`"
                                                :class="[jawComputed[toothId][location].classes]"
                                                :d="jawSVG[toothId][location]"
                                            ></path>
                                        </template>
                                    </g>
                                </svg>
                            </div>

                            <jaw-menu
                                :btnClass="btnClass"
                                :selected="isToothSelected(toothId)"
                                :windowWidth="windowWidth"
                                :teethSystem="teethSystem"
                                :toothId="toothId"
                                direction="bottom"
                                :align="getMenuAlign('adult', bottomAdultTeethIndex)"
                                :items="separatedItems[toothId] || {}"
                                :type="type"
                                :offset="getCustomWidth(toothId)"
                                @toggleItemVisibility="toggleItemVisibility"
                                @showItem="showToothInfo"
                            />
                        </div>
                    </div>
                </div>
                <div v-else key="adultTeeth" class="jaw-scroll mx-auto">
                    <div class="jaw-top md-alignment-top-center mx-auto md-size-100">
                        <div
                            class="tooth"
                            v-for="(toothId, topJawToothIndex) in topAdultTeeth"
                            :key="toothId"
                        >
                            <div
                                v-ripple.click.100
                                :class="[
                                {'selected': isToothSelected(toothId) },
                                {'isToothShownDiagnose': isToothShownDiagnose(toothId) },
                                    ]"
                                class="tooth-content"
                                :ref="toothId"
                                @click.exact="selectTooth(toothId)"
                                @click.ctrl.exact="selectTooth(toothId, 'multiple')"
                                @click.meta.exact="selectTooth(toothId, 'multiple')"
                                @click.shift.exact="selectTooth(toothId, 'shift')"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    :viewBox="jawSVG[toothId].viewBox"
                                    :style="{ 'width': getCustomWidth(toothId) + 'vw' }"
                                >
                                    <g v-if="jawComputed[toothId]">
                                        <template v-for="(value, location) in defaultLocations">
                                            <path
                                                v-if="!jawComputed[toothId][location].hide"
                                                :key="`${toothId}${location}`"
                                                :class="[jawComputed[toothId][location].classes]"
                                                :d="jawSVG[toothId][location]"
                                            ></path>
                                        </template>
                                    </g>
                                </svg>
                            </div>

                            <jaw-menu
                                :btnClass="btnClass"
                                :selected="isToothSelected(toothId)"
                                :windowWidth="windowWidth"
                                :teethSystem="teethSystem"
                                :toothId="toothId"
                                direction="top"
                                :align="getMenuAlign('adult', topJawToothIndex)"
                                :items="separatedItems[toothId] || {}"
                                :type="type"
                                :offset="getCustomWidth(toothId)"
                                @toggleItemVisibility="toggleItemVisibility"
                                @showItem="showToothInfo"
                            />
                        </div>
                    </div>
                    <div class="jaw-bottom md-size-100">
                        <div
                            class="tooth"
                            v-for="(toothId, bottomAdultTeethIndex ) in bottomAdultTeeth"
                            :key="toothId"
                        >
                            <div
                                v-ripple.click.100
                                :class="[
                                    {'selected': isToothSelected(toothId) },
                                    {'isToothShownDiagnose': isToothShownDiagnose(toothId) },
                                    ]"
                                class="tooth-content"
                                :ref="toothId"
                                @click.exact="selectTooth(toothId)"
                                @click.ctrl.exact="selectTooth(toothId, 'multiple')"
                                @click.meta.exact="selectTooth(toothId, 'multiple')"
                                @click.shift.exact="selectTooth(toothId, 'shift')"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    :viewBox="jawSVG[toothId].viewBox"
                                    :style="{ 'width': getCustomWidth(toothId) + 'vw' }"
                                >
                                    <g v-if="jawComputed[toothId]">
                                        <template v-for="(value, location) in defaultLocations">
                                            <path
                                                v-if=" !jawComputed[toothId][location].hide"
                                                :key="`${toothId}${location}`"
                                                :class="[jawComputed[toothId][location].classes]"
                                                :d="jawSVG[toothId][location]"
                                            ></path>
                                        </template>
                                    </g>
                                </svg>
                            </div>

                            <jaw-menu
                                :btnClass="btnClass"
                                :selected="isToothSelected(toothId)"
                                :windowWidth="windowWidth"
                                :teethSystem="teethSystem"
                                :toothId="toothId"
                                direction="bottom"
                                :align="getMenuAlign('adult', bottomAdultTeethIndex)"
                                :items="separatedItems[toothId] || {} "
                                :type="type"
                                :offset="getCustomWidth(toothId)"
                                @toggleItemVisibility="toggleItemVisibility"
                                @showItem="showToothInfo"
                            />
                        </div>
                    </div>
                </div>
            <!-- </transition> -->
            <transition name="slide">
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
                        &nbsp;
                        <span
                            v-show="selectedTeethLocal.length <= 1"
                        >tooth selected</span>
                        <span v-show="selectedTeethLocal.length > 1">teeth selected</span>
                    </div>
                    <small v-show="prefer.length < 3" class="text-warning hided-prefer">
                        Hided locations:
                        <transition-group name="list">
                            <span
                                v-for="(item, key) in hidedPrefer"
                                :key="key + 0"
                                class="list-item"
                            >{{` ${item},` }}</span>
                        </transition-group>
                    </small>
                    <small
                        v-show="prefer.length === 3"
                        class="hint"
                    >'ctrl + click' or 'shift + click' to multiple choose</small>
                </div>
            </transition>
            <div class="md-layout-item">
                <slot name="bottom"></slot>
            </div>
        </div>
    </div>
</template>
<script>
    import jawSVGjs from './jawSVG';
    import jawMenu from './JawMenu';
    import { AnimatedNumber } from '@/components';
    import { tObjProp, jawFunctions } from '@/mixins';
    import {
        TEETH_ADDULT_ALL,
        TEETH_DEFAULT_LOCATIONS,
        TEETH_ADDULT_BOTTOM,
        TEETH_ADDULT_TOP,
        TEETH_BABY_BOTTOM,
        TEETH_BABY_TOP,
        TEETH_BABY_ALL,
        TEETH_ALL,
    } from '@/constants';

    export default {
        mixins: [tObjProp, jawFunctions],
        components: {
            AnimatedNumber,
            jawMenu,
        },
        props: {
            jaw: {
                type: Object,
                default: () => {},
            },
            patientItems: {
                type: Object,
                default: () => ({
                    diagnosis: [],
                    procedures: [],
                    anamnesis: [],
                }),
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

                jawType: '',
                mouseOverToothId: '',
                separatedItems: {},
                separatedProcedures: {},
                windowWidth: 0,
                toggleAll: false,
                toggleAdultTop: false,
                toggleAdultBottom: false,
                prefer: ['anamnesis', 'procedures', 'diagnosis'],
                SvgTeeth: [],
                teethSettngs: [],
                showSelectedToothDialog: false,
                jawComputed: {},
                selectedTeethLocal: [],
            };
        },

        computed: {
            teethWithOtherTypes() {
                const teeth = [];
                Object.keys(this.jaw).forEach((type) => {
                    if (type !== this.type) {
                        Object.keys(this.jaw[type]).forEach((toothId) => {
                            if (!teeth.includes(toothId)) {
                                if (!this.isEmpty(this.jaw[type][toothId])) {
                                    teeth.push(toothId);
                                }
                            }
                        });
                    }
                });
                return teeth;
            },
            btnClass() {
                if (this.type === 'diagnosis') {
                    return 'md-primary';
                }
                if (this.type === 'procedures') {
                    return 'md-success';
                }
                if (this.type === 'anamnesis') {
                    return 'md-info';
                }
                return '';
            },
            hidedPrefer() {
                const allPrefer = ['anamnesis', 'procedures', 'diagnosis'];
                const found = [];
                allPrefer.forEach((r) => {
                    if (!this.prefer.includes(r)) {
                        if (r === 'anamnesis') {
                            found.push('anamnesis');
                        } else if (r === 'procedures') {
                            found.push('procedures');
                        } else {
                            found.push('diagnosis');
                        }
                    }
                });
                return found;
            },
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
            jawSVG() {
                return jawSVGjs;
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
            toggleItemVisibility(itemId, type) {
                this.$emit('toggleItemVisibility', itemId, type);
            },
            showToothInfo(params) {
                this.$emit('showToothInfo', params);
            },
            toggleAllTeeth() {
                if (this.jawType === 'babyTeeth') {
                    if (this.selectedTeethLocal.length > 0) {
                        this.selectedTeethLocal = [];
                    } else {
                        this.selectedTeethLocal = this.babyTeeth;
                    }
                } else if (this.selectedTeethLocal.length > 0) {
                    this.selectedTeethLocal = [];
                } else {
                    this.selectedTeethLocal = this.adultTeeth;
                }
            },
            getMenuAlign(type = 'adult', index) {
                if (type === 'adult') {
                    if (index + 1 >= 12) {
                        return 'right';
                    }
                    if (index + 1 > 6 && index + 1 < 12) {
                        return 'center';
                    }
                    return 'left';
                }
                if (index + 1 >= 12) {
                    return 'right';
                }
                if (index + 1 > 6 && index + 1 < 12) {
                    return 'center';
                }
                return 'left';
            },
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
            // diagnoseOnHoverToggle(toothId, index) {
            //     const item = this.separatedItems[toothId][index];
            //     item.hover = !item.hover;
            //     const d = this.copyObj(this.separatedItems);
            //     this.separatedItems = {};
            //     d.toothId = d[toothId].splice(index, 1, item);
            //     this.separatedItems = d;
            // },
            getSeparatedItemsForEachTooth() {
                this.teeth.forEach((toothId) => {
                    this.separatedItems[toothId] = {};
                });
                Object.keys(this.patientItems).forEach((itemType) => {
                    if (this.patientItems[itemType]) {
                        this.patientItems[itemType].forEach((item) => {
                            if (!this.isEmpty(item.teeth)) {
                                let show = false;
                                show = Object.keys(item.teeth)
                                    .map(
                                        key => Object.keys(item.teeth[key]).length > 0,
                                    )
                                    .indexOf(true);
                                show = show !== -1;
                                Object.keys(item.teeth).forEach((toothId) => {
                                    if (this.separatedItems[toothId][itemType]) {
                                        this.separatedItems[toothId][itemType].push(
                                            {
                                                title: item.title,
                                                code: item.code,
                                                showInJaw: item.showInJaw,
                                                id: item.id,
                                                // hover: true,
                                                hasLocations: show,
                                            },
                                        );
                                    } else {
                                        this.separatedItems[toothId][itemType] = [];
                                        this.separatedItems[toothId][itemType].push(
                                            {
                                                title: item.title,
                                                code: item.code,
                                                showInJaw: item.showInJaw,
                                                id: item.id,
                                                // hover: true,
                                                hasLocations: show,
                                            },
                                        );
                                    }
                                });
                            }
                        });
                    }
                });
            },
            getCustomWidth(toothId) {
                const toothWidth = this.jawSVG[toothId].widthPerc;
                if (this.babyTeeth.includes(toothId)) {
                    if (this.windowWidth < 600) {
                        return toothWidth / 0.65;
                    }
                    if (this.windowWidth >= 600 && this.windowWidth < 960) {
                        return toothWidth / 0.65;
                    }
                    if (this.windowWidth <= 1280 && this.windowWidth > 960) {
                        return toothWidth / 1.72;
                    }
                    if (this.windowWidth < 1920 && this.windowWidth > 1280) {
                        return toothWidth / 1.72;
                    }
                    if (this.windowWidth >= 1920) {
                        return ((this.windowWidth + 200) / 2 / 100) * toothWidth;
                    }
                    return toothWidth / 1.72;
                }
                if (this.windowWidth < 600) {
                    return toothWidth / 1.1;
                }
                if (this.windowWidth >= 600 && this.windowWidth < 960) {
                    return toothWidth / 1.1;
                }
                if (this.windowWidth <= 1280 && this.windowWidth > 960) {
                    return toothWidth / 2.35;
                }
                if (this.windowWidth < 1920 && this.windowWidth > 1280) {
                    return toothWidth / 2.3;
                }
                if (this.windowWidth >= 1920) {
                    return toothWidth / 2.2;
                }
                return toothWidth / 2.2;
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
                this.getSeparatedItemsForEachTooth();
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
            selectTooth(tooth, type) {
                if (type === 'multiple') {
                    const index = this.selectedTeethLocal.indexOf(tooth);
                    if (index === -1) {
                        this.selectedTeethLocal.unshift(tooth);
                    } else {
                        this.selectedTeethLocal.splice(index, 1);
                    }
                } else if (type === 'shift') {
                    const firstEl = this.selectedTeethLocal[0];
                    if (firstEl) {
                        if (this.jawType === 'babyTeeth') {
                            const firstIndex = this.babyTeeth.findIndex(
                                toothId => toothId === firstEl,
                            );
                            const lastIndex = this.babyTeeth.findIndex(
                                toothId => toothId === tooth,
                            );
                            if (firstIndex > lastIndex) {
                                const reversed = this.babyTeeth.reverse();
                                const reversedFirstIndex = reversed.findIndex(
                                    toothId => toothId === firstEl,
                                );
                                const reversedLastIndex = reversed.findIndex(
                                    toothId => toothId === tooth,
                                );
                                this.selectedTeethLocal = reversed.slice(
                                    reversedFirstIndex,
                                    reversedLastIndex + 1,
                                );
                            } else {
                                this.selectedTeethLocal = this.babyTeeth.slice(
                                    firstIndex,
                                    lastIndex + 1,
                                );
                            }
                        } else {
                            const firstIndex = this.adultTeeth.findIndex(
                                toothId => toothId === firstEl,
                            );
                            const lastIndex = this.adultTeeth.findIndex(
                                toothId => toothId === tooth,
                            );
                            if (firstIndex > lastIndex) {
                                const reversed = this.adultTeeth.reverse();
                                const reversedFirstIndex = reversed.findIndex(
                                    toothId => toothId === firstEl,
                                );
                                const reversedLastIndex = reversed.findIndex(
                                    toothId => toothId === tooth,
                                );
                                this.selectedTeethLocal = reversed.slice(
                                    reversedFirstIndex,
                                    reversedLastIndex + 1,
                                );
                            } else {
                                this.selectedTeethLocal = this.adultTeeth.slice(
                                    firstIndex,
                                    lastIndex + 1,
                                );
                            }
                        }
                    } else {
                        this.selectedTeethLocal.unshift(tooth);
                    }
                } else if (this.selectedTeethLocal.length === 1 && this.selectedTeethLocal.includes(tooth)) {
                    this.selectedTeethLocal = [];
                } else {
                    this.selectedTeethLocal = [];
                    this.selectedTeethLocal.unshift(tooth);
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
                this.getSeparatedItemsForEachTooth();
            },
        },
    };
</script>

<style lang="scss" scoped>
.jaw-wrapper {
    .jaw-toolbar {
        padding-right: 0px;
        // margin: 0 -15px 0 -15px;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.5s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
    .hint {
        opacity: 0.2;
    }

    .hided-prefer {
        .list-item {
            display: inline-block;
            margin-right: 0.5em;
        }
        .list-enter-active,
        .list-leave-active {
            transition: opacity 1s;
        }
        .list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
            opacity: 0;
        }
    }
}
</style>
