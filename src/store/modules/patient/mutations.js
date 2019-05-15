/* eslint-disable */
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
    PATIENT_DIAGNOSE_SET,
    PATIENT_DIAGNOSE_UPDATE,
    PATIENT_PROCEDURES_SET,
    PATIENT_TREATMETS_UPDATE,
    PATIENT_GET,
    PATIENT_SET_PARAM,
    PATIENT_TOGGLE_ITEM_VISIBILITY,
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
    [PATIENT_TOGGLE_ITEM_VISIBILITY]: (state, { params: params }) => {
        if (params.planIndex >= 0) {
            if (state.patient.plans[params.planIndex].procedures[params.itemIndex].showInJaw) {
                state.patient.plans[params.planIndex].procedures[params.itemIndex].showInJaw = false;
            } else {
                state.patient.plans[params.planIndex].procedures[params.itemIndex].showInJaw = true;
            }
        } else {
            if (state.patient[params.type][params.itemIndex].showInJaw) {
                state.patient[params.type][params.itemIndex].showInJaw = false;
            } else {
                state.patient[params.type][params.itemIndex].showInJaw = true;
            }
        }
    },
    [PATIENT_PROCEDURES_SET]: (state, { procedure, pIndex }) => {
        state.patient.plans[pIndex].procedures.unshift(procedure);
    },
    [PATIENT_TREATMETS_UPDATE]: (state, { dIndex, procedure }) => {
        state.patient.procedures.splice(dIndex, 1, procedure);
    },
    [PATIENT_DIAGNOSE_SET]: (state, diagnose) => {
        state.patient.diagnosis.unshift(diagnose);
    },
    [PATIENT_ANAMNES_SET]: (state, anamnes) => {
        state.patient.anamnesis.unshift(anamnes);
    },
    [PATIENT_DIAGNOSE_UPDATE]: (state, { dIndex, diagnose }) => {
        state.patient.diagnosis.splice(dIndex, 1, diagnose);
    },
    [PATIENT_GET]: (state, patient) => {
        state.patient = patient;
    },
    [PATIENT_SET_PARAM]: (
        state, {
            type,
            value
        }
    ) => {
        state.patient[type] = value;
    },
};