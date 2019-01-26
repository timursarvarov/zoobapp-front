export default {
  isAuthenticated: state => !!state.accessToken,
  isLocked: state => !!state.username,
  authStatus: state => state.status,
  fetchAccessToken: state => state.accessToken,
  fetchRefreshToken: state => state.refreshToken,
  hasRefreshTokenError: state => state.hasRefreshTokenError,
  expiresAt: state => state.expiresAt,
};
