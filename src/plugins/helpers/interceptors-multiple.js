/* eslint-disable operator-linebreak */
import axios from 'axios';
import store from '@/store';
import {
    AUTH_REFRESH_TOKEN,
    LOADER_STOP,
    LOADER_START,
    NOTIFY,
    SERVER_ERRORS,
    USER_LOGOUT,
} from '@/constants';


// for multiple requests
export default function() {
    // response
    const isAlreadyFetchingAccessToken = false;
    let subscribers = [];

    function onAccessTokenFetched(accessToken) {
        subscribers = subscribers.filter(callback => callback(accessToken));
    }

    function addSubscriber(callback) {
        subscribers.push(callback);
    }


    // request
    // const isRefreshing = false;
    // let failedQueue = [];

    // const issueToken = () => new Promise((resolve, reject) => {
    //     store.dispatch(AUTH_REFRESH_TOKEN).then((result) => {
    //         resolve(result.accessToken);
    //     });
    // });

    // const processQueue = (error, token = null) => {
    //     failedQueue.forEach((prom) => {
    //         if (error) {
    //             prom.reject(error);
    //         } else {
    //             prom.resolve(token);
    //         }
    //     });

    //     failedQueue = [];
    // };

    // let sentRequestToRefresh = false;

    // const requests = [];

    // axios.interceptors.request.use((config) => {
    //     const expiresAt = localStorage.getItem('expiresAt');
    //     const currentTime = Math.floor(Date.now() / 1000);

    //     const originalRequest = config;

    //     const requestData = JSON.parse(originalRequest.data);

    //     if ((expiresAt && currentTime) &&
    //         expiresAt < currentTime &&
    //         requestData.method !== 'Auth.RefreshToken' &&
    //         requestData.method !== 'Auth.Authentication' &&
    //         requestData.method !== 'Auth.Registration'
    //     ) {
    //         sentRequestToRefresh = true;

    //         return issueToken().then((token) => {
    //             sentRequestToRefresh = true;
    //             originalRequest.headers.Authorization = `Bearer ${token}`;

    //             return Promise.resolve(originalRequest);
    //         });
    //     }

    //     return originalRequest;
    // }, error => Promise.reject(error));

    const issueToken = () => new Promise((resolve, reject) => {
        store.dispatch(AUTH_REFRESH_TOKEN).then((result) => {
            resolve(result.accessToken);
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

    axios.interceptors.request.use((config) => {
        store.dispatch(LOADER_START);
        return config;
    });

    axios.interceptors.response.use((response) => {
        store.dispatch(LOADER_STOP);
        if (response.data.error) {
            store.dispatch(NOTIFY, {
                settings: {
                    type: 'warning',
                    status: response.data.error.code ? response.data.error.code : 'No code',
                    message: response.data.error.message ? response.data.error.message : 'No data to show',
                },
            });
            if (response.data.error.code === SERVER_ERRORS.codes.InvalidTokenErrorCode) {
                // store.dispatch(USER_LOGOUT);
            }
        }
        return response;
    }, (error) => {
        const { config, response: { status } } = error;
        if (status) {
            const { refreshToken, hasRefreshTokenError } = store.state.auth;
            const originalRequest = config;
            if (status === 401 && refreshToken && !sentRequestToRefreshToken && !hasRefreshTokenError) {
                // if (status === 401) {
                if (!sentRequestToRefreshToken) {
                    sentRequestToRefreshToken = true;

                    issueToken().then((token) => {
                        sentRequestToRefreshToken = false;

                        onTokenRefreshed(token);
                    });
                }

                const requestPromise = new Promise((resolve) => {
                    collectRequests((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;

                        resolve(axios(originalRequest));
                    });
                });

                console.log(requestPromise);

                return requestPromise;
            }
            store.dispatch(NOTIFY, {
                settings: {
                    type: 'warning',
                    status: error.response.status ? error.response.status : 'Some status',
                    message: error.response.data.error ? error.response.data.error : 'No data to show',
                },
            });

            store.dispatch(LOADER_STOP);
        } else if (error.request) {
            console.log(error);
            store.dispatch(NOTIFY, {
                settings: {
                    type: 'danger',
                    status: error.request,
                    message: 'The request was made but no response was received',
                },
            });
        } else if (error != 'Cancel') {
            store.dispatch(NOTIFY, {
                settings: {
                    type: 'danger',
                    message: 'Something happened in setting up the request that triggered an error',
                },
            });
        }

        store.dispatch(LOADER_STOP);
        return Promise.reject(error);
    });
}