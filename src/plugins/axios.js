/* eslint-disable */
// import Vue from 'vue';

// Lib imports
import axios from 'axios';
// import VueAxios from 'vue-axios';
import interceptorsSetup from './helpers/interceptors';
interceptorsSetup();

const AUTH_TOKEN = 'Bearer ' + localStorage.getItem('accessToken');
if (AUTH_TOKEN) {
    axios.defaults.headers.common.Authorization = AUTH_TOKEN;
}


axios.defaults.baseURL = 'https://dental-api.owl.team/v1/';
axios.defaults.headers.common['Content-Type'] = 'application/json;';
// Vue.use(axios, VueAxios);