/* eslint-disable */
import {
  CLINIC_REQUEST,
  CLINIC_ERROR,
  CLINIC_SUCCESS,
  CLINIC_SET,
  CLINIC_LOGO_UPLOAD,
  CLINIC_UPDATE,
  AUTH_REFRESH_TOKEN,
} from '../constants';

import axios from 'axios';
export default {
  [CLINIC_UPDATE]: ({
    commit,
    dispatch
  }, {
    clinic
  }) => {
    return new Promise((resolve, reject) => {
      commit(CLINIC_REQUEST);
      axios.put('/organization/',
          JSON.stringify({
            name: clinic.name,
            description: clinic.description,
          })
        )
        .then(resp => {
          commit(CLINIC_SUCCESS);
          dispatch(AUTH_REFRESH_TOKEN);
          resolve(resp);
        })
        .catch(err => {
          commit(CLINIC_ERROR);
          reject(err);
        });
    });
  },
  [CLINIC_SET]: ({
    commit
  }, clinic) => {
    for (var k in clinic) {
      if (clinic.hasOwnProperty(k)) {
        commit(CLINIC_SET, {
          type: k,
          value: clinic[k]
        });
      }
    }
  },
  [CLINIC_LOGO_UPLOAD]: ({
    commit,
    dispatch,
  }, {
    fd
  }) => {
    return new Promise((resolve, reject) => {
      commit(CLINIC_REQUEST);
      axios.post('/organization/logo/',
          fd, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(resp => {
          commit(CLINIC_SUCCESS);
          dispatch(AUTH_REFRESH_TOKEN);
          resolve(resp);
        })
        .catch(err => {
          commit(CLINIC_ERROR);
          reject(err);
        });
    });
  },
};