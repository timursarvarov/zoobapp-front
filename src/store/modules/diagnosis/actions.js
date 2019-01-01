/* eslint-disable */
import {
  DIAGNOSIS_REQUEST,
  DIAGNOSIS_UPDATE,
  DIAGNOSIS_SUCCESS,
  DIAGNOSIS_ERROR,
  DIAGNOSIS_SET,
} from '../constants';

import axios from 'axios';

export default {
  [DIAGNOSIS_UPDATE]: ({
    commit
  }, {
    user
  }) => {
    return new Promise((resolve, reject) => {
      commit(DIAGNOSIS_REQUEST);
      axios.put('/account/',
          JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
          })
        )
        .then(resp => {
          commit(DIAGNOSIS_SUCCESS);
          resolve(resp);
        })
        .catch(err => {
          commit(DIAGNOSIS_ERROR);
          reject(err);
        });
    });
  },
  [DIAGNOSIS_REQUEST]: ({
    commit,
    dispatch
  }) => {
    return new Promise((resolve, reject) => {
      commit(DIAGNOSIS_REQUEST);
      axios.get('/account/', {
          params: JSON.stringify({
            processData: false,
            data: ""
          }),
        })
        .then(resp => {
          localStorage.setItem('userName', resp.data.userName);
          localStorage.setItem('lastName', resp.data.lastName);
          localStorage.setItem('firstName', resp.data.firstName);
          localStorage.setItem('avatar', resp.data.avatar);
          commit(DIAGNOSIS_SUCCESS);
          commit(DIAGNOSIS_UPDATE, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(DIAGNOSIS_ERROR);
          reject(err);
        });
    });
  },
};