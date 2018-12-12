import Vue from 'vue';
// Validation plugin used to validate forms
import VeeValidate from 'vee-validate';
// Lib imports

Vue.use(VeeValidate, {
    fieldsBagName: 'veeFields',
});
