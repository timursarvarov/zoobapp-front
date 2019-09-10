import Vue from 'vue';
import { CLINICS_PROP_PUSH, CLINICS_PROP_SET } from '@/constants';

export default {
    [CLINICS_PROP_PUSH]: (state, { subPropIndex, propName, propValue }) => {
        if (!state[propName]) {
            Vue.set(state, propName, []);
        }
        Vue.set(state[propName], subPropIndex, propValue);
    },
    [CLINICS_PROP_SET]: (state, { propKey, propName }) => {
        Vue.set(state, propKey, propName);
    }
};
