export default {
    getPatient: state => state,
    getPatientAgeCategory: state => state.ageCategory,
    getPatientStatus: state => state.status,
    isPatient: state => !!state.ID,
    getCurrentPlanID: state => {
        if (state.plans) {
            const currentPlan = Object.values(state.plans).find(p => p.current === true);
            if (currentPlan) {
                return currentPlan.ID;
            }
            const aproovedPlan = Object.values(state.plans).find(p => p.state === 1);
            if (aproovedPlan) {
                return aproovedPlan.ID
            };
            const firstPlan = Object.values(state.plans).find((p, i) => i === 0);
            if (firstPlan) {
                return firstPlan.ID
            };
        }
        return null
    },
    getCurrentPlan: (state, rootGetters) => {
        if (state.plans, rootGetters.getCurrentPlanID) {
            return state.plans[rootGetters.getCurrentPlanID];
        }
        return {}
    },
    getPatientDiagnosis: state => state.diagnosis || [],
    getPatientAnamnesis: state => state.anamnesis || [],
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
    getProceduresByIds: (state, rootGetters) => (ids) => {
        const procedures = [];
        if (ids && ids.length > 0 && rootGetters.getCurrentClinicProcedures && state.procedures) {
            ids.forEach((ID) => {
                procedures.push({
                    ...state.procedures[ID],
                });
            });
        }
        procedures.sort((a, b) => new Date(b.created) - new Date(a.created));
        return procedures;
    },
    getManipulationsByProcedureID: state => (pID) => {
        let manipulations = [];
        if (pID && state.manipulations) {
            manipulations = Object.values(state.manipulations).filter(m => m.procedureID === pID);
            if (manipulations.length > 1) {
                manipulations.sort((a, b) => new Date(b.created) - new Date(a.created));
            }
        }
        return manipulations;
    },
    getManipulationsByPlanID: state => (pID) => {
        let manipulations = [];
        if (pID && state.manipulations) {
            manipulations = Object.values(state.manipulations).filter(m => m.planID === pID);
            if (manipulations.length > 1) {
                manipulations.sort((a, b) => new Date(b.created) - new Date(a.created));
            }
        }
        return manipulations;
    },
    getPatientProcedureByID: state => ID => state.procedures && state.procedures[ID] ? state.procedures[ID] : {},
    getPatientAnanmnesisByID: state => ID => state.ananmnesis && state.ananmnesis[ID] ? state.ananmnesis[ID] : {},
    getPatientDiagnosisByID: state => ID => state.diagnosis && state.diagnosis[ID] ? state.diagnosis[ID] : {},
};