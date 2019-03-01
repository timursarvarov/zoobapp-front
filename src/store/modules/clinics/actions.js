/* eslint-disable */
import {
  CLINICS_REQUEST,
  CLINICS_ERROR,
  CLINICS_SUCCESS,
  CLINICS_SET,
} from '../constants';

import axios from 'axios';
export default {
  [CLINIC_UPDATE]: ({
    commit,
    dispatch
  }, {
    clinic
  }) => {
    console.log(clinic);
    return new Promise((resolve, reject) => {
      commit(CLINIC_REQUEST);
      axios.put('/organization/',
          JSON.stringify({
            name: clinic.name,
            address: clinic.address,
            currencyCode: clinic.currencyCode,
            email: clinic.email,
            // tax: clinic.tax,
            phone: parseInt(clinic.phone, 10),
            teethSystem: clinic.teethSystem,
            timezoneOffset: clinic.timezoneOffset,
            url: clinic.url,
            description: clinic.description,
          })
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
};