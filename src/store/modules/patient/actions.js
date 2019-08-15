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
    PATIENTS_PATIENT_UPDATE,
    PATIENT_ADD_SUB_PROP,
    PATIENT_FILE_DOWNLOAD,
    PATIENT_PLAN_SET,
    PATIENT_PLAN_CURRENT_SET,
    PATIENT_PLAN_DELETE,
    PATIENT_PLAN_EDIT,
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
    PATIENT_SUB_PARAM_SET,
    PATIENT_SUB_PARAMS_SET,
    PATIENT_SUB_PARAM_PUSH,
    PATIENT_INVOICE_SET,
    PATIENTS_PATIENT_ADD,
    PATIENT_MANIPULATION_SET,
    PATIENT_PARAM_REWRITE,
    PATIENT_MANIPULATION_EDIT,
    PATIENT_MANIPULATION_DELETE,
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
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),
    // [PATIENT_PLANS_GET]: ({
    //     commit,
    //     state,
    // }) => new Promise((resolve, reject) => {
    //     commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
    //     axios.post('/',
    //             JSON.stringify({
    //                 jsonrpc: '2.0',
    //                 method: 'Patients.GetPlans',
    //                 params: {
    //                     patientID: parseInt(state.ID, 10),
    //                 },
    //                 id: 1,
    //             }))
    //         .then((resp) => {
    //             if (resp.data.error) {
    //                 commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
    //                 reject(resp.data.error);
    //             }
    //             if (resp.data.result.plans === null) resolve(null);
    //             Object.keys(resp.data.result).forEach((key) => {
    //                 commit(PATIENT_PARAM_SET, {
    //                     paramName: key,
    //                     paramValue: resp.data.result[key],
    //                 });
    //             });
    //             commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
    //             resolve(resp.data.result);
    //         })
    //         .catch((err) => {
    //             commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
    //             reject(err);
    //         });
    // }),
    [PATIENT_PROCEDURE_SET]: ({
        commit,
        state,
    }, {
        procedure,
        planID,
    }) => new Promise((resolve, reject) => {
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.AddProcedure',
                    params: {
                        patientID: state.ID,
                        planID,
                        procedureID: procedure.procedureID,
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
                commit(PATIENT_SUB_PARAMS_SET, {
                    paramName: 'plans',
                    paramIndex: procedureN.planID,
                    subParamName: 'procedures',
                    subParamIndexArray: state.plans[procedureN.planID].procedures ? state.plans[procedureN.planID].procedures.length : 0,
                    subParamsValue: procedureN.ID,
                });
                // добавляем процедуру в массиы процедур
                commit(PATIENT_PARAM_PUSH, {
                    paramName: 'procedures',
                    paramValue: procedureN,
                    paramKey: `${procedureN.ID}`,
                });
                // записываем дефолтные манипуляции
                if (manipulations) {
                    manipulations.forEach((m) => {
                        commit(PATIENT_PARAM_PUSH, {
                            paramName: 'manipulations',
                            paramValue: {...m, justAdded: true },
                            paramKey: `${m.ID}`,
                        });
                    });
                }

                // commit(PATIENT_SUB_PARAM_PUSH, {
                //     paramName: 'plans',
                //     paramIndex: procedureN.planID,
                //     subParamName: 'procedures',
                //     subParamIndex: state.plans[procedureN.planID].procedures ? state.plans[procedureN.planID].procedures.length : 0,
                //     subParamKey: procedureN.ID,
                //     subParamValue: procedureN,
                // });
                // if (resp.data.result.manipulations) {
                //     resp.data.result.manipulations.forEach((m) => {
                //         commit(PATIENT_PARAM_PUSH, { paramName: 'manipulations', paramValue: m });
                //     });
                // }
                resolve(procedureN);
            })
            .catch((err) => {
                console.log(err);
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
                reject(err);
            });
    }),
    [PATIENT_PROCEDURE_DELETE]: ({
        commit,
        state,
    }, {
        procedureID,
        planID,

    }) => new Promise((resolve, reject) => {
        const paramIndex = state.patient.plans.findIndex(plan => plan.ID === planID);
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
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
            resolve(resp);
        }).catch((err) => {
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
            console.log(err);
            reject(err);
        });
    }),
    [PATIENT_MANIPULATION_DELETE]: ({
        commit,
        state,
    }, {
        procedureID,
        manipulationID,
        patientID,

    }) => new Promise((resolve, reject) => {
        const subParamIndex = state.patient.procedures[procedureID].manipulations.findIndex(ID => ID === manipulationID);
        return Promise.resolve(
            commit(PATIENT_SUB_PARAM_DELETE, {
                param: 'procedures',
                paramIndex: procedureID,
                subParam: 'manipulations',
                subParamIndex,
                subParamID: manipulationID,
            }),
        ).then((resp) => {
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
            resolve(resp);
        }).catch((err) => {
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
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

    }) => new Promise((resolve, reject) => {
        const manipulationParamsN = manipulationParams;
        manipulationParamsN.justAdded = true;
        Promise.resolve(
            console.log(manipulationParams), commit(PATIENT_SUB_PARAM_PUSH, {
                paramName: 'procedures',
                paramIndex: manipulationParamsN.procedureID,
                subParamName: 'manipulations',
                subParamIndex: state.patient.procedures[manipulationParamsN.procedureID] && state.patient.procedures[manipulationParamsN.procedureID].manipulations ? state.patient.procedures[manipulationParamsN.procedureID].manipulations.length : 0,
                subParamKey: manipulationParamsN.ID,
                subParamValue: manipulationParamsN,
            }),
        ).then((resp) => {
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
            resolve(manipulationParamsN);
        }).catch((err) => {
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
            console.log(err);
            reject(err);
        });
    }),
    [PATIENT_MANIPULATION_EDIT]: ({
        commit,
        state,
    }, {
        manipulationParams,

    }) => new Promise((resolve, reject) => {
        const manipulationParamsN = manipulationParams;
        manipulationParamsN.justAdded = true;
        Promise.resolve(
            console.log(manipulationParams),
            commit(PATIENT_PARAM_REWRITE, {
                paramName: 'manipulations',
                paramIndex: manipulationParamsN.ID,
                paramValue: manipulationParamsN,
            }),
        ).then((resp) => {
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
            resolve(true);
        }).catch((err) => {
            commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'error' });
            console.log(err);
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
                dispatch(PATIENT_PLAN_CURRENT_SET);
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
    }, {
        diagnose,
    }) => {
        commit(PATIENT_PARAM_PUSH, {
            paramName: 'diagnosis',
            paramKey: state.diagnosis && state.diagnosis.length ? state.diagnosis.length : 0,
            paramValue: diagnose,
        });
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
        console.log(err);
    }),
    [PATIENT_PLAN_CURRENT_SET]: ({
        commit,
        state,
    }, {
        plan,
    }) => new Promise((resolve, reject) => {
        console.log('set plan', plan);
        if (plan) {
            commit(PATIENT_PARAM_SET, { paramName: 'currentPlan', paramValue: plan });
        } else if (state.plans) {
            const currentPlan = Object.values(state.plans).find(planL => planL.state === 1);
            if (!currentPlan) {
                commit(PATIENT_PARAM_SET, { paramName: 'currentPlan', paramValue: Object.values(state.plans)[0] });
            }
            commit(PATIENT_PARAM_SET, { paramName: 'currentPlan', paramValue: currentPlan });
        }
        resolve(plan);
    }).catch((err) => {
        console.log(err);
    }),

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
            commit(PATIENT_PARAM_REWRITE, {
                paramName: 'plans',
                paramIndex: pIndex,
                paramValue: value,
            });
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
        patientId,
    }) => new Promise((resolve, reject) => {
        dispatch(PATIENT_UNSET);
        commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'loading' });
        axios.post('/',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'Patients.Get',
                    params: {
                        patientID: parseInt(patientId, 10),
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
                // initial Set CurrentPlan
                if (patient.plans) {
                    const currentPlan = Object.values(patient.plans).find(plan => plan.state === 1);
                    if (!currentPlan) {
                        dispatch(PATIENT_PLAN_CURRENT_SET, { plan: Object.values(patient.plans)[0] });
                    } else {
                        dispatch(PATIENT_PLAN_CURRENT_SET, { plan: currentPlan });
                    }
                }
                commit(PATIENT_PARAM_SET, { paramName: 'status', paramValue: 'success' });
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