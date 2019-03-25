/* eslint-disable */
import {
  CLINIC_REQUEST,
  CLINIC_ERROR,
  CLINIC_SUCCESS,
  CLINIC_SET,
  CLINIC_LOGO_UPLOAD,
  CLINIC_UPDATE,
  AUTH_REFRESH_TOKEN,
} from '@/constants';

import axios from 'axios';
export default {
  [CLINIC_UPDATE]: ({
    commit,
    dispatch
  }, {
    clinic
  }) => {
    let fields = {};
    for (const key in clinic) {
      if (clinic.hasOwnProperty(key)) {
        fields[key] = !isNaN(clinic[key]) ? parseInt(clinic[key], 10) : clinic[key];
      }
    }
    return new Promise((resolve, reject) => {
      commit(CLINIC_REQUEST);
      axios.put('/organization/',
          JSON.stringify(
            fields
          )
        )
        .then(resp => {
          commit(CLINIC_SUCCESS);
          dispatch(AUTH_REFRESH_TOKEN)
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
  }, organization) => {
    for (var k in organization) {
      if (organization.hasOwnProperty(k)) {
        commit(CLINIC_SET, {
          type: k,
          value: organization[k]
        });
      }
    }
    localStorage.setItem('CLINIC_ID', organization.ID);
    localStorage.setItem('CLINIC_NAME', organization.name);
    localStorage.setItem('CLINIC_DESCRIPTION', organization.description);
    localStorage.setItem('CLINIC_LOGO', organization.logo);
    localStorage.setItem('CLINIC_PHONE', organization.phone);
    localStorage.setItem('CLINIC_EMAIL', organization.email);
    localStorage.setItem('CLINIC_URL', organization.url);
    localStorage.setItem('CLINIC_ADDRESS', organization.address);
    localStorage.setItem('CLINIC_TIMEZONE_OFFSET', organization.timezoneOffset);
    localStorage.setItem('CLINIC_CURRENCY_CODE', organization.currencyCode);
    localStorage.setItem('CLINIC_TEETH_SYSTEM', organization.teethSystem);
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