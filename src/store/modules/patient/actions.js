/* eslint-disable no-tabs */

import axios from 'axios';
import {
    PATIENT_CREATE,
    PATIENT_REQUEST,
    PATIENT_ERROR,
    PATIENT_SUCCESS,
    PATIENT_GET,
    PATIENT_SET_PARAM,
    PATIENT_SET_PARAMS,
    PATIENT_AVATAR_UPLOAD,
    PATIENT_UPDATE,
    PATIENT_CREATE_NOTE,
    PATIENTS_UPDATE_PATIENT,
    PATIENT_ADD_SUB_PROP,
    PATIENT_DOWNLOAD_FILE,
    PATIENT_PLAN_SET,
    PATIENT_PLAN_DELETE,
    PATIENT_PLAN_EDIT,
    PATIENT_DIAGNOSE_SET,
    PATIENT_DIAGNOSE_UPDATE,
    PATIENT_PROCEDURE_UPDATE,
    PATIENT_TOGGLE_ITEM_VISIBILITY,
    PATIENT_PROCEDURES_SET,
    PATIENT_ANAMNES_SET,
    PATIENT_ANAMNES_UPDATE,
    PATIENT_RESET,
    TEETH_INITIATION,
    PATIENT_SUB_PARAM_SET,
} from '@/constants';

export default {
    [PATIENT_AVATAR_UPLOAD]: ({
        commit,
        state,
        dispatch,
    }, {
        patient,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.post(`/patients/${patient.ID}/photo/`,
                patient.fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
            .then((resp) => {
                commit(PATIENT_SUCCESS);
                dispatch(PATIENT_SET_PARAM, {
                    type: 'avatar',
                    value: resp.data.url,
                });
                const { patient1 } = state;
                dispatch(PATIENT_SET_PARAMS, {
                    patient: patient1,
                });
                resolve(resp);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_UPDATE]: ({
        commit,
        dispatch,
    }, {
        patient,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.put(`/patients/${patient.ID}/`,
                JSON.stringify({
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    email: patient.email,
                    phone: parseInt(patient.phone, 10),
                    address: patient.address,
                    allergy: patient.allergy,
                    source: patient.source,
                    color: patient.color,
                    rating: parseInt(patient.rating, 10),
                }))
            .then((resp) => {
                commit(PATIENT_SUCCESS);
                dispatch(PATIENT_SET_PARAMS, {
                    patient: resp.data,
                });
                resolve(resp);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_CREATE_NOTE]: ({
        commit,
        state,
        dispatch,
    }, {
        params,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.post(`/patients/${params.patientId}/notes/`,
                JSON.stringify({
                    note: params.note,
                }))
            .then((resp) => {
                commit(PATIENT_SUCCESS);
                const { notes } = state.patient;
                notes.unshift(resp.data);
                dispatch(PATIENT_SET_PARAM, {
                    type: 'notes',
                    value: notes,
                });
                resolve(resp);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_DOWNLOAD_FILE]: ({
        params,
    }) => new Promise((resolve, reject) => {
        axios({
                url: params.url,
                method: 'GET',
                responseType: 'blob', // important
            })
            .then((resp) => {
                resolve(resp);
            })
            .catch((err) => {
                reject(err);
            });
    }),
    [PATIENT_TOGGLE_ITEM_VISIBILITY]: ({
        state,
        commit,
    }, {
        params,
    }) => {
        const { itemId, type, planId } = params;
        let itemIndex = -1;
        let planIndex = -1;
        if (planId && type === 'procedures') {
            planIndex = state.patient.plans.findIndex(plan => plan.id === planId);

            if (planIndex > -1) {
                itemIndex = state.patient.plans[planIndex].procedures.findIndex(item => item.id === itemId);
            }
        } else {
            itemIndex = state.patient[type].findIndex(item => item.id === itemId);
        }
        commit(PATIENT_TOGGLE_ITEM_VISIBILITY, {
            params: {
                itemIndex,
                type,
                planIndex,
            },
        });
    },
    [PATIENT_ADD_SUB_PROP]: ({
        state,
        dispatch,
    }, {
        params,
    }) => {
        const { propName, value } = params;
        const props = state.patient[propName];
        props.unshift(value);
        dispatch(PATIENT_SET_PARAM, {
            type: propName,
            value: props,
        });
    },
    [PATIENT_RESET]: ({
        commit,
        state,
    }) => {
        Object.keys(state.patient).forEach((key) => {
            commit(PATIENT_SET_PARAM, {
                type: key,
                value: null,
            });
        });
    },
    [PATIENT_CREATE]: ({
        commit,
    }, {
        patient,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.post('/patients/',
                JSON.stringify({
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    phone: patient.phone,
                    email: patient.email,
                    allergy: patient.allergy,
                    source: patient.source,
                    color: patient.color,
                }))
            .then((resp) => {
                commit(PATIENT_SUCCESS);
                resolve(resp);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),

    [PATIENT_PLAN_SET]: ({
        commit,
    }, {
        plan,
    }) => {
        commit(PATIENT_PLAN_SET, plan);
    },

    [PATIENT_PROCEDURES_SET]: ({
        commit,
        state,
    }, {
        procedure,
        planId,
    }) => {
        const pIndex = state.patient.plans.findIndex(plan => plan.id === planId);
        commit(PATIENT_PROCEDURES_SET, { procedure, pIndex });
    },
    [PATIENT_PLAN_DELETE]: ({
        commit,
        state,
    }, {
        plan,
    }) => {
        const pIndex = state.patient.plans.findIndex(pplan => pplan.id === plan.id);
        if (pIndex !== -1) {
            commit(PATIENT_PLAN_DELETE, { pIndex, plan });
        }
    },

    [PATIENT_DIAGNOSE_SET]: ({
        commit,
    }, {
        diagnose,
    }) => {
        commit(PATIENT_DIAGNOSE_SET, diagnose);
    },
    [PATIENT_ANAMNES_SET]: ({
        commit,
    }, {
        anamnes,
    }) => {
        commit(PATIENT_ANAMNES_SET, anamnes);
    },
    [PATIENT_SUB_PARAM_SET]: ({
        commit,
    }, {
        params,
    }) => {
        commit(PATIENT_SUB_PARAM_SET, params);
    },

    [PATIENT_PLAN_EDIT]: ({
        commit,
        state,
    }, {
        planId,
        key,
        value,
    }) => {
        const pIndex = state.patient.plans.findIndex(pplan => pplan.id === planId);
        if (pIndex !== -1) {
            commit(PATIENT_PLAN_EDIT, { pIndex, key, value });
        }
    },

    [PATIENT_PROCEDURE_UPDATE]: ({
        commit,
        state,
    }, {
        params,
    }) => {
        const { procedure, planId } = params;
        let procedureIndex = -1;
        let planIndex = -1;
        if (planId) {
            planIndex = state.patient.plans.findIndex(plan => plan.id === planId);
            if (planIndex > -1) {
                procedureIndex = state.patient.plans[planIndex].procedures.findIndex(item => item.id === procedure.id);
            }
            commit(PATIENT_PROCEDURE_UPDATE, {
                procedureIndex,
                planIndex,
                procedure,
            });
        }
    },

    [PATIENT_DIAGNOSE_UPDATE]: ({
        commit,
        state,
    }, {
        diagnose,
    }) => {
        const dIndex = state.patient.diagnosis.findIndex(pDiagnose => pDiagnose.id === diagnose.id);
        if (dIndex !== -1) {
            commit(PATIENT_DIAGNOSE_UPDATE, { dIndex, diagnose });
        }
    },
    [PATIENT_ANAMNES_UPDATE]: ({
        commit,
        state,
    }, {
        anamnes,
    }) => {
        const aIndex = state.patient.anamnesis.findIndex(pAnamnes => pAnamnes.id === anamnes.id);
        if (aIndex !== -1) {
            commit(PATIENT_ANAMNES_UPDATE, { aIndex, anamnes });
        }
    },

    [PATIENT_SET_PARAM]: ({
        commit,
    }, {
        type,
        value,
    }) => {
        commit(PATIENT_SET_PARAM, {
            type,
            value,
        });
    },
    [PATIENT_SET_PARAMS]: ({
        commit,
        dispatch,
    }, {
        patient,
    }) => {
        Object.keys(patient).map((field) => {
            let value = patient[field];
            if (value === null) {
                if (field === 'allergy' ||
                    field === 'notes' ||
                    field === 'diagnosis' ||
                    field === 'anamnesis' ||
                    field === 'files' ||
                    field === 'plans'
                ) {
                    value = [];
                }
            }
            commit(PATIENT_SET_PARAM, {
                type: field,
                value,
            });
        });
        // ! убрать после выпуска в backend
        commit(PATIENT_SET_PARAM, {
            type: 'plans',
            value: [],
        });
        commit(PATIENT_SET_PARAM, {
            type: 'diagnosis',
            value: [],
        });
        commit(PATIENT_SET_PARAM, {
            type: 'anamnesis',
            value: [],
        });
        dispatch(PATIENTS_UPDATE_PATIENT, {
            patient,
        });
        dispatch(TEETH_INITIATION, { patient });
    },
    [PATIENT_GET]: ({
        commit,
        dispatch,
    }, {
        patientId,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.get(`/patients/${patientId}/`)
            .then((resp) => {
                dispatch(PATIENT_SET_PARAMS, {
                    patient: resp.data,
                });
                commit(PATIENT_SUCCESS);
                resolve(resp.data);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
};