/* eslint-disable */
import {
    AUTH_REQUEST,
    AUTH_ERROR,
    AUTH_SUCCESS,
    AUTH_LOGOUT,
    AUTH_LOCK,
    AUTH_REFRESH_ERROR,
    AUTH_REFRESH_TOKEN,
    AUTH_DECODE_TOKEN,
    USER_REQUEST,
    USER_LOGOUT,
    AUTH_INIT,
    CLINIC_SET_PROPS,
    CLINICS_SET,
    USER_SET_PARAM,
    USER_INITIAL,
    TEETH_INITIATION_ETHALON

} from '@/constants';

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
                    axios.defaults.headers.common.Authorization = 'Bearer ' + resp.data.accessToken;
                    dispatch(AUTH_SUCCESS, { resp });
                    localStorage.setItem('accessToken', resp.data.accessToken);
                    localStorage.setItem('expiresAt', resp.data.expiresAt);
                    localStorage.setItem('refreshToken', resp.data.refreshToken);
                    axios.defaults.headers.common.Authorization = 'Bearer ' + resp.data.accessToken;
                    // dispatch(USER_REQUEST);
                    dispatch(CLINICS_SET, { clinics: resp.data.organizations });
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
        const clinicId = localStorage.getItem('CLINIC_ID');
        if (!refreshToken) return;
        return new Promise((resolve, reject) => {
            commit(AUTH_REQUEST);
            axios.post(`/auth/refreshToken/${clinicId}/`,
                    JSON.stringify({
                        refreshToken: refreshToken,
                    })
                )
                .then(resp => {
                    localStorage.setItem('accessToken', resp.data.accessToken);
                    localStorage.setItem('expiresAt', resp.data.expiresAt);
                    localStorage.setItem('refreshToken', resp.data.refreshToken);
                    // axios.defaults.headers.common.Authorization = 'Bearer ' + resp.data.accessToken;
                    dispatch(AUTH_SUCCESS, { resp });
                    dispatch(AUTH_DECODE_TOKEN);
                    resolve(resp.data.accessToken);
                })
                .catch(err => {
                    commit(AUTH_ERROR, err);
                    dispatch(AUTH_REFRESH_ERROR);
                    dispatch(USER_LOGOUT);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    reject(err);
                });
        })
    },

    [AUTH_SUCCESS]: ({
        commit,
    }, {
        resp
    }) => {
        if (resp.data) {
            commit(AUTH_SUCCESS, resp);
        }
    },
    [AUTH_INIT]: ({
        dispatch,
    }) => {
        dispatch(USER_INITIAL);
        const clinics = JSON.parse(localStorage.getItem('CLINICS'));
        if (clinics) {
            dispatch(CLINICS_SET, { clinics });
        }
        dispatch(AUTH_DECODE_TOKEN);
        dispatch(TEETH_INITIATION_ETHALON);

    },

    [AUTH_LOGOUT]: ({
        commit,
        dispatch
    }) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_LOGOUT);
            dispatch(USER_LOGOUT);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('expiresAt');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('USER_NAME');
            localStorage.removeItem('CLINICS');
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
        dispatch(CLINIC_SET_PROPS, { organization: decodedParms.organization });
        dispatch(USER_SET_PARAM, {
            type: 'ID',
            value: decodedParms.userID
        });

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
    [AUTH_REFRESH_ERROR]: ({
        commit,
    }) => {
        commit(AUTH_REFRESH_ERROR);
    },
};