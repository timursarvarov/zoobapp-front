/* eslint-disable */
import {
    AUTH_SET_PROP,
    AUTH_REQUEST,
    AUTH_LOGOUT,
    AUTH_LOCK,
    AUTH_REFRESH_TOKEN,
    AUTH_DECODE_TOKEN,
    USER_REQUEST,
    USER_LOGOUT,
    AUTH_INIT,
    CLINIC_SET_PROPS,
    CLINICS_PROP_SET,
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
            commit(AUTH_SET_PROP, { propName: 'status', propValue: 'loading' });
            axios.post('/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Auth.Authentication',
                        params: {
                            username: username,
                            password: password
                        },
                        id: 1
                    })
                )
                .then(resp => {
                    if (resp.data.error) {
                        commit(AUTH_SET_PROP, { propName: 'status', propValue: 'error' });
                        reject(resp.data.error)
                    }
                    axios.defaults.headers.common.Authorization = 'Bearer ' + resp.data.result.accessToken;
                    commit(AUTH_SET_PROP, { propName: 'status', propValue: 'success' });
                    commit(AUTH_SET_PROP, { propName: 'hasLoadedOnce', propValue: true });
                    if (resp.data.result.accessToken) commit(AUTH_SET_PROP, { propName: 'accessToken', propValue: resp.data.result.accessToken });
                    localStorage.setItem('accessToken', resp.data.result.accessToken);
                    localStorage.setItem('expiresAt', resp.data.result.expiresAt);
                    localStorage.setItem('refreshToken', resp.data.result.refreshToken);
                    axios.defaults.headers.common.Authorization = 'Bearer ' + resp.data.result.accessToken;
                    dispatch(CLINICS_PROP_SET, { clinics: resp.data.result.organizations });
                    resolve(resp.data.result);
                })
                .catch(err => {
                    console.log(err)
                    commit(AUTH_SET_PROP, { propName: 'status', propValue: 'error' });
                    commit(AUTH_SET_PROP, { propName: 'hasLoadedOnce', propValue: true });
                    localStorage.removeItem('accessToken');
                    reject(err);
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
            commit(AUTH_SET_PROP, { propName: 'status', propValue: 'loading' });
            axios.post('/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Auth.RefreshToken',
                        params: {
                            organizationID: parseInt(clinicId, 10),
                            refreshToken: refreshToken
                        },
                        id: 1
                    })
                )
                .then(resp => {
                    if (resp.data.error) {
                        commit(AUTH_SET_PROP, { propName: 'status', propValue: 'error' });
                        commit(AUTH_SET_PROP, { propName: 'hasLoadedOnce', propValue: true });
                        commit(AUTH_SET_PROP, { propName: 'hasRefreshTokenError', propValue: true });
                        // dispatch(USER_LOGOUT);
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        reject(resp.data.error)
                    }
                    localStorage.setItem('accessToken', resp.data.result.accessToken);
                    localStorage.setItem('expiresAt', resp.data.result.expiresAt);
                    axios.defaults.headers.common.Authorization = 'Bearer ' + resp.data.result.accessToken;
                    commit(AUTH_SET_PROP, { propName: 'status', propValue: 'success' });
                    commit(AUTH_SET_PROP, { propName: 'hasLoadedOnce', propValue: true });
                    if (resp.data.result.accessToken) commit(AUTH_SET_PROP, { propName: 'accessToken', propValue: resp.data.result.accessToken });
                    dispatch(AUTH_DECODE_TOKEN);
                    resolve(resp.data.result);
                })
                .catch(err => {
                    commit(AUTH_SET_PROP, { propName: 'status', propValue: 'error' });
                    commit(AUTH_SET_PROP, { propName: 'hasLoadedOnce', propValue: true });
                    commit(AUTH_SET_PROP, { propName: 'hasRefreshTokenError', propValue: true });
                    // dispatch(USER_LOGOUT);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    reject(err);
                });
        })
    },

    [AUTH_INIT]: ({
        dispatch,
    }) => {
        dispatch(USER_INITIAL);
        const clinics = JSON.parse(localStorage.getItem('CLINICS'));
        if (clinics) {
            dispatch(CLINICS_PROP_SET, { clinics });
        }
        dispatch(AUTH_DECODE_TOKEN);
        dispatch(TEETH_INITIATION_ETHALON);

    },

    [AUTH_LOGOUT]: ({
        commit,
        dispatch
    }) => {
        return new Promise((resolve, reject) => {
            dispatch(USER_LOGOUT);
            commit(AUTH_SET_PROP, { propName: 'accessToken', propValue: '' });
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
        dispatch,
    }) => {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('expiresAt');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            commit(AUTH_SET_PROP, { propName: 'accessToken', propValue: '' });
            resolve();
        });
    },
};