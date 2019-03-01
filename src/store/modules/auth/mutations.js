/* eslint-disable */
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REFRESH_ERROR,
} from '../constants';

export default {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success';
    state.accessToken = resp.data.accessToken;
    state.expiresAt = resp.data.expiresAt;
    state.refreshToken = resp.data.refreshToken;
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error';
    state.hasLoadedOnce = true;
  },
  [AUTH_REFRESH_ERROR]: (state) => {
    state.hasRefreshTokenError = true;
  },
  [AUTH_LOGOUT]: (state) => {
    state.accessToken = '';
    state.expiresAt = '';
    state.refreshToken = '';
  },
};