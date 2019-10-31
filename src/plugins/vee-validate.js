import Vue from 'vue';
// Validation plugin used to validate forms
import VeeValidate from 'vee-validate';
import en from './vee-validate-locale/en.json';
// import ru from './vee-validate-locale/ru.json';
// import uz from './vee-validate-locale/uz.json';
import i18n from './vue-i18n';

const toLower = text => {
    if (text) {
        return text.toString().toLowerCase();
    }
    return '';
};

const searchByName = (items, term) => {
    let result = [];
    if (term && items) {
        result = items.filter(item => toLower(item) === toLower(term));
    }
    return result;
};

VeeValidate.Validator.extend('verify_plan', {
    // Custom validation message
    getMessage: (field, params, data) => (data && data.message) || 'Something went wrong',

    // Custom validation rule
    validate: (value, plans) =>
        new Promise(resolve => {
            resolve({
                valid: searchByName(plans, value).length === 0,
                data: searchByName(plans, value).length === 0 ? undefined : { message: `Plan with name ${value} is already exist` }
            });
        })
});
VeeValidate.Validator.extend('verify_clinic_name', {
    // Custom validation message
    getMessage: (field, params, data) => (data && data.message) || 'Something went wrong',

    // Custom validation rule
    validate: (value, plans) =>
        new Promise(resolve => {
            resolve({
                valid: searchByName(plans, value).length === 0,
                data: searchByName(plans, value).length === 0 ? undefined : { message: `Clinic with name ${value} is already exist` }
            });
        })
});
VeeValidate.Validator.extend('is_after', {
    // Custom validation message
    getMessage: () => 'The due date shoud be after current date.',
    // Custom validation rule
    validate: (value, after) =>
        new Promise(resolve => {
            resolve({
                valid: value > after
            });
        })
});
VeeValidate.Validator.extend('is_exist', {
    // Custom validation message
    getMessage: () => 'Please save or delete this field.',
    // Custom validation rule
    validate: value =>
        new Promise(resolve => {
            resolve({
                valid: value.length === 0
            });
        })
});
Vue.use(VeeValidate, {
    fieldsBagName: 'fields',
    i18nRootKey: 'validations', // customize the root path for validation messages.
    i18n,
    dictionary: {
        en
        // ru,
        // uz
    }
});
