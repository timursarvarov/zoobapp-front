/* eslint-disable */
import axios from 'axios';
import {
    PATIENTS_REQUEST,
    PATIENTS_ERROR,
    PATIENTS_SUCCESS,
    PATIENTS_SET,
    PATIENTS_UPDATE_PATIENT,
    PATIENTS_RESET,
} from '@/constants';

const CancelToken = axios.CancelToken;
let cancel;

export default {


    [PATIENTS_REQUEST]: ({
        commit
    }, {
        params
    }) => {
        return new Promise((resolve, reject) => {
            if (cancel) { cancel(); }
            commit(PATIENTS_REQUEST);
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
                    if (params.toStore) {
                        commit(PATIENTS_SET, resp);
                    }
                    resolve(resp);
                })
                .catch(err => {
                    commit(PATIENTS_ERROR);
                    reject(err);
                });
        });

    },
    [PATIENTS_UPDATE_PATIENT]: ({
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
            commit(PATIENTS_UPDATE_PATIENT, payload);
        }
    },
    [PATIENTS_RESET]: ({
        commit,
        state,
    }) => {
        commit(PATIENTS_RESET);
    },
};