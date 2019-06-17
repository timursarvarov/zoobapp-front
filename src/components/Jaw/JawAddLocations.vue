<template>
    <div class="jaw-list-wrapper  wizard-tab-content noselect">
    <div class="absolute-header-block">

        <md-toolbar class="md-transparent toolbar-jaw ">
                <div class="md-toolbar-section-start">
                    <div>

                        <md-field>
                            <label for="teeth">Available Teeth</label>
                            <md-select
                                @md-selected="setSelectableTeeth(selectableTeethExtraChoose)"
                                v-model="selectableTeethExtraChoose"
                                name="teeth"
                                id="teeth"
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
                        <div class="loc-error">
                            <slot class="md-layout-item" name="title"></slot>
                        </div>
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
                                <md-switch
                                    @change="preferChanged()"
                                    v-model="prefer"
                                    value="anamnesis"
                                >Anamnes</md-switch>
                            </li>
                            <li>
                                <md-switch
                                    @change="preferChanged()"
                                    v-model="prefer"
                                    value="diagnosis"
                                >Diagnose</md-switch>
                            </li>
                            <li>
                                <md-switch
                                    @change="preferChanged()"
                                    v-model="prefer"
                                    value="procedures"
                                >Procedure</md-switch>
                            </li>
                        </ul>
                    </drop-down>
                </div>
        </md-toolbar>

    </div>
    <div
        :style="[{'max-width': `${jawListWidth}px`}]"
        class="jaw-list-container"
    >
        <div class="jaw md-layout-item">
            <transition-group name="fade" class="jaw-list mx-auto noselect">
                <template>
                <div
                    v-ripple
                    @click="toothClick($event, toothId)"
                    v-for="(toothId) in selectableTeeth"
                    :key="toothId"
                    :ref="toothId"
                    :class="[
                        {selected: isSelected(toothId)},
                        {tooth: true}
                        ]"
                >
                    <div class="tooth-number noselect" >
                        <span >{{toothId | toCurrentTeethSystem(teethSystem)}}</span>
                    </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            :viewBox="jawSVG[toothId].viewBox"
                            :style="{
                                'width':  getCustomWidth(toothId) + 'vh',
                                //'width':  jawSVG[toothId].widthPerc * 1.56 + (windowWidth < 700 ? 'vmax' : 'vmin'),
                                //minWidth: jawSVG[toothId].widthPerc * 1.66 + 'vh'
                                }"
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
                                        :d="jawSVG[toothId][location]"
                                    ></path>
                                </template>
                            </g>
                        </svg>
                </div>
                </template>
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
            selectedItem: {
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
                prefer: ['diagnosis', 'anamnesis', 'procedures'],
                SvgTeeth: [],
                lastAction: {
                    location: null,
                    toothId: null,
                },
                teethSettngs: [],
                item: {
                    code: '',
                    title: '',
                    description: '',
                    teeth: {},
                },
            };
        },
        methods: {
            getCustomWidth(toothId) {
                const toothWidth = this.jawSVG[toothId].widthPerc;

                if (this.jawType === 'baby') {
                    if (this.windowHeigth < 768) {
                        // console.log(1);
                        return toothWidth * ((this.windowHeigth / (this.windowHeigth - 350)));
                    }
                    if (this.windowHeigth >= 768 && this.windowHeigth < 900) {
                        // console.log(2);
                        return toothWidth * ((this.windowHeigth / (this.windowHeigth - 350)));
                    }
                    if (this.windowHeigth <= 1050 && this.windowHeigth > 900) {
                        // console.log(3);
                        return toothWidth * ((this.windowHeigth / (this.windowHeigth - 440)));
                    }
                    if (this.windowHeigth < 1080 && this.windowHeigth > 1050) {
                        // console.log(4);
                        return toothWidth * ((this.windowHeigth / (this.windowHeigth - 440)));
                    }
                    if (this.windowHeigth >= 1080) {
                        // console.log(5);
                        return toothWidth * ((this.windowHeigth / (this.windowHeigth - 440)));
                    }
                    return toothWidth / 1.72;
                }
                if (this.windowHeigth < 768) {
                    // console.log(1);
                    return toothWidth * ((this.windowHeigth / (this.windowHeigth - 350)));
                }
                if (this.windowHeigth >= 768 && this.windowHeigth < 900) {
                    // console.log(2);
                    return toothWidth * ((this.windowHeigth / (this.windowHeigth - 200)));
                }
                if (this.windowHeigth <= 1050 && this.windowHeigth > 900) {
                    // console.log(3);
                    return toothWidth * ((this.windowHeigth / (this.windowHeigth - 320)));
                }
                if (this.windowHeigth < 1080 && this.windowHeigth > 1050) {
                    // console.log(4);
                    return toothWidth * ((this.windowHeigth / (this.windowHeigth - 340)));
                }
                if (this.windowHeigth >= 1080) {
                    // console.log(5);
                    return toothWidth * ((this.windowHeigth / (this.windowHeigth - 340)));
                }

                return toothWidth / 2.2;
            },
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
                if (
                    (this.isEmpty(this.originalItem.locations)
                    || this.originalItem.functionType === 'toggleAll')
                    && !event.target.classList.contains('selectable-location')
                ) {
                    this.toggleTooth(toothId);
                }
            },
            toggleTooth(toothId) {
                if (toothId in this.item.teeth) {
                    delete this.item.teeth[`${toothId}`];
                } else {
                    this.item.teeth[`${toothId}`] = {};
                    const firstLocation = Object.keys(
                        this.originalItem.locations,
                    ).find(
                        location => this.originalItem.locations[location] !== undefined,
                    );
                    if (firstLocation) {
                        this.chooseLocation(toothId, firstLocation);
                    }
                }
                this.calculateJaw();
            },
            isSelected(toothId) {
                if (Object.keys(this.item.teeth).includes(`${toothId}`)) {
                    return 'true';
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
                    /* anamnesis || procedures|| diagnosis */
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
                            this.item,
                            'teeth',
                            toothId,
                            location,
                        ) !== undefined,

                    // СВОЙСТВО hide применяется если во view выбранного диагноза нет текущей локации
                    hide: this.checkForHidingLocation(toothId, location),
                };
                return toothClasses;
            },


            // Высчитывваем в какую очередь нужно прятать локацию в зависимости от выбронного приоретета показа(анамнез дигноз или лечение)
            checkForHidingLocation(toothId, location) {
                // проверяем наличие локации в вычесленной челюсти
                const hide = this.isHidingClicableLocation(
                    toothId,
                    location,
                    this.jaw,
                    this.prefer,
                    this.defaultLocations,
                    this.locationType,
                    this.originalItem,
                );
                if (hide === true) {
                    return hide;
                }
                // если локацию надо отобразить, то проверяем скрываема ли она во view originalItems

                // if ((location in this.originalItem.view) && this.originalItem.view[location] === false) {
                //     return true;
                // }

                if (
                    // если зубы из диагноза не удалены
                    this.selectedItem.teeth
                    // и данный зуб есть в диагнозе
                    && toothId in this.selectedItem.teeth
                ) {
                    if (location in this.selectedItem.teeth[toothId]) {
                        return false;
                    }
                }
                // если приорет локаций включен и нет локаций от предыдущиих диагнозов
                //  то показывай все локции согласно диагнозу
                if (location in this.originalItem.view) {
                    const value = this.getNestedProperty(
                        this.originalItem,
                        'view',
                        location,
                    );
                    return !value;
                }
                if (hide === undefined) {
                    return !this.defaultLocations[location];
                }
                return hide;
            },
            dropAllLocations() {
                this.item.teeth = {};
                this.getDiagnose();
            },
            setTooth(toothId) {
                this.item.teeth[toothId] = {};
            },
            dropTooth(toothId) {
                delete this.item.teeth[toothId];
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
                        === this.numProps(this.item.teeth)
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
                return Object.keys(this.item.teeth).filter(
                    toothId => location in this.item.teeth[toothId],
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
                    if (!this.hasProp(this.item.teeth, toothId)) {
                        this.item.teeth[toothId] = {};
                    }
                    // false = локация для удаления, true = для выбора области к лечению

                    // устанавливаем локацию диагноза в при помощи предустановленной функции
                    const { addLocation } = this.originalItem;
                    this.item = addLocation(
                        location,
                        this.item,
                        this.originalItem,
                        toothId,
                    );

                    // удаляем зуб из диагноза если у него нет локациий
                    if (this.isEmpty(this.item.teeth[toothId])) {
                        delete this.item.teeth[toothId];
                    }
                }
                this.calculateJaw();
            },
            handleResize() {
                this.windowWidth = window.innerWidth;
                this.windowHeigth = window.innerHeight;
            },
            getDiagnose() {
                this.$emit('updateDiagonoseParams', this.item);
            },
            setLocationOnLoad(location, toothId, value) {
                if (value !== undefined) {
                    if (!this.hasProp(this.item.teeth, toothId)) {
                        this.item.teeth[toothId] = {};
                    }
                    this.item.teeth[toothId][location] = value;
                }
            },
            setToothOnLoad(toothId) {
                if (toothId !== undefined) {
                    this.item.teeth[toothId] = {};
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
                Object.keys(this.selectedItem.teeth).forEach((toothId) => {
                    const tooth = this.selectedItem.teeth[toothId];
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
                        if (!this.isEmpty(this.selectedItem.teeth)) {
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
                this.$emit('onToothSelected', Object.keys(this.item.teeth));
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
                if (this.jawType === 'baby') {
                    return this.teethBabyAll;
                }
                return this.teethAdultAll;
            },
            jawType() {
                const firstSelectedTeeth = this.selectableTeeth[0];
                let JawType = 'adult';
                if (firstSelectedTeeth) {
                    JawType = this.teethAdultAll.includes(this.selectableTeeth[0])
                        ? 'adult'
                        : 'baby';
                }
                return JawType;
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
                const originalCode = this.selectedItem.code;
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
                    return (this.windowWidth - 56);
                }
                return Math.round((this.windowWidth / 100) * 80 - 70);
            },
            jawSVG() {
                return jawSVGjs;
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
            this.item.id = this.selectedItem.id;
            this.item.author = this.selectedItem.author;
            this.item.date = this.selectedItem.date;
            this.item.showInJaw = this.selectedItem.showInJaw;
            this.item.code = this.selectedItem.code;
            this.item.title = this.selectedItem.title;
            this.setInitiallyLocations('', 'created');
        },
    };
</script>
<style lang="scss">
.jaw-list-wrapper{
   .fade-enter-active, .fade-leave-active {
  transition: all .2s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.fade-enter-active {
  transition-delay: .2s;
}
}
</style>
