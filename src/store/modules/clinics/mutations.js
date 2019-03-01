/* eslint-disable */
import {
  CLINICS_REQUEST,
  CLINICS_ERROR,
  CLINICS_SUCCESS,
  CLINICS_CREATE,
} from '../constants';

export default {
  [CLINICS_CREATE]: (
    state, {
      type,
      value
    }
  ) => {
    state.clinic[type] = value;
  },
  [CLINICS_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [CLINICS_SUCCESS]: (state) => {
    state.status = 'success';
  },
  [CLINICS_ERROR]: (state) => {
    state.status = 'error';
  },
};