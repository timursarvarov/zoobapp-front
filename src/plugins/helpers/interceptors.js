/* eslint-disable */

import axios from 'axios';
// import { settings } from '../settings';

import store from '@/store';
import {
    AUTH_REFRESH_TOKEN,
    LOADER_STOP,
    LOADER_START,
    NOTIFY
} from '@/store/modules/constants';

export default function () {
    let isAlreadyFetchingAccessToken = false;
    let subscribers = [];

    function onAccessTokenFetched(accessToken) {
        subscribers = subscribers.filter(callback => callback(accessToken));
    }

    function addSubscriber(callback) {
        subscribers.push(callback);
    }
    axios.interceptors.request.use(config => {
        store.dispatch(LOADER_START);
        const expiresAt = store.state.auth.expiresAt;
        const currentTime = Math.floor(Date.now() / 1000);
        if (expiresAt < currentTime && !isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;

            return store.dispatch(AUTH_REFRESH_TOKEN).then(token => {
                config.headers.Authorization = `Bearer ${token}`;
                isAlreadyFetchingAccessToken = false;
                return Promise.resolve(config);
            });

        }
        return config;

    });

    axios.interceptors.response.use(function (response) {
        store.dispatch(LOADER_STOP);
        return response;
    }, function (error) {
        if (error.response) {
            const refreshToken = store.state.auth.refreshToken;
            const hasRefreshTokenError = store.state.auth.hasRefreshTokenError;


            const {
                config,
                response: {
                    status
                }
            } = error;
            const originalRequest = config;
            if (status === 401 && refreshToken && !isAlreadyFetchingAccessToken && !hasRefreshTokenError) {
                if (!isAlreadyFetchingAccessToken) {
                    isAlreadyFetchingAccessToken = true;
                    store.dispatch(AUTH_REFRESH_TOKEN).then((accessToken) => {
                        isAlreadyFetchingAccessToken = false;
                        onAccessTokenFetched(accessToken);
                    });
                }
                const retryOriginalRequest = new Promise((resolve) => {
                    addSubscriber(accessToken => {
                        originalRequest.headers.Authorization = 'Bearer ' + accessToken;
                        resolve(axios(originalRequest));
                        store.dispatch(LOADER_STOP);
                    });
                });
                return retryOriginalRequest;
            } else {
                store.dispatch(NOTIFY, {
                    settings: {
                        status: error.response.status ? error.response.status : 'Some status',
                        message: error.response.data.message ? error.response.data.message : 'No data to show'
                    }
                });
            }
            store.dispatch(LOADER_STOP);
        } else if (error.request) {
            store.dispatch(NOTIFY, {
                settings: {
                    type: 'danger',
                    status: error.request,
                    message: 'The request was made but no response was received'
                }
            });
        } else {
            store.dispatch(NOTIFY, {
                settings: {
                    type: 'danger',
                    message: 'Something happened in setting up the request that triggered an error'
                }
            });
        }
        store.dispatch(LOADER_STOP);
        return Promise.reject(error);
    });
}