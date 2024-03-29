<template>
    <div ref="wrjaw" class="wrjaw">
        <div v-if="isCalculatingJaw" class="loader-wrapper md-layout">
            <div style="margin:auto; height:100%" class="md-layout mx-auto patient-wrapper-preloader">
                <div style="height:60px;margin: auto;">
                    <md-progress-spinner md-mode="indeterminate" />
                </div>
            </div>
        </div>
        <div class="jaw-wrapper jaw-wrapperprint">
            <md-toolbar class="hide-on-print md-transparent md-layout jaw-toolbar md-dense md-alignment-center-space-between">
                <div>
                    <slot name="title-start" />
                    <slot name="title-end" />
                </div>
                <md-menu :md-offset-x="127" :md-close-on-select="false" md-align-trigger md-size="medium" md-direction="bottom-start">
                    <md-button
                        md-menu-trigger
                        class="md-button md-butoon-with-notification md-just-icon md-round md-simple md-block"
                        data-toggle="dropdown"
                    >
                        <md-icon>more_vert</md-icon>
                        <span v-if="shouldShowNotification" class="notification md-success">
                            {{ ageCategoryBaby ? 'A' : 'B' }}
                            <md-tooltip v-if="ageCategoryBaby" style="width:auto;">{{ $t(`${$options.name}.hasBabyNosology`) }}</md-tooltip>
                            <md-tooltip v-else style="width:auto;">{{ $t(`${$options.name}.hasAdultNosology`) }}</md-tooltip>
                        </span>
                    </md-button>

                    <md-menu-content style="z-index:100;">
                        <md-menu-item>
                            <md-switch v-model="ageCategoryBaby">
                                {{ $t(`${$options.name}.babyTeeth`) }}
                                <span v-if="shouldShowNotification" class="notification md-success">{{ ageCategoryBaby ? 'A' : 'B' }}</span>
                            </md-switch>
                        </md-menu-item>
                        <md-menu-item>
                            <md-switch v-model="prefer" value="anamnesis" @change="calculateJaw('Anamnes')">{{
                                $t(`${$options.name}.anamnesis`)
                            }}</md-switch>
                        </md-menu-item>
                        <md-menu-item>
                            <md-switch v-model="prefer" value="diagnosis" @change="calculateJaw('Diagnoe')">{{
                                $t(`${$options.name}.diagnoses`)
                            }}</md-switch>
                        </md-menu-item>
                        <md-menu-item>
                            <md-switch v-model="prefer" value="procedures" @change="calculateJaw('Procedure')">{{
                                $t(`${$options.name}.procedures`)
                            }}</md-switch>
                        </md-menu-item>
                        <md-menu-item>
                            <md-switch v-model="toggleAll" @change="ageCategoryBaby ? toggleTeeth(babyTeeth) : toggleTeeth(adultTeeth)">
                                {{ $t(`${$options.name}.chooseAllTeeth`) }}
                            </md-switch>
                        </md-menu-item>
                        <md-menu-item>
                            <md-switch v-model="toggleAdultTop" @change="ageCategoryBaby ? toggleTeeth(topBabyTeeth) : toggleTeeth(topAdultTeeth)">
                                {{ $t(`${$options.name}.chooseTopTeeth`) }}
                            </md-switch>
                        </md-menu-item>
                        <md-menu-item>
                            <md-switch
                                v-model="toggleAdultBottom"
                                @change="ageCategoryBaby ? toggleTeeth(bottomBabyTeeth) : toggleTeeth(bottomAdultTeeth)"
                                >{{ $t(`${$options.name}.chooseBottomTeeth`) }}</md-switch
                            >
                        </md-menu-item>
                        <md-menu-item v-if="!printMode" @click="showPrint()">
                            <md-icon>print</md-icon>
                            {{ $t(`${$options.name}.printJaw`) }}
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>

            </md-toolbar>
            <div>
                <slot name="top" />
            </div>
            <div class="jaw-wrapper-teeth">
                <transition mode="out-in" appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-if="ageCategoryBaby" key="babyTeeth" class="jaw-scroll md-scrollbar">
                        <div class="jaw-top md-alignment-top-center md-size-100">
                            <div
                                v-for="(toothId, topJawToothIndex) in topBabyTeeth"
                                :key="toothId"
                                v-ripple
                                :id="`toothId${toothId}`"
                                class="tooth"
                                :ref="toothId"
                                :style="[{ width: printMode ? `${jawSVG[toothId].width}px` : `${jawSVG[toothId].width * toothWitdh}vmax` }]"
                            >
                                <svg
                                    preserveAspectRatio="xMidYMid meet"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="tooth-content"
                                    :class="[
                                        { selected: selectedTeethLocal.includes(toothId) },
                                        { isToothShownDiagnose: isToothShownDiagnose(toothId) }
                                    ]"
                                    @click.exact="selectTooth(toothId)"
                                    @click.ctrl.exact="selectTooth(toothId, 'multiple')"
                                    @click.meta.exact="selectTooth(toothId, 'multiple')"
                                    @click.shift.exact="selectTooth(toothId, 'shift')"
                                    :viewBox="jawSVG[toothId].viewBox"
                                >
                                    <g v-if="jawComputed[toothId]">
                                        <template v-for="(value, location) in defaultLocations">
                                            <path
                                                v-if="!jawComputed[toothId][location].hide"
                                                :key="`${toothId}${location}`"
                                                :class="[jawComputed[toothId][location].classes]"
                                                :d="jawSVG[toothId][location]"
                                            />
                                        </template>
                                    </g>
                                </svg>
                                <jaw-menu
                                    :printMode="printMode"
                                    :btn-class="btnClass"
                                    :selected="isToothSelected(toothId)"
                                    :window-width="windowWidth"
                                    :teeth-system="teethSystem"
                                    :tooth-id="toothId"
                                    direction="top"
                                    :align="getMenuAlign('adult', topJawToothIndex)"
                                    :type="type"
                                    :offset="teethWidth[toothId]"
                                    @recalculateJaw="calculateJaw"
                                    @showItem="showToothInfo"
                                />
                            </div>
                        </div>
                        <div class="jaw-bottom md-size-100">
                            <div
                                v-for="(toothId, bottomAdultTeethIndex) in bottomBabyTeeth"
                                :key="toothId"
                                v-ripple
                                :id="`toothId${toothId}`"
                                class="tooth"
                                :ref="toothId"
                                :style="[{ width: printMode ? `${jawSVG[toothId].width}px` : `${jawSVG[toothId].width * toothWitdh}vmax` }]"
                            >
                                <svg
                                    preserveAspectRatio="xMidYMid meet"
                                    class="tooth-content"
                                    :class="[{ selected: isToothSelected(toothId) }, { isToothShownDiagnose: isToothShownDiagnose(toothId) }]"
                                    @click.exact="selectTooth(toothId)"
                                    @click.ctrl.exact="selectTooth(toothId, 'multiple')"
                                    @click.meta.exact="selectTooth(toothId, 'multiple')"
                                    @click.shift.exact="selectTooth(toothId, 'shift')"
                                    xmlns="http://www.w3.org/2000/svg"
                                    :viewBox="jawSVG[toothId].viewBox"
                                >
                                    <g v-if="jawComputed[toothId]">
                                        <template v-for="(value, location) in defaultLocations">
                                            <path
                                                v-if="!jawComputed[toothId][location].hide"
                                                :key="`${toothId}${location}`"
                                                :class="[jawComputed[toothId][location].classes]"
                                                :d="jawSVG[toothId][location]"
                                            />
                                        </template>
                                    </g>
                                </svg>

                                <jaw-menu
                                    :printMode="printMode"
                                    :btn-class="btnClass"
                                    :selected="isToothSelected(toothId)"
                                    :window-width="windowWidth"
                                    :teeth-system="teethSystem"
                                    :tooth-id="toothId"
                                    direction="bottom"
                                    :align="getMenuAlign('adult', bottomAdultTeethIndex)"
                                    :type="type"
                                    :offset="teethWidth[toothId]"
                                    @recalculateJaw="calculateJaw"
                                    @showItem="showToothInfo"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-if="!ageCategoryBaby" key="adultTeeth" class="jaw-scroll md-scrollbar md-scrollbar">
                        <div class="jaw-top md-alignment-top-center md-size-100">
                            <div
                                v-for="(toothId, topJawToothIndex) in topAdultTeeth"
                                :key="toothId"
                                v-ripple
                                :id="`toothId${toothId}`"
                                class="tooth"
                                :ref="toothId"
                                :style="[{ width: printMode ? `${jawSVG[toothId].width}px` : `${jawSVG[toothId].width * toothWitdh}vmax` }]"
                            >
                                <svg
                                    preserveAspectRatio="xMidYMid meet"
                                    :class="[{ selected: isToothSelected(toothId) }, { isToothShownDiagnose: isToothShownDiagnose(toothId) }]"
                                    class="tooth-content"
                                    @click.exact="selectTooth(toothId)"
                                    @click.ctrl.exact="selectTooth(toothId, 'multiple')"
                                    @click.meta.exact="selectTooth(toothId, 'multiple')"
                                    @click.shift.exact="selectTooth(toothId, 'shift')"
                                    xmlns="http://www.w3.org/2000/svg"
                                    :viewBox="jawSVG[toothId].viewBox"
                                >
                                    <g v-if="jawComputed[toothId]">
                                        <template v-for="(value, location) in defaultLocations">
                                            <path
                                                v-if="!jawComputed[toothId][location].hide"
                                                :key="`${toothId}${location}`"
                                                :class="[jawComputed[toothId][location].classes]"
                                                :d="jawSVG[toothId][location]"
                                            />
                                        </template>
                                    </g>
                                </svg>

                                <jaw-menu
                                    :printMode="printMode"
                                    :btn-class="btnClass"
                                    :selected="isToothSelected(toothId)"
                                    :window-width="windowWidth"
                                    :teeth-system="teethSystem"
                                    :tooth-id="toothId"
                                    direction="top"
                                    :align="getMenuAlign('adult', topJawToothIndex)"
                                    :type="type"
                                    :offset="teethWidth[toothId]"
                                    @recalculateJaw="calculateJaw"
                                    @showItem="showToothInfo"
                                />
                            </div>
                        </div>
                        <div class="jaw-bottom md-size-100">
                            <div
                                v-for="(toothId, bottomAdultTeethIndex) in bottomAdultTeeth"
                                :key="toothId"
                                v-ripple
                                :id="`toothId${toothId}`"
                                class="tooth"
                                :ref="toothId"
                                :style="[{ width: printMode ? `${jawSVG[toothId].width}px` : `${jawSVG[toothId].width * toothWitdh}vmax` }]"
                            >
                                <svg
                                    preserveAspectRatio="xMidYMid meet"
                                    :class="[{ selected: isToothSelected(toothId) }, { isToothShownDiagnose: isToothShownDiagnose(toothId) }]"
                                    class="tooth-content"
                                    @click.exact="selectTooth(toothId)"
                                    @click.ctrl.exact="selectTooth(toothId, 'multiple')"
                                    @click.meta.exact="selectTooth(toothId, 'multiple')"
                                    @click.shift.exact="selectTooth(toothId, 'shift')"
                                    xmlns="http://www.w3.org/2000/svg"
                                    :viewBox="jawSVG[toothId].viewBox"
                                >
                                    <g v-if="jawComputed[toothId]">
                                        <template v-for="(value, location) in defaultLocations">
                                            <path
                                                v-if="!jawComputed[toothId][location].hide"
                                                :key="`${toothId}${location}`"
                                                :class="[jawComputed[toothId][location].classes]"
                                                :d="jawSVG[toothId][location]"
                                            />
                                        </template>
                                    </g>
                                </svg>

                                <jaw-menu
                                    :printMode="printMode"
                                    :btn-class="btnClass"
                                    :selected="isToothSelected(toothId)"
                                    :window-width="windowWidth"
                                    :teeth-system="teethSystem"
                                    :tooth-id="toothId"
                                    direction="bottom"
                                    :align="getMenuAlign('adult', bottomAdultTeethIndex)"
                                    :type="type"
                                    :offset="teethWidth[toothId]"
                                    @recalculateJaw="calculateJaw"
                                    @showItem="showToothInfo"
                                />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <transition name="slide">
                <div v-if="!printMode" class="md-gutter md-alignment-space-between-center">
                    <span
                        :class="[{ 'text-info': selectedTeethLocal.length > 0 }, { 'text-warning': selectedTeethLocal.length === 0 }]"
                        class="md-layout-item"
                    >
                        <small>{{ $tc(`${$options.name}.toothSelected`, selectedTeethLocal.length) }}</small>
                    </span>
                    <small class="md-layout-item hint">{{ $t(`${$options.name}.${teethSystemL}`) }} </small> &nbsp;
                    <span class="md-layout-item text-right">
                        <small v-show="prefer.length < 3" class="text-warning hided-prefer">
                            {{ $t(`${$options.name}.multipleChooseHint`) }}
                            <transition-group name="list">
                                <span v-for="(item, key) in hidedPrefer" :key="key + 0" class="list-item">{{ $t(`${$options.name}.${item}`) }}</span>
                            </transition-group>
                        </small>
                        <small v-show="prefer.length === 3" class="hint">{{ $t(`${$options.name}.multipleChooseHint`) }}</small>
                    </span>
                </div>
            </transition>
            <div v-if="!printMode" class="md-layout-item">
                <slot name="bottom" />
            </div>
        </div>
    </div>
</template>
<script>
import jawSVGjs from './jawSVG';
import jawWorkerFunc from './jaw-worker';
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
    PATIENT_EDIT,
    JAW_LOADER_STOP,
    JAW_LOADER_START,
    EB_SHOW_PATIENT_PRINT_FORM,
    PATIENT_JAW_UPDATE
} from '@/constants';
import JawMenu from './JawMenu';
import { mapGetters } from 'vuex';
import EventBus from '@/plugins/event-bus';

export default {
    name: 'Jaw',
    components: {
        JawMenu
    },
    mixins: [tObjProp, jawFunctions],
    props: {
        printMode: {
            type: Boolean,
            default: () => false
        },
        jaw: {
            type: Object,
            default: () => {}
        },
        selectedTeeth: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            default: () => 'diagnosis'
        },
        ageCategory: {
            type: Boolean,
            default: () => true
        }
    },
    data() {
        return {
            jawWorker: null,
            mouseOverToothId: '',
            separatedProcedures: {},
            teethWidth: {},
            windowWidth: 0,
            toggleAll: false,
            toggleAdultTop: false,
            toggleAdultBottom: false,
            prefer: ['anamnesis', 'procedures', 'diagnosis'],
            SvgTeeth: [],
            teethSettngs: [],
            showSelectedToothDialog: false,
            jawComputed: {},
            selectedTeethLocal: []
        };
    },

    computed: {
        ...mapGetters({
            currentClinic: 'getCurrentClinic',
            isCalculatingJaw: 'isCalculatingJaw'
        }),
        toothWitdh() {
            if (this.$mq.xsmall) {
                return 0.08;
            } else if (this.$mq.small) {
                return 0.094;
            } else if (this.$mq.medium) {
                return 0.064;
            } else if (this.$mq.large) {
                return 0.05;
            } else if (this.$mq.xlarge) {
                return 0.051;
            }
            return 0.064;
        },
        // sideBarMinimized() {
        //     return this.$sidebar.isMinimized;
        // },
        teethSystem() {
            return this.currentClinic.teethSystem;
        },
        // teethWithOtherTypes() {
        //     const teeth = [];
        //     Object.keys(this.jaw).forEach(type => {
        //         if (type !== this.type) {
        //             Object.keys(this.jaw[type]).forEach(toothId => {
        //                 if (!teeth.includes(toothId)) {
        //                     if (!this._.isEmpty(this.jaw[type][toothId])) {
        //                         teeth.push(toothId);
        //                     }
        //                 }
        //             });
        //         }
        //     });
        //     return teeth;
        // },
        shouldShowNotification() {
            if (this.ageCategoryBaby) {
                return this.hasAdultTeeth;
            }
            return this.hasBabyTeeth;
        },
        hasAdultTeeth() {
            if (this._.isEmpty(this.jaw)) return false;
            let has = false;
            Object.keys(this.jaw).forEach(type => {
                if (!this._.isEmpty(this.jaw[type])) {
                    Object.keys(this.jaw[type]).forEach(toothID => {
                        if (!this._.isEmpty(this.jaw[type][toothID])) {
                            has = this.adultTeeth.includes(`${toothID}`) || has;
                        }
                    });
                }
            });
            return has;
        },
        hasBabyTeeth() {
            if (this._.isEmpty(this.jaw)) return false;
            let has = false;
            Object.keys(this.jaw).forEach(type => {
                if (!this._.isEmpty(this.jaw[type])) {
                    Object.keys(this.jaw[type]).forEach(toothID => {
                        if (!this._.isEmpty(this.jaw[type][toothID])) {
                            has = this.babyTeeth.includes(`${toothID}`) || has;
                        }
                    });
                }
            });
            return has;
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
            allPrefer.forEach(r => {
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
        ageCategoryBaby: {
            get() {
                return this.ageCategory;
            },
            set(newValue) {
                this.changeAgeCategory(newValue);
            }
        }
    },
    mounted() {
        if (this.printMode) {
            this.$store.dispatch(`$_patient/${PATIENT_JAW_UPDATE}`).then(() => {
                this.calculateJaw();
            });
        } else {
            this.calculateJaw();
        }
    },
    created() {
        this.jawWorker = this.$worker.create([{ message: 'jawWorkerFunc', func: jawWorkerFunc }]);
    },
    watch: {
        selectedTeeth: {
            handler(val) {
                this.selectedTeethLocal = val;
            },
            deep: true
        },
        jaw: {
            handler() {
                this.calculateJaw();
            },
            deep: true
        }
    },

    methods: {
        showPrint() {
            const params = {
                type: 'jaw'
            };
            EventBus.$emit(EB_SHOW_PATIENT_PRINT_FORM, params);
        },
        changeAgeCategory(category) {
            this.$store.dispatch(JAW_LOADER_START);
            this.$store
                .dispatch(`$_patient/${PATIENT_EDIT}`, {
                    params: {
                        ageCategory: category ? 1 : 0
                    }
                })
                .then(() => {
                    this.selectedTeethLocal = [];
                    this.$store.dispatch(JAW_LOADER_STOP);
                })
                .catch(err => {
                    this.$store.dispatch(JAW_LOADER_STOP);
                    throw new Error(err);
                });
        },
        showToothInfo(params) {
            this.$emit('showToothInfo', params);
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
            const prefClass = this.$_preferableJawClasses(toothId, location, this.jaw, this.prefer);
            toothClasses = {
                // Название класса локации из svg для отображеня в норме
                /* root || corona|| gum etc. */
                [location]: true
            };
            // Название класса локации из высчитанной формуллы для отображеня в диагнозов анамнеза и лечения
            /* anamnes || procedure|| diagnose */
            if (prefClass) {
                toothClasses[prefClass] = true;
            }
            return toothClasses;
        },
        toggleTeeth(teethToToggle) {
            const existingTeeth = [];
            const selTeeth = this._cloneDeep(this.selectedTeethLocal);
            this.selectedTeethLocal = [];

            for (let index = 0; index < teethToToggle.length; index += 1) {
                if (selTeeth.indexOf(teethToToggle[index]) > -1) {
                    existingTeeth.push(teethToToggle[index]);
                }
            }
            if (existingTeeth.length === 0) {
                this.selectedTeethLocal = selTeeth.concat(teethToToggle);
            } else if (existingTeeth.length < teethToToggle.length) {
                const teethToAdd = teethToToggle.filter(el => existingTeeth.indexOf(el) < 0);
                this.selectedTeethLocal = selTeeth.concat(teethToAdd);
            } else {
                const teethToDelete = selTeeth.filter(el => existingTeeth.indexOf(el) >= 0);
                this.selectedTeethLocal = selTeeth.filter(value => !teethToDelete.includes(value));
            }
            this.$emit('onSelectedTeeth', this.selectedTeethLocal);
        },
        calculateJaw() {
            this.$store.dispatch(JAW_LOADER_START);
            // const startTime = performance.now();
            this.jawWorker
                .postMessage('jawWorkerFunc', [
                    {
                        teeth: this.teeth,
                        jaw: this.jaw,
                        prefer: this.prefer,
                        defaultLocations: this.defaultLocations
                    }
                ])
                .then(result => {
                    this.jawComputed = result;
                    this.$store.dispatch(JAW_LOADER_STOP);
                })
                .catch(() => {
                    this.$store.dispatch(JAW_LOADER_STOP);
                    // console.error;
                });
            // const duration = performance.now() - startTime;
            // console.log(`calculateJaw took ${duration}ms`);
        },
        selectTooth(tooth, type) {
            if ('ontouchstart' in document.documentElement) {
                this.selectToothOnTouchDevice(tooth);
            } else {
                this.selectToothOnNotTouchDevice(tooth, type);
            }
            this.toggleTeethP();
            this.$emit('onSelectedTeeth', this.selectedTeethLocal);
        },
        selectToothOnTouchDevice(tooth) {
            const toothIndex = this.selectedTeethLocal.findIndex(val => val === tooth);
            if (toothIndex > -1) {
                this.selectedTeethLocal.splice(toothIndex, 1);
            } else {
                this.selectedTeethLocal.unshift(tooth);
            }
        },
        selectToothOnNotTouchDevice(tooth, type) {
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
                    if (this.ageCategoryBaby) {
                        const firstIndex = this.babyTeeth.findIndex(toothId => toothId === firstEl);
                        const lastIndex = this.babyTeeth.findIndex(toothId => toothId === tooth);
                        if (firstIndex > lastIndex) {
                            const reversed = this.babyTeeth.reverse();
                            const reversedFirstIndex = reversed.findIndex(toothId => toothId === firstEl);
                            const reversedLastIndex = reversed.findIndex(toothId => toothId === tooth);
                            this.selectedTeethLocal = reversed.slice(reversedFirstIndex, reversedLastIndex + 1);
                        } else {
                            this.selectedTeethLocal = this.babyTeeth.slice(firstIndex, lastIndex + 1);
                        }
                    } else {
                        const firstIndex = this.adultTeeth.findIndex(toothId => toothId === firstEl);
                        const lastIndex = this.adultTeeth.findIndex(toothId => toothId === tooth);
                        if (firstIndex > lastIndex) {
                            const reversed = this.adultTeeth.reverse();
                            const reversedFirstIndex = reversed.findIndex(toothId => toothId === firstEl);
                            const reversedLastIndex = reversed.findIndex(toothId => toothId === tooth);
                            this.selectedTeethLocal = reversed.slice(reversedFirstIndex, reversedLastIndex + 1);
                        } else {
                            this.selectedTeethLocal = this.adultTeeth.slice(firstIndex, lastIndex + 1);
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
        },
        toggleTeethP() {
            let bottomTeethCount = 0;
            let topTeethCount = 0;

            for (let index1 = 0; index1 < this.bottomAdultTeeth.length; index1 += 1) {
                if (this.selectedTeethLocal.indexOf(this.bottomAdultTeeth[index1]) > -1) {
                    bottomTeethCount += 1;
                }
            }
            if (bottomTeethCount < this.bottomAdultTeeth.length) {
                this.toggleAdultBottom = false;
            } else {
                this.toggleAdultBottom = true;
            }
            for (let index2 = 0; index2 < this.topAdultTeeth.length; index2 += 1) {
                if (this.selectedTeethLocal.indexOf(this.topAdultTeeth[index2]) > -1) {
                    topTeethCount += 1;
                }
            }
            if (topTeethCount < this.topAdultTeeth.length) {
                this.toggleAdultTop = false;
            } else {
                this.toggleAdultTop = true;
            }
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
        }
    },
    beforeDestroy() {
        this.jawWorker = null;
    }
};
</script>

<style lang="scss" scoped>
.jaw-wrapper {
    .jaw-toolbar {
        padding-right: 0px;
        padding-left: 0px;
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
