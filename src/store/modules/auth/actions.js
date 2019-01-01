/* eslint-disable */
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_LOCK,
  AUTH_REFRESH_TOKEN,
  AUTH_DECODE_TOKEN,
  USER_REQUEST,
  USER_LOGOUT,
  CLINIC_SET,
} from '../constants';

import axios from 'axios';
export default {
  [AUTH_REQUEST]: ({
    commit,
    dispatch
  }, {
    username,
    password
  }) => {
    const token = axios.defaults.headers.common.Authorization;
    if (token) {
      axios.defaults.headers.common.Authorization = '';
    }
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      axios.post('/auth/authentication/',
          JSON.stringify({
            username: username,
            password: password
          })
        )
        .then(resp => {
          localStorage.setItem('accessToken', 'Bearer ' + resp.data.accessToken);
          localStorage.setItem('expiresAt', resp.data.expiresAt);
          localStorage.setItem('refreshToken', resp.data.refreshToken);
          axios.defaults.headers.common.Authorization = 'Bearer ' + resp.data.accessToken;

          commit(AUTH_SUCCESS, resp);
          dispatch(AUTH_DECODE_TOKEN);
          dispatch(USER_REQUEST);
          resolve(resp);
        })
        .catch(err => {
          if (err.response) {
            reject(err);
          }
          commit(AUTH_ERROR, err);
          localStorage.removeItem('accessToken');
        });
    });
  },
  [AUTH_REFRESH_TOKEN]: ({
    commit,
    dispatch,
    state
  }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      axios.post('/auth/refreshToken/',
          JSON.stringify({
            refreshToken: refreshToken,
          })
        )
        .then(resp => {
          localStorage.setItem('accessToken', 'Bearer ' + resp.data.accessToken);
          localStorage.setItem('expiresAt', resp.data.expiresAt);
          localStorage.setItem('refreshToken', resp.data.refreshToken);
          commit(AUTH_SUCCESS, resp);
          dispatch(AUTH_DECODE_TOKEN);
          resolve(resp.data.accessToken);
        })
        .catch(err => {
          commit(AUTH_ERROR, err);
          dispatch(USER_LOGOUT);
          localStorage.removeItem('accessToken');
          reject(err);
        });
    })
  },
  [AUTH_LOGOUT]: ({
    commit,
  }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT);
      commit(USER_LOGOUT);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      resolve();
    });
  },
  [AUTH_DECODE_TOKEN]: ({
    dispatch,
  }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedParms = JSON.parse(window.atob(base64));
    dispatch(CLINIC_SET, decodedParms.organization);

  },
  [AUTH_LOCK]: ({
    commit,
    // dispatch,
  }) => {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      commit(AUTH_LOGOUT);
      resolve();
    });
  },
};