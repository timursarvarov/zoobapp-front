export default {
    isStateAuthenticated: state => !!state.accessToken,
    isLocked: state => !!state.username,
    authStatus: state => state.status,
    fetchStateAccessToken: state => state.accessToken,
    fetchStateRefreshToken: state => state.refreshToken,
    hasRefreshTokenError: state => state.hasRefreshTokenError,
    expiresAt: state => state.expiresAt,
};
