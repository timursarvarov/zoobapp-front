export default {
    getPatients: state => state.patients || [],
    getPatientsNum: state => state.patientsNum || 0,
    patientsStatus: state => state.status,
};
