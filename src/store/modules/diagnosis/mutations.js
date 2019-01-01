/* eslint-disable */
import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS,
  USER_LOGOUT,
  USER_AVATAR_UPLOAD,
  USER_INITIAL,
  USER_UPDATE,
  USER_SET_PARAMS,
} from '../constants';

export default {
  [USER_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [USER_UPDATE]: (state, resp) => {
    state.profile = resp.data;
  },
  [USER_SUCCESS]: (state) => {
    state.status = 'success';
    // Vue.set(state, 'profile', resp.data);
  },
  [USER_ERROR]: (state) => {
    state.status = 'error';
  },
  [USER_LOGOUT]: (state) => {
    state.profile = {};
  },
  [USER_AVATAR_UPLOAD]: (state, resp) => {
    state.profile.avatar = resp.data.url;
  },
  [USER_INITIAL]: (state, profile) => {
    state.profile = profile;
  },
  [USER_SET_PARAMS]: (state, {
    type,
    value
  }) => {
    state.profile[type] = value;
  },
};