/* eslint-disable */
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
} from '../constants';

export default {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success';
    state.accessToken = 'Bearer ' + resp.data.accessToken;
    state.expiresAt = resp.data.expiresAt;
    state.refreshToken = resp.data.refreshToken;
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error';
    state.hasLoadedOnce = true;
  },
  [AUTH_LOGOUT]: (state) => {
    state.accessToken = '';
    state.expiresAt = '';
    state.refreshToken = '';
  },
};
