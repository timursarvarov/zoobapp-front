import { normalize } from 'normalizr';
import axios from 'axios';
import {
    PATIENT_CREATE,
    PATIENT_REQUEST,
    PATIENT_ERROR,
    PATIENT_SUCCESS,
    PATIENT_GET,
    PATIENT_SET_PARAM,
    PATIENT_SET_PARAMS,
    PATIENT_SUB_PARAM_DELETE,
    PATIENT_AVATAR_UPLOAD,
    PATIENT_UPDATE,
    PATIENT_UNSET,
    PATIENT_CREATE_NOTE,
    PATIENTS_UPDATE_PATIENT,
    PATIENT_ADD_SUB_PROP,
    PATIENT_DOWNLOAD_FILE,
    PATIENT_PLAN_SET,
    PATIENT_PLAN_DELETE,
    PATIENT_DELETE_PARAM,
    PATIENT_PLAN_EDIT,
    PATIENT_PLANS_GET,
    PATIENT_DIAGNOSE_SET,
    PATIENT_DIAGNOSE_UPDATE,
    PATIENT_PROCEDURE_UPDATE,
    PATIENT_PROCEDURE_SET,
    PATIENT_PROCEDURE_DELETE,
    PATIENT_TOGGLE_ITEM_VISIBILITY,
    PATIENT_ANAMNES_SET,
    PATIENT_ANAMNES_UPDATE,
    PATIENT_RESET,
    TEETH_INITIATION,
    PATIENT_SUB_PARAM_SET,
    PATIENT_INVOICE_SET,
    NRMLZ_PLANS,
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
            planIndex = state.patient.plans.findIndex(plan => plan.ID === planId);

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
        params,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.post(`/patients/${params.patientId}/plans/`,
                JSON.stringify({
                    name: params.planName,
                }))
            .then((resp) => {
                commit(PATIENT_SUCCESS);
                commit(PATIENT_PLAN_SET, resp.data);
                resolve(resp.data);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_PLANS_GET]: ({
        commit,
        dispatch,
    }, {
        patientId,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.get(`/patients/${patientId}/plans/`)
            .then((resp) => {
                let plans = [];
                if (resp.data) {
                    plans = resp.data.reverse();
                    const Nplans = [{
                            "id": "123",
                            "author": {
                                "id": "1",
                                "name": "Paul"
                            },
                            "title": "My awesome blog post",
                            "comments": [{
                                "id": "324",
                                "commenter": {
                                    "id": "2",
                                    "name": "Nicole"
                                }
                            }]
                        },
                        {
                            "id": "1233",
                            "author": {
                                "id": "1",
                                "name": "Paul"
                            },
                            "title": "My awesome blog post",
                            "comments": [{
                                "id": "324",
                                "commenter": {
                                    "id": "2",
                                    "name": "Nicole"
                                }
                            }]
                        },
                        {
                            "id": "1323",
                            "author": {
                                "id": "1",
                                "name": "Paul"
                            },
                            "title": "My awesome blog post",
                            "comments": [{
                                "id": "324",
                                "commenter": {
                                    "id": "2",
                                    "name": "Nicole"
                                }
                            }]
                        }
                    ];

                    const normalizedData = normalize(plans, NRMLZ_PLANS);
                    console.log(normalizedData);
                    console.log(Nplans);
                    console.log(plans);
                }
                dispatch(PATIENT_SET_PARAM, {
                    type: 'plans',
                    value: plans,
                });
                commit(PATIENT_SUCCESS);
                resolve(plans);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_PROCEDURE_SET]: ({
        commit,
    }, {
        procedure,
        planID,
        patientID,

    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.post(`/patients/${patientID}/plans/${planID}/procedures/`,
                JSON.stringify({
                    procedureID: procedure.procedureID,
                    teeth: procedure.teeth,
                }))
            .then((resp) => {
                const nProcedure = resp.data;
                commit(PATIENT_PROCEDURE_SET, { procedure: nProcedure, planID });
                commit(PATIENT_SUCCESS);
                resolve(nProcedure);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_PROCEDURE_DELETE]: ({
        commit,
    }, {
        procedureID,
        planID,
        patientID,

    }) => new Promise((resolve, reject) => {
        commit(PATIENT_SUB_PARAM_DELETE, {
            param: 'plans',
            subParam: 'procedures',
            paramID: planID,
            subParamID: procedureID,
        });
    }).then((resp) => {
        commit(PATIENT_SUCCESS);
        resolve(true);
        // });
        // commit(PATIENT_REQUEST);
        // axios.delete(`/patients/${patientID}/plans/${planID}/procedures/${procedureID}`)
        //     .then((resp) => {
        //         commit(PATIENT_SUB_PARAM_DELETE, {
        //             param: 'plans',
        //             subParam: 'procedures',
        //             paramID: planID,
        //             subParamID: procedureID,
        //         });
        //         commit(PATIENT_SUCCESS);
        //         resolve(resp.data);
        //     })
        //     .catch((err) => {
        //         commit(PATIENT_ERROR);
        //         reject(err);
        //     });
    }).catch((err) => {
        commit(PATIENT_ERROR);
        console.log(err);
    }),
    [PATIENT_PLAN_DELETE]: ({
        commit,
    }, {
        params,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.delete(`/patients/${params.patientId}/plans/${params.planID}/`)
            .then((resp) => {
                commit(PATIENT_DELETE_PARAM, {
                    type: 'plans',
                    ID: params.planID,
                });
                commit(PATIENT_SUCCESS);
                resolve(resp.data);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
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
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_SUB_PARAM_SET, params);
        resolve(true);
    }).catch(err => console.log(err)),
    [PATIENT_INVOICE_SET]: ({
        commit,
    }, {
        invoice,
    }) => new Promise((resolve, reject) => {
        const newInvoice = {
            ...invoice,
            ID: Math.random(),
        };
        commit(PATIENT_INVOICE_SET, newInvoice);
        resolve(newInvoice);
    }).catch(err => console.log(err)),

    [PATIENT_PLAN_EDIT]: ({
        commit,
        state,
    }, {
        planId,
        key,
        value,
    }) => {
        const pIndex = state.patient.plans.findIndex(pplan => pplan.ID === planId);
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
            planIndex = state.patient.plans.findIndex(plan => plan.ID === planId);
            if (planIndex > -1) {
                procedureIndex = state.patient.plans[planIndex].procedures.findIndex(item => item.id === procedure.id);
            }
            commit(PATIENT_PROCEDURE_UPDATE, {
                procedureIndex,
                planIndex,
                procedure,
                planId,
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
        Object.keys(patient).forEach((field) => {
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
        dispatch(PATIENT_UNSET);
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
    [PATIENT_UNSET]: ({
        commit,
        state,
    }) => {
        Object.keys(state.patient).forEach((field) => {
            let value = null;
            if (state.patient[field] !== null && Array.isArray(state.patient[field])) {
                value = [];
            }
            commit(PATIENT_SET_PARAM, {
                type: field,
                value,
            });
        });
    },
};