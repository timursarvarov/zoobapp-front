<template>
    <div
        class="tooth-wrapper"
        :style="{
            'width': jawSVG[selectedToothId].widthPerc * scaleSize + 'px',
            'padding-top': 2 * scaleSize + 'px'
            }"
    >
        <div
            :style="{'font-size': toothNumWidth+'em'}"
            class="single-tooth-number">{{selectedToothId | toCurrentTeethSystem(teethSystem)}}
            </div>
        <div
            :class="[
                    'tooth',
                    preferj
                    ]"
            :ref="selectedToothId"
            :style="{ 'width': jawSVG[selectedToothId].widthPerc * scaleSize + 'px' }"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                :viewBox="jawSVG[selectedToothId].viewBox"
                :style="{ 'width':  jawSVG[selectedToothId].widthPerc * scaleSize + 'px'}"
            >
                <g>
                    <path
                        v-for="(locationValue, location) in defaultLocations"
                        :key="`${selectedToothId}${location}`"
                        :class="[
                          // получаем объект классов диагноза
                          getToothClasses(selectedToothId, location),

                            // Название класса локации из высчитанной формуллы для отображеня в диагнозов анамнеза и лечения
                            toothComputed[location].class,

                            // Название класса локации из svg для отображеня в норме
                            {[location]:true},

                            // путь для SVG атрибута patth
                            ]"
                        :d="jawSVG[selectedToothId][location]"
                    ></path>
                </g>

            </svg>
        </div>
    </div>
</template>
<script>
    import jawSVGjs from './jawSVG';
    import { tObjProp } from '@/mixins';
    import {
        TEETH_DEFAULT_LOCATIONS,
        TEETH_ADDULT_ALL,
        TEETH_BABY_ALL,
        TEETH_SCHEMA,
    } from '@/constants';

    export default {
        mixins: [tObjProp],
        components: {
        },
        props: {
            prefer: {
                type: String,
                default: () => 'diagnose',
            },
            classType: {
                type: String,
                default: () => 'diagnose',
            },
            selectedDiagnose: {
                type: Object,
                default: () => ({
                    code: '',
                    title: '',
                }),
            },
            selectedToothId: {
                type: String,
                default: () => '0',
            },
            scaleSize: {
                type: Number,
                default: () => 8,
            },
            originalItems: {
                type: Array,
                default: () => [],
            },
            jaw: {
                type: Object,
                default: () => { },
            },

            teethSystem: {
                type: Number,
                default: () => 1,
                // 1 = FDI World Dental Federation notation
                // 2 = Universal numbering system
                // 3 = Palmer notation method
            },
        },
        name: 'tooth',
        data() {
            return {
                selectableTeeth: [],
                selectableTeethExtraChoose: [],
                disabled: false,
                toothComputed: {},
                windowWidth: 1,
                preferj: 'diagnose',
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
            getToothClasses(toothId, location) {
                // console.log(location, this.originalDiagnose.locations[location]);
                const toothClasses = {
                    // класс 'seleced' применяется для выбранной локации
                    [this.classType]: location in this.selectedDiagnose.teeth[toothId],
                    selected:
                        this.getNestedProperty(this.selectedDiagnose, 'teeth', toothId, location)
                        !== undefined,

                    // класс hide применяется если во view выбранного диагноза нет текущей локации
                    hide: this.shouldHideLocation(toothId, location),
                };
                return toothClasses;
            },
            // если в предыдуших диагнозах есть локации для показа или скрытия то
            // в зависимости от переклчатея показываем приореттные локации
            shouldHideLocation(toothId, location) {
                // если если локация есть в разделе view оригинального диагноза
                const hasInSelectedD = this.getNestedProperty(this.selectedDiagnose, 'teeth', toothId, location);
                const hasInDiagnoseView = this.getNestedProperty(this.originalDiagnose, 'view', location);
                const selectedDiagnoseLocations = Object.keys(this.selectedDiagnose.teeth[toothId]);
                const originalDiagnoseLocations = Object.keys(this.originalDiagnose.locations);
                const originalDiagnoseLocationsUndefined = Object.keys(this.originalDiagnose.locations).filter(l => this.originalDiagnose.locations[l] === undefined);
                const locationsToHide = originalDiagnoseLocations.filter(x => !selectedDiagnoseLocations.includes(x));
                if (originalDiagnoseLocationsUndefined.includes(location)) {
                    return false;
                }
                if (hasInDiagnoseView !== undefined) {
                    if (locationsToHide.includes(location)) {
                        return true;
                    }
                    if (hasInSelectedD !== undefined) {
                        return !hasInSelectedD;
                    }
                    // return false;
                    return this.originalDiagnose.view.location;
                }

                return true;
            },
            isHidingLocation(toothId, location) {
                const anamnes = this.getNestedProperty(
                    this.jaw,
                    'anamnesis',
                    toothId,
                    location,
                );
                const procedure = this.getNestedProperty(
                    this.jaw,
                    'procedures',
                    toothId,
                    location,
                );
                const diagnose = this.getNestedProperty(
                    this.jaw,
                    'diagnosis',
                    toothId,
                    location,
                );
                const defaultLocation = !this.defaultLocations[location];

                let hide = defaultLocation;
                if (this.preferj) {
                    if (this.preferj === 'anamnes') {
                        if (diagnose === true || diagnose === false) {
                            hide = !diagnose;
                        }
                        if (procedure === true || procedure === false) {
                            hide = !procedure;
                        }
                        if (anamnes === true || anamnes === false) {
                            hide = !anamnes;
                        }
                    }
                    if (this.preferj === 'procedure') {
                        if (diagnose === true || diagnose === false) {
                            hide = !diagnose;
                        }
                        if (anamnes === true || anamnes === false) {
                            hide = !anamnes;
                        }
                        if (procedure === true || procedure === false) {
                            hide = !procedure;
                        }
                    }
                    if (this.preferj === 'diagnose') {
                        if (anamnes === true || anamnes === false) {
                            hide = !anamnes;
                        }
                        if (procedure === true || procedure === false) {
                            hide = !procedure;
                        }
                        if (diagnose === true || diagnose === false) {
                            hide = !diagnose;
                        }
                    }
                } else {
                    return true;
                }

                return hide;
            },
            // Высчитывваем в какую очередь нужно присвоить класс для показа локации в зависимости от выбронного приоретета показа(анамнез дигноз или лечение)
            preferableJawClasses(toothId, location) {
                const toothClass = {};
                if (this.preferj === 'anamnes') {
                    if (this.jaw.anamnesis[toothId][location]) {
                        toothClass.anamnes = true;
                        return toothClass;
                    }
                    if (this.jaw.procedures[toothId][location]) {
                        toothClass.procedure = true;
                        return toothClass;
                    }
                    if (this.jaw.diagnosis[toothId][location]) {
                        toothClass.diagnose = true;
                        return toothClass;
                    }
                    return toothClass;
                }
                if (this.preferj === 'diagnose') {
                    const hasInDiagnose = location in this.selectedDiagnose.teeth[toothId];
                    toothClass.diagnose = hasInDiagnose;

                    // if (this.jaw.diagnosis[toothId][location]) {
                    //     toothClass.diagnose = true;
                    //     return toothClass;
                    // }
                    // if (this.jaw.procedures[toothId][location]) {
                    //     toothClass.procedure = true;
                    //     return toothClass;
                    // }
                    // if (this.jaw.anamnesis[toothId][location]) {
                    //     toothClass.anamnes = true;
                    //     return toothClass;
                    // }
                    return toothClass;
                }
                if (this.preferj === 'procedure') {
                    if (this.jaw.procedures[toothId][location]) {
                        toothClass.procedure = true;
                        return toothClass;
                    }
                    if (this.jaw.anamnesis[toothId][location]) {
                        toothClass.anamnes = true;
                        return toothClass;
                    }
                    if (this.jaw.diagnosis[toothId][location]) {
                        toothClass.diagnose = true;
                        return toothClass;
                    }
                    return toothClass;
                }
                return toothClass;
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
                const { setOnLoad } = this.originalDiagnose;
                // если нет локаций
                if (!this.isEmpty(setOnLoad)) {
                    Object.keys(setOnLoad).forEach((location) => {
                        this.selectableTeeth.forEach((toothId) => {
                            if (this.hasProp(setOnLoad, location)) {
                                this.setLocationOnLoad(location, toothId, setOnLoad[location]);
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
                            this.setLocationOnLoad(location, toothId, tooth[location]);
                        });
                    }
                });
            },
            setSelectableTeeth(selectableTeethExtraChoose) {
                if (selectableTeethExtraChoose.length < this.selectableTeeth.length) {
                    this.selectableTeeth.forEach((toothId) => {
                        const index = selectableTeethExtraChoose.findIndex(t => t === toothId);
                        if (index === -1) {
                            this.dropTooth(toothId);
                        }
                    });
                }

                this.setInitiallyLocations(selectableTeethExtraChoose, 'setSelectableTeeth');
            },

            setInitiallyLocations(selectableTeethExtraChoose) {
                if (selectableTeethExtraChoose) {
                    this.selectableTeeth = selectableTeethExtraChoose;
                }
                if (this.selectableTeeth.length > 0) {
                    // устанавливаем локации setOnLoad локации
                    if (!this.isEmpty(this.originalDiagnose.locations)) {
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
                this.calculateTooth('setInitiallyLocations');
            },
            calculateTooth() {
                const tooth = {};
                Object.keys(this.defaultLocations).forEach((location) => {
                    tooth[location] = {
                        // hide: this.isHidingLocation(this.selectedToothId, location),
                        class: this.preferableJawClasses(this.selectedToothId, location),
                    };
                });

                this.toothComputed = tooth;
            },
        },

        computed: {
            toothNumWidth() {
                const width = this.scaleSize / 5;
                if (width < 1) {
                    return 1;
                }
                return width;
            },
            teethToSearch() {
                const firstSelectedTeeth = this.selectableTeeth[0];
                let JawType = null;
                if (firstSelectedTeeth) {
                    JawType = this.teethAdultAll.includes(firstSelectedTeeth) ? 'adult' : 'baby';
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
            originalDiagnose() {
                const originalCode = this.selectedDiagnose.code;
                for (let index = 0; index < this.diagnosis.length; index += 1) {
                    const dGrooup = this.diagnosis[index];
                    if (dGrooup.codes) {
                        const dIndex = dGrooup.codes.map(d => d.code).indexOf(originalCode);
                        if (dIndex > -1) {
                            return dGrooup.codes[dIndex];
                        }
                    }
                }
                return {};
            },
            diagnosis() {
                return this.originalItems;
            },
            jawListWidth() {
                if (this.windowWidth < 600) {
                    return (this.windowWidth / 100) * 80 - 40;
                }
                return Math.round((this.windowWidth / 100) * 80 - 70);
            },
            jawSVG() {
                return jawSVGjs;
            },
            preferLocal: {
                // геттер:
                get() {
                    return this.prefer;
                },
                // сеттер:
                set(newValue) {
                    this.preferj = newValue;
                },
            },
        },
        created() {
            this.setInitiallyLocations('', 'created');
        },
    };
</script>

<style lang="scss"  >
.tooth-wrapper{
    .single-tooth-number{
        display: block;
        position: relative;
        text-align: center;
    font-size: calc(7px + .5vw);
    }
}
</style>
