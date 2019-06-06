/* eslint-disable */
import {
    CLINICS_REQUEST,
    CLINICS_ERROR,
    CLINICS_SUCCESS,
    CLINICS_CREATE,
    CLINICS_SET,
} from '@/constants';

export default {
    [CLINICS_CREATE]: (
        state, {
            type,
            value
        }
    ) => {
        state.clinic[type] = value;
    },
    [CLINICS_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [CLINICS_SUCCESS]: (state) => {
        state.status = 'success';
    },
    [CLINICS_ERROR]: (state) => {
        state.status = 'error';
    },
    [CLINICS_SET]: (state, clinics) => {
        state.clinics = clinics;
    },
};