export default {
  getPatient: state => state.patient,
  isPatient: state => !!state.patient.ID,
};
