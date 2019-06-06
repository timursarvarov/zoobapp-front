import axios from 'axios';
import interceptorsSetup from './helpers/interceptors';

interceptorsSetup();
const token = localStorage.getItem('accessToken');
if (token) {
    const AUTH_TOKEN = `Bearer ${token}`;
    axios.defaults.headers.common.Authorization = AUTH_TOKEN;
}
axios.defaults.baseURL = 'https://dental-api.owl.team/v1/';
axios.defaults.headers.common['Content-Type'] = 'application/json;';