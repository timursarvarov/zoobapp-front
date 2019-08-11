import axios from 'axios';
import {
    USER_ERROR,
    USER_SUCCESS,
    USER_REQUEST,
    USER_AVATAR_UPLOAD,
    USER_INITIAL,
    USER_UPDATE,
    USER_SET_PARAM,
    USER_LOGOUT,
    USER_REGISTER,
    USER_PROP_SET,
    LOCAL_STORAGE,

} from '@/constants';


export default {
    [USER_UPDATE]: ({
        commit,
    }, {
        user,
    }) => {
        const fields = {};

        Object.keys(user).forEach((key) => {
            if (key !== 'userName') {
                // eslint-disable-next-line no-restricted-globals
                fields[key] = !isNaN(user[key]) ? parseInt(user[key], 10) : user[key];
                if (fields.password) {
                    fields.password = `${fields.password}`;
                    fields.password_new = `${fields.password_new}`;
                }
            }
        });
        return new Promise((resolve, reject) => {
            commit(USER_REQUEST);
            axios.post('/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Account.Edit',
                        params: {
                            ...fields,
                        },
                        id: 1,
                    }))
                .then((resp) => {
                    if (resp.data.error) {
                        commit(USER_ERROR);
                        reject(resp.data.error);
                    }
                    commit(USER_SUCCESS);
                    Object.keys(resp.data.result).forEach((key) => {
                        commit(USER_PROP_SET, {
                            propKey: key,
                            propValue: resp.data.result[key],
                        });
                        localStorage.setItem(LOCAL_STORAGE.user[key], resp.data.result[key]);
                    });
                    resolve(resp.data.result);
                })
                .catch((err) => {
                    commit(USER_ERROR);
                    reject(err);
                });
        });
    },
    [USER_REQUEST]: ({
        commit,
    }) => new Promise((resolve, reject) => {
        commit(USER_REQUEST);
        axios.post('/', JSON.stringify({
                jsonrpc: '2.0',
                method: 'Account.Get',
                id: 1,
            }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(USER_ERROR);
                    reject(resp.data.error);
                }
                commit(USER_SUCCESS);
                Object.keys(resp.data.result).forEach((key) => {
                    commit(USER_PROP_SET, {
                        propKey: key,
                        propValue: resp.data.result[key],
                    });
                    localStorage.setItem(LOCAL_STORAGE.user[key], resp.data.result[key]);
                });
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(USER_ERROR);
                reject(err);
            });
    }),
    [USER_LOGOUT]: ({
        commit,
        state,
    }) => {
        Object.keys(state.profile).forEach((key) => {
            console.log(key);
            commit(USER_PROP_SET, {
                propKey: key,
                propValue: null,
            });
            localStorage.removeItem(LOCAL_STORAGE.user[key]);
        });
        commit(USER_LOGOUT);
    },
    [USER_INITIAL]: ({
        dispatch,
        commit,
        state,
    }) => {
        const USER_NAME = localStorage.getItem('USER_NAME');
        if (USER_NAME) {
            Object.keys(state.profile).forEach((key) => {
                commit(USER_PROP_SET, {
                    propKey: key,
                    propValue: localStorage.getItem(LOCAL_STORAGE.user[key]),
                });
            });
        } else {
            dispatch(USER_REQUEST);
        }
    },
    [USER_REGISTER]: ({
        commit,
    }, {
        params,
    }) => new Promise((resolve, reject) => {
        commit(USER_REQUEST);
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Auth.Registration',
                    params: {
                        username: params.username,
                        firstName: params.firstName,
                        lastName: params.lastName,
                        password: params.password,
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(USER_ERROR);
                    reject(resp.data.error);
                }
                commit(USER_SUCCESS);
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(USER_ERROR);
                reject(err);
            });
    }),
    [USER_AVATAR_UPLOAD]: ({
        commit,
    }, {
        fd,
    }) => new Promise((resolve, reject) => {
        commit(USER_REQUEST);
        axios.post('/account/photo/',
                fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
            .then((resp) => {
                commit(USER_SUCCESS);
                commit(USER_PROP_SET, {
                    propKey: 'avatar',
                    propValue: resp.data.url,
                });
                localStorage.setItem(LOCAL_STORAGE.user.avatar, resp.data.result);
                resolve(resp);
            })
            .catch((err) => {
                commit(USER_ERROR);
                reject(err);
            });
    }),
    [USER_SET_PARAM]: ({
        commit,
    }, {
        type,
        value,
    }) => {
        if (type === 'lang' && !value) return;
        commit(USER_PROP_SET, {
            propKey: type,
            propValue: value,
        });
        localStorage.setItem(LOCAL_STORAGE.user[type], value);
    },

};
