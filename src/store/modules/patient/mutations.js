/* eslint-disable no-param-reassign */
import Vue from 'vue';
import {
    PATIENT_REQUEST,
    PATIENT_ERROR,
    PATIENT_SUCCESS,
    PATIENT_LOGOUT,
    PATIENT_UPDATE,
    PATIENT_PLAN_SET,
    PATIENT_PLAN_DELETE,
    PATIENT_PLAN_EDIT,
    PATIENT_ANAMNES_SET,
    PATIENT_ANAMNES_UPDATE,
    PATIENT_DIAGNOSE_SET,
    PATIENT_DIAGNOSE_UPDATE,
    PATIENT_PROCEDURE_SET,
    PATIENT_PROCEDURE_UPDATE,
    PATIENT_GET,
    PATIENT_PARAM_SET,
    PATIENT_PARAM_PUSH,
    PATIENT_PARAM_DELETE,
    PATIENT_ITEM_VISIBILITY_TOGGLE,
    PATIENT_SUB_PARAMS_SET,
    PATIENT_SUB_PARAM_SET,
    PATIENT_SUB_PARAM_PUSH,
    PATIENT_SUB_PARAM_DELETE,
    PATIENT_INVOICE_SET,
} from '@/constants';

export default {
    [PATIENT_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [PATIENT_UPDATE]: (state, resp) => {
        state.patient = resp.data;
    },
    [PATIENT_SUCCESS]: (state) => {
        state.status = 'success';
        // Vue.set(state, 'patient', resp.data);
    },
    [PATIENT_ERROR]: (state) => {
        state.status = 'error';
    },
    [PATIENT_LOGOUT]: (state) => {
        state.patient = {};
    },
    [PATIENT_PLAN_SET]: (state, plan) => {
        state.patient.plans.push(plan);
    },
    [PATIENT_PLAN_DELETE]: (state, { dIndex, plan }) => {
        state.patient.plans.splice(dIndex, 1);
    },
    [PATIENT_PLAN_EDIT]: (state, { pIndex, key, value }) => {
        state.patient.plans[pIndex][key] = value;
    },
    [PATIENT_ITEM_VISIBILITY_TOGGLE]: (state, { params }) => {
        if (params.planIndex >= 0 && params.type === 'procedures') {
            if (state.patient.plans[params.planIndex].procedures[params.itemIndex].showInJaw) {
                state.patient.plans[params.planIndex].procedures[params.itemIndex].showInJaw = false;
            } else {
                state.patient.plans[params.planIndex].procedures[params.itemIndex].showInJaw = true;
            }
        } else if (state.patient[params.type][params.itemIndex].showInJaw) {
            state.patient[params.type][params.itemIndex].showInJaw = false;
        } else {
            state.patient[params.type][params.itemIndex].showInJaw = true;
        }
    },
    [PATIENT_PROCEDURE_SET]: (state, { procedure, planId }) => {
        state.patient.plans.map((p) => {
            if (p.ID !== planId) {
                return;
            }
            if (!state.patient.plan.procedures) {
                Vue.set(state.patient.plan, 'procedures', []);
            }
            Vue.set(state.patient.plan.procedures, state.patient.plan.procedures.length, procedure);
        });
    },
    [PATIENT_PROCEDURE_UPDATE]: (state, { procedureIndex, planIndex, procedure }) => {
        state.patient.plans[planIndex].procedures.splice(procedureIndex, 1, procedure);
    },
    [PATIENT_DIAGNOSE_SET]: (state, diagnose) => {
        state.patient.diagnosis.unshift(diagnose);
    },
    [PATIENT_ANAMNES_SET]: (state, anamnes) => {
        state.patient.anamnesis.unshift(anamnes);
    },
    [PATIENT_INVOICE_SET]: (state, invoice) => {
        state.patient.invoices.unshift(invoice);
    },
    [PATIENT_SUB_PARAMS_SET]: (state, {
        paramName,
        paramIndex,
        subParamName,
        subParamIndexArray,
        subParamsValue,
    }) => {
        if (!state.patient[paramName][paramIndex]) {
            Vue.set(state.patient[paramName], paramIndex, []);
        }
        Vue.set(state.patient[paramName][paramIndex], subParamName, subParamIndexArray);
        Vue.set(state.patient, subParamName, subParamsValue);
    },
    [PATIENT_SUB_PARAM_PUSH]: (state, {
        paramName,
        paramIndex,
        subParamName,
        subParamIndex,
        subParamKey,
        subParamValue,
    }) => {
        if (!state.patient[paramName][paramIndex]) {
            Vue.set(state.patient[paramName], paramIndex, []);
        }
        if (!state.patient[paramName][paramIndex][subParamName]) {
            Vue.set(state.patient[paramName][paramIndex], subParamName, []);
        }
        Vue.set(state.patient[paramName][paramIndex][subParamName], subParamIndex, subParamKey);
        if (!state.patient[subParamName]) {
            Vue.set(state.patient, subParamName, {});
        }
        Vue.set(state.patient[subParamName], subParamKey, subParamValue);
    },
    [PATIENT_SUB_PARAM_DELETE]: (state, {
        param,
        paramIndex,
        subParam,
        subParamIndex,
        subParamID,
    }) => {
        console.log(state.patient);
        Vue.delete(state.patient[param][paramIndex][subParam], subParamIndex);
        Vue.delete(state.patient[subParam], subParamID);
        console.log(state.patient);
    },
    [PATIENT_DIAGNOSE_UPDATE]: (state, { dIndex, diagnose }) => {
        state.patient.diagnosis.splice(dIndex, 1, diagnose);
    },
    [PATIENT_ANAMNES_UPDATE]: (state, { aIndex, anamnes }) => {
        state.patient.anamnesis.splice(aIndex, 1, anamnes);
    },
    [PATIENT_GET]: (state, patient) => {
        state.patient = patient;
    },
    [PATIENT_PARAM_SET]: (
        state, {
            type,
            value,
        },
    ) => {
        Vue.set(state.patient, type, value);
    },
    [PATIENT_PARAM_PUSH]: (
        state, {
            param,
            value,
            key,
        },
    ) => {
        if (!state.patient[param]) {
            Vue.set(state.patient, param, []);
        }
        Vue.set(state.patient[param], key, value);
    },
    [PATIENT_PARAM_DELETE]: (
        state, {
            type,
            ID,
        },
    ) => {
        state.patient[type].map((p, index) => {
            if (p.ID !== ID) {
                Vue.set(state.patient[type], index, p);
            } else {
                Vue.delete(state.patient[type], index);
            }
        });
    },
    // [PATIENT_SUB_PARAM_DELETE]: (
    //     state, {
    //         param,
    //         subParam,
    //         paramID,
    //         subParamID,
    //     }
    // ) => {
    //     state.patient[param].map((param, index) => {
    //         console.log(param)
    //         if (param.ID !== paramID) {
    //             return;
    //         }
    //         state.patient[param][index][subParam].map((subP, subIndex) => {
    //             if (subP.ID !== subParamID) {
    //                 return;
    //             }
    //             console.log(state.patient[param][index][subParam])
    //             Vue.delete(state.patient[param][index][subParam], subIndex);
    //         })
    //     });
    // },
};