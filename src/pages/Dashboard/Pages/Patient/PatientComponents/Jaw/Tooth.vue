<template>
    <div
        class="tooth-wrapper"
        :style="{
            width: jawSVG[toothId].widthPerc * scaleSize + 'px',
            'padding-top': 2 * scaleSize + 'px'
        }"
    >
        <div
            v-if="showNumber"
            :style="{ 'font-size': toothNumWidth + 'em' }"
            :class="{ unselected: !selectedItem.teeth[toothId] }"
            class="single-tooth-number"
        >
            {{ toothId | toCurrentTeethSystem }}
        </div>
        <div :ref="toothId" :class="['tooth', classTypeComputed]" :style="{ width: jawSVG[toothId].widthPerc * scaleSize + 'px' }">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                :viewBox="jawSVG[toothId].viewBox"
                :style="{ width: jawSVG[toothId].widthPerc * scaleSize + 'px' }"
            >
                <g :class="`set-${type}`">
                    <template v-for="(locationValue, location) in defaultLocations">
                        <path
                            v-if="!shouldHideLocation(location)"
                            :key="`${toothId}${location}`"
                            :class="[
                                // получаем объект классов диагноза
                                getToothClasses(toothId, location),

                                // Название класса локации из высчитанной формуллы для отображеня в диагнозов анамнеза и лечения
                                toothComputed[location].class,

                                // Название класса локации из svg для отображеня в норме
                                { [location]: true }

                                // путь для SVG атрибута patth
                            ]"
                            :d="jawSVG[toothId][location]"
                        />
                    </template>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import jawSVGjs from './jawSVG';
import { tObjProp } from '@/mixins';
import { TEETH_DEFAULT_LOCATIONS, TEETH_ADDULT_ALL, TEETH_BABY_ALL, TEETH_SCHEMA } from '@/constants';

export default {
    name: 'tooth',
    mixins: [tObjProp],
    props: {
        prefer: {
            type: String,
            default: () => 'diagnose'
        },
        type: {
            type: String,
            default: () => ''
        },
        showNumber: {
            type: Boolean,
            default: () => true
        },
        selectedItem: {
            type: Object,
            default: () => ({
                code: '',
                title: ''
            })
        },
        toothId: {
            type: String,
            default: () => '0'
        },
        scaleSize: {
            type: Number,
            default: () => 8
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
    data() {
        return {
            selectableTeeth: [],
            selectableTeethExtraChoose: [],
            disabled: false,
            toothComputed: {},
            windowWidth: 1,
            SvgTeeth: [],
            teethSettngs: [],
            diagnose: {
                code: '',
                title: '',
                description: '',
                teeth: {}
            }
        };
    },

    computed: {
        classTypeComputed() {
            if (this.type === 'diagnosis') {
                return 'diagnose';
            }
            if (this.type === 'procedures') {
                return 'procedure';
            }
            return 'anamnes';
        },
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
        originalItem() {
            const originalCode = this.selectedItem.code;
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
                return this.classTypeComputed;
            },
            // сеттер:
            set(newValue) {
                this.classTypeComputed = newValue;
            }
        }
    },
    created() {
        this.setInitiallyLocations('', 'created');
    },
    methods: {
        getToothClasses(toothId, location) {
            const toothClasses = {
                // класс 'seleced' применяется для выбранной локации
                [this.classTypeComputed]: this.selectedItem.teeth[toothId] ? location in this.selectedItem.teeth[toothId] : false,
                selected: this.selectedItem.teeth[toothId] ? location in this.selectedItem.teeth[toothId] : false,
                unselected: !this.selectedItem.teeth[toothId]
            };
            return toothClasses;
        },
        // если в предыдуших диагнозах есть локации для показа или скрытия то
        // в зависимости от переклчатея показываем приореттные локации
        shouldHideLocation(location) {
            if (!(this.toothId in this.selectedItem.teeth)) {
                return !this.defaultLocations[location];
            }
            const hasKeyInSelectedD = this.hasKeyInSelectedD(location);
            const InOriginalItemViewValue = this.InOriginalItemViewValue(location);
            const selectedDiagnoseLocations = this.selectedDiagnoseLocations();
            const originalDiagnoseLocations = this.originalDiagnoseLocations();
            const locationsToHide = originalDiagnoseLocations.filter(x => !selectedDiagnoseLocations.includes(x));
            if (locationsToHide.includes(location)) {
                return true;
            }
            if (InOriginalItemViewValue) {
                return false;
            }
            if (hasKeyInSelectedD === false) {
                return !this.defaultLocations[location];
            }
            return true;
        },
        originalDiagnoseLocations() {
            const result = Object.keys(this.originalItem.locations);
            return result;
        },
        selectedDiagnoseLocations() {
            const result = Object.keys(this.selectedItem.teeth[this.toothId]);
            return result;
        },
        InOriginalItemViewValue(location) {
            const result = this.$_getNestedProperty(this.originalItem, 'view', location);
            return result;
        },
        hasKeyInSelectedD(location) {
            const result = location in this.selectedItem.teeth[this.toothId];
            return result;
        },
        // Высчитывваем в какую очередь нужно присвоить класс для показа локации в зависимости от выбронного приоретета показа(анамнез дигноз или лечение)
        setLocationOnLoad(location, toothId, value) {
            if (value !== undefined) {
                if (!this.$_hasProp(this.diagnose.teeth, toothId)) {
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
            if (!this._.isEmpty(setOnLoad)) {
                Object.keys(setOnLoad).forEach(location => {
                    this.selectableTeeth.forEach(toothId => {
                        if (this.$_hasProp(setOnLoad, location)) {
                            this.setLocationOnLoad(location, toothId, setOnLoad[location]);
                        }
                    });
                });
            }
        },
        setAllEditableTeethOnLoad() {
            Object.keys(this.selectedItem.teeth).forEach(toothId => {
                const tooth = this.selectedItem.teeth[toothId];
                // если нет локаций
                if (!this._.isEmpty(tooth)) {
                    Object.keys(tooth).forEach(location => {
                        this.setLocationOnLoad(location, toothId, tooth[location]);
                    });
                }
            });
        },
        setSelectableTeeth(selectableTeethExtraChoose) {
            if (selectableTeethExtraChoose.length < this.selectableTeeth.length) {
                this.selectableTeeth.forEach(toothId => {
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
                if (!this._.isEmpty(this.originalItem.locations)) {
                    // если диагноз редактируемый
                    if (!this._.isEmpty(this.selectedItem.teeth)) {
                        this.setAllEditableTeethOnLoad();
                    } else {
                        this.setAllTeethOnLoad();
                    }
                    // добавляем зубы в оральный диагноз если они выбраны
                } else {
                    this.selectableTeeth.forEach(toothId => {
                        this.setToothOnLoad(toothId);
                    });
                }
            }
            this.calculateTooth('setInitiallyLocations');
        },
        calculateTooth() {
            const tooth = {};
            Object.keys(this.defaultLocations).forEach(location => {
                tooth[location] = {
                    class: this.jaw[this.type][this.toothId][location] ? this.classTypeComputed : ''
                    // this.$_preferableJawClasses(this.toothId, location),
                };
            });

            this.toothComputed = tooth;
        }
    }
};
</script>

<style lang="scss">
.tooth-wrapper {
    .single-tooth-number {
        display: block;
        position: relative;
        text-align: center;
        font-size: calc(7px + 0.5vw);
    }
    .unselected {
        opacity: 0.3;
    }
}
</style>
