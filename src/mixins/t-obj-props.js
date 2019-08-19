const objProp = {
	methods: {
		isEmpty(obj) {
			if (obj === undefined || obj === null) return true;
			if (typeof obj === 'string' || Array.isArray(obj)) {
				return obj.length === 0;
			}
			return Object.entries(obj).length === 0;
		},
		copyObj(obj) {
			return JSON.parse(JSON.stringify(obj));
		},
		numProps(obj) {
			if (obj && typeof obj === 'object') {
				return Object.entries(obj).length;
			}
			return null;
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
export default objProp;
