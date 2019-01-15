export default {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.userName,
  teethSystem: state => state.teethSystem,
};
