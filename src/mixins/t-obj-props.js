const objProp = {
  methods: {
    isEmpty(obj) {
      if (!obj || typeof obj !== 'object') {
        return true;
      }
      return Object.entries(obj).length === 0 && obj.constructor === Object;
    },
    hasProp(obj, prop) {
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
