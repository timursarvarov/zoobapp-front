/* eslint-disable no-tabs */
const jawFunctions = {
	methods: {
		preferableJawClasses(toothId, location, jaw, prefer) {
			let toothClass = '';
			if (prefer.length === 0) {
				return toothClass;
			}
			if (prefer.includes('anamnes')) {
				if (jaw.anamnesis[toothId] && location in jaw.anamnesis[toothId]) {
					toothClass = 'anamnes';
				}
			} if (prefer.includes('diagnose')) {
				if (jaw.diagnosis[toothId] && location in jaw.diagnosis[toothId]) {
					toothClass = 'diagnose';
				}
			} if (prefer.includes('procedure')) {
				if (jaw.procedures[toothId] && location in jaw.procedures[toothId]) {
					toothClass = 'procedure';
				}
			}
			return toothClass;
		},
		isHidingLocation(toothId, location, jaw, prefer, defaultLocations) {
			if (prefer.length === 0) {
				return !defaultLocations[location];
			}
			// полчаем дефолтное значение локации
			const defaultLocation = !defaultLocations[location];

			// проверяем значение локации в вычесленной челюсьти
			const anamnes = this.getNestedProperty(
				jaw.anamnesis,
				toothId,
				location,
			);
			const procedure = this.getNestedProperty(
				this.jaw.procedures,
				toothId,
				location,
			);
			const diagnose = this.getNestedProperty(
				this.jaw.diagnosis,
				toothId,
				location,
			);
			/* определяем необходимость скрывать локацию(если ее нет
				ни в одном поле вычесленной челюсти (процедуры, анамнез, или лечение))
				в зависимости от предпочитаемого вида отображения, если prefer не определен,
				то возвращай все дефолтное значенин
			*/
			let hide = defaultLocation;
			if (prefer.includes('anamnes')) {
				if (anamnes === true || anamnes === false) {
					hide = !anamnes;
				}
			}
			if (prefer.includes('diagnose')) {
				if (diagnose === true || diagnose === false) {
					hide = !diagnose;
				}
			}
			if (prefer.includes('procedure')) {
				if (procedure === true || procedure === false) {
					hide = !procedure;
				}
			}

			return hide;
		},
		hasProp(obj, prop) {
			if (!obj || !prop) {
				return false;
			}
			const hasProperty = Object.prototype.hasOwnProperty.call(obj, prop);
			return hasProperty;
		},
		getNestedProperty(object = {}, key1 = null, key2 = null, key3 = null) {
			// if (this.isEmpty(object)) return undefined;
			if (this.hasProp(object, key1)) {
				if (!key2) {
					return object[key1];
				}
				if (this.hasProp(object[key1], key2)) {
					if (!key3) {
						return object[key1][key2];
					}
					if (this.hasProp(object[key1][key2], key3)) {
						return object[key1][key2][key3];
					}
					return undefined;
				}
				return undefined;
			}
			return undefined;
		},
	},
};
export default jawFunctions;
