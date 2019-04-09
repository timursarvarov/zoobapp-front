import Vue from 'vue';
// Validation plugin used to validate forms
import VeeValidate from 'vee-validate';
// Lib imports

const toLower = (text) => {
  if (text) {
  return text.toString().toLowerCase();
}
return '';
};

const searchByName = (items, term) => {
  if (term && items) {
    return items.filter(item => toLower(item) === toLower(term));
  }

  return items || [];
};

VeeValidate.Validator.extend('verify_plan', {
  // Custom validation message
  getMessage: field => `The ${field} is already existed.`,
  // Custom validation rule
  validate: (value, plans) => new Promise((resolve) => {
    resolve({
        valid: searchByName(plans, value).length === 0,
    });
  }),
});

Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields',
});
