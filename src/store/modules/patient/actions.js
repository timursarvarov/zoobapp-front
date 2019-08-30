/* eslint-disable indent */
/* eslint-disable max-len */
import axios from 'axios';
import {
    PATIENT_CREATE,
    PATIENT_GET,
    PATIENT_EDIT,
    PATIENT_PARAM_SET,
    PATIENT_PARAMS_SET,
    PATIENT_SUB_PARAM_DELETE,
    PATIENT_AVATAR_UPLOAD,
    PATIENT_UPDATE,
    PATIENT_UNSET,
    PATIENT_NOTE_CREATE,
    PATIENT_ADD_SUB_PROP,
    PATIENT_FILE_DOWNLOAD,
    PATIENT_PLAN_SET,
    PATIENT_PLAN_DELETE,
    PATIENT_PLAN_EDIT,
    PATIENT_PLAN_SWITCH_CURRENT,
    PATIENT_PARAM_DELETE,
    PATIENT_PARAM_PUSH,
    PATIENT_DIAGNOSE_SET,
    PATIENT_DIAGNOSE_UPDATE,
    PATIENT_PROCEDURE_UPDATE,
    PATIENT_PROCEDURE_SET,
    PATIENT_PROCEDURE_DELETE,
    PATIENT_ITEM_VISIBILITY_TOGGLE,
    PATIENT_ITEM_JUST_ADDED_TOGGLE,
    PATIENT_ANAMNES_SET,
    PATIENT_ANAMNES_UPDATE,
    PATIENT_SUB_PARAM_SET,
    PATIENT_SUB_PARAMS_SET,
    PATIENT_SUB_PARAM_PUSH,
    PATIENT_INVOICE_SET,
    PATIENT_MANIPULATION_SET,
    PATIENT_PARAM_REWRITE,
    PATIENT_MANIPULATION_EDIT,
    PATIENT_MANIPULATION_DELETE,
    PATIENT_JAW_UPDATE,
    PATIENTS_PATIENT_UPDATE,
    PATIENTS_PATIENT_ADD,
    TEETH_INITIATION,
} from '@/constants';
import recalculateJaw from '@/plugins/recalculateJaw'

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms)
    });
}

export default {
    [PATIENT_JAW_UPDATE]: ({
        commit,
        rootGetters
    }) => {

        const patientItems = {
            procedures: rootGetters.getPatientCurrentPlanProcedures,
            diagnosis: rootGetters.getPatientDiagnosis,
            ananmnesis: rootGetters.getPatientAnamnesis,
        };
        const jaw = recalculateJaw(rootGetters.jawEthalon, patientItems);
        commit(PATIENT_PARAM_SET, { paramName: 'jaw', paramValue: jaw });
    },
    [PATIENT_ITEM_JUST_ADDED_TOGGLE]: ({
        commit,
    }, {
        params
    }) => {
        delay(5000).then(() => commit(PATIENT_SUB_PARAMS_SET, {...params }));
    },
    [PATIENT_AVATAR_UPLOAD]: ({
        commit,
        state,
        dispatch,
    }, {
        patient,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });

        axios.post(`/patients/${patient.ID}/photo/`,
                patient.fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
            .then((resp) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                commit(PATIENT_PARAM_SET, { paramName: 'avatar', paramValue: resp.data.url });
                dispatch(PATIENT_PARAMS_SET, { patient: state });
                resolve(resp);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),
    [PATIENT_UPDATE]: ({
        commit,
        dispatch,
    }, {
        patient,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
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
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                dispatch(PATIENT_PARAMS_SET, {
                    patient: resp.data,
                });
                resolve(resp);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),
    [PATIENT_NOTE_CREATE]: ({
        commit,
        state,
        dispatch,
    }, {
        note,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.AddNote',
                    params: {
                        patientID: state.ID,
                        note,
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                const { notes } = state;
                notes.unshift(resp.data.result);
                dispatch(PATIENT_PARAM_SET, {
                    paramName: 'notes',
                    paramValue: notes,
                });
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
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
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                resolve(resp);
            })
            .catch((err) => {
                reject(err);
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
            });
    }),
    [PATIENT_ITEM_VISIBILITY_TOGGLE]: ({
        state,
        commit,
    }, {
        params,
    }) => {
        const { itemId, type, planID } = params;
        let itemIndex = -1;
        let planIndex = -1;
        if (planID && type === 'procedures') {
            planIndex = state.patient.plans.findIndex(plan => plan.ID === planID);

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
            paramName: propName,
            paramValue: props,
        });
    },
    [PATIENT_CREATE]: ({
        commit,
        dispatch,
    }, {
        patient,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.Create',
                    params: {
                        firstName: patient.firstName,
                        lastName: patient.lastName,
                        phone: patient.phone,
                        email: patient.email,
                        allergy: patient.allergy,
                        source: patient.source,
                        color: patient.color,
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                dispatch(PATIENTS_PATIENT_ADD, { patient: resp.data.result });
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),
    [PATIENT_EDIT]: ({
        commit,
        state,
    }, {
        params,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.Edit',
                    params: {
                        patientID: state.ID,
                        ...params,
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                Object.keys(params).forEach((key) => {
                    commit(PATIENT_PARAM_SET, { paramName: key, paramValue: resp.data.result[key] });
                });
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),

    [PATIENT_PLAN_SET]: ({
        commit,
        state,
        dispatch,
    }, {
        planName,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.CreatePlan',
                    params: {
                        name: planName,
                        patientID: parseInt(state.ID, 10),
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                commit(PATIENT_PARAM_PUSH, {
                    paramName: 'plans',
                    paramValue: resp.data.result,
                    paramKey: resp.data.result.ID,
                });
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                commit(PATIENT_PARAM_SET, { paramName: 'currentPlan', paramValue: resp.data.result });
                dispatch(PATIENT_PLAN_SWITCH_CURRENT, { planID: resp.data.result.ID });
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),
    [PATIENT_PROCEDURE_SET]: ({
        commit,
        state,
        getters,
        dispatch,
    }, {
        procedure,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.AddProcedure',
                    params: {
                        patientID: state.ID,
                        planID: getters.getCurrentPlanID,
                        catalogProcedureID: procedure.procedureID,
                        teeth: procedure.teeth,
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                const { procedure: procedureN, manipulations } = resp.data.result;
                procedureN.justAdded = true;
                // записали ID процедуру в план
                commit(PATIENT_SUB_PARAM_PUSH, {
                    paramName: 'plans',
                    paramIndex: procedureN.planID,
                    subParamName: 'procedures',
                    subParamIndex: state.plans[procedureN.planID].procedures ? state.plans[procedureN.planID].procedures.length : 0,
                    subParamKey: procedureN.ID,
                    subParamValue: procedureN,
                });
                // добавляем процедуру в массиы процедур
                commit(PATIENT_PARAM_PUSH, {
                    paramName: 'procedures',
                    paramValue: procedureN,
                    paramKey: `${procedureN.ID}`,
                });
                dispatch(PATIENT_ITEM_JUST_ADDED_TOGGLE, {
                        params: {
                            paramName: 'procedures',
                            paramIndex: procedureN.ID,
                            subParamName: 'justAdded',
                            subParamValue: false,
                        }
                    })
                    // записываем дефолтные манипуляции
                if (manipulations) {
                    manipulations.forEach((m) => {
                        commit(PATIENT_PARAM_PUSH, {
                            paramName: 'manipulations',
                            paramValue: {...m, justAdded: true },
                            paramKey: `${m.ID}`,
                        });
                        dispatch(PATIENT_ITEM_JUST_ADDED_TOGGLE, {
                            params: {
                                paramName: 'manipulations',
                                paramIndex: m.ID,
                                subParamName: 'justAdded',
                                subParamValue: false,
                            }
                        })
                    });
                }
                dispatch(PATIENT_JAW_UPDATE);
                resolve(procedureN);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                console.error(err)
                reject(err);
            });
    }),
    [PATIENT_PROCEDURE_DELETE]: ({
        commit,
        state,
        getters,
        dispatch,
    }, {
        procedure,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.DeleteProcedure',
                    params: {
                        patientID: state.ID,
                        procedureID: procedure.ID,
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                // удаляем ассоциированные манипуляции
                if (procedure.manipulations) {
                    procedure.manipulations.forEach(manipulationID => {
                        commit(PATIENT_SUB_PARAM_DELETE, {
                            param: 'procedures',
                            paramIndex: procedure.ID,
                            subParam: 'manipulations',
                            subParamIndex: state.procedures[procedure.ID].manipulations.findIndex(mID => mID === manipulationID),
                            subParamID: manipulationID,
                        });
                    })
                }
                commit(PATIENT_SUB_PARAM_DELETE, {
                    param: 'plans',
                    paramIndex: procedure.planID,
                    subParam: 'procedures',
                    subParamIndex: state.plans[procedure.planID].procedures.findIndex(pID => pID === procedure.ID),
                    subParamID: procedure.ID,
                });
                dispatch(PATIENT_JAW_UPDATE);
                resolve(resp.data);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                console.error(err)
                reject(err);
            });
    }),
    [PATIENT_MANIPULATION_DELETE]: ({
        commit,
        state,
    }, {
        manipulationID,
        procedureID,

    }) => new Promise((resolve, reject) => {
        axios.post('/',
            JSON.stringify({
                jsonrpc: '2.0',
                method: 'Patients.DeleteManipulation',
                params: {
                    patientID: state.ID,
                    manipulationID,
                },
                id: 1,
            })
        ).then((resp) => {
            if (resp.data.error) {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(resp.data.error);
            }
            const manipulationParamsN = {
                ...resp.data.result,
                justAdded: true,
            };
            // e манипуляцию в массив манипуляций
            commit(PATIENT_SUB_PARAM_DELETE, {
                param: 'procedures',
                paramIndex: procedureID,
                subParam: 'manipulations',
                subParamIndex: state.procedures[procedureID].manipulations.findIndex(mID => mID === manipulationID),
                subParamID: manipulationID,
            });
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
            resolve(resp.data.result);
        }).catch((err) => {
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });

            reject(err);
        });
    }),
    [PATIENT_MANIPULATION_SET]: ({
        commit,
        state,
        dispatch,
    }, {
        manipulationParams
    }) => new Promise((resolve, reject) => {
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.AddManipulation',
                    params: {
                        patientID: state.ID,
                        ...manipulationParams,
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                const manipulationParamsN = {
                    ...resp.data.result,
                    justAdded: true,
                };
                // записали манипуляцию в массив манипуляций
                commit(PATIENT_PARAM_PUSH, {
                    paramName: 'manipulations',
                    paramValue: manipulationParamsN,
                    paramKey: `${manipulationParamsN.ID}`,
                });
                let manipulationsIDs = state.procedures[manipulationParams.procedureID].manipulations || [];
                manipulationsIDs.push(manipulationParamsN.ID)
                    // записали ID манипуляции в процедуру
                commit(PATIENT_SUB_PARAM_PUSH, {
                    paramName: 'procedures',
                    paramIndex: manipulationParamsN.procedureID,
                    subParamName: 'manipulations',
                    subParamIndex: state.procedures[manipulationParamsN.procedureID].manipulations ? state.procedures[manipulationParamsN.procedureID].manipulations.length : 0,
                    subParamKey: manipulationParamsN.ID,
                    subParamValue: manipulationParamsN,
                });
                dispatch(PATIENT_ITEM_JUST_ADDED_TOGGLE, {
                    params: {
                        paramName: 'manipulations',
                        paramIndex: manipulationParamsN.ID,
                        subParamName: 'justAdded',
                        subParamValue: false,
                    }
                })
                resolve(manipulationParamsN);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                console.log(err)
                reject(err);
            });
    }),
    [PATIENT_MANIPULATION_EDIT]: ({
        commit,
        state,
        dispatch,
    }, {
        manipulationParams,

    }) => new Promise((resolve, reject) => {
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.EditManipulation',
                    params: {
                        patientID: state.ID,
                        ...manipulationParams,
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                const manipulationParamsN = {
                    ...resp.data.result,
                    justAdded: true,
                };
                // записали манипуляцию в массив манипуляций
                commit(PATIENT_PARAM_PUSH, {
                    paramName: 'manipulations',
                    paramValue: manipulationParamsN,
                    paramKey: `${manipulationParamsN.ID}`,
                });
                dispatch(PATIENT_ITEM_JUST_ADDED_TOGGLE, {
                    params: {
                        paramName: 'manipulations',
                        paramIndex: manipulationParamsN.ID,
                        subParamName: 'justAdded',
                        subParamValue: false,

                    }
                })
                resolve(manipulationParamsN);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),
    [PATIENT_PLAN_DELETE]: ({
        commit,
        state,
        dispatch,
    }, {
        planID,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.DeletePlan',
                    params: {
                        planID: parseInt(planID, 10),
                        patientID: parseInt(state.ID, 10),
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                commit(PATIENT_PARAM_DELETE, { paramName: 'plans', paramIndex: planID });
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),
    [PATIENT_DIAGNOSE_SET]: ({
        commit,
        state,
        dispatch,
    }, {
        diagnose,
    }) => {
        commit(PATIENT_PARAM_PUSH, {
            paramName: 'diagnosis',
            paramKey: state.diagnosis && state.diagnosis.length ? state.diagnosis.length : 0,
            paramValue: diagnose,
        });
        dispatch(PATIENT_ITEM_JUST_ADDED_TOGGLE, {
            params: {
                paramName: 'diagnosis',
                paramIndex: diagnose.ID,
                subParamName: 'justAdded',
                subParamValue: false,

            }
        })
        dispatch(PATIENT_JAW_UPDATE);
    },
    [PATIENT_ANAMNES_SET]: ({
        commit,
        state,
    }, {
        anamnes,
    }) => {
        commit(PATIENT_PARAM_PUSH, {
            paramName: 'anamnesis',
            paramKey: state.anamnesis && state.anamnesis.length ? state.anamnesis.length : 0,
            paramValue: anamnes,
        });
        dispatch(PATIENT_ITEM_JUST_ADDED_TOGGLE, {
            params: {

                paramName: 'anamnesis',
                paramIndex: anamnes.ID,
                subParamName: 'justAdded',
                subParamValue: false,
            }
        });
        dispatch(PATIENT_JAW_UPDATE);
    },
    [PATIENT_SUB_PARAM_SET]: ({
        commit,
    }, {
        params,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_SUB_PARAM_SET, params);
        resolve(true);
    }).catch(err => reject(err)),

    [PATIENT_INVOICE_SET]: ({
        commit,
        state,
    }, {
        invoice,
    }) => new Promise((resolve, reject) => {
        const newInvoice = {
            ...invoice,
            ID: Math.random(),
        };
        commit(PATIENT_PARAM_PUSH, {
                paramName: 'invoices',
                paramKey: state.invoices && state.invoices.length ? state.invoices.length : 0,
                paramValue: newInvoice,
            }),
            resolve(newInvoice);
    }).catch((err) => {
        reject(err);
    }),

    [PATIENT_PLAN_SWITCH_CURRENT]: ({
        commit,
        state,
        dispatch,
    }, {
        planID,
    }) => {
        if (planID) {
            Object.keys(state.plans).forEach(pID => {
                commit(PATIENT_SUB_PARAMS_SET, {
                    paramName: 'plans',
                    paramIndex: pID,
                    subParamName: 'current',
                    subParamValue: parseInt(planID, 10) === parseInt(pID, 10),
                });
            })
        }
        dispatch(PATIENT_JAW_UPDATE);
    },

    [PATIENT_PLAN_EDIT]: ({
        commit,
        state,
    }, {
        planID,
        key,
        value,
    }) => {
        commit(PATIENT_SUB_PARAMS_SET, {
            paramName: 'plans',
            paramIndex: planID,
            subParamName: key,
            subParamValue: value,
        });
    },

    [PATIENT_PROCEDURE_UPDATE]: ({
        commit,
        state,
    }, {
        params,
    }) => {
        const { procedure, planID } = params;
        let procedureIndex = -1;
        let planIndex = -1;
        if (planID) {
            planIndex = state.patient.plans.findIndex(plan => plan.ID === planID);
            if (planIndex > -1) {
                procedureIndex = state.patient.plans[planIndex].procedures.findIndex(item => item.id === procedure.id);
            }
            commit(PATIENT_PARAM_REWRITE, {
                paramName: 'procedures',
                paramIndex: procedure.ID,
                paramValue: procedure,
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
            commit(PATIENT_PARAM_REWRITE, {
                paramName: 'anamnesis',
                paramIndex: dIndex,
                paramValue: diagnose,
            });
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
            commit(PATIENT_PARAM_REWRITE, {
                paramName: 'anamnesis',
                paramIndex: aIndex,
                paramValue: anamnes,
            });
        }
    },

    [PATIENT_PARAM_SET]: ({
        commit,
    }, {
        paramName,
        paramValue,
    }) => {
        commit(PATIENT_PARAM_SET, {
            paramName,
            paramValue,
        });
    },
    [PATIENT_PARAMS_SET]: ({
        commit,
        dispatch,
    }, {
        patient,
    }) => {
        Object.keys(patient).forEach((field) => {
            commit(PATIENT_PARAM_SET, {
                paramName: field,
                paramValue: patient[field],
            });
        });
        // ! убрать после выпуска в backend
        commit(PATIENT_PARAM_SET, { paramName: 'diagnosis', paramValue: null });
        commit(PATIENT_PARAM_SET, { paramName: 'anamnesis', paramValue: null });
        dispatch(PATIENTS_PATIENT_UPDATE, {
            patient,
        });
        dispatch(TEETH_INITIATION, { patient });
    },
    [PATIENT_GET]: ({
        commit,
        dispatch,
    }, {
        patientID,
    }) => new Promise((resolve, reject) => {
        dispatch(PATIENT_UNSET);
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.Get',
                    params: {
                        patientID: parseInt(patientID, 10),
                    },
                    id: 1,
                }))
            .then((resp) => {
                if (resp.data.error) {
                    commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                    reject(resp.data.error);
                }
                const patient = resp.data.result.patients[0];
                dispatch(PATIENT_PARAMS_SET, {
                    patient,
                });
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
                dispatch(PATIENT_JAW_UPDATE);
                resolve(resp.data.result.patients[0]);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),

    [PATIENT_UNSET]: ({
        commit,
        state,
    }) => {
        Object.keys(state).forEach((field) => {
            // let value = null;
            // if (state.patient[field] !== null && Array.isArray(state.patient[field])) {
            //     value = [];
            // }
            commit(PATIENT_PARAM_SET, {
                paramName: field,
                paramValue: null,
            });
        });
    },
};