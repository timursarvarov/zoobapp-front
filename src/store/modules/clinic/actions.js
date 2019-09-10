/* eslint-disable indent */
import axios from 'axios';
import filterItems from '@/plugins/items-groupelizer';
import {
    CLINIC_SET_PROPS,
    CLINIC_SET_PROP,
    CLINIC_LOGO_UPLOAD,
    CLINIC_UPDATE,
    CLINIC_DIAGNOSIS_GET,
    CLINIC_PROCEDURES_GET,
    CLINIC_MANIPULATIONS_GET,
    CLINIC_AUTH_REQUEST,
    AUTH_DECODE_TOKEN,
    // AUTH_SUCCESS,
    AUTH_REFRESH_TOKEN,
    USER_REQUEST,
    PATIENT_UNSET
} from '@/constants';

export default {
    [CLINIC_UPDATE]: ({ commit, dispatch }, { clinic }) => {
        const fields = {};
        for (const key in clinic) {
            if (clinic.hasOwnProperty(key)) {
                fields[key] = !isNaN(clinic[key]) ? parseInt(clinic[key], 10) : clinic[key];
            }
        }
        return new Promise((resolve, reject) => {
            commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'loading' });
            axios
                .post(
                    '/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Organizations.Edit',
                        params: {
                            name: 'My Organization',
                            description: 'My dental clinic'
                        },
                        id: 1
                    })
                )
                .then(resp => {
                    console.log(resp);
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'success' });
                    dispatch(AUTH_REFRESH_TOKEN);
                    resolve(resp);
                })
                .catch(err => {
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                    reject(err);
                });
        });
    },
    [CLINIC_AUTH_REQUEST]: ({ commit, dispatch }, { clinicId, accessToken }) => {
        if (accessToken) {
            return new Promise((resolve, reject) => {
                commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'loading' });
                axios
                    .post(
                        '/',
                        JSON.stringify({
                            jsonrpc: '2.0',
                            method: 'Auth.Organization',
                            params: {
                                organizationID: parseInt(clinicId, 10)
                            },
                            id: 1
                        })
                    )
                    .then(resp => {
                        if (resp.data.error) {
                            commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('expiresAt');
                            localStorage.removeItem('refreshToken');
                            commit(CLINIC_SET_PROP, { propName: 'isRefreshing', propValue: false });
                            reject(resp.data.error);
                        }
                        axios.defaults.headers.common.Authorization = `Bearer ${resp.data.result.accessToken}`;
                        localStorage.setItem('accessToken', resp.data.result.accessToken);
                        localStorage.setItem('expiresAt', resp.data.result.expiresAt);
                        // dispatch(AUTH_SUCCESS, { result: resp.data.result });
                        dispatch(AUTH_DECODE_TOKEN);
                        dispatch(USER_REQUEST);
                        dispatch(PATIENT_UNSET);
                        commit(CLINIC_SET_PROP, { propName: 'isRefreshing', propValue: false });
                        resolve(resp.data.result);
                    })
                    .catch(err => {
                        if (err) {
                            reject(err);
                            reject(err);
                        }
                        commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('expiresAt');
                        localStorage.removeItem('refreshToken');
                    });
            });
        }
    },
    [CLINIC_SET_PROPS]: ({ commit }, { organization }) => {
        Object.keys(organization).forEach(key => {
            commit(CLINIC_SET_PROP, { propName: key, propValue: organization[key] });
        });
        localStorage.setItem('CLINIC_ID', organization.ID);
        localStorage.setItem('CLINIC_NAME', organization.name);
        localStorage.setItem('CLINIC_DESCRIPTION', organization.description);
        localStorage.setItem('CLINIC_LOGO', organization.logo);
        localStorage.setItem('CLINIC_PHONE', organization.phone);
        localStorage.setItem('CLINIC_EMAIL', organization.email);
        localStorage.setItem('CLINIC_URL', organization.url);
        localStorage.setItem('CLINIC_ADDRESS', organization.address);
        localStorage.setItem('CLINIC_TIMEZONE_OFFSET', organization.timezoneOffset);
        localStorage.setItem('CLINIC_CURRENCY_CODE', organization.currencyCode);
        localStorage.setItem('CLINIC_TEETH_SYSTEM', organization.teethSystem);
    },
    [CLINIC_LOGO_UPLOAD]: ({ commit, dispatch }, { fd }) =>
        new Promise((resolve, reject) => {
            commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'loading' });
            axios
                .post('/organization/logo/', fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(resp => {
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'success' });
                    dispatch(AUTH_REFRESH_TOKEN);
                    resolve(resp);
                })
                .catch(err => {
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                    reject(err);
                });
        }),
    [CLINIC_DIAGNOSIS_GET]: ({ commit }) =>
        new Promise((resolve, reject) => {
            commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'loading' });
            axios
                .post(
                    '/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Organizations.GetDiagnoses',
                        id: 1
                    })
                )
                .then(resp => {
                    if (resp.data.error) {
                        commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                        reject(resp.data.error);
                    }
                    commit(CLINIC_SET_PROP, { propName: 'diagnosis', propValue: filterItems(false, resp.data.result) });
                    commit(CLINIC_SET_PROP, { propName: 'ungroupeddiagnosis', propValue: resp.data.result });
                    commit(CLINIC_SET_PROP, { propName: 'ungroupeddiagnosis', propValue: filterItems('NoNeedGroupilized', resp.data.result) });
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'success' });
                    resolve(resp.data.result);
                })
                .catch(err => {
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                    reject(err);
                });
        }),
    [CLINIC_PROCEDURES_GET]: ({ commit, dispatch }) =>
        new Promise((resolve, reject) => {
            commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'loading' });
            dispatch(CLINIC_MANIPULATIONS_GET);
            axios
                .post(
                    '/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Organizations.GetProcedures',
                        id: 1
                    })
                )
                .then(resp => {
                    if (resp.data.error) {
                        commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                        reject(resp.data.error);
                    }
                    commit(CLINIC_SET_PROP, { propName: 'procedures', propValue: filterItems(false, resp.data.result) });
                    commit(CLINIC_SET_PROP, { propName: 'ungroupedprocedures', propValue: filterItems('NoNeedGroupilized', resp.data.result) });
                    commit(CLINIC_SET_PROP, { propName: 'ungroupedanamnesis', propValue: filterItems('NoNeedGroupilized', resp.data.result) });
                    commit(CLINIC_SET_PROP, { propName: 'ungroupedanamnesis', propValue: resp.data.result });
                    commit(CLINIC_SET_PROP, { propName: 'anamnesis', propValue: filterItems(false, resp.data.result) });
                    commit(CLINIC_SET_PROP, { propName: 'anamnesis', propValue: filterItems(false, resp.data.result) });
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'success' });
                    resolve(resp.data.result);
                })
                .catch(err => {
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                    reject(err);
                });
        }),
    [CLINIC_MANIPULATIONS_GET]: ({ commit }) =>
        new Promise((resolve, reject) => {
            commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'loading' });
            axios
                .post(
                    '/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Organizations.GetManipulations',
                        id: 1
                    })
                )
                .then(resp => {
                    if (resp.data.error) {
                        commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                        reject(resp.data.error);
                    }
                    commit(CLINIC_SET_PROP, { propName: 'manipulations', propValue: resp.data.result });
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'success' });
                    resolve(resp.data.result);
                })
                .catch(err => {
                    commit(CLINIC_SET_PROP, { propName: 'status', propValue: 'error' });
                    reject(err);
                });
        }),
    [CLINIC_SET_PROP]: ({ commit }, { props }) => {
        commit(CLINIC_SET_PROP, {
            propName: props.type,
            propValue: props.value
        });
    }
};
