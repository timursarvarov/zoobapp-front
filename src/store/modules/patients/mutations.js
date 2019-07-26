/* eslint-disable */
import Vue from 'vue';
import {
    PATIENTS_REQUEST,
    PATIENTS_ERROR,
    PATIENTS_SUCCESS,
    PATIENTS_SET,
    PATIENTS_PATIENT_UPDATE,
    PATIENTS_PATIENT_ADD,
    PATIENTS_RESET,
} from '@/constants';

export default {
    [PATIENTS_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [PATIENTS_SUCCESS]: (state) => {
        state.status = 'success';
    },
    [PATIENTS_SET]: (state, patients) => {
        state.patients = patients;
    },
    [PATIENTS_RESET]: (state) => {
        state.patients = [];
    },
    [PATIENTS_ERROR]: (state) => {
        state.status = 'error';
    },
    [PATIENTS_PATIENT_UPDATE]: (state, payload) => {
        Vue.set(state.patients, payload.index, payload.patient);
    },
    [PATIENTS_PATIENT_ADD]: (state, paitent) => {
        state.patients.unshift(paitent);
    },
};