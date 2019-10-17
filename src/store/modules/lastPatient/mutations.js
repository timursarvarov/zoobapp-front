import Vue from 'vue';

import { LAST_PATIENT_PARAM_PUSH } from '@/constants';

export default {
    [LAST_PATIENT_PARAM_PUSH]: (state, { paramName, paramValue }) => {
        Vue.set(state, paramName, paramValue);
    }
};
