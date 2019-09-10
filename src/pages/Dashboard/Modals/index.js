import patientAddForm from './PatientAddForm.vue';
import clinicAddForm from './ClinicAddForm.vue';

const patientAddFormStore = {
    patientAddFormShown: false,
    showPatientAddForm(value) {
        this.patientAddFormShown = value;
    }
};

const clinicAddFormStore = {
    clinicAddFormShown: false,
    showPatientAddForm(value) {
        this.patientAddFormShown = value;
    }
};

const ClinicAddForml = {
    install(Vue) {
        // if (options && options.sidebarLinks) {
        //   SidebarStore.sidebarLinks = options.sidebarLinks;
        // }
        Vue.mixin({
            data() {
                return {
                    clinicAddFormStore
                };
            }
        });

        Object.defineProperty(Vue.prototype, '$clinicAddForm', {
            get() {
                return this.$root.clinicAddFormStore;
            }
        });
        Vue.component('clinic-add-form', clinicAddForm);
    }
};

const PatientAddForml = {
    install(Vue) {
        // if (options && options.sidebarLinks) {
        //   SidebarStore.sidebarLinks = options.sidebarLinks;
        // }
        Vue.mixin({
            data() {
                return {
                    patientAddFormStore
                };
            }
        });

        Object.defineProperty(Vue.prototype, '$patientAddForm', {
            get() {
                return this.$root.patientAddFormStore;
            }
        });
        Vue.component('patient-add-form', patientAddForm);
    }
};
export const PatientAddForm = PatientAddForml;
export const ClinicAddForm = ClinicAddForml;

// export default ClinicAddForm;
