/* eslint-disable prettier/prettier */
/* eslint-disable indent */
export default {
    getPatient: state => state,
    ageCategory: state => state.ageCategory,
    getPatientAgeCategory: state => state.ageCategory,
    getPatientStatus: state => state.status,
    isPatient: state => !!state.ID,
    getCurrentPlanID: state => {
        if (state.plans) {
            const currentPlan = Object.values(state.plans).find(
                p => p.current === true
            );
            if (currentPlan) {
                return currentPlan.ID;
            }
            const aproovedPlan = Object.values(state.plans).find(
                p => p.state === 1
            );
            if (aproovedPlan) {
                return aproovedPlan.ID;
            }
            const firstPlan = Object.values(state.plans).find(
                (p, i) => i === 0
            );
            if (firstPlan) {
                return firstPlan.ID;
            }
        }
        return null;
    },
    getCurrentPlan: (state, rootGetters) => {
        if ((state.plans, rootGetters.getCurrentPlanID)) {
            return state.plans[rootGetters.getCurrentPlanID];
        }
        return {};
    },
    getApprovedPlansIDs: state => {
        const plansIDs = [];
        if (state.plans) {
            Object.keys(state.plans).forEach(pID => {
                if (state.plans[pID].state === 1) {
                    plansIDs.push(parseInt(pID, 10));
                }
            });
        }
        return plansIDs;
    },
    getPatientDiagnosis: state => {
        let diagnosis =[];
        if(state.diagnosis){{
            diagnosis = Object.values(state.diagnosis);
        }}
        return diagnosis;

    },
    getPatientAnamnesis: state => {
        let anamnesis =[];
        if(state.anamnesis){{
            anamnesis = Object.values(state.anamnesis);
        }}
        return anamnesis;

    },
    getPatientCurrentPlanProcedures: (state, rootGetters) => {
        let procedures = [];
        const planID = rootGetters.getCurrentPlanID;
        if (planID) {
            const ids = rootGetters.getPatient.plans[planID].procedures;
            if (ids && ids.length > 0) {
                procedures = rootGetters.getProceduresByIds(ids);
            }
        }
        procedures.sort((a, b) => new Date(b.created) - new Date(a.created));
        return procedures;
    },
    getPatientCurrentAndApprovedPlanProcedures: (state, rootGetters) => {
        if (!state.plans) return [];
        const currentPlanID = rootGetters.getCurrentPlanID;
        let allPlanIDs = Object.keys(state.plans).filter(
            planID =>
                state.plans[planID].state === 1 && planID !== currentPlanID
        );
        allPlanIDs.push(currentPlanID);
        let procedures = [];
        let proceduresIds = [];
        if (allPlanIDs && allPlanIDs.length > 0) {
            allPlanIDs.forEach(planID => {
                proceduresIds = proceduresIds.concat(
                    state.plans[planID].procedures
                );
            });
            if (proceduresIds && proceduresIds.length > 0) {
                procedures = rootGetters.getProceduresByIds(proceduresIds);
            }
        }
        return procedures;
    },
    getProceduresByIds: (state, rootGetters) => ids => {
        const procedures = [];
        if (
            ids &&
            ids.length > 0 &&
            rootGetters.getCurrentClinicProcedures &&
            state.procedures
        ) {
            ids.forEach(ID => {
                if (state.procedures[ID]) {
                    procedures.push({
                        ...state.procedures[ID]
                    });
                }
            });
        }
        return procedures;
    },
    getUnbilledProceduresByIds: state => ids => {
        const procedures = [];
        if (ids && ids.length > 0 && state.procedures) {
            ids.forEach(ID => {
                if (state.procedures[ID] && !state.procedures[ID].invoiceID) {
                    procedures.push({
                        ...state.procedures[ID]
                    });
                }
            });
        }
        return procedures;
    },
    getManipulationsByProcedureID: state => pID => {
        let manipulations = [];
        if (pID && state.manipulations) {
            manipulations = Object.values(state.manipulations).filter(
                m => m.procedureID === pID
            );
            if (manipulations.length > 1) {
                manipulations.sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                );
            }
        }
        return manipulations;
    },
    getManipulationsByProcedureIDs: (state, rootGetters) => pIDs => {
        let manipulations = [];
        if (pIDs && pIDs.length > 0) {
            pIDs.forEach(ID => {
                manipulations = manipulations.concat(
                    rootGetters.getManipulationsByProcedureID(ID)
                );
            });
        }
        return manipulations;
    },
    getManipulationsByPlanID: state => pID => {
        let manipulations = [];
        if (pID && state.manipulations) {
            manipulations = Object.values(state.manipulations).filter(
                m => m.planID === pID
            );
            if (manipulations.length > 1) {
                manipulations.sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                );
            }
        }
        return manipulations;
    },
    getUnbilledAndApprovedPlansProcedures: (state, rootGetters) => {
        let procedures = [];
        if(!state.plans)return procedures;
        Object.values(state.plans).forEach(p => {
            // if (p.state === 1 && p.procedures) {
            if (p.state && p.procedures) {
                procedures = [
                    ...procedures,
                    ...rootGetters.getUnbilledProceduresByIds(p.procedures)
                ];
                // const pProcedures = rootGetters.getProceduresByIds(p.procedures);
                // procedures = procedures.concat(pProcedures);
            }
        });
        return procedures;
    },
    getPatientProcedureByID: state => ID =>
        state.procedures && state.procedures[ID] ? state.procedures[ID] : {},
    getPatientAnanmnesisByID: state => ID =>
        state.anamnesis && state.anamnesis[ID] ? state.anamnesis[ID] : {},
    getPatientDiagnosisByID: state => ID =>
        state.diagnosis && state.diagnosis[ID] ? state.diagnosis[ID] : {},
    getInvoicesAll: state =>
        state.invoices ? Object.values(state.invoices) : [],
    getPaymentsAll: state => state.payments || []
};
