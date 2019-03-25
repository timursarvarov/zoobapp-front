const isEmpty = {
  methods: {
    isEmpty(obj) {
      if (!obj || typeof obj !== 'object') {
        return true;
      }
      return Object.entries(obj).length === 0 && obj.constructor === Object;
    },
  },
};
export default isEmpty;
