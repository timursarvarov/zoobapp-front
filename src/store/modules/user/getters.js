export default {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.userName,
  teethSystem: state => state.teethSystem,
  favoriteDiagnosis: state => state.favoriteDiagnosis,
  diagnoseDescriptions: state => state.diagnoseDescriptions,
  availablePatientsTableColumns: state => state.availablePatientsTableColumns,
};
