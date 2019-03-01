export default {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.userName,
  teethSystem: state => state.teethSystem,
  favoriteDiagnosis: state => state.favoriteDiagnosis,
  availablePatientsTableColumns: state => state.availablePatientsTableColumns,

};
