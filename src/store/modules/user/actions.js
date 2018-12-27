/* eslint-disable */
import {
  USER_ERROR,
  USER_SUCCESS,
  USER_REQUEST,
  USER_AVATAR_UPLOAD,
  USER_INITIAL,
  USER_UPDATE,
} from '../constants';

import axios from 'axios';

export default {
  [USER_UPDATE]: ({commit}, {user}) => {
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
  [USER_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST);
      axios.get('/account/',{
        params:  JSON.stringify({
          processData: false,
          data: ""
          }),
      }
      )
      .then(resp => {
        localStorage.setItem('userName', resp.data.userName);
        localStorage.setItem('lastName', resp.data.lastName);
        localStorage.setItem('firstName', resp.data.firstName);
        localStorage.setItem('avatar', resp.data.avatar);
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
  [USER_INITIAL]: ({commit, dispatch}) => {
    const USER_NAME = localStorage.getItem('userName');
    if(USER_NAME) {
      const profile = {
        userName: USER_NAME,
        lastName: localStorage.getItem('lastName'),
        firstName: localStorage.getItem('firstName'),
        avatar: localStorage.getItem('avatar'),
      };
      commit(USER_INITIAL, profile);
    }
  },
  [USER_AVATAR_UPLOAD]: ({commit}, { fd }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST);
      axios.post('/account/photo/',
      fd,
      {
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
};
