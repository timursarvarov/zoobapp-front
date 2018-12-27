/* eslint-disable */
import axios from 'axios';
import {
  PATIENTS_REQUEST,
  PATIENTS_ERROR,
  PATIENTS_SUCCESS,
} from '../constants';

export default {
  [PATIENTS_REQUEST]: ({commit},{params}) => {
      return new Promise((resolve, reject) => {
        commit(PATIENTS_REQUEST);
        axios.get('/patients/'
        )
        .then(resp => {
          commit(PATIENTS_SUCCESS, resp);
          resolve(resp);
        })
        .catch(err => {
          console.log(err)
          commit(PATIENTS_ERROR);
          reject(err);
        });
      });

  },
};
