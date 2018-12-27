/* eslint-disable */
import axios from 'axios';
import {
  PATIENT_CREATE,
  PATIENT_REQUEST,
  PATIENT_ERROR,
  PATIENT_SUCCESS,
} from '../constants';

export default {
  [PATIENT_CREATE]: ({commit},{patient}) => {
      return new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.post('/patients/',
        JSON.stringify({
          firstName: patient.firstName,
          lastName: patient.lastName,
          phone: patient.phone,
          email: patient.email,
          // allergy: patient.allergy,
          })
        )
        .then(resp => {
          commit(PATIENT_SUCCESS);
          resolve(resp);
          console.log(resp);
        })
        .catch(err => {
          console.log(err);
          commit(PATIENT_ERROR);
          reject(err);
        });
      });

  },
};
