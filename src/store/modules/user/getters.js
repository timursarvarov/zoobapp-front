export default {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.userName,
    teethSystem: state => state.teethSystem,
    favoriteDiagnosis: state => state.favoriteDiagnosis,
    favoriteAnamnesis: state => state.favoriteAnamnesis,
    favoriteProcedures: state => state.favoriteProcedures,
    procedureDescriptions: state => state.procedureDescriptions,
    diagnoseDescriptions: state => state.diagnoseDescriptions,
    availablePatientsTableColumns: state => state.availablePatientsTableColumns,
};