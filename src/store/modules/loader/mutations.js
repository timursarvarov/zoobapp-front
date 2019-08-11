import Vue from 'vue';
import {
    LOADER_SET_PROP,
} from '@/constants';

export default {
    [LOADER_SET_PROP]: (state, { propKey, propValue }) => {
        Vue.set(state, propKey, propValue);
    },
};