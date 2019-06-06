/* eslint-disable */
import {
    CLINICS_REQUEST,
    CLINICS_ERROR,
    CLINICS_SUCCESS,
    CLINICS_CREATE,
    CLINICS_SET,
} from '@/constants';

import axios from 'axios';
export default {
    [CLINICS_CREATE]: ({
        commit,
        dispatch
    }, {
        clinic
    }) => {
        return new Promise((resolve, reject) => {
            commit(CLINICS_REQUEST);
            axios.put('/organization/',
                    JSON.stringify({
                        name: clinic.name,
                        description: clinic.description,
                    })
                )
                .then(resp => {
                    commit(CLINICS_SUCCESS);
                    resolve(resp);
                })
                .catch(err => {
                    commit(CLINICS_ERROR);
                    reject(err);
                });
        });
    },
    [CLINICS_SET]: ({
        commit,
    }, {
        clinics
    }) => {
        console.log(clinics)
        commit(CLINICS_SET, clinics);
    },
};