/* eslint-disable operator-linebreak */
import axios from 'axios';
import store from '@/store';
import { AUTH_REFRESH_TOKEN, LOADER_STOP, LOADER_START, NOTIFY, SERVER_ERRORS, USER_LOGOUT } from '@/constants';

// for multiple requests
export default function() {
    // response
    const issueToken = () =>
        new Promise(resolve => {
            store
                .dispatch(AUTH_REFRESH_TOKEN)
                .then(result => {
                    resolve(result.accessToken);
                })
                .catch(err => {
                    store.dispatch(USER_LOGOUT);
                    throw new Error(err);
                });
        });
    let sentRequestToRefreshToken = false;
    let requests = [];

    function onTokenRefreshed(token) {
        requests.map(cb => cb(token));
        requests = [];
    }

    function collectRequests(request) {
        requests.push(request);
    }

    axios.interceptors.request.use(config => {
        // store.dispatch(LOADER_START);
        return config;
    });

    axios.interceptors.response.use(
        response => {
            // store.dispatch(LOADER_STOP);
            if (response.data.error) {
                store.dispatch(NOTIFY, {
                    settings: {
                        type: 'warning',
                        status: response.data.error.code ? response.data.error.code : 'No code',
                        message: response.data.error.message ? response.data.error.message : 'No data to show'
                    }
                });
                if (response.data.error.code === SERVER_ERRORS.codes.InvalidTokenErrorCode) {
                    store.dispatch(USER_LOGOUT);
                }
            }
            return response;
        },
        error => {
            // store.dispatch(LOADER_STOP);
            const {
                config,
                response: { status }
            } = error;
            if (status) {
                const { refreshToken, hasRefreshTokenError } = store.state.auth;
                const originalRequest = config;
                if (status === 401 && refreshToken && !hasRefreshTokenError) {
                    if (!sentRequestToRefreshToken) {
                        sentRequestToRefreshToken = true;

                        issueToken().then(token => {
                            sentRequestToRefreshToken = false;

                            onTokenRefreshed(token);
                        });
                    }

                    const requestPromise = new Promise(resolve => {
                        collectRequests(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;

                            resolve(axios(originalRequest));
                        });
                    });

                    return requestPromise;
                }
                store.dispatch(NOTIFY, {
                    settings: {
                        type: 'warning',
                        status: error.response.status ? error.response.status : 'Some status',
                        message: error.response.data.error ? error.response.data.error : 'No data to show'
                    }
                });
                store.dispatch(LOADER_STOP);
            } else if (error.request) {
                store.dispatch(NOTIFY, {
                    settings: {
                        type: 'danger',
                        status: error.request,
                        message: 'The request was made but no response was received'
                    }
                });
            } else if (error !== 'Cancel') {
                store.dispatch(NOTIFY, {
                    settings: {
                        type: 'danger',
                        message: 'Something happened in setting up the request that triggered an error'
                    }
                });
            }
            return Promise.reject(error);
        }
    );
}
