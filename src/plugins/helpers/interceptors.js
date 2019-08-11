import axios from 'axios';
// import { settings } from '../settings';


import store from '@/store';
import {
    AUTH_REFRESH_TOKEN,
    LOADER_STOP,
    LOADER_START,
    NOTIFY,
} from '@/constants';

export default function() {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                console.log('prom.resolve(token);');
                prom.resolve(token);
            }
        });

        failedQueue = [];
    };

    axios.interceptors.request.use((config) => {
        if (store.state.loader.loaderState) {
            store.dispatch(LOADER_START);
        }

        const expiresAt = localStorage.getItem('expiresAt');
        const currentTime = Math.floor(Date.now() / 1000);
        console.log(expiresAt, currentTime);
        const originalRequest = config;
        if (expiresAt && currentTime && !originalRequest.retry) {
            if (expiresAt && currentTime) {
                // if (expiresAt <= currentTime) {
                if (isRefreshing) {
                    console.log(failedQueue);
                    return new Promise(((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                        console.log('failedQueue.push', failedQueue);
                    })).then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        console.log('axios(originalRequest)');
                        return axios(originalRequest);
                    }).catch(err => err);
                }
                console.log(config);
                originalRequest.retry = true;
                isRefreshing = true;
                store.dispatch(AUTH_REFRESH_TOKEN).then((result) => {
                        localStorage.setItem('accessToken', result.accessToken);
                        localStorage.setItem('expiresAt', result.expiresAt);
                        axios.defaults.headers.common.Authorization = `Bearer ${result.accessToken}`;
                        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
                        processQueue(null, result.accessToken);
                    })
                    .catch((err) => {
                        console.log(err);
                        processQueue(err, null);
                        reject(err);
                    })
                    .then(() => { isRefreshing = false; });
            }
            console.log('originalRequest');
            return originalRequest;

            return Promise.resolve(originalRequest).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });
        }

        return originalRequest;
    });


    axios.interceptors.response.use((response) => {
        store.dispatch(LOADER_STOP);
        if (response.data.error) {
            console.log(response.data.error);
            store.dispatch(NOTIFY, {
                settings: {
                    type: 'warning',
                    status: response.data.error.code ? response.data.error.code : 'No code',
                    message: response.data.error.message ? response.data.error.message : 'No data to show',
                },
            });
        }
        return response;
    }, (error) => {
        console.log(error);
        if (error.code) {
            const { refreshToken, hasRefreshTokenError } = store.state.auth;
            const {
                config,
                response: {
                    status,
                },
            } = error;
            const originalRequest = config;
            // if (status === 401 && refreshToken && !isAlreadyFetchingAccessToken && !hasRefreshTokenError) {
            if (status === 401) {
                if (!isAlreadyFetchingAccessToken) {
                    isAlreadyFetchingAccessToken = false;
                    store.dispatch(AUTH_REFRESH_TOKEN).then((accessToken) => {
                        isAlreadyFetchingAccessToken = true;
                        onAccessTokenFetched(accessToken);
                    });
                }
                const retryOriginalRequest = new Promise((resolve) => {
                    addSubscriber((accessToken) => {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        resolve(axios(originalRequest));
                        store.dispatch(LOADER_STOP);
                    });
                });
                return retryOriginalRequest;
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