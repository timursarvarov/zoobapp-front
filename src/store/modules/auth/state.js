export default {
  accessToken: localStorage.getItem('accessToken') || '',
  status: '',
  hasLoadedOnce: false,
  expiresAt: localStorage.getItem('expiresAt') || '',
  refreshToken: localStorage.getItem('refreshToken') || '',
};
