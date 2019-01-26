/* eslint-disable */
import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS,
  USER_LOGOUT,
  USER_SET_PARAM,
} from '../constants';

export default {
  [USER_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [USER_SUCCESS]: (state) => {
    state.status = 'success';
  },
  [USER_ERROR]: (state) => {
    state.status = 'error';
  },
  [USER_LOGOUT]: (state) => {
    state.profile = {};
  },
  [USER_SET_PARAM]: (
    state, {
      type,
      value
    }
  ) => {
    state.profile[type] = value;
  },
};