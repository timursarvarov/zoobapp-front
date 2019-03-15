/* eslint-disable */
import {
  USER_ERROR,
  USER_SUCCESS,
  USER_REQUEST,
  USER_AVATAR_UPLOAD,
  USER_INITIAL,
  USER_UPDATE,
  USER_SET_PARAMS,
  USER_SAVE_TO_LOCAL_STORAGE,
  USER_SET_PARAM,
  USER_UPDATE_PASSWORD,
  USER_LOGOUT,
  USER_REGISTER,

} from '../constants';

import axios from 'axios';

export default {
  [USER_UPDATE_PASSWORD]: ({
    commit
  }, {
    pw
  }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST);
      axios.put('/account/',
          JSON.stringify({
            password: pw.password,
            password_new: pw.password_new,

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
  [USER_UPDATE]: ({
    commit,
    dispatch,
  }, {
    user
  }) => {
    let fields = {};
    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        if(key !== 'userName'){
          fields[key] = !isNaN(user[key]) ? parseInt(user[key], 10) : user[key];
        }
      }
    }
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST);
      axios.put('/account/',
          JSON.stringify(fields)
        )
        .then(resp => {
          commit(USER_SUCCESS);
          resolve(resp);
          dispatch(USER_SET_PARAMS, {
            user: resp.data
          });
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
          commit(USER_SUCCESS);
          dispatch(USER_SET_PARAMS, {
            user: resp.data
          });
          resolve(resp);
        })
        .catch(err => {
          commit(USER_ERROR);
          reject(err);
        });
    });
  },
  [USER_LOGOUT]: ({
    commit
  }) => {
    localStorage.removeItem('USER_NAME');
    localStorage.removeItem('USER_LAST_NAME');
    localStorage.removeItem('USER_FIRST_NAME');
    localStorage.removeItem('USER_AVATAR');
    localStorage.removeItem('USER_PHONE');
    localStorage.removeItem('USER_ADDRESS');
    localStorage.removeItem('USER_LANG'); // 1=rus 2=eng
    commit(USER_LOGOUT);
  },
  [USER_SAVE_TO_LOCAL_STORAGE]: ({}, {
    user
  }) => {
    if (user.userName) {
      localStorage.setItem('USER_NAME', user.userName);
    }
    if (user.lastName) {
      localStorage.setItem('USER_LAST_NAME', user.lastName);
    }
    if (user.firstName) {
      localStorage.setItem('USER_FIRST_NAME', user.firstName);
    }
    if (user.avatar) {
      localStorage.setItem('USER_AVATAR', user.avatar);
    }
    if (user.phone) {
      localStorage.setItem('USER_PHONE', user.phone);
    }
    if (user.address) {
      localStorage.setItem('USER_ADDRESS', user.address);
    }
    if (user.lang) {
      localStorage.setItem('USER_LANG', user.lang); // 1=rus 2=eng
    }

  },
  [USER_INITIAL]: ({
    dispatch
  }) => {
    const USER_NAME = localStorage.getItem('USER_NAME');
    if (USER_NAME) {
      const user = {
        ID: localStorage.getItem('ID'),
        userName: localStorage.getItem('USER_NAME'),
        lastName: localStorage.getItem('USER_LAST_NAME'),
        firstName: localStorage.getItem('USER_FIRST_NAME'),
        avatar: localStorage.getItem('USER_AVATAR'),
        phone: localStorage.getItem('USER_PHONE'),
        address: localStorage.getItem('USER_ADDRESS'),
        lang: localStorage.getItem('USER_LANG'), // 1=rus 2=eng
      };
      dispatch(USER_SET_PARAMS, {
        user: user
      });
    } else {
      dispatch(USER_REQUEST)
    }
  },
  [USER_REGISTER]: ({
    commit,
  }, {
    params
  }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST);
      axios.post('/registration/',
      JSON.stringify({
        lastName: params.lastName,
        firstName: params.firstName,
        username: params.username,
        password: params.password,
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
  [USER_AVATAR_UPLOAD]: ({
    commit,
    dispatch
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
          dispatch(USER_SET_PARAM, {
            type: 'avatar',
            value: resp.data.url
          });
          resolve(resp);
        })
        .catch(err => {
          commit(USER_ERROR);
          reject(err);
        });
    });
  },
  [USER_SET_PARAMS]: ({
    commit,
    dispatch,
  }, {
    user
  }) => {
    for (const k in user) {
      if (user.hasOwnProperty(k)) {
        let value = user[k];
        commit(USER_SET_PARAM, {
          type: k,
          value: value,
        });
      }
    }
    dispatch(USER_SAVE_TO_LOCAL_STORAGE, {
      user: user
    });

  },
  [USER_SET_PARAM]: ({
    commit,
    dispatch
  }, {
    type,
    value
  }) => {
    commit(USER_SET_PARAM, {
      type: type,
      value: value,
    });
    let user = {};
    user[type] = value;
    dispatch(USER_SAVE_TO_LOCAL_STORAGE, {
      user: user
    });
  },

};