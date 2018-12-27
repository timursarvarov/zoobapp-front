import patientAddForm from './PatientAddForm.vue';

const patientAddFormStore = {
    patientAddFormShown: false,
    showPatientAddForm(value) {
        this.patientAddFormShown = value;
    },
};

const PatientAddForm = {
    install(Vue) {
    // if (options && options.sidebarLinks) {
    //   SidebarStore.sidebarLinks = options.sidebarLinks;
    // }
        Vue.mixin({
        data() {
            return {
            patientAddFormStore,
            };
        },
        });

        Object.defineProperty(Vue.prototype, '$patientAddForm', {
        get() {
            return this.$root.patientAddFormStore;
        },
        });
            Vue.component('patient-add-form', patientAddForm);
    },
};

export default PatientAddForm;
