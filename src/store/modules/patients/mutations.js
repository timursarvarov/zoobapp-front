/* eslint-disable */
import {
    PATIENTS_REQUEST,
    PATIENTS_ERROR,
    PATIENTS_SUCCESS,
    PATIENTS_SET,
    PATIENTS_UPDATE_PATIENT,
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
    [PATIENTS_UPDATE_PATIENT]: (state, payload) => {
        state.patients[payload.index] = payload.patient;
    },
};