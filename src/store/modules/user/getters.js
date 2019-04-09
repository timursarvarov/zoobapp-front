export default {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.userName,
  teethSystem: state => state.teethSystem,
  favoriteDiagnosis: state => state.favoriteDiagnosis,
  favoriteTreatments: state => state.favoriteTreatments,
  treatmentDescriptions: state => state.treatmentDescriptions,
  diagnoseDescriptions: state => state.diagnoseDescriptions,
  availablePatientsTableColumns: state => state.availablePatientsTableColumns,
};
