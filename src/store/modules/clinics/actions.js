/* eslint-disable */
import {
  CLINICS_REQUEST,
  CLINICS_ERROR,
  CLINICS_SUCCESS,
  CLINICS_CREATE,
} from '../constants';

import axios from 'axios';
export default {
  [CLINICS_CREATE]: ({
    commit,
    dispatch
  }, {
    clinic
  }) => {
    console.log(clinic);
    return new Promise((resolve, reject) => {
      commit(CLINICS_REQUEST);
      axios.put('/organization/',
          JSON.stringify({
            name: clinic.name,
            description: clinic.description,
          })
        )
        .then(resp => {
          commit(CLINICS_SUCCESS);
          resolve(resp);
        })
        .catch(err => {
          commit(CLINICS_ERROR);
          reject(err);
        });
    });
  },
};