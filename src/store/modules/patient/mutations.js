/* eslint-disable */
import {
  PATIENT_REQUEST,
  PATIENT_ERROR,
  PATIENT_SUCCESS,
  PATIENT_LOGOUT,
  PATIENT_UPDATE,
  PATIENT_PLAN_SET,
  PATIENT_PLAN_DELETE,
  PATIENT_DIAGNOSE_SET,
  PATIENT_DIAGNOSE_UPDATE,
  PATIENT_TREATMETS_SET,
  PATIENT_TREATMETS_UPDATE,
  PATIENT_GET,
  PATIENT_SET_PARAM,
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
    state.patient.plans.unshift(plan);
  },
  [PATIENT_PLAN_DELETE]: (state, { dIndex, plan }) => {
    state.patient.plans.splice(dIndex, 1);
  },
  [PATIENT_TREATMETS_SET]: (state, {treatment, pIndex}) => {
    state.patient.plans[pIndex].treatments.unshift(treatment);
  },
  [PATIENT_TREATMETS_UPDATE]: (state, { dIndex, treatment }) => {
    state.patient.treatments.splice(dIndex, 1, treatment);
  },
  [PATIENT_DIAGNOSE_SET]: (state, diagnose) => {
    state.patient.diagnosis.unshift(diagnose);
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