/* eslint-disable */
import {
  PATIENT_REQUEST,
  PATIENT_ERROR,
  PATIENT_SUCCESS,
  PATIENT_LOGOUT,
  PATIENT_AVATAR_UPLOAD,
  PATIENT_UPDATE,
  PATIENT_DIAGNOSE_SET,
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
  [PATIENT_AVATAR_UPLOAD]: (state, resp) => {
    state.patient.avatar = resp.data.url;
  },
  [PATIENT_DIAGNOSE_SET]: (state, diagnose) => {
    state.patient.diagnosis.push(diagnose);
  },
};