export default {
    getPatient: state => state,
    getPatientAgeCategory: state => state.ageCategory,
    getPatientStatus: state => state.status,
    isPatient: state => !!state.ID,
    getProceduresByIds: (state, rootGetters) => (ids) => {
        const procedures = [];
        // if (ids && ids.length > 0 && rootGetters.getCurrentProcedures) {
        //     console.log(rootGetters.getCurrentProcedures);
        //     ids.forEach((ID) => {
        //         console.log(state.procedures[ID].catalogProcedureID);
        //         const { catalogProcedureID } = state.procedures[ID];
        //         procedures.push({
        //             ...state.procedures[ID],
        //             title: rootGetters.getCurrentProcedures[catalogProcedureID].title,
        //         });
        //     });
        // }
        // // Turn your strings into dates, and then subtract them
        // // to get a value that is either negative, positive, or zero.
        // procedures.sort((a, b) => new Date(b.created) - new Date(a.created));
        return procedures;
    },
    getManipulationsByIds: state => (ids) => {
        const manipulations = [];
        if (ids && ids.length > 0) {
            ids.forEach((ID) => {
                manipulations.push(state.manipulations[ID]);
            });
            if (manipulations.length > 1) {
                manipulations.sort((a, b) => new Date(b.created) - new Date(a.created));
            }
            console.log(manipulations);
            return manipulations;
        }
    },
    getProcedureById: state => ID => state.procedures[ID],
};