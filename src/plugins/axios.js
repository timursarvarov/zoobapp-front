import axios from 'axios';
import { BASE_URL } from '@/constants';
import interceptorsSetup from './helpers/interceptors-multiple';

interceptorsSetup();
const token = localStorage.getItem('accessToken');
if (token) {
    const AUTH_TOKEN = `Bearer ${token}`;
    axios.defaults.headers.common.Authorization = AUTH_TOKEN;
}
// axios.defaults.withCredentials = false;
axios.defaults.baseURL = BASE_URL; // 'https://api.zoobapp.com/v1/';
axios.defaults.headers.common['Content-Type'] = 'application/json;';
