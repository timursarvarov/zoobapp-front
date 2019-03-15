/* eslint-disable */
import {
  PATIENT_REQUEST,
  PATIENT_ERROR,
  PATIENT_SUCCESS,
  PATIENT_LOGOUT,
  PATIENT_UPDATE,
  PATIENT_DIAGNOSE_SET,
  PATIENT_DIAGNOSE_UPDATE,
  PATIENT_GET,
  PATIENT_SET_PARAM,
} from '../constants';

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
  [PATIENT_DIAGNOSE_SET]: (state, diagnose) => {
    state.patient.diagnosis.push(diagnose);
  },
  [PATIENT_DIAGNOSE_UPDATE]: (state, diagnose) => {
    const dIndex = state.patient.diagnosis.findIndex(
      pDiagnose => pDiagnose.id === diagnose.id
    );
    if(dIndex === -1){
      return;
    }
    state.patient.diagnosis[dIndex] = diagnose;
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