<template>
    <div class="jaw-list-wrapper">
        <md-toolbar class="md-transparent">
            <div class="md-toolbar-row">
                <div class="md-toolbar-section-start">
                    <div>
                        <md-field>
                            <label for="movies">Available Teeth</label>
                            <md-select
                                @md-selected="setSelectableTeeth(selectableTeethExtraChoose)"
                                v-model="selectableTeethExtraChoose"
                                name="movies"
                                id="movies"
                                multiple
                            >
                                <md-option
                                    v-for="(value, index) in teethToSearch"
                                    :key="index"
                                    :value="value"
                                >{{value | toCurrentTeethSystem(teethSystem)}} - {{ value | toCurrentTeethSystem(teethSystem, true)}}</md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
                <div class="md-toolbar-section-end">
                    <md-button
                        @click="setLastLocationForAllTeeth()"
                        class="md-primary md-round md-simple md-just-icon"
                    >
                        <md-icon>done_all</md-icon>

                        <md-tooltip v-if="'locations' in originalItem" md-delay="1000">Toggle teeth</md-tooltip>
                        <md-tooltip v-else md-delay="1000">
                            Set last created
                            <br>change for all teeth
                        </md-tooltip>
                    </md-button>

                    <md-button
                        @click="dropAllLocations()"
                        class="md-primary md-round md-simple md-just-icon"
                    >
                        <md-icon>clear_all</md-icon>
                        <md-tooltip md-delay="1000">Drop all locations</md-tooltip>
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
                            <li>
                                <md-subheader v-show="!!prefer">Prefer: {{prefer | capitilize }}</md-subheader>
                                <md-subheader v-show="!prefer">All hided</md-subheader>
                            </li>
                            <li>
                                <md-switch
                                    @change="preferChanged()"
                                    v-model="prefer"
                                    value="anamnes"
                                >Anamnes</md-switch>
                            </li>
                            <li>
                                <md-switch
                                    @change="preferChanged()"
                                    v-model="prefer"
                                    value="diagnose"
                                >Diagnose</md-switch>
                            </li>
                            <li>
                                <md-switch
                                    @change="preferChanged()"
                                    v-model="prefer"
                                    value="procedure"
                                >Procedure</md-switch>
                            </li>
                        </ul>
                    </drop-down>
                </div>
            </div>
        </md-toolbar>
        <div class="error md-layout mx-auto md-gutter">
            <slot class="md-layout-item" name="title"></slot>
        </div>

        <div
            :style="[{'max-width': `${jawListWidth}px`}]"
            class="md-layout md-layout-item md-gutter jaw-list-container"
        >
            <div class="jaw md-layout-item">
                <transition-group name="tooth" class="jaw-list mx-auto">
                    <div
                        v-ripple
                        @click="toothClick($event, toothId)"
                        :class="[
                    'tooth',
                    isSelected(toothId)]"
                        v-for="(toothId) in selectableTeeth"
                        :key="toothId"
                        :ref="toothId"
                        :style="{ 'width': jawSVG[toothId].width_perc * 8 + 'px' }"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            :viewBox="jawSVG[toothId].viewBox"
                            :style="{ 'width':  jawSVG[toothId].width_perc * 8 + 'px'}"
                        >
                            <g :class="`set-${locationType}`">
                                <template v-for="(locationValue, location) in defaultLocations">
                                    <path
                                        v-if="!jawComputed[toothId][location].hide"
                                        @click="chooseLocation(toothId, location), setLastAction(toothId, location)"
                                        :key="`${toothId}${location}`"
                                        :class="[
                                        // получаем объект классов диагноза
                                        jawComputed[toothId][location]]"
                                        :d="jawSVG[toothId][location]['d']"
                                    ></path>
                                </template>
                            </g>
                        </svg>
                        <span class="tooth-number">{{toothId | toCurrentTeethSystem(teethSystem)}}</span>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>
<script>
    import jawSVGjs from './jawSVG';
    import { tObjProp, jawFunctions } from '@/mixins';
    import {
        TEETH_DEFAULT_LOCATIONS,
        TEETH_ADDULT_ALL,
        TEETH_BABY_ALL,
        TEETH_SCHEMA,
    } from '@/constants';

    export default {
        name: 'jaw-add-locations',
        mixins: [tObjProp, jawFunctions],
        components: {},
        model: {
            prop: 'newDiagnoseParams',
            event: 'updateDiagonoseParams',
        },
        props: {
            jaw: {
                type: Object,
                default: () => {},
            },
            locationType: {
                type: String,
                default: () => 'diagnosis',
            },
            originalItemsGrouped: {
                type: Array,
                default: () => [],
            },
            // Пропс выбранношо диагноза
            selectedDiagnose: {
                type: Object,
                default: () => ({
                    code: '',
                    title: '',
                }),
            },
            selectedTeeth: {
                type: Array,
                default: () => [],
            },
            // Глобальная V-model для
            // отображения/скрытия формы
            newDiagnoseParams: {
                type: Object,
                default: () => {},
            },
            // Объект с ключами (toothID)  и шаблонами для отображения названия зубов в различных сиситемах
            teethSchema: {
                type: Object,
                default: () => {},
            },

            teethSystem: {
                type: Number,
                default: () => 1,
            // 1 = FDI World Dental Federation notation
            // 2 = Universal numbering system
            // 3 = Palmer notation method
            },
        },
        data() {
            return {
                selectableTeeth: [],
                selectableTeethExtraChoose: [],
                disabled: false,
                jawComputed: {},
                windowWidth: 1,
                prefer: ['diagnose', 'anamnes', 'diagnose'],
                SvgTeeth: [],
                lastAction: {
                    location: null,
                    toothId: null,
                },
                teethSettngs: [],
                diagnose: {
                    code: '',
                    title: '',
                    description: '',
                    teeth: {},
                },
            };
        },
        methods: {
            functionName(fun) {
                let ret = fun.toString();
                ret = ret.substr('function '.length);
                ret = ret.substr(0, ret.indexOf('('));
                return ret;
            },
            preferChanged() {
                this.calculateJaw();
            },
            toothClick(event, toothId) {
                console.log();
                if ((this.isEmpty(this.originalItem.locations) || this.originalItem.toggleAll) && !event.target.classList.contains('selectable-location')) {
                    this.toggleTooth(toothId);
                }
            },
            toggleTooth(toothId) {
                if (toothId in this.diagnose.teeth) {
                    delete this.diagnose.teeth[`${toothId}`];
                } else {
                    this.diagnose.teeth[`${toothId}`] = {};
                    const firstLocation = Object.keys(this.originalItem.locations).find(location => this.originalItem.locations[location] !== undefined);
                    if (firstLocation) {
                        this.chooseLocation(toothId, firstLocation);
                    }
                }
                this.calculateJaw();
            },
            isSelected(toothId) {
                if (Object.keys(this.diagnose.teeth).includes(`${toothId}`)) {
                    return 'selected';
                }
                return false;
            },
            getToothClasses(toothId, location) {
                const toothClasses = {
                    // класс 'selectable-location' применяется для не выбранных парадонтитов
                    /* selectable-location */
                    'selectable-location':
                        this.getNestedProperty(
                            this.originalItem,
                            'locations',
                            location,
                        ) !== undefined,

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

                    // класс 'seleced' применяется для выбранной локации
                    /* selected */
                    selected:
                        this.getNestedProperty(
                            this.diagnose,
                            'teeth',
                            toothId,
                            location,
                        ) !== undefined,

                    // СВОЙСТВО hide применяется если во view выбранного диагноза нет текущей локации
                    hide: this.CheckForHidingLocation(toothId, location),
                };
                return toothClasses;
            },
            // если в предыдуших диагнозах есть локации для показа или скрытия то
            // в зависимости от переклчатея показываем приореттные локации
            shouldHideLocation(toothId, location) {
                if (
                    // если зубы из диагноза не удалены
                    this.selectedDiagnose.teeth
                    // и данный зуб есть в диагнозе
                    && toothId in this.selectedDiagnose.teeth
                ) {
                    // const selecetedDiagnoseLocations = Object.keys(
                    //     this.selectedDiagnose.teeth[toothId],
                    // );
                    // if (selecetedDiagnoseLocations.includes(location)) {
                    //     return false;
                    // }
                    if (location in this.selectedDiagnose.teeth[toothId]) {
                        return false;
                    }
                }
                const computedLocaton = this.getNestedProperty(
                    this.jaw,
                    [this.locationType],
                    toothId,
                    location,
                );
                // если приорет локаций отключен то показывай все локции согласно диагнозу
                // if (!this.prefer) {
                //     return !this.getNestedProperty(
                //         this.originalItem,
                //         'view',
                //         location,
                //     );
                // }
                // если приорет локаций включен то показывай все локции согласно диагнозу
                if (computedLocaton !== undefined) {
                    return !computedLocaton;
                }
                // если приорет локаций включен и нет локаций от предыдущиих диагнозов
                //  то показывай все локции согласно диагнозу
                return !this.getNestedProperty(this.originalItem, 'view', location);
            },
            dropAllLocations() {
                this.diagnose.teeth = {};
                this.getDiagnose();
            },
            setTooth(toothId) {
                this.diagnose.teeth[toothId] = {};
            },
            dropTooth(toothId) {
                delete this.diagnose.teeth[toothId];
            },
            //  Устанавливаем последнюю указанную локацию для всех выбранных зубов
            setLastLocationForAllTeeth() {
                if (!this.isEmpty(this.originalItem.locations)) {
                    if (this.lastAction.location) {
                        const teethWithSameLocation = this.getTeethWithSameLocation(
                            this.lastAction.location,
                        );
                        const teethWithOutL = this.selectableTeeth.filter(
                            el => !teethWithSameLocation.includes(`${el}`),
                        );
                        let teethToSet = [];
                        if (
                            teethWithSameLocation.length
                            === this.selectableTeeth.length
                            || teethWithSameLocation.length === 0
                        ) {
                            teethToSet = this.selectableTeeth;
                        } else if (
                            teethWithOutL.includes(this.lastAction.toothId)
                        ) {
                            teethToSet = teethWithSameLocation;
                        } else {
                            teethToSet = teethWithOutL;
                        }
                        teethToSet.forEach((toothId) => {
                            this.chooseLocation(toothId, this.lastAction.location);
                        });
                    }
                } else if (!this.isEmpty(this.selectedTeeth)) {
                    if (
                        this.selectableTeeth.length
                        === this.numProps(this.diagnose.teeth)
                    ) {
                        this.selectableTeeth.forEach((toothId) => {
                            this.dropTooth(toothId);
                        });
                    } else {
                        this.selectableTeeth.forEach((toothId) => {
                            this.setTooth(toothId);
                        });
                    }
                }
                this.calculateJaw();
            },
            getTeethWithSameLocation(location) {
                return Object.keys(this.diagnose.teeth).filter(
                    toothId => location in this.diagnose.teeth[toothId],
                );
            },
            // выбираем область зуба и записываем ее в массив с зубами в дигнозе

            setLastAction(toothId, location) {
                this.lastAction.toothId = toothId;
                this.lastAction.location = location;
            },
            chooseLocation(toothId, location) {
                // если выбранная область относиться к текущему диагнозу
                if (this.hasProp(this.originalItem.locations, location)) {
                    // если выбранный зуб не находиться в списке зубов дигноза
                    if (!this.hasProp(this.diagnose.teeth, toothId)) {
                        this.diagnose.teeth[toothId] = {};
                    }
                    // false = локация для удаления, true = для выбора области к лечению

                    // устанавливаем локацию диагноза в при помощи предустановленной функции
                    const { addLocation } = this.originalItem;
                    this.diagnose = addLocation(
                        location,
                        this.diagnose,
                        this.originalItem,
                        toothId,
                    );

                    // удаляем зуб из диагноза если у него нет локациий
                    if (this.isEmpty(this.diagnose.teeth[toothId])) {
                        delete this.diagnose.teeth[toothId];
                    }
                }
                this.calculateJaw();
            },

            // Высчитывваем в какую очередь нужно прятать локацию в зависимости от выбронного приоретета показа(анамнез дигноз или лечение)
            CheckForHidingLocation(toothId, location) {
                const hide = this.isHidingLocation(
                    toothId,
                    location,
                    this.jaw,
                    this.prefer,
                    this.defaultLocations,
                );
                if (!this.prefer) {
                    return this.getNestedProperty(
                        this.originalItem,
                        'view',
                        location,
                    );
                }
                if (!hide) {
                    return hide;
                }
                return this.shouldHideLocation(toothId, location);
            },
            handleResize() {
                this.windowWidth = window.innerWidth;
            },
            getDiagnose() {
                this.$emit('updateDiagonoseParams', this.diagnose);
            },
            setLocationOnLoad(location, toothId, value) {
                if (value !== undefined) {
                    if (!this.hasProp(this.diagnose.teeth, toothId)) {
                        this.diagnose.teeth[toothId] = {};
                    }
                    this.diagnose.teeth[toothId][location] = value;
                }
            },
            setToothOnLoad(toothId) {
                if (toothId !== undefined) {
                    this.diagnose.teeth[toothId] = {};
                }
            },
            setAllTeethOnLoad() {
                const { setOnLoad } = this.originalItem;
                // если нет локаций
                if (!this.isEmpty(setOnLoad)) {
                    Object.keys(setOnLoad).forEach((location) => {
                        this.selectableTeeth.forEach((toothId) => {
                            if (this.hasProp(setOnLoad, location)) {
                                this.setLocationOnLoad(
                                    location,
                                    toothId,
                                    setOnLoad[location],
                                );
                            }
                        });
                    });
                }
            },
            setAllEditableTeethOnLoad() {
                Object.keys(this.selectedDiagnose.teeth).forEach((toothId) => {
                    const tooth = this.selectedDiagnose.teeth[toothId];
                    // если нет локаций
                    if (!this.isEmpty(tooth)) {
                        Object.keys(tooth).forEach((location) => {
                            this.setLocationOnLoad(
                                location,
                                toothId,
                                tooth[location],
                            );
                        });
                    }
                });
            },
            setSelectableTeeth(selectableTeethExtraChoose) {
                if (
                    selectableTeethExtraChoose.length < this.selectableTeeth.length
                ) {
                    this.selectableTeeth.forEach((toothId) => {
                        const index = selectableTeethExtraChoose.findIndex(
                            t => t === toothId,
                        );
                        if (index === -1) {
                            this.dropTooth(toothId);
                        }
                    });
                }

                this.setInitiallyLocations(
                    selectableTeethExtraChoose,
                    'setSelectableTeeth',
                );
            },

            setInitiallyLocations(selectableTeethExtraChoose) {
                if (selectableTeethExtraChoose) {
                    this.selectableTeeth = selectableTeethExtraChoose;
                }
                if (this.selectableTeeth.length > 0) {
                    // устанавливаем локации setOnLoad локации
                    if (!this.isEmpty(this.originalItem.locations)) {
                        // если диагноз редактируемый
                        if (!this.isEmpty(this.selectedDiagnose.teeth)) {
                            this.setAllEditableTeethOnLoad();
                        } else {
                            this.setAllTeethOnLoad();
                        }
                    // добавляем зубы в оральный диагноз если они выбраны
                    } else {
                        this.selectableTeeth.forEach((toothId) => {
                            this.setToothOnLoad(toothId);
                        });
                    }
                }
                this.calculateJaw('setInitiallyLocations');
            },
            calculateJaw() {
                const jaw = {};
                // for (let i = 0; i < this.selectableTeeth.length; i += 1) {
                this.selectableTeeth.forEach((toothId) => {
                    jaw[toothId] = {};
                    Object.keys(this.defaultLocations).forEach((location) => {
                        jaw[toothId][location] = this.getToothClasses(
                            toothId,
                            location,
                        );
                    });
                });
                this.getDiagnose();
                this.jawComputed = jaw;
            },
            getCurrentTeethSystemName() {
                // 1 = FDI World Dental Federation notation
                // 2 = Universal numbering system
                // 3 = Palmer notation method
                if (this.teethSystem === 2) {
                    return 'universal';
                }
                if (this.teethSystem === 3) {
                    return 'palmer';
                }

                return 'fdi';
            },
        },

        computed: {
            teethToSearch() {
                const firstSelectedTeeth = this.selectableTeeth[0];
                let JawType = null;
                if (firstSelectedTeeth) {
                    JawType = this.teethAdultAll.includes(firstSelectedTeeth)
                        ? 'adult'
                        : 'baby';
                }
                if (JawType === 'baby') {
                    return this.teethBabyAll;
                }
                return this.teethAdultAll;
            },
            allTeethSchema() {
                return TEETH_SCHEMA;
            },
            teethAdultAll() {
                return TEETH_ADDULT_ALL;
            },
            teethBabyAll() {
                return TEETH_BABY_ALL;
            },
            defaultLocations() {
                return TEETH_DEFAULT_LOCATIONS;
            },
            originalItem() {
                const originalCode = this.selectedDiagnose.code;
                for (
                    let index = 0;
                    index < this.originalItemsGrouped.length;
                    index += 1
                ) {
                    const dGrooup = this.originalItemsGrouped[index];
                    if (dGrooup.codes) {
                        const dIndex = dGrooup.codes
                            .map(d => d.code)
                            .indexOf(originalCode);
                        if (dIndex > -1) {
                            return dGrooup.codes[dIndex];
                        }
                    }
                }
                return {};
            },
            jawListWidth() {
                if (this.windowWidth < 600) {
                    return (this.windowWidth / 100) * 80 - 40;
                }
                return Math.round((this.windowWidth / 100) * 80 - 70);
            },
            jawSVG() {
                const jawVG = JSON.parse(jawSVGjs);
                return jawVG;
            },
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        created() {
            this.selectableTeeth = this.selectedTeeth;
            this.selectableTeethExtraChoose = this.selectedTeeth;
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
            this.diagnose.code = this.selectedDiagnose.code;
            this.diagnose.title = this.selectedDiagnose.title;
            this.setInitiallyLocations('', 'created');
        },
    };
</script>

<style lang="scss"  >
.jaw-list-wrapper {
    .error {
        position: absolute;
        color: red;
        white-space: nowrap;
        width: 100%;
        text-align: center;
    }
    .md-toolbar {
        div :not(.md-toolbar) > .md-field:not(.md-chips) {
            margin-top: 0px;
        }
        .dropdown-menu li {
            padding: 0px 0px 0px 16px;
        }
        .jaw-settings {
            max-width: 300px;
        }
    }

    .jaw-list-container {
        overflow-y: auto;
        overflow-x: auto;
        margin: 0;
        padding: 20px 0 20px 0;

        // overflow: -webkit-paged-x;
        &::-webkit-scrollbar {
            height: 7px;
            background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgb(146, 146, 146);
            border-radius: 20px;
        }
        .jaw {
            margin: 0 !important;
            padding-top: 10px !important;
            padding-bottom: 10px !important;

            display: flex;
            flex-direction: column;
            // padding: 15px;
            border-radius: 5px;
            .selected {
                transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                transition-property: all;
                // transition-duration: 0.2s;
                // transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                // transition-delay: 0s;
                background-color: rgba(153, 153, 153, 0.37);
                .tooth-number {
                    color: rgb(255, 255, 255);
                }
            }
            .tooth:not(.selected) {
                transition-property: all;
                transition-duration: 0.5s;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-delay: 0s;
                // .anamnes {
                //     fill: #fb8c00 !important;
                //     .tooth-number {
                //         color: #fb8c00;
                //     }
                // }
                // .diagnose:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1) {
                //     // fill: #8e24aa !important;
                //     .tooth-number {
                //         color: #8e24aa;
                //     }
                // }
                // .diagnose.gum {
                //     stroke-width: 4px !important;
                // }

                // .procedure {
                //     fill: #43a047 !important;
                //     .tooth-number {
                //         color: #43a047;
                //     }
                // }
            }

            .jaw-list {
                max-height: 42vh;
                min-height: 200px;
                display: flex;
                .tooth-enter, .tooth-leave-to
          /* .tooth-leave-active for <2.1.8 */ {
                    opacity: 0;
                    transform: scale(0);
                }
                .tooth-enter-to {
                    opacity: 1;
                    transform: scale(1);
                }

                .tooth-leave-active {
                    /*position: absolute;*/
                }

                .tooth-move {
                    opacity: 1;
                    transition: all 0.5s;
                }
                // .tooth {
                //     -webkit-touch-callout: none; /* iOS Safari */
                //     -webkit-user-select: none; /* Safari */
                //     -khtml-user-select: none; /* Konqueror HTML */
                //     -moz-user-select: none; /* Firefox */
                //     -ms-user-select: none; /* Internet Explorer/Edge */
                //     user-select: none; /* Non-prefixed version, currently
                //                   supported by Chrome and Opera */
                //     display: flex;
                //     // transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                //     transition-property: all;
                //     transition-duration: 0.4s;
                //     transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                //     transition-delay: 0s;
                //     position: relative;
                //     padding-bottom: 15px;
                //     .tooth-number {
                //         font-size: 1em;
                //         overflow: show;
                //         margin: auto;
                //         position: absolute;
                //         left: 50%;
                //         bottom: -5px;
                //         transform: translate(-50%, -6px);
                //     }

                //     svg {
                //         flex-grow: 1;
                //         flex-basis: 100%;
                //         height: 100%;

                //         .background {
                //             fill: #9fdaff;
                //         }

                //         .bridge {
                //             fill: #3535ed;
                //         }

                //         .root:not(.selectable-location) {
                //             fill: #f8edc8;
                //             stroke: #292320;
                //             stroke-width: 0.25px;
                //         }

                //         // .rootCanal {
                //         //   fill: #3535ed;
                //         // }
                //         .selected:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1):not(.gum) {
                //             fill: #8e24aa !important;
                //         }

                //         .coronaLingual:not(.selectable-location),
                //         .coronaTop:not(.selectable-location),
                //         .coronaLabial:not(.selectable-location) {
                //             fill: #fff;
                //             stroke: #000;
                //             stroke-width: 0.25px;
                //         }
                //         .selectable-location:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1):not(.gum) {
                //             cursor: pointer;
                //             stroke: #8e24aa;
                //             stroke-width: 1.5px !important;
                //         }
                //         .selectable-location,
                //         .rootCanal,
                //         .periodontit,
                //         .coronaLingualIncisalDistal,
                //         .coronaLingualIncisalMiddle,
                //         .coronaLingualIncisionMesial,
                //         .coronaLingualMiddleDistal,
                //         .coronaLingualMiddleMiddle,
                //         .coronaLingualMiddleMesial,
                //         .coronaLingualCervicalDistal,
                //         .coronaLingualCervicalMiddle,
                //         .coronaLingualCervicalMesial,
                //         .coronaLabialIncisalDistal,
                //         .coronaLabialIncisalMiddle,
                //         .coronaLabialIncisionMesial,
                //         .coronaLabialMiddleDistal,
                //         .coronaLabialMiddleMiddle,
                //         .coronaLabialMiddleMesial,
                //         .coronaLabialCervicalDistal,
                //         .coronaLabialCervicalMiddle,
                //         .coronaLabialCervicalMesial,
                //         .coronaTopBuccal,
                //         .coronaTopMedial,
                //         .coronaTopLingual,
                //         .coronaTopDistal,
                //         .coronaTopOclusial {
                //             cursor: pointer;
                //             fill: white;
                //             stroke: #8d24aa70;
                //             stroke-width: 0.45px;
                //             &:active {
                //                 opacity: 0.8;
                //                 transition-property: all;
                //                 transition-duration: 0.4s;
                //                 transition-timing-function: cubic-bezier(
                //                     0.4,
                //                     0,
                //                     0.2,
                //                     1
                //                 );
                //                 transition-delay: 0s;
                //             }
                //         }

                //         .implant {
                //             fill: #3535ed;
                //         }

                //         .veneer {
                //             fill: #3535ed;
                //         }

                //         .silant {
                //             fill: #3535ed;
                //         }

                //         .gum {
                //             stroke: #ffb900;
                //         }

                //         // .paradontit1 {
                //         //     stroke: #ff822e;
                //         //     fill: none;
                //         //     // fill: rgba(56, 43, 37, 0.283);
                //         // }

                //         // .paradontit2 {
                //         //     stroke: #f9610d;
                //         //     fill: none;
                //         //     // fill: rgba(56, 43, 37, 0.383);
                //         // }

                //         // .paradontit3 {
                //         //     stroke: #f75403;
                //         //     fill: none;
                //         //     // fill: rgba(56, 43, 37, 0.483);
                //         // }

                //         // .paradontit4 {
                //         //     stroke: #f73403;
                //         //     fill: none;
                //         //     // fill: rgba(56, 43, 37, 0.583);
                //         // }

                //         // .periodontit {
                //         //   fill: #3535ed;
                //         // }

                //         .gum {
                //             stroke: #ffb900;
                //             stroke-linejoin: round;
                //             stroke-width: 2px;
                //             fill: none;
                //         }

                //         .gum.selectable-location,
                //         .paradontit1.selectable-location,
                //         .paradontit2.selectable-location,
                //         .paradontit3.selectable-location,
                //         .paradontit4.selectable-location,
                //         .periodnotit.selectable-location {
                //             opacity: 0.3;
                //             stroke-linejoin: round;
                //             stroke-width: 3px;
                //             fill: none !important;
                //             &:hover {
                //                 opacity: 1;
                //                 stroke-width: 4px !important;
                //                 stroke: #8e24aa !important;
                //                 fill: none !important;
                //             }
                //         }
                //         .gum.selected,
                //         .paradontit1.selected,
                //         .paradontit2.selected,
                //         .paradontit3.selected,
                //         .paradontit4.selected,
                //         .periodnotit.selected {
                //             opacity: 1;
                //             stroke-linejoin: round;
                //             stroke-width: 3px;
                //             stroke: #8e24aa;
                //             fill: none !important;
                //         }

                //         .paradontit1,
                //         .paradontit2,
                //         .paradontit3,
                //         .paradontit4,
                //         .periodnotit {
                //             stroke: #8e24aa;
                //             stroke-linejoin: round;
                //             stroke-width: 3px;
                //             transition-property: all;
                //             transition-duration: 0.4s;
                //             transition-timing-function: cubic-bezier(
                //                 0.4,
                //                 0,
                //                 0.2,
                //                 1
                //             );
                //             transition-delay: 0s;
                //             fill: none !important;
                //         }
                //         .hide {
                //             display: none;
                //         }
                //     }
                // }
            }
            // .selectable-location:not(.paradontit4):not(.paradontit3):not(.paradontit2):not(.paradontit1) {
            //   stroke: #8e24aa !important;
            // }

            // .selected {
            // stroke: #8e24aa;
            // opacity: 1 !important;
            // }
            // .anamnes {
            //     fill: #fb8c00 !important;
            //     .tooth-number {
            //         color: #fb8c00;
            //     }
            // }
            // .diagnose {
            //     fill: #8d24aaa8 !important;
            //     .tooth-number {
            //         color: #8e24aa;
            //     }
            // }
            // .procedure {
            //     fill: #43a047 !important;
            //     .tooth-number {
            //         color: #43a047;
            //     }
            // }
        }
    }
}
</style>
