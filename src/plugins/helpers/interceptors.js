/* eslint-disable */

import axios from 'axios';
// import { settings } from '../settings';

import store from '@/store';
import { AUTH_REFRESH_TOKEN, LOADER_STOP, LOADER_START, NOTIFY } from '@/store/modules/constants';

export default function (){
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
        return config;
    });

    axios.interceptors.response.use(function (response) {
        store.dispatch(LOADER_STOP);
        return response;
    }, function (error) {
        if(error.response) {
        const refreshToken = store.state.auth.refreshToken;

        const { config, response: { status } } = error;
        const originalRequest = config;
        if (status === 401 && refreshToken ) {
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
                        resolve( axios(originalRequest));
                    });
                });
                store.dispatch(LOADER_STOP);
                return retryOriginalRequest;
            }
            if(error.response.data && error.response.data.message) {
                store.dispatch(NOTIFY, {settings: { status: error.response.status, message :error.response.data.message}});
            }
            store.dispatch(LOADER_STOP);
        } else if (error.request) {
            store.dispatch(NOTIFY, {settings:{ type : 'danger', status: error.request, message : 'The request was made but no response was received'}});
        } else {
            store.dispatch(NOTIFY, {settings: { type : 'danger', message : 'Something happened in setting up the request that triggered an error'}});
        }
        store.dispatch(LOADER_STOP);
        return Promise.reject(error);
    });
}