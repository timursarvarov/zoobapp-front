/* eslint-disable indent */
/* eslint-disable max-len */
import { LAST_PATIENT_SET, LAST_PATIENT_UNSET, LAST_PATIENT_PARAM_PUSH } from '@/constants';
import { throwError } from 'rxjs';

export default {
    [LAST_PATIENT_SET]: ({ commit }, { patient }) =>
        new Promise(resolve => {
            const lastPatient = {
                status: patient.status,
                ID: patient.ID,
                firstName: patient.firstName,
                lastName: patient.lastName,
                avatar: patient.avatar,
                allergy: patient.allergy
            };
            commit(LAST_PATIENT_PARAM_PUSH, {
                paramName: 'lastPatient',
                paramKey: lastPatient,
                paramValue: lastPatient
            });
            resolve();
        }).catch(err => {
            throwError(err);
        }),
    [LAST_PATIENT_UNSET]: ({ commit }) =>
        new Promise(resolve => {
            commit(LAST_PATIENT_PARAM_PUSH, {
                paramName: 'lastPatient',
                paramValue: {}
            });
            resolve();
        }).catch(err => {
            throwError(err);
        })
};
