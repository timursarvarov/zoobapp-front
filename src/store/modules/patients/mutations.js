import Vue from 'vue';
import { PATIENTS_PATIENT_ADD, PATIENTS_SET_PROP } from '@/constants';

export default {
    [PATIENTS_SET_PROP]: (state, { propName, propValue }) => {
        Vue.set(state, propName, propValue);
    },
    [PATIENTS_PATIENT_ADD]: (state, paitent) => {
        state.patients.unshift(paitent);
    }
};
