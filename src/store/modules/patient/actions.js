import axios from 'axios';
import {
    PATIENT_CREATE,
    PATIENT_REQUEST,
    PATIENT_ERROR,
    PATIENT_SUCCESS,
    PATIENT_GET,
    PATIENT_PARAM_SET,
    PATIENT_PARAMS_SET,
    PATIENT_SUB_PARAM_DELETE,
    PATIENT_AVATAR_UPLOAD,
    PATIENT_UPDATE,
    PATIENT_UNSET,
    PATIENT_NOTE_CREATE,
    PATIENTS_PATIENT_UPDATE,
    PATIENT_ADD_SUB_PROP,
    PATIENT_FILE_DOWNLOAD,
    PATIENT_PLAN_SET,
    PATIENT_PLAN_DELETE,
    PATIENT_PLAN_EDIT,
    PATIENT_PLANS_GET,
    PATIENT_PARAM_DELETE,
    PATIENT_PARAM_PUSH,
    PATIENT_DIAGNOSE_SET,
    PATIENT_DIAGNOSE_UPDATE,
    PATIENT_PROCEDURE_UPDATE,
    PATIENT_PROCEDURE_SET,
    PATIENT_PROCEDURE_DELETE,
    PATIENT_ITEM_VISIBILITY_TOGGLE,
    PATIENT_ANAMNES_SET,
    PATIENT_ANAMNES_UPDATE,
    PATIENT_RESET,
    PATIENT_SUB_PARAM_SET,
    PATIENT_SUB_PARAMS_SET,
    PATIENT_SUB_PARAM_PUSH,
    PATIENT_INVOICE_SET,
    PATIENTS_PATIENT_ADD,
    PATIENT_MANIPULATION_SET,
    TEETH_INITIATION,
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
                dispatch(PATIENT_PARAM_SET, {
                    type: 'avatar',
                    value: resp.data.url,
                });
                const { patient1 } = state;
                dispatch(PATIENT_PARAMS_SET, {
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
                dispatch(PATIENT_PARAMS_SET, {
                    patient: resp.data,
                });
                resolve(resp);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_NOTE_CREATE]: ({
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
                dispatch(PATIENT_PARAM_SET, {
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
    [PATIENT_FILE_DOWNLOAD]: ({
        commit,
    }, {
        params,
    }) => new Promise((resolve, reject) => {
        axios({
                url: params.url,
                method: 'GET',
                responseType: 'blob', // important
            })
            .then((resp) => {
                commit(PATIENT_SUCCESS);
                resolve(resp);
            })
            .catch((err) => {
                reject(err);
                commit(PATIENT_ERROR);
            });
    }),
    [PATIENT_ITEM_VISIBILITY_TOGGLE]: ({
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
        commit(PATIENT_ITEM_VISIBILITY_TOGGLE, {
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
        dispatch(PATIENT_PARAM_SET, {
            type: propName,
            value: props,
        });
    },
    [PATIENT_RESET]: ({
        commit,
        state,
    }) => {
        Object.keys(state.patient).forEach((key) => {
            commit(PATIENT_PARAM_SET, {
                type: key,
                value: null,
            });
        });
    },
    [PATIENT_CREATE]: ({
        commit,
        dispatch,
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
                dispatch(PATIENTS_PATIENT_ADD, { patient: resp.data });
                resolve(resp);
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),

    [PATIENT_PLAN_SET]: ({
        commit,
        state,
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
                commit(PATIENT_PARAM_PUSH, {
                    param: 'plans',
                    value: resp.data,
                    key: state.patient.plans ? state.patient.plans.length : 0,
                });
                commit(PATIENT_PARAM_SET, { type: 'currentPlanID', value: resp.data.ID });
                // commit(PATIENT_PLAN_SET, resp.data);
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
                if (resp.data) {
                    Object.keys(resp.data).forEach((key) => {
                        dispatch(PATIENT_PARAM_SET, {
                            type: key,
                            value: resp.data[key],
                        });
                    });
                    commit(PATIENT_SUCCESS);
                    resolve(resp.data.plans);
                }
            })
            .catch((err) => {
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_PROCEDURE_SET]: ({
        commit,
        state,
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
                // commit(PATIENT_PROCEDURE_SET, { procedure: resp.data, planID });
                commit(PATIENT_SUCCESS);
                const procedureN = resp.data;
                procedureN.justAdded = true;
                const planIndex = state.patient.plans.findIndex(p => p.ID === planID);
                if (planIndex === -1) {
                    return;
                }
                commit(PATIENT_SUB_PARAM_PUSH, {
                    paramName: 'plans',
                    paramIndex: planIndex,
                    subParamName: 'procedures',
                    subParamIndex: state.patient.plans[planIndex].procedures ? state.patient.plans[planIndex].procedures.length : 0,
                    subParamKey: procedureN.ID,
                    subParamValue: procedureN,
                });
                resolve(procedureN);
            })
            .catch((err) => {
                console.log(err);
                commit(PATIENT_ERROR);
                reject(err);
            });
    }),
    [PATIENT_PROCEDURE_DELETE]: ({
        commit,
        state,
    }, {
        procedureID,
        planID,
        patientID,

    }) => new Promise((resolve, reject) => {
        const paramIndex = state.patient.plans.findIndex(plan => plan.ID === planID);
        console.log(state.patient.plans, planID, procedureID, paramIndex);
        const subParamIndex = state.patient.plans[paramIndex].procedures.findIndex(ID => ID === procedureID);
        return Promise.resolve(
            commit(PATIENT_SUB_PARAM_DELETE, {
                param: 'plans',
                paramIndex,
                subParam: 'procedures',
                subParamIndex,
                subParamID: procedureID,
            }),
        ).then((resp) => {
            commit(PATIENT_SUCCESS);
            resolve(resp);
        }).catch((err) => {
            commit(PATIENT_ERROR);
            console.log(err);
            reject(err);
        });
    }),
    [PATIENT_MANIPULATION_SET]: ({
        commit,
        state,
    }, {
        manipulationParams,
        initiated,

    }) => new Promise((resolve, reject) => Promise.resolve(
        console.log(manipulationParams), commit(PATIENT_SUB_PARAM_PUSH, {
            paramName: 'procedures',
            paramIndex: manipulationParams.procedureID,
            subParamName: 'manipulations',
            subParamIndex: state.patient.procedures[manipulationParams.procedureID] && state.patient.procedures[manipulationParams.procedureID].manipulations ? state.patient.procedures[manipulationParams.procedureID].manipulations.length : 0,
            subParamKey: manipulationParams.ID,
            subParamValue: manipulationParams,
        }),
    ).then((resp) => {
        commit(PATIENT_SUCCESS);
        resolve(true);
    }).catch((err) => {
        commit(PATIENT_ERROR);
        console.log(err);
        reject(err);
    })),
    [PATIENT_PLAN_DELETE]: ({
        commit,
    }, {
        params,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_REQUEST);
        axios.delete(`/patients/${params.patientId}/plans/${params.planID}/`)
            .then((resp) => {
                commit(PATIENT_PARAM_DELETE, {
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

    [PATIENT_PARAM_SET]: ({
        commit,
    }, {
        type,
        value,
    }) => {
        commit(PATIENT_PARAM_SET, {
            type,
            value,
        });
    },
    [PATIENT_PARAMS_SET]: ({
        commit,
        dispatch,
    }, {
        patient,
    }) => {
        Object.keys(patient).forEach((field) => {
            let value = patient[field];
            if (value === null) {
                if (field === 'allergy'
                    || field === 'notes'
                    || field === 'diagnosis'
                    || field === 'anamnesis'
                    || field === 'files'
                    || field === 'plans'
                ) {
                    value = [];
                }
            }
            commit(PATIENT_PARAM_SET, {
                type: field,
                value,
            });
        });
        // ! убрать после выпуска в backend
        commit(PATIENT_PARAM_SET, {
            type: 'plans',
            value: [],
        });
        commit(PATIENT_PARAM_SET, {
            type: 'diagnosis',
            value: [],
        });
        commit(PATIENT_PARAM_SET, {
            type: 'anamnesis',
            value: [],
        });
        dispatch(PATIENTS_PATIENT_UPDATE, {
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
                dispatch(PATIENT_PARAMS_SET, {
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
            commit(PATIENT_PARAM_SET, {
                type: field,
                value,
            });
        });
    },
};
