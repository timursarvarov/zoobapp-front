/* eslint-disable */
import axios from 'axios';
import {
  PATIENTS_REQUEST,
  PATIENTS_ERROR,
  PATIENTS_SUCCESS,
  PATIENTS_SET,
  PATIENTS_UPDATE_PATIENT,
} from '../constants';

export default {
  [PATIENTS_REQUEST]: ({
    commit
  }, {
    params
  }) => {
    return new Promise((resolve, reject) => {
      commit(PATIENTS_REQUEST);
      axios.get('/patients/')
        .then(resp => {
          commit(PATIENTS_SUCCESS);
          commit(PATIENTS_SET, resp);
          resolve(resp);
        })
        .catch(err => {
          console.log(err)
          commit(PATIENTS_ERROR);
          reject(err);
        });
    });

  },
  [PATIENTS_UPDATE_PATIENT]: ({
    commit,
    state
  }, {
    patient
  }) => {
    if (state.patients.lenght > 0) {
      const index = state.patients.findIndex(function (e) {
        return e.ID === patient.ID;
      });
      if (index === -1) return;
      const payload = {
        index: index,
        patient: patient
      }
      commit(PATIENTS_UPDATE_PATIENT, payload);
    }
  },
};