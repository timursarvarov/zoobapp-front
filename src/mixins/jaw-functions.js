/* eslint-disable no-tabs */
const jawFunctions = {
    methods: {
        $_preferableJawClasses(toothId, location, jaw, prefer) {
            let toothClass = '';
            if (this.lodash.isEmpty(jaw) || !prefer || prefer.length === 0) {
                return toothClass;
            }
            if (prefer.includes('anamnesis')) {
                if (jaw.anamnesis[toothId] && location in jaw.anamnesis[toothId]) {
                    toothClass = 'anamnesis';
                }
            }
            if (prefer.includes('diagnosis')) {
                if (jaw.diagnosis[toothId] && location in jaw.diagnosis[toothId]) {
                    toothClass = 'diagnosis';
                }
            }
            if (prefer.includes('procedures')) {
                if (jaw.procedures[toothId] && location in jaw.procedures[toothId]) {
                    toothClass = 'procedures';
                }
            }
            return toothClass;
        },
        $_isHidingLocation(toothId, location, jaw, prefer, defaultLocations) {
            // если не установлен прдедпочитаемы вид (prefer) то возвращаем значение по умолчанию
            if (this.lodash.isEmpty(jaw) || prefer.length === 0) {
                return !defaultLocations[location];
            }
            // полчаем дефолтное значение локации
            const defaultLocation = !defaultLocations[location];
            let anamnes;
            let procedure;
            let diagnose;
            let hide;

            // получаем значенин локации в типах челюсти
            if (toothId in jaw.anamnesis && location in jaw.anamnesis[toothId]) {
                anamnes = this.$_getNestedProperty(jaw.anamnesis, toothId, location);
            }
            if (toothId in jaw.procedures && location in jaw.procedures[toothId]) {
                procedure = this.$_getNestedProperty(jaw.procedures, toothId, location);
            }
            if (toothId in jaw.diagnosis && location in jaw.diagnosis[toothId]) {
                diagnose = this.$_getNestedProperty(jaw.diagnosis, toothId, location);
            }
            /* определяем необходимость скрывать локацию(если ее нет
            	ни в одном поле вычесленной челюсти (процедуры, анамнез, или лечение))
            	в зависимости от предпочитаемого вида отображения, если prefer не определен,
            	то возвращай все дефолтное значенин
            */
            // hide = defaultLocation;
            if (prefer.includes('anamnesis')) {
                if (anamnes !== undefined) {
                    hide = !anamnes;
                }
            }
            if (prefer.includes('diagnosis')) {
                if (diagnose !== undefined) {
                    hide = hide === true ? hide : !diagnose;
                }
            }
            if (prefer.includes('procedures')) {
                if (procedure !== undefined) {
                    hide = hide === true ? hide : !procedure;
                }
            }
            if (hide === undefined) {
                return defaultLocation;
            }
            return hide;
        },
        $_isHidingClicableLocation(toothId, location, jaw, prefer, defaultLocations, locationType, originalItem) {
            // если не установлен прдедпочитаемы вид (prefer) то возвращаем значение по умолчанию
            if (prefer.length === 0) {
                if (location in originalItem.view) {
                    const hide = !this.$_getNestedProperty(originalItem, 'view', location);
                    return hide;
                }
                return !defaultLocations[location];
            }
            // полчаем дефолтное значение локации
            // const originalItemLocation = !originalItem.view[location];
            let anamnes;
            let procedure;
            let diagnose;
            let hide;

            // получаем значенин локации в типах челюсти
            if (toothId in jaw.anamnesis && location in jaw.anamnesis[toothId]) {
                anamnes = this.$_getNestedProperty(jaw.anamnesis, toothId, location);
            }
            if (toothId in jaw.procedures && location in jaw.procedures[toothId]) {
                procedure = this.$_getNestedProperty(jaw.procedures, toothId, location);
            }
            if (toothId in jaw.diagnosis && location in jaw.diagnosis[toothId]) {
                diagnose = this.$_getNestedProperty(jaw.diagnosis, toothId, location);
            }
            /* определяем необходимость скрывать локацию(если ее нет
            	ни в одном поле вычесленной челюсти (процедуры, анамнез, или лечение))
            	в зависимости от предпочитаемого вида отображения, если prefer не определен,
            	то возвращай все дефолтное значенин
            */
            // hide = defaultLocation;
            if (prefer.includes('anamnesis')) {
                if (anamnes !== undefined) {
                    hide = !anamnes;
                }
            } else if (locationType === 'anamnesis') {
                if (location in originalItem.view) {
                    hide = !this.$_getNestedProperty(originalItem, 'view', location);
                }
            }
            if (prefer.includes('diagnosis')) {
                if (diagnose !== undefined) {
                    hide = hide === true ? hide : !diagnose;
                }
            } else if (locationType === 'diagnosis') {
                if (location in originalItem.view) {
                    const value = this.$_getNestedProperty(originalItem, 'view', location);
                    hide = !value;
                }
            }
            if (prefer.includes('procedures')) {
                if (procedure !== undefined) {
                    hide = hide === true ? hide : !procedure;
                }
            } else if (locationType === 'procedures') {
                if (location in originalItem.view) {
                    const value = this.$_getNestedProperty(originalItem, 'view', location);
                    hide = !value;
                }
            }

            return hide;
        },
        $_hasProp(obj, prop) {
            if (!obj || !prop) {
                return false;
            }
            const hasProperty = Object.prototype.hasOwnProperty.call(obj, prop);
            return hasProperty;
        },
        $_getNestedProperty(object = {}, key1 = null, key2 = null, key3 = null) {
            // if (this.lodash.isEmpty(object)) return undefined;
            if (this.$_hasProp(object, key1)) {
                if (!key2) {
                    return object[key1];
                }
                if (this.$_hasProp(object[key1], key2)) {
                    if (!key3) {
                        return object[key1][key2];
                    }
                    if (this.$_hasProp(object[key1][key2], key3)) {
                        return object[key1][key2][key3];
                    }
                    return undefined;
                }
                return undefined;
            }
            return undefined;
        }
    }
};
export default jawFunctions;
