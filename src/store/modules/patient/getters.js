export default {
    getPatient: state => state.patient,
    getPatientStatus: state => state.status,
    isPatient: state => !!state.patient.ID,
    getProceduresByIds: state => (ids) => {
        const procedures = [];
        if (ids && ids.length > 0) {
            ids.forEach((ID) => {
                procedures.push(state.patient.procedures[ID]);
            });
        }
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        procedures.sort((a, b) => new Date(b.created) - new Date(a.created));
        return procedures;
    },
    getManipulationsByIds: state => (ids) => {
        const manipulations = [];
        if (ids && ids.length > 0) {
            ids.forEach((ID) => {
                manipulations.push(state.patient.manipulations[ID]);
            });
            if (manipulations.length > 1) {
                manipulations.sort((a, b) => new Date(b.created) - new Date(a.created));
            }
            console.log(manipulations);
            return manipulations;
        }
    },
    getProcedureById: state => ID => state.patient.procedures[ID],
};
