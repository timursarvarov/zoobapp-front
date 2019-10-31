
const calcJaw = function(params) {
    const $_getNestedProperty = function $_getNestedProperty(object = {}, key1 = null, key2 = null, key3 = null) {
        // if (this.lodash.isEmpty(object)) return undefined;
        if ($_hasProp(object, key1)) {
            if (!key2) {
                return object[key1];
            }
            if ($_hasProp(object[key1], key2)) {
                if (!key3) {
                    return object[key1][key2];
                }
                if ($_hasProp(object[key1][key2], key3)) {
                    return object[key1][key2][key3];
                }
                return undefined;
            }
            return undefined;
        }
        return undefined;
    };

    const $_hasProp = function(obj, prop) {
        if (!obj || !prop) {
            return false;
        }
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    const $_isHidingLocation = function(toothId, location, params) {
        // если не установлен прдедпочитаемы вид (params.prefer) то возвращаем значение по умолчанию
        const isEmpty = function (obj) {
            if (obj === undefined || obj === null) return true;
            if (typeof obj === 'string' || Array.isArray(obj)) {
                return obj.length === 0;
            }
            return Object.entries(obj).length === 0;
        };
        if (isEmpty(params.jaw) || params.prefer.length === 0) {
            return !params.defaultLocations[location];
        }
        // полчаем дефолтное значение локации
        const defaultLocation = !params.defaultLocations[location];
        let anamnes;
        let procedure;
        let diagnose;
        let hide;

        // получаем значенин локации в типах челюсти
        if (toothId in params.jaw.anamnesis && location in params.jaw.anamnesis[toothId]) {
            anamnes = $_getNestedProperty(params.jaw.anamnesis, toothId, location);
        }
        if (toothId in params.jaw.procedures && location in params.jaw.procedures[toothId]) {
            procedure = $_getNestedProperty(params.jaw.procedures, toothId, location);
        }
        if (toothId in params.jaw.diagnosis && location in params.jaw.diagnosis[toothId]) {
            diagnose = $_getNestedProperty(params.jaw.diagnosis, toothId, location);
        }
        /* определяем необходимость скрывать локацию(если ее нет
        ни в одном поле вычесленной челюсти (процедуры, анамнез, или лечение))
        в зависимости от предпочитаемого вида отображения, если params.prefer не определен,
        то возвращай все дефолтное значенин
    */
        // hide = defaultLocation;
        if (params.prefer.includes('anamnesis')) {
            if (anamnes !== undefined) {
                hide = !anamnes;
            }
        }
        if (params.prefer.includes('diagnosis')) {
            if (diagnose !== undefined) {
                hide = hide === true ? hide : !diagnose;
            }
        }
        if (params.prefer.includes('procedures')) {
            if (procedure !== undefined) {
                hide = hide === true ? hide : !procedure;
            }
        }
        if (hide === undefined) {
            return defaultLocation;
        }
        return hide;
    };
    const getToothClasses = function(toothId, location, params) {
        const $_preferableJawClasses = function (toothId, location, params) {
            let toothClass = '';
            const isEmpty = function (obj) {
                if (obj === undefined || obj === null) return true;
                if (typeof obj === 'string' || Array.isArray(obj)) {
                    return obj.length === 0;
                }
                return Object.entries(obj).length === 0;
            };
            if (isEmpty(params.jaw) || !params.prefer || params.prefer.length === 0) {
                return toothClass;
            }
            if (params.prefer.includes('anamnesis')) {
                if (params.jaw.anamnesis[toothId] && location in params.jaw.anamnesis[toothId]) {
                    toothClass = 'anamnesis';
                }
            }
            if (params.prefer.includes('diagnosis')) {
                if (params.jaw.diagnosis[toothId] && location in params.jaw.diagnosis[toothId]) {
                    toothClass = 'diagnosis';
                }
            }
            if (params.prefer.includes('procedures')) {
                if (params.jaw.procedures[toothId] && location in params.jaw.procedures[toothId]) {
                    toothClass = 'procedures';
                }
            }
            return toothClass;
        };
        let toothClasses = {};
        const prefClass = $_preferableJawClasses(toothId, location, params);
        // Название класса локации из svg для отображеня в норме
        /* root || corona|| gum etc. */
        toothClasses [location] = true;
        // Название класса локации из высчитанной формуллы для отображеня в диагнозов анамнеза и лечения
        /* anamnesis || procedure|| diagnose */
        if (prefClass) {
            toothClasses[prefClass] = true;
        }
        return toothClasses;
    };
    let newJAw = {};
    params.teeth.forEach(toothId => {
        let tooth = {};
        Object.keys(params.defaultLocations).forEach(location => {
            tooth[location] = {};
            tooth[location].classes = getToothClasses(toothId, location, params);
            // СВОЙСТВО hide применяется если во view выбранного диагноза нет текущей локации
            tooth[location].hide = $_isHidingLocation(toothId, location, params);
        });
        newJAw[toothId] = tooth;
    });
    return newJAw;
};

export default calcJaw;
