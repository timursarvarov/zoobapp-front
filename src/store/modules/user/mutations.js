/* eslint-disable no-param-reassign */
import Vue from 'vue';
import {
    USER_REQUEST,
    USER_ERROR,
    USER_SUCCESS,
    USER_LOGOUT,
    USER_PROP_SET,
} from '@/constants';

export default {
    [USER_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [USER_SUCCESS]: (state) => {
        state.status = 'success';
    },
    [USER_ERROR]: (state) => {
        state.status = 'error';
    },
    [USER_LOGOUT]: (state) => {
        state.profile = {};
    },
    [USER_PROP_SET]: (
        state, {
            propKey,
            propValue,
        },
    ) => {
        Vue.set(state.profile, propKey, propValue);
    },
};
