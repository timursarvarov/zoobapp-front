/* eslint-disable */
import {
    CLINIC_SET_PROPS,
    CLINIC_REQUEST,
    CLINIC_SUCCESS,
    CLINIC_ERROR,
} from '@/constants';

export default {
    [CLINIC_SET_PROPS]: (
        state, {
            type,
            value
        }
    ) => {
        state.clinic[type] = value;
    },
    [CLINIC_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [CLINIC_SUCCESS]: (state) => {
        state.status = 'success';
    },
    [CLINIC_ERROR]: (state) => {
        state.status = 'error';
    },
};