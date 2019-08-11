import Vue from 'vue';
import {
    AUTH_SET_PROP,
} from '@/constants';

export default {

    [AUTH_SET_PROP]: (state, { propName, propValue }) => {
        Vue.set(state, propName, propValue);
    },
};