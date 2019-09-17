/* eslint-disable */
import axios from 'axios';
import {
    PATIENTS_REQUEST,
    PATIENTS_PATIENT_UPDATE,
    PATIENTS_PATIENT_ADD,
    PATIENTS_RESET,
    LOADER_SWITCH_OFF,
    PATIENTS_SET_PROP,
} from '@/constants';

const CancelToken = axios.CancelToken;
let cancel;

export default {


    [PATIENTS_REQUEST]: ({
        commit,
        dispatch
    }, {
        params
    }) => {
        return new Promise((resolve, reject) => {
            if (cancel) { cancel(); }
            commit(PATIENTS_SET_PROP, { propName: 'status', propValue: 'loading' });
            // dispatch(LOADER_SWITCH_OFF)
            axios.post('/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Patients.Get',
                        params: {
                            perPage: parseInt(params.perPage, 10),
                            page: parseInt(params.page, 10),
                            order: params.order,
                            orderBy: params.orderBy,
                            search: params.search,
                        },
                        id: 1
                    }), {
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function receives a cancel function as a
                            cancel = c;
                        })
                    }
                ).then(resp => {
                    if(resp.data.error){
                        commit(PATIENTS_SET_PROP, { propName: 'status', propValue: 'error' });
                        reject(resp.data.error);
                    }
                    commit(PATIENTS_SET_PROP, { propName: 'status', propValue: 'success' });
                    const patients = resp.data.result.patients || []
                    if (params.toStore) {
                        commit(PATIENTS_SET_PROP, { propName: 'patients', propValue: patients });
                        commit(PATIENTS_SET_PROP, { propName: 'patientsNum', propValue: resp.data.result.patientsNum });
                    }
                    resolve(resp.data.result);
                })
                .catch(err => {
                    commit(PATIENTS_SET_PROP, { propName: 'status', propValue: 'error' });
                    reject(err);
                });
        });
        // return new Promise((resolve, reject) => {
        //     if (cancel) { cancel(); }
        //     commit(PATIENTS_SET_PROP, { propName: 'status', propValue: 'loading' });
        //     // dispatch(LOADER_SWITCH_OFF)
        //     axios.post('/',
        //             JSON.stringify({
        //                 jsonrpc: '2.0',
        //                 method: 'Patients.Get',
        //                 params: {
        //                     perPage: parseInt(params.perPage, 10),
        //                     page: parseInt(params.page, 10),
        //                     order: params.order,
        //                     orderBy: params.orderBy,
        //                     search: params.search,
        //                 },
        //                 id: 1
        //             }), {
        //                 cancelToken: new CancelToken(function executor(c) {
        //                     // An executor function receives a cancel function as a
        //                     cancel = c;
        //                 })
        //             }
        //         ).then(resp => {
        //             commit(PATIENTS_SET_PROP, { propName: 'status', propValue: 'success' });
        //             const patients = resp.data.result.patients || []
        //             if (params.toStore) {
        //                 commit(PATIENTS_SET_PROP, { propName: 'patients', propValue: patients });
        //                 commit(PATIENTS_SET_PROP, { propName: 'patientsNum', propValue: resp.data.result.patientsNum });
        //             }
        //             resolve(resp.data.result);
        //         })
        //         .catch(err => {
        //             commit(PATIENTS_SET_PROP, { propName: 'status', propValue: 'error' });
        //             reject(err);
        //         });
        // });

    },
    [PATIENTS_PATIENT_UPDATE]: ({
        commit,
        state
    }, {
        patient
    }) => {
        if (state.patients.length > 0) {
            const index = state.patients.findIndex(function(e) {
                return e.ID === patient.ID;
            });
            if (index === -1) return;
            const payload = {
                index: index,
                patient: patient
            };
            commit(PATIENTS_PATIENT_UPDATE, payload);
        }
    },
    [PATIENTS_PATIENT_ADD]: ({
        commit,
    }, {
        patient
    }) => {
        const patientN = patient;
        patientN['justAdded'] = true;
        commit(PATIENTS_PATIENT_ADD, patientN);
    },
    [PATIENTS_RESET]: ({
        commit,
        state,
    }) => {
        commit(PATIENTS_SET_PROP, { propName: 'patients', propValue: [] });
    },
};
