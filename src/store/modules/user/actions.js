/* eslint-disable */
import {
  USER_ERROR,
  USER_SUCCESS,
  USER_REQUEST,
  USER_AVATAR_UPLOAD,
  USER_INITIAL,
  USER_UPDATE,
  USER_SET_PARAMS
} from '../constants';

import axios from 'axios';

export default {
  [USER_UPDATE]: ({
    commit
  }, {
    user
  }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST);
      axios.put('/account/',
          JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
          })
        )
        .then(resp => {
          commit(USER_SUCCESS);
          resolve(resp);
        })
        .catch(err => {
          commit(USER_ERROR);
          reject(err);
        });
    });
  },
  [USER_REQUEST]: ({
    commit,
    dispatch
  }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST);
      axios.get('/account/', {
          params: JSON.stringify({
            processData: false,
            data: ""
          }),
        })
        .then(resp => {
          localStorage.setItem('USER_NAME', resp.data.userName);
          localStorage.setItem('USER_LAST_NAME', resp.data.lastName);
          localStorage.setItem('USER_FIRST_NAME', resp.data.firstName);
          localStorage.setItem('USER_AVATAR', resp.data.avatar);
          localStorage.setItem('USER_PHONE', resp.data.phone);
          localStorage.setItem('USER_ADDRESS', resp.data.address);
          localStorage.setItem('USER_LANG', resp.data.lang); // 1=rus 2=eng
          commit(USER_SUCCESS);
          commit(USER_UPDATE, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(USER_ERROR);
          reject(err);
        });
    });
  },
  [USER_INITIAL]: ({
    commit,
    dispatch
  }) => {
    const USER_NAME = localStorage.getItem('userName');
    if (USER_NAME) {
      const profile = {
        userName: USER_NAME,
        lastName: localStorage.getItem('lastName'),
        firstName: localStorage.getItem('firstName'),
        avatar: localStorage.getItem('avatar'),
      };
      commit(USER_INITIAL, profile);
    }
  },
  [USER_AVATAR_UPLOAD]: ({
    commit
  }, {
    fd
  }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST);
      axios.post('/account/photo/',
          fd, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(resp => {
          commit(USER_SUCCESS);
          commit(USER_AVATAR_UPLOAD, resp);
          resolve(resp);
        })
        .catch(err => {
          commit(USER_ERROR);
          reject(err);
        });
    });
  },
  [USER_SET_PARAMS]: ({
    commit
  }, {
    type,
    value
  }) => {
    commit(USER_SET_PARAMS, {
      type,
      value
    });
  }
};