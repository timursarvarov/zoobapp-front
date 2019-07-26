/* eslint-disable */
import axios from 'axios';
import {
    PATIENTS_REQUEST,
    PATIENTS_ERROR,
    PATIENTS_SUCCESS,
    PATIENTS_SET,
    PATIENTS_PATIENT_UPDATE,
    PATIENTS_PATIENT_ADD,
    PATIENTS_RESET,
    LOADER_SWITCH_OFF,
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
            commit(PATIENTS_REQUEST);
            dispatch(LOADER_SWITCH_OFF)
            axios.get('/patients/', {
                    params: {
                        perPage: parseInt(params.perPage, 10),
                        page: parseInt(params.page, 10),
                        order: params.order,
                        orderBy: params.orderBy,
                        search: params.search,
                    },
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a
                        cancel = c;
                    })
                }).then(resp => {
                    commit(PATIENTS_SUCCESS);
                    const patients = resp.data || []
                    if (params.toStore) {
                        commit(PATIENTS_SET, patients);
                    }
                    resolve(patients);
                })
                .catch(err => {
                    commit(PATIENTS_ERROR);
                    reject(err);
                });
        });

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
        commit(PATIENTS_RESET);
    },
};