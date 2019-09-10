import Vue from 'vue';

import {
    PATIENT_LOGOUT,
    PATIENT_PARAM_SET,
    PATIENT_PARAM_PUSH,
    PATIENT_PARAM_DELETE,
    // PATIENT_ITEM_VISIBILITY_TOGGLE,
    PATIENT_SUB_PARAMS_SET,
    PATIENT_SUB_PARAM_PUSH,
    PATIENT_PARAM_REWRITE,
    PATIENT_SUB_PARAM_DELETE
} from '@/constants';

export default {
    [PATIENT_LOGOUT]: state => {
        Object.keys(state).forEach(key => {
            Vue.set(state, key, null);
        });
    },
    // [PATIENT_ITEM_VISIBILITY_TOGGLE]: (state, { params }) => {
    // if (params.planIndex >= 0 && params.type === 'procedures') {
    //     if (state.plans[params.planIndex].procedures[params.itemIndex].showInJaw) {
    //         state.plans[params.planIndex].procedures[params.itemIndex].showInJaw = false;
    //     } else {
    //         state.plans[params.planIndex].procedures[params.itemIndex].showInJaw = true;
    //     }
    // } else if (state[params.type][params.itemIndex].showInJaw) {
    //     state[params.type][params.itemIndex].showInJaw = false;
    // } else {
    //     state[params.type][params.itemIndex].showInJaw = true;
    // }
    // },
    [PATIENT_SUB_PARAMS_SET]: (state, { paramName, paramIndex, subParamName, subParamValue }) => {
        if (!state[paramName][paramIndex]) {
            Vue.set(state[paramName], paramIndex, {});
        }
        Vue.set(state[paramName][paramIndex], subParamName, subParamValue);
    },
    [PATIENT_PARAM_REWRITE]: (state, { paramName, paramIndex, paramValue }) => {
        if (!state[paramName]) {
            Vue.set(state, paramName, {});
        }
        Vue.set(state[paramName], paramIndex, paramValue);
    },
    [PATIENT_SUB_PARAM_PUSH]: (state, { paramName, paramIndex, subParamName, subParamIndex, subParamKey, subParamValue }) => {
        if (!state[paramName][paramIndex]) {
            Vue.set(state[paramName], paramIndex, []);
        }
        if (!state[paramName][paramIndex][subParamName]) {
            Vue.set(state[paramName][paramIndex], subParamName, []);
        }
        Vue.set(state[paramName][paramIndex][subParamName], subParamIndex, subParamKey);
        if (!state[subParamName]) {
            Vue.set(state, subParamName, {});
        }
        Vue.set(state[subParamName], subParamKey, subParamValue);
    },
    [PATIENT_SUB_PARAM_DELETE]: (state, { param, paramIndex, subParam, subParamIndex, subParamID }) => {
        Vue.delete(state[param][paramIndex][subParam], subParamIndex);
        Vue.delete(state[subParam], subParamID);
    },
    [PATIENT_PARAM_SET]: (state, { paramName, paramValue }) => {
        Vue.set(state, paramName, paramValue);
    },
    [PATIENT_PARAM_PUSH]: (state, { paramName, paramValue, paramKey }) => {
        if (!state[paramName]) {
            Vue.set(state, paramName, {});
        }
        Vue.set(state[paramName], paramKey, paramValue);
    },
    [PATIENT_PARAM_DELETE]: (state, { paramName, paramIndex }) => {
        Vue.delete(state[paramName], paramIndex);
    }
};
