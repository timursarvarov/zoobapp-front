import Vue from 'vue';
import { CLINIC_SET_PROP } from '@/constants';

export default {
    [CLINIC_SET_PROP]: (state, { propName, propValue }) => {
        Vue.set(state, propName, propValue);
    }
};
